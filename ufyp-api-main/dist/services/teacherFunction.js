"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClassSeatingTable = exports.submitClassSeatingTable = exports.getStudentSecondHalfGrade = exports.getStudentFirstHalfGrade = exports.editHomeworkForClass = exports.getTheHomeworkData = exports.checkDateHomeworkExist = exports.createHomeworkForClass = exports.uploadImageForHomework = exports.getClassAttendance = exports.getClassmateData = exports.submitAttendanceList = exports.addNotification = void 0;
const Constant_1 = require("../models/Constant");
const Firebase_1 = require("../utilities/Firebase");
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const form_data_1 = __importDefault(require("form-data"));
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
// import { 
// } from '../models/pushNotification'
const addNotification = (contentTC, contentEN, titleTC, titleEN) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notificationCollection = Firebase_1.firestore.collection(`notification`);
        const snapshot = yield notificationCollection.get();
        const id = snapshot.size + 1;
        yield notificationCollection.add({
            id: id,
            titleTC: titleTC,
            titleEN: titleEN,
            contentTC: contentTC,
            contentEN: contentEN,
        });
        return { success: true, message: "Add notification success" };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.addNotification = addNotification;
const getStudentClassID = (studentId, classID) => __awaiter(void 0, void 0, void 0, function* () {
    const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
    const classmateCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/classmate/`);
    const classmateDoc = yield classmateCollection.where('studentId', '==', studentId).get();
    if (classmateDoc.docs[0]) {
        let classNumber = classmateDoc.docs[0].get('classNumber');
        console.log("have");
        return classNumber.toString();
    }
});
const submitAttendanceList = (data, classID, attendanceDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const attendanceDateDocRef = Firebase_1.firestore.doc(`academicYear/${yearSelector}/class/${classID}/attendance/${attendanceDate}`);
        const newCollectionRef = attendanceDateDocRef.collection('studentAttendanceList');
        const now = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });
        for (let i = 0; i < data.length; i++) {
            let studentClassNumber = yield getStudentClassID(data[i].studentNumber, classID);
            const newData = {
                classNumber: studentClassNumber.toString(),
                studentChiName: data[i].studentChiName,
                studentEngName: data[i].studentEngName,
                status: data[i].status,
                studentNumber: data[i].studentNumber,
                takeAttendanceTime: now
            };
            yield newCollectionRef.doc(studentClassNumber.toString()).set(newData);
        }
        return { success: true, message: "The attendance has been taken" };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.submitAttendanceList = submitAttendanceList;
const getClassmateData = (classID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const classmateCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/classmate/`);
        const classmateDoc = yield classmateCollection.get();
        let classStudent = [];
        classmateDoc.forEach((doc) => {
            const data = {
                "studentId": doc.get("studentId"),
                "studentChiName": doc.get("studentChiName"),
                "studentEngName": doc.get("studentEngName"),
            };
            classStudent.push(data);
        });
        return { success: true, data: classStudent };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getClassmateData = getClassmateData;
const getClassAttendance = (classID, getClassAttendance) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const classAttendanceCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/attendance/${getClassAttendance}/studentAttendanceList/`);
        const classAttendanceDoc = yield classAttendanceCollection.get();
        let attendanceData = [];
        classAttendanceDoc.forEach((doc) => {
            const data = {
                "status": doc.get("status"),
                "studentNumber": doc.get("studentNumber"),
            };
            attendanceData.push(data);
        });
        return { success: true, data: attendanceData };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getClassAttendance = getClassAttendance;
const uploadImageForHomework = (files, selectedDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boundingBoxes = [];
        const pathModule = require('path');
        let workData = {
            chi: '',
            eng: '',
            math: '',
            gs: '',
            other: '',
            id: selectedDate,
        };
        for (const file of files) {
            const { originalname, path: tempPath } = file;
            const targetPath = pathModule.join(__dirname, '../../', 'assets', originalname);
            // Move the file to the assets folder
            yield fs_1.default.promises.rename(tempPath, targetPath);
            // Get image dimensions
            let { width = 0, height = 0 } = yield (0, sharp_1.default)(targetPath).metadata();
            // Cut the image into 5 parts
            const image = (0, sharp_1.default)(targetPath);
            const partHeight = 162;
            for (let i = 0; i < 5; i++) {
                const image = (0, sharp_1.default)(targetPath);
                const partPath = pathModule.join(__dirname, '../../', 'assets', `part${i}.jpg`);
                yield image.extract({ left: 75, top: i * partHeight, width: 480, height: partHeight }).toFile(partPath);
                // Call OCR API 
                const formData = new form_data_1.default();
                formData.append('show_original_response', 'false');
                formData.append('fallback_providers', "");
                formData.append("providers", "google");
                formData.append('language', 'zh');
                formData.append('file', fs_1.default.createReadStream(partPath));
                console.log(formData);
                const options = {
                    method: "POST",
                    url: "https://api.edenai.run/v2/ocr/ocr",
                    headers: {
                        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYzBlMTc0NmItMjU0MS00Yzc4LTkzZGYtZjQ3ZWQwOTJiOThhIiwidHlwZSI6ImFwaV90b2tlbiJ9.u9XuHYV1nNdAckiGVcDhwoKqTdKATL05H27d-KR46m0",
                        "Content-Type": "multipart/form-data; boundary=" + formData.getBoundary(),
                    },
                    data: formData,
                };
                const response = yield axios_1.default.request(options);
                boundingBoxes.push(response.data);
            }
            for (let i = 0; i < boundingBoxes.length; i++) {
                const boundingBox = boundingBoxes[i].google;
                console.log(boundingBox);
                if (i === 0) {
                    workData.chi = boundingBox.text;
                }
                else if (i === 1) {
                    workData.eng = boundingBox.text;
                }
                else if (i === 2) {
                    workData.math = boundingBox.text;
                }
                else if (i === 3) {
                    workData.gs = boundingBox.text;
                }
                else if (i === 4) {
                    workData.other = boundingBox.text;
                }
            }
        }
        return { success: true, message: 'Upload Success', data: workData };
    }
    catch (error) {
        console.error(`Error uploading files`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.uploadImageForHomework = uploadImageForHomework;
const createHomeworkForClass = (classId, workData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const homeworkCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classId}/homework`);
        yield homeworkCollection.doc(workData.id.toString()).set(workData);
        return { success: true, message: `Create successfully` };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.createHomeworkForClass = createHomeworkForClass;
