import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:flutter_widget_from_html/flutter_widget_from_html.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/toastMessage.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/globalVariable.dart';
import 'package:my_app/modal/replySlip.dart';
import 'package:html/parser.dart' as parser;
import 'package:html/dom.dart' as dom;
import 'package:http/http.dart' as http;

class SchoolReplySlipDetailPage extends StatefulWidget {
  final ReplySlip replySlip;

  SchoolReplySlipDetailPage({required this.replySlip});

  @override
  _SchoolReplySlipDetailPageState createState() => _SchoolReplySlipDetailPageState();
}

class _SchoolReplySlipDetailPageState extends State<SchoolReplySlipDetailPage> {
  List<String> liTexts = [];  
  String? _selected;
  Map<String,dynamic>? paymentIntent;
  List<String> getLiTags(String htmlCode) {
    var document = parser.parse(htmlCode);
    var liElements = document.querySelectorAll('li');
    
    List<String> liTexts = liElements.map((element) => element.text).toList();
    return liTexts;
  }

  @override
  void initState() {
    super.initState();
    if(widget.replySlip.read == "NR"){
      changeStatus();
    }
    if(GlobalVariable.isChineseLocale){
      liTexts = getLiTags(widget.replySlip.recipientContentTC);
    }else{
      liTexts = getLiTags(widget.replySlip.recipientContentEN);
    }

  }

  Future<void> changeStatus() async {
    try{
      final res = await UserApi().changeReplySlipStatus(jsonEncode({'studentID':AppUser.id,'classID':AppUser.currentClass,'replySlipID':widget.replySlip.replySlipID}), context);

    }catch (e) {
      ToastMessage.show(e.toString());
    }
  }

  Future<void> submitReplySlip() async {
    if(_selected == null){
      ToastMessage.show(S.current.pleaseSelect);
      return;
    }
    try{
      final res = await UserApi().submitReplySlipList(jsonEncode({'studentID':AppUser.id,'classID':AppUser.currentClass,'selectOption':_selected,'replySlipID':widget.replySlip.replySlipID}), context);

      if(res["success"]){
        setState(() {
          widget.replySlip.submit = "S";
          widget.replySlip.options = widget.replySlip.convertSelect(_selected!)!;
          widget.replySlip.submitDate = DateFormat('yyyy-MM-dd').format(DateTime.now());
        });
        ToastMessage.show(S.current.sucessfullySubmitReplySlip);
      }
    }catch (e) {
      ToastMessage.show(e.toString());
    }
  }

  void makePayment() async {
    try{
      paymentIntent = await createPaymentIntent();
      var gpay = const PaymentSheetGooglePay(
        merchantCountryCode: "HK",
        currencyCode:"HKD",
        testEnv: true,
        
      );
      await Stripe.instance.initPaymentSheet(
        paymentSheetParameters: SetupPaymentSheetParameters(
        billingDetails: const BillingDetails(
          address: Address(
            country: 'HK',
            city: '',
            line1: '',
            line2: '',
            state: '',
            postalCode: '',
          ),
        ),
        paymentIntentClientSecret: paymentIntent!['client_secret'],
        style:ThemeMode.dark,
        merchantDisplayName: "Sabir",
        googlePay: gpay,
      ));
      
      displayPaymentSheet();
    } catch (e){
      print(e);
    }
  }

  // void displayPaymentSheet() {
  //   try {
  //     Stripe.instance.presentPaymentSheet().then((result) async {
  //       print(result);
  //     });
  //   } catch (e) {
  //     print(e);
  //     print("Failed");
  //   }
  // }

  void displayPaymentSheet() async {
    try {
      await Stripe.instance.presentPaymentSheet().then((value) {
        print("Payment: Payment successful");
        paymentIntent = null;
        submitReplySlip();
      }).onError((error, stackTrace) {
        print("Payment: Payment flow1 has been cancelled");
      });
    } on StripeException {
      print("Payment: Payment flow has been cancelled");
    } catch (e) {
      print("Error: $e");
    }
  }

