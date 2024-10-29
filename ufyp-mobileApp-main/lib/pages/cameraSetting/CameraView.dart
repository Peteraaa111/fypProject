import 'dart:async';
import 'dart:io';
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/draw.dart';
import 'package:my_app/components/toastMessage.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:path/path.dart';
import 'package:image/image.dart' as img;
import 'package:image_cropper/image_cropper.dart';
import 'package:path_provider/path_provider.dart';


class CameraViewPage extends StatefulWidget {
  final File imageFile;
  final String chatRoomID;
  const CameraViewPage({Key? key, required this.chatRoomID, required this.imageFile}) : super(key: key);

  @override
  _CameraViewPageState createState() => _CameraViewPageState();
}

class _CameraViewPageState extends State<CameraViewPage> {
  bool _isEditing = false;
  var _signatureKey = GlobalKey<SignatureState>();
  Color _penColor = Colors.red;
  final _globalKey = GlobalKey();
  int lengthTest = 0;
  bool drawReadChange =false; 
  List<File> _editedImages = [];
  bool firstCrop = true;
  late File imageFileCurrent = widget.imageFile;

   Future<void> _cropImage(BuildContext context) async {
    try {
      
      final croppedFile = await ImageCropper().cropImage(
        sourcePath: imageFileCurrent.path,
        compressFormat: ImageCompressFormat.jpg,
        compressQuality: 100,
        maxWidth: MediaQuery.of(context).size.width.toInt(),
        maxHeight: MediaQuery.of(context).size.height.toInt()-150,
        aspectRatioPresets: [
          CropAspectRatioPreset.square,
          CropAspectRatioPreset.ratio3x2,
          CropAspectRatioPreset.original,
          CropAspectRatioPreset.ratio4x3,
          CropAspectRatioPreset.ratio16x9
        ],
        uiSettings: [
          AndroidUiSettings(
              toolbarTitle: 'Cropper',
              toolbarColor: Colors.deepOrange,
              toolbarWidgetColor: Colors.white,
              initAspectRatio: CropAspectRatioPreset.original,
              lockAspectRatio: false
          ),
          IOSUiSettings(
            title: 'Cropper',
          ),
        ],
      );
      if (croppedFile != null) {
        if(firstCrop){
          firstCrop = false;
          final croppedFileBytes = await widget.imageFile.readAsBytes();
          setState(() {
            _editedImages.add(imageFileCurrent);
            imageFileCurrent = File(croppedFile.path);

          });
        }else{
          final croppedFileBytes = await croppedFile.readAsBytes();
          setState(() {
            _editedImages.add(imageFileCurrent);
            imageFileCurrent = File(croppedFile.path);
          });
        }
      }
      
    } catch (e) {
      print('Error: $e');
    }
  }
  
  addToMessages(BuildContext context,String type) async {
    try {
      FormData formData = FormData.fromMap({
        'senderID': AppUser.id,
        'classID': AppUser.currentClass,
        'chatRoomID': widget.chatRoomID,
        'type': type,
        'message':await MultipartFile.fromFile(
            imageFileCurrent.path, 
            filename: basename(imageFileCurrent.path)
        ),
      });
      
      final res = await UserApi().sendFileInChatRoom(formData, context);      

      if (res['success']) {
        Navigator.of(context).pop();
        Navigator.of(context).pop();
      } else {
        ToastMessage.show(S.current.sendMessageFail);
      }
    } catch (e) {
      print(e);
      ToastMessage.show(S.current.sendMessageFail);
    }
  }
  
  Future<File> convertUint8ListToFile(Uint8List data, String fileName) async {
    final directory = await getTemporaryDirectory();
    final fileName = DateTime.now().millisecondsSinceEpoch; // Generate a unique filename based on the current timestamp
    final file = File('${directory.path}/$fileName.png');
    return file.writeAsBytes(data);
  }

