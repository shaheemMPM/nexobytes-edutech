// Core Modules
import React, { useEffect, useState } from "react";
// Components
import Sidebar from "../core/components/Sidebar";
import Navbar from "../core/components/Navbar";
import Footer from "../core/components/Footer";
// Depandancy Modules
import axios from "axios";

const Home = () => {
  const [dashData, setDashData] = useState(null);
  const [token, setToken] = useState("");
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    if (!!document.getElementsByClassName("nav-open")[0]) {
      document
        .getElementsByClassName("nav-open")[0]
        .classList.remove("nav-open");
    }
    let authData = JSON.parse(sessionStorage.getItem("auth_data"));
    setToken(authData.token);
    setAdminName(authData.name);
    // eslint-disable-next-line
  }, []);

  const fetchDashboardData = () => {
    const TOKEN = token;
    const GET_URL = `http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/dashboard`;
    const header_config = {
      headers: { Authorization: `Bearer ${TOKEN}` },
    };
    axios
      .get(GET_URL, header_config)
      .then((response) => {
        setDashData(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (!!token) {
      fetchDashboardData();
    }
    // eslint-disable-next-line
  }, [token]);

  return (
    <div className="wrapper ">
      <Sidebar />
      <div className="main-panel">
        <Navbar />
        <div className="content">
          <div className="container-fluid">
            <h1
              style={{
                fontSize: "25px",
                marginBottom: "20px",
                fontWeight: "bolder",
              }}
            >
              Hey, {adminName}
            </h1>

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
                      {!!dashData ? dashData.videos : "..."}
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
