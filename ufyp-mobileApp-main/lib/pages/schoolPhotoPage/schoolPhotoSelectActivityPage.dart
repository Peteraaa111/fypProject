import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/toastMessage.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/photo.dart';
import 'package:my_app/pages/schoolPhotoPage/schoolPhotoShowPhotoPage.dart';

class SchoolPhotoSelectActivityPage extends StatefulWidget {
  
  final String photoDate;
  SchoolPhotoSelectActivityPage({required Key key, required this.photoDate}) : super(key: key);

  @override
  _SchoolPhotoSelectActivityPageState createState() => _SchoolPhotoSelectActivityPageState();
}

class _SchoolPhotoSelectActivityPageState extends State<SchoolPhotoSelectActivityPage> {
  List<photoSelectAcitivity> photoActivityList = [];
  Future<bool> getSchoolPhotoActivityDoc(BuildContext context) async {
    try {
      photoActivityList.clear();
      final res = await UserApi().getSchoolPhotoActivityDoc(jsonEncode({'date': widget.photoDate}),context);
      if (res['success']) {
        if(res['haveData']){
          for(var i = 0; i < res['data'].length; i++){
            photoActivityList.add(new photoSelectAcitivity(
              id: res['data'][i]['id'],
              date: res['data'][i]['date'],
              name: res['data'][i]['name'],
            ));
          }
          photoActivityList.sort((a, b) {
            List<String> dateAParts = a.date.split('-');
            List<String> dateBParts = b.date.split('-');
            DateTime dateA = DateTime.parse('${dateAParts[2]}-${dateAParts[1]}-${dateAParts[0]}');
            DateTime dateB = DateTime.parse('${dateBParts[2]}-${dateBParts[1]}-${dateBParts[0]}');
            return dateA.compareTo(dateB);
          });
          return true;
        }
      } 
      return false;
    } catch (e) {
      //ToastMessage.show(S.current.readFail);
      return false;
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(S.current.schoolPhoto),
        backgroundColor: Colors.grey[500],
      ),
      body: FutureBuilder<bool>(
        future: getSchoolPhotoActivityDoc(context),
        builder: (BuildContext context, AsyncSnapshot<bool> snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else {
            return buildPhotoActivityList();
          }
        },
      ),
    );
  }

    Widget buildPhotoActivityList() {
    if (photoActivityList.length == 0) {
      return buildEmptyMessage();
    } else {
      return ListView.builder(
        itemCount: photoActivityList.length,
        itemBuilder: (BuildContext context, int index) {
          return Container(
            margin: EdgeInsets.only(
              top: index == 0 ? 10.0 : 0.0,
              bottom: index == photoActivityList.length - 1 ? 10.0 : 0.0,
            ),
            child: Padding(
              padding: EdgeInsets.only(left: 10.0, right: 10.0,bottom: 2.0),
              child: InkWell(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => SchoolPhotoShowPhotoPage(key: UniqueKey(), id: photoActivityList[index].id, photoDate: widget.photoDate)),
                  );
                },
                child: Card(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15.0), // Add rounded corners
                    side: BorderSide(color: Colors.grey[300]!, width: 1.0), // Add a border
                  ),
                  child: ListTile(
                    title: Text(
                      '${S.current.activityName}: ${photoActivityList[index].name}', 
                      style: TextStyle(
                        fontSize: 18.0, // Increase the font size
                        fontWeight: FontWeight.bold, // Make the text bold
                      ),
                    ),
                    subtitle: Text('${S.current.activityDate}: ${photoActivityList[index].date}'),
                  ),
                ),
              ),
            ),
          );
        },
      );
    }
  }
  
  Widget buildEmptyMessage() {
    return Center(
      child: Text(
        S.current.photoSelectedDateNoData,
        style: TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 20.0,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }


}