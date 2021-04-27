// Core Modules
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <nav className="float-left">
          <ul>
            <li>
              <span>NEXOBYTES</span>
            </li>
          </ul>
        </nav>
        <div className="copyright float-right">
          &copy; {new Date().getFullYear()}, Developed with{" "}
          <i className="material-icons" style={{ color: "#BA0001" }}>
            favorite
          </i>{" "}
          by
          <a
            href="https://www.nexobytes.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#BA0001", fontWeight: "bolder" }}
          >
            {" "}
            Nexobytes
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
