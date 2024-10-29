import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_rounded_date_picker/flutter_rounded_date_picker.dart';
import 'package:intl/intl.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/toastMessage.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/classAttendanceData.dart';
import 'package:my_app/modal/globalVariable.dart';

class TeacherTakeClassAttendancePage extends StatefulWidget {
  @override
  _TeacherTakeClassAttendancePageState createState() => _TeacherTakeClassAttendancePageState();
}

class _TeacherTakeClassAttendancePageState extends State<TeacherTakeClassAttendancePage> {
  TextEditingController dateTextField = TextEditingController();
  List<classAttendanceData> studentList = [];
  String? dateSelect;
  bool oneTimeFlag = false;
  Future<void> getStudentList() async {
    try {
      studentList.clear();
      final res = await UserApi().getClassmateData(jsonEncode({'classID':AppUser.currentClass}), context);
      if (res['success']) {
        for(var i = 0; i < res['data'].length; i++){
          studentList.add(new classAttendanceData(
            chiName: res['data'][i]['studentChiName'],
            engName: res['data'][i]['studentEngName'],
            studentId: res['data'][i]['studentId'],
            haveChange:false,
            //attendanceRecord: res['data'][i]['attendanceRecord'],
          ));
        }
      } 
    } catch (e) {
      print(e);
      ToastMessage.show(S.current.readFail);
    }
  }

  Future<void> getClassAttendance(String date) async {
    try {
      final res = await UserApi().getClassAttendance(jsonEncode({'classID':AppUser.currentClass,'attendanceDate':date}), context);
      if (res['success']) {
        classAttendanceData.resetData(studentList);
        for (var record in res['data']) {
          for (var student in studentList) {
            if (student.studentId == record['studentNumber']) {
              student.attendanceRecord = record['status'];
              break;
            }
          }
        }
      } 
      setState(() {
        oneTimeFlag = true;
      });
    } catch (e) {
      print(e);
      ToastMessage.show(S.current.readFail);
    }
  }

  @override
  void initState() {
    super.initState();
    getStudentList();
  }

  Future<bool> showConfirmationDialog(BuildContext context) {
    return showDialog<bool>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(S.current.confirmAction),
          content: Text(S.current.submitComfirm),
          actions: <Widget>[
            TextButton(
              child: Text(S.current.Cancel),
              onPressed: () {
                Navigator.of(context).pop(false);
              },
            ),
            TextButton(
              child: Text(S.current.Submit),
              onPressed: () {
                Navigator.of(context).pop(true);
              },
            ),
          ],
        );
      },
    ).then((value) => value ?? false); // Return false if the result is null
  }

  Future<void> submitAttendanceList() async {
    List<classAttendanceData> tempList = [];
    // Loop through the list
    for (var item in studentList) {
      if (item.haveChange) {
        tempList.add(item); 
      }
    }
    if (tempList.isEmpty) {
      ToastMessage.show(S.current.submitAttendanceListFailed);
      return;
    }

    showConfirmationDialog(context).then((confirmed) async {
      if (confirmed) {
        try {
          final res = await UserApi().submitAttendanceList(jsonEncode({
            'data': tempList.map((item) => item.toJson()).toList(),
            'classID': AppUser.currentClass,
            'attendanceDate': dateSelect
          }), context);
          if (res["success"]) {
            ToastMessage.show(S.current.sucessfullyApply);
            classAttendanceData.resetHaveChange(studentList);
          } else {
            ToastMessage.show("Failed");
          }
        } catch (e) {
          print(e);
          ToastMessage.show(e.toString());
        }
      }
    });

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
            if (oneTimeFlag) Expanded(child: buildAttendanceTable()),
            SizedBox(height: 20.0),
            if (oneTimeFlag)
              buildSubmitButton()

          ],
        ),
      ),
    );
  }

  Center buildSubmitButton() {
    return Center(
      child: Builder(
        builder: (context) => Padding(
          padding: const EdgeInsets.only(left: 5.0, right: 17.0,bottom:8),
          child: ElevatedButton(
            onPressed: () => submitAttendanceList(),
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
    final DateTime lastDate = DateTime(GlobalVariable.currentYear+1, 12, 31); // December 31 of the current year
    final DateTime initialDate = DateTime(2023, 9, 1);
    final DateTime firstDate = initialDate.subtract(Duration(days: 1));
    final DateTime? picked = await showRoundedDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: initialDate,
      lastDate: lastDate,
      borderRadius: 16,
    );

    if (picked != null) {
      final DateFormat formatter = DateFormat('yyyy-MM-dd');
      final String formatted = formatter.format(picked);
      dateTextField.text = formatted; // set the text here
      await getClassAttendance(formatted);
      setState(() {
        dateSelect = formatted;
      });
      // Call getClassHomeworkByUser function
      //await getClassHomeworkByUser(context);
    }
  }


  Widget buildAttendanceTable() {
    return Padding(
      padding: const EdgeInsets.only(left:5.0,right: 15.0),
      child: ListView.builder(
        itemCount: studentList.length,
        itemBuilder: (context, index) {
          return Card(
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                children: <Widget>[
                  Expanded(
                    child: Text(GlobalVariable.isChineseLocale ? studentList[index].chiName : studentList[index].engName),
                  ),
                  Expanded(
                    child: buildDropdownCard(5,5,index)
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget buildDropdownCard(double paddingLeftValue, double paddingRightValue, int index) {
    return Card(
      color: Colors.grey[300],
      child: Padding(
        padding: EdgeInsets.only(left: paddingLeftValue, right: paddingRightValue),
        child: DropdownButtonHideUnderline(
          child: DropdownButton<String>(
            value: classAttendanceData.reverseConvertValue(studentList[index].attendanceRecord),
            items: <String>[S.current.SelectValue, S.current.SickLabel, S.current.presentLabel, S.current.AbsentLabel, S.current.LateLabel].map<DropdownMenuItem<String>>((String value) {
              return DropdownMenuItem<String>(
                value: value,
                child: Text(value),
              );
            }).toList(),
            onChanged: (String? newValue) {
              setState(() {
                studentList[index].attendanceRecord = classAttendanceData.convertValue(newValue);
                studentList[index].haveChange = true;
              });
            },
          ),
        ),
      ),
    );
  }


}
