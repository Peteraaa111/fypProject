import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:my_app/api/api.dart';
import 'package:my_app/modal/StudentData.dart';
import 'package:my_app/modal/classTimeTable.dart';

class CommonTool{
  
  static Widget buildTimeTable(ClassTimeTable timeTable,double leftV,double rightV) {
    // Get all unique times
    var allTimes = timeTable.timeTables
        .expand((table) => table.times.keys)
        .toSet()
        .toList();

    // Sort times
    allTimes.sort();

    List<Widget> tables = [];

    List<Map<String, String>> restAndLunchTimes = [
      {'time': '09:40', 'activity': ClassTimeTable.getRestWord()},
      {'time': '11:05', 'activity': ClassTimeTable.getRestWord()},
      {'time': '12:30', 'activity': ClassTimeTable.getLunchWord()},
    ];

    int tempIndex = 0;
    // Data tables
    for (int i = 0; i < allTimes.length; i++) {
      tables.add(
        Table(
          border: TableBorder.all(),
          columnWidths: const <int, TableColumnWidth>{
            0: FlexColumnWidth(0.8),
          },
          // columnWidths: const <int, TableColumnWidth>{
          //   0: IntrinsicColumnWidth(),
          // },
          children: [
            TableRow(
              children: [
                TableCell(
                  verticalAlignment: TableCellVerticalAlignment.middle,
                  child: Padding(
                    padding: const EdgeInsets.all(5.0),
                    child: Text(allTimes[i], textAlign: TextAlign.center), // Time cell
                  ),
                ),
                ...timeTable.timeTables.map((table) => 
                  TableCell(
                    verticalAlignment: TableCellVerticalAlignment.middle,
                    child: Padding(
                      padding: const EdgeInsets.all(5.0),
                      child: Text(ClassTimeTable.getSubjectWord(table.times[allTimes[i]]!) ?? '', textAlign: TextAlign.center), // Subject cells
                    ),
                  )
                ),
              ],
            ),
          ],
        ),
      );

      // Add a "Rest" table after every two lessons
      if ((i + 1) % 2 == 0 && i != allTimes.length - 1 && tempIndex < restAndLunchTimes.length) {
        tables.add(
          Table(
            border: TableBorder.all(),
            columnWidths: const <int, TableColumnWidth>{
              0: FlexColumnWidth(0.64),
              1: FlexColumnWidth(4.0),
            },
            children: [
              TableRow(
                children: [
                  TableCell(
                    verticalAlignment: TableCellVerticalAlignment.middle,
                    child: Padding(
                      padding: const EdgeInsets.all(5.0),
                      child: Text(restAndLunchTimes[tempIndex]['time']!, textAlign: TextAlign.center), // "Rest" or "Lunch" cell
                    ),
                  ),
                  TableCell(
                    verticalAlignment: TableCellVerticalAlignment.middle,
                    child: Padding(
                      padding: const EdgeInsets.all(5.0),
                      child: Text(restAndLunchTimes[tempIndex]['activity']!, textAlign: TextAlign.center), // "15 mins" cell
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
        tempIndex++;
      }
    }
    tables.add(
      Table(
        border: TableBorder.all(),
        columnWidths: const <int, TableColumnWidth>{
          0: FlexColumnWidth(0.64),
          1: FlexColumnWidth(4.0),
        },
        children: [
          TableRow(
            children: [
              TableCell(
                verticalAlignment: TableCellVerticalAlignment.middle,
                child: Padding(
                  padding: const EdgeInsets.all(5.0),
                  child: Text('15:15', textAlign: TextAlign.center), // "Rest" or "Lunch" cell
                ),
              ),
              TableCell(
                verticalAlignment: TableCellVerticalAlignment.middle,
                child: Padding(
                  padding: const EdgeInsets.all(5.0),
                  child: Text(ClassTimeTable.getLeaveWord(), textAlign: TextAlign.center), // "15 mins" cell
                ),
              ),
            ],
          ),
        ],
      ),
    );

    return Padding(
      padding: EdgeInsets.only(top:5.0,bottom: 12.0,left: leftV ,right: rightV),
      child: SingleChildScrollView(
        child: Column(
          children: tables,
        ),
      ),
    );
  }


}