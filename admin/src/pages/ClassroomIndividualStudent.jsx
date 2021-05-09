// Core Modules
import React, { useState, useEffect } from "react";
// Components
import Sidebar from "../core/components/Sidebar";
import Navbar from "../core/components/Navbar";
import Footer from "../core/components/Footer";
// Depandancy Modules
import axios from "axios";
import MoonLoader from "react-spinners/MoonLoader";
import swal from "sweetalert";

const ClassroomIndividualStudent = (props) => {
  const username = props.match.params.username;
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [tempStudentPassword, setTempStudentPassword] = useState("");

  useEffect(() => {
    if (!!document.getElementsByClassName("nav-open")[0]) {
      document
        .getElementsByClassName("nav-open")[0]
        .classList.remove("nav-open");
    }
    let authData = JSON.parse(sessionStorage.getItem("auth_data"));
    setToken(authData.token);
    // eslint-disable-next-line
  }, []);

  const fetchStudent = () => {
    const TOKEN = token;
    const GET_URL = `http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/student/std/${username}`;
    const header_config = {
      headers: { Authorization: `Bearer ${TOKEN}` },
    };
    axios
      .get(GET_URL, header_config)
      .then((response) => {
        setStudent(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (!!token) {
      fetchStudent();
    }
    // eslint-disable-next-line
  }, [token]);

  const changePasswordHandler = () => {
    if (!tempStudentPassword) {
      swal("", "New Password cannot be empty", "warning");
      return;
    }
    swal({
      title: "Are you sure?",
      text: "Are you sure you want to change the password?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((sure) => {
      if (sure) {
        setIsLoading(true);
        const TOKEN = token;
        const PATCH_URL = `http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/student/password/${username}`;
        const header_config = {
          headers: { Authorization: `Bearer ${TOKEN}` },
        };
        axios
          .patch(
            PATCH_URL,
            {
              password: tempStudentPassword,
            },
            header_config
          )
          .then((response) => {
            swal("", "Password changed", "success").then(() => {
              setTempStudentPassword("");
              fetchStudent();
            });
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  };

  const switchLoginStateHandler = () => {
    swal({
      title: "Are you sure?",
      text: "Are you sure you want to change the login status?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((sure) => {
      if (sure) {
        setIsLoading(true);
        const TOKEN = token;
        const PATCH_URL = `http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/student/status/${username}`;
        const header_config = {
          headers: { Authorization: `Bearer ${TOKEN}` },
        };
        axios
          .patch(
            PATCH_URL,{},
            header_config
          )
          .then((response) => {
            swal("", "login status changed", "success").then(() => {
              fetchStudent();
            });
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  };

  return (
    <div className="wrapper ">
      <Sidebar />
      <div className="main-panel">
        <Navbar header={student ? student.username : "Student"} />
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
            ) : (
              <>
                <div className="card">
                  <div className="card-body">
                    <table className="table">
                      <tbody>
                        <tr>
                          <th colSpan="4" className="text-center">
                            {student.name}
                          </th>
                        </tr>
                        <tr>
                          <th>Username</th>
                          <td>{student.username}</td>
                          <th>Classroom</th>
                          <td>{student.className}</td>
                        </tr>
                        <tr>
                          <th>Created At</th>
                          <td>
                            {new Date(student.createdAt).toLocaleString()}
                          </td>
                          <th>Created By</th>
                          <td>{student.createdBy}</td>
                        </tr>
                        <tr>
                          <th>Password</th>
                          <td>{student.password}</td>
                          <th>Change Password</th>
                          <td>
                            <div className="row">
                              <div className="col-9">
                                <input
                                  placeholder="New Password"
                                  className="form-control"
                                  type="text"
                                  value={tempStudentPassword}
                                  onChange={(e) => {
                                    setTempStudentPassword(e.target.value);
                                  }}
                                />
                              </div>
                              <div className="col-3">
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={changePasswordHandler}
                                >
                                  CHANGE
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th>Is Logged In</th>
                          <td>{student.isActive ? "YES" : "NO"}</td>
                          <th>Switch Status</th>
                          <td>
                            <button
                              className="btn btn-sm btn-success btn-block"
                              onClick={switchLoginStateHandler}
                            >
                              CHANGE STATUS
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ClassroomIndividualStudent;
