import 'package:my_app/modal/globalVariable.dart';

class ReplySlip {
  String read;
  String submit;
  String replySlipID;
  String gotDate;
  String mainContentEN;
  String mainContentTC;
  String recipientContentEN;
  String recipientContentTC;
  String titleEN;
  String titleTC;
  bool payment;
  String? paymentAmount;
  String? options; // Nullable field
  String? submitDate; // Nullable field

  ReplySlip({
    required this.read,
    required this.submit,
    required this.replySlipID,
    required this.gotDate,
    required this.mainContentEN,
    required this.mainContentTC,
    required this.recipientContentEN,
    required this.recipientContentTC,
    required this.titleEN,
    required this.titleTC,
    required this.payment,
    this.paymentAmount,
    this.options, // Nullable field
    this.submitDate, // Nullable field
  });

  factory ReplySlip.fromJson(Map<String, dynamic> json) {
    return ReplySlip(
      read: json['read'],
      submit: json['submit'],
      replySlipID: json['replySlipID'],
      gotDate: json['gotDate'],
      mainContentEN: json['replySlipDetail']['mainContentEN'],
      mainContentTC: json['replySlipDetail']['mainContentTC'],
      recipientContentEN: json['replySlipDetail']['recipientContentEN'],
      recipientContentTC: json['replySlipDetail']['recipientContentTC'],
      titleEN: json['replySlipDetail']['titleEN'],
      titleTC: json['replySlipDetail']['titleTC'],
      payment: json['replySlipDetail']['payment'],
      paymentAmount: json['replySlipDetail']['paymentAmount'], // Nullable field
      options: json['options'], // Nullable field
      submitDate: json['submitdate'], // Nullable field
    );
  }

  String convertSelect(String value){
    if(value=='參加'){
      return "Join";
    }else if (value=='不參加'){
      return "Not Join";
    } 
    return value;
  }

  String printFee(){
    if(GlobalVariable.isChineseLocale){
      return '(費用 \$${paymentAmount})';
    }
    return '(Fee \$${paymentAmount})';
  }

  String alreadyPay(){
    if(GlobalVariable.isChineseLocale){
      return '(已付款\$${paymentAmount})';
    }
    return '(Paid \$${paymentAmount})';
  }

  String? convertOptionToChinese() {

    if(GlobalVariable.isChineseLocale){
        Map<String, String> optionsMap = {
        'Join': '參加',
        'Not Join': '不參加',
      };

      return optionsMap[options] ?? '';
    }

    return options;

  }

  String mainContentReturn() {

    if(GlobalVariable.isChineseLocale){
      return mainContentTC;
    }

    return mainContentEN;

  }

  set readSet(String value) {
    this.read = value;
  }

  @override
  String toString() {
    return 'Read: $read\n'
        'Submit: $submit\n'
        'Reply Slip ID: $replySlipID\n'
        'Got Date: $gotDate\n'
        'Main Content EN: $mainContentEN\n'
        'Main Content TC: $mainContentTC\n'
        'Recipient Content EN: $recipientContentEN\n'
        'Recipient Content TC: $recipientContentTC\n'
        'Title EN: $titleEN\n'
        'Title TC: $titleTC\n'
        'Options: ${options ?? 'None'}\n'
        'Submit Date: ${submitDate ?? 'None'}';
  }



}