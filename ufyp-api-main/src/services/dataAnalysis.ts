import { firestore as db} from "../utilities/Firebase";
import { auth } from "../utilities/Firebase";
import { 
    inputSearchAttendanceModal,
    ExamRecordModal,
} from '../models/dataAnalysis'


export const searchAttendance = async (data: inputSearchAttendanceModal) => {
    try {
        let studentAttendanceData: any[] = [];
        let numberCounter = 0;
        if(data.selectMethod === 'singleInput'){
            // Search for the class of the student
            const classCollection = await db.collection(`academicYear/${data.selectedYear}/class`);
            const querySnapshot = await classCollection.get();

            let classIdValue: string | undefined;

            await Promise.all(querySnapshot.docs.map(async (doc) => {
                const classID = doc.id;
                const classmateCollection = db.collection(`academicYear/${data.selectedYear}/class/${classID}/classmate`);
        
                const querySnapshot = await classmateCollection.where("studentId", "==", data.searchStudentId).get();
                if (!querySnapshot.empty) {
                    classIdValue = classID;
                }
            }));

            const studentAttendanceCollection = db.collection(`academicYear/${data.selectedYear}/class/${classIdValue}/attendance`);
            const querystudentAttendanceSnapshot = await studentAttendanceCollection.get();

            const now = new Date();
            for (const doc of querystudentAttendanceSnapshot.docs) {
                const attendanceDate = new Date(doc.id);
                if (attendanceDate > now) {
                    break;
                }
                numberCounter++;
                const studentAttendanceListCollection = db.collection(`academicYear/${data.selectedYear}/class/${classIdValue}/attendance/${doc.id}/studentAttendanceList`);
                const querystudentAttendanceListSnapshot = await studentAttendanceListCollection.where("studentNumber", "==", data.searchStudentId).get();
                if (!querystudentAttendanceListSnapshot.empty) {
                    const attendanceData = querystudentAttendanceListSnapshot.docs[0].data();
                    studentAttendanceData.push({ attendanceDate: doc.id, ...attendanceData });
                }
            }

            return { success: true, data: studentAttendanceData,totalDay:numberCounter};
            //return { success: true, data: getStudentAttendanceData };
        }else if(data.selectMethod === 'singleClass'){
            const studentAttendanceCollection = db.collection(`academicYear/${data.selectedYear}/class/${data.classID}/attendance`);
            const querystudentAttendanceSnapshot = await studentAttendanceCollection.get();

            const now = new Date();
            for (const doc of querystudentAttendanceSnapshot.docs) {
                const attendanceDate = new Date(doc.id);
                if (attendanceDate > now) {
                    break;
                }
                numberCounter++;
                const studentAttendanceListCollection = db.collection(`academicYear/${data.selectedYear}/class/${data.classID}/attendance/${doc.id}/studentAttendanceList`);
                const querystudentAttendanceListSnapshot = await studentAttendanceListCollection.where("studentNumber", "==", data.searchStudentId).get();
                if (!querystudentAttendanceListSnapshot.empty) {
                    const attendanceData = querystudentAttendanceListSnapshot.docs[0].data();
                    studentAttendanceData.push({ attendanceDate: doc.id, ...attendanceData });
                }
            }

            return { success: true, data: studentAttendanceData,totalDay:numberCounter};
        }else if(data.selectMethod === "checkWholeClass"){
            // const studentAttendanceCollection = db.collection(`academicYear/${data.selectedYear}/class/${data.classID}/attendance`);
            // const querystudentAttendanceSnapshot = await studentAttendanceCollection.get();
            let dateParts = data.attendanceDate.split('-');
            let year = dateParts[0];
            let month = dateParts[1];
            const startDateRange = new Date(`${data.attendanceDate}-01`);
            const endDateRange = new Date(`${data.attendanceDate}-${getDaysInMonth(parseInt(year),parseInt(month))}`);
            const studentAttendanceCollection = db.collection(`academicYear/${data.selectedYear}/class/${data.classID}/attendance`);
            const querystudentAttendanceSnapshot = await studentAttendanceCollection.where('date','>=',startDateRange).where('date','<=',endDateRange).get();
            const now = new Date();
            for (const doc of querystudentAttendanceSnapshot.docs) {
                const attendanceDate = new Date(doc.id);
                if (attendanceDate <= now) {
                    const studentAttendanceListCollection = db.collection(`academicYear/${data.selectedYear}/class/${data.classID}/attendance/${doc.id}/studentAttendanceList`);
                    const querySnapshot = await studentAttendanceListCollection.get();
                    await Promise.all(querySnapshot.docs.map(async (document) => {
                      const attendanceData = document.data();
                      studentAttendanceData.push({ attendanceDate: doc.id, ...attendanceData });
                    }));
                }
                if (attendanceDate > now) {
                    break;
                }
                
                numberCounter++;
            }
            return { success: true, data: studentAttendanceData,totalDay:numberCounter};
        }
    



      return { success: true,data: studentAttendanceData};
    } catch (error: any) {
      console.error(error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }
};

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
}


export const searchExamRecord = async (data: ExamRecordModal) => {
    try {
        let studentExamRecord:any = [];
        const classCollection = await db.collection(`academicYear/${data.selectedYear}/class/${data.selectedClassID}/classmate`).get();
        const classmateCollection = await db.collection(`academicYear/${data.selectedYear}/grade/${data.selectedTerm}/class/${data.selectedClassID}/classmate`).get();
        classmateCollection.forEach((doc) => {
            const classmateId = doc.id;
            const classmateGradeData = doc.data();
            const classmateRecord: any = { ...classmateGradeData };
            classCollection.forEach((classDoc) => {
                
                if (classDoc.id === classmateId) {
                    console.log(classDoc.id);
                  const classData = classDoc.data();
                  Object.assign(classmateRecord, classData);
                }
            });


            studentExamRecord.push(classmateRecord);
        });

      return { success: true,data: studentExamRecord};
    } catch (error: any) {
      console.error(error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }
}