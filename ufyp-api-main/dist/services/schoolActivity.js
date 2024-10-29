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
exports.logMovement = exports.addActivity = exports.deleteImage = exports.editUploadImage = exports.uploadFiles = exports.getPhotoInActivity = exports.getPhotoActivity = exports.getPhotoDocIds = exports.getAcademicYearDocIds = void 0;
const Firebase_1 = require("../utilities/Firebase");
const Firebase_2 = require("../utilities/Firebase");
const fs = __importStar(require("fs"));
const uuid_1 = require("uuid");
const getAcademicYearDocIds = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docRefs = yield Firebase_1.firestore.collection("academicYear").get();
        const docIds = docRefs.docs.map((doc) => doc.id);
        return { success: true, data: docIds };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getAcademicYearDocIds = getAcademicYearDocIds;
const getPhotoDocIds = (academicYear) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docRefs = yield Firebase_1.firestore
            .collection("academicYear")
            .doc(academicYear)
            .collection("photo")
            .get();
        const docIds = docRefs.docs.map((doc) => doc.id);
        return { success: true, data: docIds };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getPhotoDocIds = getPhotoDocIds;
const getPhotoActivity = (academicYear, photoDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docRefs = yield Firebase_1.firestore
            .collection("academicYear")
            .doc(academicYear)
            .collection("photo")
            .doc(photoDate)
            .collection("activity")
            .get();
        const activities = [];
        docRefs.docs.forEach((doc) => {
            const data = doc.data();
            const activity = Object.assign({ id: doc.id }, data);
            activities.push(activity);
        });
        return { success: true, data: activities };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getPhotoActivity = getPhotoActivity;
const getPhotoInActivity = (academicYear, photoDate, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docRefs = yield Firebase_1.firestore
            .collection("academicYear")
            .doc(academicYear)
            .collection("photo")
            .doc(photoDate)
            .collection("activity");
        const activityQuerySnapshot = yield docRefs.where('id', '==', id).get();
        const activityDocSnapshot = activityQuerySnapshot.docs[0];
        const activityDocId = activityDocSnapshot.id;
        const imageCollection = docRefs.doc(activityDocId).collection("image");
        const activitiesImage = [];
        const imageQuerySnapshot = yield imageCollection.get();
        imageQuerySnapshot.forEach((imageDocSnapshot) => {
            const imageData = imageDocSnapshot.data();
            const imageDocId = imageDocSnapshot.id;
            console.log(`Document ID: ${imageDocId}`);
            console.log(imageData);
            activitiesImage.push(imageData);
        });
        return { success: true, data: activitiesImage };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getPhotoInActivity = getPhotoInActivity;
const uploadFiles = (files, group, actorID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activityRef = yield Firebase_1.firestore
            .collection("academicYear")
            .doc(group.year)
            .collection("photo")
            .doc(group.activityMonth)
            .collection('activity');
        // console.log(activityRef.path);
        const storageUrl = "https://firebasestorage.googleapis.com/v0/b/ufyp-a18cf.appspot.com/o";
        const activityQuerySnapshot = yield activityRef.where('id', '==', group.activityID).get();
        if (activityQuerySnapshot.empty) {
            // console.log('No matching documents.');
            // console.log("group activity ID "+group.activityID)
        }
        else {
            const activityDocSnapshot = activityQuerySnapshot.docs[0];
            const activityDocId = activityDocSnapshot.id;
            const token = (0, uuid_1.v4)();
            const imageCollection = activityRef.doc(activityDocId).collection('image');
            var [filesInBucket] = yield Firebase_2.bucket.getFiles({ prefix: group.filePath });
            var numFiles = filesInBucket.length;
            var numberCount = numFiles;
            for (const file of files) {
                console.log(file);
                const buffer = fs.readFileSync(file.path);
                numberCount++;
                let fileName = `${group.filePath}/${group.activityName}-${numberCount}.jpg`;
                let fileRef = Firebase_2.bucket.file(`${fileName}`);
                let [exists] = yield fileRef.exists();
                while (exists) {
                    numberCount++;
                    fileName = `${group.filePath}/${group.activityName}-${numberCount}.jpg`;
                    fileRef = Firebase_2.bucket.file(fileName);
                    [exists] = yield fileRef.exists();
                }
                const imageRef = imageCollection.doc();
                const newImageDocId = imageRef.id;
                const imageId = numberCount;
                const imageName = `${group.activityName}-${numberCount}`;
                yield imageRef.set({ id: imageId, name: imageName });
                yield fileRef.save(buffer, { metadata: { contentType: file.mimetype, metadata: { firebaseStorageDownloadTokens: token, } } });
                const url = `${storageUrl}/${encodeURIComponent(fileName)}?alt=media&token=${token}`;
                yield imageRef.update({ url: url });
                yield (0, exports.logMovement)(actorID, newImageDocId, "add image to activity path " + group.filePath + " and file name is " + group.activityName + "-" + numberCount + ".jpg");
                // console.log(`File ${file.originalname} uploaded to ${group.filePath}.`);
                // console.log(`File URL: ${url}`);
            }
        }
        return { success: true, message: "Upload Success" };
    }
    catch (error) {
        console.error(`Error uploading files to ${group.filePath}:`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.uploadFiles = uploadFiles;
const editUploadImage = (files, group, actorID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activityRef = yield Firebase_1.firestore
            .collection("academicYear")
            .doc(group.year)
            .collection("photo")
            .doc(group.activityMonth)
            .collection('activity');
        const storageUrl = "https://firebasestorage.googleapis.com/v0/b/ufyp-a18cf.appspot.com/o";
        const activityQuerySnapshot = yield activityRef.where('id', '==', group.activityID).get();
        if (activityQuerySnapshot.empty) {
        }
        else {
            const activityDocSnapshot = activityQuerySnapshot.docs[0];
            const activityDocId = activityDocSnapshot.id;
            const token = (0, uuid_1.v4)();
            const imageCollection = activityRef.doc(activityDocId).collection('image');
            const imageQuerySnapshot = yield imageCollection.where('id', '==', Number(group.imageID)).get();
            const imageDocSnapshot = imageQuerySnapshot.docs[0];
            const imageDocId = imageDocSnapshot.id;
            const fileName = `${group.filePath}/${group.imageName}.jpg`;
            const fileRef = Firebase_2.bucket.file(`${fileName}`);
            // const [exists] = await fileRef.exists();
            // if (!exists) {
            //   console.log(`File ${fileName} does not exist.`);
            //   return { success: false, message: `File ${fileName} does not exist.` };
            // }
            const buffer = fs.readFileSync(files[0].path);
            yield fileRef.save(buffer, { metadata: { contentType: files[0].mimetype, metadata: { firebaseStorageDownloadTokens: token, } } });
            const url = `${storageUrl}/${encodeURIComponent(fileName)}?alt=media&token=${token}`;
            yield imageCollection.doc(imageDocId).update({ url: url });
            (0, exports.logMovement)(actorID, imageDocId, "edit image in activity path " + group.filePath + " and file name is " + group.imageName + ".jpg");
        }
        return { success: true, message: "Upload Success" };
    }
    catch (error) {
        console.error(`Error uploading files to ${group.filePath}:`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.editUploadImage = editUploadImage;
const deleteImage = (group, actorID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activityRef = yield Firebase_1.firestore
            .collection("academicYear")
            .doc(group.year)
            .collection("photo")
            .doc(group.activityMonth)
            .collection('activity');
        const storageUrl = "https://firebasestorage.googleapis.com/v0/b/ufyp-a18cf.appspot.com/o";
        const activityQuerySnapshot = yield activityRef.where('id', '==', group.activityID).get();
        if (activityQuerySnapshot.empty) {
            console.log('No matching documents.');
            console.log("group activity ID " + group.activityID);
        }
        else {
            const activityDocSnapshot = activityQuerySnapshot.docs[0];
            const activityDocId = activityDocSnapshot.id;
            const imageCollection = activityRef.doc(activityDocId).collection('image');
            const imageQuerySnapshot = yield imageCollection.where('id', '==', Number(group.imageID)).get();
            if (imageQuerySnapshot.empty) {
                console.log('No matching documents.');
                console.log("group image ID " + group.imageID);
            }
            else {
                const imageDocSnapshot = imageQuerySnapshot.docs[0];
                const imageDocId = imageDocSnapshot.id;
                const imageDocData = imageDocSnapshot.data();
                const fileName = `${group.filePath}/${imageDocData.name}.jpg`;
                const fileRef = Firebase_2.bucket.file(`${fileName}`);
                const [exists] = yield fileRef.exists();
                if (!exists) {
                    console.log(`File ${fileName} does not exist.`);
                    return { success: false, message: `File ${fileName} does not exist.` };
                }
                yield fileRef.delete();
                yield imageCollection.doc(imageDocId).delete();
                console.log(`File ${fileName} deleted.`);
                yield (0, exports.logMovement)(actorID, imageDocId, "delete image in activity path " + group.filePath + " and file name is " + group.imageName + ".jpg");
            }
        }
        return { success: true, message: "Delete Success" };
    }
    catch (error) {
        console.error(`Error deleting image from ${group.filePath}:`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.deleteImage = deleteImage;
const addActivity = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activityCollection = Firebase_1.firestore.collection(`academicYear/${data.yearSelect}/photo/${data.activityDate}/activity/`);
        const querySnapshot = yield activityCollection.get();
        const newDocNumber = querySnapshot.size + 1;
        const newDoc = {
            id: (newDocNumber).toString(),
            name: data.activityName,
            date: data.photoDate,
        };
        const newDocRef = activityCollection.doc();
        const newDocId = newDocRef.id;
        const targetID = newDocId;
        yield newDocRef.set(newDoc);
        return { success: true, message: "Add Success", targetID: targetID };
    }
    catch (error) {
        console.error(`Error adding activity`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.addActivity = addActivity;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nob29sQWN0aXZpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvc2Nob29sQWN0aXZpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvREFBdUQ7QUFDdkQsb0RBQThDO0FBQzlDLHVDQUF5QjtBQUV6QiwrQkFBb0M7QUFPN0IsTUFBTSxxQkFBcUIsR0FBRyxHQUFTLEVBQUU7SUFDNUMsSUFBSTtRQUNBLE1BQU0sT0FBTyxHQUFHLE1BQU0sb0JBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDMUQsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNqRCxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUM7S0FDMUM7SUFBQyxPQUFPLEtBQVUsRUFBRTtRQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM5QixPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO0tBQ3pFO0FBQ0wsQ0FBQyxDQUFBLENBQUM7QUFUVyxRQUFBLHFCQUFxQix5QkFTaEM7QUFFSyxNQUFNLGNBQWMsR0FBRyxDQUFPLFlBQW9CLEVBQUUsRUFBRTtJQUN6RCxJQUFJO1FBQ0EsTUFBTSxPQUFPLEdBQUcsTUFBTSxvQkFBRTthQUNuQixVQUFVLENBQUMsY0FBYyxDQUFDO2FBQzFCLEdBQUcsQ0FBQyxZQUFZLENBQUM7YUFDakIsVUFBVSxDQUFDLE9BQU8sQ0FBQzthQUNuQixHQUFHLEVBQUUsQ0FBQztRQUNYLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDakQsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDO0tBQzFDO0lBQUMsT0FBTyxLQUFVLEVBQUU7UUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDOUIsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztLQUN6RTtBQUNMLENBQUMsQ0FBQSxDQUFDO0FBYlcsUUFBQSxjQUFjLGtCQWF6QjtBQUVLLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBTyxZQUFvQixFQUFFLFNBQWdCLEVBQUUsRUFBRTtJQUM3RSxJQUFJO1FBQ0EsTUFBTSxPQUFPLEdBQUcsTUFBTSxvQkFBRTthQUNuQixVQUFVLENBQUMsY0FBYyxDQUFDO2FBQzFCLEdBQUcsQ0FBQyxZQUFZLENBQUM7YUFDakIsVUFBVSxDQUFDLE9BQU8sQ0FBQzthQUNuQixHQUFHLENBQUMsU0FBUyxDQUFDO2FBQ2QsVUFBVSxDQUFDLFVBQVUsQ0FBQzthQUN0QixHQUFHLEVBQUUsQ0FBQztRQUNYLE1BQU0sVUFBVSxHQUFVLEVBQUUsQ0FBQztRQUM3QixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ3pCLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN4QixNQUFNLFFBQVEsbUJBQUssRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUssSUFBSSxDQUFFLENBQUM7WUFDekMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUU5QixDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQztLQUM5QztJQUFDLE9BQU8sS0FBVSxFQUFFO1FBQ2pCLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzlCLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7S0FDekU7QUFDTCxDQUFDLENBQUEsQ0FBQztBQXJCVyxRQUFBLGdCQUFnQixvQkFxQjNCO0FBRUssTUFBTSxrQkFBa0IsR0FBRyxDQUFPLFlBQW9CLEVBQUUsU0FBZ0IsRUFBQyxFQUFTLEVBQUUsRUFBRTtJQUN6RixJQUFJO1FBQ0EsTUFBTSxPQUFPLEdBQUcsTUFBTSxvQkFBRTthQUNuQixVQUFVLENBQUMsY0FBYyxDQUFDO2FBQzFCLEdBQUcsQ0FBQyxZQUFZLENBQUM7YUFDakIsVUFBVSxDQUFDLE9BQU8sQ0FBQzthQUNuQixHQUFHLENBQUMsU0FBUyxDQUFDO2FBQ2QsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVCLE1BQU0scUJBQXFCLEdBQUcsTUFBTSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDeEUsTUFBTSxtQkFBbUIsR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUQsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLENBQUMsRUFBRSxDQUFDO1FBQzdDLE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRXRFLE1BQU0sZUFBZSxHQUFVLEVBQUUsQ0FBQztRQUNsQyxNQUFNLGtCQUFrQixHQUFHLE1BQU0sZUFBZSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3ZELGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLGdCQUFnQixFQUFFLEVBQUU7WUFDNUMsTUFBTSxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDMUMsTUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsRUFBRSxDQUFDO1lBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2QixlQUFlLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBQyxDQUFDO0tBQ2xEO0lBQUMsT0FBTyxLQUFVLEVBQUU7UUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDOUIsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztLQUN6RTtBQUNMLENBQUMsQ0FBQSxDQUFDO0FBNUJXLFFBQUEsa0JBQWtCLHNCQTRCN0I7QUFJSyxNQUFNLFdBQVcsR0FBRyxDQUFPLEtBQVUsRUFBRSxLQUF5QixFQUFDLE9BQWMsRUFBRSxFQUFFO0lBQ3RGLElBQUk7UUFDQSxNQUFNLFdBQVcsR0FBRyxNQUFNLG9CQUFFO2FBQ3ZCLFVBQVUsQ0FBQyxjQUFjLENBQUM7YUFDMUIsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7YUFDZixVQUFVLENBQUMsT0FBTyxDQUFDO2FBQ25CLEdBQUcsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDO2FBQ3hCLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM1QixpQ0FBaUM7UUFDakMsTUFBTSxVQUFVLEdBQUcsc0VBQXNFLENBQUE7UUFDekYsTUFBTSxxQkFBcUIsR0FBRyxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDMUYsSUFBSSxxQkFBcUIsQ0FBQyxLQUFLLEVBQUU7WUFDN0IseUNBQXlDO1lBQ3pDLHFEQUFxRDtTQUN4RDthQUFNO1lBRUgsTUFBTSxtQkFBbUIsR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUQsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLENBQUMsRUFBRSxDQUFDO1lBQzdDLE1BQU0sS0FBSyxHQUFJLElBQUEsU0FBTSxHQUFFLENBQUM7WUFDeEIsTUFBTSxlQUFlLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDM0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLE1BQU0saUJBQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDeEUsSUFBSSxRQUFRLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztZQUNwQyxJQUFJLFdBQVcsR0FBRyxRQUFRLENBQUM7WUFDM0IsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7Z0JBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xCLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMxQyxXQUFXLEVBQUUsQ0FBQztnQkFDZCxJQUFJLFFBQVEsR0FBRyxHQUFHLEtBQUssQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDLFlBQVksSUFBSSxXQUFXLE1BQU0sQ0FBQztnQkFDNUUsSUFBSSxPQUFPLEdBQUcsaUJBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ3RDLE9BQU8sTUFBTSxFQUFFO29CQUNiLFdBQVcsRUFBRSxDQUFDO29CQUNkLFFBQVEsR0FBRyxHQUFHLEtBQUssQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDLFlBQVksSUFBSSxXQUFXLE1BQU0sQ0FBQztvQkFDeEUsT0FBTyxHQUFHLGlCQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNoQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO2lCQUNuQztnQkFDRCxNQUFNLFFBQVEsR0FBRyxlQUFlLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ3ZDLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUM7Z0JBQ2xDLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQztnQkFDNUIsTUFBTSxTQUFTLEdBQUcsR0FBRyxLQUFLLENBQUMsWUFBWSxJQUFJLFdBQVcsRUFBRSxDQUFDO2dCQUN6RCxNQUFNLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO2dCQUNyRCxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFDLEVBQUMsNkJBQTZCLEVBQUUsS0FBSyxHQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzNILE1BQU0sR0FBRyxHQUFHLEdBQUcsVUFBVSxJQUFJLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsS0FBSyxFQUFFLENBQUE7Z0JBQ3BGLE1BQU0sUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUVwQyxNQUFNLElBQUEsbUJBQVcsRUFBQyxPQUFPLEVBQUMsYUFBYSxFQUFDLDZCQUE2QixHQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUMsb0JBQW9CLEdBQUMsS0FBSyxDQUFDLFlBQVksR0FBQyxHQUFHLEdBQUMsV0FBVyxHQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNySiwyRUFBMkU7Z0JBQzNFLG1DQUFtQzthQUN0QztTQUNKO1FBRUQsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLGdCQUFnQixFQUFDLENBQUM7S0FDdEQ7SUFBQyxPQUFPLEtBQVUsRUFBRTtRQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLDRCQUE0QixLQUFLLENBQUMsUUFBUSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDcEUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztLQUN6RTtBQUNMLENBQUMsQ0FBQSxDQUFDO0FBeERXLFFBQUEsV0FBVyxlQXdEdEI7QUFFSyxNQUFNLGVBQWUsR0FBRyxDQUFPLEtBQVUsRUFBRSxLQUEyQixFQUFDLE9BQWMsRUFBRSxFQUFFO0lBQzVGLElBQUk7UUFDRixNQUFNLFdBQVcsR0FBRyxNQUFNLG9CQUFFO2FBQ3pCLFVBQVUsQ0FBQyxjQUFjLENBQUM7YUFDMUIsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7YUFDZixVQUFVLENBQUMsT0FBTyxDQUFDO2FBQ25CLEdBQUcsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDO2FBQ3hCLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMxQixNQUFNLFVBQVUsR0FBRyxzRUFBc0UsQ0FBQTtRQUN6RixNQUFNLHFCQUFxQixHQUFHLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUMxRixJQUFJLHFCQUFxQixDQUFDLEtBQUssRUFBRTtTQUVoQzthQUFNO1lBQ0wsTUFBTSxtQkFBbUIsR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUQsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLENBQUMsRUFBRSxDQUFDO1lBQzdDLE1BQU0sS0FBSyxHQUFJLElBQUEsU0FBTSxHQUFFLENBQUM7WUFDeEIsTUFBTSxlQUFlLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDM0UsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDaEcsTUFBTSxnQkFBZ0IsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEQsTUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsRUFBRSxDQUFDO1lBQ3ZDLE1BQU0sUUFBUSxHQUFHLEdBQUcsS0FBSyxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsU0FBUyxNQUFNLENBQUM7WUFDNUQsTUFBTSxPQUFPLEdBQUcsaUJBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQzNDLDJDQUEyQztZQUMzQyxpQkFBaUI7WUFDakIscURBQXFEO1lBQ3JELDRFQUE0RTtZQUM1RSxJQUFJO1lBQ0osTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUMsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBQyxFQUFDLDZCQUE2QixFQUFFLEtBQUssR0FBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQy9ILE1BQU0sR0FBRyxHQUFHLEdBQUcsVUFBVSxJQUFJLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsS0FBSyxFQUFFLENBQUE7WUFDcEYsTUFBTSxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRTNELElBQUEsbUJBQVcsRUFBQyxPQUFPLEVBQUMsVUFBVSxFQUFDLDhCQUE4QixHQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUMsb0JBQW9CLEdBQUMsS0FBSyxDQUFDLFNBQVMsR0FBQyxNQUFNLENBQUMsQ0FBQztTQUMzSDtRQUVELE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBQyxDQUFDO0tBQ3BEO0lBQUMsT0FBTyxLQUFVLEVBQUU7UUFDbkIsT0FBTyxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsS0FBSyxDQUFDLFFBQVEsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3BFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7S0FDdkU7QUFDTCxDQUFDLENBQUEsQ0FBQztBQXhDVyxRQUFBLGVBQWUsbUJBd0MxQjtBQUVLLE1BQU0sV0FBVyxHQUFHLENBQU8sS0FBMkIsRUFBQyxPQUFjLEVBQUUsRUFBRTtJQUM1RSxJQUFJO1FBQ0YsTUFBTSxXQUFXLEdBQUcsTUFBTSxvQkFBRTthQUN6QixVQUFVLENBQUMsY0FBYyxDQUFDO2FBQzFCLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO2FBQ2YsVUFBVSxDQUFDLE9BQU8sQ0FBQzthQUNuQixHQUFHLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQzthQUN4QixVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUIsTUFBTSxVQUFVLEdBQUcsc0VBQXNFLENBQUE7UUFDekYsTUFBTSxxQkFBcUIsR0FBRyxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDMUYsSUFBSSxxQkFBcUIsQ0FBQyxLQUFLLEVBQUU7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEdBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1NBQ25EO2FBQU07WUFDTCxNQUFNLG1CQUFtQixHQUFHLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRCxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQyxFQUFFLENBQUM7WUFDN0MsTUFBTSxlQUFlLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDM0UsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDaEcsSUFBSSxrQkFBa0IsQ0FBQyxLQUFLLEVBQUU7Z0JBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztnQkFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsR0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7YUFDN0M7aUJBQU07Z0JBQ0wsTUFBTSxnQkFBZ0IsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELE1BQU0sVUFBVSxHQUFHLGdCQUFnQixDQUFDLEVBQUUsQ0FBQztnQkFDdkMsTUFBTSxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzdDLE1BQU0sUUFBUSxHQUFHLEdBQUcsS0FBSyxDQUFDLFFBQVEsSUFBSSxZQUFZLENBQUMsSUFBSSxNQUFNLENBQUM7Z0JBQzlELE1BQU0sT0FBTyxHQUFHLGlCQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDM0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUN4QyxJQUFJLENBQUMsTUFBTSxFQUFFO29CQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxRQUFRLGtCQUFrQixDQUFDLENBQUM7b0JBQ2hELE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLFFBQVEsa0JBQWtCLEVBQUUsQ0FBQztpQkFDeEU7Z0JBQ0QsTUFBTSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ3ZCLE1BQU0sZUFBZSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDL0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLFFBQVEsV0FBVyxDQUFDLENBQUM7Z0JBRXpDLE1BQU0sSUFBQSxtQkFBVyxFQUFDLE9BQU8sRUFBQyxVQUFVLEVBQUUsZ0NBQWdDLEdBQUMsS0FBSyxDQUFDLFFBQVEsR0FBQyxvQkFBb0IsR0FBQyxLQUFLLENBQUMsU0FBUyxHQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3BJO1NBR0Y7UUFFRCxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQztLQUNwRDtJQUFDLE9BQU8sS0FBVSxFQUFFO1FBQ25CLE9BQU8sQ0FBQyxLQUFLLENBQUMsNkJBQTZCLEtBQUssQ0FBQyxRQUFRLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNyRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO0tBQ3ZFO0FBQ0gsQ0FBQyxDQUFBLENBQUM7QUEvQ1MsUUFBQSxXQUFXLGVBK0NwQjtBQUlLLE1BQU0sV0FBVyxHQUFHLENBQU8sSUFBcUIsRUFBRSxFQUFFO0lBQ3pELElBQUk7UUFDQSxNQUFNLGtCQUFrQixHQUFHLG9CQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixJQUFJLENBQUMsVUFBVSxVQUFVLElBQUksQ0FBQyxZQUFZLFlBQVksQ0FBQyxDQUFDO1FBQ2pILE1BQU0sYUFBYSxHQUFHLE1BQU0sa0JBQWtCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDckQsTUFBTSxZQUFZLEdBQUcsYUFBYSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFDNUMsTUFBTSxNQUFNLEdBQUc7WUFDWCxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLEVBQUU7WUFDN0IsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQ3ZCLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUztTQUN2QixDQUFDO1FBQ0YsTUFBTSxTQUFTLEdBQUcsa0JBQWtCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDM0MsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQztRQUM5QixNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDMUIsTUFBTSxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDO0tBQ3hFO0lBQUMsT0FBTyxLQUFVLEVBQUU7UUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM5QyxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO0tBQ3pFO0FBQ0wsQ0FBQyxDQUFBLENBQUE7QUFuQmMsUUFBQSxXQUFXLGVBbUJ6QjtBQUVNLE1BQU0sV0FBVyxHQUFHLENBQU8sUUFBWSxFQUFFLFNBQWMsRUFBRSxNQUFXLEVBQUUsRUFBRTtJQUMzRSxJQUFJO1FBQ0YsTUFBTSxNQUFNLEdBQUcsb0JBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFckMsTUFBTSxPQUFPLEdBQUc7WUFDZCxRQUFRLEVBQUUsUUFBUTtZQUNsQixTQUFTLEVBQUUsU0FBUztZQUNwQixNQUFNLEVBQUUsTUFBTTtZQUNkLFNBQVMsRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQztTQUM5RSxDQUFDO1FBRUYsTUFBTSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTFCLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsQ0FBQztLQUNsRDtJQUFDLE9BQU8sS0FBVSxFQUFFO1FBQ25CLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7S0FDdkU7QUFDSCxDQUFDLENBQUEsQ0FBQztBQWpCUyxRQUFBLFdBQVcsZUFpQnBCIn0=