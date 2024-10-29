import { firestore as db} from "../utilities/Firebase";
import { auth } from "../utilities/Firebase";
import {
    yearRankModal,
    distributeNextYearClassModal,
} from "../models/yearRank";
import { ConstantYear } from '../models/Constant';

export const createClass = async () => {
    try {
      const academicYearRef = db.collection('academicYear');
      const currentYear = ConstantYear.nextYear;
      const nextYear = currentYear + 1;
      const academicYearId = `${currentYear}-${nextYear}`;
      const classRef = academicYearRef.doc(academicYearId).collection('class');
  
      const classes = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'];
  
      // Check if the academic year document exists
      const academicYearDoc = await academicYearRef.doc(academicYearId).get();
  
      if (!academicYearDoc.exists) {
        // Create the academic year document
        await academicYearRef.doc(academicYearId).set({});
      }
  
      const batch = db.batch();
      classes.forEach(className => {
        const classInfo = classRef.doc(className);
        batch.set(classInfo, {});
      });
  
      await batch.commit();
  
      return { success: true, message: "All classes created successfully" };
    } catch (error:any) {
      console.error(error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }
};


export const getStudentRankByYear = async (yearSelectValue: string) => {
    try {
      const academicYearId = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
      const yearlyRankCollection = db.collection(`academicYear/${academicYearId}/yearlyRank`);
  
      const yearDocRef = await yearlyRankCollection.doc(`Year${yearSelectValue}`);
      const studentRankCollection = yearDocRef.collection('studentRank');
  
      const snapshot = await studentRankCollection.get();
  
      const data = snapshot.docs.map((doc) => doc.data());
  
      return { success: true, data };
    } catch (error: any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  };


export const generateRank = async (data: yearRankModal[], yearSelectValue: string) => {
    try {
      const academicYearId = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
      const yearlyRankCollection = db.collection(`academicYear/${academicYearId}/yearlyRank`);
  
      const yearDocRef = await yearlyRankCollection.doc(`Year${yearSelectValue}`);
      const studentRankCollection = yearDocRef.collection('studentRank');
  
      for (const item of data) {
        const docId = `Year${yearSelectValue}Rank${item.rank}`;
        await studentRankCollection.doc(docId).set(item);
      }
  
      return { success: true, message: 'Rank have been generated' };
    } catch (error: any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    }
};


export const distributeNextYearClass = async (data: distributeNextYearClassModal[]) => {
    try {
        const currentYear = ConstantYear.nextYear;
        const nextYear = currentYear + 1;
        const academicYearId = `${currentYear}-${nextYear}`;
        const classCollection = db.collection(`academicYear/${academicYearId}/class`);
  
        // Check if the classCollection is empty
        const classDocs = await classCollection.get();
        if (classDocs.empty) {
            console.log("testing");
            await createClass();
        }

        for (const item of data) {
            const studentDocIDResult = await findStudentDocId(item.studentID);
            if(studentDocIDResult.success){
                if(item.expectedClassID === "graduate"){
                    updateStudentData(item.studentID);
                }else{
                    const classRef = await classCollection.doc(item.expectedClassID)
                    const classmateCollection = classRef.collection('classmate');
                    const classmateDocs = await classmateCollection.get();
                    const totalDocs = classmateDocs.size+1;
                    await classmateCollection.doc(studentDocIDResult.id!).set({
                      classNumber:totalDocs,
                      studentId: item.studentID,
                      studentChiName: item.studentChiName,
                      studentEngName: item.studentEngName, 
                    });
                }
            }
        }
  
      return { success: true, message: 'class have been distribute for next year' };
    } catch (error: any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    }
};

const findStudentDocId = async (studentID: string) => {
    try {
      const studentsCollection = db.collection('students');
      const querySnapshot = await studentsCollection.where('s_Id', '==', studentID).get();
  
      if (querySnapshot.empty) {
        return { success: false, message: 'No matching documents found' };
      }
  
      const docId = querySnapshot.docs[0].id;
  
      return { success: true, id: docId };
    } catch (error: any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    }
};

const updateStudentData = async (studentID: string) => {
    try {
      const studentsCollection = db.collection('students');
      const querySnapshot = await studentsCollection.where('s_Id', '==', studentID).get();
  
      if (querySnapshot.empty) {
        return { success: false, message: 'No matching documents found' };
      }
  
      const studentDocSnapshot = querySnapshot.docs[0];
      const studentData = studentDocSnapshot.data();
  
      const currentYear = new Date().getFullYear();
      const graduateDate = new Date(currentYear, 6, 15); // July 15th of the current year
      const graduateDateString = graduateDate.toLocaleDateString('en-US');
      const updateData = {
        graduate: true,
        graduateDate: graduateDateString,
      };
  
      await studentDocSnapshot.ref.update(updateData);
  
      return { success: true, message: 'Student data updated successfully' };
    } catch (error: any) {
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
