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
exports.deleteAttendanceCollection = exports.updateYearlyAttendance = exports.createYearlyAttendance = exports.createPhotoCollection = void 0;
const Firebase_1 = require("../utilities/Firebase");
const createPhotoCollection = () => {
    try {
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;
        const academicYearId = `${currentYear}-${nextYear}`;
        for (let month = 9; month <= 12; month++) {
            const docId = `${currentYear}-${month.toString().padStart(2, "0")}`;
            Firebase_1.firestore.collection("academicYear")
                .doc(academicYearId)
                .collection("photo")
                .doc(docId)
                .set({});
        }
        for (let month = 1; month <= 7; month++) {
            const docId = `${nextYear}-${month.toString().padStart(2, "0")}`;
            Firebase_1.firestore.collection("academicYear")
                .doc(academicYearId)
                .collection("photo")
                .doc(docId)
                .set({});
        }
        return { success: true, message: "Create successfully " };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
};
exports.createPhotoCollection = createPhotoCollection;
const createYearlyAttendance = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentYear = 2024;
        const nextYear = currentYear + 1;
        const academicYearId = `${currentYear}-${nextYear}`;
        const startDate = new Date(Date.UTC(currentYear, 8, 1)); // September is month 8 (0-based index)
        const endDate = new Date(Date.UTC(nextYear, 6, 31)); // July is month 6 (0-based index)
        // Create an array of attendance days for the academic year
        const attendanceDays = [];
        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            if (date.getDay() !== 0 && date.getDay() !== 6) { // 0 is Sunday, 6 is Saturday
                attendanceDays.push(new Date(date));
            }
        }
        const batchSize = 500; // Set the batch size to 500 documents
        const batchedWrites = [];
        const classCollection = Firebase_1.firestore.collection(`academicYear/${academicYearId}/class`);
        const classCollectionDocs = yield classCollection.get();
        for (const classDoc of classCollectionDocs.docs) {
            let number = 1;
            const attendanceCollection = classDoc.ref.collection('attendance');
            let batch = Firebase_1.firestore.batch(); // Create a new batch
            for (const attendanceDay of attendanceDays) {
                const date = new Date(attendanceDay);
                date.setHours(12, 0, 0, 0);
                const formattedDate = attendanceDay.toISOString().substring(0, 10);
                const attendanceDocRef = attendanceCollection.doc(formattedDate);
                batch.set(attendanceDocRef, { date: date }); // Add the document to the batch
                number++;
                if (batchedWrites.length === batchSize) {
                    batchedWrites.push(batch.commit()); // Commit the batch when it reaches the batch size
                    batch = Firebase_1.firestore.batch(); // Create a new batch
                }
            }
            if (batchedWrites.length < batchSize) {
                batchedWrites.push(batch.commit()); // Commit the remaining documents
            }
        }
        yield Promise.all(batchedWrites);
        return { success: true, message: "Create successfully " };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.createYearlyAttendance = createYearlyAttendance;
const updateYearlyAttendance = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentYear = 2023;
        const nextYear = currentYear + 1;
        const academicYearId = `${currentYear}-${nextYear}`;
        const startDate = new Date(Date.UTC(currentYear, 8, 1)); // September is month 8 (0-based index)
        const endDate = new Date(Date.UTC(nextYear, 6, 31)); // July is month 6 (0-based index)
        // Create an array of attendance days for the academic year
        const attendanceDays = [];
        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            if (date.getDay() !== 0 && date.getDay() !== 6) { // 0 is Sunday, 6 is Saturday
                attendanceDays.push(new Date(date));
            }
        }
        const batchSize = 500; // Set the batch size to 500 documents
        const batchedWrites = [];
        const classCollection = Firebase_1.firestore.collection(`academicYear/${academicYearId}/class`);
        const classCollectionDocs = yield classCollection.get();
        for (const classDoc of classCollectionDocs.docs) {
            let number = 1;
            const attendanceCollection = classDoc.ref.collection('attendance');
            let batch = Firebase_1.firestore.batch(); // Create a new batch
            for (const attendanceDay of attendanceDays) {
                const date = new Date(attendanceDay);
                date.setHours(0, 0, 0, 0);
                const formattedDate = attendanceDay.toISOString().substring(0, 10);
                const attendanceDocRef = attendanceCollection.doc(formattedDate);
                batch.update(attendanceDocRef, { date: date }); // Update the document in the batch
                number++;
                if (batchedWrites.length === batchSize) {
                    batchedWrites.push(batch.commit()); // Commit the batch when it reaches the batch size
                    batch = Firebase_1.firestore.batch(); // Create a new batch
                }
            }
            if (batchedWrites.length < batchSize) {
                batchedWrites.push(batch.commit()); // Commit the remaining documents
            }
        }
        yield Promise.all(batchedWrites);
        return { success: true, message: "Update successfully " };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.updateYearlyAttendance = updateYearlyAttendance;
const deleteAttendanceCollection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;
        const academicYearId = `${currentYear}-${nextYear}`;
        const classCollection = Firebase_1.firestore.collection(`academicYear/${academicYearId}/class`);
        const classCollectionDocs = yield classCollection.get();
        const batch = Firebase_1.firestore.batch();
        for (const classDoc of classCollectionDocs.docs) {
            const attendanceCollection = classDoc.ref.collection('attendance');
            const attendanceDocs = yield attendanceCollection.listDocuments();
            for (const attendanceDoc of attendanceDocs) {
                batch.delete(attendanceDoc); // Delete each attendance document
            }
        }
        yield batch.commit();
        return { success: true, message: "Attendance collection deleted successfully" };
    }
    catch (error) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
});
exports.deleteAttendanceCollection = deleteAttendanceCollection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWVhcmx5U2V0dXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMveWVhcmx5U2V0dXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQXVEO0FBR2hELE1BQU0scUJBQXFCLEdBQUcsR0FBRyxFQUFFO0lBQ3RDLElBQUc7UUFDQyxNQUFNLFdBQVcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzdDLE1BQU0sUUFBUSxHQUFHLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDakMsTUFBTSxjQUFjLEdBQUcsR0FBRyxXQUFXLElBQUksUUFBUSxFQUFFLENBQUM7UUFDcEQsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUN0QyxNQUFNLEtBQUssR0FBRyxHQUFHLFdBQVcsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ3BFLG9CQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztpQkFDeEIsR0FBRyxDQUFDLGNBQWMsQ0FBQztpQkFDbkIsVUFBVSxDQUFDLE9BQU8sQ0FBQztpQkFDbkIsR0FBRyxDQUFDLEtBQUssQ0FBQztpQkFDVixHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDaEI7UUFDRCxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3JDLE1BQU0sS0FBSyxHQUFHLEdBQUcsUUFBUSxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDakUsb0JBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO2lCQUN4QixHQUFHLENBQUMsY0FBYyxDQUFD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