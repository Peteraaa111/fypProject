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
exports.deleteAllUserAccounts = exports.addParent = exports.getAllStudents = exports.addAdmin = exports.verifyUserToken = exports.addTeacher = exports.getAllTeachers = exports.getAllAdmins = exports.getAllParentsData = exports.deleteOneParentAccount = exports.updateUser = exports.logMovement = exports.getAllLogs = exports.updateTeacher = exports.getStudentClassID = exports.getTheCanlendar = exports.getTodayAttendance = exports.getStudentReward = exports.deleteOneNotificationByUserID = exports.deleteAllNotificationByUserID = exports.getNotificationMessage = exports.saveLanguageCode = exports.saveDeviceID = exports.changeReplySlipStatus = exports.submitReplySlip = exports.getReplySlipByUser = exports.getClassHomeworkByUser = exports.getSchoolPhotoDoc = exports.getSchoolPhotoActivityDoc = exports.getSchoolPhotoDocDate = exports.getAppliedInterestClassGroup = exports.applyInterestClass = exports.getAllInterestClassGroup = exports.getApplyLeaveListByID = exports.submitSystemProblem = exports.applyLeaveForStudent = exports.getStudentSecongetStudentAttendanceBySelectedMonthdHalfGradeByID = exports.getStudentSecondHalfGradeByID = exports.getStudentFirstHalfGradeByID = exports.editUserDataByID = exports.getTeacherDataByUID = exports.getStudentsDataByUID = exports.updateTeacherStatus = exports.updateUserStatus = exports.getTeacherSize = exports.deleteOneTeacherAccount = void 0;
const Firebase_1 = require("../utilities/Firebase");
const Firebase_2 = require("../utilities/Firebase");
const Error_1 = require("../models/Error");
const Constant_1 = require("../models/Constant");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const notification_1 = require("../services/notification");
const deleteOneParentAccount = (uid) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Delete the user account
        yield Firebase_2.auth.deleteUser(uid);
        console.log(`Deleted user account with UID: ${uid}`);
        // Delete user data from "students" collection
        const studentsCollection = Firebase_1.firestore.collection("students");
        const studentQuerySnapshot = yield studentsCollection.doc(uid).get();
        if (studentQuerySnapshot.exists) {
            yield studentQuerySnapshot.ref.delete();
            console.log(`Deleted user data with UID: ${uid}`);
        }
        const usersCollection = Firebase_1.firestore.collection("users");
        const userQuerySnapshot = yield usersCollection.doc(uid).get();
        var userEmail;
        if (userQuerySnapshot.exists) {
            userEmail = (_a = userQuerySnapshot.data()) === null || _a === void 0 ? void 0 : _a.email;
            yield userQuerySnapshot.ref.delete();
            console.log(`Deleted user data with UID: ${uid}`);
        }
        return { success: true, message: "User account successfully deleted" };
    }
    catch (error) {
        console.error(`Error deleting user account with UID: ${uid}`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.deleteOneParentAccount = deleteOneParentAccount;
const deleteOneTeacherAccount = (uid) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        // Delete the user account
        yield Firebase_2.auth.deleteUser(uid);
        console.log(`Deleted user account with UID: ${uid}`);
        // Delete user data from "students" collection
        const teachersCollection = Firebase_1.firestore.collection("teachers");
        const teacherQuerySnapshot = yield teachersCollection.doc(uid).get();
        if (teacherQuerySnapshot.exists) {
            yield teacherQuerySnapshot.ref.delete();
            console.log(`Deleted teacher user data with UID: ${uid}`);
        }
        const usersCollection = Firebase_1.firestore.collection("users");
        const userQuerySnapshot = yield usersCollection.doc(uid).get();
        var userEmail;
        if (userQuerySnapshot.exists) {
            userEmail = (_b = userQuerySnapshot.data()) === null || _b === void 0 ? void 0 : _b.email;
            yield userQuerySnapshot.ref.delete();
            console.log(`Deleted user data with UID: ${uid}`);
        }
        return { success: true, message: "User account successfully deleted" };
    }
    catch (error) {
        console.error(`Error deleting user account with UID: ${uid}`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.deleteOneTeacherAccount = deleteOneTeacherAccount;
const deleteAllUserAccounts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the list of all user accounts
        const listUsersResult = yield Firebase_2.auth.listUsers();
        const users = listUsersResult.users;
        // Delete each user account
        const deletePromises = users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield Firebase_2.auth.deleteUser(user.uid);
                console.log(`Deleted user account with UID: ${user.uid}`);
            }
            catch (error) {
                console.error(`Error deleting user account with UID: ${user.uid}`, error);
            }
        }));
        // Wait for all deletion operations to complete
        yield Promise.all(deletePromises);
        return { success: true, message: "All user accounts successfully deleted" };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.deleteAllUserAccounts = deleteAllUserAccounts;
