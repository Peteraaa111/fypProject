import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/CommonTool.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/classTimeTable.dart';
import 'package:my_app/modal/globalVariable.dart';

class TeacherIndexPage extends StatefulWidget {
  @override
  _TeacherIndexPageState createState() => _TeacherIndexPageState();
}

class _TeacherIndexPageState extends State<TeacherIndexPage> {
  String text = GlobalVariable.isChineseLocale ? "班主任" : "Class Teacher";
  String exist = GlobalVariable.isChineseLocale ? "已經上傳" : "Uploaded";
  String NotExist = GlobalVariable.isChineseLocale ? "還未上傳" : "Not upload yet";
  bool dateExistHomework = false;
  ClassTimeTable? timeTable;

  Future<void> checkDateHomeworkExist(BuildContext context) async {
    try {
      final res = await UserApi().checkDateHomeworkExist(jsonEncode({'classID':AppUser.currentClass,'selectedDate':DateFormat('dd-MM-yyyy').format(DateTime.now())}),context);
      if (res['success']) {
        if(res['exist']){
          setState(() {
            dateExistHomework = true;
          });
        }else{
          setState(() {
            dateExistHomework = false;
          });
        }
      } 
    } catch (e) {
      setState(() {
        dateExistHomework = false;
      });
    }
  }

  Future<void> getClassTimeTable(BuildContext context) async {
    final res = await UserApi().getClassTimeTable(jsonEncode({
      'classID': AppUser.currentClass,
    }), context);
    if (res['success']) {
      if(res['haveData']){
        List<dynamic> timeTableData = res['data'];
        timeTable = ClassTimeTable(
          timeTables: timeTableData.map((item) {
            return TimeTable(
              day: item['day'],
              times: Map<String, String>.from(item['times']),
            );
          }).toList(),
        );
      }
    } 
  }


  @override
  void initState() {
    super.initState();
    checkDateHomeworkExist(context);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        buildText("班別","Class"),
        buildCard(AppUser.currentClass+text),
        buildText("班別人數","Number of class student"),
        buildCard('10'),
        buildText("今天功課","Today homework"),
        dateExistHomework ? buildCard(exist) : buildCard(NotExist),
        buildText("課堂時間表","Class Time Table"),
        buildTimeTableFuture()
      ],
    );
  }

  Widget buildText(String tc,String en) {
    String text = GlobalVariable.isChineseLocale ? tc : en;
    return Padding(
      padding: EdgeInsets.only(left: 20.0,top: 5),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Text(
          text,
          style: TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }

  Widget buildCard(String value) {
    return Padding(
      padding: const EdgeInsets.only(top:5.0,left:15.0,right: 15),
      child: Card(
        child: Padding( // Add this
          padding: const EdgeInsets.all(10.0), // And this
          child: Row(  
            mainAxisAlignment: MainAxisAlignment.center, // Center the children
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Text(
                    value,
                    style: TextStyle(fontSize: 20),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget buildTimeTableFuture() {
    return FutureBuilder<void>(
      future: getClassTimeTable(context),
      builder: (BuildContext context, AsyncSnapshot<void> snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        } else {
          if (snapshot.hasError) {
            return Text('Error: ${snapshot.error}');
          } else {
            return  Expanded(
              child: CommonTool.buildTimeTable(timeTable!,20,20)
            );
          }
        }
      },
    );
  }

}