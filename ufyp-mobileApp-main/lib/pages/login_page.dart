import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:my_app/components/my_button.dart';
import 'package:my_app/components/my_textfield.dart';
import 'package:my_app/components/square_tile.dart';

import 'package:my_app/generated/l10n.dart';
import 'package:my_app/main.dart';
import 'package:rxdart/rxdart.dart';

import '../components/toastMessage.dart';

class LoginPage extends StatefulWidget {
  LoginPage({super.key});
  
  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  // text editing controllers
  final phoneNumberController = TextEditingController();
  final passwordController = TextEditingController();

  // sign login method
  void userLogin() async{
    if (phoneNumberController.text.isEmpty || passwordController.text.isEmpty) {
      // Show error message
      ToastMessage.show(S.current.emptyInput);
      return;
    }
    // showDialog(
    //     context: context, 
    //     builder: (context) {
    //       return const Center(
    //         child: CircularProgressIndicator(),
    //       );
    //     }
    // );

    try{
      await FirebaseAuth.instance.signInWithEmailAndPassword(
        email: phoneNumberController.text+"@cityprimary.com",
        password: passwordController.text,
      );

      // remove circle
      //Navigator.pop(context); 
       
    } on FirebaseAuthException catch (e){

      // remove circle
     //Navigator.pop(context);

      //wrong phone number
      if (e.code == 'user-not-found'){
        wrongPhoneNumberMessage();
      } 
      
      // wrong password
      else if (e.code == 'wrong-password'){
        wrongPasswordMessage();
      }
    }

  }

  //wrong phone number 
  void wrongPhoneNumberMessage(){
    showDialog(
      context: context, 
      builder: (context) {
        return AlertDialog(
          title: Text(S.current.wrongPhoneNumber),
        );
      }
    );
  }

  //wrong Password
  void wrongPasswordMessage(){
    showDialog(
      context: context, 
      builder: (context) {
        return AlertDialog(
          title: Text(S.current.wrongPassword),
        );
      }
    );
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      //resizeToAvoidBottomInset : false,
      body: Center(
        child:ListView(
          shrinkWrap: true,
          reverse: true,
          padding: EdgeInsets.all(32),
          children: <Widget>[
          //child: Column(
            // children: [
              // const SizedBox(height: 30),

              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Text(
                    S.current.selectedLanguage,
                    style: TextStyle(fontSize: 16),
                  ),
                  SizedBox(width: 25),
                  DropdownButton(
                    underline: SizedBox(),
                    onChanged: (v) => setState(() {
                      MyApp.setLocale(context, Locale(v.toString(), ""));
                    }),
                    value: Localizations.localeOf(context).languageCode,
                    items: [
                      DropdownMenuItem(
                        child: Text('中文'), value: 'zh'
                      ),
                      DropdownMenuItem(
                        child: Text('English'), value: 'en'
                      ),
                    ],
                  ),
                ],
              ),

              const SizedBox(height: 35),

              Text(
                S.of(context)!.schoolName,
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.grey[700],
                  fontSize: 22,
                ),
              ),

              const SizedBox(height: 20),
              // logo
              Row(
                mainAxisAlignment: MainAxisAlignment.center, 
                children:[
                  SquareTile(imagePath: 'lib/images/schoolLogo.png'),
                ],
              ),
              
            
              const SizedBox(height: 50),

              // Phone Number textfield
              MyTextField(
                controller: phoneNumberController,
                hintText: S.current.hintPhoneNumber,
                obscureText: false,
              ),

              const SizedBox(height: 10),

              // password textfield
              MyTextField(
                controller: passwordController,
                hintText: S.current.hintPassword,
                obscureText: true,
              ),

              const SizedBox(height: 15),

              const SizedBox(height: 25),

              // sign in button
              MyButton(
                onTap: userLogin,
              ),
            ].reversed.toList(),
          ),
        ),
    );
  }
}