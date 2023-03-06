import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../AddUser/AddUser.css";
import { ToastContainer, toast } from "react-toastify";
import { useCookies } from "react-cookie";

const AddUser = () => {
  const [userData, setUserData] = useState();
  const [cookie] = useCookies([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (!cookie.jwt) {
      navigate("/admin");
      return;
    }
  }, [navigate, cookie.token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^\w+([\\.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const phoneRegex = /^\d{10}$/;
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (!userData) {
      toast.error("Name is required");
      return;
    }
    if (!userData.name) {
      toast.error("Name is required");
      return;
    }
    if (!userData.email) {
      toast.error("Email is required");
      return;
    }
    if (!userData.phone) {
      toast.error("Phone number is required");
      return;
    }
    if (!userData.password) {
      toast.error("Password is required");
      return;
    }

    if (!emailRegex.test(userData.email)) {
      toast.error("Enter a valid email address");
      return;
    }
    if (!phoneRegex.test(userData.phone)) {
      toast.error("Only 10 digit numbers");
      return;
    }
    if (!passwordRegex.test(userData.password)) {
      toast.error(
        "Password must be 6 to 16 character length and should contain atleast one special character and numbers"
      );
      return;
    }

    axios
      .post(
        "http://localhost:4000/admin/add-user",
        { ...userData },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.status) {
          console.log("1");
          toast.success(response.data.message, {
            position: "top-center",
          });
        } else if (response.data.codeName === "DuplicateKey") {
          console.log("2");

          toast.error("User with same email already exists", {
            position: "top-center",
          });
        } else {
          toast.error(response.data.errors.email, {
            position: "top-center",
          });
        }
      });
    navigate("/admin/home");
  };
  return (
    <div className="containerss">
      <div className="wrapper">
        <div className="title">
          <span>ADD USER</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={(e) => {
                setUserData({ ...userData, name: e.target.value });
              }}
            />
          </div>
          <div className="row">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={(e) => {
                setUserData({ ...userData, email: e.target.value });
              }}
            />
          </div>
          <div className="row">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              onChange={(e) => {
                setUserData({ ...userData, phone: e.target.value });
              }}
            />
          </div>
          <div className="row">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={(e) => {
                setUserData({ ...userData, password: e.target.value });
              }}
            />
          </div>

          <div className="row button">
            <input type="submit" value="ADD USER" />
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddUser;
