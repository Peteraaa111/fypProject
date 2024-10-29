import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/globalVariable.dart';
import 'package:my_app/modal/replySlip.dart';
import 'package:my_app/pages/schoolPhotoPage/schoolPhotoSelectActivityPage.dart';
import 'package:my_app/pages/schoolReplySlipPage/schoolReplySlipDetailPage.dart';

import '../../components/toastMessage.dart';

class SchoolReplySlipPage extends StatefulWidget {
  @override
  _SchoolReplySlipState createState() => _SchoolReplySlipState();
}

class _SchoolReplySlipState extends State<SchoolReplySlipPage> {
  List<ReplySlip> replySlipList = [];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      getReplySlipByUser(context).then((_) {
        setState(() {});
      });
    });
  }

  Future<void> getReplySlipByUser(BuildContext context) async {
    try {
      replySlipList.clear();
      final res = await UserApi().getReplySlipByUser(jsonEncode({'studentID': AppUser.id,'classID':AppUser.currentClass}),context);
      if (res['success']) {
        if(res['haveData']){
          for(var i = 0; i < res['data'].length; i++){            
            replySlipList.add(ReplySlip.fromJson(res['data'][i]));      
          }
          replySlipList.sort((a, b) => a.replySlipID.compareTo(b.replySlipID));
        }
      } 
    } catch (e) {
      ToastMessage.show(S.current.readFail);
    }
  }

  @override
  Widget build(BuildContext context) {
    return buildListView();
  }

  Widget buildListView() {
    return ListView.builder(
      itemCount: replySlipList.length,
      itemBuilder: (BuildContext context, int index) {
        return buildContainer(index);
      },
    );
  }
  Widget buildContainer(int index) {
    return Container(
      margin: EdgeInsets.only(
        top: index == 0 ? 10.0 : 0.0,
        bottom: index == replySlipList.length - 1 ? 10.0 : 0.0,
      ),
      child: buildPadding(index),
    );
  }

  Widget buildPadding(int index) {
    return Padding(
      padding: EdgeInsets.only(left: 10.0, right: 10.0, bottom: 2.0),
      child: buildInkWell(index),
    );
  }

  Widget buildInkWell(int index) {
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => SchoolReplySlipDetailPage(replySlip: replySlipList[index])),
        ).then((_) {
          setState(() {
            replySlipList[index].readSet = "R";
          });
        });
      },
      child: buildCard(index),
    );
  }

  Widget buildCard(int index) {
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(15.0), // Add rounded corners
        side: BorderSide(color: Colors.grey[300]!, width: 1.0), // Add a border
      ),
      color: Colors.white, // Change the card color
      elevation: 5, // Add shadow
      margin: EdgeInsets.all(10), // Add some margin
      child: Padding( // Add padding to the child widget
        padding: EdgeInsets.all(10),
        child: buildListTile(index),
      ),
    );
  }

  Widget buildListTile(int index) {
    return ListTile(
      leading: replySlipList[index].read == "NR"
        ? Icon(Icons.new_releases_rounded, color: Colors.red)
        : null, // Replace null with other widget if needed when submit != "NS"
      title: Text(
       GlobalVariable.isChineseLocale ? '${replySlipList[index].titleTC}' : '${replySlipList[index].titleEN}',
        style: TextStyle(
          fontSize: 18.0, // Increase the font size
          fontWeight: FontWeight.bold, // Make the text bold
        ),
      ),
    );
  }
}
