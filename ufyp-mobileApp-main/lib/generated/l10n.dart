// GENERATED CODE - DO NOT MODIFY BY HAND
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'intl/messages_all.dart';

// **************************************************************************
// Generator: Flutter Intl IDE plugin
// Made by Localizely
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, lines_longer_than_80_chars
// ignore_for_file: join_return_with_assignment, prefer_final_in_for_each
// ignore_for_file: avoid_redundant_argument_values, avoid_escaping_inner_quotes

class S {
  S();

  static S? _current;

  static S get current {
    assert(_current != null,
        'No instance of S was loaded. Try to initialize the S delegate before accessing S.current.');
    return _current!;
  }

  static const AppLocalizationDelegate delegate = AppLocalizationDelegate();

  static Future<S> load(Locale locale) {
    final name = (locale.countryCode?.isEmpty ?? false)
        ? locale.languageCode
        : locale.toString();
    final localeName = Intl.canonicalizedLocale(name);
    return initializeMessages(localeName).then((_) {
      Intl.defaultLocale = localeName;
      final instance = S();
      S._current = instance;

      return instance;
    });
  }

  static S of(BuildContext context) {
    final instance = S.maybeOf(context);
    assert(instance != null,
        'No instance of S present in the widget tree. Did you add S.delegate in localizationsDelegates?');
    return instance!;
  }

  static S? maybeOf(BuildContext context) {
    return Localizations.of<S>(context, S);
  }

  /// `Parent Name`
  String get parentNameLabel {
    return Intl.message(
      'Parent Name',
      name: 'parentNameLabel',
      desc: '',
      args: [],
    );
  }

  /// `Parent Phone Number`
  String get parentPhoneLabel {
    return Intl.message(
      'Parent Phone Number',
      name: 'parentPhoneLabel',
      desc: '',
      args: [],
    );
  }

  /// `Notification Prompt`
  String get notificationsLabel {
    return Intl.message(
      'Notification Prompt',
      name: 'notificationsLabel',
      desc: '',
      args: [],
    );
  }

  /// `Select Language:`
  String get selectedLanguage {
    return Intl.message(
      'Select Language:',
      name: 'selectedLanguage',
      desc: '',
      args: [],
    );
  }

  /// `Login`
  String get loginButton {
    return Intl.message(
      'Login',
      name: 'loginButton',
      desc: '',
      args: [],
    );
  }

  /// `City Primary School`
  String get schoolName {
    return Intl.message(
      'City Primary School',
      name: 'schoolName',
      desc: '',
      args: [],
    );
  }

  /// `Teacher Home Page`
  String get teacherHome {
    return Intl.message(
      'Teacher Home Page',
      name: 'teacherHome',
      desc: '',
      args: [],
    );
  }

  /// `Student Home Page`
  String get studentHome {
    return Intl.message(
      'Student Home Page',
      name: 'studentHome',
      desc: '',
      args: [],
    );
  }

  /// `Dashboard`
  String get dashboard {
    return Intl.message(
      'Dashboard',
      name: 'dashboard',
      desc: '',
      args: [],
    );
  }

  /// `Contact us`
  String get contacts {
    return Intl.message(
      'Contact us',
      name: 'contacts',
      desc: '',
      args: [],
    );
  }

  /// `Events`
  String get events {
    return Intl.message(
      'Events',
      name: 'events',
      desc: '',
      args: [],
    );
  }

  /// `Notes`
  String get notes {
    return Intl.message(
      'Notes',
      name: 'notes',
      desc: '',
      args: [],
    );
  }

  /// `Help`
  String get help {
    return Intl.message(
      'Help',
      name: 'help',
      desc: '',
      args: [],
    );
  }

  /// `Leave Application History`
  String get applyLeavePage {
    return Intl.message(
      'Leave Application History',
      name: 'applyLeavePage',
      desc: '',
      args: [],
    );
  }

  /// `Apply Leave`
  String get applyLeaveLabel {
    return Intl.message(
      'Apply Leave',
      name: 'applyLeaveLabel',
      desc: '',
      args: [],
    );
  }

  /// `Notifications`
  String get notifications {
    return Intl.message(
      'Notifications',
      name: 'notifications',
      desc: '',
      args: [],
    );
  }

  /// `Settings`
  String get settings {
    return Intl.message(
      'Settings',
      name: 'settings',
      desc: '',
      args: [],
    );
  }

