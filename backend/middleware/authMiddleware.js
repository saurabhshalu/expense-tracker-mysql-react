const admin = require("firebase-admin");
const firebaseAdminApp = require("../config/firebaseAdmin.js");

const protect = (req, res, next) => {
  const { authorization, uid } = req.headers;
  if (
    !authorization ||
    !authorization.startsWith("Bearer ") ||
    !authorization.split(" ")[1] ||
    !uid
  ) {
    return res.status(401).json({ message: "Not authorized", valid: false });
  }
  const token = authorization.split(" ")[1];

  admin
    .auth(firebaseAdminApp)
    .verifyIdToken(token)
    .then((response) => {
      if (uid === response.uid) {
        req.user = response;
        return next();
      } else {
        return res
          .status(401)
          .json({ message: "Not authorized", valid: false });
      }
    })
    .catch((error) => {
      return res.status(401).json({ message: "Not authorized", valid: false });
    });
};

//Below one should be called after protect
const checkAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    return next();
  }
  return res.status(401).json({ message: "Not authorized..." });
};

module.exports = {
  protect,
  checkAdmin,
};