function verifyUserToken(idToken) {
    return Firebase_2.auth
        .verifyIdToken(idToken)
        .then((claims) => {
        // Check if the user has the admin custom claim
        console.log(claims);
        return claims.role;
    })
        .catch((error) => {
        // Error occurred while verifying the token
        console.error('Error verifying user token:', error);
        return false;
    });
}
exports.verifyUserToken = verifyUserToken;
const getAllStudents = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersCollection = Firebase_1.firestore.collection('students');
        const querySnapshot = yield usersCollection.get();
        const users = [];
        querySnapshot.forEach((doc) => {
            const userData = doc.data(); // Cast the data to the User interface
            //const userId = doc.id;
            users.push(userData);
        });
        return users;
    }
    catch (error) {
        console.error('Error getting all users:', error);
        throw error;
    }
});
exports.getAllStudents = getAllStudents;
const getAllLogs = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logsCollection = Firebase_1.firestore.collection('logs');
        const querySnapshot = yield logsCollection.get();
        const logs = [];
        querySnapshot.forEach((doc) => {
            const logData = doc.data(); // Cast the data to the User interface
            //const userId = doc.id;
            logs.push(logData);
        });
        return logs;
    }
    catch (error) {
        console.error('Error getting all users:', error);
        throw error;
    }
});
exports.getAllLogs = getAllLogs;
const getAllParentsData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersCollection = Firebase_1.firestore.collection('users');
        const studentsCollection = Firebase_1.firestore.collection('students');
        const querySnapshot = yield usersCollection.where('role', '==', 'Parent').get();
        const promises = querySnapshot.docs.map((doc) => __awaiter(void 0, void 0, void 0, function* () {
            const userData = doc.data(); // Cast the data to the User interface
            const userId = doc.id;
            const studentSnapshot = yield studentsCollection.doc(userId).get();
            const studentData = studentSnapshot.data();
            const userWithStudentData = Object.assign(Object.assign({}, userData), { userId: userId, studentId: studentData === null || studentData === void 0 ? void 0 : studentData.s_Id, parent_Name: studentData === null || studentData === void 0 ? void 0 : studentData.parent_Name, parent_PhoneNumber: studentData === null || studentData === void 0 ? void 0 : studentData.parent_PhoneNumber, Home_Address: studentData === null || studentData === void 0 ? void 0 : studentData.home_Address });
            return userWithStudentData;
        }));
        const users = yield Promise.all(promises);
        return users;
    }
    catch (error) {
        console.error('Error getting all users:', error);
        throw error;
    }
});
exports.getAllParentsData = getAllParentsData;
const getAllTeachers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersCollection = Firebase_1.firestore.collection('teachers');
        const querySnapshot = yield usersCollection.get();
        const promises = querySnapshot.docs.map((doc) => __awaiter(void 0, void 0, void 0, function* () {
            const userData = doc.data(); // Cast the data to the User interface
            const userId = doc.id;
            const userWithStudentData = Object.assign(Object.assign({}, userData), { userId: userId });
            return userWithStudentData;
        }));
        const users = yield Promise.all(promises);
        return users;
    }
    catch (error) {
        console.error('Error getting all users:', error);
        throw error;
    }
});
exports.getAllTeachers = getAllTeachers;
const getAllAdmins = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersCollection = Firebase_1.firestore.collection('admin');
        const querySnapshot = yield usersCollection.get();
        const users = [];
        querySnapshot.forEach((doc) => {
            const userData = doc.data(); // Cast the data to the User interface
            const userId = doc.id;
            users.push(userData);
            // // Get the user's custom claims
            Firebase_2.auth.getUser(userId)
                .then((userRecord) => {
                const customClaims = userRecord.customClaims;
                const role = (customClaims === null || customClaims === void 0 ? void 0 : customClaims.role) || null;
                console.log(role);
                // Add the role to the userData object
                //userData.role = role;
                // Push the modified userData to the users array
                users.push(userData);
            })
                .catch((error) => {
                console.error('Error getting user record:', error);
                throw error;
            });
        });
        return users;
    }
    catch (error) {
        console.error('Error getting all users:', error);
        throw error;
    }
});
exports.getAllAdmins = getAllAdmins;
const addAdmin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (data.a_Name === "")
            throw new Error_1.UserRegisterError("Name is required.");
        if (data.email === "")
            throw new Error_1.UserRegisterError("Eamil is required.");
        if (data.password === "")
            throw new Error_1.UserRegisterError("Password is required.");
        let Role = "Admin";
        // Create user
        const userRecord = yield Firebase_2.auth.createUser({
            email: data.email,
            password: data.password,
        });
        // Reference to the collection where the documents are stored
        const adminCollectionRef = Firebase_1.firestore.collection('admin');
        const userCollectionRef = Firebase_1.firestore.collection('users');
        // Get all documents in the collection
        const adminQuerySnapshot = yield adminCollectionRef.get();
        //const userQuerySnapshot = await userCollectionRef.get();
        // Calculate the next ID based on the number of documents
        const currentAdminCount = adminQuerySnapshot.size + 1;
        const nextId = `admin${currentAdminCount}`;
        // Make a document, documentID = uid
        const AdminDoc = adminCollectionRef.doc(userRecord.uid);
        const userDoc = userCollectionRef.doc(userRecord.uid);
        yield userDoc.set({
            email: data.email,
            role: Role,
            active: true,
        });
        yield AdminDoc.set({
            a_Id: nextId,
            a_Name: data.a_Name,
        });
        Firebase_2.auth.setCustomUserClaims(userRecord.uid, { role: "admin" })
            .then(() => {
            // Custom claim set successfully
            return { success: true, message: "Set Admin Successful" };
        })
            .catch((error) => {
            // Error setting custom claim
            return { success: false, message: `${error.name}: ${error.message}` };
        });
        return { success: true, message: "Admin User created" };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.addAdmin = addAdmin;
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
const addParent = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (data.s_EngName === "")
            throw new Error_1.UserRegisterError("English Name is required.");
        if (data.s_ChiName === "")
            throw new Error_1.UserRegisterError("Chinese Name is required.");
        if (data.s_Gender === "")
            throw new Error_1.UserRegisterError("Gender is required.");
        if (data.s_Age === "")
            throw new Error_1.UserRegisterError("Age is required.");
        if (data.s_Born === "")
            throw new Error_1.UserRegisterError("Born Region is required.");
        if (data.s_idcardNumber === "")
            throw new Error_1.UserRegisterError("Id Card Number is required.");
        if (data.parent_Name === "")
            throw new Error_1.UserRegisterError("Parent Name is required.");
        if (data.parent_PhoneNumber === "")
            throw new Error_1.UserRegisterError("Parent Phone Number is required.");
        if (data.home_Address === "")
            throw new Error_1.UserRegisterError("Home Address is required.");
        if (data.email === "")
            throw new Error_1.UserRegisterError("Eamil is required.");
        if (data.password === "")
            throw new Error_1.UserRegisterError("Password is required.");
        let Role = "Parent";
        // Create user
        const userRecord = yield Firebase_2.auth.createUser({
            email: data.email,
            password: data.password,
        });
        // Reference to the collection where the documents are stored
        const studentCollectionRef = Firebase_1.firestore.collection('students');
        const userCollectionRef = Firebase_1.firestore.collection('users');
        // Get all documents in the collection
        const studentQuerySnapshot = yield studentCollectionRef.get();
        //const userQuerySnapshot = await userCollectionRef.get();
        // Calculate the next ID based on the number of documents
        const currentStudentCount = studentQuerySnapshot.size + 1;
        const nextStudentId = `student${currentStudentCount}`;
        // const currentUserCount = userQuerySnapshot.size + 1;
        // const nextUserId = `user${currentUserCount}`;
        // Make a document, documentID = uid
        const studentDoc = studentCollectionRef.doc(userRecord.uid);
        const userDoc = userCollectionRef.doc(userRecord.uid);
        // Set the document details
        yield studentDoc.set({
            s_Id: nextStudentId,
            s_EngName: data.s_EngName,
            s_ChiName: data.s_ChiName,
            s_Gender: data.s_Gender,
            s_Age: data.s_Age,
            s_Born: data.s_Born,
            s_IdNumber: data.s_idcardNumber,
            parent_Name: data.parent_Name,
            parent_PhoneNumber: data.parent_PhoneNumber,
            home_Address: data.home_Address,
            graduate: false,
        });
        yield userDoc.set({
            email: data.email,
            role: Role,
            active: true,
        });
        yield Firebase_2.auth.setCustomUserClaims(userRecord.uid, { role: "Parent" });
        // Return register successfully
        return { success: true, message: "Parent User created", uid: userRecord.uid };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.addParent = addParent;
