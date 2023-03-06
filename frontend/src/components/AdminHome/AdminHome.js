import React, { useEffect, useState } from "react";
import "../AdminHome/AdminHome.css";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../redux/userSlice";

const AdminHome = () => {
  const navigate = useNavigate();
  const [cookie, setCookie, removeCookie] = useCookies([]);
  const [allUsers, setAllUsers] = useState([]);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!cookie.jwt) {
      navigate("/admin");
    }
    getUserList();
  }, [cookie, navigate, removeCookie]);

  function getUserList() {
    axios
      .get("http://localhost:4000/admin/userlist", { withCredentials: true })
      .then((response) => {
        // console.log(response);
        setAllUsers(response.data.users);
        // setFilterData(response.data.users)
      });
  }

  
  const filterData = (e) => {
    if (e.target.vlaue != "") {
      setValue(e.target.value);
      const filterUsers = allUsers.filter((o) =>
        Object.keys(o).some((k) =>
          String(o[k]).toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
      setSearch([...filterUsers]);
    } else {
      setValue(e.target.value);
      setAllUsers([...allUsers]);
    }
  };

  function deleteUser(userId) {
    axios
      .delete(`http://localhost:4000/admin/delete-user/${userId}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message, {
            position: "top-center",
          });
          getUserList();
        } else {
          toast.error(response.data.message, {
            position: "top-center",
          });
        }
      });
  }

  return (
    <div>
      <h1 className="heading">Users List</h1>

      <div className="btnctr">
        <input
          type="text"
          id="search"
          value={value}
          name="search"
          onChange={filterData}
          className="form-control"
          placeholder="search.."
        />

        <button
          className="addBtn"
          onClick={() => {
            navigate("/admin/add-user");
          }}
        >
          Add User
        </button>
      </div>

      <Table striped bordered hover responsive variant="light">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {value.length > 0
            ? search.map((user, key) => {
                return (
                  <tr key={key}>
                    <td scope="row">{key + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <button
                        className="editBtn"
                        onClick={() => {
                          dispatch(
                            setUserDetails({
                              name: user.name,
                              email: user.email,
                              phone: user.phone,
                              id: user._id,
                            })
                          );
                          navigate("/admin/edit-user");
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="deleteBtn"
                        onClick={() => {
                          deleteUser(user._id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            : allUsers.map((user, key) => {
                return (
                  <tr key={key}>
                    <td scope="row">{key + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <button
                        className="editBtn"
                        onClick={() => {
                          dispatch(
                            setUserDetails({
                              name: user.name,
                              email: user.email,
                              phone: user.phone,
                              id: user._id,
                            })
                          );
                          navigate("/admin/edit-user");
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="deleteBtn"
                        onClick={() => {
                          deleteUser(user._id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
        </tbody>
        <ToastContainer />
      </Table>
    </div>
  );
};

export default AdminHome;
