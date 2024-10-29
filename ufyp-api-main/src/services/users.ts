import { firestore as db} from "../utilities/Firebase";
import { auth } from "../utilities/Firebase";
import { UserRegisterError } from "../models/Error";
import { 
    ParentRegister, 
    TeacherRegister,
    AdminRegsiter,
    userEditModal,
} from "../models/User";
import { ConstantYear } from "../models/Constant";
import sharp from "sharp";
import fs from 'fs';
import FormData from 'form-data';
import axios from "axios";
import path from 'path';
import { 
  createDocumentInCollection
} from "../services/notification";

const deleteOneParentAccount = async (uid: string) => {
    try {
      // Delete the user account
      await auth.deleteUser(uid);
      console.log(`Deleted user account with UID: ${uid}`);
      // Delete user data from "students" collection
      const studentsCollection = db.collection("students");
      const studentQuerySnapshot = await studentsCollection.doc(uid).get();
  
      if (studentQuerySnapshot.exists) {
        await studentQuerySnapshot.ref.delete();
        console.log(`Deleted user data with UID: ${uid}`);
      }
  
      const usersCollection = db.collection("users");
      const userQuerySnapshot = await usersCollection.doc(uid).get();
  
      var userEmail;
      if (userQuerySnapshot.exists) {
        userEmail = userQuerySnapshot.data()?.email;
        await userQuerySnapshot.ref.delete();
        console.log(`Deleted user data with UID: ${uid}`);
      }
  
      return { success: true, message: "User account successfully deleted"};
    } catch (error: any) {
      console.error(`Error deleting user account with UID: ${uid}`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  };
  
  export const deleteOneTeacherAccount = async (uid: string) => {
    try {
      // Delete the user account
      await auth.deleteUser(uid);
      console.log(`Deleted user account with UID: ${uid}`);
      // Delete user data from "students" collection
      const teachersCollection = db.collection("teachers");
      const teacherQuerySnapshot = await teachersCollection.doc(uid).get();
  
      if (teacherQuerySnapshot.exists) {
        await teacherQuerySnapshot.ref.delete();
        console.log(`Deleted teacher user data with UID: ${uid}`);
      }
  
      const usersCollection = db.collection("users");
      const userQuerySnapshot = await usersCollection.doc(uid).get();
  
      var userEmail;
      if (userQuerySnapshot.exists) {
        userEmail = userQuerySnapshot.data()?.email;
        await userQuerySnapshot.ref.delete();
        console.log(`Deleted user data with UID: ${uid}`);
      }
  
      return { success: true, message: "User account successfully deleted"};
    } catch (error: any) {
      console.error(`Error deleting user account with UID: ${uid}`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  };
  
  const deleteAllUserAccounts = async () => {
    try {
       // Get the list of all user accounts
       const listUsersResult = await auth.listUsers();
       const users = listUsersResult.users;
  
      // Delete each user account
      const deletePromises = users.map(async (user) => {
        try {
          await auth.deleteUser(user.uid);
          console.log(`Deleted user account with UID: ${user.uid}`);
        } catch (error) {
          console.error(`Error deleting user account with UID: ${user.uid}`, error);
        }
      });
  
      // Wait for all deletion operations to complete
      await Promise.all(deletePromises);
  
      return { success: true, message: "All user accounts successfully deleted" };
    } catch (error:any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  };
  
  function verifyUserToken(idToken: string): Promise<string> {
    return auth
      .verifyIdToken(idToken)
      .then((claims) => {
        // Check if the user has the admin custom claim
        console.log(claims);
        return claims.role;
      })
      .catch((error) => {
        // Error occurred while verifying the token
        console.error('Error verifying user token:', error);
        return false;
      });
  }
  
  const getAllStudents = async () => {
    try {
      const usersCollection = db.collection('students');
      const querySnapshot = await usersCollection.get();
  
      const users: any[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as any; // Cast the data to the User interface
        //const userId = doc.id;
        users.push(userData);
      });
      
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  };
  
  const getAllLogs = async () => {
    try {
      const logsCollection = db.collection('logs');
      const querySnapshot = await logsCollection.get();
  
      const logs: any[] = [];
      querySnapshot.forEach((doc) => {
        const logData = doc.data() as any; // Cast the data to the User interface
        //const userId = doc.id;
        logs.push(logData);
      });
      
      return logs;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  };
  
  const getAllParentsData = async () => {
    try {
      const usersCollection = db.collection('users');
      const studentsCollection = db.collection('students');
      const querySnapshot = await usersCollection.where('role', '==', 'Parent').get();
  
      const promises = querySnapshot.docs.map(async (doc) => {
        const userData = doc.data() as any; // Cast the data to the User interface
        const userId = doc.id;
        const studentSnapshot = await studentsCollection.doc(userId).get();
        const studentData = studentSnapshot.data();
  
        const userWithStudentData = {
          ...userData,
          userId: userId,
          studentId: studentData?.s_Id,
          parent_Name: studentData?.parent_Name,
          parent_PhoneNumber: studentData?.parent_PhoneNumber,
          Home_Address: studentData?.home_Address
        };
  
        return userWithStudentData;
      });
  
      const users = await Promise.all(promises);
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  };
  
  const getAllTeachers = async () => {
    try {
      const usersCollection = db.collection('teachers');
      const querySnapshot = await usersCollection.get();
      const promises = querySnapshot.docs.map(async (doc) => {
        const userData = doc.data() as any; // Cast the data to the User interface
        const userId = doc.id;
        const userWithStudentData = {
          ...userData,
          userId: userId,
      };
  
        return userWithStudentData;
      });
      const users = await Promise.all(promises);
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  };
  
  const getAllAdmins = async () => {
    try {
      const usersCollection = db.collection('admin');
      const querySnapshot = await usersCollection.get();
  
      const users: any[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as any; // Cast the data to the User interface
        const userId = doc.id;
        users.push(userData);
        // // Get the user's custom claims
        auth.getUser(userId)
          .then((userRecord) => {
            const customClaims = userRecord.customClaims;
            const role = customClaims?.role || null;
            console.log(role);
            // Add the role to the userData object
            //userData.role = role;
  
            // Push the modified userData to the users array
            users.push(userData);
          })
          .catch((error) => {
            console.error('Error getting user record:', error);
            throw error;
          });
      });
  
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  };
  
  
  const addAdmin = async (data: AdminRegsiter) => {
    try {
      if (data.a_Name === "") throw new UserRegisterError("Name is required.");
      if (data.email === "") throw new UserRegisterError("Eamil is required.");
      if (data.password === "") throw new UserRegisterError("Password is required.");
      
      let Role = "Admin";
      // Create user
      const userRecord = await auth.createUser({
        email: data.email,
        password: data.password,
      });
  
      // Reference to the collection where the documents are stored
      const adminCollectionRef = db.collection('admin');
      const userCollectionRef = db.collection('users');
  
      // Get all documents in the collection
      const adminQuerySnapshot = await adminCollectionRef.get();
      //const userQuerySnapshot = await userCollectionRef.get();
  
      // Calculate the next ID based on the number of documents
      const currentAdminCount = adminQuerySnapshot.size + 1;
      const nextId = `admin${currentAdminCount}`;
  
      // Make a document, documentID = uid
      const AdminDoc = adminCollectionRef.doc(userRecord.uid);
      const userDoc = userCollectionRef.doc(userRecord.uid);
  
      await userDoc.set({
          email: data.email,
          role: Role,
          active: true,
      });
  
      await AdminDoc.set({
        a_Id: nextId,
        a_Name:data.a_Name,
  
      });
  
      auth.setCustomUserClaims(userRecord.uid, { role: "admin" })
      .then(() => {
        // Custom claim set successfully
        return { success: true, message: "Set Admin Successful" };
      })
      .catch((error) => {
        // Error setting custom claim
        return { success: false, message: `${error.name}: ${error.message}` };
      });
  
      return { success: true, message: "Admin User created" };
    } catch (error: any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    } 
  }
  
  const logMovement = async (actorUid:any ,targetUid: any, action: any) => {
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
  
  
  const addParent = async (data: ParentRegister) => {
    try { 
      if (data.s_EngName === "") throw new UserRegisterError("English Name is required.");
      if (data.s_ChiName === "") throw new UserRegisterError("Chinese Name is required.");
      if (data.s_Gender === "") throw new UserRegisterError("Gender is required.");
      if (data.s_Age === "") throw new UserRegisterError("Age is required.");
      if (data.s_Born === "") throw new UserRegisterError("Born Region is required.");
      if (data.s_idcardNumber === "") throw new UserRegisterError("Id Card Number is required.");
      if (data.parent_Name === "") throw new UserRegisterError("Parent Name is required.");
      if (data.parent_PhoneNumber === "") throw new UserRegisterError("Parent Phone Number is required.");
      if (data.home_Address === "") throw new UserRegisterError("Home Address is required.");
      if (data.email === "") throw new UserRegisterError("Eamil is required.");
      if (data.password === "")
        throw new UserRegisterError("Password is required.");
  
      let Role = "Parent";
      // Create user
      const userRecord = await auth.createUser({
        email: data.email,
        password: data.password,
      });
  
      // Reference to the collection where the documents are stored
      const studentCollectionRef = db.collection('students');
      const userCollectionRef = db.collection('users');
  
      // Get all documents in the collection
      const studentQuerySnapshot = await studentCollectionRef.get();
      //const userQuerySnapshot = await userCollectionRef.get();
  
      // Calculate the next ID based on the number of documents
      const currentStudentCount = studentQuerySnapshot.size + 1;
      const nextStudentId = `student${currentStudentCount}`;
      // const currentUserCount = userQuerySnapshot.size + 1;
      // const nextUserId = `user${currentUserCount}`;
   
  
      // Make a document, documentID = uid
      const studentDoc = studentCollectionRef.doc(userRecord.uid);
      const userDoc = userCollectionRef.doc(userRecord.uid);
  
      // Set the document details
      await studentDoc.set({
        s_Id: nextStudentId,
        s_EngName: data.s_EngName,
        s_ChiName: data.s_ChiName,
        s_Gender: data.s_Gender,
        s_Age: data.s_Age,
        s_Born: data.s_Born,
        s_IdNumber: data.s_idcardNumber,
        parent_Name: data.parent_Name,
        parent_PhoneNumber: data.parent_PhoneNumber,
        home_Address: data.home_Address,
        graduate: false,
      });
  
      await userDoc.set({
        email: data.email,
        role: Role,
        active: true,
      });
  
      await auth.setCustomUserClaims(userRecord.uid, { role: "Parent" });
  
      // Return register successfully
      return { success: true, message: "Parent User created" ,uid: userRecord.uid};
    } catch (error: any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    } 
  };

  export const getTeacherSize = async () =>{
    const teacherCollectionRef = db.collection('teachers');
    const teacherQuerySnapshot = await teacherCollectionRef.get();
    const currentTeacherCount = teacherQuerySnapshot.size 
    return currentTeacherCount;

  }

  const addTeacher = async (data: TeacherRegister, sizeNumber:number) => {
    try {
      if (data.t_ChiName === "") throw new UserRegisterError("Chinese Name is required.");
      if (data.t_EngName === "") throw new UserRegisterError("Engish Name is required.");
      if (data.t_Gender === "") throw new UserRegisterError("Gender is required.");
      if (data.t_phoneNumber === "") throw new UserRegisterError("phoneNumber is required.");
      if (data.home_Address === "") throw new UserRegisterError("Gender is required.");
      if (data.email === "") throw new UserRegisterError("Eamil is required.");
      if (data.password === "")throw new UserRegisterError("Password is required.");

      let Role = "Teacher";
      
      // Create user
      const userRecord = await auth.createUser({
        email: data.email,
        password: data.password,
      });
  
      // Reference to the collection where the documents are stored
      const teacherCollectionRef = db.collection('teachers');
      const userCollectionRef = db.collection('users');
  
      // Get all documents in the collection
      const teacherQuerySnapshot = await teacherCollectionRef.get();
      //const userQuerySnapshot = await userCollectionRef.get();
  
      // Calculate the next ID based on the number of documents
      const currentTeacherCount = teacherQuerySnapshot.size + 1;
      const nextId = `teachers${sizeNumber}`;
  
      // Make a document, documentID = uid
      const teacherDoc = teacherCollectionRef.doc(userRecord.uid);
      const userDoc = userCollectionRef.doc(userRecord.uid);
  
      // Set the document details
      await teacherDoc.set({
        t_Id: nextId,
        t_ChiName:data.t_ChiName,
        t_EngName:data.t_EngName,
        t_gender:data.t_Gender,
        t_phoneNumber:data.t_phoneNumber,
        home_Address:data.home_Address,
        leave: false,
        //email: data.email,
        //role: Role,
      });
  
      await userDoc.set({
        email: data.email,
        role: Role,
        active: true,
      });
  
      // Return register successfully
      await auth.setCustomUserClaims(userRecord.uid, { role: "Teacher" });
  
      return { success: true, message: "Teacher User created", uid: userRecord.uid};
    } catch (error: any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  };
  
  const updateUser = async (uid: string, phoneNumberValue: string, ParentChineseNameValue: string ,homeAddressValue: string) => {
    try {
      const userRef = db.collection('users').doc(uid);
      const studentRef = db.collection('students').doc(uid);
  
      const [userDoc, studentDoc] = await Promise.all([
        userRef.get(),
        studentRef.get()
      ]);
  
      const userFieldsToUpdate = {} as any;
      const studentFieldsToUpdate = {} as any;
  
      // Check if there are changes in the user information
      if (userDoc.exists) {
        const userData = userDoc.data() as any;
      }
  
      // Check if there are changes in the student information
      if (studentDoc.exists) {
        const studentData = studentDoc.data() as any;
   
        if (studentData.parent_PhoneNumber !== phoneNumberValue) {
          studentFieldsToUpdate.parent_PhoneNumber = phoneNumberValue;
          // Update the email if the phone number has changed
          const email = phoneNumberValue + '@cityprimary.com';
          userFieldsToUpdate.email = email;
          
          // Update the authentication email
          const user = await auth.getUser(uid);
          await auth.updateUser(uid, { email });
        }
  
        if (studentData.parent_Name !== ParentChineseNameValue) {
          studentFieldsToUpdate.parent_Name = ParentChineseNameValue;
        }
        if (studentData.home_Address !== homeAddressValue) {
          studentFieldsToUpdate.home_Address = homeAddressValue;
        }
      }
  
      // Perform the batch update only if there are changes
      if (Object.keys(userFieldsToUpdate).length > 0 || Object.keys(studentFieldsToUpdate).length > 0) {
        const batch = db.batch();
  
        if (Object.keys(userFieldsToUpdate).length > 0) {
          batch.update(userRef, userFieldsToUpdate);
        }
        if (Object.keys(studentFieldsToUpdate).length > 0) {
          batch.update(studentRef, studentFieldsToUpdate);
        }
  
        await batch.commit();
      }
  
      return { success: true, message: "User information successfully updated"};
    } catch (error:any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  };

  export const updateUserStatus = async (status: string, email: string) => {
    try {
      const userRef = db.collection('users');
      const query = userRef.where('email', '==', email);
      const querySnapshot = await query.get();
      
      if (querySnapshot.empty) {
        return { success: false, message: "User not found" };
      }
      let tempStatus;
      if(status === 'false'){
        tempStatus = false;
      }else{
        tempStatus = true;
      }
  
      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;
      await userDoc.ref.update({ active: tempStatus });
  
      return { success: true, message: "User status successfully updated", uid:userId };
    } catch (error: any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  };

  export const updateTeacherStatus = async (status: string, id: string) => {
    try {
      const userRef = db.collection('teachers');
      const query = userRef.where('t_Id', '==', id);
      const querySnapshot = await query.get();
      
      if (querySnapshot.empty) {
        return { success: false, message: "Teacher not found" };
      }
      let tempStatus;
      if(status === 'false'){
        tempStatus = false;
      }else{
        tempStatus = true;
      }
  
      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;
      await userDoc.ref.update({ leave: tempStatus });
  
      return { success: true, message: "Teacher status successfully updated", uid:userId };
    } catch (error: any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  };



  
  
  const updateTeacher = async (uid: string, phoneNumberValue: string, TeacherChineseNameValue: string, TeacherEnglishNameValue: string, homeAddressValue: string) => {
    try {
      const userRef = db.collection('users').doc(uid);
      const teacherRef = db.collection('teachers').doc(uid);
  
      const [userDoc, teachersDoc] = await Promise.all([
        userRef.get(),
        teacherRef.get()
      ]);
  
      const userFieldsToUpdate = {} as any;
      const teacherFieldsToUpdate = {} as any;
  
      // Check if there are changes in the user information
      if (userDoc.exists) {
        const userData = userDoc.data() as any;
      }
  
      // Check if there are changes in the student information
      if (teachersDoc.exists) {
        const teacherData = teachersDoc.data() as any;
   
        if (teacherData.t_phoneNumber !== phoneNumberValue) {
          teacherFieldsToUpdate.t_phoneNumber = phoneNumberValue;
          // Update the email if the phone number has changed
          const email = phoneNumberValue + '@cityprimary.com';
          userFieldsToUpdate.email = email;
  
          // Update the authentication email
          const user = await auth.getUser(uid);
          await auth.updateUser(uid, { email });
        }
  
        if (teacherData.t_ChiName !== TeacherChineseNameValue) {
          teacherFieldsToUpdate.t_ChiName = TeacherChineseNameValue;
        }
        if(teacherData.t_EngName !==TeacherEnglishNameValue){
          teacherFieldsToUpdate.t_EngName = TeacherEnglishNameValue;
        }
  
        if (teacherData.home_Address !== homeAddressValue) {
          teacherFieldsToUpdate.home_Address = homeAddressValue;
        }
      }
  
      // Perform the batch update only if there are changes
      if (Object.keys(userFieldsToUpdate).length > 0 || Object.keys(teacherFieldsToUpdate).length > 0) {
        const batch = db.batch();
  
        if (Object.keys(userFieldsToUpdate).length > 0) {
          batch.update(userRef, userFieldsToUpdate);
        }
        if (Object.keys(teacherFieldsToUpdate).length > 0) {
          batch.update(teacherRef, teacherFieldsToUpdate);
        }
  
        await batch.commit();
      }
  
      return { success: true, message: "Teacher information successfully updated"};
    } catch (error:any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  };

  
  
  export const getStudentsDataByUID = async (id:string) => {
    try {
      const studentDoc = await db.collection('students').doc(id).get();
      const studentData = studentDoc.data();
      const sId = studentData!.s_Id;
      const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
      const classCollection = db.collection(`academicYear/${yearSelector}/class`);
      const querySnapshot = await classCollection.get();
      let classId = null;

      for (const doc of querySnapshot.docs) {
        const classmateCollection = classCollection.doc(doc.id).collection("classmate");
        const classmateDoc = await classmateCollection.where('studentId', '==', sId).get();
  
        if (!classmateDoc.empty) {
          classId = doc.id;
          break;
        }
      }

      if (classId) {
        studentData!.s_CurrentClass = classId;
      }

      return { success: true, studentData: studentData};
    } catch (error:any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  };

  export const getTeacherDataByUID = async (id:string) => {
    try {
      const teacherDoc = await db.collection('teachers').doc(id).get();
      const teacherData = teacherDoc.data();
      const tId = teacherData!.t_Id;
      const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
      const classCollection = db.collection(`academicYear/${yearSelector}/class`);
      const querySnapshot = await classCollection.where('t_Id','==',tId).get();

      if (!querySnapshot.empty) {
        teacherData!.s_CurrentClass = querySnapshot.docs[0].id;
      }

      return { success: true, teacherData: teacherData};
    } catch (error:any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  };




  export const editUserDataByID = async (userData:userEditModal) =>{
    try {
      const studentCollection = db.collection('students')
      const studentDoc = await studentCollection.where('s_Id', '==', userData.s_Id).get();
      const documentRef = studentDoc.docs[0].ref;
      await documentRef.update({
        s_ChiName: userData.s_ChiName,
        s_EngName: userData.s_EngName,
        home_Address: userData.home_Address,
        s_Age: userData.s_Age,
        parent_Name: userData.parent_Name
      });
  
      return { success: true, message: "User edit successful!"};
    } catch (error:any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  }

  export const getStudentFirstHalfGradeByID = async (id:string,classId:string) => {
    try {
      const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
      let data:any=[];
      let haveData=false;
      const classmateCollection = db.collection(`academicYear/${yearSelector}/grade/firstHalfTerm/class/${classId}/classmate`);
      const classmateDoc = await classmateCollection.where('studentId', '==', id).get();
      if(classmateDoc.docs[0]){
        data = {
          chi:classmateDoc.docs[0].get('chi'),
          math: classmateDoc.docs[0].get('math'),
          gs: classmateDoc.docs[0].get('gs'),
          eng: classmateDoc.docs[0].get('eng'),
          // add other fields you want here
        };
        haveData = true;
      }


      return { success: true, data:data,haveData:haveData };
    } catch (error:any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  }

  export const getStudentSecondHalfGradeByID = async (id:string,classId:string) => {
    try {
      const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
      let data:any=[];
      let haveData=false;
      const classmateCollection = db.collection(`academicYear/${yearSelector}/grade/secondHalfTerm/class/${classId}/classmate`);
      const classmateDoc = await classmateCollection.where('studentId', '==', id).get();
      if(classmateDoc.docs[0]){
        data = {
          chi:classmateDoc.docs[0].get('chi'),
          math: classmateDoc.docs[0].get('math'),
          gs: classmateDoc.docs[0].get('gs'),
          eng: classmateDoc.docs[0].get('eng'),
          // add other fields you want here
        };
        haveData = true;
      }

      return { success: true, data:data,haveData:haveData };
    } catch (error) {
      console.error('Error edit:', error);
      throw error;
    }
  }

  function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }

  export const getStudentSecongetStudentAttendanceBySelectedMonthdHalfGradeByID = async (id:string,classId:string,year:string,month:string) => {
    try {
      const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
      const startDateRange = new Date(`${year}-${month}-01`);
      const endDateRange = new Date(`${year}-${month}-${getDaysInMonth(parseInt(year),parseInt(month))}`);
      let studentAttendanceData: any[] = [];
      let haveData=false;

      const studentAttendanceCollection = db.collection(`academicYear/${yearSelector}/class/${classId}/attendance`);
      const querystudentAttendanceSnapshot = await studentAttendanceCollection.where('date','>=',startDateRange).where('date','<=',endDateRange).get();
      //console.log(`Number of documents retrieved: ${querystudentAttendanceSnapshot.size}`);
      const now = new Date();
      for (const doc of querystudentAttendanceSnapshot.docs) {
        const attendanceDate = new Date(doc.id);
        if (attendanceDate <= now) {
            const studentAttendanceListCollection = db.collection(`academicYear/${yearSelector}/class/${classId}/attendance/${doc.id}/studentAttendanceList`);
            const classmateDoc = await studentAttendanceListCollection.where('studentNumber', '==', id).get();
            
            if (classmateDoc.docs[0]) {
              const status = classmateDoc.docs[0].get('status');
              //const status = attendanceData.status;
              studentAttendanceData.push({ attendanceDate: doc.id, status:status });
            }else{
              break;
            }
        }
        if (attendanceDate > now) {
          break; 
        }
    }
    if (studentAttendanceData.length > 0) {
      haveData = true;
    }
      return { success: true, data: studentAttendanceData,haveData:haveData};
    } catch (error:any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  }


  export const applyLeaveForStudent = async (sId:String,reason:String,classID:String,date:String,weekday:String) =>{
    try {
      const leaveFormCollection = db.collection('leaveForm')      

      const TodayDay = new Date();
      TodayDay.setHours(0, 0, 0, 0);
      const tomorrow = new Date(TodayDay);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const hkTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Hong_Kong"});
      const dateApplied = new Date(hkTime);


      // Check if a document with the same studentId and dateApplied exists
      const existingDocs = await leaveFormCollection
        .where('leaveDate','==', date)
        .where('studentId', '==', sId)
        .get();

      if (!existingDocs.empty) {
        return { success: true, exist: true };
      }

      const newDoc = leaveFormCollection.doc();
      // Set data in the new document
      await newDoc.set({
        ID: newDoc.id,
        studentId: sId,
        classID:classID,
        weekday:weekday,
        reason: reason,
        leaveDate:date,
        dateApplied: dateApplied, 
        status: 'Pending'
      });
  
      return { success: true, exist: false};
    } catch (error:any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  }



  export const submitSystemProblem = async (sId:String,problem:String,phoneNumber:String) =>{
    try {
      const problemCollection = db.collection('systemProblemList')      

      const newDoc = problemCollection.doc();
      const hkTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Hong_Kong"});
      const dateApplied = new Date(hkTime);
      // Set data in the new document
      await newDoc.set({
        studentId: sId,
        problem: problem,
        dateApplied: dateApplied,
        phoneNumber: phoneNumber,
      });
  
      return { success: true, exist: false};
    } catch (error:any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  }

  export const getApplyLeaveListByID = async (id:string) => {
    try {
      let data:any=[];
      let haveData=false;
      const leaveFormCollection = db.collection(`leaveForm`);
      const leaveDocs = await leaveFormCollection.where('studentId', '==', id).get();

      if (!leaveDocs.empty) {
        haveData = true;
        leaveDocs.forEach(doc => {
          let date = doc.get('dateApplied').toDate();
          let formattedDate = date.toLocaleString('en-GB', { timeZone: 'Asia/Hong_Kong', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-').replace(',', '');
          let dateParts = formattedDate.split(' ')[0].split('-');
          let timePart = formattedDate.split(' ')[1];
          let rearrangedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]} ${timePart}`;

          let docData = {
            reason:doc.get('reason'),
            submittedDate: rearrangedDate,
            dateApplied: doc.get('leaveDate'),
            weekDay:doc.get('weekday'),
            status: doc.get('status'),
            // add other fields you want here
          };
          data.push(docData);
        });
      }

      return { success: true, data:data,haveData:haveData };
    } catch (error:any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  }

  // export const getAllInterestClassGroup = async (studentId:string) => {
  //   try {
  //     const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
  //     const ineterestClassCollection = db.collection(`academicYear/${yearSelector}/interestClassGroup`)     
  //     const ineterestClassForStudentCollection = db.collection(`academicYear/${yearSelector}/interestClassForStudent/`)     
  //     const existInterestClassId:any[] = [];
  //     const ineterestClassForStudentDoc = await ineterestClassForStudentCollection.where('studentId','==',studentId).get();
  //     if(!ineterestClassForStudentDoc.empty){
  //       let docData = {
  //         interestClass:ineterestClassForStudentDoc.docs[0].get('interestClass')
  //       }
  //       docData.interestClass.map((item: any) => {
  //         existInterestClassId.push(item.interestClassId);
  //       });
  //     }
  //     const interestClassDocs = await ineterestClassCollection.where('status', '==', 'A').get();

  //     // let query = ineterestClassCollection.where('status', '==', 'A');

  //     // for(let i = 0; i < existInterestClassId.length; i++){
  //     //   query = query.where('id', '!=', existInterestClassId[i]);
  //     // }

  //     // const ineterestClassDocs = await query.get();
   
  //     const data: any[] = [];
  //     let haveData=false;

  //     if (!interestClassDocs.empty) {
  //       haveData=true;
        
  //       interestClassDocs.forEach((doc) => {
  //         let docId = doc.get('id');
  //         if(!existInterestClassId.includes(docId)){
  //           let docData = {
  //             id:docId,
  //             startDateFrom: doc.get('startDateFrom'),
  //             startDateTo:doc.get('startDateTo'),
  //             titleEN: doc.get('titleEN'),
  //             titleTC: doc.get('titleTC'),
  //             validApplyDateFrom:doc.get('validApplyDateFrom'),
  //             validApplyDateTo: doc.get('validApplyDateTo'),
  //             timePeriod:doc.get('startTime')+"-"+doc.get('endTime'),
  //             weekDay:doc.get('weekDay'),
  //           }
  //           data.push(docData);
  //         }
  //       });
  //     }
  //     return { success: true, data: data,haveData:haveData };
  //   } catch (error: any) {
  //     console.error(`Error`, error);
  //     return { success: false, message: `${error.name}: ${error.message}` };
  //   }
  // };

  export const getAllInterestClassGroup = async (studentId:string) => {
    try {
      const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
      const ineterestClassCollection = db.collection(`academicYear/${yearSelector}/interestClassGroup`)     
      const ineterestClassForStudentCollection = db.collection(`applyInterestClassList`)     
      const existInterestClassId:any[] = [];
      const ineterestClassForStudentDoc = await ineterestClassForStudentCollection.where('studentId','==',studentId).get();
      if(!ineterestClassForStudentDoc.empty){
        ineterestClassForStudentDoc.docs.forEach(doc => {
          let docData = {
            interestClassId: doc.get('interestClassID')
          }
          existInterestClassId.push(docData.interestClassId);
        });
      }
      const interestClassDocs = await ineterestClassCollection.where('status', '==', 'A').get();

      // let query = ineterestClassCollection.where('status', '==', 'A');

      // for(let i = 0; i < existInterestClassId.length; i++){
      //   query = query.where('id', '!=', existInterestClassId[i]);
      // }

      // const ineterestClassDocs = await query.get();
   
      const data: any[] = [];
      let haveData=false;

      if (!interestClassDocs.empty) {        
        interestClassDocs.forEach((doc) => {
          let docId = doc.get('id');
          if(!existInterestClassId.includes(docId)){
            let docData = {
              id:docId,
              startDateFrom: doc.get('startDateFrom'),
              startDateTo:doc.get('startDateTo'),
              titleEN: doc.get('titleEN'),
              titleTC: doc.get('titleTC'),
              validApplyDateFrom:doc.get('validApplyDateFrom'),
              validApplyDateTo: doc.get('validApplyDateTo'),
              timePeriod:doc.get('startTime')+"-"+doc.get('endTime'),
              weekDay:doc.get('weekDay'),
            }
            data.push(docData);
          }
        });
      }
        
      if (data.length > 0) {
        haveData = true;
      }

      return { success: true, data: data,haveData:haveData };
    } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  };

  export const applyInterestClass = async (sId:String,interestClassID:String,phoneNumber:String,classId:String) =>{
    try {
      const problemCollection = db.collection('applyInterestClassList')      

      const newDoc = problemCollection.doc();
      const hkTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Hong_Kong"});
      const dateApplied = new Date(hkTime);
      // Set data in the new document
      await newDoc.set({
        status:"Pending",
        studentId: sId,
        interestClassID: interestClassID,
        dateApplied: dateApplied,
        phoneNumber: phoneNumber,
        classID:classId
      });
  
      return { success: true, exist: false};
    } catch (error:any) {
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  }

  export const getAppliedInterestClassGroup = async (studentId:string) => {
    try {
      const applyInterestClassListCollection = db.collection(`applyInterestClassList`)      
      const applyInterestClassForStudentDoc = await applyInterestClassListCollection.where('studentId','==',studentId).get();

      let data:any = [];
      let haveData=false;

      if (!applyInterestClassForStudentDoc.empty) {
        haveData=true;
        
        data = await Promise.all(applyInterestClassForStudentDoc.docs.map(async (doc) => {
          let date = doc.get('dateApplied').toDate();
          let formattedDate = date.toLocaleString('en-GB', { timeZone: 'Asia/Hong_Kong', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-').replace(',', '');
          let dateParts = formattedDate.split(' ')[0].split('-');
          let timePart = formattedDate.split(' ')[1];
          let rearrangedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]} ${timePart}`;
          const interestClassID = doc.get('interestClassID');
          const titleData:any = await findInterestClassNameById(interestClassID);
          let docData = {
            titleEN:titleData.titleEN,
            titleTC:titleData.titleTC,
            status:doc.get('status'),
            submittedDate: rearrangedDate,
            approveDate: doc.get('status') !== 'Pending' ? doc.get('approveDate') : '',
          }
          return docData;
        }));
        console.log(data);
        
      }
      return { success: true, data: data, haveData: haveData };
    } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  };

  const findInterestClassNameById = async (id: string) =>{
    try {
      const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
      const ineterestClassCollection = db.collection(`academicYear/${yearSelector}/interestClassGroup`)    
      let titleEN; 
      let titleTC; 
      //const existInterestClassId:any[] = [];
      const ineterestClassForStudentDoc = await ineterestClassCollection.where('id','==',id).get();
      if(!ineterestClassForStudentDoc.empty){
        
        titleEN = ineterestClassForStudentDoc.docs[0].get('titleEN');
        titleTC = ineterestClassForStudentDoc.docs[0].get('titleTC');
        
      }
      return { titleEN:titleEN,titleTC:titleTC};
    } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  }

  export const getSchoolPhotoDocDate = async () =>{
    try{
      const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
      const photoCollection = db.collection(`academicYear/${yearSelector}/photo`)
      let haveData=false;   
      const photoDoc = await photoCollection.get();
      let photoDocDate:any = [];

      photoDoc.forEach((doc) => {
        photoDocDate.push(doc.id);
      });
  
      haveData = photoDocDate.length > 0;

      return { success: true, data: photoDocDate, haveData: haveData };
    } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  }

  export const getSchoolPhotoActivityDoc = async (date: string) =>{
    try{
      const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
      const photoActivityCollection = db.collection(`academicYear/${yearSelector}/photo/${date}/activity`)
      let haveData=false;   
      const photoActivityDoc = await photoActivityCollection.get();
      let photoAcitivtyDoc:any = [];

      photoActivityDoc.forEach((doc) => {
        photoAcitivtyDoc.push(doc.data());
      });
  
      haveData = photoAcitivtyDoc.length > 0;

      return { success: true, data: photoAcitivtyDoc, haveData: haveData };
    } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }

  }

  
  export const getSchoolPhotoDoc = async (date: string,id:string) =>{
    try{
      const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
      const photoActivityCollection = db.collection(`academicYear/${yearSelector}/photo/${date}/activity`)
      let haveData=false;   
      const photoActivityDoc = await photoActivityCollection.where('id','==',id).get();
      const imageCollection = db.collection(`academicYear/${yearSelector}/photo/${date}/activity/${photoActivityDoc.docs[0].id}/image`)
      const imageDoc = await imageCollection.get();

      let imageDataDoc:any = [];

      imageDoc.forEach((doc) => {
        imageDataDoc.push(doc.data());
      });
  
      haveData = imageDataDoc.length > 0;

      return { success: true, data: imageDataDoc, haveData: haveData };
    } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }

  }

  export const getClassHomeworkByUser = async (date: string,classID:string) =>{
    try{
      const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
      const homeWorkActivityCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/homework/`)
      let haveData=false;   
      const homeworkActivityDoc = await homeWorkActivityCollection.where('id','==',date).get();
      let homeworkActivityData:any;

      if(!homeworkActivityDoc.empty){
        
        homeworkActivityData = homeworkActivityDoc.docs[0].data();
        haveData = true;
        
      }

      return { success: true, data: homeworkActivityData, haveData: haveData };
    } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  }


  export const  getReplySlipByUser = async (classID:string, studentId:string) =>{
    try{
      const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
      let replySlipData:any = [];
      let haveData=false;   
      const classmateCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/classmate/`);  
      const getStudentDoc = await classmateCollection.where('studentId','==',studentId).get();
      const docId = getStudentDoc.docs[0].id;
      const replySlipCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/classmate/${docId}/replySlipGot/`);
      const replySlipDoc = await replySlipCollection.get();
      await Promise.all(replySlipDoc.docs.map(async (doc) => {
        const replySlipDetail = await searchReplySlipInformation(doc.get('replySlipID').toString());
        replySlipData.push({...doc.data(), replySlipDetail});
      }));

      haveData = replySlipData.length > 0;

      return { success: true, data: replySlipData, haveData: haveData };
    } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }

  }

  const searchReplySlipInformation = async (replySlipID:string) =>{
    const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
    const replySlipCollection = db.collection(`academicYear/${yearSelector}/replySlip/`);  
    const replySlipDoc = await replySlipCollection.where('id','==',replySlipID).get();
    let replySlipDataOut:any;
    if(!replySlipDoc.empty){
      const replySlipData = replySlipDoc.docs[0].data();
      replySlipDataOut = {
        mainContentEN:replySlipData.mainContentEN,
        mainContentTC:replySlipData.mainContentTC,
        recipientContentEN:replySlipData.recipientContentEN,
        recipientContentTC:replySlipData.recipientContentTC,
        titleEN:replySlipData.titleEN,
        titleTC:replySlipData.titleTC,
        payment:replySlipData.payment,
      }
      if(replySlipData.payment === true){
        replySlipDataOut.paymentAmount = replySlipData.paymentAmount;
      }
    }
    return replySlipDataOut;
  }

  export const submitReplySlip = async (studentID:string,replySlipID:string,classID:string,options:string) =>{
    try{
      const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
      const classmateCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/classmate/`);  
      const getStudentDoc = await classmateCollection.where('studentId','==',studentID).get();
      const docId = getStudentDoc.docs[0].id;
      const replySlipCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/classmate/${docId}/replySlipGot/`);
      const replySlipDoc = await replySlipCollection.where('replySlipID','==',replySlipID.toString()).get();
      let valueTC ='';
      let valueEN ='';
      let titleTC = '通告'+replySlipID.toString()+"已提交";
      let titleEN = 'reply Slip'+replySlipID.toString()+"already submitted";
      if(options === '參加'){
        options = 'Join';
        valueTC = '你選擇了參加';
        valueEN = 'You choose join'
      }else if (options ==='不參加'){
        options = 'Not Join';
        valueTC = '你選擇了不參加';
        valueEN = 'You choose not join'
      }

      if (!replySlipDoc.empty) {
        const docToUpdate = replySlipDoc.docs[0];
        await docToUpdate.ref.update({
          submit: "S",
          submitdate: new Date().toISOString().split('T')[0], // current date in 'yyyy-mm-dd' format
          options: options
        });
      }

      await createDocumentInCollection(titleTC,valueTC,titleEN,valueEN,studentID);
      return { success: true };
    } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  }

  export const changeReplySlipStatus = async (studentID:string,replySlipID:string,classID:string,)  =>{
    try{
      const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
      const classmateCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/classmate/`);  
      const getStudentDoc = await classmateCollection.where('studentId','==',studentID).get();
      const docId = getStudentDoc.docs[0].id;
      const replySlipCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/classmate/${docId}/replySlipGot/`);
      const replySlipDoc = await replySlipCollection.where('replySlipID','==',replySlipID.toString()).get();
      if (!replySlipDoc.empty) {
        const docToUpdate = replySlipDoc.docs[0];
        await docToUpdate.ref.update({
          read: "R",
        });
      }

      return { success: true };
    } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }

  }

  export const saveDeviceID = async (deviceID:string,UID:string,role:String)  =>{
    try{
      const userCollection = db.collection('users');
      const userDoc = await userCollection.doc(UID).get();
      let data:any;


      if(role ==='Parent'){
        const studentCollection = db.collection('students');
        const studentDoc = await studentCollection.doc(UID).get();
        if(studentDoc.exists){
          data = {
            uid:UID,
            userID:studentDoc.get('s_Id'),
            deviceID:deviceID,
            languageCode:"zh",
          }
        }
      }else{
        const teacherCollection = db.collection('teachers');
        const teacherDoc = await teacherCollection.doc(UID).get();
        if(teacherDoc.exists){
          data = {
            uid:UID,
            userID:teacherDoc.get('t_Id'),
            deviceID:deviceID,
            languageCode:"zh",
          }
        }
      }


      if (userDoc.exists) {
        await userDoc.ref.update({
          deviceID: deviceID
        });
      }

 

      const deviceCollection = db.collection('devices');
      const deviceDoc = await deviceCollection.doc(UID).get();
      if (!deviceDoc.exists) {
        await deviceCollection.doc(UID).set(data);
      }
      
      if (deviceDoc.exists) {
        await deviceCollection.doc(UID).update({ deviceID: data.deviceID });
    }




      return { success: true };
    } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }

  }


  export const saveLanguageCode = async (languageCode:string,userID:string)  =>{
    try{
      const deviceCollection = db.collection('devices');
      const deviceDoc = await deviceCollection.where('userID','==',userID).get();
      if (!deviceDoc.empty) {
        const docToUpdate = deviceDoc.docs[0];
        await docToUpdate.ref.update({
          languageCode: languageCode
        });
      }

      return { success: true };
    } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }

  }

  export const getNotificationMessage = async (userID:string) => {
    try {
      const userNotificationCollection = db.collection('userNotification');
      const userNotificationDocs = await userNotificationCollection.where('userID', '==', userID).get();
      let haveData= false;
      let data:any=[];
      if (!userNotificationDocs.empty) {
        for (const doc of userNotificationDocs.docs) {
          let dataItem = {
            id:doc.id,
            contentEN: doc.get("contentEN"),
            contentTC: doc.get("contentTC"),
            titleEN:doc.get("titleEN"),
            titleTC:doc.get("titleTC"),
          }
          data.push(dataItem);
          // Use deviceData here
        }
        haveData = true;
      }
  
      return { success: true,data:data,haveData:haveData};
    } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  };

  export const deleteAllNotificationByUserID = async (userID: string) => {
    try {
      const userNotificationCollection = db.collection('userNotification');
      const userNotificationDocs = await userNotificationCollection.where('userID', '==', userID).get();
  
      if (!userNotificationDocs.empty) {
        for (const doc of userNotificationDocs.docs) {
          await doc.ref.delete();
        }
      }
  
      return { success: true, message: "Notifications deleted successfully" };
    } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  };

  export const deleteOneNotificationByUserID = async (notificationID: string) => {
    try {
      const userNotificationCollection = db.collection('userNotification');
      const userNotificationDoc = await userNotificationCollection.doc(notificationID);
  
      await userNotificationDoc.delete();

  
      return { success: true, message: "Notifications deleted successfully" };
    } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  };


  


  export const getStudentReward = async (studentID: string) => {
    try {
        const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
        const rewardCollection = db.collection("academicYear").doc(yearSelector).collection("reward")
        const getStudentRewardDoc = await rewardCollection.where('studentId','==',studentID).get();
        let studentRewards: any[] = [];
        let haveData =false;
        //let data;
        if(getStudentRewardDoc.docs[0]){
          studentRewards = getStudentRewardDoc.docs[0].get('reward');
          haveData = true;
        }
        console.log(getStudentRewardDoc.docs[0].get('reward'));

        
        return { success: true, data: studentRewards, haveData:haveData };
    } catch (error: any) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
  };

  export const getTodayAttendance = async (studentID: string,classID:string,date:string) => {
    try {
        const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
        const studentAttendanceCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/attendance/${date}/studentAttendanceList`);  
        const getStudentAttendanceDoc = await studentAttendanceCollection.where('studentNumber','==',studentID).get();
        let haveData =false;
        let data:any = [];
        if(getStudentAttendanceDoc.docs[0]){
          haveData = true;
          data = {
            //status: getStudentAttendanceDoc.docs[0].get('status'),
            takeAttendanceTime: getStudentAttendanceDoc.docs[0].get('takeAttendanceTime'),
          }

        }        
        return { success: true, data: data, haveData:haveData};
    } catch (error: any) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
  };


  export const getTheCanlendar = async () => {
    try {
      const filePath = path.join(__dirname, '../../', 'assets', "school_canlendar.png");
      const fileContents = fs.readFileSync(filePath);
      return { success:true, exist: true, fileContents: fileContents, message: `Get canlendar`};
      //return { success:true, exist: true, fileContents: fileContents, message: `Get homework data successfully`};
    } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }
  }

  
  export const getStudentClassID = async (studentId:string,classID:string) => {
    try{
      const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
      const classmateCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/classmate/`);
      const classmateDoc = await classmateCollection.where('studentId','==',studentId).get()
    
      if(classmateDoc.docs[0]){
        let classNumber = classmateDoc.docs[0].get('classNumber');
        return { success:true, classNumber: classNumber, message: `get number successfully`};
      }
      return { success: false, message: `get number failed` };
    }catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }


  
  }




  
  export {updateTeacher,getAllLogs,logMovement,updateUser,deleteOneParentAccount,getAllParentsData,getAllAdmins,getAllTeachers,addTeacher,verifyUserToken,addAdmin,getAllStudents,addParent,deleteAllUserAccounts,AdminRegsiter,ParentRegister,TeacherRegister};
  