import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "../Login/Login.css";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../redux/userSlice";
import { setAdminDetails } from "../../redux/adminSlice";

const Login = ({ admin }) => {
  const user = useSelector((state) => state.user);
  const adminState = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState("");
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  

  useEffect(() => {
    if (user.token) {
      navigate("/");
    }

    if (admin && adminState.token) {
      navigate("/admin/home");
    }
  }, []);

  const generateError = (err) => {
    toast.error(err, {
      position: "top-center",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.email) {
      setErrors("Email is required");
      return;
    }
    if (!userData.password) {
      setErrors("Password is required");
      return;
    }

    try {
      if (!admin) {
        var { data } = await axios.post(
          "http://localhost:4000/login",
          {
            ...userData,
          },
          { withCredentials: true }
        );
      } else {
        var { data } = await axios.post(
          "http://localhost:4000/admin",
          {
            ...userData,
          },
          { withCredentials: true }
        );
      }
      if (data) {
        if (data.errors) {
          const { email, password } = data.errors;
          if (email) generateError(email);
          else if (password) generateError(password);
        } else {
          if (!admin) {
            console.log(data.user);
            dispatch(
              setUserDetails({
                name: data.user.name,
                id: data.user._id,
                email: data.user.email,
                phone: data.user.phone,
                token: data.token,
              })
            );
            navigate("/");
          } else {
            dispatch(
              setAdminDetails({
                email: data.admin.email,
                token: data.token,
              })
            );
            navigate("/admin/home");
          }
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
          <span>{admin ? "ADMIN" : ""} LOGIN HERE </span>
        </div>
        <form onSubmit={handleSubmit}>
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
            <input type="submit" value="LOGIN" />
          </div>

          <div className="signup-link">
            {" "}
            {admin ? (
              ""
            ) : (
              <p style={{ color: "blue" }}>
                Don't have an account ?<Link to="/register"> Register</Link>
              </p>
            )}
          </div>
          <ToastContainer />
        </form>
      </div>
    </div>
  );
};

export default Login;
