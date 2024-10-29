import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:my_app/common/help.dart';
import 'package:my_app/common/settings.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/common/contacts.dart';
import 'package:my_app/modal/globalVariable.dart';
import 'package:my_app/pages/auth_page.dart';
import 'package:my_app/pages/chatPage/chatContentPage.dart';
import 'package:my_app/pages/dashboard.dart';
import 'package:my_app/pages/login_page.dart';
import 'package:my_app/pages/notifications.dart';
import 'package:my_app/pages/schoolPhotoPage/schoolPhotoSelectDatePage.dart';
import 'package:my_app/pages/schoolReplySlipPage/schoolReplySlipPage.dart';
import 'package:my_app/parent/applyLeave/parent_apply_leave_for_student.dart';
import 'package:my_app/parent/applyLeave/parent_apply_leave_for_student_list.dart';
import 'package:my_app/parent/attendance/parent_check_student_attendance.dart';
import 'package:my_app/parent/classHomework/parent_check_class_homework.dart';
import 'package:my_app/parent/classSeat/parent_class_seat_check.dart';
import 'package:my_app/parent/gradeData/parent_check_student_grade.dart';
import 'package:my_app/parent/informationSetting/parent_information_setting.dart';
import 'package:my_app/parent/informationSetting/parent_information_setting_edit.dart';
import 'package:my_app/parent/interestClass/parent_view_interest_class.dart';
import 'package:my_app/parent/parent_index.dart';
import 'package:my_app/parent/reward/parent_view_reward.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum ParentDrawerSections {
  dashboard,
  helpPage,
  contacts,
  schoolPhoto,
  classHomework,
  interestClass,
  applylLeave,
  attendanceCheck,
  gradeCheck,
  notifications,
  replySlip,
  informationSetting,
  settings,
  logout,
  chatContact,
  classSeat,
  reward,
}


// Future<void> signUserOut() async {
//   Student.clear();
//   FirebaseAuth.instance.signOut();
// }



class PageBuilder {
  static Widget buildPage(ParentDrawerSections currentPage) {
    switch (currentPage) {
      case ParentDrawerSections.dashboard:
        return ParentIndexPage();
      case ParentDrawerSections.contacts:
        return ContactsPage();
      case ParentDrawerSections.attendanceCheck:
        return ParentCheckStudentAttendance();
      case ParentDrawerSections.schoolPhoto:
        return SchoolPhotoSelectDatePage();
      case ParentDrawerSections.interestClass:
        return ViewInterestClassPage();
      case ParentDrawerSections.applylLeave:
        return ParentApplyLeaveForStudentListPage();
      case ParentDrawerSections.gradeCheck:
        return ParentCheckStudentGrade();
      case ParentDrawerSections.replySlip:
        return SchoolReplySlipPage();
      case ParentDrawerSections.settings:
        return SettingsPage();
      case ParentDrawerSections.notifications:
        return NotificationsPage();
      case ParentDrawerSections.classHomework:
        return ParentCheckClassHomework();
      case ParentDrawerSections.chatContact:
        return ChatContactsPage();
      case ParentDrawerSections.classSeat:
        return ParentClassSeatCheck();
      // case ParentDrawerSections.logout:
      //   signUserOut();
      //   return LoginPage();
      case ParentDrawerSections.informationSetting:
        return ParentInformationSettingPage();
      case ParentDrawerSections.helpPage:
        return HelpPage();
      case ParentDrawerSections.reward:
        return RewardPage();
      default:
        return Container();
    }
  }
}