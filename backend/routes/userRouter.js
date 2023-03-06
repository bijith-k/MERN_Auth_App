const router = require("express").Router();
const { register, login } = require("../controllers/authControllers");
const { updateProfile } = require("../controllers/userController");
const { verifyUser } = require("../middlewares/authUser");
const { uploadOptions } = require("../middlewares/uploadImage");

router.post("/", verifyUser);
router.post("/register", register);
router.post("/login", login);
router.post(
  "/upload-image",
  verifyUser,
  uploadOptions.single("image"),
  updateProfile
);

module.exports = router;