  /// `Privacy policy`
  String get privacyPolicy {
    return Intl.message(
      'Privacy policy',
      name: 'privacyPolicy',
      desc: '',
      args: [],
    );
  }

  /// `Send feedback`
  String get feedback {
    return Intl.message(
      'Send feedback',
      name: 'feedback',
      desc: '',
      args: [],
    );
  }

  /// `Log out`
  String get logout {
    return Intl.message(
      'Log out',
      name: 'logout',
      desc: '',
      args: [],
    );
  }

  /// `Wrong password`
  String get wrongPassword {
    return Intl.message(
      'Wrong password',
      name: 'wrongPassword',
      desc: '',
      args: [],
    );
  }

  /// `Wrong phone number`
  String get wrongPhoneNumber {
    return Intl.message(
      'Wrong phone number',
      name: 'wrongPhoneNumber',
      desc: '',
      args: [],
    );
  }

  /// `Phone number`
  String get hintPhoneNumber {
    return Intl.message(
      'Phone number',
      name: 'hintPhoneNumber',
      desc: '',
      args: [],
    );
  }

  /// `Password`
  String get hintPassword {
    return Intl.message(
      'Password',
      name: 'hintPassword',
      desc: '',
      args: [],
    );
  }

  /// `Student Exam Grade`
  String get gradeCheck {
    return Intl.message(
      'Student Exam Grade',
      name: 'gradeCheck',
      desc: '',
      args: [],
    );
  }

  /// `Student Attendance`
  String get attendanceCheck {
    return Intl.message(
      'Student Attendance',
      name: 'attendanceCheck',
      desc: '',
      args: [],
    );
  }

  /// `Interest Class List`
  String get ViewInterestClass {
    return Intl.message(
      'Interest Class List',
      name: 'ViewInterestClass',
      desc: '',
      args: [],
    );
  }

  /// `Search`
  String get searchLabel {
    return Intl.message(
      'Search',
      name: 'searchLabel',
      desc: '',
      args: [],
    );
  }

  /// `Information Setting`
  String get informationSetting {
    return Intl.message(
      'Information Setting',
      name: 'informationSetting',
      desc: '',
      args: [],
    );
  }

  /// `Reason`
  String get reason {
    return Intl.message(
      'Reason',
      name: 'reason',
      desc: '',
      args: [],
    );
  }

  /// `First Half`
  String get firstHalf {
    return Intl.message(
      'First Half',
      name: 'firstHalf',
      desc: '',
      args: [],
    );
  }

  /// `Second Half`
  String get secondtHalf {
    return Intl.message(
      'Second Half',
      name: 'secondtHalf',
      desc: '',
      args: [],
    );
  }

  /// `No photo yet`
  String get noPhotoData {
    return Intl.message(
      'No photo yet',
      name: 'noPhotoData',
      desc: '',
      args: [],
    );
  }

  /// `Sucessfully apply for interest class`
  String get sucessfullyApplyInterestClass {
    return Intl.message(
      'Sucessfully apply for interest class',
      name: 'sucessfullyApplyInterestClass',
      desc: '',
      args: [],
    );
  }

  /// `Failed to apply for interest class`
  String get failApplyInterestClass {
    return Intl.message(
      'Failed to apply for interest class',
      name: 'failApplyInterestClass',
      desc: '',
      args: [],
    );
  }

  /// `School Information`
  String get schoolInfo {
    return Intl.message(
      'School Information',
      name: 'schoolInfo',
      desc: '',
      args: [],
    );
  }

  /// `School Photo`
  String get schoolPhoto {
    return Intl.message(
      'School Photo',
      name: 'schoolPhoto',
      desc: '',
      args: [],
    );
  }

  /// `Start Date`
  String get startDateLabel {
    return Intl.message(
      'Start Date',
      name: 'startDateLabel',
      desc: '',
      args: [],
    );
  }

  /// `Valid Apply Date`
  String get validApplyDate {
    return Intl.message(
      'Valid Apply Date',
      name: 'validApplyDate',
      desc: '',
      args: [],
    );
  }

  /// `Approved Date`
  String get approvedData {
    return Intl.message(
      'Approved Date',
      name: 'approvedData',
      desc: '',
      args: [],
    );
  }

