import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/toastMessage.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/globalVariable.dart';

class TeacherMakeSeatingPlan extends StatefulWidget {
  @override
  _TeacherMakeSeatingPlanState createState() => _TeacherMakeSeatingPlanState();
}

class _TeacherMakeSeatingPlanState extends State<TeacherMakeSeatingPlan> {
  int seatIndex = 1;
  Map<int, Offset> seatPositions = {};
  final GlobalKey bottomContainerKey = GlobalKey();


  void submitProblemForm(BuildContext context) async {
    try {
      Map<String, Map<String, double>> jsonEncodableSeatPositions = {};
      seatPositions.forEach((key, value) {
        jsonEncodableSeatPositions[key.toString()] = {'dx': value.dx, 'dy': value.dy};
      });

      final res = await UserApi().submitClassSeatingTable(jsonEncode({'classID':AppUser.currentClass,'classTable':jsonEncodableSeatPositions}), context);
      if(res["success"]){
        
        ToastMessage.show(S.current.submitSeatSuccessfully);  
      }else{
        ToastMessage.show(S.current.submitSeatFailed);
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
  void initState() {
    super.initState();
    getClassSeatingTable(context);
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        buildText('增加座位','Add Seat'),
        Container(
          height: 100, // specify the height
          child: Padding(
            padding: const EdgeInsets.only(left: 5, right: 5),
            child: Container(
              color: Colors.grey[200],
              child: Center(
                child: buildDraggableSeat(seatIndex,false),
              ),
            ),
          ),
        ),
        
        buildText('座位表','Seat Table'),
        Container(
          height: 500, // specify the height
          key: bottomContainerKey,
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
                      child: buildDraggableSeat(entry.key,true),
                    );
                  }).toList(),
                ],
              ),
            ),
          ),
        ),
        buildSubmitButton(),
      ],
    );
  }

  Widget buildDraggableSeat(int index,bool doRemove) {
    return Draggable<int>(
      data: index,
      child: buildSeat(index),
      feedback: buildSeat(index),
      onDragEnd: (details) {
        RenderBox? renderBox = bottomContainerKey.currentContext?.findRenderObject() as RenderBox?;
        if (renderBox != null) {
          var localPosition = renderBox.globalToLocal(details.offset);
          var localSize = renderBox.size;
          if (localPosition.dx >= 0 && localPosition.dx <= localSize.width && localPosition.dy >= 0 && localPosition.dy <= localSize.height) {
            // The widget was dropped inside the bottomContainer
            setState(() {
              seatPositions[index] = localPosition;
              if (index == seatIndex) {
                seatIndex++;
              }
            });
          } else {
            // The widget was dropped outside the bottomContainer

            if(doRemove){
              setState(() {
                seatPositions.remove(index);
                Map<int, Offset> newSeatPositions = {};
                int newSeatIndex = 1;
                seatPositions.forEach((key, value) {
                  newSeatPositions[newSeatIndex] = value;
                  newSeatIndex++;
                });
                seatPositions = newSeatPositions;
                if (seatIndex > 1) {
                  seatIndex--;
                }
              });
            }
          }
        }
      },
    );
  }

  Widget buildText(String tc,String en) {
    String text = GlobalVariable.isChineseLocale ? tc : en;
    return Padding(
      padding: EdgeInsets.only(left:5,top: 5),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Text(
          text,
          style: TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }

  Center buildSubmitButton() {
    return Center(
      child: Builder(
        builder: (context) => Padding(
          padding: const EdgeInsets.only(left: 15.0, right: 17.0,bottom:8,top:8),
          child: ElevatedButton(
            onPressed: () => submitProblemForm(context),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  S.current.Submit,
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
        Text(index.toString()),
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