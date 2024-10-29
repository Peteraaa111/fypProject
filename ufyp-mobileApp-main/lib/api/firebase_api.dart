

import 'dart:convert';
import 'dart:io';
import 'dart:math';


import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:my_app/modal/chat.dart';
import 'package:my_app/pages/chatPage/chatRoomMessage.dart';
import 'package:my_app/pages/schoolReplySlipPage/schoolReplySlipDetailPage.dart';
import 'package:my_app/parent/parent_drawer_item.dart';
import 'package:my_app/parent/parent_home_page.dart';

import '../generated/l10n.dart';
import '../modal/StudentData.dart';
import 'api.dart';


class FirebaseApi {

  //initialising firebase message plugin
  final  _firebaseMessaging = FirebaseMessaging.instance;

  //initialising firebase message plugin
  final FlutterLocalNotificationsPlugin _flutterLocalNotificationsPlugin  = FlutterLocalNotificationsPlugin();



  //function to initialise flutter local notification plugin to show notifications for android when app is active
  void initLocalNotifications(BuildContext context, RemoteMessage message)async{
    var androidInitializationSettings = const AndroidInitializationSettings('mipmap/schoollogo');
    var iosInitializationSettings = const DarwinInitializationSettings();


    var initializationSetting = InitializationSettings(
        android: androidInitializationSettings ,
        iOS: iosInitializationSettings
    );

    await _flutterLocalNotificationsPlugin.initialize(
        initializationSetting,
      onDidReceiveNotificationResponse: (payload){
          // handle interaction when app is active for android
          handleMessage(context, message);
      }
    );
  }

  void firebaseInit(BuildContext context){

    FirebaseMessaging.onMessage.listen((message) {
      RemoteNotification? notification = message.notification ;
      AndroidNotification? android = message.notification!.android ;

      if (kDebugMode) {
        print("notifications title:${notification!.title}");
        print("notifications body:${notification.body}");
        print('count:${android!.count}');
        print('data:${message.data.toString()}');
      }

      if(Platform.isIOS){
        forgroundMessage();
      }

      if(Platform.isAndroid){
        initLocalNotifications(context, message);
        showNotification(message);
      }
    });
  }


  void requestNotificationPermission() async {
    NotificationSettings settings = await _firebaseMessaging.requestPermission(
        alert: true,
        announcement: true,
        badge: true,
        carPlay: true,
        criticalAlert: true,
        provisional: true,
        sound: true ,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      if (kDebugMode) {
        print('user granted permission');
      }
    } else if (settings.authorizationStatus ==
        AuthorizationStatus.provisional) {
      if (kDebugMode) {
        print('user granted provisional permission');
      }
    } else {
      //appsetting.AppSettings.openNotificationSettings();
      if (kDebugMode) {
        print('user denied permission');
      }
    }
  }

  // function to show visible notification when app is active
  Future<void> showNotification(RemoteMessage message)async{

    AndroidNotificationChannel channel = AndroidNotificationChannel(
      'CityPrimarySchool',
      'City Primary School',
      description: 'City Primary School',
      importance: Importance.max,
      showBadge: true,
      playSound: true,
      //sound: const RawResourceAndroidNotificationSound('jetsons_doorbell')
    );

     AndroidNotificationDetails androidNotificationDetails = AndroidNotificationDetails(
      channel.id.toString(),
      channel.name.toString() ,
      channelDescription: channel.description,
      importance: Importance.high,
      priority: Priority.high,
      playSound: true,
      ticker: 'ticker',
      sound: channel.sound,
      icon: '@mipmap/schoollogo' // Add this line
    );

    const DarwinNotificationDetails darwinNotificationDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
      subtitle: 'Subtitle', // Add this line
      threadIdentifier: 'thread1' // Add this line
    ) ;

    NotificationDetails notificationDetails = NotificationDetails(
      android: androidNotificationDetails,
      iOS: darwinNotificationDetails
    );

    Future.delayed(Duration.zero , (){
      _flutterLocalNotificationsPlugin.show(
          0,
          message.notification!.title.toString(),
          message.notification!.body.toString(),
          notificationDetails,
      );
    });

  }

  //function to get device token on which we will send the notifications
  // Future<String> getDeviceToken() async {
  //   String? token = await _firebaseMessaging.getToken();
  //   print(token);
  //   return token!;
  // }

  static Future<String> getDeviceToken() async {
    String? token = await FirebaseMessaging.instance.getToken();
    return token!;
  }

  void isTokenRefresh()async{
    _firebaseMessaging.onTokenRefresh.listen((event) {
      event.toString();
      if (kDebugMode) {
        print('refresh');
      }
    });
  }

  //handle tap on notification when app is in background or terminated
  Future<void> setupInteractMessage(BuildContext context)async{

    // when app is terminated
    RemoteMessage? initialMessage = await FirebaseMessaging.instance.getInitialMessage();

    if(initialMessage != null){
      handleMessage(context, initialMessage);
    }


    //when app ins background
    FirebaseMessaging.onMessageOpenedApp.listen((event) {
      handleMessage(context, event);
    });

  }

  Future<void> handleMessage(BuildContext context, RemoteMessage message) async {
    String? type = message.data['type'];
    print('Type: $type');
    if(type =='tt'){
      print("testing sss");
      Navigator.pushReplacement(context,
        MaterialPageRoute(builder: (context) => parentHomePage(key: UniqueKey(),currentPage: ParentDrawerSections.settings,title:S.current.settings)),
      );
    }
    else if(type =='ReplySlip'){
      Navigator.pushReplacement(context,
        MaterialPageRoute(builder: (context) => parentHomePage(key: UniqueKey(),currentPage: ParentDrawerSections.replySlip,title:S.current.replySlip)),
      );
    }else if (type =='Exam'){
      Navigator.pushReplacement(context,
        MaterialPageRoute(builder: (context) => parentHomePage(key: UniqueKey(),currentPage: ParentDrawerSections.gradeCheck,title:S.current.gradeCheck)),
      );
    }else if(type == 'Homework'){
      Navigator.pushReplacement(context,
        MaterialPageRoute(builder: (context) => parentHomePage(key: UniqueKey(),currentPage: ParentDrawerSections.classHomework,title:S.current.classHomework)),
      );
    }else if(type == 'Chat'){
      print(AppUser.role);
      if(AppUser.role == 'Teacher'){
        final res = await UserApi().getTeacherChatListByID(jsonEncode({'teacherID': AppUser.id,'classID':AppUser.currentClass}),context);
        ChatContacts chatContacts = ChatContacts.fromJson(res['data'][0],'single');
        //chatContacts.printData();
        Navigator.push(
          context,
            MaterialPageRoute(
              builder: (context) => MessagePage(chatContacts: chatContacts),
            ),
        );
      }else{
        final res = await UserApi().getChatListByID(jsonEncode({'studentID': AppUser.id,'classID':AppUser.currentClass}),context);
        ChatContacts chatContacts = ChatContacts.fromJson(res['data'][0],'single');
        Navigator.push(
          context,
            MaterialPageRoute(
              builder: (context) => MessagePage(chatContacts: chatContacts),
            ),
        );
      }
    }
  }


  Future forgroundMessage() async {
    await FirebaseMessaging.instance.setForegroundNotificationPresentationOptions(
      alert: true,
      badge: true,
      sound: true,
    );
  }


}