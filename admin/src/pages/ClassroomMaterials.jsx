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

const ClassroomMaterials = (props) => {
  const classId = props.match.params.cid;
  const [token, setToken] = useState("");
  const [classData, setClassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tempSubjectName, setTempSubjectName] = useState("");
  const [subjects, setSubjects] = useState([]);

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

  const fetchSubjects = () => {
    const TOKEN = token;
    const GET_URL = `http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/subject/class/${classId}`;
    const header_config = {
      headers: { Authorization: `Bearer ${TOKEN}` },
    };
    axios
      .get(GET_URL, header_config)
      .then((response) => {
        setSubjects(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (!!token) {
      fetchClassData();
      fetchSubjects();
    }
    // eslint-disable-next-line
  }, [token]);

  const addNewSubjectHandler = () => {
    if (!classData) {
      swal("", "Class data is not loaded, try again", "info");
      return;
    }
    if (!!tempSubjectName) {
      let subKey = `${classId}_${tempSubjectName
        .split(" ")
        .join("")
        .toLowerCase()}`;
      swal({
        title: "Are you sure?",
        text: "Are you sure you want to add new subject?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((sure) => {
        if (sure) {
          const TOKEN = token;
          const POST_URL =
            "http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/subject";
          const header_config = {
            headers: { Authorization: `Bearer ${TOKEN}` },
          };
          axios
            .post(
              POST_URL,
              {
                subjectId: subKey,
                name: tempSubjectName,
                classId,
                className: classData.name,
              },
              header_config
            )
            .then((response) => {
              setIsFormOpen(false);
              swal("", "New Subject Added", "success").then(fetchSubjects());
            })
            .catch((error) => {
              console.error(error);
              swal("", "Subject creation failed, try again!", "error");
            });
        }
      });
    }
  };

  return (
    <div className="wrapper ">
      <Sidebar />
      <div className="main-panel">
        <Navbar header="Materials" />
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
                      <h4 className="card-title">Add New Subject</h4>
                      <div style={{ marginTop: "25px" }}>
                        <div className="form-group">
                          <label htmlFor="ipClassName">Subject Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="ipClassName"
                            placeholder="Enter Subject Name"
                            onChange={(e) => {
                              setTempSubjectName(e.target.value);
                            }}
                          />
                        </div>
                        <button
                          className="btn btn-success"
                          onClick={addNewSubjectHandler}
                        >
                          ADD NEW SUBJECT
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="row">
                  {subjects.map((subject) => {
                    return (
                      <div className="col" key={subject.subjectId}>
                        <div
                          className="card"
                          style={{
                            width: "225px",
                            height: "172.5px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            props.history.push(
                              `/classrooms/${classId}/materials/${subject.subjectId}`
                            );
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
                              {subject.name}
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

export default ClassroomMaterials;
