import 'dart:convert';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/toastMessage.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/chat.dart';
import 'package:my_app/modal/globalVariable.dart';
import 'package:my_app/pages/chatPage/chatRoomMessage.dart';

class ChatContactsPage extends StatefulWidget {
  @override
  _ChatContactsPageState createState() => _ChatContactsPageState();
}

class _ChatContactsPageState extends State<ChatContactsPage> {
  List<ChatContacts> _contacts = [];

  @override
  void initState() {
    super.initState();
    fetchContacts();
  }

  fetchContacts() async {
    if(AppUser.role =='Student'){
      try {
        _contacts.clear();
        final res2 = await UserApi().getGroupChatList(jsonEncode({'classID':AppUser.currentClass}),context);
        if (res2['success']){


          for(var i = 0; i < res2['data'].length; i++){            
            _contacts.add(ChatContacts.fromJson(res2['data'][i],"group"));      
          }
          
        }
        final res = await UserApi().getChatListByID(jsonEncode({'studentID': AppUser.id,'classID':AppUser.currentClass}),context);
        print(res);
        if (res['success']) {
          for(var i = 0; i < res['data'].length; i++){            
            _contacts.add(ChatContacts.fromJson(res['data'][i],'single'));      
          }
        } 
      } catch (e) {
        ToastMessage.show(S.current.readFail);
      }
      setState(() {});
    }else if(AppUser.role =='Teacher'){
      try {
        _contacts.clear();
        final res2 = await UserApi().getGroupChatList(jsonEncode({'classID':AppUser.currentClass}),context);
        if (res2['success']){


          for(var i = 0; i < res2['data'].length; i++){            
            _contacts.add(ChatContacts.fromJson(res2['data'][i],"group"));      
          }
          
        }
        final res = await UserApi().getTeacherChatListByID(jsonEncode({'teacherID': AppUser.id,'classID':AppUser.currentClass}),context);
        if (res['success']) {
          for(var i = 0; i < res['data'].length; i++){            
            _contacts.add(ChatContacts.fromJson(res['data'][i],'single'));      
          }
        } 
      } catch (e) {
        ToastMessage.show(S.current.readFail);
      }
      setState(() {});
    }
  }




  
  Text getRoleBasedText(ChatContacts chatContacts) {
    if(chatContacts.roomType == 'single'){
      if (AppUser.role == 'Student') {
        if(GlobalVariable.isChineseLocale){
          return Text(chatContacts.t_ChiName!,style: TextStyle(fontSize: 18.0));
        }else{
          return Text(chatContacts.t_EngName!, style: TextStyle(fontSize: 18.0));
        }
      } else {
        return Text(chatContacts.parent_Name!, style: TextStyle(fontSize: 18.0));
      }
    }else if (chatContacts.roomType == 'group'){
      return Text(chatContacts.groupName!, style: TextStyle(fontSize: 18.0));
    }
    
    return Text('');
  }

