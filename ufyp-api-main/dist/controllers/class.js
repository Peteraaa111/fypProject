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
exports.getClassTimeTable = exports.addClassTimeTable = exports.deleteHomeworkInClass = exports.deleteTeacherInClass = exports.addTeacherToClass = exports.getAllUnAssignTeachers = exports.getAllClassTeachers = exports.uploadHomeworkImage = exports.getWholeYearClassGrade = exports.getAttendanceDateInfo = exports.submitAttendance = exports.editExam = exports.getAllDocumentsInCollection = exports.addClassExamGrade = exports.addClassToGrade = exports.editHomework = exports.getClassHomework = exports.removeStudentFromClass = exports.redistributeClassNumber = exports.addStudentToClass = exports.getUnassignedStudentsAndClass = exports.getClassmateByAcademicYearAndClass = exports.getAcademicYearWithClasses = exports.createClass = void 0;
const service = __importStar(require("../services/class"));
const createClass = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    let result = yield service.createClass();
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
exports.createClass = createClass;
const getAcademicYearWithClasses = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userList = yield service.getAcademicYearWithClasses();
        ctx.body = userList;
        yield next();
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        //ctx.body = { error: 'An error occurred while retrieving all students' };
    }
});
exports.getAcademicYearWithClasses = getAcademicYearWithClasses;
const getClassmateByAcademicYearAndClass = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const year = ctx.params.year;
    const classID = ctx.params.classID;
    //const data: service.ParentRegister = body as service.ParentRegister;
    let result = yield service.getClassmateByAcademicYearAndClass(year, classID);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result.data;
    }
    else {
        ctx.status = 500;
        console.log(result);
        ctx.body = result;
    }
    yield next();
});
exports.getClassmateByAcademicYearAndClass = getClassmateByAcademicYearAndClass;
const getUnassignedStudentsAndClass = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userList = yield service.getUnassignedStudents();
        ctx.body = { userList };
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        //ctx.body = { error: 'An error occurred while retrieving all students' };
    }
    yield next();
});
exports.getUnassignedStudentsAndClass = getUnassignedStudentsAndClass;
const addStudentToClass = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = ctx.request.body;
        const academicYearValue = body.academicYearValue;
        console.log(academicYearValue);
        const data = body.fullSelected;
        //console.log(data);
        const actorUid = body.CurrentUserUid;
        const result = yield service.addStudentsToClass(data, actorUid, academicYearValue);
        if (result.success) {
            ctx.status = 201;
            ctx.body = result;
        }
        else {
            ctx.status = 500;
            ctx.body = result;
        }
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { success: false, message: 'An error occurred while adding the student to the class.' };
    }
    yield next();
});
exports.addStudentToClass = addStudentToClass;
const redistributeClassNumber = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const classID = body.data;
    const actorUid = body.CurrentUserUid;
    const academicYearValue = body.academicYearValue;
    let result = yield service.redistributeClassNumber(classID, academicYearValue);
    if (result.success) {
        ctx.status = 201;
        // await service.logMovement(actorUid,uid,"upDate Teacher User");
        yield service.logMovement(actorUid, null, "Re distrubute class number for class " + classID);
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.redistributeClassNumber = redistributeClassNumber;
const removeStudentFromClass = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    //const body: unknown = ctx.request.body;
    const studentID = ctx.params.studentID;
    const classID = ctx.params.classID;
    const actorUid = ctx.params.CurrentUserUid;
    const academicYearValue = ctx.params.academicYearValue;
    let result = yield service.removeStudentFromClass(classID, studentID, academicYearValue);
    if (result.success) {
        ctx.status = 201;
        yield service.logMovement(actorUid, studentID, "remove student from class " + classID);
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.removeStudentFromClass = removeStudentFromClass;
const getClassHomework = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const year = ctx.params.year;
        const classID = ctx.params.classID;
        console.log(year);
        const userList = yield service.getClassHomework(classID, year);
        ctx.body = userList;
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        //ctx.body = { error: 'An error occurred while retrieving all students' };
    }
    yield next();
});
exports.getClassHomework = getClassHomework;
const editHomework = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const data = body.data;
    const date = ctx.params.date;
    const classID = ctx.params.classID;
    const actorUid = body.CurrentUserUid;
    const academicYearValue = body.yearSelector;
    let result = yield service.editHomework(classID, date, data, academicYearValue);
    console.log(result);
    if (result.success) {
        ctx.status = 201;
        yield service.logMovement(actorUid, null, "Edid " + classID + " class " + date + " day homework ");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.editHomework = editHomework;
const addClassToGrade = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = ctx.request.body;
        //console.log("body: " + JSON.stringify(body));
        //const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
        const result = yield service.addClassToGrade();
        if (result.success) {
            ctx.status = 201;
            ctx.body = result;
        }
        else {
            ctx.status = 500;
            ctx.body = result;
        }
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { success: false, message: 'An error occurred while adding all class to grade.' };
    }
    yield next();
});
exports.addClassToGrade = addClassToGrade;
const addClassExamGrade = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const data = body.data;
    const actorUid = body.CurrentUserUid;
    const classID = body.classID;
    const termDate = body.termDate;
    const year = body.year;
    let result = yield service.addClassExamGrade(classID, year, termDate, data, actorUid);
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
exports.addClassExamGrade = addClassExamGrade;
const getAllDocumentsInCollection = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const termDate = ctx.params.termDate;
        const classID = ctx.params.classID;
        const year = ctx.params.year;
        const list = yield service.getAllDocumentsInCollection(year, termDate, classID);
        const list2 = yield service.getNoGradeStudentInClass(year, termDate, classID);
        ctx.body = { list, list2 };
        yield next();
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        //ctx.body = { error: 'An error occurred while retrieving all students' };
    }
});
exports.getAllDocumentsInCollection = getAllDocumentsInCollection;
const editExam = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const data = body.data;
    const classID = body.classID;
    const termDate = body.termDate;
    const actorUid = body.CurrentUserUid;
    const year = body.year;
    console.log(data);
    let result = yield service.editExam(classID, year, termDate, data);
    if (result.success) {
        ctx.status = 201;
        yield service.logMovement(actorUid, data.docID, "Edit " + classID + " class " + data.studentName + " " + termDate + " exam mark ");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.editExam = editExam;
const submitAttendance = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const data = body.data;
    const selectedYear = body.year;
    const classID = body.classID;
    const attendanceDate = body.attendanceDate;
    const actorUid = body.CurrentUserUid;
    //console.log(data);
    let result = yield service.submitAttendance(data, selectedYear, classID, attendanceDate);
    if (result.success) {
        ctx.status = 201;
        yield service.logMovement(actorUid, null, "Submit attendance for class " + classID + " on " + attendanceDate);
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.submitAttendance = submitAttendance;
const getAttendanceDateInfo = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = ctx.request.body;
        const selectedYear = body.year;
        const classID = body.classID;
        const attendanceDate = body.attendanceDate;
        const classNumber = body.classNumber;
        const result = yield service.getAttendanceDateInfo(classNumber, selectedYear, classID, attendanceDate);
        ctx.body = result;
        yield next();
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        //ctx.body = { error: 'An error occurred while retrieving all students' };
    }
});
exports.getAttendanceDateInfo = getAttendanceDateInfo;
const getWholeYearClassGrade = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const selectedYear = body.year;
    let result = yield service.getWholeYearClassGrade(selectedYear);
    if (result.success) {
        ctx.status = 201;
        //await service.logMovement(actorUid,uid,"delete teacher user");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getWholeYearClassGrade = getWholeYearClassGrade;
const uploadHomeworkImage = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const files = ctx.request.files;
    const selectedClass = body.selectedClass;
    const selectedDate = body.selectedDate;
    const selectedYear = body.selectedYear;
    const actorUid = body.CurrentUserUid;
    const result = yield service.uploadHomeworkImage(files, selectedClass, selectedYear, selectedDate);
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
exports.uploadHomeworkImage = uploadHomeworkImage;
const getAllClassTeachers = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const year = ctx.params.year;
    let result = yield service.getAllClassTeachers(year);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result.data;
    }
    else {
        ctx.status = 500;
        console.log(result);
        ctx.body = result;
    }
    yield next();
});
exports.getAllClassTeachers = getAllClassTeachers;
const getAllUnAssignTeachers = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const year = body.year;
    let result = yield service.getNotAssignTeacher(year);
    if (result.success) {
        ctx.status = 201;
        ctx.body = result.data;
    }
    else {
        ctx.status = 500;
        console.log(result);
        ctx.body = result;
    }
    yield next();
});
exports.getAllUnAssignTeachers = getAllUnAssignTeachers;
const addTeacherToClass = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = ctx.request.body;
        const academicYearValue = body.academicYearValue;
        const data = body.fullSelected;
        console.log(academicYearValue);
        const actorUid = body.CurrentUserUid;
        const result = yield service.addTeachersToClass(academicYearValue, data, actorUid);
        if (result.success) {
            ctx.status = 201;
            ctx.body = result;
        }
        else {
            ctx.status = 500;
            ctx.body = result;
        }
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { success: false, message: 'An error occurred while adding the student to the class.' };
    }
    yield next();
});
exports.addTeacherToClass = addTeacherToClass;
const deleteTeacherInClass = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = ctx.request.body;
        const academicYearValue = body.academicYearValue;
        const classId = body.classId;
        const actorUid = body.CurrentUserUid;
        const result = yield service.deleteTeacherInClass(academicYearValue, classId);
        if (result.success) {
            ctx.status = 201;
            yield service.logMovement(actorUid, null, "delete teacher in class " + classId);
            ctx.body = result;
        }
        else {
            ctx.status = 500;
            ctx.body = result;
        }
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { success: false, message: 'An error occurred while adding the student to the class.' };
    }
    yield next();
});
exports.deleteTeacherInClass = deleteTeacherInClass;
const deleteHomeworkInClass = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = ctx.request.body;
        const academicYearValue = body.academicYearValue;
        const classId = body.classId;
        const homeworkId = body.homeworkId;
        const actorUid = body.CurrentUserUid;
        const result = yield service.deleteHomeworkInClass(homeworkId, academicYearValue, classId);
        if (result.success) {
            ctx.status = 201;
            yield service.logMovement(actorUid, null, "delete homework in class " + classId + " in day " + homeworkId);
            ctx.body = result;
        }
        else {
            ctx.status = 500;
            ctx.body = result;
        }
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { success: false, message: 'An error occurred while adding the student to the class.' };
    }
    yield next();
});
exports.deleteHomeworkInClass = deleteHomeworkInClass;
const addClassTimeTable = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = ctx.request.body;
        const classID = body.classID;
        const data = body.data;
        //const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
        const result = yield service.addClassTimeTable(data, classID);
        if (result.success) {
            ctx.status = 201;
            ctx.body = result;
        }
        else {
            ctx.status = 500;
            ctx.body = result;
        }
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { success: false, message: 'An error occurred while adding the student to the class.' };
    }
    yield next();
});
exports.addClassTimeTable = addClassTimeTable;
const getClassTimeTable = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const classID = body.classID;
    const result = yield service.getClassTimeTable(classID);
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
exports.getClassTimeTable = getClassTimeTable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29udHJvbGxlcnMvY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSwyREFBNkM7QUFVdEMsTUFBTSxXQUFXLEdBQUcsQ0FBTyxHQUFrQixFQUFFLElBQVMsRUFBRSxFQUFFO0lBQy9ELE1BQU0sSUFBSSxHQUFZLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ3ZDLElBQUksTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3pDLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtRQUNsQixHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNqQixHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztLQUNuQjtTQUFNO1FBQ0wsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7S0FDbkI7SUFDRCxNQUFNLElBQUksRUFBRSxDQUFDO0FBQ2pCLENBQUMsQ0FBQSxDQUFDO0FBWFcsUUFBQSxXQUFXLGVBV3RCO0FBRUssTUFBTSwwQkFBMEIsR0FBRyxDQUFPLEdBQWtCLEVBQUUsSUFBUyxFQUFFLEVBQUU7SUFDOUUsSUFBSTtRQUNGLE1BQU0sUUFBUSxHQUFHLE1BQU0sT0FBTyxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFDNUQsR0FBRyxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7UUFDcEIsTUFBTSxJQUFJLEVBQUUsQ0FBQztLQUNkO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JCLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLDBFQUEwRTtLQUMzRTtBQUNMLENBQUMsQ0FBQSxDQUFDO0FBVlcsUUFB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