const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 60 * 60;
const bcrypt = require("bcrypt");

const createToken = (id) => {
  return jwt.sign({ id }, "mernAppSecret", {
    expiresIn: maxAge,
  });
};

const handleErrors = (err) => {
  let errors = { name: "", email: "", phone: "", password: "" };

  if (err.message === "Incorrect email") {
    errors.email = "There is no user with the email";
  }
  if (err.message === "Incorrect password") {
    errors.password = "Password is incorrect";
  }
  if (err.code === 11000) {
    errors.email = "There is a user with same email";
    return errors;
  }

  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
    return errors;
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, password, name, phone } = req.body;
    const user = await userModel.create({ email, password, name, phone });
    const token = createToken(user._id);

    res.cookie("jwt", token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });

    res
      .status(201)
      .json({ user: { id: user._id, email: user.email }, created: true });
  } catch (error) {
    console.log(error);
    const errors = handleErrors(error);
    res.json({ errors, created: false });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        const token = createToken(user._id);

        res.cookie("jwt", token, {
          withCredentials: true,
          httpOnly: false,
          maxAge: maxAge * 1000,
        });

        res.status(200).json({ user, created: true });
      } else {
        const errors = { password: "Password is incorrect" };
        res.json({ errors, created: false });
      }
    } else {
      const errors = { email: "No user with the entered mail id" };
      res.json({ errors, created: false });
    }
  } catch (error) {
    console.log(error);
    const errors = handleErrors(error);
    res.json({ errors, created: false });
  }
};
