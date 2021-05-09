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
// Import Styles
import "../public/ClassroomStudents.css";

const ClassroomStudents = (props) => {
  const classId = props.match.params.cid;
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [classData, setClassData] = useState(null);
  const [tempUserName, setTempUserName] = useState("");
  const [tempFullName, setTempFullName] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [visibleIndex, setVisibleIndex] = useState(-1);

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

  const fetchClassData = () => {
    const TOKEN = token;
    const GET_URL = `http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/classroom/${classId}`;
    const header_config = {
      headers: { Authorization: `Bearer ${TOKEN}` },
    };
    axios
      .get(GET_URL, header_config)
      .then((response) => {
        setClassData(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchStudents = () => {
    const TOKEN = token;
    const GET_URL = `http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/student/${classId}`;
    const header_config = {
      headers: { Authorization: `Bearer ${TOKEN}` },
    };
    axios
      .get(GET_URL, header_config)
      .then((response) => {
        setStudents(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (!!token) {
      fetchClassData();
      fetchStudents();
    }
    // eslint-disable-next-line
  }, [token]);

  const addNewStudentHandler = () => {
    if (!classData) {
      swal("", "Class data is not loaded, try again", "info");
      return;
    }
    if (!!tempUserName && !!tempFullName && !!tempPassword) {
      swal({
        title: "Are you sure?",
        text: "Are you sure you want to add new student?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((sure) => {
        if (sure) {
          const TOKEN = token;
          const POST_URL =
            "http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/student";
          const header_config = {
            headers: { Authorization: `Bearer ${TOKEN}` },
          };
          axios
            .post(
              POST_URL,
              {
                classId,
                className: classData.name,
                name: tempFullName,
                username: tempUserName,
                password: tempPassword,
              },
              header_config
            )
            .then((response) => {
              setTempFullName("");
              setTempUserName("");
              setTempPassword("");
              swal("", "New Student Addedd", "success").then(fetchStudents());
            })
            .catch((error) => {
              console.error(error);
              swal("", "student creation failed, try again!", "error");
            });
        }
      });
    } else {
      swal("", "Fill all the fields in the form", "warning");
    }
  };

  const delay = (second) =>
    new Promise((res) => setTimeout(res, second * 1000));

  const switchPasswordVisibility = async (ind) => {
    if (ind === visibleIndex) {
      setVisibleIndex(-1);
    } else {
      setVisibleIndex(ind);
      await delay(3);
      setVisibleIndex(-1);
    }
  };

  const deleteStudentsHandler = (sid) => {
    swal({
      title: "Are you sure?",
      text: "Are you sure you want to delete this student?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((sure) => {
      if (sure) {
        setIsLoading(true);
        const TOKEN = token;
          const DELETE_URL =
            `http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/student/${sid}`;
          const header_config = {
            headers: { Authorization: `Bearer ${TOKEN}` },
          };
          axios
            .delete(
              DELETE_URL,
              header_config
            )
            .then((response) => {
              fetchStudents();
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
        <Navbar header="Students" />
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
                  <div className="card-header card-header-primary">
                    <h4 className="card-title" style={{ fontWeight: "600" }}>
                      Add Student
                    </h4>
                    <p className="category">
                      Fill the form to add a new student
                    </p>
                  </div>
                  <div className="card-body">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>USER NAME</th>
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
                              type="text"
                              placeholder="Username"
                              value={tempUserName}
                              onChange={(e) => {
                                setTempUserName(e.target.value);
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
                              onClick={addNewStudentHandler}
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
                      <th>Username</th>
                      <th>Full Name</th>
                      <th>Password</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, ind) => {
                      return (
                        <tr className="std-lines" key={ind}>
                          <td>{ind + 1}</td>
                          <td>{student.username}</td>
                          <td>{student.name}</td>
                          <td>
                            {visibleIndex === ind
                              ? student.password
                              : "**********"}
                            <span
                              className="material-icons"
                              onClick={() => {
                                switchPasswordVisibility(ind);
                              }}
                              style={{ float: "right", cursor: "pointer" }}
                            >
                              {visibleIndex === ind
                                ? "visibility_off"
                                : "visibility"}
                            </span>
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => {
                                props.history.push(
                                  `/classrooms/${classId}/students/${student.username}`
                                );
                              }}
                            >
                              <span className="material-icons">visibility</span>
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => {
                                deleteStudentsHandler(student.username);
                              }}
                            >
                              <span className="material-icons">delete</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ClassroomStudents;
