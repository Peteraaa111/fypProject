import { firestore as db} from "../utilities/Firebase";
import { bucket} from "../utilities/Firebase";
import * as fs from 'fs';
import { auth } from "../utilities/Firebase";
import { v4 as uuidv4 } from 'uuid';
import { 
    activityPhotoModal,
    addActivityModal,
    editUploadImageModal,
} from '../models/schoolActivity';
 
export const getAcademicYearDocIds = async () => {
    try {
        const docRefs = await db.collection("academicYear").get();
        const docIds = docRefs.docs.map((doc) => doc.id);
        return { success: true, data: docIds };
    } catch (error: any) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
};

export const getPhotoDocIds = async (academicYear: string) => {
    try {
        const docRefs = await db
            .collection("academicYear")
            .doc(academicYear)
            .collection("photo")
            .get();
        const docIds = docRefs.docs.map((doc) => doc.id);
        return { success: true, data: docIds };
    } catch (error: any) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
};

export const getPhotoActivity = async (academicYear: string, photoDate:string) => {
    try {
        const docRefs = await db
            .collection("academicYear")
            .doc(academicYear)
            .collection("photo")
            .doc(photoDate)
            .collection("activity")
            .get();
        const activities: any[] = [];
        docRefs.docs.forEach((doc) => {
            const data = doc.data();
            const activity = { id: doc.id, ...data };
            activities.push(activity);  

        });
        return { success: true, data: activities };
    } catch (error: any) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
};

export const getPhotoInActivity = async (academicYear: string, photoDate:string,id:string) => {
    try {
        const docRefs = await db
            .collection("academicYear")
            .doc(academicYear)
            .collection("photo")
            .doc(photoDate)
            .collection("activity");
        const activityQuerySnapshot = await docRefs.where('id', '==', id).get();
        const activityDocSnapshot = activityQuerySnapshot.docs[0];
        const activityDocId = activityDocSnapshot.id;
        const imageCollection = docRefs.doc(activityDocId).collection("image")

        const activitiesImage: any[] = [];
        const imageQuerySnapshot = await imageCollection.get();
        imageQuerySnapshot.forEach((imageDocSnapshot) => {
            const imageData = imageDocSnapshot.data();
            const imageDocId = imageDocSnapshot.id;
            console.log(`Document ID: ${imageDocId}`);
            console.log(imageData);
            activitiesImage.push(imageData);
        });

        return { success: true ,data: activitiesImage};
    } catch (error: any) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
};