  createPaymentIntent() async {
    String amount = widget.replySlip.paymentAmount.toString();
    try{
      Map<String,dynamic> body = {
        "amount": amount+"00",
        "currency": "hkd",
      };

      http.Response response = await http.post(
        Uri.parse("https://api.stripe.com/v1/payment_intents"),
        body: body,
        headers: {
          "Content-Type":"application/x-www-form-urlencoded", 
        });
        return json.decode(response.body);
    } catch (e){
      print(e);
      throw Exception(e);
    }
  }



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: buildAppBar(),
      body: buildBody(),
    );
  }

  AppBar buildAppBar() {
    return AppBar(
      title: Text(S.current.replySlip),
      backgroundColor: Colors.grey[500],
    );
  }

  

  Widget buildBody() {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: ListView(
        children: <Widget>[
          buildHtmlWidget(),
          SizedBox(height: 10), // Add some space between the cards
          buildDivider(),
          widget.replySlip.submit == "NS" ? buildRadioList() : buildAlreadySubmittedMessage(),
          //widget.replySlip.submit == "NS" ? buildSubmitButton() : Container(),    
          widget.replySlip.submit == "NS" 
          ? (widget.replySlip.payment ? buildOtherSubmitButton() : buildSubmitButton()) 
          : Container(),
        ],
      ),
    );
  }

  // Widget buildAlreadySubmittedMessage() {
  //   return Padding(
  //     padding: const EdgeInsets.only(top:8.0,bottom: 8.0),
  //     child: Center(
  //       child: Text(
  //         '${S.current.alreadySubmitReplySlip}${widget.replySlip.convertOptionToChinese()}${S.current.alreadySubmitReplySlipOptions}',
  //         style: TextStyle(fontSize: 20),
  //         textAlign: TextAlign.center,
  //       ),
  //     ),
  //   );
  // }
  Widget buildAlreadySubmittedMessage() {
    return Padding(
      padding: const EdgeInsets.only(top:8.0,bottom: 8.0),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              '${S.current.alreadySubmitReplySlip}${widget.replySlip.convertOptionToChinese()}${S.current.alreadySubmitReplySlipOptions}',
              style: TextStyle(fontSize: 20),
              textAlign: TextAlign.center,
            ),
            if (widget.replySlip.payment)
              Text(
                widget.replySlip.alreadyPay(),
                style: TextStyle(fontSize: 20),
                textAlign: TextAlign.center,
              ),
          ],
        ),
      ),
    );
  }


  Padding buildHtmlWidget() {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: HtmlWidget(
        widget.replySlip.mainContentReturn(),
      ),
    );
  }

  Divider buildDivider() {
    return Divider(
      color: Colors.black,
      thickness: 1
    );
  }

  Padding buildRadioList() {
    return Padding(
      padding: const EdgeInsets.only(top:8.0),
      child: Container(
        height: 150, // specify the height of the container
        child: ListView.builder(
          itemCount: liTexts.length,
          itemBuilder: (context, index) {
            return RadioListTile<String>(
              title: Text(index == 0 && widget.replySlip.payment ? '${liTexts[index]} ${widget.replySlip.printFee()}' : liTexts[index]),
              value: liTexts[index],
              groupValue: _selected,
              activeColor: Colors.blue,
              onChanged: (String? value) {
                setState(() {
                  _selected = value;
                });
              },
            );
          },
        ),
      ),
    );
  }

  Center buildSubmitButton() {
    return Center(
      child: SizedBox(
        width: 200,
        child: Builder(
          builder: (context) => ElevatedButton(
            onPressed: () => submitReplySlip(),
            child: Row( 
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.send, color: Colors.white), 
                SizedBox(width: 8), 
                Text(
                  S.current.Submit,
                  style: TextStyle(fontSize: 18, color: Colors.white),
                ),
              ],
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.grey,
            ),
          ),
        ),
      ),
    );
  }

//payment
  Center buildOtherSubmitButton() {
    return Center(
      child: SizedBox(
        width: 200,
        child: Builder(
          builder: (context) => ElevatedButton(
            onPressed: () {
              makePayment();
              // Navigator.push(
              //   context,
              //   MaterialPageRoute(builder: (context) => SchoolReplySlipPaymentPage(replySlip: widget.replySlip)),
              // );
            },
            child: Row( 
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.send, color: Colors.white), 
                SizedBox(width: 8), 
                Text(
                  S.current.Payment,
                  style: TextStyle(fontSize: 18, color: Colors.white),
                ),
              ],
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.grey,
            ),
          ),
        ),
      ),
    );
  }
}