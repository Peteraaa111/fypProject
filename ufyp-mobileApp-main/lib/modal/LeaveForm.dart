import 'package:my_app/modal/globalVariable.dart';

class LeaveForm {
  String reason;
  String submittedDate;
  String dateApplied;
  String status;
  String weekDay;

  LeaveForm({
    required this.reason,
    required this.submittedDate,
    required this.dateApplied,
    required this.status,
    required this.weekDay,
  });
  @override
  String toString() {
    return 'LeaveForm{reason: $reason, submittedDate: $submittedDate, dateApplied: $dateApplied, status: $status}';
  }

  static String convertWeekDayToChinese(String weekdayInEnglish) {

    if(GlobalVariable.isChineseLocale){
        Map<String, String> weekdayMap = {
        'Mon': '星期一',
        'Tue': '星期二',
        'Wed': '星期三',
        'Thu': '星期四',
        'Fri': '星期五',
        'Sat': '星期六',
        'Sun': '星期日',
      };

      return weekdayMap[weekdayInEnglish] ?? '';
    }

    return weekdayInEnglish;


  }

  static String convertStatusToChinese(String statusInEnglish) {

    if(GlobalVariable.isChineseLocale){
      Map<String, String> statusMap = {
        'Pending': '待批准',
        'Approved': '已批准',
        'Rejected': '已拒绝',
      };
      return statusMap[statusInEnglish] ?? '';
    }
    return statusInEnglish;
  }

}