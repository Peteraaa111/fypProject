import 'package:flutter/material.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/pages/schoolPhotoPage/schoolPhotoSelectActivityPage.dart';

import '../../components/toastMessage.dart';

class SchoolPhotoSelectDatePage extends StatefulWidget {
  @override
  _SchoolPhotoSelectDateState createState() => _SchoolPhotoSelectDateState();
}

class _SchoolPhotoSelectDateState extends State<SchoolPhotoSelectDatePage> {
    List<String> photoDateList = [];
    Future<bool> getAppliedInterestClassList(BuildContext context) async {
    try {
      photoDateList.clear();
      final res = await UserApi().getSchoolPhotoDocDateList(context);
      if (res['success']) {
        if(res['haveData']){
          for(var i = 0; i < res['data'].length; i++){
            photoDateList.add(res['data'][i]);
          }
          return true;
        }
      } 
      return false;
    } catch (e) {
      ToastMessage.show(S.current.readFail);
      return false;
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<bool>(
      future: getAppliedInterestClassList(context),
      builder: (BuildContext context, AsyncSnapshot<bool> snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        } else {
          return buildListView();
        }
      },
    );
  }

  Widget buildListView() {
    return ListView.builder(
      itemCount: photoDateList.length,
      itemBuilder: (BuildContext context, int index) {
        return buildContainer(index);
      },
    );
  }

  Widget buildContainer(int index) {
    return Container(
      margin: EdgeInsets.only(
        top: index == 0 ? 10.0 : 0.0,
        bottom: index == photoDateList.length - 1 ? 10.0 : 0.0,
      ),
      child: buildPadding(index),
    );
  }

  Widget buildPadding(int index) {
    return Padding(
      padding: EdgeInsets.only(left: 10.0, right: 10.0, bottom: 2.0),
      child: buildInkWell(index),
    );
  }

  Widget buildInkWell(int index) {
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => SchoolPhotoSelectActivityPage(key: UniqueKey(), photoDate: photoDateList[index])),
        );
      },
      child: buildCard(index),
    );
  }

  Widget buildCard(int index) {
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(15.0), // Add rounded corners
        side: BorderSide(color: Colors.grey[300]!, width: 1.0), // Add a border
      ),
      child: buildListTile(index),
    );
  }

  Widget buildListTile(int index) {
    return ListTile(
      title: Text(
        photoDateList[index],
        style: TextStyle(
          fontSize: 18.0, // Increase the font size
          fontWeight: FontWeight.bold, // Make the text bold
        ),
      ),
    );
  }
}
