import { firestore as db} from "../utilities/Firebase";
import { bucket} from "../utilities/Firebase";
import * as fs from 'fs';
import { auth } from "../utilities/Firebase";
import { v4 as uuidv4 } from 'uuid';
import { 
    applyRewardData,
    reward,
    applyInterestClassData,
    interClassIdGroup,
} from '../models/studentSetting';
 


export const getAllClassAndStudent = async (yearSelect: string) => {
    try {
      const classCollection = db.collection(`academicYear/${yearSelect}/class/`);
      const classCollectionDocs = await classCollection.get();
      const rewardStudentData = await getAllStudentReward(yearSelect);
      
      const classesAndStudent: any[] = [];
      for (const classDoc of classCollectionDocs.docs) {
        const students: any[] = [];
        const classData = { class: classDoc.id, students:students};
        const classmateCollection = classDoc.ref.collection('classmate');
        const classmateDocs = await classmateCollection.get();
  
        for (const classmateDoc of classmateDocs.docs) {
          const studentData = classmateDoc.data();
          const studentId = studentData.studentId;
          const studentExists = rewardStudentData.data!.some((rewardStudent: any) => rewardStudent.studentId === studentId);
          if (!studentExists) {
              students.push(studentData);
          }
        }
        
        if (students.length > 0) {
          classesAndStudent.push(classData);
        }
      }
  
      return { success: true, data: classesAndStudent };
    } catch (error: any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    }
};



