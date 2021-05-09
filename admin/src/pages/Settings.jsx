// Core Modules
import React, { useEffect, useState } from "react";
// Components
import Sidebar from "../core/components/Sidebar";
import Navbar from "../core/components/Navbar";
import Footer from "../core/components/Footer";
// Depandancy Modules
import axios from "axios";
import swal from "sweetalert";
import MoonLoader from "react-spinners/MoonLoader";

const Settings = () => {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tempEmail, setTempEmail] = useState("");
  const [tempFullName, setTempFullName] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  useEffect(() => {
    if (!!document.getElementsByClassName("nav-open")[0]) {
      document
        .getElementsByClassName("nav-open")[0]
        .classList.remove("nav-open");
    }
    let authData = JSON.parse(sessionStorage.getItem("auth_data"));
    setToken(authData.token);
    setEmail(authData.email);
    // eslint-disable-next-line
  }, []);

  const fetchAdmins = () => {
    const TOKEN = token;
    const GET_URL = `http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/admin`;
    const header_config = {
      headers: { Authorization: `Bearer ${TOKEN}` },
    };
    axios
      .get(GET_URL, header_config)
      .then((response) => {
        setAdmins(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (!!token) {
      if (email === "directionkodur@gmail.com") {
        fetchAdmins();
      } else {
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line
  }, [token]);

  const addNewAdminHandler = () => {
    if (!!tempEmail && !!tempFullName && !!tempPassword) {
      swal({
        title: "Are you sure?",
        text: "Are you sure you want to add new admin?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((sure) => {
        if (sure) {
          const TOKEN = token;
          const POST_URL =
            "http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/admin/signup";
          const header_config = {
            headers: { Authorization: `Bearer ${TOKEN}` },
          };
          axios
            .post(
              POST_URL,
              {
                email: tempEmail,
                name: tempFullName,
                password: tempPassword,
              },
              header_config
            )
            .then((response) => {
              setTempFullName("");
              setTempEmail("");
              setTempPassword("");
              swal("", "New Admin Addedd", "success")
                .then
                // fetchStudents()
                ();
            })
            .catch((error) => {
              console.error(error);
              swal("", "Admin creation failed, try again!", "error");
            });
        }
      });
    } else {
      swal("", "Fill all the fields in the form", "warning");
    }
  };

  return (
    <div className="wrapper ">
      <Sidebar />
      <div className="main-panel">
        <Navbar />
        <div className="content">
          <div className="container-fluid">
            {isLoading ? (
              <MoonLoader
                css={{
                  display: "block",
                  margin: "25vh auto",
                  borderColor: "red",
                }}
                size={100}
                color={"#0000EE"}
                loading={true}
              />
            ) : email === "directionkodur@gmail.com" ? (
              <>
                <div className="card">
                  <div className="card-header card-header-primary">
                    <h4 className="card-title" style={{ fontWeight: "600" }}>
                      Add Admin
                    </h4>
                    <p className="category">
                      Add sub admins, only super admin can view this option
                    </p>
                  </div>
                  <div className="card-body">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>EMAIL</th>
                          <th>NAME</th>
                          <th>PASSWORD</th>
                          <th>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <input
                              className="form-control"
                              type="email"
                              placeholder="Email"
                              value={tempEmail}
                              onChange={(e) => {
                                setTempEmail(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Full Name"
                              value={tempFullName}
                              onChange={(e) => {
                                setTempFullName(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Password"
                              value={tempPassword}
                              onChange={(e) => {
                                setTempPassword(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-success btn-sm btn-block"
                              onClick={addNewAdminHandler}
                            >
                              ADD
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <table className="table std-table">
                  <thead className="thead-dark">
                    <tr>
                      <th>Sl No</th>
                      <th>Email</th>
                      <th>Full Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin, ind) => {
                      return (
                        <tr className="std-lines" key={ind}>
                          <td>{ind + 1}</td>
                          <td>{admin.email}</td>
                          <td>{admin.name}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            ) : (
              <>
                <h2>Access Denied</h2>
                <p>
                  You don't have permission to the features in this page, only
                  super admin can access the settings
                </p>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Settings;
