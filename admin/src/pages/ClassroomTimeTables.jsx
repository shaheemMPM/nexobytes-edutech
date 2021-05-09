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

const ClassroomTimeTables = (props) => {
  const classId = props.match.params.cid;
  const [token, setToken] = useState("");
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

  const fetchTimetables = () => {
    const TOKEN = token;
    const GET_URL = `http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/timetable/${classId}`;
    const header_config = {
      headers: { Authorization: `Bearer ${TOKEN}` },
    };
    axios
      .get(GET_URL, header_config)
      .then((response) => {
        setTimetables(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (!!token) {
      fetchClassData();
      fetchTimetables();
    }
    // eslint-disable-next-line
  }, [token]);
  
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
          const TOKEN = token;
          const POST_URL =
            "http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/timetable";
          const header_config = {
            headers: { Authorization: `Bearer ${TOKEN}` },
          };
          axios
            .post(
              POST_URL,
              {
                classId,
                className: classData.name,
                date: tempDate,
                timetable: tempTimetable,
              },
              header_config
            )
            .then((response) => {
              setTempTimetable("");
              swal("", "New timetable Added", "success").then(
                fetchTimetables()
              );
            })
            .catch((error) => {
              console.error(error);
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
        const TOKEN = token;
        const DELETE_URL =
          `http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/timetable/${tid}`;
        const header_config = {
          headers: { Authorization: `Bearer ${TOKEN}` },
        };
        axios
          .delete(
            DELETE_URL,
            header_config
          )
          .then((response) => {
            fetchTimetables();
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
                            <button className="btn btn-sm btn-danger" onClick={() => {deleteTimetableHandler(timetable._id)}}>
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
