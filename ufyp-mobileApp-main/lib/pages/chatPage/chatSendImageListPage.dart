import 'dart:io';
import 'package:path/path.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/toastMessage.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';

class DisplayImageListPage extends StatelessWidget {
  final ValueNotifier<List<File>> imageFilesNotifier;
  final String chatRoomID;
  final PageController pageController = PageController();
  final ValueNotifier<int> currentPage = ValueNotifier<int>(0);

  DisplayImageListPage({Key? key, required List<File> imageFiles, required this.chatRoomID}) 
    : imageFilesNotifier = ValueNotifier<List<File>>(imageFiles),
      super(key: key);


  addToMessages(BuildContext context,String type) async {
    try {
        FormData formData = FormData.fromMap({
          'senderID': AppUser.id,
          'classID': AppUser.currentClass,
          'chatRoomID': chatRoomID,
          'type': type,
          //'message': await MultipartFile.fromFile(imageFile.path, filename: basename(imageFile.path)),
        });
      for (var imageFile in imageFilesNotifier.value) {
        formData.files.add(
          MapEntry(
            'message',
            await MultipartFile.fromFile(imageFile.path, filename: basename(imageFile.path)),
          ),
        );
      }
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
    return ValueListenableBuilder<List<File>>(
      valueListenable: imageFilesNotifier,
      builder: (context, imageFiles, child) {
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
          body: Column(
            children:[
              Expanded(
                child: PageView.builder(
                  controller: pageController,
                  itemCount: imageFiles.length,
                  onPageChanged: (index) {
                    currentPage.value = index;
                  },
                  itemBuilder: (context, index) {
                    return Center(child: Image.file(imageFiles[index]));
                  },
                ),
              ),
              ValueListenableBuilder<List<File>>(
                valueListenable: imageFilesNotifier,
                builder: (context, imageFiles, child) {
                  return imageFiles.length > 1 ? Center(
                    child: Container(
                      height: 55,
                      child: ListView.builder(
                        shrinkWrap: true,
                        scrollDirection: Axis.horizontal,
                        itemCount: imageFiles.length,
                        itemBuilder: (context, index) {
                          return GestureDetector(
                            onTap: (){
                              if (currentPage.value == index) {
                                currentPage.value = index == 0 ? 0 : index - 1;
                                Future.microtask(() {
                                  imageFiles.removeAt(index);
                                  imageFilesNotifier.value = List.from(imageFiles);
                                });
                              } else {
                                pageController.jumpToPage(index);
                                currentPage.value = index;
                              }
                            },
                            child: ValueListenableBuilder<int>(
                              valueListenable: currentPage,
                              builder: (context, value, child) {
                                return Padding(
                                  padding: const EdgeInsets.all(2.0),
                                  child: Stack(
                                    alignment: Alignment.center,
                                    children: <Widget>[
                                      Container(
                                        width: 55,
                                        height: 55,
                                        decoration: BoxDecoration(
                                          color: value == index ? const Color(0xff7c94b6) : null,
                                          border: value == index ? Border.all(color: Colors.blue, width: 2) : null,
                                          image: DecorationImage(
                                            colorFilter: value == index ? new ColorFilter.mode(Colors.black.withOpacity(0.5), BlendMode.dstATop): null,
                                            image: FileImage(imageFiles[index]),
                                            fit: BoxFit.cover,
                                          ),
                                        ),
                                      ),
                                      if (value == index) Icon(Icons.delete, color: Colors.white),
                                    ],
                                  ),
                                );
                              },
                            ),
                          );
                        },
                      ),
                    ),
                  ) : Container();
                },
              )
            ],
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
                      onPressed: () async {
                        await addToMessages(context,"Image");
                      },
                    ),
                  )
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}