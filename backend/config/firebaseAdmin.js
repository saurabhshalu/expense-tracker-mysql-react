const dotenv = require("dotenv");
const admin = require("firebase-admin");

dotenv.config();

const firebaseAdminApp = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

module.exports = firebaseAdminApp;
