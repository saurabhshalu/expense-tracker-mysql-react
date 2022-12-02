const dotenv = require("dotenv");
const admin = require("firebase-admin");
const firebaseAdminApp = require("./config/firebaseAdmin.js");

dotenv.config();

const setAdminClaim = async () => {
  console.log(process.env.ADMIN_UID);
  try {
    const data = await admin
      .auth(firebaseAdminApp)
      .setCustomUserClaims(process.env.ADMIN_UID, { admin: true });

    console.log("Admin Role granted.");
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

setAdminClaim();
