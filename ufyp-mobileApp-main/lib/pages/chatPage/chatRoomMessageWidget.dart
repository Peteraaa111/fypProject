import 'dart:typed_data';

import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/material.dart';
import 'package:my_app/modal/chat.dart';
import 'package:my_app/pages/chatPage/videoDetailPage.dart';
import 'package:video_thumbnail/video_thumbnail.dart';

class MessageWidget extends StatefulWidget {
  final ChatMessage message;
  final List<String>? imageUrlList;
  final int? currentImageIndex;

  MessageWidget({Key? key, required this.message, this.imageUrlList, this.currentImageIndex}) : super(key: key);

  @override
  _MessageWidgetState createState() => _MessageWidgetState();
}

class _MessageWidgetState extends State<MessageWidget> {
  AudioPlayer audioPlayer = AudioPlayer();
  Duration audioDuration = Duration.zero;
  Duration currentPosition = Duration.zero;
  //bool isPlaying = false;

  void playInit(){
    audioPlayer.onDurationChanged.listen((Duration d) {
      audioDuration = d;
      setState(() {
      });
    });
    audioPlayer.onPositionChanged.listen((Duration p) {
      currentPosition = p;
      setState(() {
      });
    });
    // audioPlayer.onPlayerStateChanged.listen((PlayerState s) {
    //   setState(() {
    //     isPlaying = s == PlayerState.playing;
    //   });
    // });
    audioPlayer.onPlayerComplete.listen((event) {
      setState(() {
        currentPosition = audioDuration;
      });
    });
  }

  Future<Uint8List?> generateThumbnail(String videoUrl) async {
    final uint8list = await VideoThumbnail.thumbnailData(
      video: videoUrl,
      imageFormat: ImageFormat.JPEG,
      maxWidth: 300, // specify the width of the thumbnail, let the height auto-scaled to keep the source aspect ratio
      maxHeight: 300,
      quality: 25,
    );
    return uint8list;
  }


  Future<Widget> generateThumbnailWidget(String videoUrl) async {
    final thumbnail = await generateThumbnail(videoUrl);
    if (thumbnail != null) {
      return Image.memory(thumbnail);
    } else {
      return Text('Thumbnail not available');
    }
  }

  @override
  void initState() {
    super.initState();

    playInit();

  }