  /// `Others`
  String get otherLabel {
    return Intl.message(
      'Others',
      name: 'otherLabel',
      desc: '',
      args: [],
    );
  }

  /// `Failed to read`
  String get readFail {
    return Intl.message(
      'Failed to read',
      name: 'readFail',
      desc: '',
      args: [],
    );
  }

  /// `View Homework`
  String get classHomework {
    return Intl.message(
      'View Homework',
      name: 'classHomework',
      desc: '',
      args: [],
    );
  }

  /// `Date`
  String get dateLabel {
    return Intl.message(
      'Date',
      name: 'dateLabel',
      desc: '',
      args: [],
    );
  }

  /// `Enter the text here`
  String get enterTheTextHere {
    return Intl.message(
      'Enter the text here',
      name: 'enterTheTextHere',
      desc: '',
      args: [],
    );
  }

  /// `Failed to read interest class`
  String get readInterestClassFail {
    return Intl.message(
      'Failed to read interest class',
      name: 'readInterestClassFail',
      desc: '',
      args: [],
    );
  }

  /// `Failed to read reward data`
  String get readRewardFail {
    return Intl.message(
      'Failed to read reward data',
      name: 'readRewardFail',
      desc: '',
      args: [],
    );
  }

  /// `Failed to read applied interest class`
  String get readAppliedInterestClassFail {
    return Intl.message(
      'Failed to read applied interest class',
      name: 'readAppliedInterestClassFail',
      desc: '',
      args: [],
    );
  }

  /// `Total Number Of Record`
  String get totalStudentAttendanceRecordLabel {
    return Intl.message(
      'Total Number Of Record',
      name: 'totalStudentAttendanceRecordLabel',
      desc: '',
      args: [],
    );
  }

  /// `Attendance List`
  String get AttendanceList {
    return Intl.message(
      'Attendance List',
      name: 'AttendanceList',
      desc: '',
      args: [],
    );
  }

  /// `No data in the selected month`
  String get dateSelectedNoData {
    return Intl.message(
      'No data in the selected month',
      name: 'dateSelectedNoData',
      desc: '',
      args: [],
    );
  }

  /// `Time Period`
  String get timePeriod {
    return Intl.message(
      'Time Period',
      name: 'timePeriod',
      desc: '',
      args: [],
    );
  }

  /// `Yes`
  String get Yes {
    return Intl.message(
      'Yes',
      name: 'Yes',
      desc: '',
      args: [],
    );
  }

  /// `No`
  String get No {
    return Intl.message(
      'No',
      name: 'No',
      desc: '',
      args: [],
    );
  }

  /// `Activity Name`
  String get activityName {
    return Intl.message(
      'Activity Name',
      name: 'activityName',
      desc: '',
      args: [],
    );
  }

  /// `Activity Date`
  String get activityDate {
    return Intl.message(
      'Activity Date',
      name: 'activityDate',
      desc: '',
      args: [],
    );
  }

  /// `No data in the selected date`
  String get photoSelectedDateNoData {
    return Intl.message(
      'No data in the selected date',
      name: 'photoSelectedDateNoData',
      desc: '',
      args: [],
    );
  }

  /// `Download`
  String get download {
    return Intl.message(
      'Download',
      name: 'download',
      desc: '',
      args: [],
    );
  }

  /// `Do you want to download this image?`
  String get confirmDownload {
    return Intl.message(
      'Do you want to download this image?',
      name: 'confirmDownload',
      desc: '',
      args: [],
    );
  }

  /// `Successfully save image`
  String get successfullySaveImage {
    return Intl.message(
      'Successfully save image',
      name: 'successfullySaveImage',
      desc: '',
      args: [],
    );
  }

  /// `Failed to save image`
  String get failSaveImage {
    return Intl.message(
      'Failed to save image',
      name: 'failSaveImage',
      desc: '',
      args: [],
    );
  }

  /// `No Permission`
  String get noPermission {
    return Intl.message(
      'No Permission',
      name: 'noPermission',
      desc: '',
      args: [],
    );
  }

  /// `Applied List`
  String get viewApplyInterestClassListLabel {
    return Intl.message(
      'Applied List',
      name: 'viewApplyInterestClassListLabel',
      desc: '',
      args: [],
    );
  }

