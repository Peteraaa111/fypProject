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
exports.pushNotification = exports.getAllNotification = exports.editNotification = exports.addNotification = void 0;
const Firebase_1 = require("../utilities/Firebase");
// import { 
// } from '../models/pushNotification'
const notification_1 = require("../services/notification");
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
const editNotification = (id, contentTC, contentEN, titleTC, titleEN) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notificationCollection = Firebase_1.firestore.collection(`notification`);
        const notification = yield notificationCollection.where('id', '==', id).get();
        if (notification.empty) {
            return { success: false, message: "No matching documents." };
        }
        const doc = notification.docs[0];
        yield doc.ref.update({
            titleTC: titleTC,
            titleEN: titleEN,
            contentTC: contentTC,
            contentEN: contentEN,
        });
        return { success: true, message: "Edit notification success" };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.editNotification = editNotification;
const getAllNotification = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notificationCollection = Firebase_1.firestore.collection(`notification`);
        const snapshot = yield notificationCollection.get();
        const notificationList = snapshot.docs.map((doc) => {
            return Object.assign({}, doc.data());
        });
        return { success: true, message: "Get all notification success", data: notificationList };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getAllNotification = getAllNotification;
const pushNotification = (selectedOption, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield getNotificationInfo(parseInt(id.toString()));
        let deviceData;
        if (selectedOption == 'All') {
            deviceData = yield (0, notification_1.getAllDeviceID)();
        }
        else if (selectedOption == 'teacher') {
            deviceData = yield (0, notification_1.getAllDeviceIDWithSpec)("teacher");
        }
        else {
            deviceData = yield (0, notification_1.getAllDeviceIDWithSpec)("student");
        }
        for (let device of deviceData.data) {
            let title, content;
            if (device.languageCode === 'zh') {
                title = data.titleTC;
                content = data.contentTC;
            }
            else {
                title = data.titleEN;
                content = data.contentEN;
            }
            yield (0, notification_1.sendNotificationWithAttribute)(title, content, device.deviceID, "Announcement");
            yield (0, notification_1.createDocumentInCollection)(data.titleTC, data.contentTC, data.titleEN, data.contentEN, device.userID);
        }
        return { success: true, message: "push notification success" };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.pushNotification = pushNotification;
const getNotificationInfo = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notificationCollection = Firebase_1.firestore.collection(`notification`);
        const notification = yield notificationCollection.where('id', '==', id).get();
        if (notification.empty) {
            return { success: false, message: "No matching documents." };
        }
        let data;
        data = {
            titleEN: notification.docs[0].get('titleEN'),
            titleTC: notification.docs[0].get('titleTC'),
            contentEN: notification.docs[0].get('contentEN'),
            contentTC: notification.docs[0].get('contentTC'),
        };
        return data;
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaE5vdGlmaWNhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9wdXNoTm90aWZpY2F0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG9EQUF1RDtBQUV2RCxZQUFZO0FBRVosc0NBQXNDO0FBQ3RDLDJEQUtrQztBQUUzQixNQUFNLGVBQWUsR0FBRyxDQUFPLFNBQWdCLEVBQUUsU0FBZ0IsRUFBQyxPQUFjLEVBQUMsT0FBYyxFQUFFLEVBQUU7SUFDdEcsSUFBSTtRQUNGLE1BQU0sc0JBQXNCLEdBQUcsb0JBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFN0QsTUFBTSxRQUFRLEdBQUcsTUFBTSxzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNwRCxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUU3QixNQUFNLHNCQUFzQixDQUFDLEdBQUcsQ0FBQztZQUMvQixFQUFFLEVBQUUsRUFBRTtZQUNOLE9BQU8sRUFBQyxPQUFPO1lBQ2YsT0FBTyxFQUFDLE9BQU87WUFDZixTQUFTLEVBQUUsU0FBUztZQUNwQixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDLENBQUM7UUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsQ0FBQztLQUMvRDtJQUFDLE9BQU8sS0FBVSxFQUFFO1FBQ25CLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckIsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztLQUN2RTtBQUNMLENBQUMsQ0FBQSxDQUFDO0FBcEJXLFFBQUEsZUFBZSxtQkFvQjFCO0FBRUssTUFBTSxnQkFBZ0IsR0FBRyxDQUFPLEVB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