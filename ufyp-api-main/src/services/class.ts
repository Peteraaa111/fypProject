import { firestore as db} from "../utilities/Firebase";
import { auth } from "../utilities/Firebase";
import { AddStudentToClassError } from "../models/Error";
import {
    ClassMateInfo,
    ClassHomeworkModal,
    ClassExamGradeModal,
    attendanceSubmitModal,
    ClassTeacherModal,
} from "../models/Class";
import fs from 'fs';
import axios from "axios";
import sharp from 'sharp';
import FormData from 'form-data';
import Jimp from 'jimp';
import { ConstantYear } from "../models/Constant";
import { getDeviceByUserID, sendNotificationWithAttribute } from "./notification";

export const createClass = async () => {
    try {
      const academicYearRef = db.collection('academicYear');
      const currentYear = new Date().getFullYear();
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
  

export const getAcademicYearWithClasses = async () => {
    try {  
      const academicYearSnapshot = await db.collection('academicYear').get();
  
      const academicYears = [];
  
      for (const academicYearDoc of academicYearSnapshot.docs) {
        const academicYearData = academicYearDoc.data();
        const academicYearId = academicYearDoc.id;
        const classSnapshot = await db
          .collection('academicYear')
          .doc(academicYearId)
          .collection('class')
          .get();
  
        const classes = classSnapshot.docs.map(classDoc => ({
          id: classDoc.id,
          data: classDoc.data(),
        }));
  
        const academicYear = {
          id: academicYearId,
          data: academicYearData,
          classes,
        };
  
        academicYears.push(academicYear);
      }
  
        return { success: true, data: academicYears };
    } catch (error: any) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
};
  

export const getClassmateByAcademicYearAndClass = async (year: string, classID:string ) => {
    try {  
        const classmateCollection = db.collection('academicYear').doc(year).collection('class').doc(classID).collection('classmate');
        const querySnapshot = await classmateCollection.get();
        const promises = querySnapshot.docs.map(async (doc) => {
            const classmateData = doc.data() as any; // Cast the data to the User interface
            return classmateData;
        });
        const classmates = await Promise.all(promises);
        return { success: true, data: classmates };
    } catch (error: any) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
};


export const getUnassignedStudents = async () => {
  try {
    // Get all student documents
    const studentDocsSnapshot = await db.collection('students').get();
    const studentIds = studentDocsSnapshot.docs.map((studentDoc) => studentDoc.id);

    // Get all classmate documents
    const classmateDocsSnapshot = await db.collectionGroup('classmate').get();
    const assignedStudentIds = classmateDocsSnapshot.docs.map((classmateDoc) => classmateDoc.id);
    const unassignedStudents = [];

    // Loop through student IDs and check if they are not in the assignedStudentIds array
    for (const studentId of studentIds) {
      if (!assignedStudentIds.includes(studentId)) {
        const studentDocSnapshot = studentDocsSnapshot.docs.find((studentDoc) => studentDoc.id === studentId);
        if (studentDocSnapshot) {
          unassignedStudents.push(studentDocSnapshot.data());
        }
      }
    }

    return { success: true, data: unassignedStudents };
  } catch (error:any) {
    console.error(error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};



export const getClassAndClassHomework = async () => {
  try {
    const yearlyData = [];

    const academicYearSnap = await db
      .collection('academicYear').get();

    for (const academicYearId of academicYearSnap.docs) {
      const academicYearid = academicYearId.id;
      const classSnapshot = await db
        .collection('academicYear')
        .doc(academicYearid)
        .collection('class')
        .get();

      const classesWithHomework = [];

      for (const classDoc of classSnapshot.docs) {
        const classId = classDoc.id;
        const homeworkSnapshot = await db
          .collection('academicYear')
          .doc(academicYearid)
          .collection('class')
          .doc(classId)
          .collection('homework')
          .get();

        const homework = homeworkSnapshot.docs.map(homeworkDoc => ({
          id: homeworkDoc.id,
          data: homeworkDoc.data(),
        }));

        const classWithHomework = {
          id: classId,
          homework,
        };

        classesWithHomework.push(classWithHomework);
      }

      const academicYearWithClasses = {
        year: academicYearid,
        classes: classesWithHomework,
      };

      yearlyData.push(academicYearWithClasses);
    }

    return { success: true, data: yearlyData };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};


export const addStudentsToClass = async (studentClassList:any,actorUid:String,academicYearValue:String) => {
  try {
    const classmateCollectionRef = db.collection(`academicYear/${academicYearValue}/class`);
    let classmateCountArray: { classId: string, number: number }[] = [];
    const batch = db.batch();
    for (const { sid, classId } of studentClassList) {
      // Check if the student already exists in the classmate collection
      const classmateCollectionRefForClass = classmateCollectionRef.doc(classId).collection('classmate');
      const querySnapshot = await classmateCollectionRefForClass.where('studentId', '==', sid).get();

      if (!querySnapshot.empty) {
        throw new AddStudentToClassError('The student is already added to the classmate collection.');
      }

      // Get the student data from the students collection
      const studentsCollectionRef = db.collection('students');
      const studentQuerySnapshot = await studentsCollectionRef.where('s_Id', '==', sid).get();

      if (studentQuerySnapshot.empty) {
        throw new AddStudentToClassError('Student data not found in the students collection.');
      }

      const studentDocSnapshot = studentQuerySnapshot.docs[0];
      const studentData = studentDocSnapshot.data();
      const studentDocId = studentDocSnapshot.id; // Retrieve the document ID of the student


      // const totalClassmateCountSnapshot = await classmateCollectionRefForClass.get();
      
      // if(!flag){
      //   number = totalClassmateCountSnapshot.size;
      //   flag = true;
      // }
      let currentClassNumber: number;
      const classmateCountObject = classmateCountArray.find((obj) => obj.classId === classId);
      if (classmateCountObject) {
        currentClassNumber = classmateCountObject.number + 1;
        classmateCountObject.number = currentClassNumber;
      } else {
        const totalClassmateCountSnapshot = await classmateCollectionRefForClass.get();
        const totalClassmateCount = totalClassmateCountSnapshot.size;
        currentClassNumber = totalClassmateCount + 1;
        classmateCountArray.push({ classId, number: currentClassNumber });
      }



      // Add the student to the classmate collection
      const classmateDocRef = classmateCollectionRefForClass.doc(studentDocId);
      batch.set(classmateDocRef, {
        studentId: sid,
        studentChiName: studentData.s_ChiName,
        studentEngName: studentData.s_EngName,
        classNumber: currentClassNumber,
      });

      //logMovement(actorUid,studentDocId,'add studentId '+sid + ' to class '+classId,)

    }

    await batch.commit();

    return { success: true, message: 'Students added to the classmate collection successfully.' };
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

export const redistributeClassNumber = async(classID:string,academicYearValue:string) => {
  try {

    const classmateCollectionRef = db
      .collection('academicYear')
      .doc(academicYearValue)
      .collection('class')
      .doc(classID)
      .collection('classmate');

    // Get all classmate documents for the given classID
    const querySnapshot = await classmateCollectionRef.get();

    // Sort the classmate documents based on the English name first letter
    const sortedClassmates = querySnapshot.docs.sort((a, b) => {
      const nameA = a.data().studentEngName.toUpperCase();
      const nameB = b.data().studentEngName.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    // Update the class number for each classmate document
    const batch = db.batch();
    sortedClassmates.forEach((doc, index) => {
      const updatedClassmateData = {
        classNumber: index + 1,
      };
      batch.update(doc.ref, updatedClassmateData);
    });

    // Commit the batched updates
    await batch.commit();

    return { success: true, message: 'Class numbers redistributed successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'An error occurred while redistributing class numbers.' };
  }
}


export const removeStudentFromClass = async (classId: string, studentId: string,academicYearValue:string) => {
  try {
    const classmateCollectionRef = db.collection(`academicYear/${academicYearValue}/class/${classId}/classmate`);

    const querySnapshot = await classmateCollectionRef.where('studentId', '==', studentId).get();
    
    if (!querySnapshot.empty) {
      const documentId = querySnapshot.docs[0].id;
      await classmateCollectionRef.doc(documentId).delete();
      return { success: true, message: "The student is removed from the class" };
    } else {
      return { success: false, message: "The student is not found in the classmate collection" };
    }
  } catch (error: any) {
    console.error(`Remove failed with studentID: ${studentId}`, error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};

// Create a new function for getting the class homework
export const getClassHomework = async (classID: string, year:string ) => {
  try {  

      const classHomeworkCollection = db.collection(`academicYear/${year}/class/${classID}/homework/`);
      const querySnapshot = await classHomeworkCollection.get();
      console.log(querySnapshot.size); // log the number of documents in the collection
      const classHomework:any[] = [];
  
      querySnapshot.forEach(doc => {
        const homework = {
          id: doc.id,
          data: doc.data(),
        };
        console.log(homework);
        classHomework.push(homework);
      });
  
      if (classHomework.length > 0) {
        return { success: true, data: classHomework };
      } else {
        return { success: false, message: 'Homework not found' };
      }

  } catch (error: any) {
      console.error(error);
      return { success: false, message: `${error.name}: ${error.message}` };
  }
};

export const editHomework = async (classID: string, date:string, editdata:ClassHomeworkModal,academicYearId:string) => {
  try {  
      const classHomeworkCollection = db.collection(`academicYear/${academicYearId}/class/${classID}/homework/`);
      const querySnapshot = await classHomeworkCollection.doc(date).get();


      // Update the document data with the editdata parameter
      if (querySnapshot.exists) {
        await classHomeworkCollection.doc(date).set(editdata);
        return { success: true, message: "Homework updated successfully." };
      } else {
        return { success: false, message: "Homework not found." };
      }

  } catch (error: any) {
      console.error(error);
      return { success: false, message: `${error.name}: ${error.message}` };
  }
};

// create a new function to get all the doc id from class and add into grade collection doc sub collection, and these collection is a sub collection of academic year
export const addClassToGrade = async () => {
  try {  
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const academicYearId = `${currentYear}-${nextYear}`;
    const classCollection = db.collection(`academicYear/${academicYearId}/class`);
    const querySnapshot = await classCollection.get();
    
    if (!querySnapshot.empty) {
      const classList: any[] = [];
      querySnapshot.forEach((doc) => {
        classList.push({ id: doc.id, ...doc.data() });
      });

      const gradeCollection = db.collection(`academicYear/${academicYearId}/grade`);

      const firstHalfTermDocRef = gradeCollection.doc("firstHalfTerm");
      const secondHalfTermDocRef = gradeCollection.doc("secondHalfTerm");
      await firstHalfTermDocRef.set({});
      await secondHalfTermDocRef.set({});

      const gradeQuerySnapshot = await gradeCollection.get();
      if (!gradeQuerySnapshot.empty) {
        gradeQuerySnapshot.forEach((doc) => {
          const gradeId = doc.id;
          classList.forEach((classItem) => {
            const classId = classItem.id;
            //const classData = classItem;
            const classRef = db.collection(`academicYear/${academicYearId}/grade/${gradeId}/class`);
            const classDocRef = classRef.doc(classId);
            classDocRef.set({});
            //classDocRef.set(classData);
          });
        });
      }
      return { success: true, message: 'Class added to grade successfully.' };
    } else {
      return { success: false, message: 'Class not found' };
    }
  } catch (error: any) {
      console.error(error);
      return { success: false, message: `${error.name}: ${error.message}` };
  }
}

export const getNoGradeStudentInClass = async (yearSelector:string,gradeDate: string, classID: string) => {
  try {
    const classStudentCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/classmate`);
    const gradeCollection = db.collection(`academicYear/${yearSelector}/grade/${gradeDate}/class/${classID}/classmate`);

    // Get all the documents from the classmate collection
    const classmateDocsSnapshot = await classStudentCollection.get();
    const unassignedStudents = [];

    // Get all the document IDs from the grade collection
    const gradeDocsSnapshot = await gradeCollection.get();
    const gradeIds = gradeDocsSnapshot.docs.map((doc) => doc.id);

    // Loop through the classmate documents and check if they are not in the grade IDs array
    for (const doc of classmateDocsSnapshot.docs) {
      const classmateId = doc.id;
      const classmateData = doc.data();
      if (!classmateData) {
        continue;
      }

      if (!gradeIds.includes(classmateId)) {
        unassignedStudents.push({ classmateId, ...classmateData });
      }
    }

    return { success: true, data: unassignedStudents };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};


export const addClassExamGrade = async (classID: string, year:string,gradeDate: string, data: ClassExamGradeModal[],actorUid:String) => {
  try {
    const classCollection = db.collection(`academicYear/${year}/class/${classID}/classmate`);
    const gradeClassCollection = db.collection(`academicYear/${year}/grade/${gradeDate}/class/`);
    const classDocRef = gradeClassCollection.doc(classID);
    const classGradeCollectionRef = classDocRef.collection('classmate');
    // const classmateData = classmateDocs.docs.map(doc => doc.data());
    let titleTC:any,titleEN:any, contentTC:any,contentEN:any;
    if(gradeDate==='firstHalfTerm'){
      titleTC = "上學期";
      contentTC = "上學期成績已派發，請查閱";
      titleEN= "First Half Term";
      contentEN="First Half Term grade has been issued, please check";
    }else{
      titleTC = "下學期";
      contentTC = "下學期成績已派發，請查閱";
      titleEN= "Second Half Term";
      contentEN="Second Half Term grade has been issued, please check";
    }

    data.forEach(async (item) => {
      console.log(item);
      const querySnapshot = await classCollection.where('classNumber', '==', Number(item.classNumber)).get();
      const classmateData = querySnapshot.docs[0].data();
      const markDocRef = classGradeCollectionRef.doc(item.docID);
      markDocRef.set({
        chi: item.chi,
        eng: item.eng,
        gs: item.gs,
        math: item.math, 
        ...classmateData,
      });
      logMovement(actorUid,item.docID,'add student '+classmateData.studentChiName + ' garde',)
      


      let deviceData:any;
      let title, content;
      deviceData = await getDeviceByUserID(classmateData.studentId);
      console.log(deviceData);
      if(deviceData.data){
        if (deviceData.data.languageCode === 'zh') {
          title = titleTC;
          content = contentTC;
        } else {
          title = titleEN;
          content = contentEN;  
        }
        await sendNotificationWithAttribute(title,content,deviceData.data.deviceID,"Exam");
      }



    });

    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};
  
export const getAllDocumentsInCollection = async (yearSelector:string,gradeDate: string, classID: string) => {
  try {
    const collectionRef = db.collection(`academicYear/${yearSelector}/grade/${gradeDate}/class/${classID}/classmate`);
    const snapshot = await collectionRef.get();
    const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return { success: true, data: documents };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};

export const editExam = async (classID: string,year:string,date:string, editdata:ClassExamGradeModal) => {
  try {  
      const stduentExamMarkCollection = db.collection(`academicYear/${year}/grade/${date}/class/${classID}/classmate`);
      const querySnapshot = await stduentExamMarkCollection.doc(editdata.docID).get();

      if (querySnapshot.exists) {
        const { chi, eng, math, gs } = editdata;
        await stduentExamMarkCollection.doc(editdata.docID).update({ chi, eng, math, gs });
        return { success: true, message: "Exam Mark updated successfully." };
      } else {
        return { success: false, message: "Exam Mark not found." };
      }

  } catch (error: any) {
      console.error(error);
      return { success: false, message: `${error.name}: ${error.message}` };
  }
};

export const getAttendanceDateInfo = async (classNumber:string, year: string, classID:string, attendanceDate:string) => {
  try {  
    const studentAttendanceListCollection = db.doc(`academicYear/${year}/class/${classID}/attendance/${attendanceDate}/studentAttendanceList/${classNumber}`);
    const studentAttendanceListDoc = await studentAttendanceListCollection.get();
    if (studentAttendanceListDoc.exists) {
      const data = {
        status:studentAttendanceListDoc.get('status'),
        takeAttendanceTime:studentAttendanceListDoc.get('takeAttendanceTime'),
      }
      console.log(data);
     // const data = studentAttendanceListDoc.data();
      return { success: true, message: 'Data found', data:{status: data?.status, takeAttendanceTime: data?.takeAttendanceTime} };
    } else {
      return { success: true, data:{status: "NM", takeAttendanceTime:"NM"} };
    }
  } catch (error: any) {
      console.error(error);
      return { success: false, message: `${error.name}: ${error.message}` };
  }
};


export const submitAttendance = async (data:attendanceSubmitModal[],year: string, classID:string, attendanceDate:string) => {
  try {  
    const attendanceDateDocRef = db.doc(`academicYear/${year}/class/${classID}/attendance/${attendanceDate}`);

    const newCollectionRef = attendanceDateDocRef.collection('studentAttendanceList');
    const now = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });
    for (let i = 0; i < data.length; i++) {
      const newData = {
        classNumber: data[i].classNumber.toString(),
        studentChiName:data[i].studentChiName,
        studentEngName:data[i].studentEngName,
        status: data[i].selectedValue,
        studentNumber: data[i].studentNumber,
        takeAttendanceTime: now
      };
      await newCollectionRef.doc(data[i].classNumber.toString()).set(newData);  
    }


    return { success: true, message: "The attendance has been taken" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};

export const getWholeYearClassGrade = async (yearSelect: string) => {
  try {
    const currentYear = 2023;
    const nextYear = currentYear + 1;
    const academicYearId = `${currentYear}-${nextYear}`;
    const classArray = ['A', 'B'];
    const collections = [];
    const studentData: any = [];

    // Loop through the class array and generate the class IDs
    for (let i = 0; i < classArray.length; i++) {
      const classID = yearSelect + classArray[i];
      const collection = db.collection(`academicYear/${academicYearId}/grade/firstHalfTerm/class/${classID}/classmate`);
      collections.push(collection);
    }

    // Use batched reads to retrieve all documents in the collections
    const snapshots = await Promise.all(collections.map((collection) => collection.get()));

    // Extract the document data from each snapshot and add it to the studentData array
    snapshots.forEach((snapshot, index) => {
      const classID = yearSelect + classArray[index];
      snapshot.forEach((doc) => {
        studentData.push({ classID: classID, ...doc.data() });
      });
    });

    // Loop through the class array and generate the class IDs for the second term
    for (let i = 0; i < classArray.length; i++) {
      const classID = yearSelect + classArray[i];
      const collection = db.collection(`academicYear/${academicYearId}/grade/secondHalfTerm/class/${classID}/classmate`);
      const snapshot = await collection.get();
      snapshot.forEach((doc) => {
        const { chi, eng, gs, math, studentId } = doc.data();
        const studentObject = { term: 'secondTerm', classID: classID, secondTermChi: chi, secondTermEng: eng, secondTermGs: gs, secondTermMath: math, studentId: studentId };
        const existingStudentIndex = studentData.findIndex((student:any) => student.studentId === studentId);
        if (existingStudentIndex !== -1) {
          studentData[existingStudentIndex] = { ...studentData[existingStudentIndex], ...studentObject };
        } else {
          studentData.push(studentObject);
        }
      });
    }

    return { success: true, studentData: studentData };
  } catch (error:any) {
    console.error(error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
}

export const uploadHomeworkImage = async (files: any,classId:string,selectedYear:string,dateWork:string) => {
  try {

    const boundingBoxes:any = [];
    const pathModule = require('path');
    for (const file of files) {
      const { originalname, path: tempPath } = file;
      const targetPath = pathModule.join(__dirname, '../../', 'assets', originalname);
      // Move the file to the assets folder
      await fs.promises.rename(tempPath, targetPath);

      // Get image dimensions
      let { width = 0 , height = 0} = await sharp(targetPath).metadata();
        // Cut the image into 5 parts
        const image = sharp(targetPath);
 
        const partHeight = 162;
        for (let i = 0; i < 5; i++) {
          const image = sharp(targetPath);
          const partPath = pathModule.join(__dirname, '../../', 'assets', `part${i}.jpg`);
          await image.extract({ left: 75, top: i * partHeight, width:480, height: partHeight }).toFile(partPath);

          // Call OCR API 
          const formData = new FormData();
          formData.append('show_original_response', 'false');
          formData.append('fallback_providers', "");
          formData.append("providers", "google");
          formData.append('language', 'zh');
          formData.append('file', fs.createReadStream(partPath));
          console.log(formData); 
          const options = {
            method: "POST",
            url: "https://api.edenai.run/v2/ocr/ocr",
            headers: {
              Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYzBlMTc0NmItMjU0MS00Yzc4LTkzZGYtZjQ3ZWQwOTJiOThhIiwidHlwZSI6ImFwaV90b2tlbiJ9.u9XuHYV1nNdAckiGVcDhwoKqTdKATL05H27d-KR46m0",
              "Content-Type": "multipart/form-data; boundary=" + formData.getBoundary(),
            },
            data: formData,
          };


          const response = await axios.request(options);
          boundingBoxes.push(response.data);
        }

        let workData: any = {
          chi: '',
          eng: '',
          math: '',
          gs: '',
          other: '',
          id: dateWork,
        };

        for (let i = 0; i < boundingBoxes.length; i++) {
          const boundingBox = boundingBoxes[i].google;
          console.log(boundingBox);
          if (i === 0) {
            workData.chi = boundingBox.text;
          } else if (i === 1) {
            workData.eng = boundingBox.text;
          } else if (i === 2) {
            workData.math = boundingBox.text;
          } else if (i === 3) {
            workData.gs = boundingBox.text;
          } else if (i === 4) {
            workData.other = boundingBox.text;
          }
        }

        const homeworkCollection = db.collection(`academicYear/${selectedYear}/class/${classId}/homework`);
        await homeworkCollection.doc(dateWork).set(workData)

    }

    return { success: true, message: 'Upload Success'};
  } catch (error: any) {
    console.error(`Error uploading files`, error);
    return { success: false, message: `${error.name}: ${error.message}` };
  } 
};


export const getAllClassTeachers = async (yearSelector:string) => {
  try {
    const classCollection = db.collection(`academicYear/${yearSelector}/class`);
    const querySnapshot = await classCollection.get();
    const documents:any = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (Object.keys(data).length !== 0) {
        documents.push({ id: doc.id, ...data });
      };
    });

    return { success: true, data: documents };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};

export const getNotAssignTeacher = async (yearSelector:string) => {
  try {
    const classCollection = db.collection(`teachers`);
    const selectedYearClassTeacher = await getAllClassTeachers(yearSelector);
    const querySnapshot = await classCollection.get();
    const documents:any = [];
    const notAssignTeacher:any = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
        documents.push({ id: doc.id, ...data });
        const t_Id = selectedYearClassTeacher.data.find((classTeacher:any) => classTeacher.t_Id === data.t_Id);
        if (!t_Id) {
          notAssignTeacher.push(data);
        }
    });

    return { success: true, data: notAssignTeacher };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};

export const addTeachersToClass = async (yearSelector:string,classTeachers:ClassTeacherModal[],actorUid:string) => {
  try {
    const classCollection = db.collection(`academicYear/${yearSelector}/class`);

    for (const classTeacher of classTeachers) {
      const classDoc = await classCollection.doc(classTeacher.classId).get();
      if (classDoc.exists) {
          const updatedClassData = {
            t_ChiName:classTeacher.t_ChiName,
            t_EngName:classTeacher.t_EngName,
            t_Id: classTeacher.t_Id
          };
          await classCollection.doc(classTeacher.classId).update(updatedClassData);
          await logMovement(actorUid,classTeacher.t_Id,"add teacher to class "+classTeacher.classId);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};

export const deleteTeacherInClass = async (yearSelector: string, classId: string) => {
  try {
    const classCollection = db.collection(`academicYear/${yearSelector}/class`);
    const classDoc = await classCollection.doc(classId).get();
    if (classDoc.exists) {
      await classCollection.doc(classId).set({});
      return { success: true };
    } else {
      return { success: false, message: `Class document with ID ${classId} does not exist.` };
    }
  } catch (error: any) {
    console.error(error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};

export const deleteHomeworkInClass = async (homeworkId:string,yearSelector: string, classId: string) => {
  try {
    const homeworkCollection = db.collection(`academicYear/${yearSelector}/class/${classId}/homework`);
    const homeworkDoc = await homeworkCollection.doc(homeworkId).get();
    if (homeworkDoc.exists) {
      await homeworkCollection.doc(homeworkId).delete();
      return { success: true };
    } else {
      return { success: false, message: `Homework document with ID ${homeworkId} does not exist.` };
    }
  } catch (error: any) {
    console.error(error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};

export const addClassTimeTable = async (data:any, classId:string) => {
  try {
    const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
    const classTimeTableCollection = db.collection(`academicYear/${yearSelector}/class/${classId}/classTimeTable`);

    // Convert the timetable object into an array
    const timetableArray = Object.entries(data).map(([day, times]) => ({
      day,
      times
    }));

    //await classCollection.doc().set(data);
    await classTimeTableCollection.doc("TimeTable").set({ timetable: timetableArray });
    return { success: true};
  } catch (error: any) {
    console.error(error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
}

export const getClassTimeTable = async (classId: string) => {
  try {
    const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
    const classTimeTableCollection = db.collection(`academicYear/${yearSelector}/class/${classId}/classTimeTable`);
    let haveData = false;
    const snapshot = await classTimeTableCollection.get();

    if (snapshot.empty) {
      return { success: true, haveData:haveData};
    }  
    haveData = true;
    let timetableArray:any[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.timetable) {
        timetableArray = timetableArray.concat(data.timetable);
      }
    });

    return { success: true, data: timetableArray, haveData:haveData};
  } catch (error: any) {
    console.error(error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
}