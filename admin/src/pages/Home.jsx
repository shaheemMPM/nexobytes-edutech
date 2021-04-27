// Core Modules
import React, { useEffect } from "react";
// Components
import Sidebar from "../core/components/Sidebar";
import Navbar from "../core/components/Navbar";
import Footer from "../core/components/Footer";
// Depandancy Modules
// import * as firebase from "firebase/app";
// import 'firebase/database';

const Home = () => {
  const dashData = null;

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
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="card card-stats">
                  <div
                    className="card-header card-header-success card-header-icon"
                    style={{ height: "120px" }}
                  >
                    <div className="card-icon">
                      <i className="material-icons">supervisor_account</i>
                    </div>
                    <p className="card-category">Total Students</p>
                    <h3 className="card-title">
                      {!!dashData ? dashData.students : "..."}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="card card-stats">
                  <div
                    className="card-header card-header-success card-header-icon"
                    style={{ height: "120px" }}
                  >
                    <div className="card-icon">
                      <i className="material-icons">school</i>
                    </div>
                    <p className="card-category">Total Classrooms</p>
                    <h3 className="card-title">
                      {!!dashData ? dashData.classrooms : "..."}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="card card-stats">
                  <div
                    className="card-header card-header-success card-header-icon"
                    style={{ height: "120px" }}
                  >
                    <div className="card-icon">
                      <i className="material-icons">smart_display</i>
                    </div>
                    <p className="card-category">Total Lectures</p>
                    <h3 className="card-title">
                      {!!dashData ? dashData.lectures : "..."}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="card card-stats">
                  <div
                    className="card-header card-header-success card-header-icon"
                    style={{ height: "120px" }}
                  >
                    <div className="card-icon">
                      <i className="material-icons">picture_as_pdf</i>
                    </div>
                    <p className="card-category">Total Materials</p>
                    <h3 className="card-title">
                      {!!dashData ? dashData.materials : "..."}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="card card-stats">
                  <div
                    className="card-header card-header-success card-header-icon"
                    style={{ height: "120px" }}
                  >
                    <div className="card-icon">
                      <i className="material-icons">sd_card</i>
                    </div>
                    <p className="card-category">Storage Used</p>
                    <h3 className="card-title">
                      {!!dashData ? dashData.storage : "..."}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="card card-stats">
                  <div
                    className="card-header card-header-success card-header-icon"
                    style={{ height: "120px" }}
                  >
                    <div className="card-icon">
                      <i className="material-icons">local_police</i>
                    </div>
                    <p className="card-category">Admins</p>
                    <h3 className="card-title">
                      {!!dashData ? dashData.admins : "..."}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
