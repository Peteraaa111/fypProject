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
exports.updateInterestClass = exports.approvalInterestClassForm = exports.getAllInterestClassRegistration = exports.findData = exports.updateAttendance = exports.approvalLeaveForm = exports.getAllSystemProblem = exports.getAllLeaveForm = exports.logMovement = exports.changePasswordForUser = exports.getAllUser = void 0;
const Constant_1 = require("../models/Constant");
const Firebase_1 = require("../utilities/Firebase");
const Firebase_2 = require("../utilities/Firebase");
const Firebase_3 = require("../utilities/Firebase");
const getAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersCollection = Firebase_1.firestore.collection('users');
        const querySnapshot = yield usersCollection.get();
        const teachersUsers = [];
        const parentsUsers = [];
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            userData.id = doc.id;
            if (userData.role === 'Teacher') {
                teachersUsers.push(userData);
            }
            else if (userData.role === 'Parent') {
                parentsUsers.push(userData);
            }
        });
        return { teachersUsers, parentsUsers };
    }
    catch (error) {
        console.error('Error getting all users:', error);
        throw error;
    }
});
exports.getAllUser = getAllUser;
const changePasswordForUser = (userId, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Firebase_2.auth.updateUser(userId, { password: newPassword });
        console.log('Password updated successfully');
        return { success: true };
    }
    catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
});
exports.changePasswordForUser = changePasswordForUser;
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
const getAllLeaveForm = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leaveFormCollection = Firebase_1.firestore.collection('leaveForm');
        const querySnapshot = yield leaveFormCollection.get();
        const leaveFormList = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const dateApplied = data.dateApplied.toDate(); // Convert Timestamp to Date
            const hkDate = dateApplied.toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong', hour12: false });
            data.dateApplied = hkDate;
            leaveFormList.push(data);
        });
        return { leaveFormList };
    }
    catch (error) {
        console.error('Error getting leave form list:', error);
        throw error;
    }
});
exports.getAllLeaveForm = getAllLeaveForm;
const getAllSystemProblem = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const systemProblemCollection = Firebase_1.firestore.collection('systemProblemList');
        const querySnapshot = yield systemProblemCollection.get();
        const systemProblemList = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const dateApplied = data.dateApplied.toDate(); // Convert Timestamp to Date
            const hkDate = dateApplied.toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong', hour12: false });
            data.dateApplied = hkDate;
            systemProblemList.push(data);
        });
        return { systemProblemList };
    }
    catch (error) {
        console.error('Error getting all system problem list:', error);
        throw error;
    }
});
exports.getAllSystemProblem = getAllSystemProblem;
const approvalLeaveForm = (status, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leaveFormCollection = Firebase_1.firestore.collection('leaveForm');
        const querySnapshot = yield leaveFormCollection.where('ID', '==', id).get();
        const doc = querySnapshot.docs[0];
        let ChangeStatus;
        if (status === 'approve') {
            ChangeStatus = 'Approved';
        }
        else {
            ChangeStatus = 'Rejected';
        }
        yield doc.ref.update({ status: ChangeStatus });
        const data = doc.data();
        const dateApplied = data.dateApplied.toDate();
        const formattedDate = dateApplied.toISOString().split('T')[0];
        if (status === 'approve') {
            yield (0, exports.updateAttendance)(data.classID, data.studentId, formattedDate);
        }
        return { success: true, message: "Leave Form updated", studentId: data.studentId, date: formattedDate };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.approvalLeaveForm = approvalLeaveForm;
const updateAttendance = (classId, id, date) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = Constant_1.ConstantYear.currentYear + "-" + Constant_1.ConstantYear.nextYear;
        const data = yield (0, exports.findData)(classId, id);
        const studentAttendanceListCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classId}/attendance/${date}/studentAttendanceList/`);
        const newDoc = studentAttendanceListCollection.doc(data.classNumber.toString());
        const takeAttendanceTime = new Date();
        const formattedDate = takeAttendanceTime.toLocaleDateString('en-US');
        yield newDoc.set({
            classNumber: data.classNumber,
            status: "Sick",
            studentChiName: data.studentChiName,
            studentEngName: data.studentEngName,
            studentNumber: id,
            takeAttendanceTime: formattedDate,
        });
    }
    catch (error) {
        console.error("Error writing document: ", error);
    }
});
exports.updateAttendance = updateAttendance;
const findData = (classId, studentID) => __awaiter(void 0, void 0, void 0, function* () {
    const yearSelector = Constant_1.ConstantYear.currentYear + "-" + Constant_1.ConstantYear.nextYear;
    const classCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classId}/classmate`);
    const querySnapshot = yield classCollection.where('studentId', '==', studentID).get();
    const doc = querySnapshot.docs[0];
    return doc.data();
});
exports.findData = findData;
const getAllInterestClassRegistration = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const interestClassFormCollection = Firebase_1.firestore.collection('applyInterestClassList');
        const querySnapshot = yield interestClassFormCollection.get();
        const interestClassFormList = [];
        querySnapshot.forEach((doc) => {
            if (doc.get('status') === 'Pending') {
                const data = doc.data();
                const dateApplied = data.dateApplied.toDate(); // Convert Timestamp to Date
                const hkDate = dateApplied.toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong', hour12: false });
                data.dateApplied = hkDate;
                interestClassFormList.push(data);
            }
        });
        return { interestClassFormList };
    }
    catch (error) {
        console.error('Error getting leave form list:', error);
        throw error;
    }
});
exports.getAllInterestClassRegistration = getAllInterestClassRegistration;
const approvalInterestClassForm = (status, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const interestClassFormCollection = Firebase_1.firestore.collection('applyInterestClassList');
        const querySnapshot = yield interestClassFormCollection.where('interestClassID', '==', id).get();
        const doc = querySnapshot.docs[0];
        let ChangeStatus;
        if (status === 'approve') {
            ChangeStatus = 'Approved';
        }
        else {
            ChangeStatus = 'Rejected';
        }
        const hkTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" });
        const approveDate = new Date(hkTime);
        const formattedDate = `${approveDate.getFullYear()}-${("0" + (approveDate.getMonth() + 1)).slice(-2)}-${("0" + approveDate.getDate()).slice(-2)} ${("0" + approveDate.getHours()).slice(-2)}:${("0" + approveDate.getMinutes()).slice(-2)}:${("0" + approveDate.getSeconds()).slice(-2)}`;
        yield doc.ref.update({ status: ChangeStatus, approveDate: formattedDate });
        let data;
        // if(status==='approve'){
        //   data = {
        //     studentID:doc.get('studentId'),
        //     classID:doc.get('classID'),
        //   }
        //   await updateInterestClass(data.classID,data.studentID,id);
        // }
        return { success: true, message: "Interest Class Form updated" };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.approvalInterestClassForm = approvalInterestClassForm;
const updateInterestClass = (classId, id, interestClassID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = Constant_1.ConstantYear.currentYear + "-" + Constant_1.ConstantYear.nextYear;
        const data = yield (0, exports.findData)(classId, id);
        const interestClassForStudentCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/interestClassForStudent`);
        const newDoc = interestClassForStudentCollection.doc(id.toString());
        const docSnapshot = yield newDoc.get();
        if (docSnapshot.exists) {
            yield newDoc.update({
                classId: classId,
                studentChiName: data.studentChiName,
                studentEngName: data.studentEngName,
                studentId: id,
                interestClass: Firebase_3.fieldValue.arrayUnion({ interestClassId: interestClassID }),
            });
        }
        else {
            yield newDoc.set({
                classId: classId,
                studentChiName: data.studentChiName,
                studentEngName: data.studentEngName,
                studentId: id,
                interestClass: [{ interestClassId: interestClassID }],
            });
        }
    }
    catch (error) {
        console.error("Error writing document: ", error);
    }
});
exports.updateInterestClass = updateInterestClass;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvYWRtaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsaURBQWtEO0FBQ2xELG9EQUF1RDtBQUN2RCxvREFBNkM7QUFDN0Msb0RBQW1EO0FBRTVDLE1BQU0sVUFBVSxHQUFHLEdBQVMsRUFBRTtJQUNqQyxJQUFJO1FBQ0EsTUFBTSxlQUFlLEdBQUcsb0JBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0MsTUFBTSxhQUFhLEdBQUcsTUFBTSxlQUFlLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFbEQsTUFBTSxhQUFhLEdBQVUsRUFBRSxDQUFDO1FBQ2hDLE1BQU0sWUFBWSxHQUFVLEVBQUUsQ0FBQztRQUMvQixhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDMUIsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBUyxDQUFDO1lBQ25DLFFBQVEsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNyQixJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFO2dCQUM3QixhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzlCO2lCQUFNLElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7Z0JBQ3JDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDN0I7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLENBQUM7S0FDMUM7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNaLE9BQU8sQ0FBQyxLQUFLLENBQUMsMEJBQTBCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDakQsTUFBTSxLQUFLLENBQUM7S0FDZjtBQUNMLENBQUMsQ0FBQSxDQUFDO0FBdEJXLFFBQUEsVUFBVSxjQXNCckI7QUFFSyxNQUFNLHFCQUFxQixHQUFHLENBQU8sTUFBYyxFQUFFLFdBQW1CLEVBQUUsRUFBRTtJQUMvRSxJQUFJO1FBQ0YsTUFBTSxlQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUM3QyxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDO0tBQ3pCO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLDBCQUEwQixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2pELE1BQU0sS0FBSyxDQUFDO0tBQ2I7QUFDTCxDQUFDLENBQUEsQ0FBQztBQVRXLFFBQUEscUJBQXFCLHlCQVNoQztBQUVLLE1BQU0sV0FBVyxHQUFHLENBQU8sUUFBWSxFQUFFLFNBQWMsRUFBRSxNQUFXLEVBQUUsRUFBRTtJQUMzRSxJQUFJO1FBQ0YsTUFBTSxNQUFNLEdBQUcsb0JBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFckMsTUFBTSxPQUFPLEdBQUc7WUFDZCxRQUFRLEVBQUUsUUFBUTtZQUNsQixTQUFTLEVBQUUsU0FBUztZQUNwQixNQUFNLEVBQUUsTUFBTTtZQUNkLFNBQVMsRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQztTQUM5RSxDQUFDO1FBRUYsTUFBTSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTFCLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsQ0FBQztLQUNsRDtJQUFDLE9BQU8sS0FBVSxFQUFFO1FBQ25CLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7S0FDdkU7QUFDTCxDQUFDLENBQUEsQ0FBQztBQWpCVyxRQUFBLFdBQVcsZUFpQnRCO0FBR0ssTUFBTSxlQUFlLEdBQUcsR0FBUyxFQUFFO0lBQ3hDLElBQUk7UUFDQSxNQUFNLG1CQUFtQixHQUFHLG9CQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sYUFBYSxHQUFHLE1BQU0sbUJBQW1CLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDdEQsTUFBTSxhQUFhLEdBQVUsRUFBRSxDQUFDO1FBRWhDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUM1QixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFTLENBQUM7WUFDL0IsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLDRCQUE0QjtZQUMzRSxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNsRyxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztZQUMxQixhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxFQUFHLGFBQWEsRUFBRSxDQUFDO0tBQzdCO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDWixPQUFPLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sS0FBSyxDQUFDO0tBQ2Y7QUFDSCxDQUFDLENBQUEsQ0FBQztBQW5CVyxRQUFBLGVBQWUsbUJBbUIxQjtBQUVLLE1BQU0sbUJBQW1CLEdBQUcsR0FBUyxFQUFFO0lBQzVDLElBQUk7UUFDQSxNQUFNLHVCQUF1QixHQUFHLG9CQUFFLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDbkUsTUFBTSxhQUFhLEdBQUcsTUFBTSx1QkFBdUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUMxRCxNQUFNLGlCQUFpQixHQUFVLEVBQUUsQ0FBQztRQUVwQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDNUIsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBUyxDQUFDO1lBQy9CLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyw0QkFBNEI7WUFDM0UsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDbEcsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7WUFDMUIsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxFQUFHLGlCQUFpQixFQUFFLENBQUM7S0FDakM7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNaLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0NBQXdDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDL0QsTUFBTSxLQUFLLENBQUM7S0FDZjtBQUNILENBQUMsQ0FBQSxDQUFDO0FBbkJXLFFBQUEsbUJBQW1CLHVCQW1COUI7QUFFSyxNQUFNLGlCQUFpQixHQUFHLENBQU8sTUFBYSxFQUFDLEVBQVMsRUFBRSxFQUFFO0lBQ2pFLElBQUk7UUFDQSxNQUFNLG1CQUFtQixHQUFHLG9CQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sYUFBYSxHQUFHLE1BQU0sbUJBQW1CLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFNUUsTUFBTSxHQUFHLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxJQUFJLFlBQVksQ0FBQztRQUNqQixJQUFHLE1BQU0sS0FBRyxTQUFTLEVBQUM7WUFDcEIsWUFBWSxHQUFJLFVBQVUsQ0FBQTtTQUMzQjthQUFJO1lBQ0gsWUFBWSxHQUFJLFVBQVUsQ0FBQTtTQUMzQjtRQUdELE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztRQUU5QyxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDeEIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUM5QyxNQUFNLGFBQWEsR0FBRyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTlELElBQUcsTUFBTSxLQUFHLFNBQVMsRUFBQztZQUNwQixNQUFNLElBQUEsd0JBQWdCLEVBQUMsSUFBSSxDQUFDLE9BQU8sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ25FO1FBSUQsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsQ0FBQztLQUN6RztJQUFDLE9BQU8sS0FBVSxFQUFFO1FBQ25CLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7S0FDdkU7QUFDTCxDQUFDLENBQUEsQ0FBQztBQTlCVyxRQUFBLGlCQUFpQixxQkE4QjVCO0FBRUssTUFBTSxnQkFBZ0IsR0FBRyxDQUFPLE9BQWMsRUFBQyxFQUFTLEVBQUMsSUFBVyxFQUFFLEVBQUU7SUFDN0UsSUFBRztRQUNELE1BQU0sWUFBWSxHQUFHLHVCQUFZLENBQUMsV0FBVyxHQUFDLEdBQUcsR0FBQyx1QkFBWSxDQUFDLFFBQVEsQ0FBQztRQUN4RSxNQUFNLElBQUksR0FBRyxNQUFNLElBQUEsZ0JBQVEsRUFBQyxPQUFPLEVBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEMsTUFBTSwrQkFBK0IsR0FBRyxvQkFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsWUFBWSxVQUFVLE9BQU8sZUFBZSxJQUFJLHlCQUF5QixDQUFDLENBQUM7UUFDakosTUFBTSxNQUFNLEdBQUcsK0JBQStCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNoRixNQUFNLGtCQUFrQixHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDdEMsTUFBTSxhQUFhLEdBQUcsa0JBQWtCLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFckUsTUFBTSxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQ2YsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQzdCLE1BQU0sRUFBRSxNQUFNO1lBQ2QsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjO1lBQ25DLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYztZQUNuQyxhQUFhLEVBQUUsRUFBRTtZQUNqQixrQkFBa0IsRUFBRSxhQUFhO1NBQ2xDLENBQUMsQ0FBQztLQUNKO0lBQUEsT0FBTyxLQUFLLEVBQUU7UUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLDBCQUEwQixFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ2xEO0FBQ0gsQ0FBQyxDQUFBLENBQUE7QUFwQlksUUFBQSxnQkFBZ0Isb0JBb0I1QjtBQUVNLE1BQU0sUUFBUSxHQUFHLENBQU8sT0FBYyxFQUFDLFNBQWdCLEVBQUUsRUFBRTtJQUNoRSxNQUFNLFlBQVksR0FBRyx1QkFBWSxDQUFDLFdBQVcsR0FBQyxHQUFHLEdBQUMsdUJBQVksQ0FBQyxRQUFRLENBQUM7SUFDeEUsTUFBTSxlQUFlLEdBQUcsb0JBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLFlBQVksVUFBVSxPQUFPLFlBQVksQ0FBQyxDQUFDO0lBQ2pHLE1BQU0sYUFBYSxHQUFHLE1BQU0sZUFBZSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3RGLE1BQU0sR0FBRyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEMsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDcEIsQ0FBQyxDQUFBLENBQUE7QUFOWSxRQUFBLFFBQVEsWUFNcEI7QUFFTSxNQUFNLCtCQUErQixHQUFHLEdBQVMsRUFBRTtJQUN4RCxJQUFJO1FBQ0EsTUFBTSwyQkFBMkIsR0FBRyxvQkFBRSxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzVFLE1BQU0sYUFBYSxHQUFHLE1BQU0sMkJBQTJCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDOUQsTUFBTSxxQkFBcUIsR0FBVSxFQUFFLENBQUM7UUFFeEMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQzVCLElBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBRyxTQUFTLEVBQUM7Z0JBQy9CLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQVMsQ0FBQztnQkFDL0IsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLDRCQUE0QjtnQkFDM0UsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7Z0JBQ2xHLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO2dCQUMxQixxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDbEM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sRUFBRyxxQkFBcUIsRUFBRSxDQUFDO0tBQ3JDO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDWixPQUFPLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sS0FBSyxDQUFDO0tBQ2Y7QUFDSCxDQUFDLENBQUEsQ0FBQztBQXJCVyxRQUFBLCtCQUErQixtQ0FxQjFDO0FBRUssTUFBTSx5QkFBeUIsR0FBRyxDQUFPLE1BQWEsRUFBQyxFQUFTLEVBQUUsRUFBRTtJQUN6RSxJQUFJO1FBQ0EsTUFBTSwyQkFBMkIsR0FBRyxvQkFBRSxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzVFLE1BQU0sYUFBYSxHQUFHLE1BQU0sMkJBQTJCLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVqRyxNQUFNLEdBQUcsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLElBQUksWUFBWSxDQUFDO1FBQ2pCLElBQUcsTUFBTSxLQUFHLFNBQVMsRUFBQztZQUNwQixZQUFZLEdBQUksVUFBVSxDQUFBO1NBQzNCO2FBQUk7WUFDSCxZQUFZLEdBQUksVUFBVSxDQUFBO1NBQzNCO1FBQ0QsTUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLEVBQUMsUUFBUSxFQUFFLGdCQUFnQixFQUFDLENBQUMsQ0FBQztRQUNoRixNQUFNLFdBQVcsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyQyxNQUFNLGFBQWEsR0FBRyxHQUFHLFdBQVcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFFMVIsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBQyxZQUFZLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUM7UUFDMUUsSUFBSSxJQUFJLENBQUM7UUFFVCwwQkFBMEI7UUFDMUIsYUFBYTtRQUNiLHNDQUFzQztRQUN0QyxrQ0FBa0M7UUFDbEMsTUFBTTtRQUVOLCtEQUErRDtRQUMvRCxJQUFJO1FBRUosT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLDZCQUE2QixFQUFFLENBQUM7S0FDbEU7SUFBQyxPQUFPLEtBQVUsRUFBRTtRQUNuQixPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO0tBQ3ZFO0FBQ0wsQ0FBQyxDQUFBLENBQUM7QUFoQ1csUUFBQSx5QkFBeUIsNkJBZ0NwQztBQUVLLE1BQU0sbUJBQW1CLEdBQUcsQ0FBTyxPQUFlLEVBQUUsRUFBVSxFQUFFLGVBQXVCLEVBQUUsRUFBRTtJQUNoRyxJQUFJO1FBQ0YsTUFBTSxZQUFZLEdBQUcsdUJBQVksQ0FBQyxXQUFXLEdBQUcsR0FBRyxHQUFHLHVCQUFZLENBQUMsUUFBUSxDQUFDO1FBQzVFLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBQSxnQkFBUSxFQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN6QyxNQUFNLGlDQUFpQyxHQUFHLG9CQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixZQUFZLDBCQUEwQixDQUFDLENBQUM7UUFDaEgsTUFBTSxNQUFNLEdBQUcsaUNBQWlDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBRXBFLE1BQU0sV0FBVyxHQUFHLE1BQU0sTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3ZDLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRTtZQUN0QixNQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ2xCLE9BQU8sRUFBRSxPQUFPO2dCQUNoQixjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWM7Z0JBQ25DLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYztnQkFDbkMsU0FBUyxFQUFFLEVBQUU7Z0JBQ2IsYUFBYSxFQUFFLHFCQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxDQUFDO2FBQzNFLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxNQUFNLE1BQU0sQ0FBQyxHQUFHLENBQUM7Z0JBQ2YsT0FBTyxFQUFFLE9BQU87Z0JBQ2hCLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYztnQkFDbkMsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjO2dCQUNuQyxTQUFTLEVBQUUsRUFBRTtnQkFDYixhQUFhLEVBQUUsQ0FBQyxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsQ0FBQzthQUN0RCxDQUFDLENBQUM7U0FDSjtLQUNGO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLDBCQUEwQixFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ2xEO0FBQ0gsQ0FBQyxDQUFBLENBQUE7QUE1QlksUUFBQSxtQkFBbUIsdUJBNEIvQiJ9