  /// `Reply Slip`
  String get replySlip {
    return Intl.message(
      'Reply Slip',
      name: 'replySlip',
      desc: '',
      args: [],
    );
  }

  /// `Title`
  String get replySlipTitle {
    return Intl.message(
      'Title',
      name: 'replySlipTitle',
      desc: '',
      args: [],
    );
  }

  /// `APPLY`
  String get applyInterestClass {
    return Intl.message(
      'APPLY',
      name: 'applyInterestClass',
      desc: '',
      args: [],
    );
  }

  /// `Are you sure to apply for this interest class?`
  String get applyInterestClassMessage {
    return Intl.message(
      'Are you sure to apply for this interest class?',
      name: 'applyInterestClassMessage',
      desc: '',
      args: [],
    );
  }

  /// `Leave Date Apply`
  String get DateApply {
    return Intl.message(
      'Leave Date Apply',
      name: 'DateApply',
      desc: '',
      args: [],
    );
  }

  /// `Submitted Date`
  String get SubmittedDate {
    return Intl.message(
      'Submitted Date',
      name: 'SubmittedDate',
      desc: '',
      args: [],
    );
  }

  /// `Select Month`
  String get selectedMonth {
    return Intl.message(
      'Select Month',
      name: 'selectedMonth',
      desc: '',
      args: [],
    );
  }

  /// `English`
  String get englishLabel {
    return Intl.message(
      'English',
      name: 'englishLabel',
      desc: '',
      args: [],
    );
  }

  /// `Chinese`
  String get chineseLabel {
    return Intl.message(
      'Chinese',
      name: 'chineseLabel',
      desc: '',
      args: [],
    );
  }

  /// `Mathematics`
  String get mathLabel {
    return Intl.message(
      'Mathematics',
      name: 'mathLabel',
      desc: '',
      args: [],
    );
  }

  /// `General Studies`
  String get gsLabel {
    return Intl.message(
      'General Studies',
      name: 'gsLabel',
      desc: '',
      args: [],
    );
  }

  /// `Total Marks`
  String get totalMarkLabel {
    return Intl.message(
      'Total Marks',
      name: 'totalMarkLabel',
      desc: '',
      args: [],
    );
  }

  /// `Status`
  String get statusLabel {
    return Intl.message(
      'Status',
      name: 'statusLabel',
      desc: '',
      args: [],
    );
  }

  /// `About Us`
  String get aboutUs {
    return Intl.message(
      'About Us',
      name: 'aboutUs',
      desc: '',
      args: [],
    );
  }

  /// `Sick`
  String get SickLabel {
    return Intl.message(
      'Sick',
      name: 'SickLabel',
      desc: '',
      args: [],
    );
  }

  /// `Absent`
  String get AbsentLabel {
    return Intl.message(
      'Absent',
      name: 'AbsentLabel',
      desc: '',
      args: [],
    );
  }

  /// `Late`
  String get LateLabel {
    return Intl.message(
      'Late',
      name: 'LateLabel',
      desc: '',
      args: [],
    );
  }

  /// `Present`
  String get presentLabel {
    return Intl.message(
      'Present',
      name: 'presentLabel',
      desc: '',
      args: [],
    );
  }

  /// `Done`
  String get finishedEditImage {
    return Intl.message(
      'Done',
      name: 'finishedEditImage',
      desc: '',
      args: [],
    );
  }

  /// `Video`
  String get videoLabel {
    return Intl.message(
      'Video',
      name: 'videoLabel',
      desc: '',
      args: [],
    );
  }

  /// `Image`
  String get imageLabel {
    return Intl.message(
      'Image',
      name: 'imageLabel',
      desc: '',
      args: [],
    );
  }

  /// `Submit`
  String get Submit {
    return Intl.message(
      'Submit',
      name: 'Submit',
      desc: '',
      args: [],
    );
  }

  /// `Pay Now`
  String get Payment {
    return Intl.message(
      'Pay Now',
      name: 'Payment',
      desc: '',
      args: [],
    );
  }

  /// `OK`
  String get OK {
    return Intl.message(
      'OK',
      name: 'OK',
      desc: '',
      args: [],
    );
  }

  /// `Cancel`
  String get Cancel {
    return Intl.message(
      'Cancel',
      name: 'Cancel',
      desc: '',
      args: [],
    );
  }

