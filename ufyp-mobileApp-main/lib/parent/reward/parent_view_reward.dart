import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:gallery_saver_plus/gallery_saver.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/toastMessage.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/globalVariable.dart';
import 'package:my_app/modal/reward.dart';
import 'package:permission_handler/permission_handler.dart';

class RewardPage extends StatefulWidget {
  @override
  _RewardPageState createState() => _RewardPageState();
}

class _RewardPageState extends State<RewardPage> {
  List<Reward> rewardList = [];
  Future<bool> getStudentRewardList(BuildContext context) async {
    try {
      rewardList.clear();
      final res = await UserApi().getRewardByID(jsonEncode({'studentID':AppUser.id}),context);
      if (res['success']) {
        if(res['haveData']){
          for(var i = 0; i < res['data'].length; i++){
            rewardList.add(new Reward(
              imageUrl: res['data'][i]['imageUrl'],
              rewardNameTC: res['data'][i]['rewardNameTC'],
              rewardNameEN: res['data'][i]['rewardNameEN'],
            ));
          }
          return true;
        }
      } 
      return false;
    } catch (e) {
      ToastMessage.show(S.current.readRewardFail);
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
  void initState() {
    super.initState();
  }
  
  @override
  Widget build(BuildContext context) {
    return FutureBuilder<bool>(
      future: getStudentRewardList(context),
      builder: (BuildContext context, AsyncSnapshot<bool> snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        } else {
          if (snapshot.data == true) {
            return ListView.builder(
              itemCount: rewardList.length,
              itemBuilder: (BuildContext context, int index) {
                return buildPhotoListItem(context, index);
              },
            );
          } else {
            return Center(child: Text("No rewards found"));
          }
        }
      },
    );
  }

  Widget buildPhotoListView() {
    return ListView.builder(
      itemCount: rewardList.length,
      itemBuilder: (BuildContext context, int index) {
        return buildPhotoListItem(context, index);
      },
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
            downloadImage(rewardList[index].imageUrl);
            Navigator.of(context).pop();
          },
        ),
      ],
    );
  }

  Widget buildPhotoListItem(BuildContext context, int index) {
    return Container(
      margin: EdgeInsets.only(
        top: index == 0 ? 15 : 0.0,
        bottom: index == rewardList.length - 1 ? 15 : 0.0,
      ),
      child: Padding(
        padding: const EdgeInsets.only(left: 15, right: 15, bottom: 2.0),
        child: InkWell(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => FullScreenImage(image: rewardList[index].imageUrl)
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
        borderRadius: BorderRadius.circular(10.0),
        side: const BorderSide(color: Colors.grey, width: 1.0),
      ),
      child: Row(
        children: <Widget>[
          Container(
            width: 50,
            height: 50,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(10.0),
              child: Image.network(rewardList[index].imageUrl, fit: BoxFit.cover),
            ),
          ),
          Transform.translate(
            offset: const Offset(0, -10),
            child: Padding(
              padding: const EdgeInsets.only(left: 15,top:15),
              child: Text(GlobalVariable.isChineseLocale ? rewardList[index].rewardNameTC : rewardList[index].rewardNameEN,
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
}

class FullScreenImage extends StatelessWidget {
  final String image;

  FullScreenImage({required this.image});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      backgroundColor: Colors.black,
      body: Center(
        child: InteractiveViewer(
          child: Image.network(image),
        ),
      ),
    );
  }
}