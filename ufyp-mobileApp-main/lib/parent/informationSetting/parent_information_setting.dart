import 'package:flutter/material.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/parent/informationSetting/parent_information_setting_edit.dart';

class ParentInformationSettingPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          margin: EdgeInsets.all(20),
          child: Card(
            color: Colors.grey[300],
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(15),
            ),
            child: Padding(
              padding: EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildRow(S.current.studentChiName, Student.sChiName),
                  _buildRow(S.current.studentEngName, Student.sEngName),
                  _buildRow(S.current.studentAge, Student.sAge),
                  _buildRow(S.current.studentGender, Student.sGender),
                  _buildRow(S.current.studentBorn, Student.sBorn),
                  _buildRow(S.current.studentIdCardNumber, Student.sIdNumber),
                  _buildRow(S.current.studentID, AppUser.id),
                  _buildRow(S.current.studentCurrentClass, AppUser.currentClass),
                  _buildRow(S.current.parentNameLabel, Student.parentName),
                  _buildRow(S.current.parentPhoneLabel, Student.parentPhoneNumber),
                  _buildRow(S.current.studentHomeAddress, Student.homeAddress),
                  SizedBox(height: 20),
                ],
              ),
            ),
          ),
        ),
        Container(
          margin: EdgeInsets.only(top: 20),
          child: Center(
            child: SizedBox(
              width: 200,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => ParentInformationSettingEditPage(),
                    ),
                  );
                },
                child: Text(
                  S.current.editLabel,
                  style: TextStyle(fontSize: 18),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.grey,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildRow(String label, String value) {
    return Padding(
      padding: EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          SizedBox(width: 8),
          Expanded(
            child: Text(
              value,
              style: TextStyle(color: Colors.grey[700]),
            ),
          ),
        ],
      ),
    );
  }
}