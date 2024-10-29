import { RouterContext } from "koa-router";
import * as service from "../services/class"; 
import {
    ClassMateInfo,
    ClassHomeworkModal,
    ClassExamGradeModal,
    attendanceSubmitModal,
    ClassTeacherModal,
} from "../models/Class";


export const createClass = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    let result = await service.createClass();
    if (result.success) {
      ctx.status = 201;
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
    await next();
};

export const getAcademicYearWithClasses = async (ctx: RouterContext, next: any) => {
    try {
      const userList = await service.getAcademicYearWithClasses();
      ctx.body = userList;
      await next();
    } catch (error) {
      console.error(error);
      ctx.status = 500;
      //ctx.body = { error: 'An error occurred while retrieving all students' };
    }
};

export const getClassmateByAcademicYearAndClass = async (ctx: RouterContext, next: any) => {
    const body: unknown = ctx.request.body;
    const year = ctx.params.year;
    const classID = ctx.params.classID;
    //const data: service.ParentRegister = body as service.ParentRegister;
    let result = await service.getClassmateByAcademicYearAndClass(year,classID);
    if (result.success) {
      ctx.status = 201;
      ctx.body = result.data;
    } else {
      ctx.status = 500;
      console.log(result);
      ctx.body = result;
    }
    await next();
};

export const getUnassignedStudentsAndClass = async (ctx: RouterContext, next: any) => {
  try {
    const userList = await service.getUnassignedStudents();
    ctx.body = { userList};
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    //ctx.body = { error: 'An error occurred while retrieving all students' };
  }
  await next();
};


export const addStudentToClass = async (ctx: RouterContext, next: any) => {
  try {
    const body: unknown = ctx.request.body;
    const academicYearValue:string = (body as { academicYearValue: string }).academicYearValue;
    console.log(academicYearValue);
    const data: { sid: string, classId: string } = (body as { fullSelected: { sid: string, classId: string } }).fullSelected;
    //console.log(data);
    const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
    const result = await service.addStudentsToClass(data,actorUid,academicYearValue);
    if (result.success) {
      ctx.status = 201;
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { success: false, message: 'An error occurred while adding the student to the class.' };
  }

  await next();
};

export const redistributeClassNumber = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const classID: string = (body as { data: string }).data;
  const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
  const academicYearValue:string = (body as { academicYearValue: string }).academicYearValue;
  let result = await service.redistributeClassNumber(classID,academicYearValue);
  if (result.success) {
    ctx.status = 201;
    // await service.logMovement(actorUid,uid,"upDate Teacher User");
    await service.logMovement(actorUid,null,"Re distrubute class number for class "+classID);
    ctx.body = result;
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
};

export const removeStudentFromClass = async (ctx: RouterContext, next: any) => {
  //const body: unknown = ctx.request.body;
  const studentID = ctx.params.studentID;
  const classID = ctx.params.classID;
  const actorUid = ctx.params.CurrentUserUid;
  const academicYearValue = ctx.params.academicYearValue;
  let result = await service.removeStudentFromClass(classID,studentID,academicYearValue);
  if (result.success) {
    ctx.status = 201;
    await service.logMovement(actorUid,studentID,"remove student from class "+classID);
    ctx.body = result;
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
};

export const getClassHomework = async (ctx: RouterContext, next: any) => {
  try {
    const year = ctx.params.year;
    const classID = ctx.params.classID;
    console.log(year);
    const userList = await service.getClassHomework(classID,year);
    ctx.body = userList;
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    //ctx.body = { error: 'An error occurred while retrieving all students' };
  }
  await next();
};


export const editHomework = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const data: ClassHomeworkModal = (body as { data: ClassHomeworkModal }).data;
  const date = ctx.params.date;
  const classID = ctx.params.classID;
  const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
  const academicYearValue:string = (body as { yearSelector: string }).yearSelector;
  let result = await service.editHomework(classID,date,data,academicYearValue);
  console.log(result);
  if (result.success) {
    ctx.status = 201;
    await service.logMovement(actorUid,null,"Edid "+classID + " class " + date + " day homework ");
    ctx.body = result;
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
};


export const addClassToGrade = async (ctx: RouterContext, next: any) => {
  try {
    const body: unknown = ctx.request.body;
    //console.log("body: " + JSON.stringify(body));

    //const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
    const result = await service.addClassToGrade();
    if (result.success) {
      ctx.status = 201;
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { success: false, message: 'An error occurred while adding all class to grade.' };
  }

  await next();
};




export const addClassExamGrade = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const data: ClassExamGradeModal[] = (body as { data: ClassExamGradeModal[]}).data;
  const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
  const classID: string = (body as { classID: string}).classID;
  const termDate: string = (body as { termDate: string}).termDate;
  const year: string = (body as { year: string}).year;

  let result = await service.addClassExamGrade(classID,year,termDate,data,actorUid);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result;
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
};

export const getAllDocumentsInCollection = async (ctx: RouterContext, next: any) => {
  try {
    const termDate = ctx.params.termDate;
    const classID = ctx.params.classID;
    const year = ctx.params.year;
    const list = await service.getAllDocumentsInCollection(year,termDate,classID);
    const list2 = await service.getNoGradeStudentInClass(year,termDate,classID);
    ctx.body = { list, list2 };
    await next();
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    //ctx.body = { error: 'An error occurred while retrieving all students' };
  }
};

export const editExam = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const data: ClassExamGradeModal = (body as { data: ClassExamGradeModal }).data;
  const classID: string = (body as { classID: string}).classID;
  const termDate: string = (body as { termDate: string}).termDate;
  const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
  const year: string = (body as { year: string}).year;
  console.log(data)
  let result = await service.editExam(classID,year,termDate,data);
  if (result.success) {
    ctx.status = 201;
    await service.logMovement(actorUid,data.docID,"Edit " + classID + " class " + data.studentName + " "+termDate + " exam mark ");
    ctx.body = result;
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
};

export const submitAttendance = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const data: attendanceSubmitModal[] = (body as { data: attendanceSubmitModal[] }).data;
  const selectedYear: string = (body as { year: string}).year;
  const classID: string = (body as { classID: string}).classID;
  const attendanceDate: string = (body as { attendanceDate: string}).attendanceDate;
  const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
  //console.log(data);
  let result = await service.submitAttendance(data,selectedYear,classID,attendanceDate);
  if (result.success) {
    ctx.status = 201;
    await service.logMovement(actorUid,null,"Submit attendance for class "+classID + " on " + attendanceDate);
    ctx.body = result;
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
}

export const getAttendanceDateInfo = async (ctx: RouterContext, next: any) => {
  try {
    const body: unknown = ctx.request.body;
    const selectedYear: string = (body as { year: string}).year;
    const classID: string = (body as { classID: string}).classID;
    const attendanceDate: string = (body as { attendanceDate: string}).attendanceDate;
    const classNumber: string = (body as { classNumber: string}).classNumber;
    const result = await service.getAttendanceDateInfo(classNumber,selectedYear,classID,attendanceDate);
    ctx.body = result;
    await next();
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    //ctx.body = { error: 'An error occurred while retrieving all students' };
  }
};

export const getWholeYearClassGrade = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const selectedYear: string = (body as { year: string}).year;
  let result = await service.getWholeYearClassGrade(selectedYear);
  if (result.success) {
    ctx.status = 201;
    //await service.logMovement(actorUid,uid,"delete teacher user");
    ctx.body = result;
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
};

export const uploadHomeworkImage = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const files:any = ctx.request.files;
  const selectedClass: string = (body as { selectedClass: string}).selectedClass;
  const selectedDate: string = (body as { selectedDate: string}).selectedDate;
  const selectedYear: string = (body as { selectedYear: string}).selectedYear;
  const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
  const result = await service.uploadHomeworkImage(files,selectedClass,selectedYear,selectedDate);
  if(result.success){
      ctx.status = 201;
      ctx.body = result;
  }else{
      ctx.status = 500;
      ctx.body = result;
  }
  await next();
};

export const getAllClassTeachers = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const year = ctx.params.year;
  let result = await service.getAllClassTeachers(year);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result.data;
  } else {
    ctx.status = 500;
    console.log(result);
    ctx.body = result;
  }
  await next();
};