export const applyRewardToStudent = async (files:any,applyRewardData: applyRewardData, rewardArray: reward[]) => {
    try {
        const rewardRef = await db
            .collection("academicYear")
            .doc(applyRewardData.selectedYear)
            .collection("reward")
            .doc(applyRewardData.studentId);

        const studentData = await findStudentById(applyRewardData.studentId);
        let studentRewards = [];
        await rewardRef.set(
            {studentId:applyRewardData.studentId,
             classId:applyRewardData.studentClass,
             englishName:studentData.data!.s_EngName,
             chineseName:studentData.data!.s_ChiName
            })

        //await rewardRef.update({reward:rewardArray})

        const storageUrl = "https://firebasestorage.googleapis.com/v0/b/ufyp-a18cf.appspot.com/o"
        const token =  uuidv4();
        //var [filesInBucket] = await bucket.getFiles({ prefix: applyRewardData.filePath });
        for (let i = 0; i < rewardArray.length; i++) {
            const reward = rewardArray[i];
            const file = files[i];
            //let studentRewardIn = [];
            const buffer = fs.readFileSync(file.path);
            let fileName = `${applyRewardData.filePath}/${reward.rewardNameEN}(${reward.rewardNameTC}).jpg`;
            let fileRef = bucket.file(`${fileName}`);
            const imageName = `${reward.rewardNameEN}(${reward.rewardNameTC}).jpg`;
            await fileRef.save(buffer, { metadata: { contentType: file.mimetype, metadata:{firebaseStorageDownloadTokens: token,} } });
            const url = `${storageUrl}/${encodeURIComponent(fileName)}?alt=media&token=${token}`
           
          
            await logMovement(applyRewardData.CurrentUserUid,applyRewardData.studentId,"add reward to student" +studentData.data!.s_ChiName+" reward image path is"+applyRewardData.filePath+" and file name is "+imageName);
            studentRewards.push({rewardNameEN:reward.rewardNameEN,rewardNameTC:reward.rewardNameTC,imageName:imageName,imageUrl:url});
        }
        
        await rewardRef.update({reward:studentRewards});
        return { success: true, message: "Upload Success"};
    } catch (error: any) {
        console.error(`Error uploading files to ${applyRewardData.filePath}:`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
};

export const editStudentReward = async (files:any,applyRewardData: applyRewardData, rewardArray: reward[]) => {
    try {
        const rewardRef = await db
            .collection("academicYear")
            .doc(applyRewardData.selectedYear)
            .collection("reward")
            .doc(applyRewardData.studentId);

        let studentRewards = [];
        const studentData = await findStudentById(applyRewardData.studentId);

        //await rewardRef.update({reward:rewardArray})

        const storageUrl = "https://firebasestorage.googleapis.com/v0/b/ufyp-a18cf.appspot.com/o"
        const token =  uuidv4();
        const folderName = `${applyRewardData.filePath}/`;
        const folderRef = bucket.file(folderName);
        const [folderExists] = await folderRef.exists();
        if (folderExists) {
            // Delete existing folder
            await bucket.deleteFiles({ prefix: folderName });
        }
        const folderMetadata = { contentType: 'application/x-www-form-urlencoded;charset=UTF-8' };
        await folderRef.save('', { metadata: folderMetadata });
        for (let i = 0; i < rewardArray.length; i++) {
            const reward = rewardArray[i];
            const file = files[i];
            const buffer = fs.readFileSync(file.path);
            let fileName = `${applyRewardData.filePath}/${reward.rewardNameEN}(${reward.rewardNameTC}).jpg`;
            let fileRef = bucket.file(`${fileName}`);
            const imageName = `${reward.rewardNameEN}(${reward.rewardNameTC}).jpg`;
            await fileRef.save(buffer, { metadata: { contentType: file.mimetype, metadata:{firebaseStorageDownloadTokens: token,} } });
            const url = `${storageUrl}/${encodeURIComponent(fileName)}?alt=media&token=${token}`
          
                      
            await logMovement(applyRewardData.CurrentUserUid,applyRewardData.studentId,"add reward to student" +studentData.data!.s_ChiName+" reward image path is"+applyRewardData.filePath+" and file name is "+imageName);
            studentRewards.push({rewardNameEN:reward.rewardNameEN,rewardNameTC:reward.rewardNameTC,imageName:imageName,imageUrl:url});
        }
        
        await rewardRef.update({reward:studentRewards});
        return { success: true, message: "Upload Success"};
    } catch (error: any) {
        console.error(`Error uploading files to ${applyRewardData.filePath}:`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
};


export const findStudentById = async (studentId: string) => {
    try {
      const studentQuery = db.collection("students").where("s_Id", "==", studentId);
      const studentSnapshot = await studentQuery.get();
      if (!studentSnapshot.empty) {
        const studentData = studentSnapshot.docs[0].data();
        return { success: true, data: studentData };
      } else {
        return { success: false, message: "Student not found" };
      }
    } catch (error: any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    }
};

export const getAllStudentReward = async (academicYear: string) => {
    try {
        const docRefs = await db
            .collection("academicYear")
            .doc(academicYear)
            .collection("reward")
            .get();
        const studentRewards: any[] = [];
        docRefs.docs.forEach((doc) => {
            const data = doc.data();
            studentRewards.push(data);  

        });
        
        return { success: true, data: studentRewards };
    } catch (error: any) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
};




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
  


export const getStudentRewardDetail = async (academicYear: string, studentID:string) => {
    try {
        const docRefs = await db
            .collection("academicYear")
            .doc(academicYear)
            .collection("reward")
            .doc(studentID)
            .get();
        const data = docRefs.data();
        
        return { success: true, data: data };
    } catch (error: any) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
};


export const addInterestClassForStudentDocument = async (data: interClassIdGroup[], applyInterestClassData: applyInterestClassData,) => {
  try {
    const interestClassForStudentCollection = db.collection(`academicYear/${applyInterestClassData.selectedYear}/interestClassForStudent`);
    const newDocumentRef = interestClassForStudentCollection.doc(applyInterestClassData.studentId);
    const studentData = await findStudentById(applyInterestClassData.studentId);
    let studentInterestClass=[];
    await newDocumentRef.set({
      studentId:applyInterestClassData.studentId,
      classId:applyInterestClassData.studentClass,
      englishName:studentData.data!.s_EngName,
      chineseName:studentData.data!.s_ChiName
    });

    for (let i = 0; i < data.length; i++) {    
      studentInterestClass.push({interestClassId:data[i].interestClassName});
    }

    await newDocumentRef.update({interestClass:studentInterestClass});

    return { success: true, message: "Interest class for student added successfully"};
  } catch (error: any) {
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};

export const editInterestClassForStudentDocument = async (data: interClassIdGroup[], applyInterestClassData: applyInterestClassData,) => {
  try {
    const interestClassForStudentCollection = db.collection(`academicYear/${applyInterestClassData.selectedYear}/interestClassForStudent`);
    const newDocumentRef = interestClassForStudentCollection.doc(applyInterestClassData.studentId);
    let studentInterestClass=[];


    for (let i = 0; i < data.length; i++) {    
      studentInterestClass.push({interestClassId:data[i].interestClassName});
    }

    await newDocumentRef.update({interestClass:studentInterestClass});

    return { success: true, message: "Interest class for student edit successfully"};
  } catch (error: any) {
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};