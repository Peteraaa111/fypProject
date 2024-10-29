"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentClassID = exports.getTheCanlendar = exports.getTodayAttendance = exports.getRewardListByID = exports.deleteOneNotificationByUserID = exports.deleteAllNotificationByUserID = exports.getNotificationMessage = exports.saveLanguageCode = exports.saveDeviceID = exports.changeReplySlipStatus = exports.submitReplySlip = exports.getReplySlipByUser = exports.getClassHomeworkByUser = exports.getSchoolPhotoDoc = exports.getSchoolPhotoActivityDoc = exports.getSchoolPhotoDocDate = exports.applyInterestClass = exports.getAppliedInterestClassList = exports.getInterestClassList = exports.getApplyLeaveListByID = exports.submitSystemProblem = exports.applyLeaveForStudent = exports.getStudentAttendanceBySelectedMonth = exports.getStudentSecondHalfGradeByID = exports.getStudentFirstHalfGradeByID = exports.editUserDataByID = exports.getTeacherDataByUID = exports.getStudentsDataByUID = exports.addTeacher = exports.addAdmin = exports.addParent = exports.verifyAdmin = exports.deleteTeacherUser = exports.deleteParentUser = exports.deleteAllUsers = exports.upDateTeacherInformation = exports.updateTeacherStatus = exports.updateUserStatus = exports.upDateUserInformation = exports.getAllLogs = exports.getAllParentData = exports.getAllAdmins = exports.getAllTeachers = exports.getAllStudents = void 0;
const service = __importStar(require("../services/users"));
const getAllStudents = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userList = yield service.getAllStudents();
        ctx.body = userList;
        yield next();
    }
    catch (error) {
        console.error('Error getting all students:', error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred while retrieving all students' };
    }
});
exports.getAllStudents = getAllStudents;
const getAllTeachers = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userList = yield service.getAllTeachers();
        ctx.body = userList;
        yield next();
    }
    catch (error) {
        console.error('Error getting all teachers:', error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred while retrieving all teachers' };
    }
});
exports.getAllTeachers = getAllTeachers;
const getAllAdmins = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userList = yield service.getAllAdmins();
        ctx.body = userList;
        yield next();
    }
    catch (error) {
        console.error('Error getting all admins:', error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred while retrieving all admins' };
    }
});
exports.getAllAdmins = getAllAdmins;
const getAllParentData = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userList = yield service.getAllParentsData();
        ctx.body = userList;
        yield next();
    }
    catch (error) {
        console.error('Error getting all Parent:', error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred while retrieving all Parent' };
    }
});
exports.getAllParentData = getAllParentData;
const getAllLogs = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logList = yield service.getAllLogs();
        ctx.body = logList;
        yield next();
    }
    catch (error) {
        console.error('Error getting all logs:', error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred while retrieving all logs' };
    }
});
exports.getAllLogs = getAllLogs;
const upDateUserInformation = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const uid = body.uid;
    const phoneNumberValue = body.phoneNumber;
    const ParentChineseNameValue = body.chineseName;
    const homeAddressValue = body.homeAddress;
    const actorUid = body.CurrentUserUid;
    let result = yield service.updateUser(uid, phoneNumberValue, ParentChineseNameValue, homeAddressValue);
    if (result.success) {
        ctx.status = 201;
        yield service.logMovement(actorUid, uid, "update User");
        //await service.logMovement(actorEmail,uid,"Update User Information");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.upDateUserInformation = upDateUserInformation;
const updateUserStatus = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const email = body.email;
    const activeValue = body.status;
    const actorUid = body.CurrentUserUid;
    console.log(email);
    console.log(activeValue);
    let result = yield service.updateUserStatus(activeValue, email);
    if (result.success) {
        ctx.status = 201;
        yield service.logMovement(actorUid, result.uid, "Update user to " + activeValue + " active");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.updateUserStatus = updateUserStatus;
const updateTeacherStatus = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const id = body.id;
    const activeValue = body.status;
    const actorUid = body.CurrentUserUid;
    let result = yield service.updateTeacherStatus(activeValue, id);
    if (result.success) {
        ctx.status = 201;
        yield service.logMovement(actorUid, result.uid, "Update teacher to " + activeValue + " active");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.updateTeacherStatus = updateTeacherStatus;
const upDateTeacherInformation = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const uid = body.uid;
    const phoneNumberValue = body.phoneNumber;
    const TeacherChineseNameValue = body.chineseName;
    const TeacherEnglishNameValue = body.englishName;
    const homeAddressValue = body.homeAddress;
    const actorUid = body.CurrentUserUid;
    let result = yield service.updateTeacher(uid, phoneNumberValue, TeacherChineseNameValue, TeacherEnglishNameValue, homeAddressValue);
    console.log(result);
    if (result.success) {
        ctx.status = 201;
        yield service.logMovement(actorUid, uid, "upDate Teacher User");
        //await service.logMovement(actorEmail,uid,"Update User Information");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.upDateTeacherInformation = upDateTeacherInformation;
const deleteAllUsers = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    let result = yield service.deleteAllUserAccounts();
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.deleteAllUsers = deleteAllUsers;
const deleteParentUser = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const uid = body.Targetuid;
    const actorUid = body.CurrentUserUid;
    console.log(actorUid);
    //console.log(uid);
    let result = yield service.deleteOneParentAccount(uid);
    if (result.success) {
        ctx.status = 201;
        yield service.logMovement(actorUid, uid, "delete parent user");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.deleteParentUser = deleteParentUser;
const deleteTeacherUser = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const uid = body.Targetuid;
    const actorUid = body.CurrentUserUid;
    console.log(actorUid);
    //console.log(uid);
    let result = yield service.deleteOneTeacherAccount(uid);
    if (result.success) {
        ctx.status = 201;
        yield service.logMovement(actorUid, uid, "delete teacher user");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.deleteTeacherUser = deleteTeacherUser;
const verifyAdmin = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = ctx.request.body;
        const token = body.token;
        const isAdmin = yield service.verifyUserToken(token);
        if (isAdmin === "admin") {
            // User is an admin, proceed to the next middleware or route handler
            ctx.status = 201;
            console.log("User is admin");
            ctx.body = { isAdmin: true };
        }
        else {
            // User is not an admin, send an error response
            ctx.status = 201;
            console.log("User is not an admin");
            ctx.body = { isAdmin: false, error: 'User is not an admin' };
        }
        yield next();
    }
    catch (error) {
        // An error occurred while verifying the user token
        console.error('Error verifying the user token:', error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred while verifying the user token' };
    }
});
exports.verifyAdmin = verifyAdmin;
const addParent = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const data = body.data;
    const actorUid = body.CurrentUserUid;
    //const data: service.ParentRegister = body as service.ParentRegister;
    let result = yield service.addParent(data);
    if (result.success) {
        ctx.status = 201;
        yield service.logMovement(actorUid, result.uid, "add Parent user");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        console.log(result);
        ctx.body = result;
    }
    yield next();
});
exports.addParent = addParent;
const addAdmin = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const data = body;
    let result = yield service.addAdmin(data);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.addAdmin = addAdmin;
const addTeacher = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const data = body.data;
    const size = yield service.getTeacherSize();
    let dataSize = size + data.index + 1;
    const actorUid = body.CurrentUserUid;
    let result = yield service.addTeacher(data, dataSize);
    if (result.success) {
        ctx.status = 201;
        yield service.logMovement(actorUid, result.uid, "add Teacher user");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.addTeacher = addTeacher;
const getStudentsDataByUID = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const UID = body.uid;
    let result = yield service.getStudentsDataByUID(UID);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getStudentsDataByUID = getStudentsDataByUID;
const getTeacherDataByUID = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const UID = body.uid;
    let result = yield service.getTeacherDataByUID(UID);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getTeacherDataByUID = getTeacherDataByUID;
const editUserDataByID = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const data = body.data;
    let result = yield service.editUserDataByID(data);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.editUserDataByID = editUserDataByID;
const getStudentFirstHalfGradeByID = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const studentId = body.studentId;
    const classID = body.classId;
    let result = yield service.getStudentFirstHalfGradeByID(studentId, classID);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getStudentFirstHalfGradeByID = getStudentFirstHalfGradeByID;
const getStudentSecondHalfGradeByID = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const studentId = body.studentId;
    const classID = body.classId;
    let result = yield service.getStudentSecondHalfGradeByID(studentId, classID);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getStudentSecondHalfGradeByID = getStudentSecondHalfGradeByID;
const getStudentAttendanceBySelectedMonth = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const studentId = body.studentId;
    const classID = body.classId;
    const year = body.year;
    const month = body.month;
    let result = yield service.getStudentSecongetStudentAttendanceBySelectedMonthdHalfGradeByID(studentId, classID, year, month);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        console.log(result.message);
        ctx.body = result;
    }
    yield next();
});
exports.getStudentAttendanceBySelectedMonth = getStudentAttendanceBySelectedMonth;
const applyLeaveForStudent = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const studentId = body.sId;
    const reason = body.reason;
    const classID = body.class;
    const date = body.date;
    const weekday = body.weekDay;
    let result = yield service.applyLeaveForStudent(studentId, reason, classID, date, weekday);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.applyLeaveForStudent = applyLeaveForStudent;
