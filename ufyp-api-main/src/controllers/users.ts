import { RouterContext } from "koa-router";
import * as service from "../services/users"; 
import { userEditModal } from "../models/User";


export const getAllStudents = async (ctx: RouterContext, next: any) => {
    try {
      const userList = await service.getAllStudents();
      ctx.body = userList;
      await next();
    } catch (error) {
      console.error('Error getting all students:', error);
      ctx.status = 500;
      ctx.body = { error: 'An error occurred while retrieving all students' };
    }
  };
  
export const getAllTeachers = async (ctx: RouterContext, next: any) => {
    try {
      const userList = await service.getAllTeachers();
      ctx.body = userList;
      await next();
    } catch (error) {
      console.error('Error getting all teachers:', error);
      ctx.status = 500;
      ctx.body = { error: 'An error occurred while retrieving all teachers' };
    }
  };
  
export const getAllAdmins = async (ctx: RouterContext, next: any) => {
    try {
      const userList = await service.getAllAdmins();
      ctx.body = userList;
      await next();
    } catch (error) {
      console.error('Error getting all admins:', error);
      ctx.status = 500;
      ctx.body = { error: 'An error occurred while retrieving all admins' };
    }
  };
  
export const getAllParentData = async (ctx: RouterContext, next: any) => {
    try {
      const userList = await service.getAllParentsData();
      ctx.body = userList;
      await next();
    } catch (error) {
      console.error('Error getting all Parent:', error);
      ctx.status = 500;
      ctx.body = { error: 'An error occurred while retrieving all Parent' };
    }
  };
  
  
export const getAllLogs = async (ctx: RouterContext, next: any) => {
    try {
      const logList = await service.getAllLogs();
      ctx.body = logList;
      await next();
    } catch (error) {
      console.error('Error getting all logs:', error);
      ctx.status = 500;
      ctx.body = { error: 'An error occurred while retrieving all logs' };
    }
};
  
export const upDateUserInformation = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const uid: string = (body as { uid: string }).uid;
    const phoneNumberValue: string = (body as { phoneNumber: string }).phoneNumber;
    const ParentChineseNameValue: string = (body as { chineseName: string }).chineseName;
    const homeAddressValue: string = (body as { homeAddress: string }).homeAddress;
    const actorUid: string = (body as {CurrentUserUid:string}).CurrentUserUid;
    let result = await service.updateUser(uid,phoneNumberValue,ParentChineseNameValue,homeAddressValue);
    if (result.success) {
      ctx.status = 201;
      await service.logMovement(actorUid,uid,"update User");
      //await service.logMovement(actorEmail,uid,"Update User Information");
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
    await next();
};

export const updateUserStatus = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const email: string = (body as {email:string}).email;
  const activeValue: string = (body as { status: string }).status;
  const actorUid: string = (body as {CurrentUserUid:string}).CurrentUserUid;
  console.log(email);
  console.log(activeValue);
  let result = await service.updateUserStatus(activeValue,email);
  if (result.success) {
    ctx.status = 201;
    await service.logMovement(actorUid,result.uid,"Update user to " +activeValue +" active");
    ctx.body = result;
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
};


export const updateTeacherStatus = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const id: string = (body as {id:string}).id;
  const activeValue: string = (body as { status: string }).status;
  const actorUid: string = (body as {CurrentUserUid:string}).CurrentUserUid;
  let result = await service.updateTeacherStatus(activeValue,id);
  if (result.success) {
    ctx.status = 201;
    await service.logMovement(actorUid,result.uid,"Update teacher to " +activeValue +" active");
    ctx.body = result;
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
};



  
export const upDateTeacherInformation = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const uid: string = (body as { uid: string }).uid;
    const phoneNumberValue: string = (body as { phoneNumber: string }).phoneNumber;
    const TeacherChineseNameValue: string = (body as { chineseName: string }).chineseName;
    const TeacherEnglishNameValue: string = (body as { englishName: string }).englishName;
    const homeAddressValue: string = (body as { homeAddress: string }).homeAddress;
    const actorUid: string = (body as {CurrentUserUid:string}).CurrentUserUid;
    let result = await service.updateTeacher(uid,phoneNumberValue,TeacherChineseNameValue,TeacherEnglishNameValue,homeAddressValue);
    console.log(result);
    if (result.success) {
      ctx.status = 201;
      await service.logMovement(actorUid,uid,"upDate Teacher User");
      //await service.logMovement(actorEmail,uid,"Update User Information");
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
    await next();
  };
  
export const deleteAllUsers = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    let result = await service.deleteAllUserAccounts();
    if (result.success) {
      ctx.status = 201;
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
    await next();
  };
  
export const deleteParentUser = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const uid: string = (body as { Targetuid: string }).Targetuid;
    const actorUid: string = (body as {CurrentUserUid:string}).CurrentUserUid;
    console.log(actorUid);
    //console.log(uid);
    let result = await service.deleteOneParentAccount(uid);
    if (result.success) {
      ctx.status = 201;
      await service.logMovement(actorUid,uid,"delete parent user");
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
    await next();
  };
  
