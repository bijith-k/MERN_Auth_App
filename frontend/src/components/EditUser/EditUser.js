import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const EditUser = () => {
  const user = useSelector((state) => state.user);
  const [userData, setUserData] = useState(user);
  const navigate = useNavigate();
  const [cookie, setCookie, removeCookie] = useCookies([]);

  useEffect(() => {
    const verifyUser = async () => {
      if (!cookie.jwt) {
        navigate("/admin");
      } else {
        const { data } = await axios.post(
          "http://localhost:4000",
          {},
          { withCredentials: true }
        );
        if (!data.status) {
          removeCookie("jwt");
          navigate("/admin");
        }
      }
    };
    verifyUser();
  }, [cookie, navigate, removeCookie]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^\w+([\\.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!user) {
      toast.error("No user");
      return;
    }
    if (!userData.name || userData.name.match(/^\s*$/)) {
      toast.error("Name is required");
      return;
    }
    if (!userData.email || userData.email.match(/^\s*$/)) {
      toast.error("Email is required");
      return;
    }
    if (!userData.phone) {
      toast.error("Phone number is required");
      return;
    }
    if (!emailRegex.test(userData.email)) {
      toast.error("Enter a valid email address");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(userData.phone)) {
      toast.error("Only 10 digit numbers");
      return;
    }

    try {
      axios
        .put(
          "http://localhost:4000/admin/edit-user/",
          { ...userData },
          { withCredentials: true }
        )
        .then((response) => {
          if (response.data.status) {
            toast.success(response.data.message, {
              position: "top-center",
            });
          } else if (response.data.codeName === "DuplicateKey") {
            toast.error("User with same email already exists", {
              position: "top-center",
            });
          } else {
            toast.error(response.data.message, {
              position: "top-center",
            });
          }
        });
      navigate("/admin/home");
    } catch (err) {
      toast.error("Something gone wrong", {
        position: "top-center",
      });
    }
  };
  return (
    <div className="containerss">
      <div className="wrapper">
        <div className="title">
          <span>EDIT USER</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
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
              value={userData.email}
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
              value={userData.phone}
              onChange={(e) =>
                setUserData({ ...userData, phone: e.target.value })
              }
            />
          </div>

          <div className="row button">
            <input type="submit" value="UPDATE USER" />
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditUser;
