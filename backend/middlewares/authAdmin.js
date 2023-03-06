const jwt = require("jsonwebtoken");
const adminModel = require("../models/adminModel");

module.exports.verifyAdmin = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "mernAppSecret", async (err, decodedToken) => {
      if (err) {
        res.json({ status: false });
      } else {
        const admin = await adminModel.findById(decodedToken.id);
        if (admin) {
          next();
        } else {
          res.json({ status: false });
        }
      }
    });
  } else {
    res.json({ status: false });
  }
};
