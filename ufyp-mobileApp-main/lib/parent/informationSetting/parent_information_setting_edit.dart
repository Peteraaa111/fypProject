import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/edit_textfield.dart';
import 'package:my_app/components/toastMessage.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/parent/parent_drawer_item.dart';
import 'package:my_app/parent/parent_home_page.dart';

class ParentInformationSettingEditPage extends StatelessWidget {
  final studentChiName = TextEditingController();
  final studentEngName = TextEditingController();
  final homeAddress = TextEditingController();
  final studentAge = TextEditingController();
  final parentName = TextEditingController();

  void editSave(BuildContext context) async{
    if (studentChiName.text.isEmpty) {
      ToastMessage.show('Please enter student Chinese name');
      return;
    }
    if (studentEngName.text.isEmpty) {
      ToastMessage.show('Please enter student English name');
      return;
    }
    if (homeAddress.text.isEmpty) {
      ToastMessage.show('Please enter home address');
      return;
    }
    if (studentAge.text.isEmpty) {
      ToastMessage.show('Please enter student age');
      return;
    }
    if (parentName.text.isEmpty) {
      ToastMessage.show('Please enter parent name');
      return;
    }
    final data = {
      's_ChiName': studentChiName.text,
      's_EngName': studentEngName.text,
      'home_Address': homeAddress.text,
      's_Age': studentAge.text,
      'parent_Name': parentName.text,
      's_Id': AppUser.id,
    };
    final res = await UserApi().EditUserDataByID(jsonEncode({'data':data}), context);
    if(res["success"]){
      Student.sChiName = studentChiName.text;
      Student.sEngName = studentEngName.text;
      Student.homeAddress = homeAddress.text;
      Student.sAge = studentAge.text;
      Student.parentName = parentName.text; 
      ToastMessage.show(S.current.editSuccessful);
      Navigator.push(context,
        MaterialPageRoute(builder: (context) => parentHomePage(key: UniqueKey(),currentPage: ParentDrawerSections.informationSetting,title:S.current.informationSetting)),
      );
    }
  }




  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(S.current.editLabel),
        backgroundColor: Colors.grey[500],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              buildRow(S.current.studentChiName, studentChiName, Student.sChiName, false),
              buildRow(S.current.studentEngName, studentEngName, Student.sEngName, false),
              buildRow(S.current.studentAge, studentAge, Student.sAge, true),
              buildRow(S.current.parentNameLabel, parentName, Student.parentName, false),
              buildRow(S.current.studentHomeAddress, homeAddress, Student.homeAddress, false),
              SizedBox(height: 20),
              Center(
                child: SizedBox(
                  width: 200,
                  child: Builder(
                    builder: (context) => ElevatedButton(
                      onPressed: () => editSave(context),
                      child: Text(
                        S.current.save,
                        style: TextStyle(fontSize: 18),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.grey,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget buildRow(String label, TextEditingController controller, String initialValue, bool numericOnly) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 10),
      child: Row(
        children: [
          Expanded(
            child: Text(label),
            flex: 1,
          ),
          SizedBox(width: 8),
          Expanded(
            child: EditDataTextField(
              controller: controller,
              obscureText: false,
              initialValue: initialValue,
              numericOnly: numericOnly,
            ),
            flex: 2,
          ),
        ],
      ),
    );
  }
}