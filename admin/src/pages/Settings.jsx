// Core Modules
import React, { useEffect } from "react";
// Components
import Sidebar from "../core/components/Sidebar";
import Navbar from "../core/components/Navbar";
import Footer from "../core/components/Footer";
// Depandancy Modules
// import * as firebase from "firebase/app";
// import 'firebase/database';

const Settings = () => {
  useEffect(() => {
    if (!!document.getElementsByClassName("nav-open")[0]) {
      document
        .getElementsByClassName("nav-open")[0]
        .classList.remove("nav-open");
    }
  }, []);

  return (
    <div className="wrapper ">
      <Sidebar />
      <div className="main-panel">
        <Navbar />
        <div className="content">
          <div className="container-fluid"></div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Settings;
