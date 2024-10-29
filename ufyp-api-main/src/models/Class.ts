export type ClassMateInfo ={
    studentId : ''
    studentChiName:''
    studentEngName:''
    classNumber:''
}

export type ClassHomeworkModal = {
  chi:string
  eng:string
  math:string
  gs:string
  other:string
}

export type ClassExamGradeModal = {
  studentName:''
  classNumber:''
  docID:''
  chi:''
  eng:''
  math:''
  gs:''
}

export type attendanceSubmitModal = {
  classNumber:string;
  studentChiName:string;
  studentEngName:string;
  studentNumber:string;
  selectedValue:'';
}

export type ClassTeacherModal ={
  t_Id:string;
  t_ChiName : string;
  t_EngName: string;
  classId:string;
}