import 'package:flutter/material.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/components/toastMessage.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/InterestClass.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/globalVariable.dart';

class ParentViewApplyInterestClassPage extends StatefulWidget {
  @override
  ParentViewApplyInterestClassPageState createState() => ParentViewApplyInterestClassPageState();
}

class ParentViewApplyInterestClassPageState extends State<ParentViewApplyInterestClassPage> {
  List<appliedInterestClassList> appliedinterestClassList = [];
  Future<bool> getAppliedInterestClassList(BuildContext context) async {
    try {
      appliedinterestClassList.clear();
      final res = await UserApi().getAppliedInterestClassList(AppUser.id,context);
      if (res['success']) {
        if(res['haveData']){
          for(var i = 0; i < res['data'].length; i++){

            appliedinterestClassList.add(new appliedInterestClassList(
              titleEN: res['data'][i]['titleEN'],
              titleTC: res['data'][i]['titleTC'],
              status: res['data'][i]['status'],
              submittedDate: res['data'][i]['submittedDate'],
              approveDate: res['data'][i]['approveDate'],
            ));
          }
          appliedinterestClassList.sort((a, b) {
            DateTime dateA = DateTime.parse(a.submittedDate);
            DateTime dateB = DateTime.parse(b.submittedDate);
            return dateA.compareTo(dateB);
          });
          return true;
        }
      } 
      return false;
    } catch (e) {
      ToastMessage.show(S.current.readAppliedInterestClassFail);
      return false;
    }
  }

  Widget buildCard(appliedInterestClassList interestClass) {
    return Padding(
      padding: const EdgeInsets.only(top:15,left: 10,right: 10),
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
              Text(GlobalVariable.isChineseLocale ? interestClass.titleTC : interestClass.titleEN,
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.blueGrey),),
              SizedBox(height:1),
              Text('${S.current.statusLabel}: ${appliedInterestClassList.convertStatusToChinese(interestClass.status)}\n'+
                   '${S.current.SubmittedDate}: ${interestClass.submittedDate}\n'+
                   '${S.current.approvedData}: ${interestClass.approveDate}',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.grey),),
              SizedBox(height: 5),
              // Add your button here
            ],
          ),
        ),
      ),
    );
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(S.current.viewApplyInterestClassListLabel),
        backgroundColor: Colors.grey[500],
      ),
      body: FutureBuilder(
        future: getAppliedInterestClassList(context),
        builder: (BuildContext context, AsyncSnapshot snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text(S.current.readAppliedInterestClassFail));
          } else {
            return ListView.builder(
              itemCount: appliedinterestClassList.length,
              itemBuilder: (context, index) {
                return buildCard(appliedinterestClassList[index]);
              },
            );
          }
        },
      ),
    );
  }

}