const submitSystemProblem = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const studentId = body.sId;
    const problem = body.problem;
    const phoneNumber = body.phoneNumber;
    let result = yield service.submitSystemProblem(studentId, problem, phoneNumber);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.submitSystemProblem = submitSystemProblem;
const getApplyLeaveListByID = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const studentId = body.studentId;
    let result = yield service.getApplyLeaveListByID(studentId);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getApplyLeaveListByID = getApplyLeaveListByID;
const getInterestClassList = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentID = ctx.params.studentID;
        const interestClassList = yield service.getAllInterestClassGroup(studentID);
        ctx.body = interestClassList;
        yield next();
    }
    catch (error) {
        console.error('Error getting all interestClass list', error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred while retrieving all interest class list' };
    }
});
exports.getInterestClassList = getInterestClassList;
const getAppliedInterestClassList = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentID = ctx.params.studentID;
        const interestClassList = yield service.getAppliedInterestClassGroup(studentID);
        ctx.body = interestClassList;
        yield next();
    }
    catch (error) {
        console.error('Error getting all applied interestClass list', error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred while retrieving all applied interest class list' };
    }
});
exports.getAppliedInterestClassList = getAppliedInterestClassList;
const applyInterestClass = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const studentId = body.sId;
    const interestClassID = body.interestClassID;
    const phoneNumber = body.phoneNumber;
    const classId = body.classId;
    let result = yield service.applyInterestClass(studentId, interestClassID, phoneNumber, classId);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.applyInterestClass = applyInterestClass;
