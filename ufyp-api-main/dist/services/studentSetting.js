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
exports.editInterestClassForStudentDocument = exports.addInterestClassForStudentDocument = exports.getStudentRewardDetail = exports.logMovement = exports.getAllStudentReward = exports.findStudentById = exports.editStudentReward = exports.applyRewardToStudent = exports.getAllClassAndStudent = void 0;
const Firebase_1 = require("../utilities/Firebase");
const Firebase_2 = require("../utilities/Firebase");
const fs = __importStar(require("fs"));
const uuid_1 = require("uuid");
const getAllClassAndStudent = (yearSelect) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classCollection = Firebase_1.firestore.collection(`academicYear/${yearSelect}/class/`);
        const classCollectionDocs = yield classCollection.get();
        const rewardStudentData = yield (0, exports.getAllStudentReward)(yearSelect);
        const classesAndStudent = [];
        for (const classDoc of classCollectionDocs.docs) {
            const students = [];
            const classData = { class: classDoc.id, students: students };
            const classmateCollection = classDoc.ref.collection('classmate');
            const classmateDocs = yield classmateCollection.get();
            for (const classmateDoc of classmateDocs.docs) {
                const studentData = classmateDoc.data();
                const studentId = studentData.studentId;
                const studentExists = rewardStudentData.data.some((rewardStudent) => rewardStudent.studentId === studentId);
                if (!studentExists) {
                    students.push(studentData);
                }
            }
            if (students.length > 0) {
                classesAndStudent.push(classData);
            }
        }
        return { success: true, data: classesAndStudent };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getAllClassAndStudent = getAllClassAndStudent;
