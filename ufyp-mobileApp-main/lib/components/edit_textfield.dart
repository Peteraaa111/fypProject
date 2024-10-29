import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class EditDataTextField extends StatelessWidget {
  final TextEditingController controller;
  final bool obscureText;
  final bool numericOnly; // add this property
  final String initialValue;

  const EditDataTextField({
    Key? key,
    required this.controller,
    required this.obscureText,
    required this.initialValue,
    this.numericOnly = false,

  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    controller.text = initialValue;
    
    return Padding(

      padding: const EdgeInsets.symmetric(horizontal: 25.0),
      child: SizedBox(
        width: 200, // set the width
        height: 50, // set the height
        child: TextField(
          controller: controller,
          obscureText: obscureText,
          keyboardType: numericOnly ? TextInputType.number : null, // set the keyboardType based on the numericOnly property
          inputFormatters: numericOnly ? [FilteringTextInputFormatter.digitsOnly] : null, // set the inputFormatters based on the numericOnly property
          decoration: InputDecoration(
            enabledBorder: const OutlineInputBorder(
              borderSide: BorderSide(color: Colors.white),
            ),
            focusedBorder: UnderlineInputBorder(
              borderSide: BorderSide(color: Colors.grey),
            ),
            fillColor: Colors.grey.shade200,
            filled: true,
          ),
        ),
      ),
    );
  }
}