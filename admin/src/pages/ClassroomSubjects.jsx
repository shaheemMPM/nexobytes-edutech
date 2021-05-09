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

const ClassroomSubjects = (props) => {
  const classId = props.match.params.cid;
  const subjectId = props.match.params.sid;
  const [token, setToken] = useState("");
  const [subjectData, setSubjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tempChapterName, setTempChapterName] = useState("");
  const [chapters, setChapters] = useState([]);

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

  const fetchSubjectData = () => {
    const TOKEN = token;
    const GET_URL = `http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/subject/${subjectId}`;
    const header_config = {
      headers: { Authorization: `Bearer ${TOKEN}` },
    };
    axios
      .get(GET_URL, header_config)
      .then((response) => {
        setSubjectData(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchChapters = () => {
    const TOKEN = token;
    const GET_URL = `http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/chapter/subject/${subjectId}`;
    const header_config = {
      headers: { Authorization: `Bearer ${TOKEN}` },
    };
    axios
      .get(GET_URL, header_config)
      .then((response) => {
        setChapters(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (!!token) {
      fetchSubjectData();
      fetchChapters();
    }
    // eslint-disable-next-line
  }, [token]);

  const addNewChapterHandler = () => {
    if (!subjectData) {
      swal("", "subject data is not loaded, try again", "info");
      return;
    }
    if (!!tempChapterName) {
      let chapterKey = `${subjectId}_${tempChapterName
        .split(" ")
        .join("")
        .toLowerCase()}`;
      swal({
        title: "Are you sure?",
        text: "Are you sure you want to add new chapter?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((sure) => {
        if (sure) {
          const TOKEN = token;
          const POST_URL =
            "http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/chapter";
          const header_config = {
            headers: { Authorization: `Bearer ${TOKEN}` },
          };
          axios
            .post(
              POST_URL,
              {
                chapterId: chapterKey,
                name: tempChapterName,
                classId,
                className: subjectData.className,
                subjectId: subjectId,
                subjectName: subjectData.name,
              },
              header_config
            )
            .then((response) => {
              setIsFormOpen(false);
              swal("", "New chapter Added", "success").then(fetchChapters());
            })
            .catch((error) => {
              console.error(error);
              swal("", "chapter creation failed, try again!", "error");
            });
        }
      });
    }
  };

  return (
    <div className="wrapper ">
      <Sidebar />
      <div className="main-panel">
        <Navbar header={!!subjectData ? subjectData.name : "Subjects"} />
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
                      <h4 className="card-title">Add New Chapter</h4>
                      <div style={{ marginTop: "25px" }}>
                        <div className="form-group">
                          <label htmlFor="ipClassName">Chapter Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="ipClassName"
                            placeholder="Enter chapter Name"
                            onChange={(e) => {
                              setTempChapterName(e.target.value);
                            }}
                          />
                        </div>
                        <button
                          className="btn btn-success"
                          onClick={addNewChapterHandler}
                        >
                          ADD NEW CHAPTER
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="row">
                  {chapters.map((chapter) => {
                    return (
                      <div className="col" key={chapter.chapterId}>
                        <div
                          className="card"
                          style={{
                            width: "225px",
                            height: "172.5px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            props.history.push(
                              `/classrooms/${classId}/lectures/${subjectId}/${chapter.chapterId}`
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
                              {chapter.name}
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

export default ClassroomSubjects;
