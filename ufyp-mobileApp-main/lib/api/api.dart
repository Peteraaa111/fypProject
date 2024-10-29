import 'package:dio/dio.dart';
import 'package:flutter/material.dart';


class BaseApi {
  
//const API_URL = 'https://ufypapi.onrender.com';
//const API_URL = "http://localhost:10888";

  static const String baseUrl = 'http://10.0.2.2';
  
  //static const String baseUrl = 'http://localhost';
  //static const String baseUrl = 'https://ufypapi.onrender.com';
  static const String port = '10888';
  //static const String port = '';

  Dio _dio = Dio(BaseOptions(baseUrl: '${baseUrl}:${port}'));
  
  Future get(
    String path, BuildContext context,{
    Map<String, dynamic>? params,
  }) async {
    Response response;
    try {
      response = await _dio.get(
        path,
        queryParameters: params,
      );
      return _handleResponse(response);
    } on DioException catch (e) {
      return e.type.name;

    }
  }

  Future post(
    String path, BuildContext context,{
    String? data,

  }) async {
    try {
      final response = await _dio.post(
      path,
      data: data,
     
    ); 
     return _handleResponse(response);
    } on DioException catch (e) {
      return e.type.name;
    }
  }

  Future postFormData(
    String path, BuildContext context,{
    FormData? data,
  }) async {
    try {
      final response = await _dio.post(
      path,
      data: data,
    ); 
     return _handleResponse(response);
    } on DioException catch (e) {
      return e.type.name;
    }
  }

  Future put(
    String path, BuildContext context, {
    String? data,
  }) async {
    try {
      final response = await _dio.put(
        path,
        data: data,
      );
      return _handleResponse(response);
    } on DioException catch (e) {
      return e.type.name;
    }
  }

  Future delete(
    String path, BuildContext context, {
    String? data,
  }) async {
    try {
      final response = await _dio.delete(
        path,
        data: data,
      );
      return _handleResponse(response);
    } on DioException catch (e) {
      return e.message;
    }
  }

  Future<Map<String, dynamic>> _handleResponse(Response response) async {
    bool success = response.data['success'];
    if (success) {
      return response.data;
    } else {
      throw Exception(response.data.toString());
    }
  }
}


class UserApi extends BaseApi{

  Future getInterestClassList(String studentID,BuildContext context) async {
    return await get('/api/v1/users/getInterestClassList/$studentID',context);
  }

  Future getAppliedInterestClassList(String studentID,BuildContext context) async {
    return await get('/api/v1/users/getAppliedInterestClassList/$studentID',context);
  }

  Future getSchoolPhotoDocDateList(BuildContext context) async {
    return await get('/api/v1/users/getSchoolPhotoDocDate/',context);
  }


  Future saveDeviceID(data, BuildContext context) async {
    return await post('/api/v1/users/saveDeviceID',context, data: data);
  }


  Future saveLanguageCode(data, BuildContext context) async {
    return await post('/api/v1/users/saveLanguageCode',context, data: data);
  }



  Future getStudentDataByID(data, BuildContext context) async {
    return await post('/api/v1/users/getStudentDataByID',context, data: data);
  }

  Future getTeacherDataByID(data, BuildContext context) async {
    return await post('/api/v1/users/getTeacherDataByID',context, data: data);
  }




  Future EditUserDataByID(data, BuildContext context) async {
    return await post('/api/v1/users/editUserDataByID',context, data: data);
  }
  Future getStudentFirstHalfGradeByID(data, BuildContext context) async {
    return await post('/api/v1/users/getStudentFirstHalfGradeByID',context, data: data);
  }
  Future getStudentSecondHalfGradeByID(data, BuildContext context) async {
    return await post('/api/v1/users/getStudentSecondHalfGradeByID',context, data: data);
  }

  Future getStudentAttendanceBySelectedMonth(data, BuildContext context) async {
    return await post('/api/v1/users/getStudentAttendanceBySelectedMonth',context, data: data);
  }

  Future applyLeaveForStudent(data, BuildContext context) async {
    return await post('/api/v1/users/applyLeaveForStudent',context, data: data);
  }

  Future submitSystemProblem(data, BuildContext context) async {
    return await post('/api/v1/users/submitSystemProblem',context, data: data);
  }

  Future getApplyLeaveList(data, BuildContext context) async {
    return await post('/api/v1/users/getApplyLeaveListByID',context, data: data);
  }

  Future applyInterestClass(data, BuildContext context) async {
    return await post('/api/v1/users/applyInterestClass',context, data: data);
  }

  Future getSchoolPhotoActivityDoc(data, BuildContext context) async {
    return await post('/api/v1/users/getSchoolPhotoActivityDoc',context, data: data);
  }

  Future getSchoolPhotoDoc(data, BuildContext context) async {
    return await post('/api/v1/users/getSchoolPhotoDoc',context, data: data);
  }

  Future getClassHomeworkByUser(data, BuildContext context) async {
    return await post('/api/v1/users/getClassHomeworkByUser',context, data: data);
  }


  Future getReplySlipByUser(data, BuildContext context) async {
    return await post('/api/v1/users/getReplySlipByUser',context, data: data);
  }

  Future submitReplySlipList(data, BuildContext context) async {
    return await post('/api/v1/users/submitReplySlipList',context, data: data);
  }

