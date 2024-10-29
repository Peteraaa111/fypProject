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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVideoFileInChatRoom = exports.sendAudioFileInChatRoom = exports.sendFileInChatRoom = exports.sendMessageInChatRoom = exports.getAllMessageInChatRoom = exports.findSenderName = exports.getGroupChatList = exports.getTeacherChatListByID = exports.getChatListByID = void 0;
const Constant_1 = require("../models/Constant");
const Firebase_1 = require("../utilities/Firebase");
const uuid_1 = require("uuid");
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const file_type_1 = __importDefault(require("file-type"));
const sharp_1 = __importDefault(require("sharp"));
const notification_1 = require("./notification");
const getChatListByID = (studentID, classID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const chatCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/chat/`);
        const teacherCollection = Firebase_1.firestore.collection(`teachers`);
        const studentCollection = Firebase_1.firestore.collection(`students`);
        const getChatRoomDoc = yield chatCollection.where('s_Id', '==', studentID).where('RoomFormat', '==', "single").get();
        let chatRoomList = [];
        if (!getChatRoomDoc.empty) {
            let data;
            data = {
                chatRoomID: getChatRoomDoc.docs[0].get('chatRoomID'),
                s_Id: getChatRoomDoc.docs[0].get('s_Id'),
                t_Id: getChatRoomDoc.docs[0].get('t_Id'),
            };
            const getStudentDoc = yield studentCollection.where('s_Id', '==', data.s_Id).get();
            const getTeacherDoc = yield teacherCollection.where('t_Id', '==', data.t_Id).get();
            data = Object.assign(Object.assign({}, data), { parent_Name: getStudentDoc.docs[0].get('parent_Name'), t_ChiName: getTeacherDoc.docs[0].get('t_ChiName'), t_EngName: getTeacherDoc.docs[0].get('t_EngName') });
            chatRoomList.push(data);
        }
        return { success: true, data: chatRoomList };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getChatListByID = getChatListByID;
const getTeacherChatListByID = (teacherID, classID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const chatCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/chat/`);
        const teacherCollection = Firebase_1.firestore.collection(`teachers`);
        const studentCollection = Firebase_1.firestore.collection(`students`);
        const getChatRoomDoc = yield chatCollection.where('t_Id', '==', teacherID).where('RoomFormat', '==', "single").get();
        let chatRoomList = [];
        if (!getChatRoomDoc.empty) {
            let data;
            data = {
                chatRoomID: getChatRoomDoc.docs[0].get('chatRoomID'),
                s_Id: getChatRoomDoc.docs[0].get('s_Id'),
                t_Id: getChatRoomDoc.docs[0].get('t_Id'),
            };
            const getStudentDoc = yield studentCollection.where('s_Id', '==', data.s_Id).get();
            const getTeacherDoc = yield teacherCollection.where('t_Id', '==', data.t_Id).get();
            data = Object.assign(Object.assign({}, data), { parent_Name: getStudentDoc.docs[0].get('parent_Name'), t_ChiName: getTeacherDoc.docs[0].get('t_ChiName'), t_EngName: getTeacherDoc.docs[0].get('t_EngName') });
            chatRoomList.push(data);
        }
        return { success: true, data: chatRoomList };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getTeacherChatListByID = getTeacherChatListByID;
