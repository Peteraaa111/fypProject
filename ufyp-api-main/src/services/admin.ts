import { ConstantYear } from "../models/Constant";
import { firestore as db} from "../utilities/Firebase";
import { auth } from "../utilities/Firebase";
import { fieldValue } from "../utilities/Firebase";

export const getAllUser = async () => {
    try {
        const usersCollection = db.collection('users');
        const querySnapshot = await usersCollection.get();
  
        const teachersUsers: any[] = [];
        const parentsUsers: any[] = [];
        querySnapshot.forEach((doc) => {
            const userData = doc.data() as any;
            userData.id = doc.id;
            if (userData.role === 'Teacher') {
                teachersUsers.push(userData);
              } else if (userData.role === 'Parent') {
                parentsUsers.push(userData);
              }
        });
      
        return { teachersUsers, parentsUsers };
    } catch (error) {
        console.error('Error getting all users:', error);
        throw error;
    }
};

export const changePasswordForUser = async (userId: string, newPassword: string) => {
    try {
      await auth.updateUser(userId, { password: newPassword });
      console.log('Password updated successfully');
      return { success: true};
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
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


export const getAllLeaveForm = async () => {
  try {
      const leaveFormCollection = db.collection('leaveForm');
      const querySnapshot = await leaveFormCollection.get();
      const leaveFormList: any[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as any;
        const dateApplied = data.dateApplied.toDate(); // Convert Timestamp to Date
        const hkDate = dateApplied.toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong', hour12: false });
        data.dateApplied = hkDate;
        leaveFormList.push(data);
      });
    
      return {  leaveFormList };
  } catch (error) {
      console.error('Error getting leave form list:', error);
      throw error;
  }
};

export const getAllSystemProblem = async () => {
  try {
      const systemProblemCollection = db.collection('systemProblemList');
      const querySnapshot = await systemProblemCollection.get();
      const systemProblemList: any[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as any;
        const dateApplied = data.dateApplied.toDate(); // Convert Timestamp to Date
        const hkDate = dateApplied.toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong', hour12: false });
        data.dateApplied = hkDate;
        systemProblemList.push(data);
      });
    
      return {  systemProblemList };
  } catch (error) {
      console.error('Error getting all system problem list:', error);
      throw error;
  }
};

export const approvalLeaveForm = async (status:String,id:String) => {
  try {
      const leaveFormCollection = db.collection('leaveForm');
      const querySnapshot = await leaveFormCollection.where('ID', '==', id).get();

      const doc = querySnapshot.docs[0];
      let ChangeStatus;
      if(status==='approve'){
        ChangeStatus =  'Approved'
      }else{
        ChangeStatus =  'Rejected'
      }


      await doc.ref.update({ status:ChangeStatus });

      const data = doc.data();
      const dateApplied = data.dateApplied.toDate();
      const formattedDate = dateApplied.toISOString().split('T')[0];

      if(status==='approve'){
        await updateAttendance(data.classID,data.studentId,formattedDate);
      }
      
      
    
      return { success: true, message: "Leave Form updated", studentId: data.studentId, date: formattedDate };
    } catch (error: any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    } 
};

export const updateAttendance = async (classId:String,id:String,date:String) => {
  try{
    const yearSelector = ConstantYear.currentYear+"-"+ConstantYear.nextYear;
    const data = await findData(classId,id);
    const studentAttendanceListCollection = db.collection(`academicYear/${yearSelector}/class/${classId}/attendance/${date}/studentAttendanceList/`);
    const newDoc = studentAttendanceListCollection.doc(data.classNumber.toString());
    const takeAttendanceTime = new Date();
    const formattedDate = takeAttendanceTime.toLocaleDateString('en-US');

    await newDoc.set({
      classNumber: data.classNumber,
      status: "Sick",
      studentChiName: data.studentChiName,
      studentEngName: data.studentEngName,
      studentNumber: id, 
      takeAttendanceTime: formattedDate,
    });
  }catch (error) {
    console.error("Error writing document: ", error);
  }
}

export const findData = async (classId:String,studentID:String) => {
  const yearSelector = ConstantYear.currentYear+"-"+ConstantYear.nextYear;
  const classCollection = db.collection(`academicYear/${yearSelector}/class/${classId}/classmate`);
  const querySnapshot = await classCollection.where('studentId', '==', studentID).get();
  const doc = querySnapshot.docs[0];
  return doc.data();
}

export const getAllInterestClassRegistration = async () => {
  try {
      const interestClassFormCollection = db.collection('applyInterestClassList');
      const querySnapshot = await interestClassFormCollection.get();
      const interestClassFormList: any[] = [];

      querySnapshot.forEach((doc) => {
        if(doc.get('status')==='Pending'){
          const data = doc.data() as any;
          const dateApplied = data.dateApplied.toDate(); // Convert Timestamp to Date
          const hkDate = dateApplied.toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong', hour12: false });
          data.dateApplied = hkDate;
          interestClassFormList.push(data);
        }
      });
    
      return {  interestClassFormList };
  } catch (error) {
      console.error('Error getting leave form list:', error);
      throw error;
  }
};

export const approvalInterestClassForm = async (status:String,id:String) => {
  try {
      const interestClassFormCollection = db.collection('applyInterestClassList');
      const querySnapshot = await interestClassFormCollection.where('interestClassID', '==', id).get();

      const doc = querySnapshot.docs[0];
      let ChangeStatus;
      if(status==='approve'){
        ChangeStatus =  'Approved'
      }else{
        ChangeStatus =  'Rejected'
      }
      const hkTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Hong_Kong"});
      const approveDate = new Date(hkTime);   
      const formattedDate = `${approveDate.getFullYear()}-${("0" + (approveDate.getMonth() + 1)).slice(-2)}-${("0" + approveDate.getDate()).slice(-2)} ${("0" + approveDate.getHours()).slice(-2)}:${("0" + approveDate.getMinutes()).slice(-2)}:${("0" + approveDate.getSeconds()).slice(-2)}`;

      await doc.ref.update({ status:ChangeStatus, approveDate: formattedDate });
      let data;

      // if(status==='approve'){
      //   data = {
      //     studentID:doc.get('studentId'),
      //     classID:doc.get('classID'),
      //   }
        
      //   await updateInterestClass(data.classID,data.studentID,id);
      // }
      
      return { success: true, message: "Interest Class Form updated" };
    } catch (error: any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    } 
};

export const updateInterestClass = async (classId: String, id: String, interestClassID: String) => {
  try {
    const yearSelector = ConstantYear.currentYear + "-" + ConstantYear.nextYear;
    const data = await findData(classId, id);
    const interestClassForStudentCollection = db.collection(`academicYear/${yearSelector}/interestClassForStudent`);
    const newDoc = interestClassForStudentCollection.doc(id.toString());

    const docSnapshot = await newDoc.get();
    if (docSnapshot.exists) {
      await newDoc.update({
        classId: classId,
        studentChiName: data.studentChiName,
        studentEngName: data.studentEngName,
        studentId: id,
        interestClass: fieldValue.arrayUnion({ interestClassId: interestClassID }),
      });
    } else {
      await newDoc.set({
        classId: classId,
        studentChiName: data.studentChiName,
        studentEngName: data.studentEngName,
        studentId: id,
        interestClass: [{ interestClassId: interestClassID }],
      });
    }
  } catch (error) {
    console.error("Error writing document: ", error);
  }
}