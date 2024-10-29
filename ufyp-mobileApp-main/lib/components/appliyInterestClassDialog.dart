import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:my_app/generated/l10n.dart';

class CustomAlertDialog extends StatelessWidget {
  final String title;
  final String content;
  final VoidCallback onNoPressed;
  final VoidCallback onYesPressed;

  CustomAlertDialog({
    required this.title,
    required this.content,
    required this.onNoPressed,
    required this.onYesPressed,
  });

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      titlePadding: EdgeInsets.only(top:16,left: 16,right: 16,bottom: 10),
      title: Text(
        title,
        style: TextStyle(color: Colors.grey[600], fontSize: 24, fontWeight: FontWeight.bold),
      ),
      contentPadding: EdgeInsets.only(left:16,right: 16,bottom: 16),
      content: Text(
        content,
        style: TextStyle(color: Colors.black54, fontSize: 18),
      ),
      actions: <Widget>[
        Container(
          margin: EdgeInsets.only(left: 10.0),
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              primary: Colors.grey, // background color
              padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
            ),
            child: Text(
              S.current.No,
              style: TextStyle(color: Colors.white),
            ),
            onPressed: onNoPressed,
          ),
        ),
        Container(
          margin: EdgeInsets.only(right: 10.0),
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              primary: Colors.green, // background color
              padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
            ),
            child: Text(
              S.current.Yes,
              style: TextStyle(color: Colors.white),
            ),
            onPressed: onYesPressed,
          ),
        ),
      ],
    );
  }
}