const getGroupChatList = (classID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const chatCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/chat/`);
        const getChatRoomDoc = yield chatCollection.where('RoomFormat', '==', "group").get();
        let chatRoomList = [];
        if (!getChatRoomDoc.empty) {
            let data;
            data = {
                chatRoomID: getChatRoomDoc.docs[0].get('chatRoomID'),
                groupName: getChatRoomDoc.docs[0].get('groupName'),
            };
            chatRoomList.push(data);
        }
        return { success: true, data: chatRoomList };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getGroupChatList = getGroupChatList;
const findSenderName = (senderID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentCollection = Firebase_1.firestore.collection('students');
        const teacherCollection = Firebase_1.firestore.collection(`teachers`);
        const getStudentDoc = yield studentCollection.where('s_Id', '==', senderID).get();
        const getTeacherDoc = yield teacherCollection.where('t_Id', '==', senderID).get();
        if (!getStudentDoc.empty) {
            let data;
            data = {
                lastMessageSenderEngName: getStudentDoc.docs[0].data().parent_Name,
                lastMessageSenderChiName: getStudentDoc.docs[0].data().parent_Name,
            };
            return { success: true, data: data };
        }
        if (!getTeacherDoc.empty) {
            let data;
            data = {
                lastMessageSenderEngName: getTeacherDoc.docs[0].data().t_EngName,
                lastMessageSenderChiName: getTeacherDoc.docs[0].data().t_ChiName,
            };
            return { success: true, data: data };
        }
        return { success: true };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.findSenderName = findSenderName;
const getAllMessageInChatRoom = (classID, chatRoomID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const chatCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/chat/`);
        const getChatRoomDoc = yield chatCollection.where('chatRoomID', '==', chatRoomID.toString()).get();
        const getChatRoomDocId = getChatRoomDoc.docs[0].id;
        const chatRoomMessageCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/chat/${getChatRoomDocId}/message`);
        const chatRoomMessageGet = yield chatRoomMessageCollection.orderBy('id', 'desc').get();
        let chatRoomMessageList = [];
        let haveData = false;
        chatRoomMessageGet.forEach((doc) => {
            chatRoomMessageList.push(doc.data());
        });
        if (chatRoomMessageList.length > 0) {
            haveData = true;
        }
        return { success: true, data: chatRoomMessageList, haveData: haveData };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getAllMessageInChatRoom = getAllMessageInChatRoom;
const sendMessageInChatRoom = (senderID, classID, chatRoomID, message, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const chatCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/chat/`);
        const getChatRoomDoc = yield chatCollection.where('chatRoomID', '==', chatRoomID).get();
        const getChatRoomDocId = getChatRoomDoc.docs[0].id;
        const chatRoomFormat = getChatRoomDoc.docs[0].data().RoomFormat;
        const chatRoomMessageCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/chat/${getChatRoomDocId}/message`);
        let now = new Date();
        let date = now.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        let time = now.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
        let formattedDateTime = `${date}-${time}`;
        let newMessage;
        if (type === 'text') {
            newMessage = {
                id: 1,
                message: message,
                senderID: senderID,
                type: type,
                time: formattedDateTime,
                read: false
            };
            if (chatRoomFormat === 'group') {
                const response = yield (0, exports.findSenderName)(senderID);
                if (response.success && response.data) {
                    newMessage.SenderEngName = response.data.lastMessageSenderEngName;
                    newMessage.SenderChiName = response.data.lastMessageSenderChiName;
                }
            }
            else {
                if (senderID == getChatRoomDoc.docs[0].data().s_Id) {
                    let deviceData;
                    let title, content;
                    deviceData = yield (0, notification_1.getDeviceByUserID)(getChatRoomDoc.docs[0].data().t_Id);
                    let senderName = yield (0, exports.findSenderName)(senderID);
                    let receiverName = yield (0, exports.findSenderName)(getChatRoomDoc.docs[0].data().t_Id);
                    let chatData = {
                        chatRoomID: chatRoomID,
                        s_Id: getChatRoomDoc.docs[0].data().s_Id,
                        t_Id: getChatRoomDoc.docs[0].data().t_Id,
                        parent_Name: senderName.data.lastMessageSenderChiName,
                        t_ChiName: receiverName.data.lastMessageSenderChiName,
                        t_EngName: receiverName.data.lastMessageSenderEngName,
                    };
                    console.log(deviceData);
                    if (deviceData.data) {
                        if (deviceData.data.languageCode === 'zh') {
                            title = senderName.data.lastMessageSenderChiName + " 發送了新訊息";
                            content = message;
                        }
                        else {
                            title = senderName.data.lastMessageSenderEngName + " Send a message";
                            content = message;
                        }
                        yield (0, notification_1.sendNotificationWithAttributeInChat)(title, content, deviceData.data.deviceID, "Chat", chatRoomID, getChatRoomDoc.docs[0].data().s_Id, getChatRoomDoc.docs[0].data().t_Id, senderName.data.lastMessageSenderChiName, receiverName.data.lastMessageSenderChiName, receiverName.data.lastMessageSenderEngName);
                    }
                }
                else {
                    let deviceData;
                    let title, content;
                    deviceData = yield (0, notification_1.getDeviceByUserID)(getChatRoomDoc.docs[0].data().s_Id);
                    let senderName = yield (0, exports.findSenderName)(senderID);
                    let receiverName = yield (0, exports.findSenderName)(getChatRoomDoc.docs[0].data().s_Id);
                    let chatData = {
                        chatRoomID: chatRoomID,
                        s_Id: getChatRoomDoc.docs[0].data().s_Id,
                        t_Id: getChatRoomDoc.docs[0].data().t_Id,
                        parent_Name: senderName.data.lastMessageSenderChiName,
                        t_ChiName: receiverName.data.lastMessageSenderChiName,
                        t_EngName: receiverName.data.lastMessageSenderEngName,
                    };
                    console.log(deviceData);
                    if (deviceData.data) {
                        if (deviceData.data.languageCode === 'zh') {
                            title = senderName.data.lastMessageSenderChiName + " 發送了新訊息";
                            content = message;
                        }
                        else {
                            title = senderName.data.lastMessageSenderEngName + " Send a message";
                            content = message;
                        }
                        yield (0, notification_1.sendNotificationWithAttributeInChat)(title, content, deviceData.data.deviceID, "Chat", chatRoomID, getChatRoomDoc.docs[0].data().s_Id, getChatRoomDoc.docs[0].data().t_Id, senderName.data.lastMessageSenderChiName, receiverName.data.lastMessageSenderChiName, receiverName.data.lastMessageSenderEngName);
                    }
                }
            }
        }
        chatRoomMessageCollection.get().then((snapshot) => {
            newMessage.id = snapshot.size + 1;
            chatRoomMessageCollection.add(newMessage);
        });
        return { success: true };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.sendMessageInChatRoom = sendMessageInChatRoom;
const sendFileInChatRoom = (senderID, classID, chatRoomID, files, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const chatCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/chat/`);
        const getChatRoomDoc = yield chatCollection.where('chatRoomID', '==', chatRoomID).get();
        const getChatRoomDocId = getChatRoomDoc.docs[0].id;
        const chatRoomFormat = getChatRoomDoc.docs[0].data().RoomFormat;
        const chatRoomMessageCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/chat/${getChatRoomDocId}/message`);
        let now = new Date();
        let date = now.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        let time = now.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
        let formattedDateTime = `${date}-${time}`;
        let filePath = 'chat/' + classID + "-" + chatRoomID;
        const storageUrl = "https://firebasestorage.googleapis.com/v0/b/ufyp-a18cf.appspot.com/o";
        const token = (0, uuid_1.v4)();
        var [filesInBucket] = yield Firebase_1.bucket.getFiles({ prefix: filePath });
        var numFiles = filesInBucket.length;
        var numberCount = numFiles;
        for (const file of files) {
            let newMessage;
            let buffer = fs.readFileSync(file.path);
            const FileType = yield file_type_1.default.fromBuffer(buffer);
            if ((FileType === null || FileType === void 0 ? void 0 : FileType.mime) === 'image/png') {
                buffer = yield (0, sharp_1.default)(buffer).jpeg().toBuffer();
            }
            const extension = path_1.default.extname(file.originalname).toLowerCase();
            let fileName = `${filePath}/${numberCount}${extension}`;
            let fileRef = Firebase_1.bucket.file(`${fileName}`);
            let [exists] = yield fileRef.exists();
            while (exists) {
                numberCount++;
                fileName = `${filePath}/${numberCount}${extension}`;
                fileRef = Firebase_1.bucket.file(fileName);
                [exists] = yield fileRef.exists();
            }
            yield fileRef.save(buffer, { metadata: { contentType: FileType === null || FileType === void 0 ? void 0 : FileType.mime, metadata: { firebaseStorageDownloadTokens: token } } });
            const url = `${storageUrl}/${encodeURIComponent(fileName)}?alt=media&token=${token}`;
            newMessage = {
                id: 1,
                message: url,
                senderID: senderID,
                type: type,
                time: formattedDateTime,
                read: false
            };
            if (chatRoomFormat === 'group') {
                const response = yield (0, exports.findSenderName)(senderID);
                if (response.success && response.data) {
                    newMessage.SenderEngName = response.data.lastMessageSenderEngName;
                    newMessage.SenderChiName = response.data.lastMessageSenderChiName;
                }
            }
            chatRoomMessageCollection.get().then((snapshot) => {
                newMessage.id = snapshot.size + 1;
                chatRoomMessageCollection.add(newMessage);
            });
        }
        return { success: true };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.sendFileInChatRoom = sendFileInChatRoom;
const sendAudioFileInChatRoom = (senderID, classID, chatRoomID, files, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const chatCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/chat/`);
        const getChatRoomDoc = yield chatCollection.where('chatRoomID', '==', chatRoomID).get();
        const getChatRoomDocId = getChatRoomDoc.docs[0].id;
        const chatRoomFormat = getChatRoomDoc.docs[0].data().RoomFormat;
        const chatRoomMessageCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/chat/${getChatRoomDocId}/message`);
        let now = new Date();
        let date = now.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        let time = now.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
        let formattedDateTime = `${date}-${time}`;
        let filePath = 'chat/' + classID + "-" + chatRoomID;
        const storageUrl = "https://firebasestorage.googleapis.com/v0/b/ufyp-a18cf.appspot.com/o";
        const token = (0, uuid_1.v4)();
        var [filesInBucket] = yield Firebase_1.bucket.getFiles({ prefix: filePath });
        var numFiles = filesInBucket.length;
        var numberCount = numFiles;
        for (const file of files) {
            let newMessage;
            let buffer = fs.readFileSync(file.path);
            const FileType = yield file_type_1.default.fromBuffer(buffer);
            const extension = path_1.default.extname(file.originalname).toLowerCase();
            let fileName = `${filePath}/${numberCount}${extension}`;
            let fileRef = Firebase_1.bucket.file(`${fileName}`);
            let [exists] = yield fileRef.exists();
            while (exists) {
                numberCount++;
                fileName = `${filePath}/${numberCount}${extension}`;
                fileRef = Firebase_1.bucket.file(fileName);
                [exists] = yield fileRef.exists();
            }
            yield fileRef.save(buffer, { metadata: { contentType: FileType === null || FileType === void 0 ? void 0 : FileType.mime, metadata: { firebaseStorageDownloadTokens: token } } });
            const url = `${storageUrl}/${encodeURIComponent(fileName)}?alt=media&token=${token}`;
            newMessage = {
                id: 1,
                message: url,
                senderID: senderID,
                type: type,
                time: formattedDateTime,
                read: false
            };
            if (chatRoomFormat === 'group') {
                const response = yield (0, exports.findSenderName)(senderID);
                if (response.success && response.data) {
                    newMessage.SenderEngName = response.data.lastMessageSenderEngName;
                    newMessage.SenderChiName = response.data.lastMessageSenderChiName;
                }
            }
            chatRoomMessageCollection.get().then((snapshot) => {
                newMessage.id = snapshot.size + 1;
                chatRoomMessageCollection.add(newMessage);
            });
        }
        return { success: true };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.sendAudioFileInChatRoom = sendAudioFileInChatRoom;
const sendVideoFileInChatRoom = (senderID, classID, chatRoomID, files, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearSelector = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const chatCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/chat/`);
        const getChatRoomDoc = yield chatCollection.where('chatRoomID', '==', chatRoomID).get();
        const getChatRoomDocId = getChatRoomDoc.docs[0].id;
        const chatRoomFormat = getChatRoomDoc.docs[0].data().RoomFormat;
        const chatRoomMessageCollection = Firebase_1.firestore.collection(`academicYear/${yearSelector}/class/${classID}/chat/${getChatRoomDocId}/message`);
        let now = new Date();
        let date = now.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        let time = now.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
        let formattedDateTime = `${date}-${time}`;
        let filePath = 'chat/' + classID + "-" + chatRoomID;
        const storageUrl = "https://firebasestorage.googleapis.com/v0/b/ufyp-a18cf.appspot.com/o";
        const token = (0, uuid_1.v4)();
        var [filesInBucket] = yield Firebase_1.bucket.getFiles({ prefix: filePath });
        var numFiles = filesInBucket.length;
        var numberCount = numFiles;
        for (const file of files) {
            let newMessage;
            let buffer = fs.readFileSync(file.path);
            const FileType = yield file_type_1.default.fromBuffer(buffer);
            const extension = path_1.default.extname(file.originalname).toLowerCase();
            let fileName = `${filePath}/${numberCount}${extension}`;
            let fileRef = Firebase_1.bucket.file(`${fileName}`);
            let [exists] = yield fileRef.exists();
            while (exists) {
                numberCount++;
                fileName = `${filePath}/${numberCount}${extension}`;
                fileRef = Firebase_1.bucket.file(fileName);
                [exists] = yield fileRef.exists();
            }
            yield fileRef.save(buffer, { metadata: { contentType: FileType === null || FileType === void 0 ? void 0 : FileType.mime, metadata: { firebaseStorageDownloadTokens: token } } });
            const url = `${storageUrl}/${encodeURIComponent(fileName)}?alt=media&token=${token}`;
            newMessage = {
                id: 1,
                message: url,
                senderID: senderID,
                type: type,
                time: formattedDateTime,
                read: false
            };
            if (chatRoomFormat === 'group') {
                const response = yield (0, exports.findSenderName)(senderID);
                if (response.success && response.data) {
                    newMessage.SenderEngName = response.data.lastMessageSenderEngName;
                    newMessage.SenderChiName = response.data.lastMessageSenderChiName;
                }
            }
            chatRoomMessageCollection.get().then((snapshot) => {
                newMessage.id = snapshot.size + 1;
                chatRoomMessageCollection.add(newMessage);
            });
        }
        return { success: true };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.sendVideoFileInChatRoom = sendVideoFileInChatRoom;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9jaGF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaURBQWtEO0FBQ2xELG9EQUErRDtBQUMvRCwrQkFBb0M7QUFDcEMsdUNBQXlCO0FBQ3pCLGdEQUF3QjtBQUN4QiwwREFBaUM7QUFDakMsa0RBQTBCO0FBQzFCLGlEQUF1SDtBQUVoSCxNQUFNLGVBQWUsR0FBRyxDQUFPLFNBQWdCLEVBQUMsT0FBYyxFQUFHLEVBQUU7SUFDdEUsSUFBRztRQUNELE1BQU0sWUFBWSxHQUFHLEdBQUcsdUJBQVksQ0FBQyxXQUFXLElBQUksdUJBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM1RSxNQUFNLGNBQWMsR0FBRyxvQkFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsWUFBWSxVQUFVLE9BQU8sUUFBUSxDQUFDLENBQUM7UUFDNUYsTUFBTSxpQkFBaUIsR0FBRyxvQkFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUNuRCxNQUFNLGlCQUFpQixHQUFHLG9CQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQ25ELE1BQU0sY0FBYyxHQUFHLE1BQU0sY0FBYyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUMsSUFBSSxFQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUMsSUFBSSxFQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBR2pILElBQUksWUFBWSxHQUFLLEVBQUUsQ0FBQztRQUV4QixJQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBQztZQUN2QixJQUFJLElBQUksQ0FBQztZQUNULElBQUksR0FBRztnQkFDTCxVQUFVLEVBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDO2dC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