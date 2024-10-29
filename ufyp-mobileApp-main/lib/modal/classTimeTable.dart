import 'globalVariable.dart';

class TimeTable {
  String day;
  Map<String, String> times;

  TimeTable({
    required this.day,
    required this.times,
  });
}

class ClassTimeTable {
  List<TimeTable> timeTables;

  ClassTimeTable({
    required this.timeTables,
  });

  static String getRestWord(){
    String value ='Rest';
    if(GlobalVariable.isChineseLocale){
      value = "小息";
    }
    return value;
  }

  static String getLunchWord(){
    String value ='Lunch';
    if(GlobalVariable.isChineseLocale){
      value = "午膳";
    }
    return value;
  }

  static String getSubjectWord(String value){
    if(GlobalVariable.isChineseLocale){
      if (value == 'Chinese') {
        return '中文';
      } else if (value == 'English') {
        return '英文';
      } else if (value == 'Math') {
        return '數學';
      } else if (value == 'General Studies') {
        return '常識';
      }else if (value == 'PE') {
        return '體育';
      }else if (value == 'Art') {
        return '視藝';
      }else if (value == 'Computer') {
        return '電腦';
      }else if (value == 'Music') {
        return '音樂';
      }
    }
    return value;
  }

  static String getLeaveWord(){
    String value ='Leave';
    if(GlobalVariable.isChineseLocale){
      value = "放學";
    }
    return value;
  }

  

}

