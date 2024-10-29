import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/toastMessage.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/homework.dart';
import 'package:my_app/modal/photo.dart';
import 'package:my_app/pages/schoolPhotoPage/schoolPhotoShowPhotoPage.dart';
import 'package:my_app/teacher/classHomework/teacher_class_homework.dart';

class TeacherUploadConfirmPage extends StatefulWidget {
  final File imageFile;
  final Homework homework;
  final Function onUploadComplete;
  TeacherUploadConfirmPage({required this.imageFile, required this.homework,required this.onUploadComplete});

  @override
  _TeacherUploadConfirmPageState createState() => _TeacherUploadConfirmPageState();
}

class _TeacherUploadConfirmPageState extends State<TeacherUploadConfirmPage> {
  TextEditingController chineseController = TextEditingController();
  TextEditingController englishController = TextEditingController();
  TextEditingController mathController = TextEditingController();
  TextEditingController generalStudiesController = TextEditingController();
  TextEditingController otherController = TextEditingController();



  void submit(BuildContext context) async{
    try {
      widget.homework.chinese = chineseController.text;
      widget.homework.english = englishController.text;
      widget.homework.mathematics = mathController.text;
      widget.homework.generalStudies = generalStudiesController.text;
      widget.homework.other = otherController.text;
      final res = await UserApi().createHomeworkForClass(jsonEncode({'classID':AppUser.currentClass,'data':widget.homework.toJson()}), context);
      if(res["success"]){
        Navigator.pop(context);
        if (widget.onUploadComplete != null) {
          widget.onUploadComplete();
        }
        ToastMessage.show(S.current.createHomeworkSuccessful);
      }else{
        ToastMessage.show(S.current.createHomeworkFailed);
      }
    } catch (e) {
      ToastMessage.show(e.toString());
    }
  }


  @override
  void initState() {
    super.initState();
    chineseController.text = widget.homework.chinese;
    englishController.text = widget.homework.english;
    mathController.text = widget.homework.mathematics;
    generalStudiesController.text = widget.homework.generalStudies;
    otherController.text = widget.homework.other;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(S.current.classHomework),
        backgroundColor: Colors.grey[500],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Padding(
              padding: EdgeInsets.only(top: 10.0),
              child: Center(
                child: Container(
                  height: MediaQuery.of(context).size.height / 2.5,
                  width: MediaQuery.of(context).size.width / 2,
                  child: Image.file(
                    widget.imageFile, // Display the photo
                    fit: BoxFit.contain,
                  ),
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
      )
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
                  S.current.uploadImage,
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