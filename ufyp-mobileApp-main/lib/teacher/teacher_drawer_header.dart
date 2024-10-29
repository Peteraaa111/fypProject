import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/globalVariable.dart';

import '../modal/StudentData.dart';

class TeacherDrawer extends StatefulWidget {
  TeacherDrawer();
  @override
  _TeacherDrawerState createState() => _TeacherDrawerState();
}

class _TeacherDrawerState extends State<TeacherDrawer> {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.grey[500],
      width: double.infinity,
      height: 150,
      padding: EdgeInsets.only(top: 20.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Padding(
            padding: EdgeInsets.only(right: 10.0),
            child: Text(
              S.current.teacherNameLabel + ": " + (GlobalVariable.isChineseLocale ? Teacher.t_ChiName : Teacher.t_EngName),
              style: TextStyle(color: Colors.white, fontSize: 20),
            ),
          ),
          Padding(
            padding: EdgeInsets.only(right: 10.0),
            child: Text(
              S.current.teacherPhoneLabel+": "+Teacher.t_phoneNumber,
              style: TextStyle(
                color: Colors.grey[200],
                fontSize: 14,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
