import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/toastMessage.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/globalVariable.dart';

class ParentClassSeatCheck extends StatefulWidget {
  @override
  _ParentClassSeatCheckState createState() => _ParentClassSeatCheckState();
}



class _ParentClassSeatCheckState extends State<ParentClassSeatCheck> {
  int seatIndex = 1;
  Map<int, Offset> seatPositions = {};
  int classNumber =-1;
  
  @override
  void initState() {
    super.initState();
    getStudentClassID(context);
    getClassSeatingTable(context);
  }

  void getStudentClassID(BuildContext context) async {
    try {
      final res = await UserApi().getStudentClassID(jsonEncode({'classID':AppUser.currentClass,'studentID':AppUser.id}), context);
      if(res["success"]){
        setState(() {
          classNumber = res["classNumber"];
        });
      }
    } catch (e) {
      print(e);
      ToastMessage.show(e.toString());
    }
  }

  void getClassSeatingTable(BuildContext context) async {
    try {
      final res = await UserApi().getClassSeatingTable(jsonEncode({'classID':AppUser.currentClass}), context);
      if(res["success"]){
        Map<String, dynamic> classTable = res["classTable"];
        Map<int, Offset> newSeatPositions = {};
        int highestIndex = 1;
        classTable.forEach((key, value) {
          int seatIndex = int.parse(key);
          Offset seatPosition = Offset(value["dx"], value["dy"]);
          newSeatPositions[seatIndex] = seatPosition;
          if (seatIndex > highestIndex) {
            highestIndex = seatIndex;
          }
        });
        setState(() {
          seatPositions = newSeatPositions;
          seatIndex = highestIndex + 1;
        });
      }
    } catch (e) {
      print(e);
      ToastMessage.show(e.toString());
    }
  }


  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [        
        buildText('座位表','Seat Table'),
        Container(
          height: 500, // specify the height
          child: Padding(
            padding: const EdgeInsets.only(left: 5, right: 5),
            child: Container(
              color: Colors.grey[300],
              child: Stack(
                children: [
                  Positioned(
                    top: 5.0,  
                    left: 55.0,  
                    child: buildBlackboard(),
                  ),
                  Positioned(
                    top: 70.0,  
                    left: 10.0,  
                    child: buildTeacherTable(),
                  ),
                  ...seatPositions.entries.map((entry) {
                    return Positioned(
                      left: entry.value.dx,
                      top: entry.value.dy,
                      child: buildSeat(entry.key),
                    );
                  }).toList(),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget buildText(String tc,String en) {
    String text = GlobalVariable.isChineseLocale ? tc : en;
    String seatText = GlobalVariable.isChineseLocale ? "孩子座位顔色" : "Child seat color";
    return Padding(
      padding: EdgeInsets.only(left:5,top: 10,bottom: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Align(
            alignment: Alignment.centerLeft,
            child: Text(
              text,
              style: TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold),
            ),
          ),
          Padding(
            padding: EdgeInsets.only(right: 15),
            child: Align(
              alignment: Alignment.centerRight,
              child: Row(
                children: [
                  Text(
                    seatText,
                    style: TextStyle(fontSize: 16.0, color: Colors.green),
                  )
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }


  Widget buildSeat(int index) {
    return Stack(
      alignment: Alignment.center,
      children: [
        Container(
          width: 50,
          height: 50,
          color: Colors.blue,
          margin: EdgeInsets.all(20.0),
        ),
        Text(
          index.toString(),
          style: TextStyle(
            fontWeight: index == classNumber ? FontWeight.bold : FontWeight.normal,
            color: index == classNumber ? Colors.green : Colors.black,
          ),
        ),
      ],
    );
  }

  Widget buildBlackboard() {
    String text = GlobalVariable.isChineseLocale ? '黑版' : 'Blackboard';
    return Container(
      width: 300,
      height: 50,
      color: Colors.black,
      child: Center(
        child: Text(
          text,
          style: TextStyle(color: Colors.white),
        ),
      ),
    );
  }

  Widget buildTeacherTable() {
    String text = GlobalVariable.isChineseLocale ? '老師桌子' : 'Teacher Table';
    return Container(
      width: 100,
      height: 50,
      color: Colors.brown,
      child: Center(
        child: Text(
          text,
          style: TextStyle(color: Colors.white),
        ),
      ),
    );
  }
}