import { firestore as db} from "../utilities/Firebase";
import { 
    replySlipInformationModal,
    distributionReplySlipModal,
} from '../models/replySlip';
import { getDeviceByUserID, sendNotificationWithAttribute } from "./notification";
 
export const getReplySlip = async (yearSelect:string) => {
    try {
        const replySlipCollection = db.collection(`academicYear/${yearSelect}/replySlip/`);
        const docRefs = await replySlipCollection.get();
        const replySlips: any[] = [];
        docRefs.docs.forEach((doc) => {
            const data = doc.data();
            const replySlip = { id: doc.id, ...data };
            replySlips.push(replySlip);  

        });
        return { success: true, data: replySlips };
    } catch (error: any) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
};

export const addReplySlip = async (data:replySlipInformationModal) => {
    try {
        const replySlipCollection = db.collection(`academicYear/${data.yearSelect}/replySlip/`);
        const now = new Date();
        const formattedDate = now.toISOString().substring(0, 10);
        var numberGet;
        replySlipCollection.get().then((querySnapshot) => {
            const newDocNumber = querySnapshot.size + 1;
            let newDoc:any = {
                id: (newDocNumber).toString(),
                titleTC: data.titleTC,
                titleEN: data.titleEN,
                mainContentTC: data.mainContentTC,
                mainContentEN: data.mainContentEN,
                recipientContentTC:data.recipientContentTC,
                recipientContentEN:data.recipientContentEN,
                payment:data.payment,
                //recipient:data.recipient,
                creationDate: formattedDate,
                status: "UD",
            };
            if(data.payment){
              newDoc.paymentAmount = data.paymentAmount; 
            }
            replySlipCollection.doc(newDocNumber.toString()).set(newDoc);
            numberGet = newDocNumber.toString();
        });
        return { success: true, message: "Reply slip add success",resultid:numberGet};
    }catch (error: any) {
        console.error(`Error adding activity`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
}

export const editReplySlip = async (dataID: string, data: replySlipInformationModal) => {
    try {
      const replySlipCollection = db.collection(`academicYear/${data.yearSelect}/replySlip/`);
      const replySlipDoc = replySlipCollection.doc(dataID);
      const now = new Date();
      const formattedDate = now.toISOString().substring(0, 10);
      let updatedData:any = {
        titleTC: data.titleTC,
        titleEN: data.titleEN,
        mainContentTC: data.mainContentTC,
        mainContentEN: data.mainContentEN,
        recipientContentTC: data.recipientContentTC,
        recipientContentEN: data.recipientContentEN,
        payment:data.payment,
        creationDate: formattedDate,
      };
      if(data.payment){
        updatedData.paymentAmount = data.paymentAmount; 
      }
      await replySlipDoc.update(updatedData);
      return { success: true, message: "Reply slip edit success" };
    } catch (error: any) {
      console.error(`Error editing reply slip`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }
};

export const deleteReplySlip = async (dataID: string, yearSelect: string) => {
    try {
      const replySlipCollection = db.collection(`academicYear/${yearSelect}/replySlip/`);
      const replySlipDoc = replySlipCollection.doc(dataID);
      await replySlipDoc.delete();
      return { success: true, message: "Reply slip deleted successfully" };
    } catch (error: any) {
      console.error(`Error deleting reply slip`, error);
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

export const distributionReplySlip = async (data: distributionReplySlipModal) => {
  try{

    if(data.selectOption === "selectAll"){
      const classCollection = db.collection(`academicYear/${data.yearSelect}/class/`);
      const classCollectionDocs = await classCollection.get();
      const now = new Date();
      const formattedDate = now.toISOString().substring(0, 10);
      classCollectionDocs.forEach(async (classDoc) => {
        
        const classmateCollection = classDoc.ref.collection('classmate');
        const classmateDocs = await classmateCollection.get();
        classmateDocs.forEach(async (classmateDoc) => {
          const replySlipGotCollection = classmateDoc.ref.collection('replySlipGot');
          const query = replySlipGotCollection.where('replySlipID', '==', data.id);
          const querySnapshot = await query.get();

          if (querySnapshot.empty) {
            await replySlipGotCollection.doc().set({
              replySlipID: data.id,
              read: "NR",
              submit:"NS",
              gotDate: formattedDate,
            });

          } else {
            console.log(`Classmate ${classmateDoc.id} already has a reply slip with ID ${data.id}.`);
          }
        });
      });
      const replySlipDocRef = db.collection(`academicYear/${data.yearSelect}/replySlip`).doc(data.id);
      await replySlipDocRef.update({ status: "D" });
    }else if (data.selectOption === "selectClass") {
      const classCollection = db.collection(`academicYear/${data.yearSelect}/class/`);
      const classCollectionDocs = await classCollection.get();
      const now = new Date();
      const formattedDate = now.toISOString().substring(0, 10);
    
      classCollectionDocs.forEach(async (classDoc) => {
        if (data.classSelectedOptions.includes(classDoc.id)) {
          const classmateCollection = classDoc.ref.collection('classmate');
          const classmateDocs = await classmateCollection.get();
          classmateDocs.forEach(async (classmateDoc) => {
            const replySlipGotCollection = classmateDoc.ref.collection('replySlipGot');
            const query = replySlipGotCollection.where('replySlipID', '==', data.id);
            const querySnapshot = await query.get();
    
            if (querySnapshot.empty) {
              await replySlipGotCollection.doc().set({
                replySlipID: data.id,
                read: "NR",
                submit: "NS",
                gotDate: formattedDate,
              });
            } else {
              console.log(`Classmate ${classmateDoc.id} already has a reply slip with ID ${data.id}.`);
            }
          });
          const replySlipDocRef = db.collection(`academicYear/${data.yearSelect}/replySlip`).doc(data.id);
          await replySlipDocRef.update({ status: "D" });
        }
      });
    }else if(data.selectOption === "selectStudent"){
      const classCollection = db.collection(`academicYear/${data.yearSelect}/class/`);
      const classCollectionDocs = await classCollection.get();
      const now = new Date();
      const formattedDate = now.toISOString().substring(0, 10);
    
      for (const student of data.studentSelectedOptions) {
        const classDoc = classCollection.doc(student.class);
        const classmateCollection = classDoc.collection('classmate');
        const query = classmateCollection.where('studentId', '==', student.studentID);
        const querySnapshot = await query.get();
    
        if (!querySnapshot.empty) {
          const classmateDoc = querySnapshot.docs[0];
          const replySlipGotCollection = classmateDoc.ref.collection('replySlipGot');
          const querReplyslip = replySlipGotCollection.where('replySlipID', '==', data.id);
          const queryReplySlipSnapshot = await querReplyslip.get();
    
          if (queryReplySlipSnapshot.empty) {
            let deviceData:any;
            let title, content;

            await replySlipGotCollection.doc().set({
              replySlipID: data.id,
              read: "NR",
              submit: "NS",
              gotDate: formattedDate,
            });
            deviceData = await getDeviceByUserID(student.studentID);
            console.log(deviceData);
            if (deviceData.data.languageCode === 'zh') {
              title = "有新通告已發放";
              content = "通告"+data.id+"已發放，請查閱";
            } else {
              title = "New notice has been issued";
              content = "ReplySlip number"+data.id+" has been issued, please check";
            }
            await sendNotificationWithAttribute(title,content,deviceData.data.deviceID,"ReplySlip");
          } else {
            console.log(`Student ${student.studentID} in class ${student.class} already has a reply slip with ID ${data.id}.`);
          }
        } else {
          console.log(`Student ${student.studentID} in class ${student.class} does not exist.`);
        }
      }
    
      const replySlipDocRef = db.collection(`academicYear/${data.yearSelect}/replySlip`).doc(data.id);
      await replySlipDocRef.update({ status: "D" });
    }


    return { success: true, message: "distribution successful" };
  }catch (error: any) {
    return { success: false, message: `${error.name}: ${error.message}` };
  } 
}



export const getAllClass = async (yearSelect:string) => {
  try{
    const classCollection = db.collection(`academicYear/${yearSelect}/class/`);
    const classCollectionDocs = await classCollection.get();
    const classes: any[] = [];
    classCollectionDocs.docs.forEach((doc) => {
      const classid = { id: doc.id };
      classes.push(classid);  

  });
    return { success: true, data:classes };
  }catch (error: any) {
    return { success: false, message: `${error.name}: ${error.message}` };
  } 
}


export const getAllClassAndStudent = async (yearSelect: string) => {
  try {
    const classCollection = db.collection(`academicYear/${yearSelect}/class/`);
    const classCollectionDocs = await classCollection.get();
    const classesAndStudent: any[] = [];
    for (const classDoc of classCollectionDocs.docs) {
      const students: any[] = [];
      const classData = { class: classDoc.id, students:students};
      const classmateCollection = classDoc.ref.collection('classmate');
      const classmateDocs = await classmateCollection.get();

      for (const classmateDoc of classmateDocs.docs) {
        const studentData = classmateDoc.data();
        students.push(studentData);
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

export const getNumStudentsWithReplySlip = async (yearSelect: string, replySlipId: string) => {
  let numStudentsWithReplySlip = 0;
  let numStudentsReadReplySlip = 0;
  let numStudentsSubmittedReplySlip = 0;
  const peopleGotReplySlip: any[] = [];
  try {
    const classCollection = db.collection(`academicYear/${yearSelect}/class/`);
    const classCollectionDocs = await classCollection.get();
    for (const classDoc of classCollectionDocs.docs) {
      const classmateCollection = classDoc.ref.collection('classmate');
      const classmateDocs = await classmateCollection.get();
      for (const classmateDoc of classmateDocs.docs) {
        const studentdata = classmateDoc.data();
        const replySlipGotCollection = classmateDoc.ref.collection('replySlipGot');
        const replySlipGotDocs = await replySlipGotCollection.where('replySlipID', '==', replySlipId).get();
        if (!replySlipGotDocs.empty) {
          numStudentsWithReplySlip++;
          
          const replySlipGotData = replySlipGotDocs.docs[0].data();
          if (replySlipGotData.read === 'R') {
            numStudentsReadReplySlip++;
          }
          if (replySlipGotData.submit === 'S') {
            numStudentsSubmittedReplySlip++;
          }

          const data = {class:classDoc.id, ...studentdata, ...replySlipGotData};
          peopleGotReplySlip.push(data);
        }
      }
    }
    return { success: true, data: {numStudentsWithReplySlip,numStudentsReadReplySlip,numStudentsSubmittedReplySlip,peopleGotReplySlip} };
  } catch (error: any) {
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};
