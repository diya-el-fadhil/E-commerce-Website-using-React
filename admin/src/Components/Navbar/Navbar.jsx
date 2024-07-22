import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='navbar'>
      <h2>STORED Admin Pannel</h2>
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
    
    
  )
}

export default Navbar
