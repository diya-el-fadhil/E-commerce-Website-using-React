import React from "react";
import "./CSS/Admin.css";
import AddProduct from "../Components/AddProduct/AddProduct";
import { Route, Routes } from "react-router-dom";
import ListProduct from "../Components/ListProduct/ListProduct";
import UserManagement from '../Components/UserManagement/UserManagement';

const Admin = () => {

  return (
    <div className="admin">
      <Routes>
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/listproduct" element={<ListProduct />} />
        <Route path='/usermanagement' element={<UserManagement />} />
      </Routes>
    </div>
  );
};

export default Admin;
