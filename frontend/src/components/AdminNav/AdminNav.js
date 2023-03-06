import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAdminDetails } from "../../redux/adminSlice";
import "../AdminNav/AdminNav.css";
import { useCookies } from "react-cookie";

const AdminNav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookie, setCookie, removeCookie] = useCookies([]);
  return (
    <div className="head">
      <div className="headings">
        <h1>ADMIN</h1>
        <button
          className="logout"
          onClick={() => {
            dispatch(
              setAdminDetails({
                email: null,
                token: null,
              })
            );

            removeCookie("jwt");
            navigate("/admin");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNav;
