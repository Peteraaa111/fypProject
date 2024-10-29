import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_rounded_date_picker/flutter_rounded_date_picker.dart';
import 'package:intl/intl.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/my_textAreaField.dart';
import 'package:my_app/components/toastMessage.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/globalVariable.dart';
import 'package:my_app/parent/parent_drawer_item.dart';
import 'package:my_app/parent/parent_home_page.dart';



class ParentApplyLeaveForStudent extends StatelessWidget {
  final TextEditingController reasonTextField = TextEditingController();
  final TextEditingController dateTextField = TextEditingController();

  void submitLeaveForm(BuildContext context) async{
    if (reasonTextField.text.isEmpty) {
      ToastMessage.show(S.current.reasonValidation);
      return;
    }
    if (dateTextField.text.isEmpty) {
      ToastMessage.show(S.current.dateValidation);
      return;
    }
    String dateText = dateTextField.text;
    List<String> dateParts = dateText.split(' ');

    String date = dateParts[0]; // 2023-11-15
    String weekday = convertWeekdayToEnglish(dateParts[1]); // 星期三
    
    try {
      final res = await UserApi().applyLeaveForStudent(jsonEncode({'sId':AppUser.id,'reason':reasonTextField.text,'class':AppUser.currentClass,'date':date,'weekDay':weekday}), context);
      if(res["success"]){
        if(res['exist']){
          ToastMessage.show(S.current.existMessage);
        }else{
          ToastMessage.show(S.current.sucessfullyApplyLeave);
          Navigator.push(context,
            MaterialPageRoute(builder: (context) => parentHomePage(key: UniqueKey(),currentPage: ParentDrawerSections.applylLeave,title:S.current.applyLeaveLabel)),
          );
        }
      }else{
        ToastMessage.show(S.current.failApplyLeave);
      }
    } catch (e) {
      ToastMessage.show(e.toString());
    }
  }

  String convertWeekdayToEnglish(String weekdayInChinese) {
    Map<String, String> weekdayMap = {
      '星期一': 'Mon',
      '星期二': 'Tue',
      '星期三': 'Wed',
      '星期四': 'Thu',
      '星期五': 'Fri',
      '星期六': 'Sat',
      '星期日': 'Sun',
    };

    return weekdayMap[weekdayInChinese] ?? '';
  }

  Widget buildForm(BuildContext context) {
    return SingleChildScrollView(
      child: Container(
        padding: EdgeInsets.all(10.0),
        child: Center(
          child: Card(
            shape: RoundedRectangleBorder( 
              borderRadius: BorderRadius.circular(15.0),
            ),
            elevation: 10, 
            child: Padding( 
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: <Widget>[
                  Row(
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(left:25.0,top: 10.0,bottom: 10),
                        child: Row( 
                          children: [
                            Icon(Icons.edit), 
                            SizedBox(width: 8), 
                            Text(
                              S.current.reason,
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  MyTextAreaField(
                    controller: reasonTextField,
                    hintText: S.current.enterTheTextHere,
                    obscureText: false,
                  ),
                  Row(
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(left:25.0,top: 10.0,bottom: 10),
                        child: Row( 
                          children: [
                            Icon(Icons.calendar_today), 
                            SizedBox(width: 8), 
                            Text(
                              S.current.selectedDate,
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  Container(
                    width: 280.0,
                    height: 50.0,
                    child: TextField(
                      onTap: () async {
                        final DateTime lastDate = DateTime(GlobalVariable.currentYear+1, 12, 31); // December 31 of the current year
                        final DateTime? picked = await showRoundedDatePicker(
                          context: context,
                          initialDate: DateTime.now(),
                          firstDate: DateTime.now().subtract(Duration(days: 1)),
                          lastDate: lastDate,
                          borderRadius: 16,
                        );

                        if (picked != null) {
                          final DateFormat formatter = DateFormat('yyyy-MM-dd EEEE');
                          final String formatted = formatter.format(picked);
                          dateTextField.text = formatted; // set the text here
                        }
                      },
                      decoration: InputDecoration(
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.black),
                          borderRadius: BorderRadius.circular(10.0),
                        ),
                        focusedBorder: UnderlineInputBorder(
                          borderSide: BorderSide.none,
                          borderRadius: BorderRadius.circular(10.0),
                        ),
                        fillColor: Colors.grey.shade200,
                        filled: true,
                      ),
                      readOnly: true,
                      controller: dateTextField,
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(top: 20),
                    child: Center(
                      child: SizedBox(
                        width: 200,
                        child: Builder(
                          builder: (context) => Padding( 
                            padding: const EdgeInsets.all(8.0),
                            child: ElevatedButton(
                              onPressed: () => submitLeaveForm(context),
                              child: Row( 
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.send), 
                                  SizedBox(width: 8), 
                                  Text(
                                    S.current.Submit,
                                    style: TextStyle(fontSize: 18),
                                  ),
                                ],
                              ),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.grey,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(S.current.applyLeaveLabel),
        backgroundColor: Colors.grey[500],
      ),
      body: buildForm(context),
    );
  }

}


 