  Text getLastMessageText(ChatContacts chatContacts,String type) {
    if(chatContacts.roomType == 'single'){
      if(chatContacts.lastMessage != null){
        if(type=='Image'){
          if (AppUser.id == chatContacts.lastMessageSender) {
            if(GlobalVariable.isChineseLocale){
              return Text('你: [圖片]',style: TextStyle(fontSize: 15.0));
            }else{
              return Text('You: [Image]', style: TextStyle(fontSize: 15.0));
            }
          } else {
            if(GlobalVariable.isChineseLocale){
              return Text('[圖片]', style: TextStyle(fontSize: 15.0));
            }else{
              return Text('[Image]', style: TextStyle(fontSize: 15.0));
            }
          }
        }else if (type =='text'){
          if (AppUser.id == chatContacts.lastMessageSender) {
            if(GlobalVariable.isChineseLocale){
              return Text('你: ${chatContacts.lastMessage!}',style: TextStyle(fontSize: 15.0));
            }else{
              return Text('You: ${chatContacts.lastMessage!}', style: TextStyle(fontSize: 15.0));
            }
          } else {
            return Text(chatContacts.lastMessage!, style: TextStyle(fontSize: 15.0));
          }
        }else if(type =='audio'){
          if (AppUser.id == chatContacts.lastMessageSender) {
            if(GlobalVariable.isChineseLocale){
              return Text('你: [語音]',style: TextStyle(fontSize: 15.0));
            }else{
              return Text('You: [Audio]', style: TextStyle(fontSize: 15.0));
            }
          } else {
            if(GlobalVariable.isChineseLocale){
              return Text('[語音]', style: TextStyle(fontSize: 15.0));
            }else{
              return Text('[Audio]', style: TextStyle(fontSize: 15.0));
            }
          }
        }else{
          return Text('');
        }
      }
    }
    else if (chatContacts.roomType == 'group'){
      if(chatContacts.lastMessage != null){
        if(type=='Image'){
          if (AppUser.id == chatContacts.lastMessageSender) {
            if(GlobalVariable.isChineseLocale){
              return Text('你: [圖片]',style: TextStyle(fontSize: 15.0));
            }else{
              return Text('You: [Image]', style: TextStyle(fontSize: 15.0));
            }
          } else {
            if(GlobalVariable.isChineseLocale){
              return Text(chatContacts.lastMessageSenderChiName! + ': [圖片]', style: TextStyle(fontSize: 15.0));
            }else{
              return Text(chatContacts.lastMessageSenderEngName! + ': [Image]', style: TextStyle(fontSize: 15.0));
            }
          }
        }else if (type =='text'){
          if (AppUser.id == chatContacts.lastMessageSender) {
            if(GlobalVariable.isChineseLocale){
              return Text('你: ${chatContacts.lastMessage!}',style: TextStyle(fontSize: 15.0));
            }else{
              return Text('You: ${chatContacts.lastMessage!}', style: TextStyle(fontSize: 15.0));
            }
          } else {
            if(GlobalVariable.isChineseLocale){
              return Text(chatContacts.lastMessageSenderChiName! +": " + chatContacts.lastMessage!, style: TextStyle(fontSize: 15.0));
            }
            else{
              return Text(chatContacts.lastMessageSenderEngName! +": " +chatContacts.lastMessage!, style: TextStyle(fontSize: 15.0));
            }
          }
        }else if(type =='audio'){
          if (AppUser.id == chatContacts.lastMessageSender) {
            if(GlobalVariable.isChineseLocale){
              return Text('你: [語音]',style: TextStyle(fontSize: 15.0));
            }else{
              return Text('You: [Audio]', style: TextStyle(fontSize: 15.0));
            }
          } else {
            if(GlobalVariable.isChineseLocale){
              return Text(chatContacts.lastMessageSenderChiName! +': [語音]', style: TextStyle(fontSize: 15.0));
            }else{
              return Text(chatContacts.lastMessageSenderChiName! +': [Audio]', style: TextStyle(fontSize: 15.0));
            }
          }
        }else{
          return Text('');
        }
      }
    }

    return Text('');
    
  }

