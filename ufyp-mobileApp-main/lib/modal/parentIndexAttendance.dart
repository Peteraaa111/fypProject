import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:my_app/modal/globalVariable.dart';

class IndexAttendance {
 // String status;
  String takeAttendanceTime;

  IndexAttendance({
   // required this.status,
    required this.takeAttendanceTime,
  });

  // static String convertStatusWord(String? value) {


  //   if(value == null){
  //     return '';
  //   }

  //   if(GlobalVariable.isChineseLocale){
  //     if (value == 'Sick') {
  //       return '病假';
  //     } else if (value == 'Present') {
  //       return '出席';
  //     } else if (value == 'Absent') {
  //       return '缺席';
  //     } else if (value == 'Late') {
  //       return '遲到';
  //     }
  //   }
  //   return value;
  // }

  // Add this function
  String getTakeAttendanceTimeOnly() {
    final format = DateFormat('MM/dd/yyyy, hh:mm:ss a', 'en_US');
    final dateTime = format.parse(takeAttendanceTime);
    return DateFormat('a hh:mm ').format(dateTime);
  }

  Color getTimeColor() {
    final format = DateFormat('MM/dd/yyyy, hh:mm:ss a', 'en_US');

    final time = format.parse(takeAttendanceTime);
    final comparisonTime = TimeOfDay(hour: 8, minute: 30);

    if (time.hour > comparisonTime.hour || (time.hour == comparisonTime.hour && time.minute > comparisonTime.minute)) {
      return Colors.red;
    } else {
      return Colors.green;
    }
  }

  static String getWord(){
    String value ='Today Date';
    if(GlobalVariable.isChineseLocale){
      value = "今天日期";
    }
    return value;
  }
}