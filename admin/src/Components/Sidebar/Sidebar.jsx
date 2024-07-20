import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Link to='/addproduct' style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <p>Add Product</p>
        </div>
      </Link>
      <Link to='/listproduct' style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <p>Product List</p>
        </div>
      </Link>
      <Link to='/usermanagement' style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <p>User Management</p>
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;