const checkDateHomeworkExist = (classId, selectedDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const homeworkCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classId}/homework`);
        const snapshot = yield homeworkCollection.doc(selectedDate).get();
        if (snapshot.exists) {
            return { success: true, exist: true, message: `Homework already exists` };
        }
        else {
            return { success: true, exist: false, message: `Homework does not exist` };
        }
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.checkDateHomeworkExist = checkDateHomeworkExist;
const getTheHomeworkData = (classId, selectedDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const homeworkCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classId}/homework`);
        const snapshot = yield homeworkCollection.doc(selectedDate).get();
        const filePath = path_1.default.join(__dirname, '../../', 'assets', selectedDate + ".png");
        const fileContents = fs_1.default.readFileSync(filePath);
        return { success: true, exist: true, data: snapshot.data(), fileContents: fileContents, message: `Get homework data successfully` };
        //return { success:true, exist: true, fileContents: fileContents, message: `Get homework data successfully`};
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getTheHomeworkData = getTheHomeworkData;
const editHomeworkForClass = (classId, workData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const homeworkCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classId}/homework`);
        yield homeworkCollection.doc(workData.id.toString()).update(workData);
        return { success: true, message: `edit successfully` };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.editHomeworkForClass = editHomeworkForClass;
const getStudentFirstHalfGrade = (classId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        let data = [];
        let haveData = false;
        const classmateCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/grade/firstHalfTerm/class/${classId}/classmate`);
        const classmateDoc = yield classmateCollection.get();
        classmateDoc.forEach(doc => {
            data.push({
                chi: doc.get('chi'),
                math: doc.get('math'),
                gs: doc.get('gs'),
                eng: doc.get('eng'),
                studentChiName: doc.get('studentChiName'),
                studentEngName: doc.get('studentEngName'),
            });
        });
        haveData = data.length > 0;
        return { success: true, data: data, haveData: haveData };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getStudentFirstHalfGrade = getStudentFirstHalfGrade;
const getStudentSecondHalfGrade = (classId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        let data = [];
        let haveData = false;
        const classmateCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/grade/secondHalfTerm/class/${classId}/classmate`);
        const classmateDoc = yield classmateCollection.get();
        classmateDoc.forEach(doc => {
            data.push({
                chi: doc.get('chi'),
                math: doc.get('math'),
                gs: doc.get('gs'),
                eng: doc.get('eng'),
                studentChiName: doc.get('studentChiName'),
                studentEngName: doc.get('studentEngName'),
            });
        });
        haveData = data.length > 0;
        return { success: true, data: data, haveData: haveData };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getStudentSecondHalfGrade = getStudentSecondHalfGrade;
const submitClassSeatingTable = (classID, classTable) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const classCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/`);
        const classDoc = yield classCollection.doc(classID.toString());
        yield classDoc.set({ classTable: classTable }, { merge: true });
        return { success: true, message: "Submit class seating table success" };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.submitClassSeatingTable = submitClassSeatingTable;
const getClassSeatingTable = (classID) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const classCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/`);
        const classDoc = yield classCollection.doc(classID.toString()).get();
        if (!classDoc.exists) {
            return { success: false, message: "Class document does not exist" };
        }
        const classTable = (_a = classDoc.data()) === null || _a === void 0 ? void 0 : _a.classTable;
        if (!classTable) {
            return { success: false, message: "Class table does not exist" };
        }
        return { success: true, classTable: classTable };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getClassSeatingTable = getClassSeatingTable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVhY2hlckZ1bmN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL3RlYWNoZXJGdW5jdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpREFBa0Q7QUFDbEQsb0RBQXVEO0FBS3ZELGtEQUEwQjtBQUMxQiw0Q0FBb0I7QUFDcEIsMERBQWlDO0FBQ2pDLGtEQUEwQjtBQUMxQixnREFBd0I7QUFDeEIsWUFBWTtBQUVaLHNDQUFzQztBQUUvQixNQUFNLGVBQWUsR0FBRyxDQUFPLFNBQWdCLEVBQUUsU0FBZ0IsRUFBQyxPQUFjLEVBQUMsT0FBYyxFQUFFLEVBQUU7SUFDdEcsSUFBSTtRQUNGLE1BQU0sc0JBQXNCLEdBQUcsb0JBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFN0QsTUFBTSxRQUFRLEdBQUcsTUFBTSxzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNwRCxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUU3QixNQUFNLHNCQUFzQixDQUFDLEdBQUcsQ0FBQztZQUMvQixFQUFFLEVBQUUsRUFBRTtZQUNOLE9BQU8sRUFBQyxPQUFPO1lBQ2YsT0FBTyxFQUFDLE9BQU87WUFDZixTQUFTLEVBQUUsU0FBUztZQUNwQixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDLENBQUM7UUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsQ0FBQztLQUMvRDtJQUFDLE9BQU8sS0FBVSxFQUFFO1FBQ25CLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckIsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztLQUN2RTtBQUNMLENB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