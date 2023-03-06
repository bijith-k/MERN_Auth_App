import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminHomePage from "./pages/AdminHomePage";
import AddUserPage from "./pages/AddUserPage";
import EditUserPage from "./pages/EditUserPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/update-profile" element={<UpdateProfilePage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/home" element={<AdminHomePage />} />
        <Route path="/admin/add-user" element={<AddUserPage />} />
        <Route path="/admin/edit-user" element={<EditUserPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
