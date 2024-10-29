import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/generated/l10n.dart';
import 'package:my_app/modal/Grade.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/globalVariable.dart';

class TeacherCheckStudentGrade extends StatefulWidget {
  @override
  _TeacherCheckStudentGradeState createState() => _TeacherCheckStudentGradeState();
}

class _TeacherCheckStudentGradeState extends State<TeacherCheckStudentGrade> {
  //List<Grade> _grades = [];
  int selectedTap = 0;
  List<ClassGrade>? FirstHalfGrade = [];
  List<ClassGrade>? SecondHalfGrade = [];
  Future<bool> getFirstHalfGradeData(BuildContext context) async {
    FirstHalfGrade!.clear();
    final res = await UserApi().getStudentFirstHalfGrade(jsonEncode({'classId':AppUser.currentClass}), context);
    if (res['success']) {
      if(res['haveData']){
        for(var i = 0; i < res['data'].length; i++){
          FirstHalfGrade?.add(ClassGrade.fromJson(res['data'][i]));     
        }
        return true;
        
      }
    } 
   return false;
  }

  Future<bool> getSecondHalfGradeData(BuildContext context) async {
    SecondHalfGrade!.clear();
    final res = await UserApi().getStudentSecondHalfGrade(jsonEncode({'classId':AppUser.currentClass}), context);
    if (res['success']) {
      if(res['haveData']){
        for(var i = 0; i < res['data'].length; i++){
          SecondHalfGrade?.add(ClassGrade.fromJson(res['data'][i]));     
        }
        return true;
      }
    }
    return false;
  }

  @override
  void initState() {
    super.initState();
  }

  Widget tabWidget(String label, int index) {
    return Container(  
      width: double.infinity,
      decoration: BoxDecoration(
      border: index == selectedTap
          ? null
          : Border(
              right: BorderSide(
                  color: Color(0xFF454545),
                  width: 1,
                  style: BorderStyle.solid),
            )),
      child: Tab(
        text: label,
      ),
    );
  }


  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Column(
        children: [
          SizedBox(height: 15.0),
          Padding(
            padding: EdgeInsets.all(15.0), // Change this value as needed
            child: TabBar(
              indicatorPadding: EdgeInsets.symmetric(vertical: 10),
              labelPadding: EdgeInsets.zero,
              indicator: ShapeDecoration(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.all(Radius.circular(5)),
                  side: BorderSide(color: Colors.grey[300]!),
                ),
                color: Colors.grey[500]!,
              ),
              labelColor: Colors.black,
              labelStyle: TextStyle(color: Colors.black),
              tabs: [
                tabWidget(S.current.firstHalf, 0),
                tabWidget(S.current.secondtHalf, 1),
              ],
              onTap: (index) {
                setState(() {
                  selectedTap = index;
                });
              },
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
                      return buildGradeCard(FirstHalfGrade!);
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
                      return buildGradeCard(SecondHalfGrade!);
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



Widget buildGradeCard(List<ClassGrade> grades) {
  return SingleChildScrollView(
    scrollDirection: Axis.horizontal,
    child: Padding(
      padding: EdgeInsets.symmetric(horizontal: 20.0), // Add this line
      child: DataTable(
        columns: <DataColumn>[
          DataColumn(label:Text(GlobalVariable.isChineseLocale ? '姓名' : 'Name')),
          DataColumn(label: Text(S.current.chineseLabel,)),
          DataColumn(label: Text(S.current.englishLabel,)),
          DataColumn(label: Text(S.current.mathLabel,)),
          DataColumn(label: Text(S.current.gsLabel,)),
          DataColumn(label: Text(S.current.totalMarkLabel,)),
        ],
        rows: grades.map((grade) => DataRow(
          cells: <DataCell>[
            centeredDataCell(GlobalVariable.isChineseLocale ? grade.studentNameChi : grade.studentNameEng),
            centeredDataCell(grade.chinese),
            centeredDataCell(grade.english),
            centeredDataCell(grade.mathematics),
            centeredDataCell(grade.generalStudies),
            centeredDataCell(grade.totalGrade!),
          ],
        )).toList(),
      ),
    )
  );
}

// Helper function
DataCell centeredDataCell(String text) {
  return DataCell(
    Center(
      child: Text(text),
    ),
  );
}