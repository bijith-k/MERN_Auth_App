const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports.verifyUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "mernAppSecret", async (err, decodedToken) => {
      if (err) {
        res.json({ status: false });
      } else {
        const user = await User.findById({ _id: decodedToken.id });
        if (user) {
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
