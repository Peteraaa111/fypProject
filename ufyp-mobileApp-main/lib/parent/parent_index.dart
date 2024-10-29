import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/CommonTool.dart';
import 'package:my_app/components/toastMessage.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/classTimeTable.dart';
import 'package:my_app/modal/parentIndexAttendance.dart';

import '../modal/globalVariable.dart';

class ParentIndexPage extends StatefulWidget {
  @override
  _ParentIndexPageState createState() => _ParentIndexPageState();
}

class _ParentIndexPageState extends State<ParentIndexPage> {
  IndexAttendance? attendance;
  Uint8List? imageData;
  ClassTimeTable? timeTable;


        //   List<dynamic> bufferDynamic = res['fileContents']['data'];
        // List<int> bufferInt = bufferDynamic.map((e) => e as int).toList();
        // imageData = Uint8List.fromList(bufferInt);

  Future<bool> getTodayAttendance(BuildContext context) async {
    final res = await UserApi().getTodayAttendance(jsonEncode({
      'studentId': AppUser.id,
      'classID': AppUser.currentClass,
      'date': DateFormat('yyyy-MM-dd').format(DateTime.now()),
    }), context);
    if (res['success']) {
      if(res['haveData']){
        attendance = IndexAttendance(
        // status: res['data']['status'],
          takeAttendanceTime: res['data']['takeAttendanceTime'],
        );
        return true;
      }
    } 
    return false;
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
  Widget build(BuildContext context) {
    return Column(
      children: [
        buildText('出席記錄','Attendance record'),
        buildAttendanceStatus(),
        buildText('課堂時間表','Class Time Table'),
        buildTimeTableFuture(),
      ],
    );
  }

  @override
  void initState() {
    super.initState();
    getClassTimeTable(context);
  }

  Widget buildText(String tc, String en) {
    String text = GlobalVariable.isChineseLocale ? tc : en;
    return Padding(
      padding: EdgeInsets.only(left: 11.0,top: 5),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Text(
          text,
          style: TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }


  Widget buildAttendanceStatus() {
    return FutureBuilder<bool>(
      future: getTodayAttendance(context),
      builder: (BuildContext context, AsyncSnapshot<bool> snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator()); // Show loading spinner while waiting for getTodayAttendance to complete
        } else {
          if (snapshot.hasError) {
            print(snapshot.error);
            return Text('Error: ${snapshot.error}'); // Show error message if there's an error
          } else {
            if (snapshot.data != null) {
              return buildCard(); 
            } else {
              return Text('No data'); // Handle the case when snapshot.data is null
            }
          }

        }
      },
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
              child: CommonTool.buildTimeTable(timeTable!,12,12)
            );
          }
        }
      },
    );
  }


  Widget buildCard() {
    String formattedDate = DateFormat('dd-MM-yyyy').format(DateTime.now());
    return Padding(
      padding: const EdgeInsets.only(left:8.0,right: 8),
      child: Card(
        child: Row(  
          mainAxisAlignment: MainAxisAlignment.center, // Center the children
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(
                  IndexAttendance.getWord(),
                  style: TextStyle(fontSize: 20),
                ),
                Text(
                  formattedDate,
                  style: TextStyle(fontSize: 20),
                ),
                Text(
                  S.current.attendanceTime,
                  style: TextStyle(fontSize: 20),
                ),
                Text(
                  attendance != null ? attendance!.getTakeAttendanceTimeOnly() : S.current.attendanceNotTake,
                  style: TextStyle(
                    fontSize: 20,
                    color: attendance != null ? attendance!.getTimeColor() : Colors.black, // Replace Colors.black with your default color
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

