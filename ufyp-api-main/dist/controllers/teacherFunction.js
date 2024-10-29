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
exports.getClassSeatingTable = exports.submitClassSeatingTable = exports.getStudentSecondHalfGrade = exports.getStudentFirstHalfGrade = exports.editHomeworkForClass = exports.getTheHomeworkData = exports.checkDateHomeworkExist = exports.createHomeworkForClass = exports.uploadImageForHomework = exports.submitAttendanceList = exports.getClassAttendance = exports.getClassmateData = exports.addNotification = void 0;
const service = __importStar(require("../services/teacherFunction"));
const addNotification = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const contentTC = body.contentTC;
    const contentEN = body.contentEN;
    const titleTC = body.titleTC;
    const titleEN = body.titleEN;
    let result = yield service.addNotification(contentTC, contentEN, titleTC, titleEN);
    if (result.success) {
        ctx.status = 201;
        //await service.logMovement(actorUid,studentId,status+" the leave from");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.addNotification = addNotification;
const getClassmateData = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const classID = body.classID;
    let result = yield service.getClassmateData(classID);
    if (result.success) {
        ctx.status = 201;
        //await service.logMovement(actorUid,studentId,status+" the leave from");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getClassmateData = getClassmateData;
const getClassAttendance = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const classID = body.classID;
    const attendanceDate = body.attendanceDate;
    let result = yield service.getClassAttendance(classID, attendanceDate);
    if (result.success) {
        ctx.status = 201;
        //await service.logMovement(actorUid,studentId,status+" the leave from");
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getClassAttendance = getClassAttendance;
const submitAttendanceList = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const data = body.data;
    const classID = body.classID;
    const attendanceDate = body.attendanceDate;
    let result = yield service.submitAttendanceList(data, classID, attendanceDate);
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
exports.submitAttendanceList = submitAttendanceList;
const uploadImageForHomework = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const files = ctx.request.files;
    const selectedDate = body.selectedDate;
    let result = yield service.uploadImageForHomework(files, selectedDate);
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
exports.uploadImageForHomework = uploadImageForHomework;
const createHomeworkForClass = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const classID = body.classID;
    const data = body.data;
    let result = yield service.createHomeworkForClass(classID, data);
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
exports.createHomeworkForClass = createHomeworkForClass;
const checkDateHomeworkExist = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const classID = body.classID;
    const selectedDate = body.selectedDate;
    let result = yield service.checkDateHomeworkExist(classID, selectedDate);
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
exports.checkDateHomeworkExist = checkDateHomeworkExist;
const getTheHomeworkData = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const classID = body.classID;
    const selectedDate = body.selectedDate;
    console.log(selectedDate);
    let result = yield service.getTheHomeworkData(classID, selectedDate);
    if (result.success) {
        ctx.status = 201;
        ctx.type = 'image/png';
        ctx.body = result;
    }
    else {
        ctx.status = 500;
        ctx.body = result;
    }
    yield next();
});
exports.getTheHomeworkData = getTheHomeworkData;
const editHomeworkForClass = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const classID = body.classID;
    const data = body.data;
    let result = yield service.editHomeworkForClass(classID, data);
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
exports.editHomeworkForClass = editHomeworkForClass;
const getStudentFirstHalfGrade = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const classID = body.classId;
    let result = yield service.getStudentFirstHalfGrade(classID);
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
exports.getStudentFirstHalfGrade = getStudentFirstHalfGrade;
const getStudentSecondHalfGrade = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const classID = body.classId;
    let result = yield service.getStudentSecondHalfGrade(classID);
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
exports.getStudentSecondHalfGrade = getStudentSecondHalfGrade;
const submitClassSeatingTable = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const classID = body.classID;
    const classTable = body.classTable;
    let result = yield service.submitClassSeatingTable(classID, classTable);
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
exports.submitClassSeatingTable = submitClassSeatingTable;
const getClassSeatingTable = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = ctx.request.body;
    const classID = body.classID;
    let result = yield service.getClassSeatingTable(classID);
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
exports.getClassSeatingTable = getClassSeatingTable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVhY2hlckZ1bmN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnRyb2xsZXJzL3RlYWNoZXJGdW5jdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHFFQUF1RDtBQUdoRCxNQUFNLGVBQWUsR0FBRyxDQUFPLEdBQWtCLEVBQUUsSUFBUyxFQUFFLEVBQUU7SUFDbkUsTUFBTSxJQUFJLEdBQVksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDdkMsTUFBTSxTQUFTLEdBQVksSUFBNkIsQ0FBQyxTQUFTLENBQUM7SUFDbkUsTUFBTSxTQUFTLEdBQVksSUFBOEIsQ0FBQyxTQUFTLENBQUM7SUFDcEUsTUFBTSxPQUFPLEdBQVksSUFBMkIsQ0FBQyxPQUFPLENBQUM7SUFDN0QsTUFBTSxPQUFPLEdBQVksSUFBNEIsQ0FBQyxPQUFPLENBQUM7SUFDOUQsSUFBSSxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBQyxTQUFTLEVBQUMsT0FBTyxFQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2hGLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtRQUNsQixHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNqQix5RUFBeUU7UUFDekUsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7S0FDbkI7U0FBTTtRQUNMLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0tBQ25CO0lBQ0QsTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUNqQixDQUFDLENBQUEsQ0FBQztBQWhCVyxRQUFBLGVBQWUsbUJBZ0IxQjtBQUVLLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBTyxHQUFrQixFQUFFLElBQVMsRUFBRSxFQUFFO0lBQ3BFLE1BQU0sSUFBSSxHQUFZLEdBQUcsQ0FB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