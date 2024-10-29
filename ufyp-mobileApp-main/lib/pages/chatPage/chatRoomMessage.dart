import 'dart:async';
import 'dart:convert';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/toastMessage.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/chat.dart';
import 'package:my_app/modal/color_constants.dart';
import 'package:my_app/modal/globalVariable.dart';
import 'package:my_app/pages/chatPage/chatRoomInputField.dart';
import 'package:my_app/pages/chatPage/chatRoomMessageWidget.dart';
import 'package:simple_animations/simple_animations.dart';

class MessagePage extends StatefulWidget {
  final ChatContacts chatContacts;


  const MessagePage({Key? key, required this.chatContacts}) : super(key: key);

  @override
  State<MessagePage> createState() => _MessagePageState();
}

class _MessagePageState extends State<MessagePage> with AnimationMixin {
  late String yearSelector='';
  late String chatRoomMessageCollection='';  

  List<ChatMessage> chatMessageList = []; 
  final textController = TextEditingController();
  final _scrollController = ScrollController();

  late Animation<double> opacity;
  late AnimationController slideInputController;
  late Animation<Offset> slideInputAnimation;

  var isVisible = true;

  @override
  void initState() {
    super.initState();
    yearSelector = '${GlobalVariable.currentYear}-${GlobalVariable.nextYear}';
    chatRoomMessageCollection = 'academicYear/${yearSelector}/class/${AppUser.currentClass}/chat/${"chatRoom"+widget.chatContacts.chatRoomID}/message';  

    slideInputController = createController()..duration = Duration(milliseconds: 500);

    slideInputAnimation = Tween<Offset>(
      begin: Offset(0, 0),
      end: Offset(-2, 0),
    ).animate(slideInputController);
    opacity = Tween<double>(begin: 1, end: 0).animate(controller);
    controller.duration = Duration(milliseconds: 200);
  }

  String getCurrentTime() {
    var now = DateTime.now().add(Duration(hours: 8));
    var formatter = DateFormat('HH:mm');
    return formatter.format(now);
  }

  addToMessages(String text,String type) async {
    try {
      
      final res = await UserApi().sendMessageInChatRoom(jsonEncode({
        'senderID': AppUser.id,
        'classID':AppUser.currentClass,
        'type': type,
        'chatRoomID':widget.chatContacts.chatRoomID,
        'message':text})
        ,context);

      if (res['success']) {

      }else{
        ToastMessage.show(S.current.sendMessageFail);
      } 
      

    } catch (e) {
      ToastMessage.show(S.current.sendMessageFail);
    }

  } 

  void updateMessageReadStatus(String messageId) {
    FirebaseFirestore.instance
        .collection(chatRoomMessageCollection)
        .doc(messageId)
        .update({'read': true})
        .then((_) => print('Message read status updated'))
        .catchError((error) => print('Failed to update message read status: $error'));
  }


  hideTheMic() {
    controller.play(); 
    controller.addStatusListener((status) {
      setState(() {
        if (status == AnimationStatus.completed && isVisible) {
          isVisible = false;
        }
      });
    });
  }

  showTheMic() {
    isVisible = true;
    controller.reverse();
  }

