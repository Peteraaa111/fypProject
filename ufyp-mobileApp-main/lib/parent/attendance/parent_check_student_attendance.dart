import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:my_app/components/edit_textfield.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/attendance.dart';
import 'package:my_app/modal/globalVariable.dart';
import 'package:flutter_custom_month_picker/flutter_custom_month_picker.dart';

import '../../api/api.dart';

class ParentCheckStudentAttendance extends StatefulWidget {
  @override
  _ParentCheckStudentAttendanceState createState() =>
      _ParentCheckStudentAttendanceState();
}

class _ParentCheckStudentAttendanceState extends State<ParentCheckStudentAttendance> {
  int month = GlobalVariable.currentMonth, year = GlobalVariable.currentYear;
  TextEditingController _textEditingController = TextEditingController();
  List<Attendance> attendanceList = [];
  bool isAttendanceChecked = false;
  int sickCount = 0;
  int presentCount = 0;
  int lateCount = 0;
  int absentCount = 0;

  Future<bool> getStudentAttendanceBySelectedMonth(BuildContext context,String month,String Year) async {
    sickCount = 0;
    presentCount = 0;
    lateCount = 0;
    absentCount = 0;

    try {
      final res = await UserApi().getStudentAttendanceBySelectedMonth(jsonEncode({'studentId': AppUser.id,'classId':AppUser.currentClass,"year":Year,"month":month}), context);
      isAttendanceChecked = true;
      if (res['success']) {
        if(res['haveData']){
          List<Attendance> tempList = [];
          for (var item in res['data']) {
            Attendance attendance = Attendance.fromMap(item);
            tempList.add(attendance);

            switch (attendance.status) {
              case 'Sick':
                sickCount++;
                break;
              case 'Present':
                presentCount++;
                break;
              case 'Late':
                lateCount++;
                break;
              case 'Absent':
                absentCount++;
                break;
            }

          }
          setState(() {
            attendanceList = tempList; // Update attendanceList inside setState
          });
          return true;
        }else{
          setState(() {
            attendanceList = []; // Update attendanceList inside setState
          });
        }
      } 
    } catch (e) {
      print(e);
    }
    return false;
  }


  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(top: 10.0),
      child: Padding(
        padding: const EdgeInsets.only(left:15.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            buildHeader(),
            SizedBox(height: 10.0),
            buildMonthPicker(),
            SizedBox(height: 10.0),
            isAttendanceChecked && !attendanceList.isEmpty ? buildCounterCards(sickCount, presentCount, lateCount, absentCount) : Container(),
            SizedBox(height: 10.0),
            isAttendanceChecked && !attendanceList.isEmpty ? buildListViewHeader() : Container(),
            SizedBox(height: 10.0),
            isAttendanceChecked 
            ? (attendanceList.isEmpty 
              ? buildEmptyAttendanceMessage() 
              : buildAttendanceList())
            : Container(),
            SizedBox(height: 20.0),
          ],
        ),
      ),
    );
  }

  Widget buildHeader() {
    return Padding(
      padding: const EdgeInsets.only(left: 6.0),
      child: Row(
        children: [
          Text(
            S.current.selectedMonth,
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget buildListViewHeader() {
    return Padding(
      padding: const EdgeInsets.only(left: 6.0),
      child: Row(
        children: [
          Text(
            S.current.AttendanceList,
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }


  Widget buildCounterCards(int sickCount, int presentCount, int lateCount, int absentCount) {
    return Column(
      children: <Widget>[
        Padding(
          padding: const EdgeInsets.only(left: 6.0),
          child:Row(
            children: [
              Text(
                S.current.totalStudentAttendanceRecordLabel,
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold), // Use a custom font
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(right: 15.0),
          child:Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly, // Add some space between the cards
            children: <Widget>[
              buildCard('${S.current.presentLabel}: $presentCount', Colors.greenAccent[700]),
              buildCard('${S.current.AbsentLabel}: $absentCount', Colors.redAccent[400]),
              buildCard('${S.current.SickLabel}: $sickCount', Colors.grey[300]),
              buildCard('${S.current.LateLabel}: $lateCount', Colors.yellowAccent[400]),
            ],
          ),
        ),
      ],
    );
  }


  Widget buildCard(String text, Color? color) {
    return Card(
      color: color,
      shape: RoundedRectangleBorder( // Add a border radius
        borderRadius: BorderRadius.circular(10.0),
      ),
      elevation: 5, // Increase the elevation
      child: Container(
        width: 87, // specify your desired width
        height: 50, // specify your desired height
        alignment: Alignment.center,
        child: Padding( // Add some padding
          padding: const EdgeInsets.all(8.0),
          child: Text(
            text,
          ),
        ),
      ),
    );
  }

  Widget buildEmptyAttendanceMessage() {
    return Expanded(
      child: Center(
        child: Text(
          S.current.dateSelectedNoData,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 20.0,
          ),
          textAlign: TextAlign.center,
        ),
      ),
    );
  }

  Widget buildMonthPicker() {
    return Padding(
      padding: const EdgeInsets.only(left: 6.0),
      child:Row(
        children: [
          buildMonthTextField(),
          SizedBox(width: 5.0),
          buildMonthPickerButton(),
        ],
      ),
    );
  }

  //呢度改過  1/25/2024  如果之後有錯要睇返
  Widget buildMonthTextField() {
    return Flexible(
      child: Container(
        child: TextField(
          onTap: () async {
            buttonClick();
          },
          decoration: InputDecoration(
            contentPadding: EdgeInsets.only(left: 10.0), // Add left padding to the text
            enabledBorder: OutlineInputBorder(
              borderSide: BorderSide(color: Colors.black),
              borderRadius: BorderRadius.circular(10.0),
            ),
            focusedBorder: OutlineInputBorder( // Use OutlineInputBorder instead of UnderlineInputBorder
              borderSide: BorderSide(color: Colors.black),
              borderRadius: BorderRadius.circular(10.0),
            ),
            fillColor: Colors.grey.shade200,
            filled: true,
          ),
          readOnly: true,
          controller: _textEditingController,
        ),
      ),
    );
  }
  
  Widget buildMonthPickerButton() {
    return Padding( // Add some padding
      padding: const EdgeInsets.all(8.0),
      child: Container(
        height: 50.0, // Set the height of the Container
        child: FloatingActionButton(
          onPressed: () {
            buttonClick();
          },
          backgroundColor: Colors.grey, // Change the color
          child: Icon(Icons.calendar_today),
        ),
      ),
    );
  }

  void buttonClick(){
    showMonthPicker(context, onSelected: (month, year) {
        setState(() {
          this.month = month;
          this.year = year;
          String formattedMonth = month.toString().padLeft(2, '0'); // Add leading zero if month is less than 10
          _textEditingController.text = '$formattedMonth/$year';
          getStudentAttendanceBySelectedMonth(context,formattedMonth.toString(),year.toString());
        });
      },
      initialSelectedMonth: month,
      initialSelectedYear: year,
      firstYear: GlobalVariable.currentYear,
      lastYear: GlobalVariable.nextYear,
      selectButtonText: S.current.OK,
      cancelButtonText: S.current.Cancel,
      highlightColor: Colors.grey,
      textColor: Colors.black,
      contentBackgroundColor: Colors.white,
      dialogBackgroundColor: Colors.grey[200]);
  }

  Widget buildAttendanceList() {
    return Expanded(
      child: ListView.builder(
        itemCount: attendanceList.length,
        itemBuilder: (context, index) {
          return Padding(
            padding: const EdgeInsets.only(right: 15),
            child: Card(
              shape: RoundedRectangleBorder( // Add a border radius to your card
                borderRadius: BorderRadius.circular(15.0),
              ),
              elevation: 5, // Increase the elevation
              child: Padding(
                padding: const EdgeInsets.all(15.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      S.current.dateLabel+": "+attendanceList[index].getAttendaceDate(), // Replace with actual property
                      
                    ),
                    
                    Container(
                      padding: EdgeInsets.all(10.0), // Add some padding
                      decoration: BoxDecoration(
                        border: Border.all(color: attendanceList[index].getColor()?? Colors.black), // Add border
                        borderRadius: BorderRadius.circular(15.0), // Add a border radius
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start, // Align texts to the start of the box
                        children: <Widget>[
                          Text(
                            S.current.statusLabel+": ", 
                          ),
                          Text(
                            attendanceList[index].getStatusByCurrentLanguage(),
                            style: TextStyle(
                              color: attendanceList[index].getColor(),
                            ),
                          ),
                        ],
                      ),
                    )
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

}