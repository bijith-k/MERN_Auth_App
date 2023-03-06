const {
  adminLogin,
  allUsers,
  deleteUser,
  editUser,
  addUser,
} = require("../controllers/adminController");
const { verifyAdmin } = require("../middlewares/authAdmin");

const router = require("express").Router();

router.post("/", adminLogin);
router.get("/userlist", verifyAdmin, allUsers);
router.delete("/delete-user/:userId", verifyAdmin, deleteUser);
router.put("/edit-user", verifyAdmin, editUser);
router.post("/add-user", verifyAdmin, addUser);

module.exports = router;