const getSchoolPhotoDocDate = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const photoDocDateList = yield service.getSchoolPhotoDocDate();
        ctx.body = photoDocDateList;
        yield next();
    }
    catch (error) {
        console.error('Error getting all photo document date list', error);
        ctx.status = 500;
        ctx.body = { error: 'An error occurred while retrieving all photo doc date list' };
    }
});
exports.getSchoolPhotoDocDate = getSchoolPhotoDocDate;
const getSchoolPhotoActivityDoc = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const date = body.date;
    let result = yield service.getSchoolPhotoActivityDoc(date);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getSchoolPhotoActivityDoc = getSchoolPhotoActivityDoc;
const getSchoolPhotoDoc = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const date = body.date;
    const id = body.id;
    let result = yield service.getSchoolPhotoDoc(date, id);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getSchoolPhotoDoc = getSchoolPhotoDoc;
const getClassHomeworkByUser = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const date = body.date;
    const classID = body.classID;
    let result = yield service.getClassHomeworkByUser(date, classID);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getClassHomeworkByUser = getClassHomeworkByUser;
const getReplySlipByUser = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const studentId = body.studentID;
    const classID = body.classID;
    let result = yield service.getReplySlipByUser(classID, studentId);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getReplySlipByUser = getReplySlipByUser;
