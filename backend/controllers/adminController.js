const adminModel = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 60 * 60;
const userModel = require("../models/userModel");

const createToken = (id) => {
  return jwt.sign({ id }, "mernAppSecret", {
    expiresIn: maxAge,
  });
};

const handleError = (err) => {
  let errors = { email: "", password: "", name: "", phone: "" };

  if (err.code === 11000) {
    errors.email = "Email already exists";
    return errors;
  }

  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach((properties) => {
      errors["message"] = properties.message;
    });
    return errors;
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email });
    if (admin) {
      const validatePassword = await bcrypt.compare(password, admin.password);
      if (validatePassword) {
        const token = createToken(admin._id);
        res.cookie("jwt", token, {
          withCredentials: true,
          httpOnly: false,
          maxAge: maxAge * 1000,
        });
        res.status(200).json({ admin, token, created: true });
      } else {
        const errors = { email: "Incorrect email or password" };
        res.json({ errors, creted: false });
      }
    } else {
      const errors = { email: "No admin with this email" };
      res.json({ errors, created: false });
    }
  } catch (error) {
    console.log(err);
    const errors = { email: "Something gone wrong" };
    res.json({ errors, created: false });
  }
};

const allUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.json({ status: true, message: "success", users });
  } catch (err) {
    console.log(err, "o");
    // res.json({message:"error"})
  }
};

const deleteUser = (req, res) => {
  try {
    userModel.deleteOne({ _id: req.params.userId }).then((response) => {
      res.json({ message: "User deleted", status: true });
    });
  } catch (error) {
    res.json({ message: "error", status: false });
  }
};

const editUser = (req, res) => {
  try {
    console.log(req.body, "ddd");

    userModel
      .updateOne(
        { _id: req.body.id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
          },
        }
      )
      .then(() => {
        res.status(200).json({ message: "User data updated", status: true });
        return;
      });
  } catch (err) {
    res.json({ message: "Something gone wrong", status: false });
  }
};

const addUser = (req, res) => {
  try {
    userModel
      .create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
      })
      .then((response) => {
        res.json({
          message: "User Created Successfully",
          status: true,
          created: true,
        });
      })
      .catch((error) => {
        const errors = handleError(error);

        res.json({ errors, status: false, created: false });
      });
  } catch (error) {
    res.json({ errors: { message: "Something gone wrong" }, status: false });
  }
};

module.exports = {
  adminLogin,
  allUsers,
  deleteUser,
  editUser,
  addUser,
};
