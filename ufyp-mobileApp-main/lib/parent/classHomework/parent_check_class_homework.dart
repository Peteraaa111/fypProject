import 'dart:convert';

import 'package:date_picker_plus/date_picker_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter_rounded_date_picker/flutter_rounded_date_picker.dart';
import 'package:intl/intl.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/globalVariable.dart';
import 'package:my_app/modal/homework.dart';

import '../../api/api.dart';

class ParentCheckClassHomework extends StatefulWidget {
  @override
  _ParentCheckClassHomeworkState createState() =>
      _ParentCheckClassHomeworkState();
}

class _ParentCheckClassHomeworkState extends State<ParentCheckClassHomework> {
  TextEditingController dateTextField = TextEditingController();
  Homework? homeworkData;
  bool haveData = false;
  Future<bool> getClassHomeworkByUser(BuildContext context) async {
    homeworkData = null;
    try {
      final res = await UserApi().getClassHomeworkByUser(jsonEncode({'date': dateTextField.text,'classID':AppUser.currentClass}), context);
      haveData = true;
      if (res['success']) {
        if(res['haveData']){
          Homework tempHomework = new Homework(
            chinese: res['data']['chi'],
            english: res['data']['eng'],
            mathematics: res['data']['math'],
            generalStudies: res['data']['gs'],
            other: res['data']['other'],
          );

          setState(() {

            homeworkData = tempHomework; // Update homeworkData inside setState
          });

          return true;
        }else{
          setState(() {
            homeworkData = null; // Update homeworkData inside setState
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
            SizedBox(height: 30.0),

            haveData 
            ? (homeworkData == null
              ? buildEmptyHomeworkMessage() 
              : buildHomeworkTable())
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
            S.current.selectedDate,
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget buildEmptyHomeworkMessage() {
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
          controller: dateTextField,
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


  Future<void> buttonClick() async {
    final DateTime lastDate = DateTime(2024, 12, 31); // December 31 of the current year
    final DateTime initialDate = DateTime(2023, 9, 1);

    final DateTime firstDate = DateTime(2023, 1, 1);
    

    final DateTime? picked = await showDatePickerDialog(
      context: context,
      initialDate: DateTime.now(),
      minDate: firstDate,
      maxDate: lastDate,
      currentDate: DateTime.now(),

    );

    if (picked != null) {
      final DateFormat formatter = DateFormat('dd-MM-yyyy');
      final String formatted = formatter.format(picked);
      dateTextField.text = formatted; // set the text here
      // Call getClassHomeworkByUser function
      await getClassHomeworkByUser(context);
    }
  }

  Widget buildHomeworkTable() {
    return Padding(
      padding: const EdgeInsets.only(left:8.0,right: 16.0),
      child: Table(
        border: TableBorder.all(color: Colors.grey),
        columnWidths: {
          0: FractionColumnWidth(.4),
          1: FractionColumnWidth(.6),
        },
        children: [
          buildTableRow(S.current.chineseLabel, homeworkData!.chinese),
          buildTableRow(S.current.englishLabel, homeworkData!.english),
          buildTableRow(S.current.mathLabel, homeworkData!.mathematics),
          buildTableRow(S.current.gsLabel, homeworkData!.generalStudies),
          buildTableRow(S.current.otherLabel, homeworkData!.other),
        ],
      ),
    );
  }

  TableRow buildTableRow(String label, String data) {
    return TableRow(
      children: [
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Text(
            label,
            style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Text(
            data,
            style: TextStyle(fontSize: 16.0),
          ),
        ),
      ],
    );
  }

}