const getTeacherSize = () => __awaiter(void 0, void 0, void 0, function* () {
    const teacherCollectionRef = Firebase_1.firestore.collection('teachers');
    const teacherQuerySnapshot = yield teacherCollectionRef.get();
    const currentTeacherCount = teacherQuerySnapshot.size;
    return currentTeacherCount;
});
exports.getTeacherSize = getTeacherSize;
const addTeacher = (data, sizeNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (data.t_ChiName === "")
            throw new Error_1.UserRegisterError("Chinese Name is required.");
        if (data.t_EngName === "")
            throw new Error_1.UserRegisterError("Engish Name is required.");
        if (data.t_Gender === "")
            throw new Error_1.UserRegisterError("Gender is required.");
        if (data.t_phoneNumber === "")
            throw new Error_1.UserRegisterError("phoneNumber is required.");
        if (data.home_Address === "")
            throw new Error_1.UserRegisterError("Gender is required.");
        if (data.email === "")
            throw new Error_1.UserRegisterError("Eamil is required.");
        if (data.password === "")
            throw new Error_1.UserRegisterError("Password is required.");
        let Role = "Teacher";
        // Create user
        const userRecord = yield Firebase_2.auth.createUser({
            email: data.email,
            password: data.password,
        });
        // Reference to the collection where the documents are stored
        const teacherCollectionRef = Firebase_1.firestore.collection('teachers');
        const userCollectionRef = Firebase_1.firestore.collection('users');
        // Get all documents in the collection
        const teacherQuerySnapshot = yield teacherCollectionRef.get();
        //const userQuerySnapshot = await userCollectionRef.get();
        // Calculate the next ID based on the number of documents
        const currentTeacherCount = teacherQuerySnapshot.size + 1;
        const nextId = `teachers${sizeNumber}`;
        // Make a document, documentID = uid
        const teacherDoc = teacherCollectionRef.doc(userRecord.uid);
        const userDoc = userCollectionRef.doc(userRecord.uid);
        // Set the document details
        yield teacherDoc.set({
            t_Id: nextId,
            t_ChiName: data.t_ChiName,
            t_EngName: data.t_EngName,
            t_gender: data.t_Gender,
            t_phoneNumber: data.t_phoneNumber,
            home_Address: data.home_Address,
            leave: false,
            //email: data.email,
            //role: Role,
        });
        yield userDoc.set({
            email: data.email,
            role: Role,
            active: true,
        });
        // Return register successfully
        yield Firebase_2.auth.setCustomUserClaims(userRecord.uid, { role: "Teacher" });
        return { success: true, message: "Teacher User created", uid: userRecord.uid };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.addTeacher = addTeacher;
const updateUser = (uid, phoneNumberValue, ParentChineseNameValue, homeAddressValue) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRef = Firebase_1.firestore.collection('users').doc(uid);
        const studentRef = Firebase_1.firestore.collection('students').doc(uid);
        const [userDoc, studentDoc] = yield Promise.all([
            userRef.get(),
            studentRef.get()
        ]);
        const userFieldsToUpdate = {};
        const studentFieldsToUpdate = {};
        // Check if there are changes in the user information
        if (userDoc.exists) {
            const userData = userDoc.data();
        }
        // Check if there are changes in the student information
        if (studentDoc.exists) {
            const studentData = studentDoc.data();
            if (studentData.parent_PhoneNumber !== phoneNumberValue) {
                studentFieldsToUpdate.parent_PhoneNumber = phoneNumberValue;
                // Update the email if the phone number has changed
                const email = phoneNumberValue + '@cityprimary.com';
                userFieldsToUpdate.email = email;
                // Update the authentication email
                const user = yield Firebase_2.auth.getUser(uid);
                yield Firebase_2.auth.updateUser(uid, { email });
            }
            if (studentData.parent_Name !== ParentChineseNameValue) {
                studentFieldsToUpdate.parent_Name = ParentChineseNameValue;
            }
            if (studentData.home_Address !== homeAddressValue) {
                studentFieldsToUpdate.home_Address = homeAddressValue;
            }
        }
        // Perform the batch update only if there are changes
        if (Object.keys(userFieldsToUpdate).length > 0 || Object.keys(studentFieldsToUpdate).length > 0) {
            const batch = Firebase_1.firestore.batch();
            if (Object.keys(userFieldsToUpdate).length > 0) {
                batch.update(userRef, userFieldsToUpdate);
            }
            if (Object.keys(studentFieldsToUpdate).length > 0) {
                batch.update(studentRef, studentFieldsToUpdate);
            }
            yield batch.commit();
        }
        return { success: true, message: "User information successfully updated" };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.updateUser = updateUser;
const updateUserStatus = (status, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRef = Firebase_1.firestore.collection('users');
        const query = userRef.where('email', '==', email);
        const querySnapshot = yield query.get();
        if (querySnapshot.empty) {
            return { success: false, message: "User not found" };
        }
        let tempStatus;
        if (status === 'false') {
            tempStatus = false;
        }
        else {
            tempStatus = true;
        }
        const userDoc = querySnapshot.docs[0];
        const userId = userDoc.id;
        yield userDoc.ref.update({ active: tempStatus });
        return { success: true, message: "User status successfully updated", uid: userId };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.updateUserStatus = updateUserStatus;
const updateTeacherStatus = (status, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRef = Firebase_1.firestore.collection('teachers');
        const query = userRef.where('t_Id', '==', id);
        const querySnapshot = yield query.get();
        if (querySnapshot.empty) {
            return { success: false, message: "Teacher not found" };
        }
        let tempStatus;
        if (status === 'false') {
            tempStatus = false;
        }
        else {
            tempStatus = true;
        }
        const userDoc = querySnapshot.docs[0];
        const userId = userDoc.id;
        yield userDoc.ref.update({ leave: tempStatus });
        return { success: true, message: "Teacher status successfully updated", uid: userId };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.updateTeacherStatus = updateTeacherStatus;
const updateTeacher = (uid, phoneNumberValue, TeacherChineseNameValue, TeacherEnglishNameValue, homeAddressValue) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRef = Firebase_1.firestore.collection('users').doc(uid);
        const teacherRef = Firebase_1.firestore.collection('teachers').doc(uid);
        const [userDoc, teachersDoc] = yield Promise.all([
            userRef.get(),
            teacherRef.get()
        ]);
        const userFieldsToUpdate = {};
        const teacherFieldsToUpdate = {};
        // Check if there are changes in the user information
        if (userDoc.exists) {
            const userData = userDoc.data();
        }
        // Check if there are changes in the student information
        if (teachersDoc.exists) {
            const teacherData = teachersDoc.data();
            if (teacherData.t_phoneNumber !== phoneNumberValue) {
                teacherFieldsToUpdate.t_phoneNumber = phoneNumberValue;
                // Update the email if the phone number has changed
                const email = phoneNumberValue + '@cityprimary.com';
                userFieldsToUpdate.email = email;
                // Update the authentication email
                const user = yield Firebase_2.auth.getUser(uid);
                yield Firebase_2.auth.updateUser(uid, { email });
            }
            if (teacherData.t_ChiName !== TeacherChineseNameValue) {
                teacherFieldsToUpdate.t_ChiName = TeacherChineseNameValue;
            }
            if (teacherData.t_EngName !== TeacherEnglishNameValue) {
                teacherFieldsToUpdate.t_EngName = TeacherEnglishNameValue;
            }
            if (teacherData.home_Address !== homeAddressValue) {
                teacherFieldsToUpdate.home_Address = homeAddressValue;
            }
        }
        // Perform the batch update only if there are changes
        if (Object.keys(userFieldsToUpdate).length > 0 || Object.keys(teacherFieldsToUpdate).length > 0) {
            const batch = Firebase_1.firestore.batch();
            if (Object.keys(userFieldsToUpdate).length > 0) {
                batch.update(userRef, userFieldsToUpdate);
            }
            if (Object.keys(teacherFieldsToUpdate).length > 0) {
                batch.update(teacherRef, teacherFieldsToUpdate);
            }
            yield batch.commit();
        }
        return { success: true, message: "Teacher information successfully updated" };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.updateTeacher = updateTeacher;
const getStudentsDataByUID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentDoc = yield Firebase_1.firestore.collection('students').doc(id).get();
        const studentData = studentDoc.data();
        const sId = studentData.s_Id;
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const classCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class`);
        const querySnapshot = yield classCollection.get();
        let classId = null;
        for (const doc of querySnapshot.docs) {
            const classmateCollection = classCollection.doc(doc.id).collection("classmate");
            const classmateDoc = yield classmateCollection.where('studentId', '==', sId).get();
            if (!classmateDoc.empty) {
                classId = doc.id;
                break;
            }
        }
        if (classId) {
            studentData.s_CurrentClass = classId;
        }
        return { success: true, studentData: studentData };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getStudentsDataByUID = getStudentsDataByUID;
const getTeacherDataByUID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teacherDoc = yield Firebase_1.firestore.collection('teachers').doc(id).get();
        const teacherData = teacherDoc.data();
        const tId = teacherData.t_Id;
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const classCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class`);
        const querySnapshot = yield classCollection.where('t_Id', '==', tId).get();
        if (!querySnapshot.empty) {
            teacherData.s_CurrentClass = querySnapshot.docs[0].id;
        }
        return { success: true, teacherData: teacherData };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getTeacherDataByUID = getTeacherDataByUID;
const editUserDataByID = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentCollection = Firebase_1.firestore.collection('students');
        const studentDoc = yield studentCollection.where('s_Id', '==', userData.s_Id).get();
        const documentRef = studentDoc.docs[0].ref;
        yield documentRef.update({
            s_ChiName: userData.s_ChiName,
            s_EngName: userData.s_EngName,
            home_Address: userData.home_Address,
            s_Age: userData.s_Age,
            parent_Name: userData.parent_Name
        });
        return { success: true, message: "User edit successful!" };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.editUserDataByID = editUserDataByID;
const getStudentFirstHalfGradeByID = (id, classId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        let data = [];
        let haveData = false;
        const classmateCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/grade/firstHalfTerm/class/${classId}/classmate`);
        const classmateDoc = yield classmateCollection.where('studentId', '==', id).get();
        if (classmateDoc.docs[0]) {
            data = {
                chi: classmateDoc.docs[0].get('chi'),
                math: classmateDoc.docs[0].get('math'),
                gs: classmateDoc.docs[0].get('gs'),
                eng: classmateDoc.docs[0].get('eng'),
                // add other fields you want here
            };
            haveData = true;
        }
        return { success: true, data: data, haveData: haveData };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getStudentFirstHalfGradeByID = getStudentFirstHalfGradeByID;
const getStudentSecondHalfGradeByID = (id, classId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        let data = [];
        let haveData = false;
        const classmateCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/grade/secondHalfTerm/class/${classId}/classmate`);
        const classmateDoc = yield classmateCollection.where('studentId', '==', id).get();
        if (classmateDoc.docs[0]) {
            data = {
                chi: classmateDoc.docs[0].get('chi'),
                math: classmateDoc.docs[0].get('math'),
                gs: classmateDoc.docs[0].get('gs'),
                eng: classmateDoc.docs[0].get('eng'),
                // add other fields you want here
            };
            haveData = true;
        }
        return { success: true, data: data, haveData: haveData };
    }
    catch (error) {
        console.error('Error edit:', error);
        throw error;
    }
});
exports.getStudentSecondHalfGradeByID = getStudentSecondHalfGradeByID;
function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}
const getStudentSecongetStudentAttendanceBySelectedMonthdHalfGradeByID = (id, classId, year, month) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const startDateRange = new Date(`${year}-${month}-01`);
        const endDateRange = new Date(`${year}-${month}-${getDaysInMonth(parseInt(year), parseInt(month))}`);
        let studentAttendanceData = [];
        let haveData = false;
        const studentAttendanceCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classId}/attendance`);
        const querystudentAttendanceSnapshot = yield studentAttendanceCollection.where('date', '>=', startDateRange).where('date', '<=', endDateRange).get();
        //console.log(`Number of documents retrieved: ${querystudentAttendanceSnapshot.size}`);
        const now = new Date();
        for (const doc of querystudentAttendanceSnapshot.docs) {
            const attendanceDate = new Date(doc.id);
            if (attendanceDate <= now) {
                const studentAttendanceListCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classId}/attendance/${doc.id}/studentAttendanceList`);
                const classmateDoc = yield studentAttendanceListCollection.where('studentNumber', '==', id).get();
                if (classmateDoc.docs[0]) {
                    const status = classmateDoc.docs[0].get('status');
                    //const status = attendanceData.status;
                    studentAttendanceData.push({ attendanceDate: doc.id, status: status });
                }
                else {
                    break;
                }
            }
            if (attendanceDate > now) {
                break;
            }
        }
        if (studentAttendanceData.length > 0) {
            haveData = true;
        }
        return { success: true, data: studentAttendanceData, haveData: haveData };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getStudentSecongetStudentAttendanceBySelectedMonthdHalfGradeByID = getStudentSecongetStudentAttendanceBySelectedMonthdHalfGradeByID;
