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
// Import Styles
import "../public/ClassroomStudents.css";

const ClassroomTimeTables = (props) => {
  const classId = props.match.params.cid;
  const [isLoading, setIsLoading] = useState(true);
  const [timetables, setTimetables] = useState([]);
  const [classData, setClassData] = useState(null);
  const [tempDate, setTempDate] = useState(Number(new Date()));
  const [tempTimetable, setTempTimetable] = useState("");

  useEffect(() => {
    if (!!document.getElementsByClassName("nav-open")[0]) {
      document
        .getElementsByClassName("nav-open")[0]
        .classList.remove("nav-open");
    }
    fetchClassData();
    fetchTimetables();
    // eslint-disable-next-line
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

  const fetchTimetables = () => {
    firebase
      .firestore()
      .collection("timetables")
      .where("classId", "==", classId)
      .get()
      .then((querySnapshot) => {
        let tempTimetables = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setTimetables(tempTimetables);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const addNewTimetableHandler = () => {
    if (!classData) {
      swal("", "Class data is not loaded, try again", "info");
      return;
    }
    if (!!tempTimetable) {
      swal({
        title: "Are you sure?",
        text: "Are you sure you want to add new timetable?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((sure) => {
        if (sure) {
          firebase
            .firestore()
            .collection("timetables")
            .add({
              classId,
              className: classData.name,
              date: tempDate,
              timetable: tempTimetable,
              createdAt: Number(new Date()),
              createdBy: firebase.auth().currentUser.email,
            })
            .then(() => {
              setTempTimetable("");
              swal("", "New timetable Added", "success").then(
                fetchTimetables()
              );
            })
            .catch((e) => {
              console.error(e);
              swal("", "timetable creation failed, try again!", "error");
            });
        }
      });
    } else {
      swal("", "Fill all the fields in the form", "warning");
    }
  };

  const deleteTimetableHandler = (tid) => {
    swal({
      title: "Are you sure?",
      text: "Are you sure you want to delete this timetable?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((sure) => {
      if (sure) {
        setIsLoading(true);
        firebase
          .firestore()
          .collection("timetables")
          .doc(tid)
          .delete()
          .then(() => {
            fetchTimetables();
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
        <Navbar header="Timetables" />
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
                      Add Timetable For {classData ? classData.name : ''}
                    </h4>
                    <p className="category">
                      Fill the form to add a new Timetable
                    </p>
                  </div>
                  <div className="card-body">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>DATE</th>
                          <th>TIMETABLE</th>
                          <th>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <input
                              className="form-control"
                              type="date"
                              onChange={(e) => {
                                setTempDate(Number(new Date(e.target.value)));
                              }}
                            />
                          </td>
                          <td>
                            <textarea
                              className="form-control"
                              rows="5"
                              placeholder="Time Table"
                              value={tempTimetable}
                              onChange={(e) => {
                                setTempTimetable(e.target.value);
                              }}
                            ></textarea>
                          </td>
                          <td>
                            <button
                              className="btn btn-success btn-sm btn-block"
                              onClick={addNewTimetableHandler}
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
                      <th>Date</th>
                      <th>Timetable</th>
                      <th>Created By</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timetables.map((timetable, ind) => {
                      return (
                        <tr className="std-lines" key={ind}>
                          <td>{ind + 1}</td>
                          <td>
                            {new Date(timetable.date).toLocaleDateString()}
                          </td>
                          <td>
                            <pre>
                              {timetable.timetable}
                            </pre>
                          </td>
                          <td>{timetable.createdBy}</td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-danger" onClick={() => {deleteTimetableHandler(timetable.id)}}>
                              <span className="material-icons">
                                delete
                              </span>
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

export default ClassroomTimeTables;
