import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Style.css";
import { useSelector } from "react-redux";

const Navbar = () => {
  const name = useSelector((state) => state.userReducer.userDetails?.name);
  const jwtToken = localStorage.getItem("jwtToken"); 
  return (
    <nav className="navbar">
      <div className="container">
        <div className="row">
          {/* Logo Section */}
          <div className="col-2">
            <h2>LOGO</h2>
          </div>

          {/* Navigation Links */}
          <div className="col-6">
            <ul className="flex">
              {jwtToken && (
                <>
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/list">Employee List</Link>
                  </li>
                  <li>
                    <Link to="/create">Create Employee</Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* User Info Section */}
          <div className="col-4">
            <ul className="flex">
              {name || localStorage.getItem("name") ? (
                <>
                  <li>
                    <span>{name || localStorage.getItem("name")}</span>
                  </li>
                  <li>
                    <Link to="/logout">Logout</Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login">Login</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