export const deleteTeacherUser = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const uid: string = (body as { Targetuid: string }).Targetuid;
    const actorUid: string = (body as {CurrentUserUid:string}).CurrentUserUid;
    console.log(actorUid);
    //console.log(uid);
    let result = await service.deleteOneTeacherAccount(uid);
    if (result.success) {
      ctx.status = 201;
      await service.logMovement(actorUid,uid,"delete teacher user");
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
    await next();
  };
  
export const verifyAdmin = async (ctx: RouterContext, next: any) => {
    try {
      const body: unknown = ctx.request.body;
      const token: string = (body as { token: string }).token;
      const isAdmin = await service.verifyUserToken(token);
    
      if (isAdmin === "admin") {
        // User is an admin, proceed to the next middleware or route handler
        ctx.status = 201;
        console.log("User is admin");
        ctx.body = { isAdmin: true };
      } else {
        // User is not an admin, send an error response
        ctx.status = 201;
        console.log("User is not an admin");
        ctx.body = { isAdmin: false, error: 'User is not an admin' };
      }
      await next();
    } catch (error) {
      // An error occurred while verifying the user token
      console.error('Error verifying the user token:', error);
      ctx.status = 500; 
      ctx.body = { error: 'An error occurred while verifying the user token' };
    }
  };
  
export const addParent = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const data: service.ParentRegister = (body as { data: service.ParentRegister }).data;
    const actorUid: string = (body as {CurrentUserUid:string}).CurrentUserUid;
    //const data: service.ParentRegister = body as service.ParentRegister;
    let result = await service.addParent(data);
    if (result.success) {
      ctx.status = 201;
      await service.logMovement(actorUid,result.uid,"add Parent user");
      ctx.body = result;
    } else {
      ctx.status = 500;
      console.log(result);
      ctx.body = result;
    }
    await next();
  };
  
export const addAdmin = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const data: service.AdminRegsiter = body as service.AdminRegsiter;
    let result = await service.addAdmin(data);
    if (result.success) {
      ctx.status = 201;
      ctx.body = result; 
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
    await next();
}; 
  
export const addTeacher = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const data: service.TeacherRegister = (body as { data: service.TeacherRegister }).data;
    const size = await service.getTeacherSize();
    let dataSize = size + data.index + 1;
    const actorUid: string = (body as {CurrentUserUid:string}).CurrentUserUid;
    let result = await service.addTeacher(data,dataSize);
    if (result.success) {
      ctx.status = 201;
      await service.logMovement(actorUid,result.uid,"add Teacher user");
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
    await next();
};

export const getStudentsDataByUID = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  
  const UID: string = (body as {uid:string}).uid;

  let result = await service.getStudentsDataByUID(UID);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 


export const getTeacherDataByUID = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  
  const UID: string = (body as {uid:string}).uid;

  let result = await service.getTeacherDataByUID(UID);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 
 
 



export const editUserDataByID = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const data: userEditModal = (body as { data: userEditModal }).data;
  let result = await service.editUserDataByID(data);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 



export const getStudentFirstHalfGradeByID = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  
  const studentId: string = (body as {studentId:string}).studentId;
  const classID: string = (body as {classId:string}).classId;
  let result = await service.getStudentFirstHalfGradeByID(studentId,classID);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 
 


export const getStudentSecondHalfGradeByID = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  
  const studentId: string = (body as {studentId:string}).studentId;
  const classID: string = (body as {classId:string}).classId;

  let result = await service.getStudentSecondHalfGradeByID(studentId,classID);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 


export const getStudentAttendanceBySelectedMonth = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  
  const studentId: string = (body as {studentId:string}).studentId;
  const classID: string = (body as {classId:string}).classId;
  const year: string = (body as {year:string}).year;
  const month: string = (body as {month:string}).month;

  let result = await service.getStudentSecongetStudentAttendanceBySelectedMonthdHalfGradeByID(studentId,classID,year,month);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    console.log(result.message);
    ctx.body = result;
  }
  await next();
}; 


export const applyLeaveForStudent = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const studentId: string = (body as {sId:string}).sId;
  const reason: string = (body as {reason:string}).reason;
  const classID: string = (body as {class:string}).class;
  const date:string = (body as {date:string}).date;
  const weekday:string = (body as {weekDay:string}).weekDay;
  let result = await service.applyLeaveForStudent(studentId,reason,classID,date,weekday);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 


export const submitSystemProblem = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const studentId: string = (body as {sId:string}).sId;
  const problem: string = (body as {problem:string}).problem;
  const phoneNumber: string = (body as {phoneNumber:string}).phoneNumber;
  let result = await service.submitSystemProblem(studentId,problem,phoneNumber);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 



export const getApplyLeaveListByID = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  
  const studentId: string = (body as {studentId:string}).studentId;

  let result = await service.getApplyLeaveListByID(studentId);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 


