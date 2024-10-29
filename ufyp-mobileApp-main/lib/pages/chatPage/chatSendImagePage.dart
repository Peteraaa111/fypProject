import 'dart:io';
import 'package:path/path.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/toastMessage.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';

class DisplayImagePage extends StatelessWidget {
  final File imageFile;
  final String chatRoomID;

  DisplayImagePage({Key? key, required this.imageFile, required this.chatRoomID}) : super(key: key);

  addToMessages(BuildContext context,String type) async {
    try {

      FormData formData = FormData.fromMap({
        'senderID': AppUser.id,
        'classID': AppUser.currentClass,
        'chatRoomID': chatRoomID,
        'type': type,
        'message': await MultipartFile.fromFile(imageFile.path, filename: basename(imageFile.path)),
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar( 
        backgroundColor: Colors.transparent,
        leading: Transform.scale(
          scale: 0.7,
          child: Container(
            decoration: BoxDecoration(
              color: Colors.grey[700],
              shape: BoxShape.circle,
            ),
            child: IconButton(
              icon: Icon(Icons.close, color: Colors.white),
              onPressed: () => Navigator.of(context).pop(),
            ),
          ),
        ),
      ),
      body: Center(
        child: Image.file(imageFile),
      ),
      bottomNavigationBar: BottomAppBar(
        color: Colors.transparent,
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: <Widget>[
              Container(
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