import { firestore as db} from "../utilities/Firebase";
import { auth } from "../utilities/Firebase";
// import { 

// } from '../models/pushNotification'
import { 
  sendNotificationWithAttribute,
  getAllDeviceID,
  getAllDeviceIDWithSpec,
  createDocumentInCollection
} from "../services/notification";

export const addNotification = async (contentTC:string, contentEN:string,titleTC:string,titleEN:string) => {
    try {
      const notificationCollection = db.collection(`notification`);
       
      const snapshot = await notificationCollection.get();
      const id = snapshot.size + 1;

      await notificationCollection.add({
        id: id,
        titleTC:titleTC,
        titleEN:titleEN,
        contentTC: contentTC,
        contentEN: contentEN,
      });

      return { success: true, message: "Add notification success" };
    } catch (error: any) {
      console.error(error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }
};

export const editNotification = async (id: number, contentTC: string, contentEN: string,titleTC:string,titleEN:string) => {
  try {
    const notificationCollection = db.collection(`notification`);

    const notification = await notificationCollection.where('id', '==', id).get();
    if (notification.empty) {
      return { success: false, message: "No matching documents." };
    }  


    const doc = notification.docs[0];
    await doc.ref.update({
      titleTC:titleTC,
      titleEN:titleEN,
      contentTC: contentTC,
      contentEN: contentEN,
    });

    return { success: true, message: "Edit notification success" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};


export const getAllNotification = async () => {
    try {
        const notificationCollection = db.collection(`notification`);
        const snapshot = await notificationCollection.get();
        const notificationList = snapshot.docs.map((doc) => {
          return {
            ...doc.data(),
          };
        });
        return { success: true, message: "Get all notification success", data:notificationList };
      } catch (error: any) {
        console.error(error);
        return { success: false, message: `${error.name}: ${error.message}` };
      }
};



export const pushNotification = async (selectedOption:string, id:number) => {
  try {
    let data = await getNotificationInfo(parseInt(id.toString()));
    let deviceData:any;
    if(selectedOption=='All'){
      deviceData = await getAllDeviceID();
    }else if(selectedOption=='teacher'){
      deviceData = await getAllDeviceIDWithSpec("teacher");
    }else{
      deviceData = await getAllDeviceIDWithSpec("student");
    }

    for (let device of deviceData.data) {
      let title, content;
      if (device.languageCode === 'zh') {
        title = data.titleTC;
        content = data.contentTC;
      } else {
        title = data.titleEN;
        content = data.contentEN;
      }
      await sendNotificationWithAttribute(title,content,device.deviceID,"Announcement");
      await createDocumentInCollection(data.titleTC,data.contentTC,data.titleEN,data.contentEN,device.userID);
    }

    return { success: true, message: "push notification success" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};


const getNotificationInfo = async (id: number) => {
  try {
    const notificationCollection = db.collection(`notification`);

    const notification = await notificationCollection.where('id', '==', id).get();
    if (notification.empty) {
      return { success: false, message: "No matching documents." };
    }  

    let data;
    data = {
      titleEN:notification.docs[0].get('titleEN'),
      titleTC: notification.docs[0].get('titleTC'),
      contentEN: notification.docs[0].get('contentEN'),
      contentTC: notification.docs[0].get('contentTC'),
    }


    return data;
  } catch (error: any) {
    console.error(error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
};
