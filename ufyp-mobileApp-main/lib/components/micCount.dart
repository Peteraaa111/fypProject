import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class MicIcon extends StatefulWidget {
  final bool isMicHeldDown;

  MicIcon({required this.isMicHeldDown});

  @override
  _MicIconState createState() => _MicIconState();
}

class _MicIconState extends State<MicIcon> {
  bool isVisible = true;
  Timer? timer;

  @override
  void initState() {
    super.initState();
    startTimer();
  }

  @override
  void dispose() {
    timer?.cancel();
    super.dispose();
  }

  void startTimer() {
    timer = Timer.periodic(Duration(seconds: 1), (Timer t) {
      setState(() {
        isVisible = !isVisible;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder(
      tween: Tween<double>(begin: 0, end: widget.isMicHeldDown && isVisible ? 1 : 0),
      duration: Duration(milliseconds: 500),
      builder: (BuildContext context, double opacity, Widget? child) {
        return Opacity(
          opacity: opacity,
          child: Icon(Icons.mic, color: Colors.red),
        );
      },
    );
  }
}