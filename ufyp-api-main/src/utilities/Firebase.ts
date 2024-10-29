import * as admin from 'firebase-admin';


//admin setup
//const serviceAccount = require("../adminKey/serviceAccountKey.json");
const serviceAccount = require("../../src/adminKey/serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://ufyp-a18cf.appspot.com/'
});

// Get the Firestore instance
const firestore = admin.firestore();

// Get the Authentication instance
const auth = admin.auth();

const fieldValue = admin.firestore.FieldValue;

const notificationSender = admin.messaging();


// Initialize Firebase Storage
const storage = admin.storage();
const bucket = storage.bucket();

export { firestore, auth,bucket,fieldValue,notificationSender};