export const getInterestClassList = async (ctx: RouterContext, next: any) => {
  try {
    const studentID = ctx.params.studentID;
    const interestClassList = await service.getAllInterestClassGroup(studentID);
    ctx.body = interestClassList;
    await next();
  } catch (error) {
    console.error('Error getting all interestClass list', error);
    ctx.status = 500;
    ctx.body = { error: 'An error occurred while retrieving all interest class list' };
  }
};

export const getAppliedInterestClassList = async (ctx: RouterContext, next: any) => {
  try {
    const studentID = ctx.params.studentID;
    const interestClassList = await service.getAppliedInterestClassGroup(studentID);
    ctx.body = interestClassList;
    await next();
  } catch (error) {
    console.error('Error getting all applied interestClass list', error);
    ctx.status = 500;
    ctx.body = { error: 'An error occurred while retrieving all applied interest class list' };
  }
};




export const applyInterestClass = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const studentId: string = (body as {sId:string}).sId;
  const interestClassID: string = (body as {interestClassID:string}).interestClassID;
  const phoneNumber: string = (body as {phoneNumber:string}).phoneNumber;
  const classId: string = (body as {classId:string}).classId;
  let result = await service.applyInterestClass(studentId,interestClassID,phoneNumber,classId);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 

export const getSchoolPhotoDocDate = async (ctx: RouterContext, next: any) => {
  try {
    const photoDocDateList = await service.getSchoolPhotoDocDate();
    ctx.body = photoDocDateList;
    await next();
  } catch (error) {
    console.error('Error getting all photo document date list', error);
    ctx.status = 500;
    ctx.body = { error: 'An error occurred while retrieving all photo doc date list' };
  }
};

export const getSchoolPhotoActivityDoc = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const date: string = (body as {date:string}).date;
  let result = await service.getSchoolPhotoActivityDoc(date);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 

export const getSchoolPhotoDoc = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const date: string = (body as {date:string}).date;
  const id:string = (body as {id:string}).id;
  let result = await service.getSchoolPhotoDoc(date,id);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 

export const getClassHomeworkByUser = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const date: string = (body as {date:string}).date;
  const classID: string = (body as {classID:string}).classID;
  let result = await service.getClassHomeworkByUser(date,classID);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 

export const getReplySlipByUser = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const studentId: string = (body as {studentID:string}).studentID;
  const classID: string = (body as {classID:string}).classID;
  let result = await service.getReplySlipByUser(classID,studentId);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 


export const submitReplySlip = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const studentId: string = (body as {studentID:string}).studentID;
  const replySlipID: string = (body as {replySlipID:string}).replySlipID;
  const selectOption: string = (body as {selectOption:string}).selectOption;
  const classId: string = (body as {classID:string}).classID;
  let result = await service.submitReplySlip(studentId,replySlipID,classId,selectOption);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 

export const changeReplySlipStatus = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const studentId: string = (body as {studentID:string}).studentID;
  const replySlipID: string = (body as {replySlipID:string}).replySlipID;
  const classId: string = (body as {classID:string}).classID;
  let result = await service.changeReplySlipStatus(studentId,replySlipID,classId);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 


export const saveDeviceID = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  
  const UID: string = (body as {uid:string}).uid;
  const deviceID: string = (body as {deviceID:string}).deviceID;
  const role: string = (body as {role:string}).role;
  let result = await service.saveDeviceID(deviceID,UID,role);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    console.log(result.message);
    ctx.body = result;
  }
  await next();
}; 

export const saveLanguageCode = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  
  const languageCode: string = (body as {languageCode:string}).languageCode;
  const userID: string = (body as {userID:string}).userID;

  let result = await service.saveLanguageCode(languageCode,userID);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    console.log(result.message);
    ctx.body = result;
  }
  await next();
}; 

export const getNotificationMessage = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  
  const userID: string = (body as {userID:string}).userID;

  let result = await service.getNotificationMessage(userID);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 

export const deleteAllNotificationByUserID = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const userID: string = (body as {userID:string}).userID;

  let result = await service.deleteAllNotificationByUserID(userID);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 

export const deleteOneNotificationByUserID = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const notificationID: string = (body as {notificationID:string}).notificationID;

  let result = await service.deleteOneNotificationByUserID(notificationID);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 



export const getRewardListByID = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  
  const studentID: string = (body as {studentID:string}).studentID;

  let result = await service.getStudentReward(studentID);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 

export const getTodayAttendance = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  
  const studentId: string = (body as {studentId:string}).studentId;
  const classID: string = (body as {classID:string}).classID;
  const date: string = (body as {date:string}).date;
  let result = await service.getTodayAttendance(studentId,classID,date);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 

export const getTheCanlendar = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  let result = await service.getTheCanlendar();
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 


export const getStudentClassID = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const studentId: string = (body as {studentID:string}).studentID;
  const classID: string = (body as {classID:string}).classID;
  console.log(studentId);
  console.log(classID);
  let result = await service.getStudentClassID(studentId,classID);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result; 
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}; 