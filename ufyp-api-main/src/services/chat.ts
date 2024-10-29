import { ConstantYear } from "../models/Constant";
import { bucket, firestore as db} from "../utilities/Firebase";
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import path from 'path';
import fileType from 'file-type';
import sharp from "sharp";
import { getDeviceByUserID, sendNotificationWithAttribute, sendNotificationWithAttributeInChat } from "./notification";

export const getChatListByID = async (studentID:string,classID:string)  =>{
    try{
      const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
      const chatCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/chat/`);  
      const teacherCollection = db.collection(`teachers`)
      const studentCollection = db.collection(`students`)
      const getChatRoomDoc = await chatCollection.where('s_Id','==',studentID).where('RoomFormat','==',"single").get();


      let chatRoomList:any=[];

      if(!getChatRoomDoc.empty){
        let data;
        data = {
          chatRoomID:getChatRoomDoc.docs[0].get('chatRoomID'),
          s_Id: getChatRoomDoc.docs[0].get('s_Id'),
          t_Id: getChatRoomDoc.docs[0].get('t_Id'),
        }
        const getStudentDoc = await studentCollection.where('s_Id','==',data.s_Id).get();
        const getTeacherDoc = await teacherCollection.where('t_Id','==',data.t_Id).get();

        data = {
            ...data,
            parent_Name:getStudentDoc.docs[0].get('parent_Name'),
            t_ChiName:getTeacherDoc.docs[0].get('t_ChiName'),
            t_EngName:getTeacherDoc.docs[0].get('t_EngName'),
        }

        chatRoomList.push(data);
      }
      return { success: true, data:chatRoomList};
    } catch (error: any) {
      console.error(`Error`, error);
      return { success: false, message: `${error.name}: ${error.message}` };
    }
}


export const getTeacherChatListByID = async (teacherID:string,classID:string)  =>{
  try{
    const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
    const chatCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/chat/`);  
    const teacherCollection = db.collection(`teachers`)
    const studentCollection = db.collection(`students`)
    const getChatRoomDoc = await chatCollection.where('t_Id','==',teacherID).where('RoomFormat','==',"single").get();


    let chatRoomList:any=[];

    if(!getChatRoomDoc.empty){
      let data;
      data = {
        chatRoomID:getChatRoomDoc.docs[0].get('chatRoomID'),
        s_Id: getChatRoomDoc.docs[0].get('s_Id'),
        t_Id: getChatRoomDoc.docs[0].get('t_Id'),
      }
      const getStudentDoc = await studentCollection.where('s_Id','==',data.s_Id).get();
      const getTeacherDoc = await teacherCollection.where('t_Id','==',data.t_Id).get();

      data = {
          ...data,
          parent_Name:getStudentDoc.docs[0].get('parent_Name'),
          t_ChiName:getTeacherDoc.docs[0].get('t_ChiName'),
          t_EngName:getTeacherDoc.docs[0].get('t_EngName'),
      }

      chatRoomList.push(data);
    }
    return { success: true, data:chatRoomList};
  } catch (error: any) {
    console.error(`Error`, error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
}

export const getGroupChatList = async (classID:string) =>{
  try{
    const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
    const chatCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/chat/`);  
    const getChatRoomDoc = await chatCollection.where('RoomFormat','==',"group").get();
    let chatRoomList:any=[];
    if(!getChatRoomDoc.empty){
      let data;
      data = {
        chatRoomID:getChatRoomDoc.docs[0].get('chatRoomID'),
        groupName: getChatRoomDoc.docs[0].get('groupName'),
      }
      chatRoomList.push(data);
    }
    return { success: true, data:chatRoomList};
  }catch (error: any) {
    console.error(`Error`, error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
}

export const findSenderName = async (senderID:string) =>{
  try{

    const studentCollection = db.collection('students');  
    const teacherCollection = db.collection(`teachers`)
    const getStudentDoc = await studentCollection.where('s_Id','==',senderID).get();
    const getTeacherDoc = await teacherCollection.where('t_Id','==',senderID).get();

    if (!getStudentDoc.empty) {
      let data;
      data = {
        lastMessageSenderEngName:getStudentDoc.docs[0].data().parent_Name,
        lastMessageSenderChiName:getStudentDoc.docs[0].data().parent_Name,
      }
      return  { success: true, data:data};
    }

    if (!getTeacherDoc.empty) {
      let data;
      data = {
        lastMessageSenderEngName:getTeacherDoc.docs[0].data().t_EngName,
        lastMessageSenderChiName:getTeacherDoc.docs[0].data().t_ChiName,
      }
      return { success: true, data:data};
    }
    return { success:true}
  }catch (error: any) {
    console.error(`Error`, error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
}




export const getAllMessageInChatRoom = async (classID:string,chatRoomID:string)  =>{
  try{
    const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
    const chatCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/chat/`);  
    const getChatRoomDoc = await chatCollection.where('chatRoomID','==',chatRoomID.toString()).get();
    const getChatRoomDocId = getChatRoomDoc.docs[0].id;
    const chatRoomMessageCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/chat/${getChatRoomDocId}/message`);  
    const chatRoomMessageGet = await chatRoomMessageCollection.orderBy('id','desc').get();
    let chatRoomMessageList:any=[];
    let haveData = false;
    chatRoomMessageGet.forEach((doc) => {

      chatRoomMessageList.push(
        doc.data()
      );
    });

    if(chatRoomMessageList.length>0){
      haveData = true;
    }

    return { success: true, data:chatRoomMessageList, haveData:haveData};
  } catch (error: any) {
    return { success: false, message: `${error.name}: ${error.message}` };
  }
}


export const sendMessageInChatRoom = async (senderID:string,classID:string,chatRoomID:string,message:any,type:string)  =>{
  try{
    const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
    const chatCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/chat/`);  
    const getChatRoomDoc = await chatCollection.where('chatRoomID','==',chatRoomID).get();
    const getChatRoomDocId = getChatRoomDoc.docs[0].id;
    const chatRoomFormat = getChatRoomDoc.docs[0].data().RoomFormat;
    const chatRoomMessageCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/chat/${getChatRoomDocId}/message`);  
    let now = new Date();
    let date = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    let time = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
    let formattedDateTime = `${date}-${time}`;
    let newMessage:any;
    if(type === 'text'){
      newMessage = {
        id:1,
        message: message,
        senderID: senderID,
        type: type,
        time: formattedDateTime,
        read: false
      };
      if (chatRoomFormat === 'group') {
        const response = await findSenderName(senderID);
        if (response.success && response.data) {
          newMessage.SenderEngName = response.data.lastMessageSenderEngName;
          newMessage.SenderChiName = response.data.lastMessageSenderChiName;
        }
      }else{
        if(senderID == getChatRoomDoc.docs[0].data().s_Id){
          let deviceData:any;
          let title, content;
          deviceData = await getDeviceByUserID(getChatRoomDoc.docs[0].data().t_Id);
          let senderName = await findSenderName(senderID);
          let receiverName = await findSenderName(getChatRoomDoc.docs[0].data().t_Id);
          let chatData = {
            chatRoomID:chatRoomID,
            s_Id:getChatRoomDoc.docs[0].data().s_Id,
            t_Id:getChatRoomDoc.docs[0].data().t_Id,
            parent_Name:senderName.data!.lastMessageSenderChiName,
            t_ChiName:receiverName.data!.lastMessageSenderChiName,
            t_EngName:receiverName.data!.lastMessageSenderEngName,
          }
          console.log(deviceData);
          if(deviceData.data){
            if (deviceData.data.languageCode === 'zh') {
              title = senderName.data!.lastMessageSenderChiName+ " 發送了新訊息";
              content = message;
            }else{
              title = senderName.data!.lastMessageSenderEngName + " Send a message";
              content = message;
            }
            await sendNotificationWithAttributeInChat(title,content,deviceData.data.deviceID,"Chat",chatRoomID,getChatRoomDoc.docs[0].data().s_Id,getChatRoomDoc.docs[0].data().t_Id,senderName.data!.lastMessageSenderChiName,receiverName.data!.lastMessageSenderChiName,receiverName.data!.lastMessageSenderEngName);
          }
        }else{
          let deviceData:any;
          let title, content;
          deviceData = await getDeviceByUserID(getChatRoomDoc.docs[0].data().s_Id);
          let senderName = await findSenderName(senderID);
          let receiverName = await findSenderName(getChatRoomDoc.docs[0].data().s_Id);

          let chatData = {
            chatRoomID:chatRoomID,
            s_Id:getChatRoomDoc.docs[0].data().s_Id,
            t_Id:getChatRoomDoc.docs[0].data().t_Id,
            parent_Name:senderName.data!.lastMessageSenderChiName,
            t_ChiName:receiverName.data!.lastMessageSenderChiName,
            t_EngName:receiverName.data!.lastMessageSenderEngName,
          }
          console.log(deviceData);
          if(deviceData.data){
            if (deviceData.data.languageCode === 'zh') {
              title = senderName.data!.lastMessageSenderChiName+ " 發送了新訊息";
              content = message;
            }else{
              title = senderName.data!.lastMessageSenderEngName + " Send a message";
              content = message;
            }
            await sendNotificationWithAttributeInChat(title,content,deviceData.data.deviceID,"Chat",chatRoomID,getChatRoomDoc.docs[0].data().s_Id,getChatRoomDoc.docs[0].data().t_Id,senderName.data!.lastMessageSenderChiName,receiverName.data!.lastMessageSenderChiName,receiverName.data!.lastMessageSenderEngName);
          }

        }

      }
    }

    chatRoomMessageCollection.get().then((snapshot) => {
      newMessage.id = snapshot.size+1;
      chatRoomMessageCollection.add(newMessage);
    });

    return { success: true};
  } catch (error: any) {
    console.error(`Error`, error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
}

export const sendFileInChatRoom = async (senderID:string,classID:string,chatRoomID:string,files:any,type:string)  =>{
  try{
    const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
    const chatCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/chat/`);  
    const getChatRoomDoc = await chatCollection.where('chatRoomID','==',chatRoomID).get();
    const getChatRoomDocId = getChatRoomDoc.docs[0].id;
    const chatRoomFormat = getChatRoomDoc.docs[0].data().RoomFormat;
    const chatRoomMessageCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/chat/${getChatRoomDocId}/message`);  
    let now = new Date();
    let date = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    let time = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
    let formattedDateTime = `${date}-${time}`;
    let filePath = 'chat/' + classID + "-" + chatRoomID;


    const storageUrl = "https://firebasestorage.googleapis.com/v0/b/ufyp-a18cf.appspot.com/o"
    const token =  uuidv4();

    var [filesInBucket] = await bucket.getFiles({ prefix: filePath });
    var numFiles = filesInBucket.length;
    var numberCount = numFiles;
    for (const file of files) {
      let newMessage:any;
      let buffer = fs.readFileSync(file.path);
      const FileType = await fileType.fromBuffer(buffer);
      if (FileType?.mime === 'image/png') {
        buffer = await sharp(buffer).jpeg().toBuffer();
      }
      const extension = path.extname(file.originalname).toLowerCase();
      let fileName = `${filePath}/${numberCount}${extension}`;
      let fileRef = bucket.file(`${fileName}`);
      let [exists] = await fileRef.exists();
      while (exists) {
        numberCount++;
        fileName = `${filePath}/${numberCount}${extension}`;
        fileRef = bucket.file(fileName);
        [exists] = await fileRef.exists();
      }
      await fileRef.save(buffer, { metadata: { contentType: FileType?.mime, metadata:{firebaseStorageDownloadTokens: token} } });
      const url = `${storageUrl}/${encodeURIComponent(fileName)}?alt=media&token=${token}`
      newMessage = {
        id:1,
        message: url,
        senderID: senderID,
        type: type,
        time: formattedDateTime,
        read: false
      };
      if (chatRoomFormat === 'group') {
        const response = await findSenderName(senderID);
        if (response.success && response.data) {
          newMessage.SenderEngName = response.data.lastMessageSenderEngName;
          newMessage.SenderChiName = response.data.lastMessageSenderChiName;
        }
      }
      chatRoomMessageCollection.get().then((snapshot) => {
        newMessage.id = snapshot.size+1;
        chatRoomMessageCollection.add(newMessage);
      });    
    }
    


    return { success: true};
  } catch (error: any) {
    console.error(`Error`, error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
}

export const sendAudioFileInChatRoom = async (senderID:string,classID:string,chatRoomID:string,files:any,type:string)  =>{
  try{
    const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
    const chatCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/chat/`);  
    const getChatRoomDoc = await chatCollection.where('chatRoomID','==',chatRoomID).get();
    const getChatRoomDocId = getChatRoomDoc.docs[0].id;
    const chatRoomFormat = getChatRoomDoc.docs[0].data().RoomFormat;
    const chatRoomMessageCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/chat/${getChatRoomDocId}/message`);  
    let now = new Date();
    let date = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    let time = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
    let formattedDateTime = `${date}-${time}`;
    let filePath = 'chat/' + classID + "-" + chatRoomID;
 

    const storageUrl = "https://firebasestorage.googleapis.com/v0/b/ufyp-a18cf.appspot.com/o"
    const token =  uuidv4();

    var [filesInBucket] = await bucket.getFiles({ prefix: filePath });
    var numFiles = filesInBucket.length;
    var numberCount = numFiles;
    for (const file of files) {
      let newMessage:any;
      let buffer = fs.readFileSync(file.path);
      const FileType = await fileType.fromBuffer(buffer);
      const extension = path.extname(file.originalname).toLowerCase();
      let fileName = `${filePath}/${numberCount}${extension}`;
      let fileRef = bucket.file(`${fileName}`);
      let [exists] = await fileRef.exists();
      while (exists) {
        numberCount++;
        fileName = `${filePath}/${numberCount}${extension}`;
        fileRef = bucket.file(fileName);
        [exists] = await fileRef.exists();
      }
      await fileRef.save(buffer, { metadata: { contentType: FileType?.mime, metadata:{firebaseStorageDownloadTokens: token} } });
      const url = `${storageUrl}/${encodeURIComponent(fileName)}?alt=media&token=${token}`
      newMessage = {
        id:1,
        message: url,
        senderID: senderID,
        type: type,
        time: formattedDateTime,
        read: false
      };
      if (chatRoomFormat === 'group') {
        const response = await findSenderName(senderID);
        if (response.success && response.data) {
          newMessage.SenderEngName = response.data.lastMessageSenderEngName;
          newMessage.SenderChiName = response.data.lastMessageSenderChiName;
        } 
      }
      chatRoomMessageCollection.get().then((snapshot) => {
        newMessage.id = snapshot.size+1;
        chatRoomMessageCollection.add(newMessage);
      });    
    }
    


    return { success: true};
  } catch (error: any) {
    console.error(`Error`, error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
}

export const sendVideoFileInChatRoom = async (senderID:string,classID:string,chatRoomID:string,files:any,type:string)  =>{
  try{
    const yearSelector = `${ConstantYear.currentYear}-${ConstantYear.nextYear}`;
    const chatCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/chat/`);  
    const getChatRoomDoc = await chatCollection.where('chatRoomID','==',chatRoomID).get();
    const getChatRoomDocId = getChatRoomDoc.docs[0].id;
    const chatRoomFormat = getChatRoomDoc.docs[0].data().RoomFormat;
    const chatRoomMessageCollection = db.collection(`academicYear/${yearSelector}/class/${classID}/chat/${getChatRoomDocId}/message`);  
    let now = new Date();
    let date = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    let time = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
    let formattedDateTime = `${date}-${time}`;
    let filePath = 'chat/' + classID + "-" + chatRoomID;


    const storageUrl = "https://firebasestorage.googleapis.com/v0/b/ufyp-a18cf.appspot.com/o"
    const token =  uuidv4();

    var [filesInBucket] = await bucket.getFiles({ prefix: filePath });
    var numFiles = filesInBucket.length;
    var numberCount = numFiles;
    for (const file of files) {
      let newMessage:any;
      let buffer = fs.readFileSync(file.path);
      const FileType = await fileType.fromBuffer(buffer);
      const extension = path.extname(file.originalname).toLowerCase();
      let fileName = `${filePath}/${numberCount}${extension}`;
      let fileRef = bucket.file(`${fileName}`);
      let [exists] = await fileRef.exists();
      while (exists) {
        numberCount++;
        fileName = `${filePath}/${numberCount}${extension}`;
        fileRef = bucket.file(fileName);
        [exists] = await fileRef.exists();
      }
      await fileRef.save(buffer, { metadata: { contentType: FileType?.mime, metadata:{firebaseStorageDownloadTokens: token} } });
      const url = `${storageUrl}/${encodeURIComponent(fileName)}?alt=media&token=${token}`
      newMessage = {
        id:1,
        message: url,
        senderID: senderID,
        type: type,
        time: formattedDateTime,
        read: false
      };
      if (chatRoomFormat === 'group') {
        const response = await findSenderName(senderID);
        if (response.success && response.data) {
          newMessage.SenderEngName = response.data.lastMessageSenderEngName;
          newMessage.SenderChiName = response.data.lastMessageSenderChiName;
        }
      }
      chatRoomMessageCollection.get().then((snapshot) => {
        newMessage.id = snapshot.size+1;
        chatRoomMessageCollection.add(newMessage);
      });    
    }
    


    return { success: true};
  } catch (error: any) {
    console.error(`Error`, error);
    return { success: false, message: `${error.name}: ${error.message}` };
  }
}