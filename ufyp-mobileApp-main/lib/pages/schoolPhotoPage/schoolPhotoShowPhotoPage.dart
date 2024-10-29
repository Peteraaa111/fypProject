import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:gallery_saver_plus/gallery_saver.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/toastMessage.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/photo.dart';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';

class SchoolPhotoShowPhotoPage extends StatefulWidget {
  final String id;
  final String photoDate;
  SchoolPhotoShowPhotoPage({required Key key, required this.id,required this.photoDate}) : super(key: key);

  @override
  SchoolPhotoShowPhotoPageState createState() => SchoolPhotoShowPhotoPageState();
}

class SchoolPhotoShowPhotoPageState extends State<SchoolPhotoShowPhotoPage> {
    static const double padding = 10.0;
    static const double imageSize = 50.0;
    List<Photo> photoList = [];
    Future<bool> getSchoolPhotoDoc(BuildContext context) async {
    try {
      photoList.clear();
      final res = await UserApi().getSchoolPhotoDoc(jsonEncode({'id': widget.id,'date':widget.photoDate}),context);
      if (res['success']) {
        if(res['haveData']){
          for(var i = 0; i < res['data'].length; i++){
            photoList.add(Photo(
              id: res['data'][i]['id'],
              name: res['data'][i]['name'],
              url: res['data'][i]['url'],
            ));
          }

          photoList.sort((a, b) => a.id.compareTo(b.id));
          return true;
        }
      } 
      return false;
    } catch (e) {
      ToastMessage.show(S.current.readFail);
      return false;
    }
  }

  Future<void> downloadImage(String url) async {
    PermissionStatus status = await Permission.storage.request();
    if (status.isGranted) {
      try {
        GallerySaver.saveImage(url).then((bool? success) {
          ToastMessage.show(
            success! ? S.current.successfullySaveImage : S.current.failSaveImage,
          );
        });
      } catch (e) {
        print(e);
      }
    } else {
      ToastMessage.show(
        S.current.noPermission,
      );
    }
  }
        


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(S.current.schoolPhoto),
        backgroundColor: Colors.grey[500],
      ),
      body: FutureBuilder<bool>(
        future: getSchoolPhotoDoc(context),
        builder: (BuildContext context, AsyncSnapshot<bool> snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else {
            return buildPhotoList();
          }
        },
      ),
    );
  }



  Widget buildPhotoList() {
    return photoList.isEmpty ? buildEmptyMessage() : buildPhotoListView();
  }

  Widget buildPhotoListView() {
    return ListView.builder(
      itemCount: photoList.length,
      itemBuilder: (BuildContext context, int index) {
        return buildPhotoListItem(context, index);
      },
    );
  }

  Widget buildPhotoListItem(BuildContext context, int index) {
    return Container(
      margin: EdgeInsets.only(
        top: index == 0 ? padding : 0.0,
        bottom: index == photoList.length - 1 ? padding : 0.0,
      ),
      child: Padding(
        padding: const EdgeInsets.only(left: padding, right: padding, bottom: 2.0),
        child: InkWell(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => FullScreenImage(photoList: photoList, currentIndex: index),
              ),
            );
          },
          child: buildPhotoCard(context, index),
        ),
      ),
    );
  }

  Widget buildPhotoCard(BuildContext context, int index) {
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(15.0),
        side: const BorderSide(color: Colors.grey, width: 1.0),
      ),
      child: Row(
        children: <Widget>[
          Container(
            width: imageSize,
            height: imageSize,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(15.0),
              child: Image.network(photoList[index].url, fit: BoxFit.cover),
            ),
          ),
          Transform.translate(
            offset: const Offset(0, -10),
            child: Padding(
              padding: const EdgeInsets.only(left: padding),
              child: Text(
                '${photoList[index].name}',
                style: const TextStyle(
                  fontSize: 18.0,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          Spacer(),
          IconButton(
            icon: const Icon(Icons.more_horiz),
            onPressed: () {
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return buildDownloadDialog(context, index);
                },
              );
            },
          ),
        ],
      ),
    );
  }

  Widget buildDownloadDialog(BuildContext context, int index) {
    return AlertDialog(
      title: Text(S.current.download),
      content: Text(S.current.confirmDownload),
      actions: <Widget>[
        TextButton(
          child: Text(S.current.No),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        TextButton(
          child: Text(S.current.Yes),
          onPressed: () {
            downloadImage(photoList[index].url);
            Navigator.of(context).pop();
          },
        ),
      ],
    );
  }

  Widget buildEmptyMessage() {
    return Center(
      child: Text(
        S.current.noPhotoData,
        style: TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 20.0,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }

}

class FullScreenImage extends StatelessWidget {
  final List<Photo> photoList;
  final int currentIndex;
  final PageController pageController;

  FullScreenImage({required this.photoList, required this.currentIndex})
      : pageController = PageController(initialPage: currentIndex);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: Stack(
        children: <Widget>[
          PageView.builder(
            itemCount: photoList.length,
            controller: pageController,
            itemBuilder: (context, index) {
              return Image.network(photoList[index].url);
            },
          ),
          
          Align(
            alignment: Alignment.bottomCenter,
            child: Container(
              height: 60,
              child: ListView.builder(
                shrinkWrap: true,
                scrollDirection: Axis.horizontal,
                itemCount: photoList.length,
                itemBuilder: (context, index) {
                  return GestureDetector(
                    onTap: () => pageController.jumpToPage(index),
                    child: Container(
                      margin: EdgeInsets.symmetric(horizontal: 5),
                      child: Stack(
                        children: <Widget>[
                          // Other widgets go here
                          Align(
                            alignment: Alignment.bottomCenter,
                            child: Container(
                              width: 60,
                              height: 60,
                              
                              child: Image.network(photoList[index].url, fit: BoxFit.cover),
                            ),
                          ),
                        ],
                      )
                     
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}