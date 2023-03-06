import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../Profile/Profile.css";
import axios from "axios";

const Profile = () => {
  const user = useSelector((state) => state.user);
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
        }
      }
    };
    checkUser();
  }, [cookie, navigate, removeCookie, user]);
  return (
    <div className="container">
      <div className="profileContainer">
        <div className="image">
          <img
            src={
              user.image
                ? `http://localhost:4000/${user.image.path}`
                : "http://localhost:4000/images/blank-profile-picture-g4428f657d_1280.png"
            }
            alt="Profile"
          />
        </div>
        <div className="details">
          <h3 className="content">Name : {user.name}</h3>
          <h6 className="content">Email : {user.email}</h6>
          <h6 className="content">Phone : {user.phone}</h6>
        </div>
        <div>
          <button
            onClick={() => {
              navigate("/update-profile");
            }}
          >
            Change image
          </button>
          <button
            onClick={() => {
              navigate("/");
            }}
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
