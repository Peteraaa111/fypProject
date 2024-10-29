import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import {DefaultState} from "koa";
import {
  getAllStudents,
  getAllTeachers,
  getAllAdmins,
  getAllParentData,
  getAllLogs,
  upDateUserInformation,
  upDateTeacherInformation,
  deleteAllUsers,
  deleteParentUser,
  deleteTeacherUser,
  verifyAdmin,
  addParent,
  addAdmin,
  getStudentsDataByUID,
  addTeacher,
  updateUserStatus,
  updateTeacherStatus,
  editUserDataByID,
  getStudentFirstHalfGradeByID,
  getStudentSecondHalfGradeByID,
  getStudentAttendanceBySelectedMonth,
  applyLeaveForStudent,
  submitSystemProblem,
  getApplyLeaveListByID,
  getInterestClassList,
  applyInterestClass,
  getAppliedInterestClassList,
  getSchoolPhotoDocDate,
  getSchoolPhotoActivityDoc,
  getSchoolPhotoDoc,
  getClassHomeworkByUser,
  getReplySlipByUser,
  submitReplySlip,
  changeReplySlipStatus,
  saveDeviceID,
  saveLanguageCode,
  getTeacherDataByUID,
  getRewardListByID,
  getNotificationMessage,
  deleteAllNotificationByUserID,
  deleteOneNotificationByUserID,
  getTodayAttendance,
  getTheCanlendar,
  getStudentClassID,
} from "../controllers/users";

export const setupUsersRoutes = (router: Router<DefaultState, RouterContext>): void => {

const userRouter = new Router<DefaultState, RouterContext>({ prefix: "/api/v1/users" });

  // Routers
  userRouter.get("/getStudents", getAllStudents);

  userRouter.get("/getAllParentData", getAllParentData);

  userRouter.get("/getTeachers", getAllTeachers);

  userRouter.get("/getAdmins", getAllAdmins);

  userRouter.get("/getLogs", getAllLogs);
  userRouter.get("/getSchoolPhotoDocDate", getSchoolPhotoDocDate)
  
  userRouter.post("/upDateUserInformation", bodyParser(), upDateUserInformation)

  userRouter.post("/editUserDataByID", bodyParser(), editUserDataByID)

  userRouter.get("/getInterestClassList/:studentID", getInterestClassList);
  userRouter.get("/getAppliedInterestClassList/:studentID", getAppliedInterestClassList);
  userRouter.post("/upDateTeacherInformation", bodyParser(), upDateTeacherInformation)
  userRouter.post("/getStudentFirstHalfGradeByID", bodyParser(), getStudentFirstHalfGradeByID)
  userRouter.post("/getStudentSecondHalfGradeByID", bodyParser(), getStudentSecondHalfGradeByID)
  userRouter.post("/getApplyLeaveListByID", bodyParser(), getApplyLeaveListByID)
  userRouter.post("/getStudentAttendanceBySelectedMonth", bodyParser(), getStudentAttendanceBySelectedMonth)
  userRouter.post("/getSchoolPhotoActivityDoc", bodyParser(), getSchoolPhotoActivityDoc)
  userRouter.post("/getSchoolPhotoDoc", bodyParser(), getSchoolPhotoDoc)
  userRouter.post("/getClassHomeworkByUser", bodyParser(), getClassHomeworkByUser)
  userRouter.post("/getReplySlipByUser", bodyParser(), getReplySlipByUser)
  
  userRouter.post("/addParent", bodyParser(), addParent);

  userRouter.post("/addAdmin", bodyParser(), addAdmin);

  userRouter.post("/applyLeaveForStudent", bodyParser(), applyLeaveForStudent);

  userRouter.post("/submitSystemProblem", bodyParser(), submitSystemProblem);
  userRouter.post("/applyInterestClass", bodyParser(), applyInterestClass);

  userRouter.post("/verifyAdmin", bodyParser(), verifyAdmin);

  userRouter.post("/addTeacher", bodyParser(), addTeacher);

  userRouter.post("/delete", bodyParser(), deleteAllUsers);

  userRouter.post("/submitReplySlipList", bodyParser(), submitReplySlip)
  userRouter.post("/changeReplySlipStatus", bodyParser(), changeReplySlipStatus)

  userRouter.post('/getStudentDataByID', bodyParser(), getStudentsDataByUID);
  userRouter.post('/getTeacherDataByID', bodyParser(), getTeacherDataByUID);

  userRouter.post("/deleteTeacherUser", bodyParser(), deleteTeacherUser);

  userRouter.post("/deleteParentUser", bodyParser(), deleteParentUser);

  userRouter.put("/updateUserStatus",bodyParser(),updateUserStatus);

  userRouter.put("/updateTeacherStatus",bodyParser(),updateTeacherStatus);


  userRouter.post("/saveDeviceID",bodyParser(), saveDeviceID); 
  userRouter.post("/saveLanguageCode",bodyParser(), saveLanguageCode); 
  userRouter.post("/getRewardListByID",bodyParser(), getRewardListByID); 

  userRouter.post('/getNotificationMessage', bodyParser(), getNotificationMessage);

  userRouter.post('/getTodayAttendance', bodyParser(), getTodayAttendance);

  userRouter.post("/getTheCanlendar",bodyParser(),getTheCanlendar);
  userRouter.post("/getStudentClassID",bodyParser(),getStudentClassID);

  userRouter.delete('/deleteOneNotificationByUserID',bodyParser(),deleteOneNotificationByUserID);
  userRouter.delete('/deleteAllNotificationByUserID',bodyParser(),deleteAllNotificationByUserID);

  router.use(userRouter.routes()); 
}; 
//export { router };