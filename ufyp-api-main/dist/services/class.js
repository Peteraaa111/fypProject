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
exports.getClassTimeTable = exports.addClassTimeTable = exports.deleteHomeworkInClass = exports.deleteTeacherInClass = exports.addTeachersToClass = exports.getNotAssignTeacher = exports.getAllClassTeachers = exports.uploadHomeworkImage = exports.getWholeYearClassGrade = exports.submitAttendance = exports.getAttendanceDateInfo = exports.editExam = exports.getAllDocumentsInCollection = exports.addClassExamGrade = exports.getNoGradeStudentInClass = exports.addClassToGrade = exports.editHomework = exports.getClassHomework = exports.removeStudentFromClass = exports.redistributeClassNumber = exports.logMovement = exports.addStudentsToClass = exports.getClassAndClassHomework = exports.getUnassignedStudents = exports.getClassmateByAcademicYearAndClass = exports.getAcademicYearWithClasses = exports.createClass = void 0;
const Firebase_1 = require("../utilities/Firebase");
const Error_1 = require("../models/Error");
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const sharp_1 = __importDefault(require("sharp"));
const form_data_1 = __importDefault(require("form-data"));
const Constant_1 = require("../models/Constant");
const notification_1 = require("./notification");
const createClass = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const academicYearRef = Firebase_1.firestore.collection('academicYear');
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;
        const academicYearId = `${currentYear}-${nextYear}`;
        const classRef = academicYearRef.doc(academicYearId).collection('class');
        const classes = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'];
        // Check if the academic year document exists
        const academicYearDoc = yield academicYearRef.doc(academicYearId).get();
        if (!academicYearDoc.exists) {
            // Create the academic year document
            yield academicYearRef.doc(academicYearId).set({});
        }
        const batch = Firebase_1.firestore.batch();
        classes.forEach(className => {
            const classInfo = classRef.doc(className);
            batch.set(classInfo, {});
        });
        yield batch.commit();
        return { success: true, message: "All classes created successfully" };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.createClass = createClass;
const getAcademicYearWithClasses = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const academicYearSnapshot = yield Firebase_1.firestore.collection('academicYear').get();
        const academicYears = [];
        for (const academicYearDoc of academicYearSnapshot.docs) {
            const academicYearData = academicYearDoc.data();
            const academicYearId = academicYearDoc.id;
            const classSnapshot = yield Firebase_1.firestore
                .collection('academicYear')
                .doc(academicYearId)
                .collection('class')
                .get();
            const classes = classSnapshot.docs.map(classDoc => ({
                id: classDoc.id,
                data: classDoc.data(),
            }));
            const academicYear = {
                id: academicYearId,
                data: academicYearData,
                classes,
            };
            academicYears.push(academicYear);
        }
        return { success: true, data: academicYears };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getAcademicYearWithClasses = getAcademicYearWithClasses;