const submitReplySlip = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const studentId = body.studentID;
    const replySlipID = body.replySlipID;
    const selectOption = body.selectOption;
    const classId = body.classID;
    let result = yield service.submitReplySlip(studentId, replySlipID, classId, selectOption);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.submitReplySlip = submitReplySlip;
const changeReplySlipStatus = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const studentId = body.studentID;
    const replySlipID = body.replySlipID;
    const classId = body.classID;
    let result = yield service.changeReplySlipStatus(studentId, replySlipID, classId);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.changeReplySlipStatus = changeReplySlipStatus;
const saveDeviceID = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const UID = body.uid;
    const deviceID = body.deviceID;
    const role = body.role;
    let result = yield service.saveDeviceID(deviceID, UID, role);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        console.log(result.message);
        ctx.body = result;
    }
    yield next();
});
exports.saveDeviceID = saveDeviceID;
const saveLanguageCode = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const languageCode = body.languageCode;
    const userID = body.userID;
    let result = yield service.saveLanguageCode(languageCode, userID);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        console.log(result.message);
        ctx.body = result;
    }
    yield next();
});
exports.saveLanguageCode = saveLanguageCode;
const getNotificationMessage = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const userID = body.userID;
    let result = yield service.getNotificationMessage(userID);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getNotificationMessage = getNotificationMessage;
const deleteAllNotificationByUserID = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const userID = body.userID;
    let result = yield service.deleteAllNotificationByUserID(userID);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.deleteAllNotificationByUserID = deleteAllNotificationByUserID;
const deleteOneNotificationByUserID = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const notificationID = body.notificationID;
    let result = yield service.deleteOneNotificationByUserID(notificationID);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.deleteOneNotificationByUserID = deleteOneNotificationByUserID;
const getRewardListByID = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const studentID = body.studentID;
    let result = yield service.getStudentReward(studentID);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getRewardListByID = getRewardListByID;
const getTodayAttendance = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const studentId = body.studentId;
    const classID = body.classID;
    const date = body.date;
    let result = yield service.getTodayAttendance(studentId, classID, date);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getTodayAttendance = getTodayAttendance;
const getTheCanlendar = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    let result = yield service.getTheCanlendar();
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getTheCanlendar = getTheCanlendar;
const getStudentClassID = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const studentId = body.studentID;
    const classID = body.classID;
    console.log(studentId);
    console.log(classID);
    let result = yield service.getStudentClassID(studentId, classID);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getStudentClassID = getStudentClassID;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29udHJvbGxlcnMvdXNlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSwyREFBNkM7QUFJdEMsTUFBTSxjQUFjLEdBQUcsQ0FBTyxHQUFrQixFQUFFLElBQVMsRUFBRSxFQUFFO0lBQ2xFLElBQUk7UUFDRixNQUFNLFFBQVEsR0FBRyxNQUFNLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNoRCxHQUFHLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUNwQixNQUFNLElBQUksRUFBRSxDQUFDO0tBQ2Q7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLE9BQU8sQ0FBQyxLQUFLLENBQUMsNkJBQTZCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDcEQsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLEtBQUssRUFBRSxpREFBaUQsRUFBRSxDQUFDO0tBQ3pFO0FBQ0gsQ0FBQyxDQUFBLENBQUM7QUFWUyxRQUFBLGNBQWMsa0JBVXZCO0FBRUcsTUFBTSxjQUFjLEdBQUcsQ0FBTyxHQUFrQixFQUFFLElBQVMsRUFBRSxFQUFFO0lBQ2xFLElBQUk7UUFDRixNQUFNLFFBQVEsR0FBRyxNQUFNLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNoRCxHQUFHLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUNwQixNQUFNLElBQUksRUFBRSxDQUFDO0tBQ2Q7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLE9BQU8sQ0FBQyxLQUFLLENBQUMsNkJBQTZCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDcEQsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLEtBQUssRUFBRSxpREFBaUQsRUFBRSxDQUFD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