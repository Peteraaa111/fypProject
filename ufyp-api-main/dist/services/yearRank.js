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
exports.logMovement = exports.distributeNextYearClass = exports.generateRank = exports.getStudentRankByYear = exports.createClass = void 0;
const Firebase_1 = require("../utilities/Firebase");
const Constant_1 = require("../models/Constant");
const createClass = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const academicYearRef = Firebase_1.firestore.collection('academicYear');
        const currentYear = Constant_1.ConstantYear.nextYear;
        const nextYear = currentYear + 1;
        const academicYearId = `${currentYear}-${nextYear}`;
        const classRef = academicYearRef.doc(academicYearId).collection('class');
        const classes = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'];
        // Check if the academic year document exists
        const academicYearDoc = yield academicYearRef.doc(academicYearId).get();
        if (!academicYearDoc.exists) {
            // Create the academic year document
            yield academicYearRef.doc(academicYearId).set({});
        }
        const batch = Firebase_1.firestore.batch();
        classes.forEach(className => {
            const classInfo = classRef.doc(className);
            batch.set(classInfo, {});
        });
        yield batch.commit();
        return { success: true, message: "All classes created successfully" };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.createClass = createClass;
const getStudentRankByYear = (yearSelectValue) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const academicYearId = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const yearlyRankCollection = Firebase_1.firestore.collection(`academicYear/${academicYearId}/yearlyRank`);
        const yearDocRef = yield yearlyRankCollection.doc(`Year${yearSelectValue}`);
        const studentRankCollection = yearDocRef.collection('studentRank');
        const snapshot = yield studentRankCollection.get();
        const data = snapshot.docs.map((doc) => doc.data());
        return { success: true, data };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getStudentRankByYear = getStudentRankByYear;
const generateRank = (data, yearSelectValue) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const academicYearId = `${Constant_1.ConstantYear.currentYear}-${Constant_1.ConstantYear.nextYear}`;
        const yearlyRankCollection = Firebase_1.firestore.collection(`academicYear/${academicYearId}/yearlyRank`);
        const yearDocRef = yield yearlyRankCollection.doc(`Year${yearSelectValue}`);
        const studentRankCollection = yearDocRef.collection('studentRank');
        for (const item of data) {
            const docId = `Year${yearSelectValue}Rank${item.rank}`;
            yield studentRankCollection.doc(docId).set(item);
        }
        return { success: true, message: 'Rank have been generated' };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.generateRank = generateRank;
const distributeNextYearClass = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentYear = Constant_1.ConstantYear.nextYear;
        const nextYear = currentYear + 1;
        const academicYearId = `${currentYear}-${nextYear}`;
        const classCollection = Firebase_1.firestore.collection(`academicYear/${academicYearId}/class`);
        // Check if the classCollection is empty
        const classDocs = yield classCollection.get();
        if (classDocs.empty) {
            console.log("testing");
            yield (0, exports.createClass)();
        }
        for (const item of data) {
            const studentDocIDResult = yield findStudentDocId(item.studentID);
            if (studentDocIDResult.success) {
                if (item.expectedClassID === "graduate") {
                    updateStudentData(item.studentID);
                }
                else {
                    const classRef = yield classCollection.doc(item.expectedClassID);
                    const classmateCollection = classRef.collection('classmate');
                    const classmateDocs = yield classmateCollection.get();
                    const totalDocs = classmateDocs.size + 1;
                    yield classmateCollection.doc(studentDocIDResult.id).set({
                        classNumber: totalDocs,
                        studentId: item.studentID,
                        studentChiName: item.studentChiName,
                        studentEngName: item.studentEngName,
                    });
                }
            }
        }
        return { success: true, message: 'class have been distribute for next year' };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.distributeNextYearClass = distributeNextYearClass;
