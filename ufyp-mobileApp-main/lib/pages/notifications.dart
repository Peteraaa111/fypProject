import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/globalVariable.dart';
import 'package:my_app/modal/userNotification.dart';

import '../components/toastMessage.dart';

class NotificationsPage extends StatefulWidget {
  @override
  _NotificationsPageState createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  List<UserNotification> userNotificationList = [];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      getNotificationMessage(context).then((_) {
        setState(() {});
      });
    });
  }

  Future<void> deleteAllNotification() async{
    try{
      final res = await UserApi().deleteAllNotificationMessage(jsonEncode({'userID': AppUser.id}),context);
      if (res["success"]) {
        ToastMessage.show(S.current.clearSuccessNotification);
        setState(() {
          userNotificationList.clear();
        });
      } else {
        ToastMessage.show(S.current.clearFailedNotification);
      }
    }catch (e) {
      print(e);
      ToastMessage.show(S.current.clearFailedNotification);
    }
  }

  Future<void> deleteNotificationByID(String id) async{
    try{
      final res = await UserApi().deleteOneNotificationMessage(jsonEncode({'notificationID': id}),context);
      if (res["success"]) {
        ToastMessage.show(S.current.clearSuccessNotification);
      } else {
        ToastMessage.show(S.current.clearFailedNotification);
      }
    }catch (e) {
      print(e);
      ToastMessage.show(S.current.clearFailedNotification);
    }
  }

  Future<void> getNotificationMessage(BuildContext context) async {
    try {
      userNotificationList.clear();
      final res = await UserApi().getNotificationMessage(jsonEncode({'userID': AppUser.id}),context);
      if (res['success']) {
        if(res['haveData']){
          for(var i = 0; i < res['data'].length; i++){            
            userNotificationList.add(UserNotification.fromJson(res['data'][i]));      
          }
        }
      } 
    } catch (e) {
      ToastMessage.show(S.current.readFail);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        clearAllNotification(),
        Expanded(child: buildListView()),

      ],
    );
  }

  Widget buildListView() {
    return ListView.builder(
      itemCount: userNotificationList.length,
      itemBuilder: (BuildContext context, int index) {
        return buildContainer(index);
      },
    );
  }
  Widget buildContainer(int index) {
    return Container(
      margin: EdgeInsets.only(
        top: index == 0 ? 10.0 : 0.0,
        bottom: index == userNotificationList.length - 1 ? 10.0 : 0.0,
      ),
      child: buildPadding(index),
    );
  }

  Widget buildPadding(int index) {
    return Padding(
      padding: EdgeInsets.only(left: 10.0, right: 10.0, bottom: 2.0),
      child: buildCard(index),
    );
  }

  Row clearAllNotification() {
    return Row(
      children: [
        Expanded(
          child: Column(
            // Add your widgets here
          ),
        ),
        Align(
          alignment: Alignment.centerRight,
          child: Builder(
            builder: (context) => Padding(
              padding: const EdgeInsets.only(top:5,left: 5.0, right: 15.0),
              child: ElevatedButton(
                onPressed: () => deleteAllNotification(),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      S.current.clearAllNotification,
                      style: TextStyle(
                        fontSize: 18,
                        color: Colors.black,
                      ),
                    ),
                  ],
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.grey,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
    

  // Widget buildInkWell(int index) {
  //   return InkWell(
  //     onTap: () {
  //       Navigator.push(
  //         context,
  //         MaterialPageRoute(builder: (context) => SchoolReplySlipDetailPage(replySlip: userNotificationList[index])),
  //       ).then((_) {
  //         setState(() {
  //           userNotificationList[index].readSet = "R";
  //         });
  //       });
  //     },
  //     child: buildCard(index),
  //   );
  // }

  Widget buildCard(int index) {
    return Dismissible(
      key: Key(index.toString()), // Unique key for each card
      direction: DismissDirection.endToStart, // Only allow swiping from left to right
      onDismissed: (direction) {
        deleteNotificationByID(userNotificationList[index].id);
        // Handle the deletion here
      },
      background: Container(
        color: Colors.red, // Red background when swiping
        child: Padding(
          padding: const EdgeInsets.all(15),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.end, // Align delete icon and text to the right
            children: [
              Icon(Icons.delete, color: Colors.white), // Delete icon
              Text(S.current.Delete, style: TextStyle(color: Colors.white)), // Delete text
            ],
          ),
        ),
      ),
      child: Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(15.0), // Add rounded corners
          side: BorderSide(color: Colors.grey[300]!, width: 1.0), // Add a border
        ),
        color: Colors.white, // Change the card color
        elevation: 5, // Add shadow
        margin: EdgeInsets.all(6), // Add some margin
        child: Padding( // Add padding to the child widget
          padding: EdgeInsets.all(3),
          child: buildListTile(index),
        ),
      ),
    );
  }

  Widget buildListTile(int index) {
    return ListTile(
      title: Text(
       GlobalVariable.isChineseLocale ? '${userNotificationList[index].titleTC}' : '${userNotificationList[index].titleEN}',
        style: TextStyle(
          fontSize: 18.0, // Increase the font size
          fontWeight: FontWeight.bold, // Make the text bold
        ),
      ),
      subtitle: Text(
        GlobalVariable.isChineseLocale ? '${userNotificationList[index].contentTC}' : '${userNotificationList[index].contentEN}',
        style: TextStyle(
          fontSize: 16.0, // Increase the font size
        ),
      ),
    );
  }


}
