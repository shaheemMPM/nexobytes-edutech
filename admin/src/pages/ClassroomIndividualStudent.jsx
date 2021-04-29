// Core Modules
import React, { useState, useEffect } from "react";
// Components
import Sidebar from "../core/components/Sidebar";
import Navbar from "../core/components/Navbar";
import Footer from "../core/components/Footer";
// Depandancy Modules
import * as firebase from "firebase/app";
import "firebase/firestore";
import MoonLoader from "react-spinners/MoonLoader";
import swal from "sweetalert";

const ClassroomIndividualStudent = (props) => {
  const username = props.match.params.username;
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [tempStudentPassword, setTempStudentPassword] = useState("");

  useEffect(() => {
    if (!!document.getElementsByClassName("nav-open")[0]) {
      document
        .getElementsByClassName("nav-open")[0]
        .classList.remove("nav-open");
    }
    fetchStudent();
    // eslint-disable-next-line
  }, []);

  const fetchStudent = () => {
    firebase
      .firestore()
      .collection("students")
      .doc(username)
      .get()
      .then((studentData) => {
        setStudent(studentData.data());
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
      });
  };

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
        firebase
          .firestore()
          .collection("students")
          .doc(username)
          .update({
            password: tempStudentPassword,
          })
          .then(() => {
            swal("", "Password changed", "success").then(() => {
              setTempStudentPassword("");
              fetchStudent();
            });
          })
          .catch((e) => {
            console.error(e);
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
        firebase
          .firestore()
          .collection("students")
          .doc(username)
          .update({
            isActive: !student.isActive
          })
          .then(() => {
            swal("", "login status changed", "success").then(() => {
              fetchStudent();
            });
          })
          .catch((e) => {
            console.error(e);
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
                                <button className="btn btn-sm btn-success" onClick={changePasswordHandler}>
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
                            <button className="btn btn-sm btn-success btn-block" onClick={switchLoginStateHandler}>
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
