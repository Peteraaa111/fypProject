import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';

class ParentHeaderDrawer extends StatefulWidget {
  ParentHeaderDrawer(
  );
  @override
  _ParentHeaderDrawerState createState() => _ParentHeaderDrawerState();
}

class _ParentHeaderDrawerState extends State<ParentHeaderDrawer> {
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
              S.current.parentNameLabel+": "+ Student.parentName,
              style: TextStyle(color: Colors.white, fontSize: 20),
            ),
          ),
          Padding(
            padding: EdgeInsets.only(right: 10.0),
            child: Text(
              S.current.parentPhoneLabel+": "+Student.parentPhoneNumber,
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
