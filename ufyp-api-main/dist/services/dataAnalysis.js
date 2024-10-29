"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchExamRecord = exports.searchAttendance = void 0;
const Firebase_1 = require("../utilities/Firebase");
const searchAttendance = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let studentAttendanceData = [];
        let numberCounter = 0;
        if (data.selectMethod === 'singleInput') {
            // Search for the class of the student
            const classCollection = yield Firebase_1.firestore.collection(`academicYear/${data.selectedYear}/class`);
            const querySnapshot = yield classCollection.get();
            let classIdValue;
            yield Promise.all(querySnapshot.docs.map((doc) => __awaiter(void 0, void 0, void 0, function* () {
                const classID = doc.id;
                const classmateCollection = Firebase_1.firestore.collection(`academicYear/${data.selectedYear}/class/${classID}/classmate`);
                const querySnapshot = yield classmateCollection.where("studentId", "==", data.searchStudentId).get();
                if (!querySnapshot.empty) {
                    classIdValue = classID;
                }
            })));
            const studentAttendanceCollection = Firebase_1.firestore.collection(`academicYear/${data.selectedYear}/class/${classIdValue}/attendance`);
            const querystudentAttendanceSnapshot = yield studentAttendanceCollection.get();
            const now = new Date();
            for (const doc of querystudentAttendanceSnapshot.docs) {
                const attendanceDate = new Date(doc.id);
                if (attendanceDate > now) {
                    break;
                }
                numberCounter++;
                const studentAttendanceListCollection = Firebase_1.firestore.collection(`academicYear/${data.selectedYear}/class/${classIdValue}/attendance/${doc.id}/studentAttendanceList`);
                const querystudentAttendanceListSnapshot = yield studentAttendanceListCollection.where("studentNumber", "==", data.searchStudentId).get();
                if (!querystudentAttendanceListSnapshot.empty) {
                    const attendanceData = querystudentAttendanceListSnapshot.docs[0].data();
                    studentAttendanceData.push(Object.assign({ attendanceDate: doc.id }, attendanceData));
                }
            }
            return { success: true, data: studentAttendanceData, totalDay: numberCounter };
            //return { success: true, data: getStudentAttendanceData };
        }
        else if (data.selectMethod === 'singleClass') {
            const studentAttendanceCollection = Firebase_1.firestore.collection(`academicYear/${data.selectedYear}/class/${data.classID}/attendance`);
            const querystudentAttendanceSnapshot = yield studentAttendanceCollection.get();
            const now = new Date();
            for (const doc of querystudentAttendanceSnapshot.docs) {
                const attendanceDate = new Date(doc.id);
                if (attendanceDate > now) {
                    break;
                }
                numberCounter++;
                const studentAttendanceListCollection = Firebase_1.firestore.collection(`academicYear/${data.selectedYear}/class/${data.classID}/attendance/${doc.id}/studentAttendanceList`);
                const querystudentAttendanceListSnapshot = yield studentAttendanceListCollection.where("studentNumber", "==", data.searchStudentId).get();
                if (!querystudentAttendanceListSnapshot.empty) {
                    const attendanceData = querystudentAttendanceListSnapshot.docs[0].data();
                    studentAttendanceData.push(Object.assign({ attendanceDate: doc.id }, attendanceData));
                }
            }
            return { success: true, data: studentAttendanceData, totalDay: numberCounter };
        }
        else if (data.selectMethod === "checkWholeClass") {
            // const studentAttendanceCollection = db.collection(`academicYear/${data.selectedYear}/class/${data.classID}/attendance`);
            // const querystudentAttendanceSnapshot = await studentAttendanceCollection.get();
            let dateParts = data.attendanceDate.split('-');
            let year = dateParts[0];
            let month = dateParts[1];
            const startDateRange = new Date(`${data.attendanceDate}-01`);
            const endDateRange = new Date(`${data.attendanceDate}-${getDaysInMonth(parseInt(year), parseInt(month))}`);
            const studentAttendanceCollection = Firebase_1.firestore.collection(`academicYear/${data.selectedYear}/class/${data.classID}/attendance`);
            const querystudentAttendanceSnapshot = yield studentAttendanceCollection.where('date', '>=', startDateRange).where('date', '<=', endDateRange).get();
            const now = new Date();
            for (const doc of querystudentAttendanceSnapshot.docs) {
                const attendanceDate = new Date(doc.id);
                if (attendanceDate <= now) {
                    const studentAttendanceListCollection = Firebase_1.firestore.collection(`academicYear/${data.selectedYear}/class/${data.classID}/attendance/${doc.id}/studentAttendanceList`);
                    const querySnapshot = yield studentAttendanceListCollection.get();
                    yield Promise.all(querySnapshot.docs.map((document) => __awaiter(void 0, void 0, void 0, function* () {
                        const attendanceData = document.data();
                        studentAttendanceData.push(Object.assign({ attendanceDate: doc.id }, attendanceData));
                    })));
                }
                if (attendanceDate > now) {
                    break;
                }
                numberCounter++;
            }
            return { success: true, data: studentAttendanceData, totalDay: numberCounter };
        }
        return { success: true, data: studentAttendanceData };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.searchAttendance = searchAttendance;
function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}
const searchExamRecord = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let studentExamRecord = [];
        const classCollection = yield Firebase_1.firestore.collection(`academicYear/${data.selectedYear}/class/${data.selectedClassID}/classmate`).get();
        const classmateCollection = yield Firebase_1.firestore.collection(`academicYear/${data.selectedYear}/grade/${data.selectedTerm}/class/${data.selectedClassID}/classmate`).get();
        classmateCollection.forEach((doc) => {
            const classmateId = doc.id;
            const classmateGradeData = doc.data();
            const classmateRecord = Object.assign({}, classmateGradeData);
            classCollection.forEach((classDoc) => {
                if (classDoc.id === classmateId) {
                    console.log(classDoc.id);
                    const classData = classDoc.data();
                    Object.assign(classmateRecord, classData);
                }
            });
            studentExamRecord.push(classmateRecord);
        });
        return { success: true, data: studentExamRecord };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.searchExamRecord = searchExamRecord;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YUFuYWx5c2lzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL2RhdGFBbmFseXNpcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxvREFBdUQ7QUFRaEQsTUFBTSxnQkFBZ0IsR0FBRyxDQUFPLElBQWdDLEVBQUUsRUFBRTtJQUN2RSxJQUFJO1FBQ0EsSUFBSSxxQkFBcUIsR0FBVSxFQUFFLENBQUM7UUFDdEMsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLElBQUcsSUFBSSxDQUFDLFlBQVksS0FBSyxhQUFhLEVBQUM7WUFDbkMsc0NBQXNDO1lBQ3RDLE1BQU0sZUFBZSxHQUFHLE1BQU0sb0JBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxZQUFZLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZGLE1BQU0sYUFBYSxHQUFHLE1BQU0sZUFBZSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBRWxELElBQUksWUFBZ0MsQ0FBQztZQUVyQyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBTyxHQUFHLEVBQUUsRUFBRTtnQkFDbkQsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDdkIsTUFBTSxtQkFBbUIsR0FBRyxvQkFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLFlBQVksVUFBVSxPQUFPLFlBQVksQ0FBQyxDQUFDO2dCQUUxRyxNQUFNLGFBQWEsR0FBRyxNQUFNLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDckcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUU7b0JBQ3RCLFlBQVksR0FBRyxPQUFPLENBQUM7aUJBQzFCO1lBQ0wsQ0FBQyxDQUFBLENBQUMsQ0FBQyxD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