const applyRewardToStudent = (files, applyRewardData, rewardArray) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rewardRef = yield Firebase_1.firestore
            .collection("academicYear")
            .doc(applyRewardData.selectedYear)
            .collection("reward")
            .doc(applyRewardData.studentId);
        const studentData = yield (0, exports.findStudentById)(applyRewardData.studentId);
        let studentRewards = [];
        yield rewardRef.set({ studentId: applyRewardData.studentId,
            classId: applyRewardData.studentClass,
            englishName: studentData.data.s_EngName,
            chineseName: studentData.data.s_ChiName
        });
        //await rewardRef.update({reward:rewardArray})
        const storageUrl = "https://firebasestorage.googleapis.com/v0/b/ufyp-a18cf.appspot.com/o";
        const token = (0, uuid_1.v4)();
        //var [filesInBucket] = await bucket.getFiles({ prefix: applyRewardData.filePath });
        for (let i = 0; i < rewardArray.length; i++) {
            const reward = rewardArray[i];
            const file = files[i];
            //let studentRewardIn = [];
            const buffer = fs.readFileSync(file.path);
            let fileName = `${applyRewardData.filePath}/${reward.rewardNameEN}(${reward.rewardNameTC}).jpg`;
            let fileRef = Firebase_2.bucket.file(`${fileName}`);
            const imageName = `${reward.rewardNameEN}(${reward.rewardNameTC}).jpg`;
            yield fileRef.save(buffer, { metadata: { contentType: file.mimetype, metadata: { firebaseStorageDownloadTokens: token, } } });
            const url = `${storageUrl}/${encodeURIComponent(fileName)}?alt=media&token=${token}`;
            yield (0, exports.logMovement)(applyRewardData.CurrentUserUid, applyRewardData.studentId, "add reward to student" + studentData.data.s_ChiName + " reward image path is" + applyRewardData.filePath + " and file name is " + imageName);
            studentRewards.push({ rewardNameEN: reward.rewardNameEN, rewardNameTC: reward.rewardNameTC, imageName: imageName, imageUrl: url });
        }
        yield rewardRef.update({ reward: studentRewards });
        return { success: true, message: "Upload Success" };
    }
    catch (error) {
        console.error(`Error uploading files to ${applyRewardData.filePath}:`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.applyRewardToStudent = applyRewardToStudent;
const editStudentReward = (files, applyRewardData, rewardArray) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rewardRef = yield Firebase_1.firestore
            .collection("academicYear")
            .doc(applyRewardData.selectedYear)
            .collection("reward")
            .doc(applyRewardData.studentId);
        let studentRewards = [];
        const studentData = yield (0, exports.findStudentById)(applyRewardData.studentId);
        //await rewardRef.update({reward:rewardArray})
        const storageUrl = "https://firebasestorage.googleapis.com/v0/b/ufyp-a18cf.appspot.com/o";
        const token = (0, uuid_1.v4)();
        const folderName = `${applyRewardData.filePath}/`;
        const folderRef = Firebase_2.bucket.file(folderName);
        const [folderExists] = yield folderRef.exists();
        if (folderExists) {
            // Delete existing folder
            yield Firebase_2.bucket.deleteFiles({ prefix: folderName });
        }
        const folderMetadata = { contentType: 'application/x-www-form-urlencoded;charset=UTF-8' };
        yield folderRef.save('', { metadata: folderMetadata });
        for (let i = 0; i < rewardArray.length; i++) {
            const reward = rewardArray[i];
            const file = files[i];
            const buffer = fs.readFileSync(file.path);
            let fileName = `${applyRewardData.filePath}/${reward.rewardNameEN}(${reward.rewardNameTC}).jpg`;
            let fileRef = Firebase_2.bucket.file(`${fileName}`);
            const imageName = `${reward.rewardNameEN}(${reward.rewardNameTC}).jpg`;
            yield fileRef.save(buffer, { metadata: { contentType: file.mimetype, metadata: { firebaseStorageDownloadTokens: token, } } });
            const url = `${storageUrl}/${encodeURIComponent(fileName)}?alt=media&token=${token}`;
            yield (0, exports.logMovement)(applyRewardData.CurrentUserUid, applyRewardData.studentId, "add reward to student" + studentData.data.s_ChiName + " reward image path is" + applyRewardData.filePath + " and file name is " + imageName);
            studentRewards.push({ rewardNameEN: reward.rewardNameEN, rewardNameTC: reward.rewardNameTC, imageName: imageName, imageUrl: url });
        }
        yield rewardRef.update({ reward: studentRewards });
        return { success: true, message: "Upload Success" };
    }
    catch (error) {
        console.error(`Error uploading files to ${applyRewardData.filePath}:`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.editStudentReward = editStudentReward;
const findStudentById = (studentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentQuery = Firebase_1.firestore.collection("students").where("s_Id", "==", studentId);
        const studentSnapshot = yield studentQuery.get();
        if (!studentSnapshot.empty) {
            const studentData = studentSnapshot.docs[0].data();
            return { success: true, data: studentData };
        }
        else {
            return { success: false, message: "Student not found" };
        }
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.findStudentById = findStudentById;
const getAllStudentReward = (academicYear) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docRefs = yield Firebase_1.firestore
            .collection("academicYear")
            .doc(academicYear)
            .collection("reward")
            .get();
        const studentRewards = [];
        docRefs.docs.forEach((doc) => {
            const data = doc.data();
            studentRewards.push(data);
        });
        return { success: true, data: studentRewards };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getAllStudentReward = getAllStudentReward;
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
const getStudentRewardDetail = (academicYear, studentID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docRefs = yield Firebase_1.firestore
            .collection("academicYear")
            .doc(academicYear)
            .collection("reward")
            .doc(studentID)
            .get();
        const data = docRefs.data();
        return { success: true, data: data };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getStudentRewardDetail = getStudentRewardDetail;
const addInterestClassForStudentDocument = (data, applyInterestClassData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const interestClassForStudentCollection = Firebase_1.firestore.collection(`academicYear/${applyInterestClassData.selectedYear}/interestClassForStudent`);
        const newDocumentRef = interestClassForStudentCollection.doc(applyInterestClassData.studentId);
        const studentData = yield (0, exports.findStudentById)(applyInterestClassData.studentId);
        let studentInterestClass = [];
        yield newDocumentRef.set({
            studentId: applyInterestClassData.studentId,
            classId: applyInterestClassData.studentClass,
            englishName: studentData.data.s_EngName,
            chineseName: studentData.data.s_ChiName
        });
        for (let i = 0; i < data.length; i++) {
            studentInterestClass.push({ interestClassId: data[i].interestClassName });
        }
        yield newDocumentRef.update({ interestClass: studentInterestClass });
        return { success: true, message: "Interest class for student added successfully" };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.addInterestClassForStudentDocument = addInterestClassForStudentDocument;
const editInterestClassForStudentDocument = (data, applyInterestClassData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const interestClassForStudentCollection = Firebase_1.firestore.collection(`academicYear/${applyInterestClassData.selectedYear}/interestClassForStudent`);
        const newDocumentRef = interestClassForStudentCollection.doc(applyInterestClassData.studentId);
        let studentInterestClass = [];
        for (let i = 0; i < data.length; i++) {
            studentInterestClass.push({ interestClassId: data[i].interestClassName });
        }
        yield newDocumentRef.update({ interestClass: studentInterestClass });
        return { success: true, message: "Interest class for student edit successfully" };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.editInterestClassForStudentDocument = editInterestClassForStudentDocument;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R1ZGVudFNldHRpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvc3R1ZGVudFNldHRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvREFBdUQ7QUFDdkQsb0RBQThDO0FBQzlDLHVDQUF5QjtBQUV6QiwrQkFBb0M7QUFVN0IsTUFBTSxxQkFBcUIsR0FBRyxDQUFPLFVBQWtCLEVBQUUsRUFBRTtJQUM5RCxJQUFJO1FBQ0YsTUFBTSxlQUFlLEdBQUcsb0JBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLFVBQVUsU0FBUyxDQUFDLENBQUM7UUFDM0UsTUFBTSxtQkFBbUIsR0FBRyxNQUFNLGVBQWUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN4RCxNQUFNLGlCQUFpQixHQUFHLE1BQU0sSUFBQSwyQkFBbUIsRUFBQyxVQUFVLENBQUMsQ0FBQztRQUVoRSxNQUFNLGlCQUFpQixHQUFVLEVBQUUsQ0FBQztRQUNwQyxLQUFLLE1BQU0sUUFBUSxJQUFJLG1CQUFtQixDQUFDLElBQUksRUFBRTtZQUMvQyxNQUFNLFFBQVEsR0FBVSxFQUFFLENBQUM7WUFDM0IsTUFBTSxTQUFTLEdBQUcsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUMsUUFBUSxFQUFDLENBQUM7WUFDM0QsTUFBTSxtQkFBbUIsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNqRSxNQUFNLGFBQWEsR0FBRyxNQUFNLG1CQUFtQixDQUFDLEdBQUcsRUFBRSxDQUFDO1lBRXRELEtBQUssTUFBTSxZQUFZLElBQUksYUFBYSxDQUFDLElBQUksRUFBRTtnQkFDN0MsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUN4QyxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFD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