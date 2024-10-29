import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/Grade.dart';
import 'package:my_app/modal/StudentData.dart';

class ParentCheckStudentGrade extends StatefulWidget {
  @override
  _ParentCheckStudentGradeState createState() => _ParentCheckStudentGradeState();
}

class _ParentCheckStudentGradeState extends State<ParentCheckStudentGrade> {
  //List<Grade> _grades = [];
  Grade? FirstHalfGrade;
  int? FirstHalfTotalGrade;
  Grade? SecondHalfGrade;
  int? SecondHalfTotalGrade;

  Future<bool> getFirstHalfGradeData(BuildContext context) async {
    final res = await UserApi().getStudentFirstHalfGradeByID(jsonEncode({'studentId': AppUser.id,'classId':AppUser.currentClass}), context);
    if (res['success']) {
      if(res['haveData']){
        final String chinese = res['data']['chi'];
        final String english = res['data']['eng'];
        final String math = res['data']['math'];
        final String gs = res['data']['gs'];
        FirstHalfTotalGrade = int.parse(chinese) + int.parse(english) + int.parse(math) + int.parse(gs);
        FirstHalfGrade = new Grade(chinese: chinese,english:english,mathematics:math,generalStudies: gs);
        return true;
      }
    } 
   return false;
  }

  Future<bool> getSecondHalfGradeData(BuildContext context) async {
    final res = await UserApi().getStudentSecondHalfGradeByID(jsonEncode({'studentId': AppUser.id,'classId':AppUser.currentClass}), context);
    if (res['success']) {
      if(res['haveData']){
        final String chinese = res['data']['chi'];
        final String english = res['data']['eng'];
        final String math = res['data']['math'];
        final String gs = res['data']['gs'];
        SecondHalfTotalGrade = int.parse(chinese) + int.parse(english) + int.parse(math) + int.parse(gs);
        SecondHalfGrade = new Grade(chinese: chinese,english:english,mathematics:math,generalStudies: gs);
        return true;
      }
    }
    return false;
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Column(
        children: [
          SizedBox(height: 15.0),
          Container(
            margin: EdgeInsets.only(top: 5,left:10,right:10,bottom: 16),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey),
            ),
            child: TabBar(
              labelColor: Colors.black,
              indicator: ShapeDecoration(
                color: Colors.grey[300],
                shape: BeveledRectangleBorder(),
              ),
              tabs: [
                Tab(text: S.current.firstHalf),
                Tab(text: S.current.secondtHalf),
              ],
            ),
          ),
          Expanded(
            child: TabBarView(
              children: [
                FutureBuilder(
                  future: getFirstHalfGradeData(context),
                  builder: (BuildContext context, AsyncSnapshot<bool> snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return Center(child: CircularProgressIndicator());
                    } else if (snapshot.data == false) {
                      return Center(child: Text(S.current.firstHalfGradeNotReady,style: TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold)));
                    } else {
                      return buildGradeCard(
                        FirstHalfGrade?.chinese,
                        S.current.chineseLabel,
                        int.parse(FirstHalfGrade!.chinese) < 50 ? Colors.red : null,
                        FirstHalfGrade?.english,
                        S.current.englishLabel,
                        int.parse(FirstHalfGrade!.english) < 50 ? Colors.red : null,
                        FirstHalfGrade?.mathematics,
                        S.current.mathLabel,
                        int.parse(FirstHalfGrade!.mathematics) < 50 ? Colors.red : null,
                        FirstHalfGrade?.generalStudies,
                        S.current.gsLabel,
                        int.parse(FirstHalfGrade!.generalStudies) < 50 ? Colors.red : null,
                        FirstHalfTotalGrade.toString(),
                      );
                    }
                  },
                ),
                FutureBuilder(
                  future: getSecondHalfGradeData(context),
                  builder: (BuildContext context, AsyncSnapshot<bool> snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return Center(child: CircularProgressIndicator());
                    } else if (snapshot.data==false) {
                      return Center(child: Text(S.current.secondHalfGradeNotReady,style: TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold)));
                    } else {
                      return buildGradeCard(
                        SecondHalfGrade?.chinese,
                        S.current.chineseLabel,
                        int.parse(SecondHalfGrade!.chinese) < 50 ? Colors.red : null,
                        SecondHalfGrade?.english,
                        S.current.englishLabel,
                        int.parse(SecondHalfGrade!.english) < 50 ? Colors.red : null,
                        SecondHalfGrade?.mathematics,
                        S.current.mathLabel,
                        int.parse(SecondHalfGrade!.mathematics) < 50 ? Colors.red : null,
                        SecondHalfGrade?.generalStudies,
                        S.current.gsLabel,
                        int.parse(SecondHalfGrade!.generalStudies) < 50 ? Colors.red : null,
                        SecondHalfTotalGrade.toString(),
                      );
                    }
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}



Widget buildGradeCard(
  String? grade1,
  String label1,
  Color? color1,
  String? grade2,
  String label2,
  Color? color2,
  String? grade3,
  String label3,
  Color? color3,
  String? grade4,
  String label4,
  Color? color4,
  String totalGrade,
) {
  return Container(
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        buildCard(label1, grade1, color1),
        SizedBox(height: 10.0),
        buildCard(label2, grade2, color2),
        SizedBox(height: 10.0),
        buildCard(label3, grade3, color3),
        SizedBox(height: 10.0),
        buildCard(label4, grade4, color4),
        SizedBox(height: 10.0),
        buildTotalGrade(totalGrade),
      ],
    ),
  );
}

Widget buildCard(String label, String? grade, Color? color) {
  return Card(
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(15.0),
    ),
    margin: EdgeInsets.symmetric(horizontal: 10.0, vertical: 5.0),
    elevation: 5.0,
    child: Padding(
      padding: const EdgeInsets.all(15.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18.0,
              color: Colors.blueGrey,
            ),
          ),
          Row(
            children: [
              Text(
                '${grade ?? ""}',
                style: TextStyle(
                  color: color,
                  fontSize: 16.0,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                '/100',
                style: TextStyle(
                  fontSize: 16.0,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey,
                ),
              ),
            ],
          ),
        ],
      ),
    ),
  );
}

Widget buildTotalGrade(String totalGrade) {
  return Padding(
    padding: EdgeInsets.only(top: 20.0),
    child: Center(
      child: Stack(
        children: [
          Container(
            width: 180.0,
            height: 170.0,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.black, width: 2.0),
              color: Colors.blue[100], // added color
              boxShadow: [ // added shadow
                BoxShadow(
                  color: Colors.grey.withOpacity(0.5),
                  spreadRadius: 5,
                  blurRadius: 7,
                  offset: Offset(0, 3),
                ),
              ],
            ),
            child: Padding( // added padding
              padding: const EdgeInsets.all(20.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    S.current.totalMarkLabel, 
                    style: TextStyle(
                      fontSize: 20.0, 
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 10.0),
                  Text(
                    "$totalGrade/400", 
                    style: TextStyle(
                      fontSize: 20.0, 
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),                           
          ),
        ],
      ),
    ),
  );
}