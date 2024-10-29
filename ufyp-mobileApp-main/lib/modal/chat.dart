import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:intl/intl.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:video_thumbnail/video_thumbnail.dart';

class ChatContacts {
  String chatRoomID;
  String? s_Id;
  String? t_Id;
  String? t_ChiName;
  String? t_EngName;
  String? parent_Name;
  String? lastMessage;
  String? lastMessageTime;
  String? lastMessageSender;
  String? lastMessageSenderEngName;
  String? lastMessageSenderChiName;
  int? messageUnReadNumber;
  String? roomType;
  String? groupName;

  ChatContacts({
    required this.chatRoomID,
    this.s_Id,
    this.t_Id,
    this.t_ChiName,
    this.t_EngName,
    this.parent_Name,
    this.lastMessage,
    this.lastMessageTime,
    this.lastMessageSender,
    this.lastMessageSenderEngName,
    this.lastMessageSenderChiName,
    this.messageUnReadNumber,
    this.groupName,
    this.roomType,
  });

  
  factory ChatContacts.fromJson(Map<String, dynamic> json,String roomType) {
    return ChatContacts(
      chatRoomID: json['chatRoomID'],
      s_Id: json['s_Id'],
      t_Id: json['t_Id'],
      t_ChiName: json['t_ChiName'],
      t_EngName: json['t_EngName'],
      parent_Name: json['parent_Name'],
      lastMessage: json['lastMessage'],
      lastMessageTime: json['lastMessageTime'],
      lastMessageSender: json['lastMessageSender'],
      lastMessageSenderEngName: json['lastMessageSenderEngName'],
      lastMessageSenderChiName: json['lastMessageSenderChiName'],
      messageUnReadNumber: json['numberOfUnReadMessage'],
      groupName: json['groupName'],
      roomType: roomType,
    );
  }

    void printData() {
      print('ChatRoomID: $chatRoomID');
      print('s_Id: $s_Id');
      print('t_Id: $t_Id');
      print('t_ChiName: $t_ChiName');
      print('t_EngName: $t_EngName');
      print('parent_Name: $parent_Name');
      print('lastMessage: $lastMessage');
      print('lastMessageTime: $lastMessageTime');
      print('lastMessageSender: $lastMessageSender');
      print('lastMessageSenderEngName: $lastMessageSenderEngName');
      print('lastMessageSenderChiName: $lastMessageSenderChiName');
      print('messageUnReadNumber: $messageUnReadNumber');
      print('groupName: $groupName');
      print('roomType: $roomType');
    }

  static String formatTime(String timestamp) {

    var now = DateTime.now().add(Duration(hours: 8));
    var today = "${now.day.toString().padLeft(2, '0')}/${now.month.toString().padLeft(2, '0')}/${now.year}";

    var parts = timestamp.split('-');
    var date = parts[0];
    var time = parts[1];

    if (date == today) {
      return time;
    } else {
      return date;
    }
  }

}

class ChatMessage {
  ChatMessage({
    required this.id,
    this.text,
    this.type,
    this.attachment,
    this.voice,
    required this.read,
    required this.createdAt,
    required this.isMe,
    this.thumbnailData,
  });

  int id;
  String? text;
  String? type;
  String? attachment;
  String? voice;
  String createdAt;
  bool read;
  bool isMe;
  Uint8List? thumbnailData;
  
  ChatMessage copyWith({
  required int id,
  String? text,
  String? type,
  String? attachment,
  String? voice,
  //required bool read,
  required String createdAt,
  required bool isMe,
  }) => 
    ChatMessage(
      id: id,
      text: text,
      type: type,
      attachment: attachment,
      voice: voice,
      isMe: isMe,
      read:read,
      createdAt: createdAt,
    );

  factory ChatMessage.fromJson(Map<String, dynamic> json) => ChatMessage(
    id: json["id"],
    text: json["message"],
    type: json["type"],
    attachment: json["attachment"],
    voice: json["voice"],
    isMe: json["senderID"] == AppUser.id,  
    read: json["read"],
    createdAt: formatTime(json["time"]),
  );

  static String formatTime(String timestamp) {
    var now = DateTime.now().add(Duration(hours: 8));
    var today = "${now.day.toString().padLeft(2, '0')}/${now.month.toString().padLeft(2, '0')}/${now.year}";

    var parts = timestamp.split('-');
    var date = parts[0];
    var time = parts[1];

    if (date == today) {
      return time;
    } else {
      return date+" "+time;
    }
  }

  static int getMaxId(List<ChatMessage> messages) {
    int maxId = messages[0].id;
    for (var message in messages) {
      if (message.id > maxId) {
        maxId = message.id;
      }
    }
    return maxId;
  }


  static List<ChatMessage> sortById(List<ChatMessage> messages) {
    messages.sort((a, b) => b.id.compareTo(a.id));
    return messages;
  }



}








