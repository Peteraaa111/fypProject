import 'package:flutter/cupertino.dart';
import 'package:shared_preferences/shared_preferences.dart';

class GlobalVariable{

  static bool isSettingPage = false;
  static int currentYear = 2023;
  static int currentMonth = new DateTime.now().month;
  static int nextYear = currentYear+1;
  static bool isChineseLocale = true;

}