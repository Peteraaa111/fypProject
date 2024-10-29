import { ConstantYear } from "../models/Constant";
import { firestore as db} from "../utilities/Firebase";
import {
  attendanceSubmitModal, homeworkModal,
} from "../models/teacherFunction";
import { auth } from "../utilities/Firebase";
import sharp from "sharp";
import fs from 'fs';
import FormData from 'form-data';
import axios from "axios";
import path from 'path';
// import { 

// } from '../models/pushNotification'

export const addNotification = async (contentTC:string, contentEN:string,titleTC:string,titleEN:string) => {
    try {
      const notificationCollection = db.collection(`notification`);
      
      const snapshot = await notificationCollection.get();
      const id = snapshot.size + 1;

      await notificationCollection.add({
        id: id,
        titleTC:titleTC,
        titleEN:titleEN,
        contentTC: contentTC,
        contentEN: contentEN,
      });

      return { success: true, message: "Add notification success" };
    } catch (error: any) {
      console.error(error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }
};


const getStudentClassID = async (studentId:string,classID:string) => {
  const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
  const classmateCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/classmate/`);
  const classmateDoc = await classmateCollection.where('studentId','==',studentId).get()

  if(classmateDoc.docs[0]){
    let classNumber = classmateDoc.docs[0].get('classNumber');
    console.log("have");
    return classNumber.toString();
  }

}

export const submitAttendanceList = async (data:attendanceSubmitModal[], classID:string, attendanceDate:string) => {
  try {  
    const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
    const attendanceDateDocRef = db.doc(`academicYear/${yearSelector}/class/${classID}/attendance/${attendanceDate}`);



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
      let studentClassNumber = await getStudentClassID(data[i].studentNumber,classID);
      const newData = {
        classNumber: studentClassNumber.toString(),
        studentChiName:data[i].studentChiName,
        studentEngName:data[i].studentEngName,
        status: data[i].status,
        studentNumber: data[i].studentNumber,
        takeAttendanceTime: now
      };
      await newCollectionRef.doc(studentClassNumber.toString()).set(newData);  
    }


    return { success: true, message: "The attendance has been taken" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};

export const getClassmateData = async (classID: string) => {
  try {
      const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
      const classmateCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/classmate/`);  
      const classmateDoc = await classmateCollection.get();
      let classStudent:any =[];


      classmateDoc.forEach((doc) => {
        const data = {
          "studentId":  doc.get("studentId"),
          "studentChiName": doc.get("studentChiName"),
          "studentEngName": doc.get("studentEngName"),
        }
        
        classStudent.push(data);
      });

      
      return { success: true, data: classStudent};
  } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
  }
};

