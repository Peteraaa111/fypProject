import 'dart:convert';
import 'dart:io';

import 'package:date_picker_plus/date_picker_plus.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_rounded_date_picker/flutter_rounded_date_picker.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/toastMessage.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/globalVariable.dart';
import 'package:my_app/modal/homework.dart';
import 'package:my_app/teacher/classHomework/teacher_class_editHomework.dart';
import 'package:my_app/teacher/classHomework/teacher_class_uploadConfirm.dart';
import 'package:path/path.dart';

class TeacherAddHomeworkPage extends StatefulWidget {
  @override
  _TeacherAddHomeworkPageState createState() => _TeacherAddHomeworkPageState();
}

class _TeacherAddHomeworkPageState extends State<TeacherAddHomeworkPage> {
  String? dateSelect;
  Homework? homeworkData;
  bool dateExistHomework = false;
  TextEditingController dateTextField = TextEditingController();

  Future<void> uploadImage(BuildContext context, File imageFile) async {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return FutureBuilder(
          future: _uploadImage(context, imageFile),
          builder: (BuildContext context, AsyncSnapshot snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return AlertDialog(
                content: Row(
                  children: [
                    CircularProgressIndicator(),
                    Padding(
                      padding: EdgeInsets.only(left: 10),
                      child: Text(S.current.uploading),
                    ),
                  ],
                ),
              );
            } else {
              return Container();
            }
          },
        );
      },
    );
  }

  void clearData() {
    setState(() {
      dateSelect = null;
      homeworkData = null;
      dateTextField.clear();
    });
  }

  Future<void> checkDateHomeworkExist(BuildContext context) async {
    try {
      final res = await UserApi().checkDateHomeworkExist(jsonEncode({'classID':AppUser.currentClass,'selectedDate': dateSelect}),context);
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
      ToastMessage.show(S.current.readFail);
      setState(() {
        dateExistHomework = false;
      });
    }
  }
  
  Future<void> _uploadImage(BuildContext context, File imageFile) async {
    try {
      FormData formData = FormData.fromMap({
        'classID': AppUser.currentClass,
        'selectedDate': dateSelect,
        // 'image': await MultipartFile.fromFile(imageFile.path, filename: basename(imageFile.path)),
        'image': await MultipartFile.fromFile(imageFile.path, filename: '$dateSelect.png'),
      });
      final res = await UserApi().uploadImageForHomework(formData, context);

      if (res['success']) {
        homeworkData = Homework.fromJson(res['data']);
        Navigator.of(context).pop(); // Close the dialog
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => TeacherUploadConfirmPage(
              imageFile: imageFile, 
              homework: homeworkData!,
              onUploadComplete: () {
                clearData();
                // Reset the state of this page
              },
            ),
          ),
        );
      } else {
        Navigator.of(context).pop();
        ToastMessage.show(S.current.uploadFailed);
      }
    } catch (e) {
      print(e);
      Navigator.of(context).pop();
      ToastMessage.show(S.current.uploadFailed);
    }
  }
  

  void showMyModalBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15.0), // Adjust the radius as needed
                ),
                child: Column(
                  children: <Widget>[
                    ListTile(
                      leading: Icon(Icons.camera),
                      title: Text(S.current.camera),
                      onTap: () async {
                        final pickedFile = await ImagePicker().pickImage(source: ImageSource.camera);
                        if (pickedFile != null) {
                          File imageFile = File(pickedFile.path);
                          Navigator.pop(context);
                          await uploadImage(context,imageFile);
                          // Use imageFile here
                        }
                      },
                    ),
                    ListTile(
                      leading: Icon(Icons.photo_library),
                      title: Text(S.current.gallery),
                      onTap: () async {
                        final pickedFile = await ImagePicker().pickImage(source: ImageSource.gallery);
                        if (pickedFile != null) {
                          File imageFile = File(pickedFile.path);
                          Navigator.pop(context);
                          await uploadImage(context,imageFile);
                        }
                      },
                    ),
                  ],
                ),
              ),
              Padding(
                padding: EdgeInsets.only(bottom:8.0), // Adjust the padding as needed
                child: Card(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15.0), // Adjust the radius as needed
                  ),
                  child: ListTile(
                    title: Text(S.current.Cancel, textAlign: TextAlign.center),
                    onTap: () {
                      Navigator.pop(context); // This will close the modal bottom sheet
                    },
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
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
            buildMonthPicker(context),
            SizedBox(height: 10.0),
            dateExistHomework == false && dateSelect != null 
            ? buildSubmitButton('upload') 
            : dateExistHomework == true && dateSelect != null 
              ? buildSubmitButton('edit') 
              : Container(),
              // Your code here
            
            //dateExistHomework ==false ? buildSubmitButton() : Container(),
          ],
        ),
      ),
    );
  }


  Center buildSubmitButton(String type) {
    return Center(
      child: Builder(
        builder: (context) => Padding(
          padding: const EdgeInsets.only(left: 5.0, right: 17.0,bottom:8),
          child: ElevatedButton(
            onPressed: () {
              if (type == 'edit') {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => TeacherEditHomeworkPage(
                      selectedDate: dateSelect!,
                      onUploadComplete: () {
                        clearData();
                        // Reset the state of this page
                      },
                    ),
                  ),
                );
                // Call your function for 'edit' type here
              } else {
                showMyModalBottomSheet(context);
              }
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  type == 'edit' ? S.current.editHomeworkData : S.current.uploadImage,
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

  Widget buildMonthPicker(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 6.0),
      child:Row(
        children: [
          buildMonthTextField(context),
          SizedBox(width: 5.0),
          buildMonthPickerButton(context),
        ],
      ),
    );
  }

  Widget buildMonthTextField(BuildContext context) {
    return Flexible(
      child: Container(
        child: TextField(
          onTap: () async {
            buttonClick(context);
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
  
  Widget buildMonthPickerButton(BuildContext context) {
    return Padding( // Add some padding
      padding: const EdgeInsets.all(8.0),
      child: Container(
        height: 50.0, // Set the height of the Container
        child: FloatingActionButton(
          onPressed: () {
            buttonClick(context);
          },
          backgroundColor: Colors.grey, // Change the color
          child: Icon(Icons.calendar_today),
        ),
      ),
    );
  }

  Future<void> buttonClick(BuildContext context) async {
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
      print(picked);
      final DateFormat formatter = DateFormat('dd-MM-yyyy');
      final String formatted = formatter.format(picked);
      dateTextField.text = formatted; // set the text here
      setState(() {
        dateSelect = formatted;
        checkDateHomeworkExist(context);
      });
    }
  }

}
