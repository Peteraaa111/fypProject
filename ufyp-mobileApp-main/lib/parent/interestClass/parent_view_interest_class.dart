import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/appliyInterestClassDialog.dart';
import 'package:my_app/components/toastMessage.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/InterestClass.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/globalVariable.dart';
import 'package:my_app/parent/interestClass/parent_view_apply_interest_class.dart';

class ViewInterestClassPage extends StatefulWidget {
  @override
  _ViewInterestClassPageState createState() => _ViewInterestClassPageState();
}

class _ViewInterestClassPageState extends State<ViewInterestClassPage> {
  List<InterestClass> interestClassList = [];
  Future<bool> getInterestClassList(BuildContext context) async {
    try {
      interestClassList.clear();
      final res = await UserApi().getInterestClassList(AppUser.id,context);
      if (res['success']) {
        if(res['haveData']){
          for(var i = 0; i < res['data'].length; i++){
            interestClassList.add(new InterestClass(
              id: res['data'][i]['id'],
              titleEN: res['data'][i]['titleEN'],
              titleTC: res['data'][i]['titleTC'],
              startDateFrom: res['data'][i]['startDateFrom'],
              startDateTo: res['data'][i]['startDateTo'],
              validApplyDateFrom: res['data'][i]['validApplyDateFrom'],
              validApplyDateTo: res['data'][i]['validApplyDateTo'],
              timePeriod: res['data'][i]['timePeriod'],
              weekDay: res['data'][i]['weekDay'],
            ));
          }
          interestClassList.sort((a, b) => a.validApplyDateTo.compareTo(b.validApplyDateTo));
          return true;
        }
      } 
      return false;
    } catch (e) {
      //ToastMessage.show(S.current.readInterestClassFail);
      return false;
    }
  }
  
  Future<void> callApiFunction(String interestClassID, BuildContext context) async {
    try {
      final res = await UserApi().applyInterestClass(
        jsonEncode({
          'sId': AppUser.id,
          'interestClassID': interestClassID,
          'phoneNumber': Student.parentPhoneNumber,
          'classId':AppUser.currentClass,
        }),
        context,
      );
      if (res["success"]) {
        ToastMessage.show(S.current.sucessfullyApplyInterestClass);
      } else {
        ToastMessage.show(S.current.failApplyInterestClass);
      }
    } catch (e) {
      print(e); // Log the error
      ToastMessage.show(e.toString());
    }
  }

  void applyInterestClass(BuildContext context, String interestClassID) async {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return CustomAlertDialog(
          title: S.current.applyInterestClass,
          content: S.current.applyInterestClassMessage,
          onNoPressed: () {
            Navigator.of(context).pop();
          },
          onYesPressed: () async {
            await callApiFunction(interestClassID, context);
            Navigator.of(context).pop();
          },
        );
      },
    );
  }
  

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return buildFutureBuilder();
  }

  FutureBuilder<bool> buildFutureBuilder() {
    return FutureBuilder<bool>(
      future: getInterestClassList(context),
      builder: (BuildContext context, AsyncSnapshot<bool> snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return buildLoading();
        } else {
          if (snapshot.hasError)
            return buildError(snapshot.error);
          else {
            return buildListViewWithButton();
          }
        }
      },
    );
  }

  Center buildLoading() {
    return Center(child: CircularProgressIndicator());
  }

  Center buildError(dynamic error) {
    return Center(child: Text('Error: $error'));
  }

  Column buildListViewWithButton() {
    return Column(
      children: [
        Align(
          alignment: Alignment.centerRight,
          child: Container(
            margin: EdgeInsets.only(right: 20.0,top: 10),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.grey, // This is the button color
              ),
              child: Text(S.current.viewApplyInterestClassListLabel),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => ParentViewApplyInterestClassPage(),
                  ),
                );
              },
            ),
          ),
        ),
        Expanded(
          child: interestClassList.length > 0 ? ListView.builder(
            itemCount: interestClassList.length,
            itemBuilder: (context, index) {
              return buildCard(index);
            },
          ) : Center(child: Text(S.current.emptyInterestClass)),
        ),
      ],
    );
  }

  Padding buildCard(int index) {
    return Padding(
      padding: const EdgeInsets.only(top:10,left: 8,right: 8,bottom: 6),
      child: Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(15.0),
        ),
        elevation: 5,
        child: Padding(
          padding: const EdgeInsets.all(10.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              buildTitleText(index),
              SizedBox(height: 10),
              buildDateText(index),
              SizedBox(height: 10),
              buildApplyButton(index),
            ],
          ),
        ),
      ),
    );
  }

  Text buildTitleText(int index) {
    return Text(
      GlobalVariable.isChineseLocale ? interestClassList[index].titleTC : interestClassList[index].titleEN,
      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.blueGrey),
    );
  }

  Text buildDateText(int index) {
    return Text(
      '${S.current.startDateLabel}: ${interestClassList[index].startDateFrom} - ${interestClassList[index].startDateTo}\n'
      '${S.current.validApplyDate}: ${interestClassList[index].validApplyDateFrom} - ${interestClassList[index].validApplyDateTo}\n'
      '${S.current.timePeriod}: ${interestClassList[index].timePeriod} ${InterestClass.convertWeekDayToChinese(interestClassList[index].weekDay)}',
      style: TextStyle(fontSize: 16, color: Colors.grey[600]),
    );
  }

  Align buildApplyButton(int index) {
    return Align(
      alignment: Alignment.bottomRight,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.grey, // This is the button color
        ),
        child: Text(S.current.applyInterestClass),
        onPressed: () => applyInterestClass(context,interestClassList[index].id),
      ),
    );
  }

}