export const getClassAttendance = async (classID: string,getClassAttendance:string) => {
  try {
      const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
      const classAttendanceCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/attendance/${getClassAttendance}/studentAttendanceList/`);  
      const classAttendanceDoc = await classAttendanceCollection.get();
      let attendanceData:any =[];

      classAttendanceDoc.forEach((doc) => {
        const data = {
          "status":  doc.get("status"),
          "studentNumber": doc.get("studentNumber"),
        }
        attendanceData.push(data);


      });

      
      return { success: true, data: attendanceData};
  } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
  }
};


export const uploadImageForHomework = async (files: any,selectedDate:string) => {
  try {
    const boundingBoxes:any = [];
    const pathModule = require('path');
    
    let workData: any = {
      chi: '',
      eng: '',
      math: '',
      gs: '',
      other: '',
      id:selectedDate,
    };

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
    }

    return { success: true, message: 'Upload Success', data:workData};
  } catch (error: any) {
    console.error(`Error uploading files`, error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};

export const createHomeworkForClass = async (classId:string,workData:homeworkModal) => {
  try {
    const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;

    const homeworkCollection = db.collection(`academicYear/${yearSelector}/class/${classId}/homework`);
    await homeworkCollection.doc(workData.id.toString()).set(workData)


    
    return { success: true,message: `Create successfully`};
  } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
  }
}

export const checkDateHomeworkExist = async (classId:string,selectedDate:string) => {
  try {
    const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;

    const homeworkCollection = db.collection(`academicYear/${yearSelector}/class/${classId}/homework`);
    const snapshot = await homeworkCollection.doc(selectedDate).get();

    if (snapshot.exists) {
      return { success:true, exist: true, message: `Homework already exists`};
    } else {
      return { success:true, exist: false, message: `Homework does not exist`};
    }

  } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
  }
}

export const getTheHomeworkData = async (classId:string,selectedDate:string) => {
  try {
    const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;

    const homeworkCollection = db.collection(`academicYear/${yearSelector}/class/${classId}/homework`);
    const snapshot = await homeworkCollection.doc(selectedDate).get();

    const filePath = path.join(__dirname, '../../', 'assets', selectedDate+".png");
    const fileContents = fs.readFileSync(filePath);


    return { success:true, exist: true, data: snapshot.data(),fileContents: fileContents, message: `Get homework data successfully`};
    //return { success:true, exist: true, fileContents: fileContents, message: `Get homework data successfully`};
  } catch (error: any) {
    console.error(`Error`, error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
}



export const editHomeworkForClass = async (classId:string,workData:homeworkModal) => {
  try {
    const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;

    const homeworkCollection = db.collection(`academicYear/${yearSelector}/class/${classId}/homework`);
    await homeworkCollection.doc(workData.id.toString()).update(workData)


    
    return { success: true,message: `edit successfully`};
  } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
  }
}


export const getStudentFirstHalfGrade = async (classId:string) => {
  try {
    const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
    let data:any=[];
    let haveData=false;
    const classmateCollection = db.collection(`academicYear/${yearSelector}/grade/firstHalfTerm/class/${classId}/classmate`);
    const classmateDoc = await classmateCollection.get();
    classmateDoc.forEach(doc => {
      data.push({
        chi: doc.get('chi'),
        math: doc.get('math'),
        gs: doc.get('gs'),
        eng: doc.get('eng'),
        studentChiName: doc.get('studentChiName'),
        studentEngName: doc.get('studentEngName'),
      });
    });


    haveData = data.length > 0;

    return { success: true, data:data,haveData:haveData };
  } catch (error:any) {
    return { success: false, message: `${error.name}: ${error.message}` };
  }
}

export const getStudentSecondHalfGrade = async (classId:string) => {
  try {
    const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
    let data:any=[];
    let haveData=false;
    const classmateCollection = db.collection(`academicYear/${yearSelector}/grade/secondHalfTerm/class/${classId}/classmate`);
    const classmateDoc = await classmateCollection.get();
    classmateDoc.forEach(doc => {
      data.push({
        chi: doc.get('chi'),
        math: doc.get('math'),
        gs: doc.get('gs'),
        eng: doc.get('eng'),
        studentChiName: doc.get('studentChiName'),
        studentEngName: doc.get('studentEngName'),
      });
    });


    haveData = data.length > 0;

    return { success: true, data:data,haveData:haveData };
  } catch (error:any) {
    return { success: false, message: `${error.name}: ${error.message}` };
  }
}


export const submitClassSeatingTable = async (classID:string, classTable: any) => {
  try {
    const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
    const classCollection = db.collection(`academicYear/${yearSelector}/class/`);
    const classDoc = await classCollection.doc(classID.toString());
    await classDoc.set({ classTable: classTable }, { merge: true });

    return { success: true, message: "Submit class seating table success" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};

export const getClassSeatingTable = async (classID: string) => {
  try {
    const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
    const classCollection = db.collection(`academicYear/${yearSelector}/class/`);
    const classDoc = await classCollection.doc(classID.toString()).get();

    if (!classDoc.exists) {
      return { success: false, message: "Class document does not exist" };
    }

    const classTable = classDoc.data()?.classTable;

    if (!classTable) {
      return { success: false, message: "Class table does not exist" };
    }

    return { success: true, classTable: classTable };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};