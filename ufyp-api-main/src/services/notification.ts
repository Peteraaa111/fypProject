import { firestore as db} from "../utilities/Firebase";
import { auth } from "../utilities/Firebase";
import { notificationSender } from "../utilities/Firebase";


export const getAllDeviceID = async () => {
  try {
      const devicesCollection = db.collection(`devices`);
      const snapshot = await devicesCollection.get();
      const deviceList = snapshot.docs.map((doc) => {
        let dataItem = {
          deviceID: doc.get("deviceID"),
          languageCode: doc.get("languageCode"),
          userID:doc.get("userID"),
        }
        return {
          ...dataItem
        };
      });
      return {data:deviceList };
    } catch (error: any) {
      console.error(error);
      return { message: `${error.name}: ${error.message}` };
    }
};

export const getAllDeviceIDWithSpec = async (select:string) => {
  try {
      const devicesCollection = db.collection(`devices`);
      let snapshot:any;
      if(select == 'teacher'){
        snapshot = await devicesCollection.orderBy('userID').startAt('teachers').get();
      }else{
        snapshot = await devicesCollection.orderBy('userID').startAt('student').endAt('student\ufff0').get();
      }
      //const snapshot = await devicesCollection.where().get();
      const deviceList = snapshot.docs.map((doc:any) => {
        let dataItem = {
          deviceID: doc.get("deviceID"),
          languageCode: doc.get("languageCode"),
          userID:doc.get("userID"),
        }
        return {
          ...dataItem
        };
      });
      return { data:deviceList };
    } catch (error: any) {
      return { message: `${error.name}: ${error.message}` };
    }
};


export const getDeviceByUserID = async (userID: string) => {
  try {
    const devicesCollection = db.collection(`devices`);
    const snapshot = await devicesCollection.where('userID', '==', userID).get();

    if (snapshot.empty) {
      return { message: 'No matching device found.' };
    }

    const doc = snapshot.docs[0];
    const device = {
      deviceID: doc.get("deviceID"),
      languageCode: doc.get("languageCode"),
      userID: doc.get("userID"),
    };

    return { data: device };
  } catch (error: any) {
    return { message: `${error.name}: ${error.message}` };
  }
};

export const sendNotification = async () => {
    try {
        const message = {
            notification: {
              title: 'HIHI',
              body: 'This is a Firebase Cloud Messaging Topic Message!',
            },
            data: {
              type: 'tt',
              id: '123456',
            },
            token: 'cspD4My5STyhBjHTNd077z:APA91bGSBbHQ5aSjKVDfVsbCsObTuTmPbrCJmwT97i9H6LAJEzDCOLZcfUlyDS0Lm-9dhlnrXEZbcBNhJHFzlmwn6e2-9LiqlB4WX6XKsQVE9YTV5us77BzdFHRItbUiO2sTGmaasDmk'
        };


        await notificationSender.send(message);
        console.log('Notification Sent!');
      return { success: true};
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
};

export const sendNotificationWithAttribute = async (title:string,content:string,token:string,type:string) => {
  try {
      const message = {
          notification: {
            title: title,
            body: content,
          },
          data: {
            type: type,
            id: '123456',
          },
          token: token
      };
      console.log(token);

      await notificationSender.send(message);
      console.log('Notification Sent!');
    return { success: true};
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

export const sendNotificationWithAttributeInChat = async (title:string,content:string,token:string,type:string,chatRoomID:any,s_Id:any,t_Id:any,parent_Name:any,t_ChiName:any,t_EngName:any) => {
  try {
      const message = {
          notification: {
            title: title,
            body: content,
          },
          data: {
            type: type,
            id: '123456',
            // chatRoomID:chatRoomID,
            // s_Id:s_Id,
            // t_Id:t_Id,
            // parent_Name:parent_Name,
            // t_ChiName:t_ChiName,
            // t_EngName:t_EngName
          },
          token: token
      };
      console.log(token);

      await notificationSender.send(message);
      console.log('Notification Sent!');
    return { success: true};
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

export const createDocumentInCollection = async (titleTC: string, contentTC: string, titleEN: string, contentEN: string, userID: string) => {
  try {
    const userNotificationCollection = db.collection('userNotification');
    const newDoc = await userNotificationCollection.add({
      titleTC,
      contentTC,
      titleEN,
      contentEN,
      userID
    });

    return { success: true, message: "Document successfully written!", docId: newDoc.id };
  } catch (error: any) {
    console.error("Error writing document: ", error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};

