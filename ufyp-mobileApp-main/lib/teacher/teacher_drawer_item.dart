import 'package:flutter/material.dart';
import 'package:my_app/common/help.dart';
import 'package:my_app/common/settings.dart';
import 'package:my_app/common/contacts.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/globalVariable.dart';
import 'package:my_app/pages/chatPage/chatContentPage.dart';
import 'package:my_app/pages/dashboard.dart';
import 'package:my_app/pages/schoolPhotoPage/schoolPhotoSelectDatePage.dart';
import 'package:my_app/teacher/classAttendance/teacher_class_attendance.dart';
import 'package:my_app/teacher/classGrade/teacher_check_class_grade.dart';
import 'package:my_app/teacher/classHomework/teacher_class_homework.dart';
import 'package:my_app/teacher/classSeat/teacher_make_class_seat.dart';
import 'package:my_app/teacher/teacher_index.dart';


enum TeacherDrawerSections {
  dashboard,
  helpPage,
  contacts,
  schoolPhoto,
  settings,
  logout,
  checkGrade,
  chatContact,
  classHomework,
  classAttendance,
  seatPlan,
}


// Future<void> signUserOut() async {
//   Student.clear();
//   FirebaseAuth.instance.signOut();
// }



class PageBuilder {
  static Widget buildPage(TeacherDrawerSections currentPage) {
    switch (currentPage) {
      case TeacherDrawerSections.dashboard:
        return TeacherIndexPage();
      case TeacherDrawerSections.contacts:
        return ContactsPage();
      case TeacherDrawerSections.schoolPhoto:
        return SchoolPhotoSelectDatePage();
      case TeacherDrawerSections.classHomework:
        return TeacherAddHomeworkPage();
      case TeacherDrawerSections.classAttendance:
        return TeacherTakeClassAttendancePage();
      case TeacherDrawerSections.settings:
        return SettingsPage();
      case TeacherDrawerSections.chatContact:
        return ChatContactsPage();
      case TeacherDrawerSections.checkGrade:
        return TeacherCheckStudentGrade();
      // case TeacherDrawerSections.informationSetting:
      //   return ParentInformationSettingPage();
      case TeacherDrawerSections.seatPlan:
        return TeacherMakeSeatingPlan();
      case TeacherDrawerSections.helpPage:
        return HelpPage();
      default:
        return Container();
    }
  }
}