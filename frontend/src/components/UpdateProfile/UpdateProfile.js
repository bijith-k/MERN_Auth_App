import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserDetails } from "../../redux/userSlice";
import "../UpdateProfile/UpdateProfile.css";
import { ToastContainer, toast } from "react-toastify";

const UpdateProfile = () => {
  const user = useSelector((state) => state.user);
  const [cookie, setCookie, removeCookie] = useCookies([]);
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const dispatch = useDispatch();
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
  }, [cookie, navigate, removeCookie]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        userId: user.id,
      },
      withCredentials: true,
    };

    try {
      const formData = new FormData();
      formData.append("image", image);

      const { data } = await axios.post(
        "http://localhost:4000/upload-image",
        formData,
        config
      );
      console.log(data, "ll");
      if (data.status) {
        dispatch(
          setUserDetails({
            email: data.user.email,
            id: data.user._id,
            image: data.user.image.path,
            name: data.user.name,
            phone: data.user.phone,
          })
        );

        toast.success(data.message, {
          position: "top-center",
        });
      } else {
        toast.error(data.message, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        position: "top-center",
      });
    }
    navigateToProfilePage();
  };

  const navigateToProfilePage = () => {
    navigate("/profile");
  };

  return (
    <div className="container" id="cont">
      <div className="profileContainers">
        <div className="images">
          <img
            src={
              image
                ? URL.createObjectURL(image) ?? ""
                : `http://localhost:4000/${user.image ? user.image: ""}`
            }
          />
        </div>

        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                className="imgInp"
                type="file"
                name="image"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
                required
              />
              <input className="imgSubmit" type={"submit"} />
            </div>
          </form>
          <ToastContainer />
        </div>
        <div>
          <button
            className="homeb"
            onClick={() => {
              navigate("/");
            }}
          >
            HOME
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
