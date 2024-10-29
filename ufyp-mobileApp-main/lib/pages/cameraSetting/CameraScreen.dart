import 'dart:io';
import 'dart:math';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/pages/cameraSetting/CameraView.dart';
import 'package:my_app/pages/cameraSetting/VideoView.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';

class CameraScreen extends StatefulWidget {
  final String chatRoomID;
  CameraScreen({Key? key, required this.chatRoomID}) : super(key: key);

  @override
  _CameraScreenState createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> {
  bool isPhotoSelected = true;
  bool isVideoSelected = false;
  late CameraController _cameraController;
  late List<CameraDescription> cameras;
  Future<void>? cameraValue;
  bool isRecoring = false;
  bool flash = false;
  bool iscamerafront = true;
  double transform = 0;


  Future<void> initCamera() async {
    var status = await Permission.camera.status;
    if (!status.isGranted) {
      status = await Permission.camera.request();
      if (!status.isGranted) {
        return;
      }
    }

    cameras = await availableCameras();
    _cameraController = CameraController(
      // Get a specific camera from the list of available cameras.
      cameras[0],
      // Define the resolution to use.
      ResolutionPreset.max,
    );

    // Next, initialize the controller. This returns a Future.
    cameraValue = _cameraController?.initialize();
    setState(() {});
  }

  @override
  void initState() {
    super.initState();
    initCamera();
  }

  @override
  void dispose() {
    super.dispose();
    if (_cameraController!.value.isInitialized) {
      _cameraController?.dispose();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        leading:IconButton(
          icon: Icon(
            Icons.arrow_back,
            color: Colors.white,
          ),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
      ),
      body: Stack(
        children: [
          FutureBuilder(
              future: cameraValue,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.done) {
                  return Container(
                      width: MediaQuery.of(context).size.width,
                      height: MediaQuery.of(context).size.height,
                      child: CameraPreview(_cameraController));
                } else {
                  return Center(
                    child: CircularProgressIndicator(),
                  );
                }
              }),
          Positioned(
            bottom: 0.0,
            child: Container(
              color: Colors.black,
              padding: EdgeInsets.only(top: 5, bottom: 5),
              width: MediaQuery.of(context).size.width,
              child: Column(
                children: [
                  isVideoSelected
                    ?
                    Row(
                      mainAxisSize: MainAxisSize.max,
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        Opacity(
                          opacity: 0.0,
                          child: IconButton(
                            icon: Icon(
                              flash ? Icons.flash_on : Icons.flash_off,
                              color: Colors.white,
                              size: 28,
                            ),
                            onPressed: () {
                              setState(() {
                                //flash = !flash;
                              });
                              
                            },
                          ),
                        ),
                        GestureDetector(
                          onLongPress: () async {
                            if (!isPhotoSelected) {
                              await _cameraController.startVideoRecording();
                              setState(() {
                                isRecoring = true;
                              });
                            }
                          },
                          onLongPressUp: () async {
                            if (!isPhotoSelected) {
                              XFile videopath = await _cameraController.stopVideoRecording();
                              setState(() {
                                isRecoring = false;
                              });
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (builder) => VideoViewPage(
                                    chatRoomID: widget.chatRoomID,
                                    path: videopath.path,
                                  )
                                )
                              );
                            }
                          },
                          onTap: () async {
                            // if (!isRecoring) takePhoto(context);
                            if (!isRecoring) {
                              if (isVideoSelected) {
                                await _cameraController.startVideoRecording();
                                setState(() {
                                  isRecoring = true;
                                });
                              } else {
                                takePhoto(context);
                              }
                            } else {
                              XFile videopath = await _cameraController.stopVideoRecording();
                              setState(() {
                                isRecoring = false;
                              });
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (builder) => VideoViewPage(
                                      chatRoomID: widget.chatRoomID,
                                      path: videopath.path,
                                    )
                                )
                              );
                            }
                          },
                          child: isRecoring
                              ? Icon(
                                  Icons.radio_button_on,
                                  color: Colors.red,
                                  size: 80,
                                )
                              : Icon(
                                  Icons.panorama_fish_eye,
                                  color: Colors.white,
                                  size: 70,
                                ),
                        ),
                        IconButton(
                            icon: Transform.rotate(
                              angle: transform,
                              child: Icon(
                                Icons.flip_camera_ios,
                                color: Colors.white,
                                size: 28,
                              ),
                            ),
                            onPressed: () async {
                              setState(() {
                                iscamerafront = !iscamerafront;
                                transform = transform + pi;
                              });
                              int cameraPos = iscamerafront ? 0 : 1;
                              _cameraController = CameraController(
                                  cameras![cameraPos], ResolutionPreset.high);
                              cameraValue = _cameraController.initialize();
                            }),
                      ],
                    )
                    :
                    Row(
                      mainAxisSize: MainAxisSize.max,
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        IconButton(
                            icon: Icon(
                              flash ? Icons.flash_on : Icons.flash_off,
                              color: Colors.white,
                              size: 28,
                            ),
                            onPressed: () {
                              setState(() {
                                flash = !flash;
                              });
                              flash
                                  ? _cameraController
                                      .setFlashMode(FlashMode.torch)
                                  : _cameraController.setFlashMode(FlashMode.off);
                            }),
                        GestureDetector(
                          onLongPress: () async {
                            await _cameraController.startVideoRecording();
                            setState(() {
                              isRecoring = true;
                            });
                          },
                          onLongPressUp: () async {
                            XFile videopath =
                                await _cameraController.stopVideoRecording();
                            setState(() {
                              isRecoring = false;
                            });
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (builder) => VideoViewPage(
                                    chatRoomID: widget.chatRoomID,
                                    path: videopath.path,
                                  )
                              )
                            );
                          },
                          onTap: () {
                            if (!isRecoring) takePhoto(context);
                          },
                          child: isRecoring
                              ? Icon(
                                  Icons.radio_button_on,
                                  color: Colors.red,
                                  size: 80,
                                )
                              : Icon(
                                  Icons.panorama_fish_eye,
                                  color: Colors.white,
                                  size: 70,
                                ),
                        ),
                        IconButton(
                            icon: Transform.rotate(
                              angle: transform,
                              child: Icon(
                                Icons.flip_camera_ios,
                                color: Colors.white,
                                size: 28,
                              ),
                            ),
                            onPressed: () async {
                              setState(() {
                                iscamerafront = !iscamerafront;
                                transform = transform + pi;
                              });
                              int cameraPos = iscamerafront ? 0 : 1;
                              _cameraController = CameraController(
                                  cameras![cameraPos], ResolutionPreset.high);
                              cameraValue = _cameraController.initialize();
                            }),
                      ],
                    ),


                  SizedBox(
                    height: 4,
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      SizedBox(width: 10), // Add some spacing between the buttons
                      TextButton(
                        onPressed: () {
                          setState(() {
                            isVideoSelected = true;
                            isPhotoSelected = false;
                          });
                          // Handle video option here
                        },
                        child: Text(
                          S.current.videoLabel,
                          style: TextStyle(color: isVideoSelected ? Colors.yellow : Colors.white),
                        ),
                      ),
                      TextButton(
                        onPressed: () {
                          setState(() {
                            isPhotoSelected = true;
                            isVideoSelected = false;
                          });
                          // Handle photo option here
                        },
                        child: Text(
                          S.current.imageLabel,
                          style: TextStyle(color: isPhotoSelected ? Colors.yellow : Colors.white),
                        ),
                      ),
                    ],
                  )
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void takePhoto(BuildContext context) async {
    XFile file = await _cameraController.takePicture();
    File filechange = File(file.path);
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (builder) => CameraViewPage(
          chatRoomID: widget.chatRoomID,
          imageFile: filechange,
        )
      )
    );
  }
}
