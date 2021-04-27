// Core Modules
import React from 'react';
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar" data-color="azure" data-background-color="white">
      <div className="logo">
        <span className="simple-text logo-normal">NEXOBYTES</span>
      </div>
      <div className="sidebar-wrapper">
        <ul className="nav">
          <li
            className={
              window.location.pathname === "/" ? "nav-item active" : "nav-item"
            }
          >
            <Link className="nav-link" to="/">
              <i className="material-icons">dashboard</i>
              <p
                style={{
                  fontWeight: window.location.pathname === "/" ? "800" : "200",
                }}
              >
                Dashboard
              </p>
            </Link>
          </li>
          <li
            className={
              window.location.pathname.includes("classrooms")
                ? "nav-item active"
                : "nav-item"
            }
          >
            <Link className="nav-link" to="/classrooms">
              <i className="material-icons">school</i>
              <p
                style={{
                  fontWeight:
                    window.location.pathname.includes("classrooms") ? "800" : "200",
                }}
              >
                Classrooms
              </p>
            </Link>
          </li>
          <li
            className={
              window.location.pathname.includes("settings")
                ? "nav-item active"
                : "nav-item"
            }
          >
            <Link className="nav-link" to="/settings">
              <i className="material-icons">settings</i>
              <p
                style={{
                  fontWeight:
                    window.location.pathname === "/settings" ? "800" : "200",
                }}
              >
                Settings
              </p>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