  /// `Address`
  String get addressLabel {
    return Intl.message(
      'Address',
      name: 'addressLabel',
      desc: '',
      args: [],
    );
  }

  /// `Contact Number`
  String get ContactUsNumber {
    return Intl.message(
      'Contact Number',
      name: 'ContactUsNumber',
      desc: '',
      args: [],
    );
  }

  /// `City University of Hong Kong Tat Chee Avenue Kowloon Tong`
  String get addressWord {
    return Intl.message(
      'City University of Hong Kong Tat Chee Avenue Kowloon Tong',
      name: 'addressWord',
      desc: '',
      args: [],
    );
  }

  /// `First Half Grade Not Ready`
  String get firstHalfGradeNotReady {
    return Intl.message(
      'First Half Grade Not Ready',
      name: 'firstHalfGradeNotReady',
      desc: '',
      args: [],
    );
  }

  /// `Second Half Grade Not Ready`
  String get secondHalfGradeNotReady {
    return Intl.message(
      'Second Half Grade Not Ready',
      name: 'secondHalfGradeNotReady',
      desc: '',
      args: [],
    );
  }

  /// `Student Current Class`
  String get studentCurrentClass {
    return Intl.message(
      'Student Current Class',
      name: 'studentCurrentClass',
      desc: '',
      args: [],
    );
  }

  /// `Student Chinese Name`
  String get studentChiName {
    return Intl.message(
      'Student Chinese Name',
      name: 'studentChiName',
      desc: '',
      args: [],
    );
  }

  /// `Student English Name`
  String get studentEngName {
    return Intl.message(
      'Student English Name',
      name: 'studentEngName',
      desc: '',
      args: [],
    );
  }

  /// `Student Id Number`
  String get studentID {
    return Intl.message(
      'Student Id Number',
      name: 'studentID',
      desc: '',
      args: [],
    );
  }

  /// `Student Born`
  String get studentBorn {
    return Intl.message(
      'Student Born',
      name: 'studentBorn',
      desc: '',
      args: [],
    );
  }

  /// `Student Age`
  String get studentAge {
    return Intl.message(
      'Student Age',
      name: 'studentAge',
      desc: '',
      args: [],
    );
  }

  /// `Student Id Card Number`
  String get studentIdCardNumber {
    return Intl.message(
      'Student Id Card Number',
      name: 'studentIdCardNumber',
      desc: '',
      args: [],
    );
  }

  /// `Student Home Address`
  String get studentHomeAddress {
    return Intl.message(
      'Student Home Address',
      name: 'studentHomeAddress',
      desc: '',
      args: [],
    );
  }

  /// `Student Gender`
  String get studentGender {
    return Intl.message(
      'Student Gender',
      name: 'studentGender',
      desc: '',
      args: [],
    );
  }

  /// `Edit Information`
  String get editLabel {
    return Intl.message(
      'Edit Information',
      name: 'editLabel',
      desc: '',
      args: [],
    );
  }

  /// `Save`
  String get save {
    return Intl.message(
      'Save',
      name: 'save',
      desc: '',
      args: [],
    );
  }

  /// `Please enter the reason`
  String get reasonValidation {
    return Intl.message(
      'Please enter the reason',
      name: 'reasonValidation',
      desc: '',
      args: [],
    );
  }

  /// `Please select the date`
  String get dateValidation {
    return Intl.message(
      'Please select the date',
      name: 'dateValidation',
      desc: '',
      args: [],
    );
  }

  /// `Edit successfully!`
  String get editSuccessful {
    return Intl.message(
      'Edit successfully!',
      name: 'editSuccessful',
      desc: '',
      args: [],
    );
  }

  /// `Failed to submit`
  String get failApplyProblem {
    return Intl.message(
      'Failed to submit',
      name: 'failApplyProblem',
      desc: '',
      args: [],
    );
  }

  /// `Please enter the problem`
  String get problemValidation {
    return Intl.message(
      'Please enter the problem',
      name: 'problemValidation',
      desc: '',
      args: [],
    );
  }

  /// `Problem Report`
  String get reportProblem {
    return Intl.message(
      'Problem Report',
      name: 'reportProblem',
      desc: '',
      args: [],
    );
  }

  /// `How to reset password and change new phoneNumber`
  String get resetPasswordLabel {
    return Intl.message(
      'How to reset password and change new phoneNumber',
      name: 'resetPasswordLabel',
      desc: '',
      args: [],
    );
  }