  Future<void> _getDrawnImage() async {
    RenderRepaintBoundary boundary = _globalKey.currentContext!.findRenderObject() as RenderRepaintBoundary;
    ui.Image image = await boundary.toImage();
    ByteData? byteData = await image.toByteData(format: ui.ImageByteFormat.png);
    Uint8List pngBytes = byteData!.buffer.asUint8List();

    // Convert Uint8List to File
    File editedImageFile = await convertUint8ListToFile(pngBytes, 'edited_image.png');

    setState(() {
      _editedImages.add(imageFileCurrent);
      imageFileCurrent =  editedImageFile;
    });
  }
  

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      
      appBar: AppBar(
        leading: _isEditing ? 
        TextButton(
          child: Text(
            S.current.finishedEditImage,
            style: TextStyle(color: Colors.white),
          ),
          onPressed: () async {
            if(drawReadChange){
              await _getDrawnImage();
            }
            setState(() {
              _isEditing = false;
              drawReadChange  =false;
              lengthTest=0;
            });
          },
        ) : 
        IconButton(
          icon: Icon(
            Icons.arrow_back,
            color: Colors.white,
          ),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        backgroundColor: Colors.black,
        actions: [
          if (_editedImages.isNotEmpty && !_isEditing) // Check if _editedImage is not null
          IconButton(
            icon: Icon(
              Icons.undo,
              color: Colors.white,
            ),
            onPressed: () {
              setState(() {
                final lastEdit = _editedImages.removeLast();
                imageFileCurrent = lastEdit;
              });
            },
          ),
          if (_isEditing && lengthTest>0 ) // check is the image did edit or not
          IconButton(
            icon: Icon(
              Icons.undo, size: 27,
              color: Colors.white,
            ),
            onPressed: (){
              final signatureState = _signatureKey.currentState;
              if (signatureState != null && signatureState.hasHistory) {
                signatureState.undo();
                setState(() {
                  lengthTest--;
                });
              }
            },
          ),
          if (!_isEditing)
          FloatingActionButton(
            onPressed: () {
              _cropImage(context);
            },
            backgroundColor: ui.Color.fromARGB(255, 0, 0, 0),
            tooltip: 'Crop',
            child: const Icon(
              Icons.crop,
              color: Colors.white,
            ),
          ),
          
          DecoratedBox(
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: _isEditing ? Border.all(
                color: _penColor,
                width: 2.0,
              ) : null,
            ),
            child: IconButton(
              icon: Icon(
                Icons.edit_outlined, size: 27,
                color: Colors.white,
              ),
              onPressed: () {
                setState(() {
                  if(!_isEditing){
                    _isEditing = true;
                  }
                });
              },
            ),
          ),
          if (_isEditing) 
            IconButton(
              icon: Icon(Icons.color_lens, size: 27),
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (BuildContext context) {
                    return AlertDialog(
                      content: SingleChildScrollView(
                        child: ColorPicker(
                          pickerColor: _penColor,
                          onColorChanged: (Color color) {
                            setState(() {
                              _penColor = color;
                            });
                          },
                          pickerAreaHeightPercent: 0.8,
                        ),
                      ),
                      actions: <Widget>[
                        TextButton(
                          child: Text('Select'),
                          onPressed: () {
                            Navigator.of(context).pop();
                          },
                        ),
                      ],
                    );
                  },
                );
              },
            ),
        ],
      ),
      body: Container(
        width: MediaQuery.of(context).size.width,
        height: MediaQuery.of(context).size.height-150,
        child:RepaintBoundary(
          key: _globalKey,
          child: Stack(
            children: [
              Container(
                width: MediaQuery.of(context).size.width,
                height: MediaQuery.of(context).size.height - 150,
                child: Image.file(
                      File(imageFileCurrent.path),
                      fit: BoxFit.cover,
                    ),
              ),
              if (_isEditing)
                Signature(
                  key: _signatureKey,
                  color: _penColor,
                  strokeWidth: 5.0,
                  backgroundPainter: null,
                  onSign: (){
                    final signatureState = _signatureKey.currentState;
                    int CurrentHistroyLength = signatureState!.pointsHistoryLength;
                    setState(() {
                      lengthTest =CurrentHistroyLength;
                      drawReadChange = true;
                    });
                  },
                ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomAppBar(
        color: Colors.transparent,
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: <Widget>[
              _isEditing 
              ? Container(
                  width: 35.0,
                  height: 35.0,
                )
              : Container(
                width: 35.0,
                height: 35.0,
                decoration: BoxDecoration(
                  color: Colors.blue,
                  shape: BoxShape.circle,
                ),
                child: IconButton(
                  splashRadius: 5,
                  icon: Icon(Icons.send, color: Colors.white, size: 20.0),
                  onPressed: () {
                    addToMessages(context,"Image");
                  },
                ),
              )
     
            ],
          ),
        ),
      ),
    );
  }
}
