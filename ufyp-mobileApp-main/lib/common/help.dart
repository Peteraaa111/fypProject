import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/my_textAreaField.dart';
import 'package:my_app/components/toastMessage.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/parent/parent_drawer_item.dart';

import '../parent/parent_home_page.dart';

class HelpPage extends StatefulWidget {
  @override
  _HelpPagetate createState() => _HelpPagetate();
}

class _HelpPagetate extends State<HelpPage> {
  @override
  Widget build(BuildContext context) {
    return Container(
      child: ListView(
        children: <Widget>[
          Padding(
            padding: EdgeInsets.only(top: 8.0,left:10,right:10),
            child: Card(
              child: ListTile(
                title: Text(S.current.reportProblem),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => ReportProblem()),
                  );
                },
              ),
            ),
          ),
          Padding(
            padding: EdgeInsets.only(left:10,right:10),
            child:Card(
              child: ListTile(
                title: Text(S.current.resetPasswordLabel),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => HowToResetPasswordAndChangeNewPhoneNumber()),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}


class ReportProblem extends StatelessWidget {
  final TextEditingController problemTextField = TextEditingController();

  void submitProblemForm(BuildContext context) async {
    if (problemTextField.text.isEmpty) {
      ToastMessage.show(S.current.problemValidation);
      return;
    }

    try {
      final res = await UserApi().submitSystemProblem(jsonEncode({'sId':AppUser.id,'problem':problemTextField.text,"phoneNumber":Student.parentPhoneNumber}), context);
      if(res["success"]){
        Navigator.push(context,
          MaterialPageRoute(builder: (context) => parentHomePage(key: UniqueKey(),currentPage: ParentDrawerSections.helpPage,title:S.current.help)),
        );
        ToastMessage.show(S.current.sucessfullyApplyProblem);  
      }else{
        ToastMessage.show(S.current.failApplyProblem);
      }
    } catch (e) {
      ToastMessage.show(e.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(S.current.reportProblem),
        backgroundColor: Colors.grey[500],
      ),
      body: Container(
        padding: EdgeInsets.all(16.0),
        child: Card(
          elevation: 5,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
          ),
          child: Padding(
            padding: EdgeInsets.all(16.0),
            child: Column(
              children: <Widget>[
                Text(
                  S.current.problemLabel,
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: 20),
                MyTextAreaField(
                  controller: problemTextField,
                  hintText: S.current.enterTheTextHere,
                  obscureText: false,
                ),
                SizedBox(height: 20),
                SizedBox(
                  width: 200,
                  child: ElevatedButton(
                    onPressed: () => submitProblemForm(context),
                    child: Text(
                      S.current.Submit,
                      style: TextStyle(fontSize: 18),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class HowToResetPasswordAndChangeNewPhoneNumber extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(S.current.resetPasswordLabel),
        backgroundColor: Colors.grey[500],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Card(
          elevation: 5,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: ListView(
              children: <Widget>[
                _buildIcon(context),
                _buildText(context, S.current.securityMessage, 20, FontWeight.bold),
                _buildText(context, S.current.instructionMessage, 16),
                _buildText(context, S.current.contactUsMessage, 16, null, Colors.blue),
                _buildText(context, S.current.orMessage, 16),
                _buildText(context, S.current.schoolVisitMessage, 16, null, Colors.blue),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildIcon(BuildContext context) {
    return Icon(Icons.security, size: 100, color: Colors.blue[700]);
  }

  Widget _buildText(BuildContext context, String text, double fontSize, [FontWeight? fontWeight, Color? color]) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0),
      child: Text(
        text,
        style: TextStyle(
          fontSize: fontSize,
          fontWeight: fontWeight,
          color: color ?? Theme.of(context).textTheme.bodyText1!.color,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }
}