  /// `Student`
  String get studentInformation {
    return Intl.message(
      'Student',
      name: 'studentInformation',
      desc: '',
      args: [],
    );
  }

  /// `You have already applied leave in that date`
  String get existMessage {
    return Intl.message(
      'You have already applied leave in that date',
      name: 'existMessage',
      desc: '',
      args: [],
    );
  }

  /// `Failed to apply for leave`
  String get failApplyLeave {
    return Intl.message(
      'Failed to apply for leave',
      name: 'failApplyLeave',
      desc: '',
      args: [],
    );
  }

  /// `Sucessfully apply for leave`
  String get sucessfullyApplyLeave {
    return Intl.message(
      'Sucessfully apply for leave',
      name: 'sucessfullyApplyLeave',
      desc: '',
      args: [],
    );
  }

  /// `Sucessfully apply for problem`
  String get sucessfullyApplyProblem {
    return Intl.message(
      'Sucessfully apply for problem',
      name: 'sucessfullyApplyProblem',
      desc: '',
      args: [],
    );
  }

  /// `Support And Contact`
  String get supportAndContact {
    return Intl.message(
      'Support And Contact',
      name: 'supportAndContact',
      desc: '',
      args: [],
    );
  }

  /// `Setting And Logout`
  String get SettingAndLogoutTitle {
    return Intl.message(
      'Setting And Logout',
      name: 'SettingAndLogoutTitle',
      desc: '',
      args: [],
    );
  }

  /// `Problem`
  String get problemLabel {
    return Intl.message(
      'Problem',
      name: 'problemLabel',
      desc: '',
      args: [],
    );
  }

  /// `Selected Date`
  String get selectedDate {
    return Intl.message(
      'Selected Date',
      name: 'selectedDate',
      desc: '',
      args: [],
    );
  }

  /// `Please Select Options`
  String get pleaseSelect {
    return Intl.message(
      'Please Select Options',
      name: 'pleaseSelect',
      desc: '',
      args: [],
    );
  }

  /// `Due to security problems`
  String get securityMessage {
    return Intl.message(
      'Due to security problems',
      name: 'securityMessage',
      desc: '',
      args: [],
    );
  }

  /// `If parents want to change their password and phone number, please follow the instructions below:`
  String get instructionMessage {
    return Intl.message(
      'If parents want to change their password and phone number, please follow the instructions below:',
      name: 'instructionMessage',
      desc: '',
      args: [],
    );
  }

  /// `Contact us by phone: +852 3442-7654`
  String get contactUsMessage {
    return Intl.message(
      'Contact us by phone: +852 3442-7654',
      name: 'contactUsMessage',
      desc: '',
      args: [],
    );
  }

  /// `OR`
  String get orMessage {
    return Intl.message(
      'OR',
      name: 'orMessage',
      desc: '',
      args: [],
    );
  }

  /// `Sucessfully submit replySlip`
  String get sucessfullySubmitReplySlip {
    return Intl.message(
      'Sucessfully submit replySlip',
      name: 'sucessfullySubmitReplySlip',
      desc: '',
      args: [],
    );
  }

  /// `You have already selected`
  String get alreadySubmitReplySlip {
    return Intl.message(
      'You have already selected',
      name: 'alreadySubmitReplySlip',
      desc: '',
      args: [],
    );
  }

  /// `options`
  String get alreadySubmitReplySlipOptions {
    return Intl.message(
      'options',
      name: 'alreadySubmitReplySlipOptions',
      desc: '',
      args: [],
    );
  }

  /// `Come to school and find the School Affairs Office staff to help.`
  String get schoolVisitMessage {
    return Intl.message(
      'Come to school and find the School Affairs Office staff to help.',
      name: 'schoolVisitMessage',
      desc: '',
      args: [],
    );
  }

  /// `No message yet`
  String get emptyMessageInChatRoom {
    return Intl.message(
      'No message yet',
      name: 'emptyMessageInChatRoom',
      desc: '',
      args: [],
    );
  }

  /// `Type a message`
  String get enterMessageHint {
    return Intl.message(
      'Type a message',
      name: 'enterMessageHint',
      desc: '',
      args: [],
    );
  }

  /// `Chat`
  String get chatContact {
    return Intl.message(
      'Chat',
      name: 'chatContact',
      desc: '',
      args: [],
    );
  }

  /// `Failed to load message`
  String get getMessageFail {
    return Intl.message(
      'Failed to load message',
      name: 'getMessageFail',
      desc: '',
      args: [],
    );
  }

  /// `Slip left to cancel`
  String get slipLeft {
    return Intl.message(
      'Slip left to cancel',
      name: 'slipLeft',
      desc: '',
      args: [],
    );
  }

  /// `Camera`
  String get camera {
    return Intl.message(
      'Camera',
      name: 'camera',
      desc: '',
      args: [],
    );
  }

  /// `Photo gallery`
  String get gallery {
    return Intl.message(
      'Photo gallery',
      name: 'gallery',
      desc: '',
      args: [],
    );
  }

  /// `Teacher Name`
  String get teacherNameLabel {
    return Intl.message(
      'Teacher Name',
      name: 'teacherNameLabel',
      desc: '',
      args: [],
    );
  }

  /// `Teacher Phone Number`
  String get teacherPhoneLabel {
    return Intl.message(
      'Teacher Phone Number',
      name: 'teacherPhoneLabel',
      desc: '',
      args: [],
    );
  }

  /// `Send message failed`
  String get sendMessageFail {
    return Intl.message(
      'Send message failed',
      name: 'sendMessageFail',
      desc: '',
      args: [],
    );
  }

  /// `View Reward`
  String get rewardPage {
    return Intl.message(
      'View Reward',
      name: 'rewardPage',
      desc: '',
      args: [],
    );
  }

  /// `Class Management`
  String get classManagement {
    return Intl.message(
      'Class Management',
      name: 'classManagement',
      desc: '',
      args: [],
    );
  }

  /// `Class Attendance`
  String get classAttendance {
    return Intl.message(
      'Class Attendance',
      name: 'classAttendance',
      desc: '',
      args: [],
    );
  }

  /// `Class Homework`
  String get teacherAddClassHW {
    return Intl.message(
      'Class Homework',
      name: 'teacherAddClassHW',
      desc: '',
      args: [],
    );
  }

  /// `Select`
  String get SelectValue {
    return Intl.message(
      'Select',
      name: 'SelectValue',
      desc: '',
      args: [],
    );
  }

  /// `Please select a student''s attendance record`
  String get submitAttendanceListFailed {
    return Intl.message(
      'Please select a student\'\'s attendance record',
      name: 'submitAttendanceListFailed',
      desc: '',
      args: [],
    );
  }

  /// `Submit Successfully`
  String get sucessfullyApply {
    return Intl.message(
      'Submit Successfully',
      name: 'sucessfullyApply',
      desc: '',
      args: [],
    );
  }

  /// `Confirm Action`
  String get confirmAction {
    return Intl.message(
      'Confirm Action',
      name: 'confirmAction',
      desc: '',
      args: [],
    );
  }

  /// `Are you sure you want to submit the attendance list?`
  String get submitComfirm {
    return Intl.message(
      'Are you sure you want to submit the attendance list?',
      name: 'submitComfirm',
      desc: '',
      args: [],
    );
  }

  /// `Clear All Notifications`
  String get clearAllNotification {
    return Intl.message(
      'Clear All Notifications',
      name: 'clearAllNotification',
      desc: '',
      args: [],
    );
  }

  /// `Delete this Notifications`
  String get deleteNotificationByID {
    return Intl.message(
      'Delete this Notifications',
      name: 'deleteNotificationByID',
      desc: '',
      args: [],
    );
  }

  /// `Clear Notifications Failed`
  String get clearFailedNotification {
    return Intl.message(
      'Clear Notifications Failed',
      name: 'clearFailedNotification',
      desc: '',
      args: [],
    );
  }

  /// `Clear Notifications Success`
  String get clearSuccessNotification {
    return Intl.message(
      'Clear Notifications Success',
      name: 'clearSuccessNotification',
      desc: '',
      args: [],
    );
  }

  /// `Delete`
  String get Delete {
    return Intl.message(
      'Delete',
      name: 'Delete',
      desc: '',
      args: [],
    );
  }

  /// `Upload`
  String get uploadImage {
    return Intl.message(
      'Upload',
      name: 'uploadImage',
      desc: '',
      args: [],
    );
  }