  Text getRoleBasedText(ChatContacts chatContacts, ThemeData theme) {
    if (chatContacts.roomType == 'single'){
      if (AppUser.role == 'Student') {
        if(GlobalVariable.isChineseLocale){
          return Text(chatContacts.t_ChiName!, style: theme.textTheme.titleMedium);
        }else{
          return Text(chatContacts.t_EngName!, style: theme.textTheme.titleMedium);
        }
      } else {
        return Text(chatContacts.parent_Name!, style: theme.textTheme.titleMedium);
      }
    }
    else if (chatContacts.roomType == 'group'){
      return Text(chatContacts.groupName!, style: TextStyle(fontSize: 18.0));
    }
    return Text('');
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: ColorConstants.lightBackgroundColor,
      appBar: AppBar(
        leading: BackButton(color: Colors.black),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        titleSpacing: 0,
        title: ListTile(
          onTap: () {},
          leading: CircleAvatar(
            backgroundColor: Colors.transparent,
            backgroundImage: AssetImage('lib/images/default-avatar.png'),
          ),
          title: getRoleBasedText(widget.chatContacts, theme),
          //subtitle: Text('last seen yesterday at 21:05', style: theme.textTheme.bodySmall),
        ),
        actions: [
          IconButton(
            splashRadius: 20,
            icon: Icon(Icons.videocam, color: Colors.grey.shade700,),
            onPressed: () {
              //Navigator.pushNamed(context, '/video-call', arguments: chat);
            },
          ),
          IconButton(
            splashRadius: 20,
            icon: Icon(Icons.phone, color: Colors.grey.shade700,),
            onPressed: () {},
          ),
        ],
      ),
      // a message list
      body: Stack(
        fit: StackFit.expand,
        children: [
          Container(
            child: Column(
              children: [
                StreamBuilder<QuerySnapshot>(
                  stream: FirebaseFirestore.instance.collection(chatRoomMessageCollection).snapshots(),
                  builder: (BuildContext context, AsyncSnapshot<QuerySnapshot>snapshot) {
                    if (snapshot.hasData) {

                      List<ChatMessage> chatMessageList = snapshot.data!.docs.map((doc) {
                        Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
                        ChatMessage message = ChatMessage.fromJson(data);

                        if (!message.isMe && !message.read) {
                          updateMessageReadStatus(doc.id);
                        }

                        return message;
                      }).toList();
                      ChatMessage.sortById(chatMessageList);

                      // Initialize the lists
                      List<String> imageUrlList = [];
                      //List<String> videoUrlList = [];
                      imageUrlList.sort((a, b) => a.compareTo(b));
                      // Populate the lists
                      chatMessageList.forEach((message) async {
                        if (message.type == 'Image') {
                          imageUrlList.add(message.text!);
                        } 
                        // else if (message.type == 'Video') {
                        //   videoUrlList.add(message.text!);                      
                        // }
                      });

                      int imageUrlListLength = imageUrlList.length;
                      //int videoUrlListLength = videoUrlList.length;

                      return Expanded(
                        child: ListView.builder(
                          reverse: true, 
                          shrinkWrap: true,
                          controller: _scrollController,
                          padding: EdgeInsets.symmetric(vertical: 8),
                          itemCount: snapshot.data!.docs.length,
                          itemBuilder: (context, index) {
                            if(chatMessageList[index].type == 'Image'){
                              imageUrlListLength--;
                            }
                            // if(chatMessageList[index].type == 'Video'){
                            //   videoUrlListLength--;
                            // }

                            return MessageWidget(
                              message: chatMessageList[index],
                              imageUrlList: imageUrlList,
                              //videoUrlList: videoUrlList,
                              currentImageIndex: chatMessageList[index].type == 'Image' ? imageUrlListLength : null,
                              //currentVideoIndex: chatMessageList[index].type == 'Video' ? videoUrlListLength : null,
                            );
                          },     
                        ) 
                      );     
                    }else{
                      return Expanded(
                        child: Container(
                          padding: EdgeInsets.symmetric(vertical: 8),
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.chat, size: 80, color: Colors.grey.shade400,),
                                SizedBox(height: 20,),
                                Text(S.current.emptyMessageInChatRoom, style: theme.textTheme.bodyText2,),
                              ],
                            ),
                          ),
                        ),
                      );  
                    }      
                  },
                ),

                MessageInputField(
                  textController: textController,
                  slideInputAnimation: slideInputAnimation,
                  opacity: opacity,
                  slideInputController: slideInputController,
                  hideTheMic: hideTheMic,
                  showTheMic: showTheMic,
                  isVisible: isVisible,
                  addToMessages: addToMessages,
                  chatRoomID: widget.chatContacts.chatRoomID, 
                )
              ],
            ),
          ),
        ],
      ),
    );
  }
}
