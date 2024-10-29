import 'dart:async';
import 'dart:convert';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:my_app/api/firebase_api.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/parent/parent_drawer_item.dart';
import 'package:my_app/parent/parent_home_page.dart';
import 'package:my_app/teacher/teacher_drawer_item.dart';
import 'package:my_app/teacher/teacher_home_page.dart';
import 'package:my_app/pages/login_page.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:my_app/modal/StudentData.dart';
import '../api/api.dart';  



class AuthPage extends StatelessWidget {
  AuthPage({Key? key}) : super(key: key);
  
  Future getData(String UID, BuildContext context) async {
    final DocumentSnapshot<Map<String, dynamic>> userDoc = await FirebaseFirestore.instance.collection('users').doc(UID).get();
    String role = userDoc['role'];
    if (userDoc.exists) {
      //if (!userDoc.data()!.containsKey('deviceID')) {
      String deviceID = await FirebaseApi.getDeviceToken();
      await UserApi().saveDeviceID(jsonEncode({'uid':UID, 'deviceID':deviceID,'role':role}),context);
      print(deviceID);
      //} 
      if(role == 'Parent'){
        final res = await UserApi().getStudentDataByID(jsonEncode({'uid': UID}), context);
        Student.setProperties(res);
      }else{
        final res = await UserApi().getTeacherDataByID(jsonEncode({'uid': UID}), context);
        Teacher.setProperties(res);
      }
      return role;
    } else {
      throw Exception('User document does not exist');
    }
  }
   
  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return CircularProgressIndicator();
        } else if (snapshot.hasData) {
          return _buildPage(snapshot.data!,context);
        } else { 
          return LoginPage();
        }
      },
    );
  }

  Widget _buildPage(User currentUser, BuildContext context) {
    return FutureBuilder(
      future: getData(currentUser.uid, context),
      builder: (BuildContext context, AsyncSnapshot snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator()); 
        } else if (snapshot.hasError) {
          return Text('Error: ${snapshot.error}');
        } else {
          String role = snapshot.data; 
          if(role == 'Parent'){
            return parentHomePage(
              key: UniqueKey(),
              currentPage: ParentDrawerSections.dashboard,
              title: S.current.dashboard,
            );
          }else if (role == 'Teacher'){
            return TeacherHomePage(
              key: UniqueKey(),
              currentPage: TeacherDrawerSections.dashboard,
              title: S.current.dashboard,
            );
          }
          return LoginPage();
        }
      },
    );
  }
}

  