import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./Home.css";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../redux/userSlice";

const Home = () => {
  const dispatch = useDispatch();
  const [cookie, setCookie, removeCookie] = useCookies([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      if (!cookie.jwt) {
        navigate("/login");
      } else {
        const { data } = await axios.post(
          "http://localhost:4000",
          {},
          { withCredentials: true }
        );

        if (!data.status) {
          removeCookie("jwt");
          navigate("/login");
        } else {
          // toast(`Hi ${data.user}`, { theme: "dark" });
        }
      }
    };
    checkUser();
  }, [cookie, navigate, removeCookie]);

  const logOut = () => {
    dispatch(
      setUserDetails({
        name: null,
        id: null,
        image: null,
        phone: null,
        email: null,
        token: null,
      })
    );
    removeCookie("jwt");
    navigate("/login");
  };
  return (
    <>
      <div className="container">
        <h1 style={{ textAlign: "center" }}>Welcome to Homepage </h1>
        <div>
          <button
            onClick={() => {
              navigate("/profile");
            }}
          >
            Profile
          </button>
          <button onClick={logOut}>Logout</button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;
