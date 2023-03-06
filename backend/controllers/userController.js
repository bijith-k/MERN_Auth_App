const userModel = require("../models/userModel");

const updateProfile = async (req, res) => {
  req.file.path = await req.file.path.replace("public", "");
  let users = await userModel.findOne({ _id: req.headers.userid });
  if (users) {
    await userModel.findByIdAndUpdate(req.headers.userid, {
      $set: {
        image: req.file,
      },
    });
    let user = await userModel.findOne({ _id: req.headers.userid });

    res.json({ message: "Image uploaded successfully", user, status: true });
  }
};

module.exports = { updateProfile };
