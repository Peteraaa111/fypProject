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
exports.editInterestClassStatus = exports.editInterestClassDocument = exports.getAllInterestClassGroup = exports.createInterestClassDocument = exports.getAllStudentInterestClass = exports.getAllClassAndStudentInterest = exports.logMovement = void 0;
const Firebase_1 = require("../utilities/Firebase");
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
const getAllClassAndStudentInterest = (yearSelect) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classCollection = Firebase_1.firestore.collection(`academicYear/${yearSelect}/class/`);
        const classCollectionDocs = yield classCollection.get();
        const interestClassStudentData = yield (0, exports.getAllStudentInterestClass)(yearSelect);
        const classesAndStudent = [];
        for (const classDoc of classCollectionDocs.docs) {
            const students = [];
            const classData = { class: classDoc.id, students: students };
            const classmateCollection = classDoc.ref.collection('classmate');
            const classmateDocs = yield classmateCollection.get();
            for (const classmateDoc of classmateDocs.docs) {
                const studentData = classmateDoc.data();
                const studentId = studentData.studentId;
                const studentExists = interestClassStudentData.data.some((interestClassStudent) => interestClassStudent.studentId === studentId);
                if (!studentExists) {
                    students.push(studentData);
                }
            }
            if (students.length > 0) {
                classesAndStudent.push(classData);
            }
        }
        return { success: true, data: classesAndStudent };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getAllClassAndStudentInterest = getAllClassAndStudentInterest;
const getAllStudentInterestClass = (academicYear) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docRefs = yield Firebase_1.firestore
            .collection("academicYear")
            .doc(academicYear)
            .collection("interestClassForStudent")
            .get();
        const studentInterestClass = [];
        docRefs.docs.forEach((doc) => {
            const data = doc.data();
            studentInterestClass.push(data);
        });
        return { success: true, data: studentInterestClass };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getAllStudentInterestClass = getAllStudentInterestClass;
const createInterestClassDocument = (data, selectedYear) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const interestClassForStudentCollection = Firebase_1.firestore.collection(`academicYear/${selectedYear}/interestClassGroup`);
        const snapshot = yield interestClassForStudentCollection.get();
        const count = snapshot.size;
        const hongKongTime = now.toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" });
        const newDocumentRef = interestClassForStudentCollection.doc();
        yield newDocumentRef.set({
            titleEN: data.titleEN,
            titleTC: data.titleTC,
            startDateFrom: data.startDateFrom,
            startDateTo: data.startDateTo,
            validApplyDateFrom: data.validApplyDateFrom,
            validApplyDateTo: data.validApplyDateTo,
            startTime: data.startTime,
            endTime: data.endTime,
            weekDay: data.weekDay,
            status: 'A',
            id: "interestClass" + (count + 1),
            createdAt: hongKongTime,
        });
        return { success: true, message: "Interest class created successfully", documentId: newDocumentRef.id };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.createInterestClassDocument = createInterestClassDocument;
const getAllInterestClassGroup = (year) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const snapshot = yield Firebase_1.firestore.collection(`academicYear/${year}/interestClassGroup`).where('status', 'in', ['A', 'S']).get();
        const interestClassData = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            interestClassData.push(data);
        });
        return { success: true, data: interestClassData };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.getAllInterestClassGroup = getAllInterestClassGroup;
const editInterestClassDocument = (data, selectedYear) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const interestClassForStudentCollection = Firebase_1.firestore.collection(`academicYear/${selectedYear}/interestClassGroup`);
        const querySnapshot = yield interestClassForStudentCollection.where('id', '==', data.id).get();
        const documentRef = querySnapshot.docs[0].ref;
        yield documentRef.update(data);
        return { success: true, message: "Interest class updated successfully", documentId: documentRef.id };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.editInterestClassDocument = editInterestClassDocument;
