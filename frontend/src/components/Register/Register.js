import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "../Register/Register.css";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState("");

  const navigate = useNavigate();

  const generateError = (err) => {
    toast.error(err, {
      position: "top-center",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.name) {
      setErrors("Name is required");
      return;
    }
    if (!userData.email) {
      setErrors("Email is required");
      return;
    }
    if (!userData.phone) {
      setErrors("Phone number is required");
      return;
    }
    if (!userData.password) {
      setErrors("Password is required");
      return;
    }

    const emailRegex = /^\w+([\\.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!emailRegex.test(userData.email)) {
      setErrors("Enter a valid email address");
      return;
    }

    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

    if (!passwordRegex.test(userData.password)) {
      setErrors(
        "Password must be 6 to 16 character length and should contain atleast one special character and number"
      );
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(userData.phone)) {
      setErrors("Only 10 digit numbers");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:4000/register",
        {
          ...userData,
        },
        { withCredentials: true }
      );

      if (data) {
        if (data.errors) {
          const { name, email, password, phone } = data.errors;

          if (name) generateError(name);
          else if (email) generateError(email);
          else if (phone) generateError(phone);
          else if (password) generateError(password);
        } else {
          navigate("/login");
        }
      }
    } catch (error) {
      console.log(error, "login error");
    }
  };
  return (
    <div className="containerss">
      <div className="wrapper">
        <div className="title">
          <span>REGISTER HERE</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />
          </div>
          <div className="row">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />
          </div>
          <div className="row">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              onChange={(e) =>
                setUserData({ ...userData, phone: e.target.value })
              }
            />
          </div>
          <div className="row">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />
          </div>
          <p style={{ color: "red" }}>{errors ? errors : ""}</p>
          <div className="row button">
            <input type="submit" value="REGISTER" />
          </div>
          <div className="reg-link">
            <Link to="/login">Already have account ? Login</Link>{" "}
          </div>
          <ToastContainer />
        </form>
      </div>
    </div>
  );
};

export default Register;
