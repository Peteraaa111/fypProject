import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/micCount.dart';
import 'package:my_app/components/toastMessage.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/pages/cameraSetting/CameraScreen.dart';
import 'package:my_app/pages/chatPage/chatSendImageListPage.dart';
import 'package:flutter_sound/flutter_sound.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';

class MessageInputField extends StatefulWidget {
  final TextEditingController textController;
  final Animation<Offset> slideInputAnimation;
  final Animation<double> opacity;
  final AnimationController slideInputController;
  final Function hideTheMic;
  final Function showTheMic;
  final bool isVisible;
  final Function addToMessages;
  final String chatRoomID;

  MessageInputField({
    required this.textController,
    required this.slideInputAnimation,
    required this.opacity,
    required this.slideInputController,
    required this.hideTheMic,
    required this.showTheMic,
    required this.isVisible,
    required this.addToMessages,
    required this.chatRoomID,
  });

  @override
  _MessageInputFieldState createState() => _MessageInputFieldState();
}

class _MessageInputFieldState extends State<MessageInputField> {
  Stopwatch stopwatch = Stopwatch();
  int elapsedSeconds = 0;
  Timer? timer;
  bool isMicHeldDown = false;
  FlutterSoundRecorder? _recorder = FlutterSoundRecorder();
  String? _recordingPath;

  addToMessages(BuildContext context,File audioFile,String type) async {
    try {
      FormData formData = FormData.fromMap({
        'senderID': AppUser.id,
        'classID': AppUser.currentClass,
        'chatRoomID': widget.chatRoomID,
        'type': type,
        'message':await MultipartFile.fromFile(
            audioFile.path, 
            filename: basename(audioFile.path)
        ),
      });
      
      final res = await UserApi().sendAudioFileInChatRoom(formData, context);      

      if (res['success']) { 
        //Navigator.of(context).pop();
      } else {
        ToastMessage.show(S.current.sendMessageFail);
      }
    } catch (e) {
      print(e);
      ToastMessage.show(S.current.sendMessageFail);
    }
  }


  @override
  void initState() {
    super.initState();
    _recorder!.openRecorder().then((value) {
      setState(() {});
    });
  }

  @override
  void dispose() {
    _recorder!.closeRecorder();
    _recorder = null;
    super.dispose();
  }

  void startTimer() {
    stopwatch.start();
    timer = Timer.periodic(Duration(seconds: 1), (Timer t) {
      setState(() {
        elapsedSeconds = stopwatch.elapsed.inSeconds;
      });
    });
  }

  void stopTimer() {
    stopwatch.stop();
    timer?.cancel();
    stopwatch.reset();
    setState(() {
      elapsedSeconds = 0;
      isMicHeldDown = false;
    });
  }