const editInterestClassStatus = (status, selectedYear, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const interestClassForStudentCollection = Firebase_1.firestore.collection(`academicYear/${selectedYear}/interestClassGroup`);
        const querySnapshot = yield interestClassForStudentCollection.where('id', '==', id).get();
        const documentRef = querySnapshot.docs[0].ref;
        yield documentRef.update({ status: status });
        // await documentRef.update(data);
        return { success: true, message: "Interest class updated successfully", documentId: documentRef.id };
    }
    catch (error) {
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.editInterestClassStatus = editInterestClassStatus;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJlc3RDbGFzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9pbnRlcmVzdENsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG9EQUF1RDtBQVNoRCxNQUFNLFdBQVcsR0FBRyxDQUFPLFFBQVksRUFBRSxTQUFjLEVBQUUsTUFBVyxFQUFFLEVBQUU7SUFDN0UsSUFBSTtRQUNGLE1BQU0sTUFBTSxHQUFHLG9CQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXJDLE1BQU0sT0FBTyxHQUFHO1lBQ2QsUUFBUSxFQUFFLFFBQVE7WUFDbEIsU0FBUyxFQUFFLFNBQVM7WUFDcEIsTUFBTSxFQUFFLE1BQU07WUFDZCxTQUFTLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFFLENBQUM7U0FDOUUsQ0FBQztRQUVGLE1BQU0sTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUxQixPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLENBQUM7S0FDbEQ7SUFBQyxPQUFPLEtBQVUsRUFBRTtRQUNuQixPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO0tBQ3ZFO0FBQ0gsQ0FBQyxDQUFBLENBQUM7QUFqQlcsUUFBQSxXQUFXLGVBaUJ0QjtBQUVLLE1BQU0sNkJBQTZCLEdBQUcsQ0FBTyxVQUFrQixFQUFFLEVBQUU7SUFDdEUsSUFBSTtRQUNGLE1BQU0sZUFBZSxHQUFHLG9CQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixVQUFVLFNBQVMsQ0FBQyxDQUFDO1FBQzNFLE1BQU0sbUJBQW1CLEdBQUcsTUFBTSxlQUFlLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDeEQsTUFBTSx3QkFBd0IsR0FBRyxNQUFNLElBQUEsa0NBQTBCLEVBQUMsVUFBVSxDQUFDLENBQUM7UUFFOUUsTUFBTSxpQkFBaUIsR0FBVSxFQUFFLENBQUM7UUFDcEMsS0FBSyxNQUFNLFFBQVEsSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLEVBQUU7WUFDL0MsTUFBTSxRQUFRLEdBQVUsRUFBRSxDQUFDO1lBQzNCLE1BQU0sU0FBUyxHQUFHLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFDLFFBQVEsRUFBQyxDQUFDO1lBQzNELE1BQU0sbUJBQW1CLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDakUsTUFBTSxhQUFhLEdBQUcsTUFBTSxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUV0RCxLQUFLLE1BQU0sWUFBWSxJQUFJLGFBQWEsQ0FBQyxJQUFJLEVBQUU7Z0JBQzdDLE1BQU0sV0FBVyxHQUFHLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDeEMsTUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQztnQkFDeEMsTUFBTSxhQUFhLEdBQUcsd0JBQXdCLENBQUMsSUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLG9CQUF5QixFQUFFLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDLENBQUM7Z0JBQ3ZJLElBQUksQ0FBQyxhQUFhLEVBQUU7b0JBQ2hCLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQzlCO2FBQ0Y7WUFFRCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUN2QixpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDbkM7U0FDRjtRQUVELE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxDQUFDO0tBQ25EO0lBQUMsT0FBTyxLQUFVLEVBQUU7UUFDbkIsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztLQUN2RTtBQUNMLENBQUMsQ0FBQSxDQUFDO0FBL0JXLFFBQUEsNkJBQTZCLGlDQStCeEM7QUFFSyxNQUFNLDBCQUEwQixHQUFHLENBQU8sWUFBb0IsRUFBRSxFQUFFO0lBQ3JFLElBQUk7UUFDQSxNQUFNLE9BQU8sR0FBRyxNQUFNLG9CQUFFO2FBQ25CLFVBQVUsQ0FBQyxjQUFjLENBQUM7YUFDMUIsR0FBRyxDQUFDLFlBQVksQ0FBQzthQUNqQixVQUFVLENBQUMseUJBQXlCLENBQUM7YUFDckMsR0FBRyxFQUFFLENBQUM7UUFDWCxNQUFNLG9CQUFvQixHQUFVLEVBQUUsQ0FBQztRQUN2QyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ3pCLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN4QixvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQztLQUN4RDtJQUFDLE9BQU8sS0FBVSxFQUFFO1FBQ2pCLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzlCLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7S0FDekU7QUFDTCxDQUFDLENBQUEsQ0FBQztBQWxCVyxRQUFBLDBCQUEwQiw4QkFrQnJDO0FBRUssTUFBTSwyQkFBMkIsR0FBRyxDQUFPLElBQXdCLEVBQUMsWUFBbUIsRUFBRSxFQUFFO0lBQ2hHLElBQUk7UUFDRixNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3ZCLE1BQU0saUNBQWlDLEdBQUcsb0JBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLFlBQVkscUJBQXFCLENBQUMsQ0FBQztRQUMzRyxNQUFNLFFBQVEsR0FBRyxNQUFNLGlDQUFpQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQy9ELE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDNUIsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO1FBQ2pGLE1BQU0sY0FBYyxHQUFHLGlDQUFpQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQy9ELE1BQU0sY0FBYyxDQUFDLEdBQUcsQ0FBQztZQUN2QixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDckIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtZQUNqQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7WUFDN0Isa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjtZQUMzQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO1lBQ3ZDLFNBQVMsRUFBQyxJQUFJLENBQUMsU0FBUztZQUN4QixPQUFPLEVBQUMsSUFBSSxDQUFDLE9BQU87WUFDcEIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLE1BQU0sRUFBRSxHQUFHO1lBQ1gsRUFBRSxFQUFFLGVBQWUsR0FBRSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDaEMsU0FBUyxFQUFFLFlBQVk7U0FDeEIsQ0FBQyxDQUFDO1FBSUgsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLHFDQUFxQyxFQUFFLFVBQVUsRUFBRSxjQUFjLENBQUMsRUFBRSxFQUFFLENBQUM7S0FDekc7SUFBQyxPQUFPLEtBQVUsRUFBRTtRQUNuQixPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO0tBQ3ZFO0FBQ0gsQ0FBQyxDQUFBLENBQUM7QUE3QlcsUUFBQSwyQkFBMkIsK0JBNkJ0QztBQUVLLE1BQU0sd0JBQXdCLEdBQUcsQ0FBTyxJQUFZLEVBQUUsRUFBRTtJQUM3RCxJQUFJO1FBQ0YsTUFBTSxRQUFRLEdBQUcsTUFBTSxvQkFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDeEgsTUFBTSxpQkFBaUIsR0FBMkIsRUFBRSxDQUFDO1FBQ3JELFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUN2QixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxFQUEwQixDQUFDO1lBQ2hELGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxDQUFDO0tBQ25EO0lBQUMsT0FBTyxLQUFVLEVBQUU7UUFDbkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDOUIsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztLQUN2RTtBQUNILENBQUMsQ0FBQSxDQUFDO0FBYlcsUUFBQSx3QkFBd0IsNEJBYW5DO0FBR0ssTUFBTSx5QkFBeUIsR0FBRyxDQUFPLElBQXdCLEVBQUMsWUFBbUIsRUFBRSxFQUFFO0lBQzlGLElBQUk7UUFDRixNQUFNLGlDQUFpQyxHQUFHLG9CQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixZQUFZLHFCQUFxQixDQUFDLENBQUM7UUFDM0csTUFBTSxhQUFhLEdBQUcsTUFBTSxpQ0FBaUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDL0YsTUFBTSxXQUFXLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDOUMsTUFBTSxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRS9CLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxxQ0FBcUMsRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLEVBQUUsRUFBRSxDQUFDO0tBQ3RHO0lBQUMsT0FBTyxLQUFVLEVBQUU7UUFDbkIsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztLQUN2RTtBQUNILENBQUMsQ0FBQSxDQUFDO0FBWFcsUUFBQSx5QkFBeUIsNkJBV3BDO0FBRUssTUFBTSx1QkFBdUIsR0FBRyxDQUFPLE1BQWMsRUFBQyxZQUFtQixFQUFDLEVBQVMsRUFBRSxFQUFFO0lBQzVGLElBQUk7UUFDRixNQUFNLGlDQUFpQyxHQUFHLG9CQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixZQUFZLHFCQUFxQixDQUFDLENBQUM7UUFDM0csTUFBTSxhQUFhLEdBQUcsTUFBTSxpQ0FBaUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUMxRixNQUFNLFdBQVcsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUM5QyxNQUFNLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUUzQyxrQ0FBa0M7UUFFakMsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLHFDQUFxQyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsRUFBRSxFQUFFLENBQUM7S0FDdEc7SUFBQyxPQUFPLEtBQVUsRUFBRTtRQUNuQixPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO0tBQ3ZFO0FBQ0gsQ0FBQyxDQUFBLENBQUM7QUFiVyxRQUFBLHVCQUF1QiwyQkFhbEMifQ==