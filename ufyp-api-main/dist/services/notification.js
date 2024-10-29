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
exports.createDocumentInCollection = exports.sendNotificationWithAttributeInChat = exports.sendNotificationWithAttribute = exports.sendNotification = exports.getDeviceByUserID = exports.getAllDeviceIDWithSpec = exports.getAllDeviceID = void 0;
const Firebase_1 = require("../utilities/Firebase");
const Firebase_2 = require("../utilities/Firebase");
const getAllDeviceID = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const devicesCollection = Firebase_1.firestore.collection(`devices`);
        const snapshot = yield devicesCollection.get();
        const deviceList = snapshot.docs.map((doc) => {
            let dataItem = {
                deviceID: doc.get("deviceID"),
                languageCode: doc.get("languageCode"),
                userID: doc.get("userID"),
            };
            return Object.assign({}, dataItem);
        });
        return { data: deviceList };
    }
    catch (error) {
        console.error(error);
        return { message: `${error.name}: ${error.message}` };
    }
});
exports.getAllDeviceID = getAllDeviceID;
const getAllDeviceIDWithSpec = (select) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const devicesCollection = Firebase_1.firestore.collection(`devices`);
        let snapshot;
        if (select == 'teacher') {
            snapshot = yield devicesCollection.orderBy('userID').startAt('teachers').get();
        }
        else {
            snapshot = yield devicesCollection.orderBy('userID').startAt('student').endAt('student\ufff0').get();
        }
        //const snapshot = await devicesCollection.where().get();
        const deviceList = snapshot.docs.map((doc) => {
            let dataItem = {
                deviceID: doc.get("deviceID"),
                languageCode: doc.get("languageCode"),
                userID: doc.get("userID"),
            };
            return Object.assign({}, dataItem);
        });
        return { data: deviceList };
    }
    catch (error) {
        return { message: `${error.name}: ${error.message}` };
    }
});
exports.getAllDeviceIDWithSpec = getAllDeviceIDWithSpec;
const getDeviceByUserID = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const devicesCollection = Firebase_1.firestore.collection(`devices`);
        const snapshot = yield devicesCollection.where('userID', '==', userID).get();
        if (snapshot.empty) {
            return { message: 'No matching device found.' };
        }
        const doc = snapshot.docs[0];
        const device = {
            deviceID: doc.get("deviceID"),
            languageCode: doc.get("languageCode"),
            userID: doc.get("userID"),
        };
        return { data: device };
    }
    catch (error) {
        return { message: `${error.name}: ${error.message}` };
    }
});
exports.getDeviceByUserID = getDeviceByUserID;
const sendNotification = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = {
            notification: {
                title: 'HIHI',
                body: 'This is a Firebase Cloud Messaging Topic Message!',
            },
            data: {
                type: 'tt',
                id: '123456',
            },
            token: 'cspD4My5STyhBjHTNd077z:APA91bGSBbHQ5aSjKVDfVsbCsObTuTmPbrCJmwT97i9H6LAJEzDCOLZcfUlyDS0Lm-9dhlnrXEZbcBNhJHFzlmwn6e2-9LiqlB4WX6XKsQVE9YTV5us77BzdFHRItbUiO2sTGmaasDmk'
        };
        yield Firebase_2.notificationSender.send(message);
        console.log('Notification Sent!');
        return { success: true };
    }
    catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
});
exports.sendNotification = sendNotification;
const sendNotificationWithAttribute = (title, content, token, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = {
            notification: {
                title: title,
                body: content,
            },
            data: {
                type: type,
                id: '123456',
            },
            token: token
        };
        console.log(token);
        yield Firebase_2.notificationSender.send(message);
        console.log('Notification Sent!');
        return { success: true };
    }
    catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
});
exports.sendNotificationWithAttribute = sendNotificationWithAttribute;
const sendNotificationWithAttributeInChat = (title, content, token, type, chatRoomID, s_Id, t_Id, parent_Name, t_ChiName, t_EngName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = {
            notification: {
                title: title,
                body: content,
            },
            data: {
                type: type,
                id: '123456',
                // chatRoomID:chatRoomID,
                // s_Id:s_Id,
                // t_Id:t_Id,
                // parent_Name:parent_Name,
                // t_ChiName:t_ChiName,
                // t_EngName:t_EngName
            },
            token: token
        };
        console.log(token);
        yield Firebase_2.notificationSender.send(message);
        console.log('Notification Sent!');
        return { success: true };
    }
    catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
});
exports.sendNotificationWithAttributeInChat = sendNotificationWithAttributeInChat;
const createDocumentInCollection = (titleTC, contentTC, titleEN, contentEN, userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userNotificationCollection = Firebase_1.firestore.collection('userNotification');
        const newDoc = yield userNotificationCollection.add({
            titleTC,
            contentTC,
            titleEN,
            contentEN,
            userID
        });
        return { success: true, message: "Document successfully written!", docId: newDoc.id };
    }
    catch (error) {
        console.error("Error writing document: ", error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.createDocumentInCollection = createDocumentInCollection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL25vdGlmaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxvREFBdUQ7QUFFdkQsb0RBQTJEO0FBR3BELE1BQU0sY0FBYyxHQUFHLEdBQVMsRUFBRTtJQUN2QyxJQUFJO1FBQ0EsTUFBTSxpQkFBaUIsR0FBRyxvQkFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNuRCxNQUFNLFFBQVEsR0FBRyxNQUFNLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQy9DLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDM0MsSUFBSSxRQUFRLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO2dCQUM3QixZQUFZLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7Z0JBQ3JDLE1BQU0sRUFBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQzthQUN6QixDQUFBO1lBQ0QseUJBQ0ssUUFBUSxFQUNYO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLEVBQUMsSUFBSSxFQUFDLFVBQVUsRUFBRSxDQUFDO0tBQzNCO0lBQUMsT0FBTyxLQUFVLEVBQUU7UUFDbkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyQixPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztLQUN2RDtBQUNMLENBQUMsQ0FBQSxDQUFDO0FBbkJXLFFBQUEsY0FBYyxrQkFtQnpCO0FBRUssTUFBTSxzQkFBc0IsR0FBRyxDQUFPLE1BQWEsRUFBRSxFQUFFO0lBQzVELElBQUk7UUFDQSxNQUFN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