  void showMyModalBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15.0), // Adjust the radius as needed
                ),
                child: Column(
                  children: <Widget>[
                  ListTile(
                    leading: Icon(Icons.camera),
                    title: Text(S.current.camera),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => CameraScreen(chatRoomID: widget.chatRoomID),
                           
                        ),
                      );
                    },
                  ),
                  ListTile(
                    leading: Icon(Icons.photo_library),
                    title: Text(S.current.gallery),
                    onTap: () async {
                      final pickedFiles = await ImagePicker().pickMultiImage();
                      if (pickedFiles != null && pickedFiles.isNotEmpty) {
                        List<File> imageFiles = pickedFiles.map((file) => File(file.path)).toList();
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => DisplayImageListPage(imageFiles: imageFiles,chatRoomID: widget.chatRoomID),
                          ),
                        );
                      }
                    },
                    ),
                  ],
                ),
              ),
              Padding(
                padding: EdgeInsets.only(bottom:8.0), // Adjust the padding as needed
                child: Card(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15.0), // Adjust the radius as needed
                  ),
                  child: ListTile(
                    title: Text(S.current.Cancel, textAlign: TextAlign.center),
                    onTap: () {
                      Navigator.pop(context); // This will close the modal bottom sheet
                    },
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget buildMicIcon() {
    return Container(
      margin: EdgeInsets.only(bottom: 13.0,right: 10), // Adjust the value as needed
      child: MicIcon(isMicHeldDown: isMicHeldDown),
    );
  }

  Widget buildElapsedTimeText() {
    return Container(
      margin: EdgeInsets.only(bottom: 13.0), // Adjust the value as needed
      child: Text( 
        '${elapsedSeconds ~/ 60}:${(elapsedSeconds % 60).toString().padLeft(2, '0')}',
        style: TextStyle(fontSize: 20, color: Colors.grey.shade700),
      ),
    );
  }

  Widget buildIconButton(BuildContext context) {
    return IconButton(
      splashRadius: 20,
      icon: Icon(Icons.add, color: Colors.grey.shade700, size: 28,),
      onPressed: () {
        showMyModalBottomSheet(context);
      },
    );
  }

  Widget buildTextField() {
    return Container(
      margin: EdgeInsets.only(bottom: 5),
      child: TextField(
        controller: widget.textController,
        minLines: 1,
        maxLines: 5,
        cursorColor: Colors.black,
        decoration: InputDecoration(
          isDense: true,
          contentPadding: EdgeInsets.only(right: 16, left: 20, bottom: 10, top: 10),
          hintStyle: TextStyle(fontSize: 14, color: Colors.grey.shade700),
          hintText: S.current.enterMessageHint,
          border: InputBorder.none,
          filled: true,
          fillColor: Colors.grey.shade100,
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(20),
            gapPadding: 0,
            borderSide: BorderSide(color: Colors.grey.shade200),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(20),
            gapPadding: 0,
            borderSide: BorderSide(color: Colors.grey.shade300),
          ),
          
        ),
        onChanged: (value) {
          if (value.length > 0) {
            widget.hideTheMic();
          } else {
            widget.showTheMic();
          }
        },
      ),
    );
  }

  Widget buildMicButton(BuildContext context) {
    return Visibility(
      visible: widget.isVisible,
      child: FadeTransition(
        opacity: widget.opacity,
        child: GestureDetector(
          onLongPressStart: (_) async {
            try {
              setState(() {
                isMicHeldDown = true;
              });
              startTimer();
              PermissionStatus status = await Permission.microphone.request();
              if (status != PermissionStatus.granted){
                throw RecordingPermissionException("Microphone permission not granted");
              }
              Directory dir = await getApplicationDocumentsDirectory();
              _recordingPath = '${dir.path}/my_recording.aac';
              await _recorder!.startRecorder(toFile: _recordingPath);
            } catch (e) {
              print('Error occurred while starting the recording: $e');
            }
          },
          onLongPressEnd: (_) async {
            try {
              if (isMicHeldDown) { 
                stopTimer();
                await _recorder!.stopRecorder();
                addToMessages(context,File(_recordingPath!),'audio');
                print('Recording completed');
              }
            } catch (e) {
              print('Error occurred while stopping the recording: $e');
            }
          },
          onLongPressMoveUpdate: (details) {
            if (details.offsetFromOrigin.dx < -150) { // Change this value to adjust the threshold
              print('left');
              setState(() {
                isMicHeldDown = false; 
              });
              if (_recorder != null && _recorder!.isRecording) {
                stopTimer();
                _recorder?.stopRecorder();
              }
            }
          },
          child: IconButton(
            splashRadius: 20,
            icon: Icon(Icons.mic, color: Colors.grey.shade700,),
            onPressed: () {
              //slideInputController.play();
            },
          ),
        ),
      ),
    );
  }

  

  Widget buildSendButton() {
    return IconButton(
      splashRadius: 20,
      icon: Icon(Icons.send, color: widget.isVisible ? Colors.grey.shade700 : Colors.blue,),
      onPressed: () {
        if (widget.textController.text.length > 0) {
          widget.addToMessages(widget.textController.text,"text");
          widget.textController.clear();
          widget.showTheMic();
        }
      },
    );
  }


  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.bottomCenter,
      child: Card(
        margin: EdgeInsets.zero,
        child: Padding(
          padding: EdgeInsets.only(right: 8, left: 8, bottom: MediaQuery.of(context).viewInsets.bottom > 0 ? 15 : 28, top: 8),
          child: Stack(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Expanded(
                    child: SlideTransition(
                      position: widget.slideInputAnimation,
                      child: Row(
                        children: [
                          isMicHeldDown ? Row(
                            children: [
                              buildMicIcon(),
                              buildElapsedTimeText(),
                            ],
                          ) : buildIconButton(context),
                          isMicHeldDown ? Container(
                            margin: EdgeInsets.only(bottom: 13.0, left: 30.0),
                            child: Text(S.current.slipLeft,style: TextStyle(fontSize: 20, color: Colors.grey.shade700)),
                          )
                          : Expanded(
                            child: buildTextField(),
                          )
                        ],
                      ),
                    ),
                  ),
                  Row(
                    children: [
                      buildMicButton(context),
                      buildSendButton(),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}