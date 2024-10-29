
import 'package:my_app/generated/l10n.dart';

class classAttendanceData {
  String chiName;
  String engName;
  String studentId;
  String? attendanceRecord;
  bool haveChange;

  classAttendanceData({
    required this.chiName,
    required this.engName,
    required this.studentId,
    this.attendanceRecord,
    required this.haveChange,
  });

  static String convertValue(String? value) {
    if(value == null){
      return '';
    }

    if (value == '病假') {
      return 'Sick';
    } else if (value == '出席') {
      return 'Present';
    } else if (value == '缺席') {
      return 'Absent';
    } else if (value == '遲到') {
      return 'Late';
    } else if (value == '選擇' || value =="Select") {
      return '';
    }

    return value;
  }

  static String reverseConvertValue(String? value) {
    if (value == null) {
      return S.current.SelectValue; // replace 'Default' with a suitable default value
    }
    if (value == 'Sick') {
      return '病假';
    } else if (value == 'Present') {
      return '出席';
    } else if (value == 'Absent') {
      return '缺席';
    } else if (value == 'Late') {
      return '遲到';
    }

    return value;
  }

  Map<String, String?> toJson() {
    return {
      'studentChiName': this.chiName,
      'studentEngName': this.engName,
      'studentNumber': this.studentId,
      'status': this.attendanceRecord ?? '', // use an empty string if this.attendanceRecord is null
      // Add all properties of the class that you want to include in the JSON
    };
  }

  static void resetHaveChange(List<classAttendanceData> list) {
    for (var item in list) {
      item.haveChange = false;
    }
  }

  static void resetData(List<classAttendanceData> list) {
    for (var item in list) {
      item.haveChange = false;
      item.attendanceRecord = null;
    }
  }

}