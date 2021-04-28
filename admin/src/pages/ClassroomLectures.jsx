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

const Classrooms = (props) => {
  const classId = props.match.params.cid;
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
    fetchClassData();
    fetchSubjects();
  }, []);

  const fetchClassData = () => {
    firebase
      .firestore()
      .collection("classrooms")
      .doc(classId)
      .get()
      .then((classData) => {
        setClassData(classData.data());
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const fetchSubjects = () => {
    firebase
      .firestore()
      .collection("subjects")
      .where("classId", "==", classId)
      .get()
      .then((querySnapshot) => {
        let tempSubjects = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setSubjects(tempSubjects);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const addNewSubjectHandler = () => {
    if (!classData) {
      swal("", "Class data is not loaded, try again", "info");
      return;
    }
    if (!!tempSubjectName) {
      let subKey = `${classId}_${tempSubjectName.split(" ").join("").toLowerCase()}`;
      swal({
        title: "Are you sure?",
        text: "Are you sure you want to add new subject?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((sure) => {
        if (sure) {
          firebase
            .firestore()
            .collection("subjects")
            .doc(subKey)
            .get()
            .then((subject) => {
              if (!!subject.data()) {
                swal(
                  "Invalid Subject Name",
                  "A subject with the same name already exist in database",
                  "error"
                );
                return;
              }
              firebase
                .firestore()
                .collection("subjects")
                .doc(subKey)
                .set({
                  name: tempSubjectName,
                  classId,
                  className: classData.name,
                  createdAt: Number(new Date()),
                  createdBy: firebase.auth().currentUser.email,
                })
                .then(() => {
                  setIsFormOpen(false);
                  swal("", "New Subject Added", "success").then(
                    fetchSubjects()
                  );
                })
                .catch((e) => {
                  console.error(e);
                  swal("", "Subject creation failed, try again!", "error");
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
        <Navbar header="Lectures" />
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
                      <div
                        className="col"
                        key={subject.id}
                        onClick={() => {
                          props.history.push(
                            `/classrooms/${classId}/lectures/${subject.id}`
                          );
                        }}
                      >
                        <div
                          className="card"
                          style={{
                            width: "225px",
                            height: "172.5px",
                            cursor: "pointer",
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

export default Classrooms;
