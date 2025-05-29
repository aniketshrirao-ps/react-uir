import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.scss';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="nav-link" end>
          Carousel Demo
        </NavLink>
        <NavLink to="/about" className="nav-link">
          About
        </NavLink>
        <NavLink to="/acceleration" className="nav-link">
          Acceleration
        </NavLink>
        <NavLink to="/toolversion" className="nav-link">
          Tool Version
        </NavLink>
        <NavLink to="/carousels" className="nav-link">
          Carousel
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;