  @override
  void dispose(){
    super.dispose();
    audioPlayer.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    List<Widget> buildMessageWidgets(ChatMessage message, ThemeData theme) {
      return [
        if (message.type == 'text') ...[
          Text(message.text!, style: theme.textTheme.bodyMedium?.copyWith(color: message.isMe ? Colors.white : null)),
          SizedBox(height: 4),
          Text(message.createdAt, style: theme.textTheme.bodySmall?.copyWith(color: message.isMe ? Colors.grey.shade300 : null)),
        ] else if (message.type == 'Image') ...[
          
          GestureDetector(
            
            onTap: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) {
                return DetailScreen(imageUrlMap: widget.imageUrlList!, initialPage: widget.currentImageIndex!);
                
              }));

            },
            child: Image.network(
              message.text!,
              fit: BoxFit.cover,
              loadingBuilder: (BuildContext context, Widget child, ImageChunkEvent? loadingProgress) {
                if (loadingProgress == null) return child;
                return Center(
                  child: CircularProgressIndicator(
                    value: loadingProgress.expectedTotalBytes != null
                        ? loadingProgress.cumulativeBytesLoaded / loadingProgress.expectedTotalBytes!
                        : null,
                  ),
                );
              },
            ),
          ),
          SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              Text(
                message.createdAt, 
                style: theme.textTheme.bodySmall?.copyWith(color: message.isMe ? Colors.grey.shade300 : null)
              ),
            ],
          )
        ]
        else if (message.type == 'audio') ...[
          Row(
            children: [
              IconButton(
                icon: Icon(audioPlayer.state == PlayerState.playing ? Icons.pause : Icons.play_arrow),
                onPressed: () async {
                  if (audioPlayer != null) {
                    if (audioPlayer.state == PlayerState.playing) {
                      await audioPlayer.pause();
                    } else if (audioPlayer.state == PlayerState.paused) {
                      await audioPlayer.resume();
                    } else {
                      await audioPlayer.play(UrlSource(message.text!));
                    }
                    setState(() {});
                  }
                },
                
              ),
              Expanded(
                child:SliderTheme(
                  data: SliderThemeData(
                    inactiveTrackColor: Colors.grey,
                    thumbShape: RoundSliderThumbShape(enabledThumbRadius: 7), // Adjust the value as needed
                  ),
                  child: Slider(
                    min: 0,
                    max: audioDuration != null ? audioDuration.inSeconds.toDouble() : 0,
                    value: currentPosition != null ? currentPosition.inSeconds.toDouble() : 0,
                    onChanged: (value) async {
                      if (audioPlayer != null) {
                        await audioPlayer.seek(Duration(seconds: value.toInt()));
                        setState(() {});
                      }
                    },
                  ),
                )
              )
            ],
          ),
          Row(
            children: [
              Padding(
                padding: EdgeInsets.only(left: 50.0), // Adjust the value as needed
                child: Text(
                  '${currentPosition.inMinutes}:${currentPosition.inSeconds.remainder(60).toString().padLeft(2, '0')}',
                  style: theme.textTheme.bodySmall?.copyWith(color: message.isMe ? Colors.grey.shade300 : null),
                ),
              ),
              Expanded(
                child: Align(
                  alignment: Alignment.centerRight,
                  child: Text(
                    message.createdAt, 
                    style: theme.textTheme.bodySmall?.copyWith(color: message.isMe ? Colors.grey.shade300 : null)
                  ),
                ),
              ),
            ],
          )
        ]else if(message.type =='Video')...[
          FutureBuilder<Widget>(
            future: generateThumbnailWidget(message.text!),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.done) {
                if (snapshot.hasError) {
                  return Text('Error: ${snapshot.error}');
                } else {
                  return GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => VideoDetailScreen(videoUrl: message.text!),
                        ),
                      );
                    },
                    child: Stack(
                      alignment: Alignment.center,
                      children: <Widget>[
                        snapshot.data!,
                        CircleAvatar(
                          backgroundColor: Colors.black45,
                          child: Icon(Icons.play_arrow, color: Colors.white, size: 35.0),
                        ),
                      ],
                    ),
                  );
                }
              } else {
                return CircularProgressIndicator();
              }
            },
          ),
        ],
        
      ];
    }

    return Row(
      mainAxisAlignment: widget.message.isMe ? MainAxisAlignment.end : MainAxisAlignment.start,
      children: [
        Container(
          constraints: BoxConstraints(
            maxWidth: 250
          ),
          padding: EdgeInsets.all(8),
          margin: EdgeInsets.only(right: widget.message.isMe ? 8 : 0, left: widget.message.isMe ? 0 : 8, bottom: 8),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            color: widget.message.isMe ? Color(0xff1972F5) : Color.fromARGB(255, 225, 231, 236),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: buildMessageWidgets(widget.message, theme),
          ),
        ),
      ],
    );
  }
}





class DetailScreen extends StatelessWidget {
  final List<String> imageUrlMap;
  final int initialPage;
  final PageController pageController;

  DetailScreen({required this.imageUrlMap, required this.initialPage})
      : pageController = PageController(initialPage: initialPage);

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
      body: Stack(
        children: <Widget>[
          PageView.builder(
            itemCount: imageUrlMap.length,
            controller: pageController,
            itemBuilder: (context, index) {
              int reverseIndex = imageUrlMap.length - 1 - index;
              return Padding(
                padding: const EdgeInsets.only(bottom:50.0),
                child: Image.network(imageUrlMap[reverseIndex], fit: BoxFit.cover),
              );
            },
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: Container(
              height: 45,
              child: ListView.builder(
                shrinkWrap: true,
                scrollDirection: Axis.horizontal,
                itemCount: imageUrlMap.length,
                itemBuilder: (context, index) {
                  int reverseIndex = imageUrlMap.length - 1 - index;
                  return GestureDetector(

                    onTap: () => pageController.jumpToPage(index),
                    child: Container(
                      margin: EdgeInsets.symmetric(horizontal: 1),
                      child: Stack(
                        children: <Widget>[
                          // Other widgets go here
                          Align(
                            alignment: Alignment.bottomCenter,
                            child: Container(
                              width: 45,
                              height: 45,
                              child: Image.network(imageUrlMap[reverseIndex], fit: BoxFit.cover),
                            ),
                          ),
                        ],
                      )
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}

