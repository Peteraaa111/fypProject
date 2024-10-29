import 'dart:typed_data';

import 'package:flick_video_player/flick_video_player.dart';
import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import 'package:video_thumbnail/video_thumbnail.dart';

class VideoDetailScreen extends StatefulWidget {
  final String videoUrl;


  VideoDetailScreen({required this.videoUrl}){}


  @override
  _VideoDetailScreenState createState() => _VideoDetailScreenState();
}

class _VideoDetailScreenState extends State<VideoDetailScreen> {
  bool _isVisible = true;
  late FlickManager flickManager;
  @override
  void initState() {
    super.initState();
    flickManager = FlickManager(
      videoPlayerController:
          VideoPlayerController.networkUrl(Uri.parse(widget.videoUrl),
    ));
  }

  @override
  void dispose() {
    //_controller.dispose();
    flickManager.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SafeArea(
        child: Center(
          child: Container(
            //height: MediaQuery.of(context).size.height * 0.95, // 95% of screen height
            //width: MediaQuery.of(context).size.width * 0.9, // 90% of screen width
            child: Padding(
              padding: EdgeInsets.only(top: MediaQuery.of(context).size.width * 0.32), // padding equivalent to AppBar height
              child: FlickVideoPlayer(
                flickVideoWithControls: FlickVideoWithControls(
                  controls: FlickPortraitControls(
                    progressBarSettings: FlickProgressBarSettings(playedColor: Colors.blue),
                  ),
                ),
                flickManager: flickManager
              ),
            ),
          ),
        ),
      ),
    );
  }
}