const applyLeaveForStudent = (sId, reason, classID, date, weekday) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leaveFormCollection = Firebase_1.firestore.collection('leaveForm');
        const TodayDay = new Date();
        TodayDay.setHours(0, 0, 0, 0);
        const tomorrow = new Date(TodayDay);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const hkTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" });
        const dateApplied = new Date(hkTime);
        // Check if a document with the same studentId and dateApplied exists
        const existingDocs = yield leaveFormCollection
            .where('leaveDate', '==', date)
            .where('studentId', '==', sId)
            .get();
        if (!existingDocs.empty) {
            return { success: true, exist: true };
        }
        const newDoc = leaveFormCollection.doc();
        // Set data in the new document
        yield newDoc.set({
            ID: newDoc.id,
            studentId: sId,
            classID: classID,
            weekday: weekday,
            reason: reason,
            leaveDate: date,
            dateApplied: dateApplied,
            status: 'Pending'
        });
        return { success: true, exist: false };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.applyLeaveForStudent = applyLeaveForStudent;
const submitSystemProblem = (sId, problem, phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const problemCollection = Firebase_1.firestore.collection('systemProblemList');
        const newDoc = problemCollection.doc();
        const hkTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" });
        const dateApplied = new Date(hkTime);
        // Set data in the new document
        yield newDoc.set({
            studentId: sId,
            problem: problem,
            dateApplied: dateApplied,
            phoneNumber: phoneNumber,
        });
        return { success: true, exist: false };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.submitSystemProblem = submitSystemProblem;
const getApplyLeaveListByID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = [];
        let haveData = false;
        const leaveFormCollection = Firebase_1.firestore.collection(`leaveForm`);
        const leaveDocs = yield leaveFormCollection.where('studentId', '==', id).get();
        if (!leaveDocs.empty) {
            haveData = true;
            leaveDocs.forEach(doc => {
                let date = doc.get('dateApplied').toDate();
                let formattedDate = date.toLocaleString('en-GB', { timeZone: 'Asia/Hong_Kong', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-').replace(',', '');
                let dateParts = formattedDate.split(' ')[0].split('-');
                let timePart = formattedDate.split(' ')[1];
                let rearrangedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]} ${timePart}`;
                let docData = {
                    reason: doc.get('reason'),
                    submittedDate: rearrangedDate,
                    dateApplied: doc.get('leaveDate'),
                    weekDay: doc.get('weekday'),
                    status: doc.get('status'),
                    // add other fields you want here
                };
                data.push(docData);
            });
        }
        return { success: true, data: data, haveData: haveData };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getApplyLeaveListByID = getApplyLeaveListByID;
// export const getAllInterestClassGroup = async (studentId:string) => {
//   try {
//     const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
//     const ineterestClassCollection = db.collection(`academicYear/${yearSelector}/interestClassGroup`)     
//     const ineterestClassForStudentCollection = db.collection(`academicYear/${yearSelector}/interestClassForStudent/`)     
//     const existInterestClassId:any[] = [];
//     const ineterestClassForStudentDoc = await ineterestClassForStudentCollection.where('studentId','==',studentId).get();
//     if(!ineterestClassForStudentDoc.empty){
//       let docData = {
//         interestClass:ineterestClassForStudentDoc.docs[0].get('interestClass')
//       }
//       docData.interestClass.map((item: any) => {
//         existInterestClassId.push(item.interestClassId);
//       });
//     }
//     const interestClassDocs = await ineterestClassCollection.where('status', '==', 'A').get();
//     // let query = ineterestClassCollection.where('status', '==', 'A');
//     // for(let i = 0; i < existInterestClassId.length; i++){
//     //   query = query.where('id', '!=', existInterestClassId[i]);
//     // }
//     // const ineterestClassDocs = await query.get();
//     const data: any[] = [];
//     let haveData=false;
//     if (!interestClassDocs.empty) {
//       haveData=true;
//       interestClassDocs.forEach((doc) => {
//         let docId = doc.get('id');
//         if(!existInterestClassId.includes(docId)){
//           let docData = {
//             id:docId,
//             startDateFrom: doc.get('startDateFrom'),
//             startDateTo:doc.get('startDateTo'),
//             titleEN: doc.get('titleEN'),
//             titleTC: doc.get('titleTC'),
//             validApplyDateFrom:doc.get('validApplyDateFrom'),
//             validApplyDateTo: doc.get('validApplyDateTo'),
//             timePeriod:doc.get('startTime')+"-"+doc.get('endTime'),
//             weekDay:doc.get('weekDay'),
//           }
//           data.push(docData);
//         }
//       });
//     }
//     return { success: true, data: data,haveData:haveData };
//   } catch (error: any) {
//     console.error(`Error`, error);
//     return { success: false, message: `${error.name}: ${error.message}` };
//   }
// };
const getAllInterestClassGroup = (studentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const ineterestClassCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/interestClassGroup`);
        const ineterestClassForStudentCollection = Firebase_1.firestore.collection(`applyInterestClassList`);
        const existInterestClassId = [];
        const ineterestClassForStudentDoc = yield ineterestClassForStudentCollection.where('studentId', '==', studentId).get();
        if (!ineterestClassForStudentDoc.empty) {
            ineterestClassForStudentDoc.docs.forEach(doc => {
                let docData = {
                    interestClassId: doc.get('interestClassID')
                };
                existInterestClassId.push(docData.interestClassId);
            });
        }
        const interestClassDocs = yield ineterestClassCollection.where('status', '==', 'A').get();
        // let query = ineterestClassCollection.where('status', '==', 'A');
        // for(let i = 0; i < existInterestClassId.length; i++){
        //   query = query.where('id', '!=', existInterestClassId[i]);
        // }
        // const ineterestClassDocs = await query.get();
        const data = [];
        let haveData = false;
        if (!interestClassDocs.empty) {
            interestClassDocs.forEach((doc) => {
                let docId = doc.get('id');
                if (!existInterestClassId.includes(docId)) {
                    let docData = {
                        id: docId,
                        startDateFrom: doc.get('startDateFrom'),
                        startDateTo: doc.get('startDateTo'),
                        titleEN: doc.get('titleEN'),
                        titleTC: doc.get('titleTC'),
                        validApplyDateFrom: doc.get('validApplyDateFrom'),
                        validApplyDateTo: doc.get('validApplyDateTo'),
                        timePeriod: doc.get('startTime') + "-" + doc.get('endTime'),
                        weekDay: doc.get('weekDay'),
                    };
                    data.push(docData);
                }
            });
        }
        if (data.length > 0) {
            haveData = true;
        }
        return { success: true, data: data, haveData: haveData };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getAllInterestClassGroup = getAllInterestClassGroup;
const applyInterestClass = (sId, interestClassID, phoneNumber, classId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const problemCollection = Firebase_1.firestore.collection('applyInterestClassList');
        const newDoc = problemCollection.doc();
        const hkTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" });
        const dateApplied = new Date(hkTime);
        // Set data in the new document
        yield newDoc.set({
            status: "Pending",
            studentId: sId,
            interestClassID: interestClassID,
            dateApplied: dateApplied,
            phoneNumber: phoneNumber,
            classID: classId
        });
        return { success: true, exist: false };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.applyInterestClass = applyInterestClass;
const getAppliedInterestClassGroup = (studentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applyInterestClassListCollection = Firebase_1.firestore.collection(`applyInterestClassList`);
        const applyInterestClassForStudentDoc = yield applyInterestClassListCollection.where('studentId', '==', studentId).get();
        let data = [];
        let haveData = false;
        if (!applyInterestClassForStudentDoc.empty) {
            haveData = true;
            data = yield Promise.all(applyInterestClassForStudentDoc.docs.map((doc) => __awaiter(void 0, void 0, void 0, function* () {
                let date = doc.get('dateApplied').toDate();
                let formattedDate = date.toLocaleString('en-GB', { timeZone: 'Asia/Hong_Kong', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-').replace(',', '');
                let dateParts = formattedDate.split(' ')[0].split('-');
                let timePart = formattedDate.split(' ')[1];
                let rearrangedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]} ${timePart}`;
                const interestClassID = doc.get('interestClassID');
                const titleData = yield findInterestClassNameById(interestClassID);
                let docData = {
                    titleEN: titleData.titleEN,
                    titleTC: titleData.titleTC,
                    status: doc.get('status'),
                    submittedDate: rearrangedDate,
                    approveDate: doc.get('status') !== 'Pending' ? doc.get('approveDate') : '',
                };
                return docData;
            })));
            console.log(data);
        }
        return { success: true, data: data, haveData: haveData };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getAppliedInterestClassGroup = getAppliedInterestClassGroup;
const findInterestClassNameById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const ineterestClassCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/interestClassGroup`);
        let titleEN;
        let titleTC;
        //const existInterestClassId:any[] = [];
        const ineterestClassForStudentDoc = yield ineterestClassCollection.where('id', '==', id).get();
        if (!ineterestClassForStudentDoc.empty) {
            titleEN = ineterestClassForStudentDoc.docs[0].get('titleEN');
            titleTC = ineterestClassForStudentDoc.docs[0].get('titleTC');
        }
        return { titleEN: titleEN, titleTC: titleTC };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
const getSchoolPhotoDocDate = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const photoCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/photo`);
        let haveData = false;
        const photoDoc = yield photoCollection.get();
        let photoDocDate = [];
        photoDoc.forEach((doc) => {
            photoDocDate.push(doc.id);
        });
        haveData = photoDocDate.length > 0;
        return { success: true, data: photoDocDate, haveData: haveData };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getSchoolPhotoDocDate = getSchoolPhotoDocDate;
const getSchoolPhotoActivityDoc = (date) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const photoActivityCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/photo/${date}/activity`);
        let haveData = false;
        const photoActivityDoc = yield photoActivityCollection.get();
        let photoAcitivtyDoc = [];
        photoActivityDoc.forEach((doc) => {
            photoAcitivtyDoc.push(doc.data());
        });
        haveData = photoAcitivtyDoc.length > 0;
        return { success: true, data: photoAcitivtyDoc, haveData: haveData };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getSchoolPhotoActivityDoc = getSchoolPhotoActivityDoc;
const getSchoolPhotoDoc = (date, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const photoActivityCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/photo/${date}/activity`);
        let haveData = false;
        const photoActivityDoc = yield photoActivityCollection.where('id', '==', id).get();
        const imageCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/photo/${date}/activity/${photoActivityDoc.docs[0].id}/image`);
        const imageDoc = yield imageCollection.get();
        let imageDataDoc = [];
        imageDoc.forEach((doc) => {
            imageDataDoc.push(doc.data());
        });
        haveData = imageDataDoc.length > 0;
        return { success: true, data: imageDataDoc, haveData: haveData };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getSchoolPhotoDoc = getSchoolPhotoDoc;
const getClassHomeworkByUser = (date, classID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const homeWorkActivityCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/homework/`);
        let haveData = false;
        const homeworkActivityDoc = yield homeWorkActivityCollection.where('id', '==', date).get();
        let homeworkActivityData;
        if (!homeworkActivityDoc.empty) {
            homeworkActivityData = homeworkActivityDoc.docs[0].data();
            haveData = true;
        }
        return { success: true, data: homeworkActivityData, haveData: haveData };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getClassHomeworkByUser = getClassHomeworkByUser;
const getReplySlipByUser = (classID, studentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        let replySlipData = [];
        let haveData = false;
        const classmateCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/classmate/`);
        const getStudentDoc = yield classmateCollection.where('studentId', '==', studentId).get();
        const docId = getStudentDoc.docs[0].id;
        const replySlipCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/classmate/${docId}/replySlipGot/`);
        const replySlipDoc = yield replySlipCollection.get();
        yield Promise.all(replySlipDoc.docs.map((doc) => __awaiter(void 0, void 0, void 0, function* () {
            const replySlipDetail = yield searchReplySlipInformation(doc.get('replySlipID').toString());
            replySlipData.push(Object.assign(Object.assign({}, doc.data()), { replySlipDetail }));
        })));
        haveData = replySlipData.length > 0;
        return { success: true, data: replySlipData, haveData: haveData };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getReplySlipByUser = getReplySlipByUser;
const searchReplySlipInformation = (replySlipID) => __awaiter(void 0, void 0, void 0, function* () {
    const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
    const replySlipCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/replySlip/`);
    const replySlipDoc = yield replySlipCollection.where('id', '==', replySlipID).get();
    let replySlipDataOut;
    if (!replySlipDoc.empty) {
        const replySlipData = replySlipDoc.docs[0].data();
        replySlipDataOut = {
            mainContentEN: replySlipData.mainContentEN,
            mainContentTC: replySlipData.mainContentTC,
            recipientContentEN: replySlipData.recipientContentEN,
            recipientContentTC: replySlipData.recipientContentTC,
            titleEN: replySlipData.titleEN,
            titleTC: replySlipData.titleTC,
            payment: replySlipData.payment,
        };
        if (replySlipData.payment === true) {
            replySlipDataOut.paymentAmount = replySlipData.paymentAmount;
        }
    }
    return replySlipDataOut;
});
const submitReplySlip = (studentID, replySlipID, classID, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const classmateCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/classmate/`);
        const getStudentDoc = yield classmateCollection.where('studentId', '==', studentID).get();
        const docId = getStudentDoc.docs[0].id;
        const replySlipCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/classmate/${docId}/replySlipGot/`);
        const replySlipDoc = yield replySlipCollection.where('replySlipID', '==', replySlipID.toString()).get();
        let valueTC = '';
        let valueEN = '';
        let titleTC = '通告' + replySlipID.toString() + "已提交";
        let titleEN = 'reply Slip' + replySlipID.toString() + "already submitted";
        if (options === '參加') {
            options = 'Join';
            valueTC = '你選擇了參加';
            valueEN = 'You choose join';
        }
        else if (options === '不參加') {
            options = 'Not Join';
            valueTC = '你選擇了不參加';
            valueEN = 'You choose not join';
        }
        if (!replySlipDoc.empty) {
            const docToUpdate = replySlipDoc.docs[0];
            yield docToUpdate.ref.update({
                submit: "S",
                submitdate: new Date().toISOString().split('T')[0],
                options: options
            });
        }
        yield (0, notification_1.createDocumentInCollection)(titleTC, valueTC, titleEN, valueEN, studentID);
        return { success: true };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.submitReplySlip = submitReplySlip;
const changeReplySlipStatus = (studentID, replySlipID, classID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const classmateCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/classmate/`);
        const getStudentDoc = yield classmateCollection.where('studentId', '==', studentID).get();
        const docId = getStudentDoc.docs[0].id;
        const replySlipCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/classmate/${docId}/replySlipGot/`);
        const replySlipDoc = yield replySlipCollection.where('replySlipID', '==', replySlipID.toString()).get();
        if (!replySlipDoc.empty) {
            const docToUpdate = replySlipDoc.docs[0];
            yield docToUpdate.ref.update({
                read: "R",
            });
        }
        return { success: true };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.changeReplySlipStatus = changeReplySlipStatus;
const saveDeviceID = (deviceID, UID, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCollection = Firebase_1.firestore.collection('users');
        const userDoc = yield userCollection.doc(UID).get();
        let data;
        if (role === 'Parent') {
            const studentCollection = Firebase_1.firestore.collection('students');
            const studentDoc = yield studentCollection.doc(UID).get();
            if (studentDoc.exists) {
                data = {
                    uid: UID,
                    userID: studentDoc.get('s_Id'),
                    deviceID: deviceID,
                    languageCode: "zh",
                };
            }
        }
        else {
            const teacherCollection = Firebase_1.firestore.collection('teachers');
            const teacherDoc = yield teacherCollection.doc(UID).get();
            if (teacherDoc.exists) {
                data = {
                    uid: UID,
                    userID: teacherDoc.get('t_Id'),
                    deviceID: deviceID,
                    languageCode: "zh",
                };
            }
        }
        if (userDoc.exists) {
            yield userDoc.ref.update({
                deviceID: deviceID
            });
        }
        const deviceCollection = Firebase_1.firestore.collection('devices');
        const deviceDoc = yield deviceCollection.doc(UID).get();
        if (!deviceDoc.exists) {
            yield deviceCollection.doc(UID).set(data);
        }
        if (deviceDoc.exists) {
            yield deviceCollection.doc(UID).update({ deviceID: data.deviceID });
        }
        return { success: true };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.saveDeviceID = saveDeviceID;
const saveLanguageCode = (languageCode, userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deviceCollection = Firebase_1.firestore.collection('devices');
        const deviceDoc = yield deviceCollection.where('userID', '==', userID).get();
        if (!deviceDoc.empty) {
            const docToUpdate = deviceDoc.docs[0];
            yield docToUpdate.ref.update({
                languageCode: languageCode
            });
        }
        return { success: true };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.saveLanguageCode = saveLanguageCode;
const getNotificationMessage = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userNotificationCollection = Firebase_1.firestore.collection('userNotification');
        const userNotificationDocs = yield userNotificationCollection.where('userID', '==', userID).get();
        let haveData = false;
        let data = [];
        if (!userNotificationDocs.empty) {
            for (const doc of userNotificationDocs.docs) {
                let dataItem = {
                    id: doc.id,
                    contentEN: doc.get("contentEN"),
                    contentTC: doc.get("contentTC"),
                    titleEN: doc.get("titleEN"),
                    titleTC: doc.get("titleTC"),
                };
                data.push(dataItem);
                // Use deviceData here
            }
            haveData = true;
        }
        return { success: true, data: data, haveData: haveData };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getNotificationMessage = getNotificationMessage;
const deleteAllNotificationByUserID = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userNotificationCollection = Firebase_1.firestore.collection('userNotification');
        const userNotificationDocs = yield userNotificationCollection.where('userID', '==', userID).get();
        if (!userNotificationDocs.empty) {
            for (const doc of userNotificationDocs.docs) {
                yield doc.ref.delete();
            }
        }
        return { success: true, message: "Notifications deleted successfully" };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.deleteAllNotificationByUserID = deleteAllNotificationByUserID;
const deleteOneNotificationByUserID = (notificationID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userNotificationCollection = Firebase_1.firestore.collection('userNotification');
        const userNotificationDoc = yield userNotificationCollection.doc(notificationID);
        yield userNotificationDoc.delete();
        return { success: true, message: "Notifications deleted successfully" };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.deleteOneNotificationByUserID = deleteOneNotificationByUserID;
const getStudentReward = (studentID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const rewardCollection = Firebase_1.firestore.collection("academicYear").doc(yearSelector).collection("reward");
        const getStudentRewardDoc = yield rewardCollection.where('studentId', '==', studentID).get();
        let studentRewards = [];
        let haveData = false;
        //let data;
        if (getStudentRewardDoc.docs[0]) {
            studentRewards = getStudentRewardDoc.docs[0].get('reward');
            haveData = true;
        }
        console.log(getStudentRewardDoc.docs[0].get('reward'));
        return { success: true, data: studentRewards, haveData: haveData };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getStudentReward = getStudentReward;
const getTodayAttendance = (studentID, classID, date) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const studentAttendanceCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/attendance/${date}/studentAttendanceList`);
        const getStudentAttendanceDoc = yield studentAttendanceCollection.where('studentNumber', '==', studentID).get();
        let haveData = false;
        let data = [];
        if (getStudentAttendanceDoc.docs[0]) {
            haveData = true;
            data = {
                //status: getStudentAttendanceDoc.docs[0].get('status'),
                takeAttendanceTime: getStudentAttendanceDoc.docs[0].get('takeAttendanceTime'),
            };
        }
        return { success: true, data: data, haveData: haveData };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getTodayAttendance = getTodayAttendance;
const getTheCanlendar = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = path_1.default.join(__dirname, '../../', 'assets', "school_canlendar.png");
        const fileContents = fs_1.default.readFileSync(filePath);
        return { success: true, exist: true, fileContents: fileContents, message: `Get canlendar` };
        //return { success:true, exist: true, fileContents: fileContents, message: `Get homework data successfully`};
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getTheCanlendar = getTheCanlendar;
const getStudentClassID = (studentId, classID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const classmateCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/classmate/`);
        const classmateDoc = yield classmateCollection.where('studentId', '==', studentId).get();
        if (classmateDoc.docs[0]) {
            let classNumber = classmateDoc.docs[0].get('classNumber');
            return { success: true, classNumber: classNumber, message: `get number successfully` };
        }
        return { success: false, message: `get number failed` };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getStudentClassID = getStudentClassID;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvdXNlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQXVEO0FBQ3ZELG9EQUE2QztBQUM3QywyQ0FBb0Q7QUFPcEQsaURBQWtEO0FBRWxELDRDQUFvQjtBQUdwQixnREFBd0I7QUFDeEIsMkRBRWtDO0FBRWxDLE1BQU0sc0JBQXNCLEdBQUcsQ0FBTyxHQUFXLEVBQUUsRUFBRTs7SUFDakQsSUFBSTtRQUNGLDBCQUEwQjtRQUMxQixNQUFNLGVBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNyRCw4Q0FBOEM7UUFDOUMsTUFBTSxrQkFBa0IsR0FBRyxvQkFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNyRCxNQUFNLG9CQUFvQixHQUFHLE1BQU0sa0JBQWtCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRXJFLElBQUksb0JBQW9CLENBQUMsTUFBTSxFQUFFO1lBQy9CLE1BQU0sb0JBQW9CLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDbkQ7UUFFRCxNQUFNLGVBQWUsR0FBRyxvQkFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQyxNQUFNLGlCQUFpQixHQUFHLE1BQU0sZUFBZSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUUvRCxJQUFJLFNBQVMsQ0FBQztRQUNkLElBQUksaUJBQWlCLENBQUMsTUFBTSxFQUFFO1lBQzVCLFNBQVMsR0FBRyxNQUFBLGlCQUFpQixDQUFDLElBQUks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