  Future changeReplySlipStatus(data, BuildContext context) async {
    return await post('/api/v1/users/changeReplySlipStatus',context, data: data);
  }

  Future getRewardByID(data, BuildContext context) async {
    return await post('/api/v1/users/getRewardListByID',context, data: data);
  }

  Future getNotificationMessage(data, BuildContext context) async {
    return await post('/api/v1/users/getNotificationMessage',context, data: data);
  }

  Future getTodayAttendance(data,BuildContext context) async {
    return await post('/api/v1/users/getTodayAttendance',context, data: data);
  }

  Future getClassTimeTable(data, BuildContext context) async {
    return await post('/api/v1/class/getClassTimeTable',context, data: data);
  }

  Future getStudentClassID(data, BuildContext context) async {
    return await post('/api/v1/users/getStudentClassID',context, data: data);
  }


  Future deleteAllNotificationMessage(data,BuildContext context) async {
    return await delete('/api/v1/users/deleteAllNotificationByUserID',context, data: data);
  }

  Future deleteOneNotificationMessage(data,BuildContext context) async {
    return await delete('/api/v1/users/deleteOneNotificationByUserID',context, data: data);
  }





  


  //chat 

  Future getChatListByID(data, BuildContext context) async {
    return await post('/api/v1/chat/getChatListByID',context, data: data);
  }

  Future getTeacherChatListByID(data, BuildContext context) async {
    return await post('/api/v1/chat/getTeacherChatListByID',context, data: data);
  }

  Future getGroupChatList(data, BuildContext context) async {
    return await post('/api/v1/chat/getGroupChatList',context, data: data);
  }

  Future findSenderName(data, BuildContext context) async {
    return await post('/api/v1/chat/findSenderName',context, data: data);
  }

  Future sendMessageInChatRoom(data,BuildContext context) async {
    return await post('/api/v1/chat/sendMessageInChatRoom',context, data: data);
  }

  Future getAllMessageInChatRoom(data,BuildContext context) async {
    return await post('/api/v1/chat/getMessageInChatRoom',context, data: data);
  }

  Future sendFileInChatRoom(data,BuildContext context) async {
    return await postFormData('/api/v1/chat/sendFileInChatRoom',context, data: data);
  }

  Future sendAudioFileInChatRoom(data,BuildContext context) async {
    return await postFormData('/api/v1/chat/sendAudioFileInChatRoom',context, data: data);
  }

  Future sendVideoFileInChatRoom(data,BuildContext context) async {
    return await postFormData('/api/v1/chat/sendVideoFileInChatRoom',context, data: data);
  }




  //teacher

  Future getClassmateData(data, BuildContext context) async {
    return await post('/api/v1/teacherFunction/getClassmateData',context, data: data);
  }

  Future getClassAttendance(data, BuildContext context) async {
    return await post('/api/v1/teacherFunction/getClassAttendance',context, data: data);
  }

  Future getTheHomeworkData(data, BuildContext context) async {
    return await post('/api/v1/teacherFunction/getTheHomeworkData',context, data: data);
  }

  Future submitAttendanceList(data, BuildContext context) async {
    return await post('/api/v1/teacherFunction/submitAttendanceList',context, data: data);
  }

  Future createHomeworkForClass(data,BuildContext context) async {
    return await post('/api/v1/teacherFunction/createHomeworkForClass',context, data: data);
  }

  Future checkDateHomeworkExist(data,BuildContext context) async {
    return await post('/api/v1/teacherFunction/checkDateHomeworkExist',context, data: data);
  }

  Future uploadImageForHomework(data,BuildContext context) async {
    return await postFormData('/api/v1/teacherFunction/uploadImageForHomework',context, data: data);
  }

  Future editHomeworkForClass(data,BuildContext context) async {
    return await post('/api/v1/teacherFunction/editHomeworkForClass',context, data: data);
  }

  Future getStudentFirstHalfGrade(data,BuildContext context) async {
    return await post('/api/v1/teacherFunction/getStudentFirstHalfGrade',context, data: data);
  }


  Future getStudentSecondHalfGrade(data,BuildContext context) async {
    return await post('/api/v1/teacherFunction/getStudentSecondHalfGrade',context, data: data);
  }

  
  Future submitClassSeatingTable(data, BuildContext context) async {
    return await post('/api/v1/teacherFunction/submitClassSeatingTable',context, data: data);
  }  
  
  Future getClassSeatingTable(data, BuildContext context) async {
    return await post('/api/v1/teacherFunction/getClassSeatingTable',context, data: data);
  }




  
}

class Api extends BaseApi {
  Future getOrder(String shopCode, BuildContext context,) async {
    return await get('/getRequestData/getOrder/$shopCode',context);
  }

  Future getFinishRecord(String shopCode, BuildContext context,) async {
    return await get('/getRequestData/getFinishRecordHdr/$shopCode',context);
  }

  Future getFinishRecordDtl(String ticketNumber, BuildContext context) async {
    return await get('/getRequestData/getFinishRecordDtl/$ticketNumber',context);
  }

  Future udpateOrder(data, BuildContext context) async {
    return await post('/getRequestData/udpate',context, data: data);
  }
   Future genRequestData( BuildContext context,) async {
    return await get('/getRequestData/genRequestData',context);
  }
}
