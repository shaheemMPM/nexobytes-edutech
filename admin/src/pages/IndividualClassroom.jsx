// Core Modules
import React, { useEffect, useState } from "react";
// Components
import Sidebar from "../core/components/Sidebar";
import Navbar from "../core/components/Navbar";
import Footer from "../core/components/Footer";
// Depandancy Modules
import * as firebase from "firebase/app";
import "firebase/firestore";
// import swal from "sweetalert";
import MoonLoader from "react-spinners/MoonLoader";

const IndividualClassroom = (props) => {
  const classId = props.match.params.cid;
  const [classData, setClassData] = useState(null);

  useEffect(() => {
    if (!!document.getElementsByClassName("nav-open")[0]) {
      document
        .getElementsByClassName("nav-open")[0]
        .classList.remove("nav-open");
    }
    fetchClassData();
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

  return (
    <div className="wrapper ">
      <Sidebar />
      <div className="main-panel">
        <Navbar header={!!classData ? classData.name : ""} />
        <div className="content">
          <div className="container-fluid">
            {!classData ? (
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
                    <p style={{ textAlign: "center", fontSize: "18px" }}>
                      {classData.description}
                    </p>
                    <p style={{ float: "left" }}>
                      <strong>Created At : </strong>
                      {new Date(classData.createdAt).toLocaleDateString()}
                    </p>
                    <p style={{ float: "right" }}>
                      <strong>Created By : </strong>
                      {classData.createdBy}
                    </p>
                  </div>
                </div>

                <div className="row">
                  <div
                    className="col-3"
                    onClick={() => {
                      props.history.push(`/classrooms/${classId}/students`);
                    }}
                  >
                    <div
                      className="card"
                      style={{ width: "225px", height: "172.5px", cursor: "pointer" }}
                    >
                      <div className="card-body">
                        <h3
                          className="card-title"
                          style={{
                            textAlign: "center",
                            marginTop: "53.75px",
                          }}
                        >
                          STUDENTS
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div
                    className="col-3"
                    onClick={() => {
                      props.history.push(`/classrooms/${classId}/lectures`);
                    }}
                  >
                    <div
                      className="card"
                      style={{ width: "225px", height: "172.5px", cursor: "pointer" }}
                    >
                      <div className="card-body">
                        <h3
                          className="card-title"
                          style={{
                            textAlign: "center",
                            marginTop: "53.75px",
                          }}
                        >
                          LECTURES
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div
                    className="col-3"
                    onClick={() => {
                      props.history.push(`/classrooms/${classId}/materials`);
                    }}
                  >
                    <div
                      className="card"
                      style={{ width: "225px", height: "172.5px", cursor: "pointer" }}
                    >
                      <div className="card-body">
                        <h3
                          className="card-title"
                          style={{
                            textAlign: "center",
                            marginTop: "53.75px",
                          }}
                        >
                          MATERIALS
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div
                    className="col-3"
                    onClick={() => {
                      props.history.push(`/classrooms/${classId}/timetables`);
                    }}
                  >
                    <div
                      className="card"
                      style={{ width: "225px", height: "172.5px", cursor: "pointer" }}
                    >
                      <div className="card-body">
                        <h3
                          className="card-title"
                          style={{
                            textAlign: "center",
                            marginTop: "53.75px",
                          }}
                        >
                          TIME TABLES
                        </h3>
                      </div>
                    </div>
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

export default IndividualClassroom;