export const uploadFiles = async (files: any, group: activityPhotoModal,actorID:string) => {
    try {
        const activityRef = await db
            .collection("academicYear")
            .doc(group.year)
            .collection("photo")
            .doc(group.activityMonth)
            .collection('activity');
        // console.log(activityRef.path);
        const storageUrl = "https://firebasestorage.googleapis.com/v0/b/ufyp-a18cf.appspot.com/o"
        const activityQuerySnapshot = await activityRef.where('id', '==', group.activityID).get();
        if (activityQuerySnapshot.empty) {
            // console.log('No matching documents.');
            // console.log("group activity ID "+group.activityID)
        } else {

            const activityDocSnapshot = activityQuerySnapshot.docs[0];
            const activityDocId = activityDocSnapshot.id;
            const token =  uuidv4();
            const imageCollection = activityRef.doc(activityDocId).collection('image');
            var [filesInBucket] = await bucket.getFiles({ prefix: group.filePath });
            var numFiles = filesInBucket.length;
            var numberCount = numFiles;
            for (const file of files) {
                console.log(file);
                const buffer = fs.readFileSync(file.path);
                numberCount++;
                let fileName = `${group.filePath}/${group.activityName}-${numberCount}.jpg`;
                let fileRef = bucket.file(`${fileName}`);
                let [exists] = await fileRef.exists();
                while (exists) {
                  numberCount++;
                  fileName = `${group.filePath}/${group.activityName}-${numberCount}.jpg`;
                  fileRef = bucket.file(fileName);
                  [exists] = await fileRef.exists();
                }
                const imageRef = imageCollection.doc();
                const newImageDocId = imageRef.id;
                const imageId = numberCount;
                const imageName = `${group.activityName}-${numberCount}`;
                await imageRef.set({ id: imageId, name: imageName });
                await fileRef.save(buffer, { metadata: { contentType: file.mimetype, metadata:{firebaseStorageDownloadTokens: token,} } });
                const url = `${storageUrl}/${encodeURIComponent(fileName)}?alt=media&token=${token}`
                await imageRef.update({ url: url });

                await logMovement(actorID,newImageDocId,"add image to activity path "+group.filePath+" and file name is "+group.activityName+"-"+numberCount+".jpg");
                // console.log(`File ${file.originalname} uploaded to ${group.filePath}.`);
                // console.log(`File URL: ${url}`);
            }
        }

        return { success: true, message: "Upload Success"};
    } catch (error: any) {
        console.error(`Error uploading files to ${group.filePath}:`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
};

export const editUploadImage = async (files: any, group: editUploadImageModal,actorID:string) => {
    try {
      const activityRef = await db
        .collection("academicYear")
        .doc(group.year)
        .collection("photo")
        .doc(group.activityMonth)
        .collection('activity');
      const storageUrl = "https://firebasestorage.googleapis.com/v0/b/ufyp-a18cf.appspot.com/o"
      const activityQuerySnapshot = await activityRef.where('id', '==', group.activityID).get();
      if (activityQuerySnapshot.empty) {

      } else {
        const activityDocSnapshot = activityQuerySnapshot.docs[0];
        const activityDocId = activityDocSnapshot.id;
        const token =  uuidv4();
        const imageCollection = activityRef.doc(activityDocId).collection('image');
        const imageQuerySnapshot = await imageCollection.where('id', '==', Number(group.imageID)).get();
        const imageDocSnapshot = imageQuerySnapshot.docs[0];
        const imageDocId = imageDocSnapshot.id;
        const fileName = `${group.filePath}/${group.imageName}.jpg`;
        const fileRef = bucket.file(`${fileName}`);
        // const [exists] = await fileRef.exists();
        // if (!exists) {
        //   console.log(`File ${fileName} does not exist.`);
        //   return { success: false, message: `File ${fileName} does not exist.` };
        // }
        const buffer = fs.readFileSync(files[0].path);
        await fileRef.save(buffer, { metadata: { contentType: files[0].mimetype, metadata:{firebaseStorageDownloadTokens: token,} } });
        const url = `${storageUrl}/${encodeURIComponent(fileName)}?alt=media&token=${token}`
        await imageCollection.doc(imageDocId).update({ url: url });

        logMovement(actorID,imageDocId,"edit image in activity path "+group.filePath+" and file name is "+group.imageName+".jpg");
      }
  
      return { success: true, message: "Upload Success"};
    } catch (error: any) {
      console.error(`Error uploading files to ${group.filePath}:`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }
};

export const deleteImage = async (group: editUploadImageModal,actorID:string) => {
    try {
      const activityRef = await db
        .collection("academicYear")
        .doc(group.year)
        .collection("photo")
        .doc(group.activityMonth)
        .collection('activity');
      const storageUrl = "https://firebasestorage.googleapis.com/v0/b/ufyp-a18cf.appspot.com/o"
      const activityQuerySnapshot = await activityRef.where('id', '==', group.activityID).get();
      if (activityQuerySnapshot.empty) {
        console.log('No matching documents.');
        console.log("group activity ID "+group.activityID)
      } else {
        const activityDocSnapshot = activityQuerySnapshot.docs[0];
        const activityDocId = activityDocSnapshot.id;
        const imageCollection = activityRef.doc(activityDocId).collection('image');
        const imageQuerySnapshot = await imageCollection.where('id', '==', Number(group.imageID)).get();
        if (imageQuerySnapshot.empty) {
          console.log('No matching documents.');
          console.log("group image ID "+group.imageID)
        } else {
          const imageDocSnapshot = imageQuerySnapshot.docs[0];
          const imageDocId = imageDocSnapshot.id;
          const imageDocData = imageDocSnapshot.data();
          const fileName = `${group.filePath}/${imageDocData.name}.jpg`;
          const fileRef = bucket.file(`${fileName}`);
          const [exists] = await fileRef.exists();
          if (!exists) {
            console.log(`File ${fileName} does not exist.`);
            return { success: false, message: `File ${fileName} does not exist.` };
          }
          await fileRef.delete();
          await imageCollection.doc(imageDocId).delete();
          console.log(`File ${fileName} deleted.`);

          await logMovement(actorID,imageDocId, "delete image in activity path "+group.filePath+" and file name is "+group.imageName+".jpg");
        }
        

      }
  
      return { success: true, message: "Delete Success"};
    } catch (error: any) {
      console.error(`Error deleting image from ${group.filePath}:`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  };



  export const addActivity = async (data:addActivityModal) => {
    try {
        const activityCollection = db.collection(`academicYear/${data.yearSelect}/photo/${data.activityDate}/activity/`);
        const querySnapshot = await activityCollection.get();
        const newDocNumber = querySnapshot.size + 1;
        const newDoc = {
            id: (newDocNumber).toString(),
            name: data.activityName,
            date: data.photoDate,
        };
        const newDocRef = activityCollection.doc();
        const newDocId = newDocRef.id;
        const targetID = newDocId;
        await newDocRef.set(newDoc);
        return { success: true, message: "Add Success", targetID: targetID };
    } catch (error: any) {
        console.error(`Error adding activity`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
}

export const logMovement = async (actorUid:any ,targetUid: any, action: any) => {
    try {
      const logRef = db.collection('logs');
      
      const logData = {
        actorUid: actorUid,
        TargetUid: targetUid,
        action: action,
        timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong' }),
      };
      
      await logRef.add(logData);
      
      return { success: true, message: "log created" };
    } catch (error: any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    } 
  };
  