const getClassmateByAcademicYearAndClass = (year, classID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classmateCollection = Firebase_1.firestore.collection('academicYear').doc(year).collection('class').doc(classID).collection('classmate');
        const querySnapshot = yield classmateCollection.get();
        const promises = querySnapshot.docs.map((doc) => __awaiter(void 0, void 0, void 0, function* () {
            const classmateData = doc.data(); // Cast the data to the User interface
            return classmateData;
        }));
        const classmates = yield Promise.all(promises);
        return { success: true, data: classmates };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getClassmateByAcademicYearAndClass = getClassmateByAcademicYearAndClass;
const getUnassignedStudents = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get all student documents
        const studentDocsSnapshot = yield Firebase_1.firestore.collection('students').get();
        const studentIds = studentDocsSnapshot.docs.map((studentDoc) => studentDoc.id);
        // Get all classmate documents
        const classmateDocsSnapshot = yield Firebase_1.firestore.collectionGroup('classmate').get();
        const assignedStudentIds = classmateDocsSnapshot.docs.map((classmateDoc) => classmateDoc.id);
        const unassignedStudents = [];
        // Loop through student IDs and check if they are not in the assignedStudentIds array
        for (const studentId of studentIds) {
            if (!assignedStudentIds.includes(studentId)) {
                const studentDocSnapshot = studentDocsSnapshot.docs.find((studentDoc) => studentDoc.id === studentId);
                if (studentDocSnapshot) {
                    unassignedStudents.push(studentDocSnapshot.data());
                }
            }
        }
        return { success: true, data: unassignedStudents };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getUnassignedStudents = getUnassignedStudents;
const getClassAndClassHomework = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearlyData = [];
        const academicYearSnap = yield Firebase_1.firestore
            .collection('academicYear').get();
        for (const academicYearId of academicYearSnap.docs) {
            const academicYearid = academicYearId.id;
            const classSnapshot = yield Firebase_1.firestore
                .collection('academicYear')
                .doc(academicYearid)
                .collection('class')
                .get();
            const classesWithHomework = [];
            for (const classDoc of classSnapshot.docs) {
                const classId = classDoc.id;
                const homeworkSnapshot = yield Firebase_1.firestore
                    .collection('academicYear')
                    .doc(academicYearid)
                    .collection('class')
                    .doc(classId)
                    .collection('homework')
                    .get();
                const homework = homeworkSnapshot.docs.map(homeworkDoc => ({
                    id: homeworkDoc.id,
                    data: homeworkDoc.data(),
                }));
                const classWithHomework = {
                    id: classId,
                    homework,
                };
                classesWithHomework.push(classWithHomework);
            }
            const academicYearWithClasses = {
                year: academicYearid,
                classes: classesWithHomework,
            };
            yearlyData.push(academicYearWithClasses);
        }
        return { success: true, data: yearlyData };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getClassAndClassHomework = getClassAndClassHomework;
const addStudentsToClass = (studentClassList, actorUid, academicYearValue) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classmateCollectionRef = Firebase_1.firestore.collection(`academicYear/${academicYearValue}/class`);
        let classmateCountArray = [];
        const batch = Firebase_1.firestore.batch();
        for (const { sid, classId } of studentClassList) {
            // Check if the student already exists in the classmate collection
            const classmateCollectionRefForClass = classmateCollectionRef.doc(classId).collection('classmate');
            const querySnapshot = yield classmateCollectionRefForClass.where('studentId', '==', sid).get();
            if (!querySnapshot.empty) {
                throw new Error_1.AddStudentToClassError('The student is already added to the classmate collection.');
            }
            // Get the student data from the students collection
            const studentsCollectionRef = Firebase_1.firestore.collection('students');
            const studentQuerySnapshot = yield studentsCollectionRef.where('s_Id', '==', sid).get();
            if (studentQuerySnapshot.empty) {
                throw new Error_1.AddStudentToClassError('Student data not found in the students collection.');
            }
            const studentDocSnapshot = studentQuerySnapshot.docs[0];
            const studentData = studentDocSnapshot.data();
            const studentDocId = studentDocSnapshot.id; // Retrieve the document ID of the student
            // const totalClassmateCountSnapshot = await classmateCollectionRefForClass.get();
            // if(!flag){
            //   number = totalClassmateCountSnapshot.size;
            //   flag = true;
            // }
            let currentClassNumber;
            const classmateCountObject = classmateCountArray.find((obj) => obj.classId === classId);
            if (classmateCountObject) {
                currentClassNumber = classmateCountObject.number + 1;
                classmateCountObject.number = currentClassNumber;
            }
            else {
                const totalClassmateCountSnapshot = yield classmateCollectionRefForClass.get();
                const totalClassmateCount = totalClassmateCountSnapshot.size;
                currentClassNumber = totalClassmateCount + 1;
                classmateCountArray.push({ classId, number: currentClassNumber });
            }
            // Add the student to the classmate collection
            const classmateDocRef = classmateCollectionRefForClass.doc(studentDocId);
            batch.set(classmateDocRef, {
                studentId: sid,
                studentChiName: studentData.s_ChiName,
                studentEngName: studentData.s_EngName,
                classNumber: currentClassNumber,
            });
            //logMovement(actorUid,studentDocId,'add studentId '+sid + ' to class '+classId,)
        }
        yield batch.commit();
        return { success: true, message: 'Students added to the classmate collection successfully.' };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.addStudentsToClass = addStudentsToClass;
const logMovement = (actorUid, targetUid, action) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logRef = Firebase_1.firestore.collection('logs');
        const logData = {
            actorUid: actorUid,
            TargetUid: targetUid,
            action: action,
            timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong' }),
        };
        yield logRef.add(logData);
        return { success: true, message: "log created" };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.logMovement = logMovement;
const redistributeClassNumber = (classID, academicYearValue) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classmateCollectionRef = Firebase_1.firestore
            .collection('academicYear')
            .doc(academicYearValue)
            .collection('class')
            .doc(classID)
            .collection('classmate');
        // Get all classmate documents for the given classID
        const querySnapshot = yield classmateCollectionRef.get();
        // Sort the classmate documents based on the English name first letter
        const sortedClassmates = querySnapshot.docs.sort((a, b) => {
            const nameA = a.data().studentEngName.toUpperCase();
            const nameB = b.data().studentEngName.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });
        // Update the class number for each classmate document
        const batch = Firebase_1.firestore.batch();
        sortedClassmates.forEach((doc, index) => {
            const updatedClassmateData = {
                classNumber: index + 1,
            };
            batch.update(doc.ref, updatedClassmateData);
        });
        // Commit the batched updates
        yield batch.commit();
        return { success: true, message: 'Class numbers redistributed successfully.' };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: 'An error occurred while redistributing class numbers.' };
    }
});
exports.redistributeClassNumber = redistributeClassNumber;
const removeStudentFromClass = (classId, studentId, academicYearValue) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classmateCollectionRef = Firebase_1.firestore.collection(`academicYear/${academicYearValue}/class/${classId}/classmate`);
        const querySnapshot = yield classmateCollectionRef.where('studentId', '==', studentId).get();
        if (!querySnapshot.empty) {
            const documentId = querySnapshot.docs[0].id;
            yield classmateCollectionRef.doc(documentId).delete();
            return { success: true, message: "The student is removed from the class" };
        }
        else {
            return { success: false, message: "The student is not found in the classmate collection" };
        }
    }
    catch (error) {
        console.error(`Remove failed with studentID: ${studentId}`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.removeStudentFromClass = removeStudentFromClass;
// Create a new function for getting the class homework
const getClassHomework = (classID, year) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classHomeworkCollection = Firebase_1.firestore.collection(`academicYear/${year}/class/${classID}/homework/`);
        const querySnapshot = yield classHomeworkCollection.get();
        console.log(querySnapshot.size); // log the number of documents in the collection
        const classHomework = [];
        querySnapshot.forEach(doc => {
            const homework = {
                id: doc.id,
                data: doc.data(),
            };
            console.log(homework);
            classHomework.push(homework);
        });
        if (classHomework.length > 0) {
            return { success: true, data: classHomework };
        }
        else {
            return { success: false, message: 'Homework not found' };
        }
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getClassHomework = getClassHomework;
const editHomework = (classID, date, editdata, academicYearId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classHomeworkCollection = Firebase_1.firestore.collection(`academicYear/${academicYearId}/class/${classID}/homework/`);
        const querySnapshot = yield classHomeworkCollection.doc(date).get();
        // Update the document data with the editdata parameter
        if (querySnapshot.exists) {
            yield classHomeworkCollection.doc(date).set(editdata);
            return { success: true, message: "Homework updated successfully." };
        }
        else {
            return { success: false, message: "Homework not found." };
        }
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.editHomework = editHomework;
// create a new function to get all the doc id from class and add into grade collection doc sub collection, and these collection is a sub collection of academic year
const addClassToGrade = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;
        const academicYearId = `${currentYear}-${nextYear}`;
        const classCollection = Firebase_1.firestore.collection(`academicYear/${academicYearId}/class`);
        const querySnapshot = yield classCollection.get();
        if (!querySnapshot.empty) {
            const classList = [];
            querySnapshot.forEach((doc) => {
                classList.push(Object.assign({ id: doc.id }, doc.data()));
            });
            const gradeCollection = Firebase_1.firestore.collection(`academicYear/${academicYearId}/grade`);
            const firstHalfTermDocRef = gradeCollection.doc("firstHalfTerm");
            const secondHalfTermDocRef = gradeCollection.doc("secondHalfTerm");
            yield firstHalfTermDocRef.set({});
            yield secondHalfTermDocRef.set({});
            const gradeQuerySnapshot = yield gradeCollection.get();
            if (!gradeQuerySnapshot.empty) {
                gradeQuerySnapshot.forEach((doc) => {
                    const gradeId = doc.id;
                    classList.forEach((classItem) => {
                        const classId = classItem.id;
                        //const classData = classItem;
                        const classRef = Firebase_1.firestore.collection(`academicYear/${academicYearId}/grade/${gradeId}/class`);
                        const classDocRef = classRef.doc(classId);
                        classDocRef.set({});
                        //classDocRef.set(classData);
                    });
                });
            }
            return { success: true, message: 'Class added to grade successfully.' };
        }
        else {
            return { success: false, message: 'Class not found' };
        }
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.addClassToGrade = addClassToGrade;
const getNoGradeStudentInClass = (yearSelector, gradeDate, classID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classStudentCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/classmate`);
        const gradeCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/grade/${gradeDate}/class/${classID}/classmate`);
        // Get all the documents from the classmate collection
        const classmateDocsSnapshot = yield classStudentCollection.get();
        const unassignedStudents = [];
        // Get all the document IDs from the grade collection
        const gradeDocsSnapshot = yield gradeCollection.get();
        const gradeIds = gradeDocsSnapshot.docs.map((doc) => doc.id);
        // Loop through the classmate documents and check if they are not in the grade IDs array
        for (const doc of classmateDocsSnapshot.docs) {
            const classmateId = doc.id;
            const classmateData = doc.data();
            if (!classmateData) {
                continue;
            }
            if (!gradeIds.includes(classmateId)) {
                unassignedStudents.push(Object.assign({ classmateId }, classmateData));
            }
        }
        return { success: true, data: unassignedStudents };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getNoGradeStudentInClass = getNoGradeStudentInClass;
const addClassExamGrade = (classID, year, gradeDate, data, actorUid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classCollection = Firebase_1.firestore.collection(`academicYear/${year}/class/${classID}/classmate`);
        const gradeClassCollection = Firebase_1.firestore.collection(`academicYear/${year}/grade/${gradeDate}/class/`);
        const classDocRef = gradeClassCollection.doc(classID);
        const classGradeCollectionRef = classDocRef.collection('classmate');
        // const classmateData = classmateDocs.docs.map(doc => doc.data());
        let titleTC, titleEN, contentTC, contentEN;
        if (gradeDate === 'firstHalfTerm') {
            titleTC = "上學期";
            contentTC = "上學期成績已派發，請查閱";
            titleEN = "First Half Term";
            contentEN = "First Half Term grade has been issued, please check";
        }
        else {
            titleTC = "下學期";
            contentTC = "下學期成績已派發，請查閱";
            titleEN = "Second Half Term";
            contentEN = "Second Half Term grade has been issued, please check";
        }
        data.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(item);
            const querySnapshot = yield classCollection.where('classNumber', '==', Number(item.classNumber)).get();
            const classmateData = querySnapshot.docs[0].data();
            const markDocRef = classGradeCollectionRef.doc(item.docID);
            markDocRef.set(Object.assign({ chi: item.chi, eng: item.eng, gs: item.gs, math: item.math }, classmateData));
            (0, exports.logMovement)(actorUid, item.docID, 'add student ' + classmateData.studentChiName + ' garde');
            let deviceData;
            let title, content;
            deviceData = yield (0, notification_1.getDeviceByUserID)(classmateData.studentId);
            console.log(deviceData);
            if (deviceData.data) {
                if (deviceData.data.languageCode === 'zh') {
                    title = titleTC;
                    content = contentTC;
                }
                else {
                    title = titleEN;
                    content = contentEN;
                }
                yield (0, notification_1.sendNotificationWithAttribute)(title, content, deviceData.data.deviceID, "Exam");
            }
        }));
        return { success: true };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.addClassExamGrade = addClassExamGrade;
const getAllDocumentsInCollection = (yearSelector, gradeDate, classID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collectionRef = Firebase_1.firestore.collection(`academicYear/${yearSelector}/grade/${gradeDate}/class/${classID}/classmate`);
        const snapshot = yield collectionRef.get();
        const documents = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        return { success: true, data: documents };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getAllDocumentsInCollection = getAllDocumentsInCollection;
const editExam = (classID, year, date, editdata) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stduentExamMarkCollection = Firebase_1.firestore.collection(`academicYear/${year}/grade/${date}/class/${classID}/classmate`);
        const querySnapshot = yield stduentExamMarkCollection.doc(editdata.docID).get();
        if (querySnapshot.exists) {
            const { chi, eng, math, gs } = editdata;
            yield stduentExamMarkCollection.doc(editdata.docID).update({ chi, eng, math, gs });
            return { success: true, message: "Exam Mark updated successfully." };
        }
        else {
            return { success: false, message: "Exam Mark not found." };
        }
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.editExam = editExam;
const getAttendanceDateInfo = (classNumber, year, classID, attendanceDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentAttendanceListCollection = Firebase_1.firestore.doc(`academicYear/${year}/class/${classID}/attendance/${attendanceDate}/studentAttendanceList/${classNumber}`);
        const studentAttendanceListDoc = yield studentAttendanceListCollection.get();
        if (studentAttendanceListDoc.exists) {
            const data = {
                status: studentAttendanceListDoc.get('status'),
                takeAttendanceTime: studentAttendanceListDoc.get('takeAttendanceTime'),
            };
            console.log(data);
            // const data = studentAttendanceListDoc.data();
            return { success: true, message: 'Data found', data: { status: data === null || data === void 0 ? void 0 : data.status, takeAttendanceTime: data === null || data === void 0 ? void 0 : data.takeAttendanceTime } };
        }
        else {
            return { success: true, data: { status: "NM", takeAttendanceTime: "NM" } };
        }
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getAttendanceDateInfo = getAttendanceDateInfo;
const submitAttendance = (data, year, classID, attendanceDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const attendanceDateDocRef = Firebase_1.firestore.doc(`academicYear/${year}/class/${classID}/attendance/${attendanceDate}`);
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
            const newData = {
                classNumber: data[i].classNumber.toString(),
                studentChiName: data[i].studentChiName,
                studentEngName: data[i].studentEngName,
                status: data[i].selectedValue,
                studentNumber: data[i].studentNumber,
                takeAttendanceTime: now
            };
            yield newCollectionRef.doc(data[i].classNumber.toString()).set(newData);
        }
        return { success: true, message: "The attendance has been taken" };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.submitAttendance = submitAttendance;
const getWholeYearClassGrade = (yearSelect) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentYear = 2023;
        const nextYear = currentYear + 1;
        const academicYearId = `${currentYear}-${nextYear}`;
        const classArray = ['A', 'B'];
        const collections = [];
        const studentData = [];
        // Loop through the class array and generate the class IDs
        for (let i = 0; i < classArray.length; i++) {
            const classID = yearSelect + classArray[i];
            const collection = Firebase_1.firestore.collection(`academicYear/${academicYearId}/grade/firstHalfTerm/class/${classID}/classmate`);
            collections.push(collection);
        }
        // Use batched reads to retrieve all documents in the collections
        const snapshots = yield Promise.all(collections.map((collection) => collection.get()));
        // Extract the document data from each snapshot and add it to the studentData array
        snapshots.forEach((snapshot, index) => {
            const classID = yearSelect + classArray[index];
            snapshot.forEach((doc) => {
                studentData.push(Object.assign({ classID: classID }, doc.data()));
            });
        });
        // Loop through the class array and generate the class IDs for the second term
        for (let i = 0; i < classArray.length; i++) {
            const classID = yearSelect + classArray[i];
            const collection = Firebase_1.firestore.collection(`academicYear/${academicYearId}/grade/secondHalfTerm/class/${classID}/classmate`);
            const snapshot = yield collection.get();
            snapshot.forEach((doc) => {
                const { chi, eng, gs, math, studentId } = doc.data();
                const studentObject = { term: 'secondTerm', classID: classID, secondTermChi: chi, secondTermEng: eng, secondTermGs: gs, secondTermMath: math, studentId: studentId };
                const existingStudentIndex = studentData.findIndex((student) => student.studentId === studentId);
                if (existingStudentIndex !== -1) {
                    studentData[existingStudentIndex] = Object.assign(Object.assign({}, studentData[existingStudentIndex]), studentObject);
                }
                else {
                    studentData.push(studentObject);
                }
            });
        }
        return { success: true, studentData: studentData };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getWholeYearClassGrade = getWholeYearClassGrade;
const uploadHomeworkImage = (files, classId, selectedYear, dateWork) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boundingBoxes = [];
        const pathModule = require('path');
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
            let workData = {
                chi: '',
                eng: '',
                math: '',
                gs: '',
                other: '',
                id: dateWork,
            };
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
            const homeworkCollection = Firebase_1.firestore.collection(`academicYear/${selectedYear}/class/${classId}/homework`);
            yield homeworkCollection.doc(dateWork).set(workData);
        }
        return { success: true, message: 'Upload Success' };
    }
    catch (error) {
        console.error(`Error uploading files`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.uploadHomeworkImage = uploadHomeworkImage;
const getAllClassTeachers = (yearSelector) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class`);
        const querySnapshot = yield classCollection.get();
        const documents = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (Object.keys(data).length !== 0) {
                documents.push(Object.assign({ id: doc.id }, data));
            }
            ;
        });
        return { success: true, data: documents };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getAllClassTeachers = getAllClassTeachers;
const getNotAssignTeacher = (yearSelector) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classCollection = Firebase_1.firestore.collection(`teachers`);
        const selectedYearClassTeacher = yield (0, exports.getAllClassTeachers)(yearSelector);
        const querySnapshot = yield classCollection.get();
        const documents = [];
        const notAssignTeacher = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            documents.push(Object.assign({ id: doc.id }, data));
            const t_Id = selectedYearClassTeacher.data.find((classTeacher) => classTeacher.t_Id === data.t_Id);
            if (!t_Id) {
                notAssignTeacher.push(data);
            }
        });
        return { success: true, data: notAssignTeacher };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getNotAssignTeacher = getNotAssignTeacher;
const addTeachersToClass = (yearSelector, classTeachers, actorUid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class`);
        for (const classTeacher of classTeachers) {
            const classDoc = yield classCollection.doc(classTeacher.classId).get();
            if (classDoc.exists) {
                const updatedClassData = {
                    t_ChiName: classTeacher.t_ChiName,
                    t_EngName: classTeacher.t_EngName,
                    t_Id: classTeacher.t_Id
                };
                yield classCollection.doc(classTeacher.classId).update(updatedClassData);
                yield (0, exports.logMovement)(actorUid, classTeacher.t_Id, "add teacher to class " + classTeacher.classId);
            }
        }
        return { success: true };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.addTeachersToClass = addTeachersToClass;
const deleteTeacherInClass = (yearSelector, classId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class`);
        const classDoc = yield classCollection.doc(classId).get();
        if (classDoc.exists) {
            yield classCollection.doc(classId).set({});
            return { success: true };
        }
        else {
            return { success: false, message: `Class document with ID ${classId} does not exist.` };
        }
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.deleteTeacherInClass = deleteTeacherInClass;
const deleteHomeworkInClass = (homeworkId, yearSelector, classId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const homeworkCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classId}/homework`);
        const homeworkDoc = yield homeworkCollection.doc(homeworkId).get();
        if (homeworkDoc.exists) {
            yield homeworkCollection.doc(homeworkId).delete();
            return { success: true };
        }
        else {
            return { success: false, message: `Homework document with ID ${homeworkId} does not exist.` };
        }
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.deleteHomeworkInClass = deleteHomeworkInClass;
const addClassTimeTable = (data, classId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const classTimeTableCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classId}/classTimeTable`);
        // Convert the timetable object into an array
        const timetableArray = Object.entries(data).map(([day, times]) => ({
            day,
            times
        }));
        //await classCollection.doc().set(data);
        yield classTimeTableCollection.doc("TimeTable").set({ timetable: timetableArray });
        return { success: true };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.addClassTimeTable = addClassTimeTable;
const getClassTimeTable = (classId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const classTimeTableCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classId}/classTimeTable`);
        let haveData = false;
        const snapshot = yield classTimeTableCollection.get();
        if (snapshot.empty) {
            return { success: true, haveData: haveData };
        }
        haveData = true;
        let timetableArray = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.timetable) {
                timetableArray = timetableArray.concat(data.timetable);
            }
        });
        return { success: true, data: timetableArray, haveData: haveData };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getClassTimeTable = getClassTimeTable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQXVEO0FBRXZELDJDQUF5RDtBQVF6RCw0Q0FBb0I7QUFDcEIsa0RBQTBCO0FBQzFCLGtEQUEwQjtBQUMxQiwwREFBaUM7QUFFakMsaURBQWtEO0FBQ2xELGlEQUFrRjtBQUUzRSxNQUFNLFdBQVcsR0FBRyxHQUFTLEVBQUU7SUFDbEMsSUFBSTtRQUNGLE1BQU0sZUFBZSxHQUFHLG9CQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sV0FBVyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDN0MsTUFBTSxRQUFRLEdBQUcsV0FBVyxHQUFHLENBQUMsQ0FBQztRQUNqQyxNQUFNLGNBQWMsR0FBRyxHQUFHLFdBQVcsSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUNwRCxNQUFNLFFBQVEsR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV6RSxNQUFNLE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFekYsNkNBQTZDO1FBQzdDLE1BQU0sZUFBZSxHQUFHLE1BQU0sZUFBZSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUV4RSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRTtZQUMzQixvQ0FBb0M7WUFDcEMsTUFBTSxlQUFlLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FB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