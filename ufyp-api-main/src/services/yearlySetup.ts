import { firestore as db} from "../utilities/Firebase";
import { auth } from "../utilities/Firebase";

export const createPhotoCollection = () => {
    try{
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;
        const academicYearId = `${currentYear}-${nextYear}`;
        for (let month = 9; month <= 12; month++) {
            const docId = `${currentYear}-${month.toString().padStart(2, "0")}`;
            db.collection("academicYear")
                .doc(academicYearId)
                .collection("photo")
                .doc(docId)
                .set({});
        }
        for (let month = 1; month <= 7; month++) {
            const docId = `${nextYear}-${month.toString().padStart(2, "0")}`;
            db.collection("academicYear")
                .doc(academicYearId)
                .collection("photo")
                .doc(docId)
                .set({});
        }
        return { success: true, message: "Create successfully "};
    } catch (error: any) {
        console.error(`Error`,error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
}

export const createYearlyAttendance = async () => {
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
        const classCollection = db.collection(`academicYear/${academicYearId}/class`);
        const classCollectionDocs = await classCollection.get();
        
        for (const classDoc of classCollectionDocs.docs) {
          
            let number = 1;
            
            const attendanceCollection = classDoc.ref.collection('attendance');
            let batch = db.batch(); // Create a new batch
            for (const attendanceDay of attendanceDays) {
              const date = new Date(attendanceDay);
              date.setHours(12, 0, 0, 0);
              const formattedDate = attendanceDay.toISOString().substring(0, 10);
              const attendanceDocRef = attendanceCollection.doc(formattedDate);
              batch.set(attendanceDocRef, { date: date}); // Add the document to the batch
              number++;
              if (batchedWrites.length === batchSize) {
                batchedWrites.push(batch.commit()); // Commit the batch when it reaches the batch size
                batch = db.batch(); // Create a new batch
              }
            }
            if (batchedWrites.length < batchSize) {
              batchedWrites.push(batch.commit()); // Commit the remaining documents
            }
          
        }
          await Promise.all(batchedWrites);
        return { success: true, message: "Create successfully "};
    }catch (error: any) {
        console.error(`Error`, error);
        return { success: false, message: `${error.name}: ${error.message}` };
    }
};


export const updateYearlyAttendance = async () => {
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
      const classCollection = db.collection(`academicYear/${academicYearId}/class`);
      const classCollectionDocs = await classCollection.get();
      
      for (const classDoc of classCollectionDocs.docs) {
          let number = 1;
          const attendanceCollection = classDoc.ref.collection('attendance');
          let batch = db.batch(); // Create a new batch
          for (const attendanceDay of attendanceDays) {
              const date = new Date(attendanceDay);
              date.setHours(0, 0, 0, 0);
              const formattedDate = attendanceDay.toISOString().substring(0, 10);
              const attendanceDocRef = attendanceCollection.doc(formattedDate);
              batch.update(attendanceDocRef, { date: date}); // Update the document in the batch
              number++;
              if (batchedWrites.length === batchSize) {
                  batchedWrites.push(batch.commit()); // Commit the batch when it reaches the batch size
                  batch = db.batch(); // Create a new batch
              }
          }
          if (batchedWrites.length < batchSize) {
              batchedWrites.push(batch.commit()); // Commit the remaining documents
          }
      }
      await Promise.all(batchedWrites);
      return { success: true, message: "Update successfully "};
  } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
  }
};



export const deleteAttendanceCollection = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      const academicYearId = `${currentYear}-${nextYear}`;
      const classCollection = db.collection(`academicYear/${academicYearId}/class`);
      const classCollectionDocs = await classCollection.get();
      const batch = db.batch();
      for (const classDoc of classCollectionDocs.docs) {
        const attendanceCollection = classDoc.ref.collection('attendance');
        const attendanceDocs = await attendanceCollection.listDocuments();
        for (const attendanceDoc of attendanceDocs) {
          batch.delete(attendanceDoc); // Delete each attendance document
        } 
      }
      await batch.commit();
      return { success: true, message: "Attendance collection deleted successfully" };
    } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }
};