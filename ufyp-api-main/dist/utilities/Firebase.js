"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationSender = exports.fieldValue = exports.bucket = exports.auth = exports.firestore = void 0;
const admin = __importStar(require("firebase-admin"));
//admin setup
//const serviceAccount = require("../adminKey/serviceAccountKey.json");
const serviceAccount = require("../../src/adminKey/serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://ufyp-a18cf.appspot.com/'
});
// Get the Firestore instance
const firestore = admin.firestore();
exports.firestore = firestore;
// Get the Authentication instance
const auth = admin.auth();
exports.auth = auth;
const fieldValue = admin.firestore.FieldValue;
exports.fieldValue = fieldValue;
const notificationSender = admin.messaging();
exports.notificationSender = notificationSender;
// Initialize Firebase Storage
const storage = admin.storage();
const bucket = storage.bucket();
exports.bucket = bucket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlyZWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbGl0aWVzL0ZpcmViYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0RBQXdDO0FBR3hDLGFBQWE7QUFDYix1RUFBdUU7QUFDdkUsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7QUFDNUUsS0FBSyxDQUFDLGFBQWEsQ0FBQztJQUNsQixVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQ2pELGFBQWEsRUFBRSw4QkFBOEI7Q0FDOUMsQ0FBQyxDQUFDO0FBRUgsNkJBQTZCO0FBQzdCLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQWMzQiw4QkFBUztBQVpsQixrQ0FBa0M7QUFDbEMsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0FBV04sb0JBQUk7QUFUeEIsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7QUFTZCxnQ0FBVTtBQVAxQyxNQUFNLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQU9GLGdEQUFrQjtBQUo3RCw4QkFBOEI7QUFDOUIsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2hDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUVQLHdCQUFNIn0=