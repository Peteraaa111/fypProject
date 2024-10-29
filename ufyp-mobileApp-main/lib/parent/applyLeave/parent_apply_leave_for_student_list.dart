import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/LeaveForm.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/parent/applyLeave/parent_apply_leave_for_student.dart';

class ParentApplyLeaveForStudentListPage extends StatefulWidget {
  @override
  ParentApplyLeaveForStudentState createState() => ParentApplyLeaveForStudentState();
}

class ParentApplyLeaveForStudentState extends State<ParentApplyLeaveForStudentListPage> {
    List<LeaveForm> applyLeaveList = [];
    Future<bool> getApplyLeaveList(BuildContext context) async {
      applyLeaveList.clear(); // Clear the list
      final res = await UserApi().getApplyLeaveList(jsonEncode({'studentId': AppUser.id}), context);
      if (res['success']) {
        if(res['haveData']){
          for(var i = 0; i < res['data'].length; i++){
            applyLeaveList.add(new LeaveForm(
              dateApplied: res['data'][i]['dateApplied'],
              reason: res['data'][i]['reason'],
              status: res['data'][i]['status'],
              submittedDate: res['data'][i]['submittedDate'],
              weekDay: res['data'][i]['weekDay'],
            ));
          }
          return true;
        }
      } 
      return false;
    }


    @override
    Widget build(BuildContext context) {
      return FutureBuilder<bool>(
        future: getApplyLeaveList(context),
        builder: (BuildContext context, AsyncSnapshot<bool> snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return ErrorWidget();
          } else {
            return Column(
              children: [
                _buildApplyLeaveButton(context),
                SizedBox(height: 10),
                Expanded(child: _buildLeaveList()),
              ],
            );
          }
        },
      );
    }

    Widget _buildApplyLeaveButton(BuildContext context) {
      return Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Container(
            margin: EdgeInsets.only(right: 10.0,top: 5),
            width: 130,
            child: ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => ParentApplyLeaveForStudent(),
                  ),
                );
              },
              child: Text(
                S.current.applyLeaveLabel,
                style: TextStyle(fontSize: 18),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.grey,
              ),
            ),
          ),
        ],
      );
    }

    Widget _buildLeaveList() {
      return ListView.builder(
        itemCount: applyLeaveList.length,
        itemBuilder: (context, index) {
          return _buildLeaveCard(context, index);
        },
      );
    }

    Widget _buildLeaveCard(BuildContext context, int index) {
      return Card(
        margin: EdgeInsets.all(8.0),
        child: ListTile(
          leading: Icon(Icons.info),
          title: Text('${S.current.reason}: ${applyLeaveList[index].reason}', style: Theme.of(context).textTheme.headline6),
          subtitle: Text('${S.current.DateApply}: ${applyLeaveList[index].dateApplied} ${LeaveForm.convertWeekDayToChinese(applyLeaveList[index].weekDay)}\n'
                          '${S.current.SubmittedDate}: ${applyLeaveList[index].submittedDate}\n'
                          '${S.current.statusLabel}: ${LeaveForm.convertStatusToChinese(applyLeaveList[index].status)}', style: Theme.of(context).textTheme.subtitle1),
        ),
      );
    }

    Widget ErrorWidget() {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text('Something went wrong!'),
            ElevatedButton(
              child: Text('Retry'),
              onPressed: () {
                // Retry logic
              },
            ),
          ],
        ),
      );
    }


}


