import 'package:flutter/cupertino.dart';
import 'package:my_app/modal/globalVariable.dart';
import 'package:shared_preferences/shared_preferences.dart';

class InterestClass {
  String titleEN;
  String titleTC;
  String startDateFrom;
  String startDateTo;
  String validApplyDateFrom;
  String validApplyDateTo;
  String timePeriod;
  String weekDay;
  String id;

  InterestClass({
    required this.id,
    required this.titleEN,
    required this.titleTC,
    required this.startDateFrom,
    required this.startDateTo,
    required this.validApplyDateFrom,
    required this.validApplyDateTo,
    required this.timePeriod,
    required this.weekDay,
  });



  @override
  String toString() {
    return 'InterestClass{titleEN: $titleEN, titleTC: $titleTC, startDateFrom: $startDateFrom, startDateTo: $startDateTo, validApplyDateFrom: $validApplyDateFrom, validApplyDateTo: $validApplyDateTo}';
  }
  
  
  static String convertWeekDayToChinese(String weekdayInEnglish) {

    if(GlobalVariable.isChineseLocale){
        Map<String, String> weekdayMap = {
        'Monday': '星期一',
        'Tuesday': '星期二',
        'Wednesday': '星期三',
        'Thursday': '星期四',
        'Friday': '星期五',
      };

      return weekdayMap[weekdayInEnglish] ?? '';
    }

    return weekdayInEnglish;

  }

}

class appliedInterestClassList{
  String titleEN;
  String titleTC;
  String status;
  String submittedDate;
  String approveDate;

  appliedInterestClassList({
    required this.titleEN,
    required this.titleTC,
    required this.status,
    required this.submittedDate,
    required this.approveDate,
  });

  @override
  String toString() {
    return 'InterestClass{titleEN: $titleEN, titleTC: $titleTC, status: $status, submittedDate: $submittedDate, approveDate: $approveDate}';
  }

    static String convertStatusToChinese(String status) {

    if(GlobalVariable.isChineseLocale){
        Map<String, String> statusMap = {
        'Pending': '等待',
        'Approved': '批准',
        'Rejected': '拒絕',
      };

      return statusMap[status] ?? '';
    }

    return status;

  }



}