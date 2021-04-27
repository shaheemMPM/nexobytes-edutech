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
    fetchClassRooms();
  }, []);

  const fetchClassRooms = () => {
    firebase
      .firestore()
      .collection("classrooms")
      .get()
      .then((querySnapshot) => {
        let tempClasses = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setClassrooms(tempClasses);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const addNewClassHandler = () => {
    if (!!tempClassName) {
      swal({
        title: "Are you sure?",
        text: "Are you sure you want to add new classroom?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((sure) => {
        if (sure) {
          firebase
            .firestore()
            .collection("classrooms")
            .add({
              name: tempClassName,
              description: tempClassDescription,
              createdAt: Number(new Date()),
              createdBy: firebase.auth().currentUser.email,
            })
            .then(() => {
              setIsFormOpen(false);
              swal("", "New Classroom Addedd", "success").then(
                fetchClassRooms()
              );
            })
            .catch((e) => {
              console.error(e);
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
                      <div
                        className="col"
                        key={classroom.id}
                        onClick={() => {
                          props.history.push(`/classrooms/${classroom.id}`);
                        }}
                      >
                        <div
                          className="card"
                          style={{ width: "225px", height: "172.5px", cursor: 'pointer' }}
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