const findStudentDocId = (studentID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentsCollection = Firebase_1.firestore.collection('students');
        const querySnapshot = yield studentsCollection.where('s_Id', '==', studentID).get();
        if (querySnapshot.empty) {
            return { success: false, message: 'No matching documents found' };
        }
        const docId = querySnapshot.docs[0].id;
        return { success: true, id: docId };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
const updateStudentData = (studentID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentsCollection = Firebase_1.firestore.collection('students');
        const querySnapshot = yield studentsCollection.where('s_Id', '==', studentID).get();
        if (querySnapshot.empty) {
            return { success: false, message: 'No matching documents found' };
        }
        const studentDocSnapshot = querySnapshot.docs[0];
        const studentData = studentDocSnapshot.data();
        const currentYear = new Date().getFullYear();
        const graduateDate = new Date(currentYear, 6, 15); // July 15th of the current year
        const graduateDateString = graduateDate.toLocaleDateString('en-US');
        const updateData = {
            graduate: true,
            graduateDate: graduateDateString,
        };
        yield studentDocSnapshot.ref.update(updateData);
        return { success: true, message: 'Student data updated successfully' };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
const logMovement = (actorUid, targetUid, action) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logRef = Firebase_1.firestore.collection('logs');
        const logData = {
            actorUid: actorUid,
            TargetUid: targetUid,
            action: action,
            timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong' }),
        };
        yield logRef.add(logData);
        return { success: true, message: "log created" };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.logMovement = logMovement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWVhclJhbmsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMveWVhclJhbmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQXVEO0FBTXZELGlEQUFrRDtBQUUzQyxNQUFNLFdBQVcsR0FBRyxHQUFTLEVBQUU7SUFDbEMsSUFBSTtRQUNGLE1BQU0sZUFBZSxHQUFHLG9CQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sV0FBVyxHQUFHLHVCQUFZLENBQUMsUUFBUSxDQUFDO1FBQzFDLE1BQU0sUUFBUSxHQUFHLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDakMsTUFBTSxjQUFjLEdBQUcsR0FBRyxXQUFXLElBQUksUUFBUSxFQUFFLENBQUM7UUFDcEQsTUFBTSxRQUFRLEdBQUcsZUFBZSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFekUsTUFBTSxPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXpGLDZDQUE2QztRQUM3QyxNQUFNLGVBQWUsR0FBRyxNQUFNLGVBQWUsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFeEUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUU7WUFDM0Isb0NBQW9DO1lBQ3BDLE1BQU0sZUFBZSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDbkQ7UUFFRCxNQUFNLEtBQUssR0FBRyxvQkFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3pCLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDMUIsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMxQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRXJCLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxrQ0FBa0MsRUFBRSxDQUFDO0tBQ3ZFO0lBQUMsT0FBTyxLQUFTLEVBQUU7UUFDbEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyQixPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO0tBQ3ZFO0FBQ0wsQ0FBQyxDQUFBLENBQUM7QUEvQlcsUUFBQSxXQUFXLGVBK0J0QjtBQUdLLE1BQU0sb0JBQW9CLEdBQUcsQ0FBTyxlQUF1QixFQUFFLEVBQUU7SUFDbEUsSUFBSTtRQUNGLE1BQU0sY0FBYyxHQUFHLEdBQUcsdUJBQVksQ0FBQyxXQUFXLElBQUksdUJBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM5RSxNQUFNLG9CQUFvQixHQUFHLG9CQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixjQUFjLGFBQWEsQ0FBQyxDQUFDO1FBRXhGLE1BQU0sVUFBVSxHQUFHLE1BQU0sb0JBQW9CLENBQUMsR0FBRyxDQUFDLE9BQU8sZUFBZSxFQUFFLENBQUMsQ0FBQztRQUM1RSxNQUFNLHFCQUFxQixHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFbkUsTUFBTSxRQUFRLEdBQUcsTUFBTSxxQkFBcUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVuRCxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFFcEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUM7S0FDaEM7SUFBQyxPQUFPLEtBQVUsRUFBRTtRQUNuQixPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO0tBQ3ZFO0FBQ0gsQ0FBQyxDQUFBLENBQUM7QUFoQlMsUUFBQSxvQkFBb0Isd0JBZ0I3QjtBQUdHLE1BQU0sWUFBWSxHQUFHLENBQU8sSUFBcUIsRUFBRSxlQUF1QixFQUFFLEVBQUU7SUFDakYsSUFBSTtRQUNGLE1BQU0sY0FBYyxHQUFHLEdBQUcsdUJBQVksQ0FBQyxXQUFXLElBQUksdUJBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM5RSxNQUFNLG9CQUFvQixHQUFHLG9CQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixjQUFjLGFBQWEsQ0FBQyxDQUFDO1FBRXhGLE1BQU0sVUFBVSxHQUFHLE1BQU0sb0JBQW9CLENBQUMsR0FBRyxDQUFDLE9BQU8sZUFBZSxFQUFFLENBQUMsQ0FBQztRQUM1RSxNQUFNLHFCQUFxQixHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFbkUsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLEVBQUU7WUFDdkIsTUFBTSxLQUFLLEdBQUcsT0FBTyxlQUFlLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3ZELE1BQU0scUJBQXFCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNsRDtRQUVELE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxDQUFDO0tBQy9EO0lBQUMsT0FBTyxLQUFVLEVBQUU7UUFDbkIsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztLQUN2RTtBQUNMLENBQUMsQ0FBQSxDQUFDO0FBakJXLFFBQUEsWUFBWSxnQkFpQnZCO0FBR0ssTUFBTSx1QkFBdUIsR0FBRyxDQUFPLElBQW9DLEVBQUUsRUFBRTtJQUNsRixJQUFJO1FBQ0EsTUFBTSxXQUFXLEdBQUcsdUJBQVksQ0FBQyxRQUFRLENBQUM7UUFDMUMsTUFBTSxRQUFRLEdBQUcsV0FBVyxHQUFHLENBQUMsQ0FBQztRQUNqQyxNQUFNLGNBQWMsR0FBRyxHQUFHLFdBQVcsSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUNwRCxNQUFNLGVBQWUsR0FBRyxvQkFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsY0FBYyxRQUFRLENBQUMsQ0FBQztRQUU5RSx3Q0FBd0M7UUFDeEMsTUFBTSxTQUFTLEdBQUcsTUFBTSxlQUFlLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDOUMsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1lBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkIsTUFBTSxJQUFBLG1CQUFXLEdBQUUsQ0FBQztTQUN2QjtRQUVELEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxFQUFFO1lBQ3JCLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDbEUsSUFBRyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUM7Z0JBQzFCLElBQUcsSUFBSSxDQUFDLGVBQWUsS0FBSyxVQUFVLEVBQUM7b0JBQ25DLGlCQUFpQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDckM7cUJBQUk7b0JBQ0QsTUFBTSxRQUFRLEdBQUcsTUFBTSxlQUFlLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtvQkFDaEUsTUFBTSxtQkFBbUIsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUM3RCxNQUFNLGFBQWEsR0FBRyxNQUFNLG1CQUFtQixDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUN0RCxNQUFNLFNBQVMsR0FBRyxhQUFhLENBQUMsSUFBSSxHQUFDLENBQUMsQ0FBQztvQkFDdkMsTUFBTSxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsRUFBRyxDQUFDLENBQUMsR0FBRyxDQUFDO3dCQUN4RCxXQUFXLEVBQUMsU0FBUzt3QkFDckIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO3dCQUN6QixjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWM7d0JBQ25DLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYztxQkFDcEMsQ0FBQyxDQUFDO2lCQUNOO2FBQ0o7U0FDSjtRQUVILE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSwwQ0FBMEMsRUFBRSxDQUFDO0tBQy9FO0lBQUMsT0FBTyxLQUFVLEVBQUU7UUFDbkIsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztLQUN2RTtBQUNMLENBQUMsQ0FBQSxDQUFDO0FBdENXLFFBQUEsdUJBQXVCLDJCQXNDbEM7QUFFRixNQUFNLGdCQUFnQixHQUFHLENBQU8sU0FBaUIsRUFBRSxFQUFFO0lBQ2pELElBQUk7UUFDRixNQUFNLGtCQUFrQixHQUFHLG9CQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sYUFBYSxHQUFHLE1BQU0sa0JBQWtCLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFcEYsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFO1lBQ3ZCLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxDQUFDO1NBQ25FO1FBRUQsTUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFFdkMsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDO0tBQ3JDO0lBQUMsT0FBTyxLQUFVLEVBQUU7UUFDbkIsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztLQUN2RTtBQUNMLENBQUMsQ0FBQSxDQUFDO0FBRUYsTUFBTSxpQkFBaUIsR0FBRyxDQUFPLFNBQWlCLEVBQUUsRUFBRTtJQUNsRCxJQUFJO1FBQ0YsTUFBTSxrQkFBa0IsR0FBRyxvQkFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNyRCxNQUFNLGFBQWEsR0FBRyxNQUFNLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRXBGLElBQUksYUFBYSxDQUFDLEtBQUssRUFBRTtZQUN2QixPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsQ0FBQztTQUNuRTtRQUVELE1BQU0sa0JBQWtCLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRCxNQUFNLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUU5QyxNQUFNLFdBQVcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzdDLE1BQU0sWUFBWSxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxnQ0FBZ0M7UUFDbkYsTUFBTSxrQkFBa0IsR0FBRyxZQUFZLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEUsTUFBTSxVQUFVLEdBQUc7WUFDakIsUUFBUSxFQUFFLElBQUk7WUFDZCxZQUFZLEVBQUUsa0JBQWtCO1NBQ2pDLENBQUM7UUFFRixNQUFNLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFaEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLENBQUM7S0FDeEU7SUFBQyxPQUFPLEtBQVUsRUFBRTtRQUNuQixPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO0tBQ3ZFO0FBQ0gsQ0FBQyxDQUFBLENBQUM7QUFLRyxNQUFNLFdBQVcsR0FBRyxDQUFPLFFBQVksRUFBRSxTQUFjLEVBQUUsTUFBVyxFQUFFLEVBQUU7SUFDM0UsSUFBSTtRQUNGLE1BQU0sTUFBTSxHQUFHLG9CQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXJDLE1BQU0sT0FBTyxHQUFHO1lBQ2QsUUFBUSxFQUFFLFFBQVE7WUFDbEIsU0FBUyxFQUFFLFNBQVM7WUFDcEIsTUFBTSxFQUFFLE1BQU07WUFDZCxTQUFTLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFFLENBQUM7U0FDOUUsQ0FBQztRQUVGLE1BQU0sTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUxQixPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLENBQUM7S0FDbEQ7SUFBQyxPQUFPLEtBQVUsRUFBRTtRQUNuQixPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO0tBQ3ZFO0FBQ0gsQ0FBQyxDQUFBLENBQUM7QUFqQlMsUUFBQSxXQUFXLGVBaUJwQiJ9