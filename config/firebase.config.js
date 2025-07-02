// server/config/firebase.js
import admin from "firebase-admin";
// import serviceAccount from "./firebaseConfig.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert('./config/firebaseConfig.json'),
  });
}

export default admin;