  /// `Upload Failed`
  String get uploadFailed {
    return Intl.message(
      'Upload Failed',
      name: 'uploadFailed',
      desc: '',
      args: [],
    );
  }

  /// `Uploading`
  String get uploading {
    return Intl.message(
      'Uploading',
      name: 'uploading',
      desc: '',
      args: [],
    );
  }

  /// `Create failed`
  String get createHomeworkFailed {
    return Intl.message(
      'Create failed',
      name: 'createHomeworkFailed',
      desc: '',
      args: [],
    );
  }

  /// `Create successfully`
  String get createHomeworkSuccessful {
    return Intl.message(
      'Create successfully',
      name: 'createHomeworkSuccessful',
      desc: '',
      args: [],
    );
  }

  /// `Edit homework data`
  String get editHomeworkData {
    return Intl.message(
      'Edit homework data',
      name: 'editHomeworkData',
      desc: '',
      args: [],
    );
  }

  /// `Edit failed`
  String get editHomeworkFailed {
    return Intl.message(
      'Edit failed',
      name: 'editHomeworkFailed',
      desc: '',
      args: [],
    );
  }

  /// `Edit successfully`
  String get editHomeworkSuccessful {
    return Intl.message(
      'Edit successfully',
      name: 'editHomeworkSuccessful',
      desc: '',
      args: [],
    );
  }

  /// `Not available interest class found`
  String get emptyInterestClass {
    return Intl.message(
      'Not available interest class found',
      name: 'emptyInterestClass',
      desc: '',
      args: [],
    );
  }

  /// `Attendance Time`
  String get attendanceTime {
    return Intl.message(
      'Attendance Time',
      name: 'attendanceTime',
      desc: '',
      args: [],
    );
  }

  /// `No Record`
  String get attendanceNotTake {
    return Intl.message(
      'No Record',
      name: 'attendanceNotTake',
      desc: '',
      args: [],
    );
  }

  /// `Card Number`
  String get cardNumber {
    return Intl.message(
      'Card Number',
      name: 'cardNumber',
      desc: '',
      args: [],
    );
  }

  /// `Card Holder Name`
  String get cardHolderName {
    return Intl.message(
      'Card Holder Name',
      name: 'cardHolderName',
      desc: '',
      args: [],
    );
  }

  /// `Card Expiry Date`
  String get cardExpiryDate {
    return Intl.message(
      'Card Expiry Date',
      name: 'cardExpiryDate',
      desc: '',
      args: [],
    );
  }

  /// `Card CVV`
  String get cardCvv {
    return Intl.message(
      'Card CVV',
      name: 'cardCvv',
      desc: '',
      args: [],
    );
  }

  /// `Class Student Grade`
  String get checkGrade {
    return Intl.message(
      'Class Student Grade',
      name: 'checkGrade',
      desc: '',
      args: [],
    );
  }

  /// `Submit successfully`
  String get submitSeatSuccessfully {
    return Intl.message(
      'Submit successfully',
      name: 'submitSeatSuccessfully',
      desc: '',
      args: [],
    );
  }

  /// `Submit Failed`
  String get submitSeatFailed {
    return Intl.message(
      'Submit Failed',
      name: 'submitSeatFailed',
      desc: '',
      args: [],
    );
  }

  /// `Seating Table`
  String get seat {
    return Intl.message(
      'Seating Table',
      name: 'seat',
      desc: '',
      args: [],
    );
  }

  /// `Please fill in phone number and password`
  String get emptyInput {
    return Intl.message(
      'Please fill in phone number and password',
      name: 'emptyInput',
      desc: '',
      args: [],
    );
  }
}

class AppLocalizationDelegate extends LocalizationsDelegate<S> {
  const AppLocalizationDelegate();

  List<Locale> get supportedLocales {
    return const <Locale>[
      Locale.fromSubtags(languageCode: 'en'),
      Locale.fromSubtags(languageCode: 'zh'),
    ];
  }

  @override
  bool isSupported(Locale locale) => _isSupported(locale);
  @override
  Future<S> load(Locale locale) => S.load(locale);
  @override
  bool shouldReload(AppLocalizationDelegate old) => false;

  bool _isSupported(Locale locale) {
    for (var supportedLocale in supportedLocales) {
      if (supportedLocale.languageCode == locale.languageCode) {
        return true;
      }
    }
    return false;
  }
}
