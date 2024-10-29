import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/toastMessage.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/homework.dart';
import 'package:my_app/modal/photo.dart';
import 'package:my_app/pages/schoolPhotoPage/schoolPhotoShowPhotoPage.dart';
import 'package:my_app/teacher/classHomework/teacher_class_homework.dart';

class TeacherEditHomeworkPage extends StatefulWidget {

  final Function onUploadComplete;
  final String selectedDate;
  TeacherEditHomeworkPage({required this.onUploadComplete,required this.selectedDate});

  @override
  _TeacherEditHomeworkPageState createState() => _TeacherEditHomeworkPageState();
}

class _TeacherEditHomeworkPageState extends State<TeacherEditHomeworkPage> {
  TextEditingController chineseController = TextEditingController();
  TextEditingController englishController = TextEditingController();
  TextEditingController mathController = TextEditingController();
  TextEditingController generalStudiesController = TextEditingController();
  TextEditingController otherController = TextEditingController();
  File? imageFile;
  Uint8List? imageData;
  Homework? homework;
  Future<void> getTheHomeworkData() async {
    try {
      final res = await UserApi().getTheHomeworkData(jsonEncode({'classID':AppUser.currentClass,'selectedDate': widget.selectedDate}),context);
      
      if (res['success']) {
        List<dynamic> bufferDynamic = res['fileContents']['data'];
        List<int> bufferInt = bufferDynamic.map((e) => e as int).toList();
        imageData = Uint8List.fromList(bufferInt);
        homework = Homework.fromJson(res['data']);
        chineseController.text = homework!.chinese;
        englishController.text = homework!.english;
        mathController.text = homework!.mathematics;
        generalStudiesController.text = homework!.generalStudies;
        otherController.text = homework!.other;
      } 
    } catch (e) {
      ToastMessage.show(S.current.readFail);
    }
  }


  void submit(BuildContext context) async{
    try {
      homework!.chinese = chineseController.text;
      homework!.english = englishController.text;
      homework!.mathematics = mathController.text;
      homework!.generalStudies = generalStudiesController.text;
      homework!.other = otherController.text;
      final res = await UserApi().createHomeworkForClass(jsonEncode({'classID':AppUser.currentClass,'data':homework!.toJson()}), context);
      if(res["success"]){
        Navigator.pop(context);
        if (widget.onUploadComplete != null) {
          widget.onUploadComplete();
        }
        ToastMessage.show(S.current.editHomeworkSuccessful);
      }else{
        ToastMessage.show(S.current.editHomeworkFailed);
      }
    } catch (e) {
      ToastMessage.show(e.toString());
    }
  }


  @override
  void initState() {
    super.initState();
    getTheHomeworkData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(S.current.classHomework),
        backgroundColor: Colors.grey[500],
      ),
      body: FutureBuilder(
        future: getTheHomeworkData(),
        builder: (BuildContext context, AsyncSnapshot<void> snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator()); // Show loading spinner while waiting for getTheHomeworkData to complete
          } else {
            if (snapshot.hasError) {
              return Text('Error: ${snapshot.error}'); // Show error message if there's an error
            } else {
              return SingleChildScrollView(
                child: Column(
                  children: [
                    Padding(
                      padding: EdgeInsets.only(top: 10.0),
                      child: Center(
                        child: Container(
                          height: MediaQuery.of(context).size.height / 2.5,
                          width: MediaQuery.of(context).size.width / 2,
                          child: Image.memory(Uint8List.fromList(imageData!))
                        ),
                      ),
                    ),
                    Padding( // Add this
                      padding: EdgeInsets.only(top: 10.0), // Add this
                      child: Container(
                        // Remove the fixed height
                        child: SingleChildScrollView( // Add this
                          child: buildInputFields(), // Use function to build input fields
                        ),
                      ),
                    ),
                    buildSubmitButton(), // Submit button
                  ],
                ),
              );
            }
          }
        },
      ),
    );
  }

  Widget buildInputFields() {
    return Column(
      children: [
        buildTextFieldRow(S.current.chineseLabel, chineseController),
        buildTextFieldRow(S.current.englishLabel, englishController),
        buildTextFieldRow(S.current.mathLabel, mathController),
        buildTextFieldRow(S.current.gsLabel, generalStudiesController),
        buildTextFieldRow(S.current.otherLabel, otherController),
      ],
    );
  }


  Widget buildTextFieldRow(String label, TextEditingController controller) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16.0, 0, 16.0, 8.0),
      child: Row(
        children: [
          Padding(
            padding: EdgeInsets.only(right: 5.0),
            child: Text(label+": "),
          ),
          Expanded(
            child: TextField(
              controller: controller,
              decoration: InputDecoration(
                contentPadding: EdgeInsets.symmetric(vertical: 10.0, horizontal: 10.0),
                border: OutlineInputBorder(),
                enabledBorder: OutlineInputBorder(),
                focusedBorder: OutlineInputBorder(),
                hintText: label,
                hintStyle: TextStyle(color: Colors.grey),
                fillColor: Colors.white,
                filled: true,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Center buildSubmitButton() {
    return Center(
      child: Builder(
        builder: (context) => Padding(
          padding: const EdgeInsets.only(left: 15.0, right: 17.0,bottom:8),
          child: ElevatedButton(
            onPressed: () => submit(context),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  S.current.editLabel,
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


}