  Widget buildUnreadMessageCount(ChatContacts chatContacts) {
    if (chatContacts.messageUnReadNumber != null && chatContacts.messageUnReadNumber! > 0) {
      return Padding(
        padding: EdgeInsets.only(right: 10), // Adjust the value as needed
        child: Container(
          width: 20, // Adjust as needed
          height: 20, // Adjust as needed
          decoration: BoxDecoration(
            color: Colors.blue,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              chatContacts.messageUnReadNumber!.toString(),
              style: TextStyle(
                color: Colors.white,
                fontSize: 12, // Adjust as needed
              ),
            ),
          ),
        ),
      );
    } else {
      return Container(); 
    }
  }

  Stream<QuerySnapshot> getChatRoomMessagesStream(ChatContacts contact, {String? senderId, bool? isRead, bool? getLastMessage}) {
    String yearSelector = '${GlobalVariable.currentYear}-${GlobalVariable.nextYear}';
    String chatRoomCollection = 'academicYear/$yearSelector/class/${AppUser.currentClass}/chat/chatRoom${contact.chatRoomID}/message';

    Query query = FirebaseFirestore.instance.collection(chatRoomCollection);

    if (senderId != null) {
      query = query.where('senderID', isNotEqualTo: senderId);
    }

    if (isRead != null) {
      query = query.where('read', isEqualTo:isRead);
    }

    if (getLastMessage != null && getLastMessage) {
      query = query.orderBy('id',descending: true).limit(1);
    }

    return query.snapshots();
  }

  Stream<QuerySnapshot> getUnreadMessagesStream(ChatContacts contact) {
    return getChatRoomMessagesStream(contact, senderId: AppUser.id, isRead: false);
  }

  Stream<QuerySnapshot> getLastMessageStream(ChatContacts contact) {
    return getChatRoomMessagesStream(contact, getLastMessage: true);
  }

  

  @override
  Widget build(BuildContext context) {
    return Container(
      child:ListView.builder(
        itemCount: _contacts.length,
        itemBuilder: (context, index) {
        return Padding(
          padding: EdgeInsets.only(top: 15.0),
          child: GestureDetector( // Add this
            onTap: () {
              Navigator.push(
                context,
                  MaterialPageRoute(
                    builder: (context) => MessagePage(chatContacts: _contacts[index]),
                  ),
              );
            }, 
            child: Container(
              padding: EdgeInsets.symmetric(horizontal: 20.0),
              child: Container(
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey[400]!),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  children: <Widget>[
                    Padding(
                      padding: EdgeInsets.only(left: 10.0),
                      child: CircleAvatar(
                        radius: 35,
                        backgroundColor: Colors.transparent,
                        backgroundImage: AssetImage('lib/images/default-avatar.png'),
                      ),
                    ),
                    Expanded(
                      child: Padding(
                        padding: EdgeInsets.only(left: 10.0, bottom: 10),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            Column(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    StreamBuilder<QuerySnapshot>(
                                      stream: getLastMessageStream(_contacts[index]),
                                      builder: (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
                                        if (snapshot.data?.docs.isNotEmpty == true) {

                                          DocumentSnapshot lastMessage = snapshot.data!.docs.first;
                                          String lastMessageTime = lastMessage.get('time');
                                          String lastMessageText = lastMessage.get('message');
                                          String lastMessageSender = lastMessage.get('senderID');
                                          String lastMessageType = lastMessage.get('type');
                                          _contacts[index].lastMessage = lastMessageText;
                                          _contacts[index].lastMessageTime = lastMessageTime;
                                          _contacts[index].lastMessageSender = lastMessageSender;
                                          if(_contacts[index].roomType == 'group'){
                                            _contacts[index].lastMessageSenderChiName = lastMessage.get('SenderChiName');
                                            _contacts[index].lastMessageSenderEngName = lastMessage.get('SenderEngName');
                                          }
                                          
                                          
                             
                                          return Column(

                                            children: <Widget>[
                                              Container(
                                                width: MediaQuery.of(context).size.width-135,
                                                child: Row(
                                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                                  children: <Widget>[
                                                    Container(
                                                      //crossAxisAlignment: CrossAxisAlignment.stretch,
                                                      child:getRoleBasedText(_contacts[index]),
                                                    ),
                                                    Spacer(),
                                                    Container(
                                                      child:Padding(
                                                        padding:EdgeInsets.only(right: 10.0),
                                                          child: Text(
                                                            _contacts[index].lastMessageTime != null 
                                                              ? ChatContacts.formatTime(_contacts[index].lastMessageTime!) 
                                                              : '' // Replace 'Default Value' with any default string you want to show when lastMessageTime is null
                                                          ),
                                                      ),
                                                    )

                                                  ],
                                                ),
                                              ),
                                              Container(
                                                width: MediaQuery.of(context).size.width-135,
                                                child: Row(
                                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                                  children: <Widget>[
                                                    Container(
                                                      //crossAxisAlignment: CrossAxisAlignment.stretch,
                                                      child:Padding(
                                                        padding: EdgeInsets.only(top: 5.0), // Adjust this value as needed
                                                        child: getLastMessageText(_contacts[index],lastMessageType!),
                                                      ),
                                                    ),
                                                    Spacer(),
                                                    Container(
                                                      child: StreamBuilder<QuerySnapshot>(
                                                        stream: getUnreadMessagesStream(_contacts[index]),
                                                        builder: (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
                                                          if (snapshot.hasData) {
                                                            int unreadMessageCount = snapshot.data!.docs.length;
                                                            _contacts[index].messageUnReadNumber = unreadMessageCount;
                                                            return Column(
                                                              crossAxisAlignment: CrossAxisAlignment.end,
                                                              children: [
                                                                buildUnreadMessageCount(_contacts[index]),

                                                              ],
                                                            );  
                                                          } else {
                                                            return Container();
                                                          }
                                                        },
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ],
                                          );
                                        } else {
                                          return Container();
                                        }
                                      },
                                    ),
                                  ],
                                ),
                              ],
                            ), 
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
        },
      ),
    );
  }
}