// Core Modules
import React, { useEffect, useState } from "react";
// Components
import Sidebar from "../core/components/Sidebar";
import Navbar from "../core/components/Navbar";
import Footer from "../core/components/Footer";
// Depandancy Modules
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import swal from "sweetalert";
import MoonLoader from "react-spinners/MoonLoader";

const ClassroomMaterialSubjects = (props) => {
  const classId = props.match.params.cid;
  const subjectId = props.match.params.sid;
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
    fetchSubjectData();
    fetchChapters();
    // eslint-disable-next-line
  }, []);

  const fetchSubjectData = () => {
    firebase
      .firestore()
      .collection("subjects")
      .doc(subjectId)
      .get()
      .then((subjectData) => {
        setSubjectData(subjectData.data());
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const fetchChapters = () => {
    firebase
      .firestore()
      .collection("chapters")
      .where("subjectId", "==", subjectId)
      .orderBy("name")
      .get()
      .then((querySnapshot) => {
        let tempChapters = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setChapters(tempChapters);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
      });
  };

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
          firebase
            .firestore()
            .collection("chapters")
            .doc(chapterKey)
            .get()
            .then((chapter) => {
              if (!!chapter.data()) {
                swal(
                  "Invalid chapter Name",
                  "A chapter with the same name already exist in database",
                  "error"
                );
                return;
              }
              firebase
                .firestore()
                .collection("chapters")
                .doc(chapterKey)
                .set({
                  name: tempChapterName,
                  classId,
                  className: subjectData.name,
                  subjectId: subjectId,
                  subjectName: subjectData.name,
                  createdAt: Number(new Date()),
                  createdBy: firebase.auth().currentUser.email,
                })
                .then(() => {
                  setIsFormOpen(false);
                  swal("", "New chapter Added", "success").then(
                    fetchChapters()
                  );
                })
                .catch((e) => {
                  console.error(e);
                  swal("", "chapter creation failed, try again!", "error");
                });
            })
            .catch((error) => {
              console.error(error);
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
                      <div className="col" key={chapter.id}>
                        <div
                          className="card"
                          style={{
                            width: "225px",
                            height: "172.5px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            props.history.push(
                              `/classrooms/${classId}/materials/${subjectId}/${chapter.id}`
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

export default ClassroomMaterialSubjects;
