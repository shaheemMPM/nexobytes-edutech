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

const Classrooms = (props) => {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tempClassName, setTempClassName] = useState("");
  const [tempClassDescription, setTempClassDescription] = useState("");
  const [classrooms, setClassrooms] = useState([]);

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

  const fetchClassRooms = () => {
    const TOKEN = token;
    const GET_URL =
      "http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/classroom";
    const header_config = {
      headers: { Authorization: `Bearer ${TOKEN}` },
    };
    axios
      .get(GET_URL, header_config)
      .then((response) => {
        setClassrooms(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (!!token) {
      fetchClassRooms();
    }
    // eslint-disable-next-line
  }, [token]);

  const addNewClassHandler = () => {
    if (!!tempClassName) {
      let classKey = tempClassName.split(" ").join("").toLowerCase();
      swal({
        title: "Are you sure?",
        text: "Are you sure you want to add new classroom?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((sure) => {
        if (sure) {
          const TOKEN = token;
          const POST_URL =
            "http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/classroom";
          const header_config = {
            headers: { Authorization: `Bearer ${TOKEN}` },
          };
          axios
            .post(
              POST_URL,
              {
                classId: classKey,
                name: tempClassName,
                description: tempClassDescription,
              },
              header_config
            )
            .then((response) => {
              setIsFormOpen(false);
              swal("", "New Classroom Addedd", "success").then(
                fetchClassRooms()
              );
            })
            .catch((error) => {
              console.error(error);
              swal("", "Classroom creation failed, try again!", "error");
            });
        }
      });
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
            ) : (
              <>
                <button
                  className={`btn ${isFormOpen ? "btn-danger" : "btn-success"}`}
                  onClick={() => {
                    setIsFormOpen(!isFormOpen);
                  }}
                >
                  {isFormOpen ? "CANCEL" : "NEW"}
                </button>
                {isFormOpen ? (
                  <div className="card" style={{ marginTop: "40px" }}>
                    <div className="card-header card-header-icon">
                      <div className="card-icon">
                        <i className="material-icons">class</i>
                      </div>
                    </div>
                    <div className="card-body">
                      <h4 className="card-title">Add New Classroom</h4>
                      <div style={{ marginTop: "25px" }}>
                        <div className="form-group">
                          <label htmlFor="ipClassName">Class Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="ipClassName"
                            placeholder="Enter Class Name"
                            onChange={(e) => {
                              setTempClassName(e.target.value);
                            }}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="classDescription">Description</label>
                          <textarea
                            className="form-control"
                            id="classDescription"
                            rows="3"
                            placeholder="About the class"
                            onChange={(e) => {
                              setTempClassDescription(e.target.value);
                            }}
                          ></textarea>
                        </div>
                        <button
                          className="btn btn-success"
                          onClick={addNewClassHandler}
                        >
                          ADD NEW CLASS
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="row">
                  {classrooms.map((classroom) => {
                    return (
                      <div className="col-3" key={classroom.classId}>
                        <div
                          className="card"
                          style={{
                            width: "225px",
                            height: "172.5px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            props.history.push(`/classrooms/${classroom.classId}`);
                          }}
                        >
                          <div className="card-body">
                            <h3
                              className="card-title"
                              style={{
                                textAlign: "center",
                                marginTop: "53.75px",
                              }}
                            >
                              {classroom.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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

export default Classrooms;
