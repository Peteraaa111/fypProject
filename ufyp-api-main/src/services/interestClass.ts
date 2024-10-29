import { firestore as db} from "../utilities/Firebase";
import { auth } from "../utilities/Firebase";
import {
  interestClassModal,
  InterestClassDataOut,
} from "../models/interestClass";



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

export const getAllClassAndStudentInterest = async (yearSelect: string) => {
    try {
      const classCollection = db.collection(`academicYear/${yearSelect}/class/`);
      const classCollectionDocs = await classCollection.get();
      const interestClassStudentData = await getAllStudentInterestClass(yearSelect);
      
      const classesAndStudent: any[] = [];
      for (const classDoc of classCollectionDocs.docs) {
        const students: any[] = [];
        const classData = { class: classDoc.id, students:students};
        const classmateCollection = classDoc.ref.collection('classmate');
        const classmateDocs = await classmateCollection.get();
  
        for (const classmateDoc of classmateDocs.docs) {
          const studentData = classmateDoc.data();
          const studentId = studentData.studentId;
          const studentExists = interestClassStudentData.data!.some((interestClassStudent: any) => interestClassStudent.studentId === studentId);
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

export const getAllStudentInterestClass = async (academicYear: string) => {
    try {
        const docRefs = await db
            .collection("academicYear")
            .doc(academicYear)
            .collection("interestClassForStudent")
            .get();
        const studentInterestClass: any[] = [];
        docRefs.docs.forEach((doc) => {
            const data = doc.data();
            studentInterestClass.push(data);  
        });
        
        return { success: true, data: studentInterestClass };
    } catch (error: any) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
};

export const createInterestClassDocument = async (data: interestClassModal,selectedYear:string) => {
  try {
    const now = new Date();
    const interestClassForStudentCollection = db.collection(`academicYear/${selectedYear}/interestClassGroup`);
    const snapshot = await interestClassForStudentCollection.get();
    const count = snapshot.size;
    const hongKongTime = now.toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" });
    const newDocumentRef = interestClassForStudentCollection.doc();
    await newDocumentRef.set({
      titleEN: data.titleEN,
      titleTC: data.titleTC,
      startDateFrom: data.startDateFrom,
      startDateTo: data.startDateTo,
      validApplyDateFrom: data.validApplyDateFrom,
      validApplyDateTo: data.validApplyDateTo,
      startTime:data.startTime,
      endTime:data.endTime,
      weekDay: data.weekDay,
      status: 'A',
      id: "interestClass"+ (count + 1),
      createdAt: hongKongTime,
    });



    return { success: true, message: "Interest class created successfully", documentId: newDocumentRef.id };
  } catch (error: any) {
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};

export const getAllInterestClassGroup = async (year: string) => {
  try {
    const snapshot = await db.collection(`academicYear/${year}/interestClassGroup`).where('status', 'in', ['A', 'S']).get();
    const interestClassData: InterestClassDataOut[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as InterestClassDataOut;
      interestClassData.push(data);
    });
    return { success: true, data: interestClassData };
  } catch (error: any) {
    console.error(`Error`, error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};


export const editInterestClassDocument = async (data: interestClassModal,selectedYear:string) => {
  try {
    const interestClassForStudentCollection = db.collection(`academicYear/${selectedYear}/interestClassGroup`);
    const querySnapshot = await interestClassForStudentCollection.where('id', '==', data.id).get();
    const documentRef = querySnapshot.docs[0].ref;
    await documentRef.update(data);

    return { success: true, message: "Interest class updated successfully", documentId: documentRef.id };
  } catch (error: any) {
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};

export const editInterestClassStatus = async (status: string,selectedYear:string,id:string) => {
  try {
    const interestClassForStudentCollection = db.collection(`academicYear/${selectedYear}/interestClassGroup`);
    const querySnapshot = await interestClassForStudentCollection.where('id', '==', id).get();
    const documentRef = querySnapshot.docs[0].ref;
    await documentRef.update({status:status});
    
   // await documentRef.update(data);

    return { success: true, message: "Interest class updated successfully", documentId: documentRef.id };
  } catch (error: any) {
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};