export const getAllUnAssignTeachers = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const year: string = (body as { year: string}).year;
  let result = await service.getNotAssignTeacher(year);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result.data;
  } else {
    ctx.status = 500;
    console.log(result);
    ctx.body = result;
  }
  await next();
};

export const addTeacherToClass = async (ctx: RouterContext, next: any) => {
  try {
    const body: unknown = ctx.request.body;
    const academicYearValue:string = (body as { academicYearValue: string }).academicYearValue;
    const data: ClassTeacherModal[] = (body as { fullSelected: ClassTeacherModal[]}).fullSelected;
    console.log(academicYearValue);
    const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
    const result = await service.addTeachersToClass(academicYearValue,data,actorUid);
    if (result.success) {
      ctx.status = 201;
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { success: false, message: 'An error occurred while adding the student to the class.' };
  }

  await next();
};

export const deleteTeacherInClass = async (ctx: RouterContext, next: any) => {
  try {
    const body: unknown = ctx.request.body;
    const academicYearValue:string = (body as { academicYearValue: string }).academicYearValue;
    const classId: string = (body as { classId: string}).classId;
    const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
    const result = await service.deleteTeacherInClass(academicYearValue,classId);
    if (result.success) {
      ctx.status = 201;
      await service.logMovement(actorUid,null,"delete teacher in class "+classId);
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { success: false, message: 'An error occurred while adding the student to the class.' };
  }

  await next();
};

export const deleteHomeworkInClass = async (ctx: RouterContext, next: any) => {
  try {
    const body: unknown = ctx.request.body;
    const academicYearValue:string = (body as { academicYearValue: string }).academicYearValue;
    const classId: string = (body as { classId: string}).classId;
    const homeworkId: string = (body as { homeworkId: string}).homeworkId;
    const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
    const result = await service.deleteHomeworkInClass(homeworkId,academicYearValue,classId);
    if (result.success) {
      ctx.status = 201;
      await service.logMovement(actorUid,null,"delete homework in class "+classId+" in day "+homeworkId);
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { success: false, message: 'An error occurred while adding the student to the class.' };
  }

  await next();
};

export const addClassTimeTable = async (ctx: RouterContext, next: any) => {
  try {
    const body: unknown = ctx.request.body;
    const classID:string = (body as { classID: string }).classID;
    const data: any[] = (body as { data: any[]}).data;
    //const actorUid: string = (body as { CurrentUserUid: string }).CurrentUserUid;
    const result = await service.addClassTimeTable(data,classID);
    if (result.success) {
      ctx.status = 201;
      ctx.body = result;
    } else {
      ctx.status = 500;
      ctx.body = result;
    }
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { success: false, message: 'An error occurred while adding the student to the class.' };
  }

  await next();
};

export const getClassTimeTable = async (ctx: RouterContext, next: any) => {
  const body: unknown = ctx.request.body;
  const classID: string = (body as { classID: string}).classID;
  const result = await service.getClassTimeTable(classID);
  if (result.success) {
    ctx.status = 201;
    ctx.body = result;
  } else {
    ctx.status = 500;
    ctx.body = result;
  }
  await next();
};