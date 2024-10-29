import 'package:flutter/material.dart';
import 'package:my_app/api/firebase_api.dart';
import 'package:my_app/common/help.dart';
import 'package:my_app/common/settings.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/globalVariable.dart';

import 'package:my_app/teacher/teacher_drawer_item.dart';
import 'package:my_app/teacher/teacher_drawer_list.dart';

import '../common/contacts.dart';
import '../pages/dashboard.dart';
import 'teacher_drawer_header.dart';
import '../pages/notifications.dart';

class TeacherHomePage extends StatefulWidget {
  final TeacherDrawerSections currentPage;
  final String title;
  TeacherHomePage({required Key key, required this.currentPage,required this.title}) : super(key: key);

  @override
  State<TeacherHomePage> createState() => _TeacherPageState();
}

class _TeacherPageState extends State<TeacherHomePage> {
  var currentPage;
  var appBarTitle;
  FirebaseApi notificationServices = FirebaseApi();

  @override
  void initState() {
    super.initState();
    notificationServices.requestNotificationPermission();
    notificationServices.firebaseInit(context);
    notificationServices.forgroundMessage();
    notificationServices.setupInteractMessage(context);
    currentPage = widget.currentPage;
    appBarTitle = widget.title;
  }

  @override 
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.grey[500],
        title: Text(appBarTitle),
      ),
      body: PageBuilder.buildPage(currentPage),
      drawer: Drawer(
        child: SingleChildScrollView(
          child: Container(
            child: Column(
              children: [
                TeacherDrawer(),
                MyDrawerList(currentPage: currentPage, onMenuItemTap: (TeacherDrawerSections section, String title) {
                  Navigator.pop(context);
                  setState(() { 
                    currentPage = section;
                    appBarTitle = title;
                  });
                }),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

