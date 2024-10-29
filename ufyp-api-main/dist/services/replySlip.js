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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumStudentsWithReplySlip = exports.getAllClassAndStudent = exports.getAllClass = exports.distributionReplySlip = exports.logMovement = exports.deleteReplySlip = exports.editReplySlip = exports.addReplySlip = exports.getReplySlip = void 0;
const Firebase_1 = require("../utilities/Firebase");
const notification_1 = require("./notification");
const getReplySlip = (yearSelect) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const replySlipCollection = Firebase_1.firestore.collection(`academicYear/${yearSelect}/replySlip/`);
        const docRefs = yield replySlipCollection.get();
        const replySlips = [];
        docRefs.docs.forEach((doc) => {
            const data = doc.data();
            const replySlip = Object.assign({ id: doc.id }, data);
            replySlips.push(replySlip);
        });
        return { success: true, data: replySlips };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getReplySlip = getReplySlip;
const addReplySlip = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const replySlipCollection = Firebase_1.firestore.collection(`academicYear/${data.yearSelect}/replySlip/`);
        const now = new Date();
        const formattedDate = now.toISOString().substring(0, 10);
        var numberGet;
        replySlipCollection.get().then((querySnapshot) => {
            const newDocNumber = querySnapshot.size + 1;
            let newDoc = {
                id: (newDocNumber).toString(),
                titleTC: data.titleTC,
                titleEN: data.titleEN,
                mainContentTC: data.mainContentTC,
                mainContentEN: data.mainContentEN,
                recipientContentTC: data.recipientContentTC,
                recipientContentEN: data.recipientContentEN,
                payment: data.payment,
                //recipient:data.recipient,
                creationDate: formattedDate,
                status: "UD",
            };
            if (data.payment) {
                newDoc.paymentAmount = data.paymentAmount;
            }
            replySlipCollection.doc(newDocNumber.toString()).set(newDoc);
            numberGet = newDocNumber.toString();
        });
        return { success: true, message: "Reply slip add success", resultid: numberGet };
    }
    catch (error) {
        console.error(`Error adding activity`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.addReplySlip = addReplySlip;
const editReplySlip = (dataID, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const replySlipCollection = Firebase_1.firestore.collection(`academicYear/${data.yearSelect}/replySlip/`);
        const replySlipDoc = replySlipCollection.doc(dataID);
        const now = new Date();
        const formattedDate = now.toISOString().substring(0, 10);
        let updatedData = {
            titleTC: data.titleTC,
            titleEN: data.titleEN,
            mainContentTC: data.mainContentTC,
            mainContentEN: data.mainContentEN,
            recipientContentTC: data.recipientContentTC,
            recipientContentEN: data.recipientContentEN,
            payment: data.payment,
            creationDate: formattedDate,
        };
        if (data.payment) {
            updatedData.paymentAmount = data.paymentAmount;
        }
        yield replySlipDoc.update(updatedData);
        return { success: true, message: "Reply slip edit success" };
    }
    catch (error) {
        console.error(`Error editing reply slip`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.editReplySlip = editReplySlip;
const deleteReplySlip = (dataID, yearSelect) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const replySlipCollection = Firebase_1.firestore.collection(`academicYear/${yearSelect}/replySlip/`);
        const replySlipDoc = replySlipCollection.doc(dataID);
        yield replySlipDoc.delete();
        return { success: true, message: "Reply slip deleted successfully" };
    }
    catch (error) {
        console.error(`Error deleting reply slip`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.deleteReplySlip = deleteReplySlip;
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
const distributionReplySlip = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (data.selectOption === "selectAll") {
            const classCollection = Firebase_1.firestore.collection(`academicYear/${data.yearSelect}/class/`);
            const classCollectionDocs = yield classCollection.get();
            const now = new Date();
            const formattedDate = now.toISOString().substring(0, 10);
            classCollectionDocs.forEach((classDoc) => __awaiter(void 0, void 0, void 0, function* () {
                const classmateCollection = classDoc.ref.collection('classmate');
                const classmateDocs = yield classmateCollection.get();
                classmateDocs.forEach((classmateDoc) => __awaiter(void 0, void 0, void 0, function* () {
                    const replySlipGotCollection = classmateDoc.ref.collection('replySlipGot');
                    const query = replySlipGotCollection.where('replySlipID', '==', data.id);
                    const querySnapshot = yield query.get();
                    if (querySnapshot.empty) {
                        yield replySlipGotCollection.doc().set({
                            replySlipID: data.id,
                            read: "NR",
                            submit: "NS",
                            gotDate: formattedDate,
                        });
                    }
                    else {
                        console.log(`Classmate ${classmateDoc.id} already has a reply slip with ID ${data.id}.`);
                    }
                }));
            }));
            const replySlipDocRef = Firebase_1.firestore.collection(`academicYear/${data.yearSelect}/replySlip`).doc(data.id);
            yield replySlipDocRef.update({ status: "D" });
        }
        else if (data.selectOption === "selectClass") {
            const classCollection = Firebase_1.firestore.collection(`academicYear/${data.yearSelect}/class/`);
            const classCollectionDocs = yield classCollection.get();
            const now = new Date();
            const formattedDate = now.toISOString().substring(0, 10);
            classCollectionDocs.forEach((classDoc) => __awaiter(void 0, void 0, void 0, function* () {
                if (data.classSelectedOptions.includes(classDoc.id)) {
                    const classmateCollection = classDoc.ref.collection('classmate');
                    const classmateDocs = yield classmateCollection.get();
                    classmateDocs.forEach((classmateDoc) => __awaiter(void 0, void 0, void 0, function* () {
                        const replySlipGotCollection = classmateDoc.ref.collection('replySlipGot');
                        const query = replySlipGotCollection.where('replySlipID', '==', data.id);
                        const querySnapshot = yield query.get();
                        if (querySnapshot.empty) {
                            yield replySlipGotCollection.doc().set({
                                replySlipID: data.id,
                                read: "NR",
                                submit: "NS",
                                gotDate: formattedDate,
                            });
                        }
                        else {
                            console.log(`Classmate ${classmateDoc.id} already has a reply slip with ID ${data.id}.`);
                        }
                    }));
                    const replySlipDocRef = Firebase_1.firestore.collection(`academicYear/${data.yearSelect}/replySlip`).doc(data.id);
                    yield replySlipDocRef.update({ status: "D" });
                }
            }));
        }
        else if (data.selectOption === "selectStudent") {
            const classCollection = Firebase_1.firestore.collection(`academicYear/${data.yearSelect}/class/`);
            const classCollectionDocs = yield classCollection.get();
            const now = new Date();
            const formattedDate = now.toISOString().substring(0, 10);
            for (const student of data.studentSelectedOptions) {
                const classDoc = classCollection.doc(student.class);
                const classmateCollection = classDoc.collection('classmate');
                const query = classmateCollection.where('studentId', '==', student.studentID);
                const querySnapshot = yield query.get();
                if (!querySnapshot.empty) {
                    const classmateDoc = querySnapshot.docs[0];
                    const replySlipGotCollection = classmateDoc.ref.collection('replySlipGot');
                    const querReplyslip = replySlipGotCollection.where('replySlipID', '==', data.id);
                    const queryReplySlipSnapshot = yield querReplyslip.get();
                    if (queryReplySlipSnapshot.empty) {
                        let deviceData;
                        let title, content;
                        yield replySlipGotCollection.doc().set({
                            replySlipID: data.id,
                            read: "NR",
                            submit: "NS",
                            gotDate: formattedDate,
                        });
                        deviceData = yield (0, notification_1.getDeviceByUserID)(student.studentID);
                        console.log(deviceData);
                        if (deviceData.data.languageCode === 'zh') {
                            title = "有新通告已發放";
                            content = "通告" + data.id + "已發放，請查閱";
                        }
                        else {
                            title = "New notice has been issued";
                            content = "ReplySlip number" + data.id + " has been issued, please check";
                        }
                        yield (0, notification_1.sendNotificationWithAttribute)(title, content, deviceData.data.deviceID, "ReplySlip");
                    }
                    else {
                        console.log(`Student ${student.studentID} in class ${student.class} already has a reply slip with ID ${data.id}.`);
                    }
                }
                else {
                    console.log(`Student ${student.studentID} in class ${student.class} does not exist.`);
                }
            }
            const replySlipDocRef = Firebase_1.firestore.collection(`academicYear/${data.yearSelect}/replySlip`).doc(data.id);
            yield replySlipDocRef.update({ status: "D" });
        }
        return { success: true, message: "distribution successful" };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.distributionReplySlip = distributionReplySlip;
const getAllClass = (yearSelect) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classCollection = Firebase_1.firestore.collection(`academicYear/${yearSelect}/class/`);
        const classCollectionDocs = yield classCollection.get();
        const classes = [];
        classCollectionDocs.docs.forEach((doc) => {
            const classid = { id: doc.id };
            classes.push(classid);
        });
        return { success: true, data: classes };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getAllClass = getAllClass;
const getAllClassAndStudent = (yearSelect) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classCollection = Firebase_1.firestore.collection(`academicYear/${yearSelect}/class/`);
        const classCollectionDocs = yield classCollection.get();
        const classesAndStudent = [];
        for (const classDoc of classCollectionDocs.docs) {
            const students = [];
            const classData = { class: classDoc.id, students: students };
            const classmateCollection = classDoc.ref.collection('classmate');
            const classmateDocs = yield classmateCollection.get();
            for (const classmateDoc of classmateDocs.docs) {
                const studentData = classmateDoc.data();
                students.push(studentData);
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
const getNumStudentsWithReplySlip = (yearSelect, replySlipId) => __awaiter(void 0, void 0, void 0, function* () {
    let numStudentsWithReplySlip = 0;
    let numStudentsReadReplySlip = 0;
    let numStudentsSubmittedReplySlip = 0;
    const peopleGotReplySlip = [];
    try {
        const classCollection = Firebase_1.firestore.collection(`academicYear/${yearSelect}/class/`);
        const classCollectionDocs = yield classCollection.get();
        for (const classDoc of classCollectionDocs.docs) {
            const classmateCollection = classDoc.ref.collection('classmate');
            const classmateDocs = yield classmateCollection.get();
            for (const classmateDoc of classmateDocs.docs) {
                const studentdata = classmateDoc.data();
                const replySlipGotCollection = classmateDoc.ref.collection('replySlipGot');
                const replySlipGotDocs = yield replySlipGotCollection.where('replySlipID', '==', replySlipId).get();
                if (!replySlipGotDocs.empty) {
                    numStudentsWithReplySlip++;
                    const replySlipGotData = replySlipGotDocs.docs[0].data();
                    if (replySlipGotData.read === 'R') {
                        numStudentsReadReplySlip++;
                    }
                    if (replySlipGotData.submit === 'S') {
                        numStudentsSubmittedReplySlip++;
                    }
                    const data = Object.assign(Object.assign({ class: classDoc.id }, studentdata), replySlipGotData);
                    peopleGotReplySlip.push(data);
                }
            }
        }
        return { success: true, data: { numStudentsWithReplySlip, numStudentsReadReplySlip, numStudentsSubmittedReplySlip, peopleGotReplySlip } };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getNumStudentsWithReplySlip = getNumStudentsWithReplySlip;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbHlTbGlwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL3JlcGx5U2xpcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxvREFBdUQ7QUFLdkQsaURBQWtGO0FBRTNFLE1BQU0sWUFBWSxHQUFHLENBQU8sVUFBaUIsRUFBRSxFQUFFO0lBQ3BELElBQUk7UUFDQSxNQUFNLG1CQUFtQixHQUFHLG9CQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixVQUFVLGFBQWEsQ0FBQyxDQUFDO1FBQ25GLE1BQU0sT0FBTyxHQUFHLE1BQU0sbUJBQW1CLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQVUsRUFBRSxDQUFDO1FBQzdCLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDekIsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3hCLE1BQU0sU0FBUyxtQkFBSyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSyxJQUFJLENBQUUsQ0FBQztZQUMxQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRS9CLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDO0tBQzlDO0lBQUMsT0FBTyxLQUFVLEVBQUU7UUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDOUIsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztLQUN6RTtBQUNMLENBQUMsQ0FBQSxDQUFDO0FBaEJXLFFBQUEsWUFBWSxnQkFnQnZCO0FBRUssTUFBTSxZQUFZLEdB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