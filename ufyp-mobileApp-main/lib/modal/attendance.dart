import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:my_app/modal/globalVariable.dart';

class Attendance {
  String attendanceDate;
  String status;

  Attendance({
    required this.attendanceDate,
    required this.status,
  });

  factory Attendance.fromMap(Map<String, dynamic> map) {
    return Attendance(
      attendanceDate: map['attendanceDate'],
      status: map['status'],
    );
  }

  @override
  String toString() {
    return 'Attendance Date: $attendanceDate, Status: $status';
  }


  String getAttendaceDate(){
    return attendanceDate;
  }

  String getStatus(){
    return status;
  }


  String getStatusByCurrentLanguage() {
    if(GlobalVariable.isChineseLocale){
      return changeStatusToZh(status);
    }
    return status;
  }

  Color? getColor() {
    if(status == "Present"){
      return Colors.greenAccent[700];
    }else if(status == "Absent"){
      return Colors.redAccent[400];
    }else if(status == "Late"){
      return Colors.yellowAccent[400];
    }else if(status == "Sick"){
      return Colors.grey[300];
    }else{
      return Colors.black; // default color if status is not matched
    }
  }



  String changeStatusToZh(String status){
    if(status == "Present"){
      return "出席";
    }else if(status == "Absent"){
      return "缺席";
    }else if(status == "Late"){
      return "遲到";
    }else if(status == "Sick"){
      return "病假";
    }
    return "";
  }


}