import admin from "firebase-admin";

const credentials = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS || "");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(credentials),
  });
}

export const adminAuth = admin.auth();
