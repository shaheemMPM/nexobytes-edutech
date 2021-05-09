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

const ClassroomMaterialChapters = (props) => {
  const classId = props.match.params.cid;
  const subjectId = props.match.params.sid;
  const chapterId = props.match.params.chid;
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [materials, setMaterials] = useState([]);
  const [chapterData, setChapterData] = useState(null);
  const [tempMaterialTitle, setTempMaterialTitle] = useState("");
  const [tempMaterialPublishTime, setTempMaterialPublishTime] = useState(
    Number(new Date())
  );
  const [tempFile, setTempFile] = useState(undefined);

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

  const fetchChapterData = () => {
    const TOKEN = token;
    const GET_URL = `http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/chapter/${chapterId}`;
    const header_config = {
      headers: { Authorization: `Bearer ${TOKEN}` },
    };
    axios
      .get(GET_URL, header_config)
      .then((response) => {
        setChapterData(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchMaterials = () => {
    const TOKEN = token;
    const GET_URL = `http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/material/${chapterId}`;
    const header_config = {
      headers: { Authorization: `Bearer ${TOKEN}` },
    };
    axios
      .get(GET_URL, header_config)
      .then((response) => {
        setMaterials(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (!!token) {
      fetchChapterData();
      fetchMaterials();
    }
    // eslint-disable-next-line
  }, [token]);

  const addNewMaterialHandler = () => {
    if (!chapterData) {
      swal("", "chapter data is not loaded, try again", "info");
      return;
    }
    if (!!tempMaterialTitle && !!tempFile) {
      swal({
        title: "Are you sure?",
        text: "Are you sure you want to add new pdf?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((sure) => {
        if (sure) {
          setIsLoading(true);
          let formData = new FormData();
          formData.append("materialpdf", tempFile);
          const TOKEN = token;
          const POST_URL =
            "http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/material/upload";
          const header_config = {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              "Content-Type": "multipart/form-data",
            },
          };
          axios
            .post(POST_URL, formData, header_config)
            .then((response) => {
              const POST1_URL =
                "http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/material";
              const header_config = {
                headers: { Authorization: `Bearer ${TOKEN}` },
              };
              axios
                .post(
                  POST1_URL,
                  {
                    classId,
                    className: chapterData.className,
                    subjectId,
                    subjectName: chapterData.subjectName,
                    chapterId,
                    chapterName: chapterData.name,
                    title: tempMaterialTitle,
                    publish: tempMaterialPublishTime,
                    url: response.data.Location,
                    key: response.data.Key,
                  },
                  header_config
                )
                .then((response1) => {
                  setTempMaterialTitle("");
                  setTempFile(null);
                  swal("", "New material added", "success").then(
                    fetchMaterials()
                  );
                })
                .catch((error) => {
                  console.error(error);
                  swal("", "material creation failed, try again!", "error");
                });
            })
            .catch((e) => {
              console.error(e);
              swal("", "material upload failed, try again!", "error");
            });
        }
      });
    } else {
      swal("", "title and file should not be empty", "warning");
    }
  };

  const toggleMaterialVisibilityState = (materialId, currentState) => {
    swal({
      title: "Are you sure?",
      text: `Are you sure you want to ${
        currentState ? "disable" : "enable"
      } the material?`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((sure) => {
      if (sure) {
        setIsLoading(true);
        const TOKEN = token;
        const PATCH_URL = `http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/material/status/${materialId}`;
        const header_config = {
          headers: { Authorization: `Bearer ${TOKEN}` },
        };
        axios
          .patch(PATCH_URL, {}, header_config)
          .then((response) => {
            swal("", "material state changed", "success").then(
              fetchMaterials()
            );
          })
          .catch((error) => {
            console.error(error);
            swal("", "material state changing failed, try again!", "error");
          });
      }
    });
  };

  const materialDeleteHandler = (materialId, fileKey) => {
    swal({
      title: "Are you sure?",
      text: `Are you sure you want to delete this material?`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((sure) => {
      if (sure) {
        setIsLoading(true);
        const TOKEN = token;
        const DELETE_URL = `http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/material/delete`;
        const header_config = {
          headers: { Authorization: `Bearer ${TOKEN}` },
          data: { key: fileKey },
        };
        axios
          .delete(DELETE_URL, header_config)
          .then((response) => {
            const DELETE1_URL = `http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/material/${materialId}`;
            const header_config = {
              headers: { Authorization: `Bearer ${TOKEN}` },
            };
            axios
              .delete(DELETE1_URL, header_config)
              .then((response1) => {
                swal("", "material has been deleted", "success").then(
                  fetchMaterials()
                );
              })
              .catch((error) => {
                console.error(error);
                swal("", "material deleting failed, try again!", "error");
              });
          })
          .catch((error) => {
            console.error(error);
            swal("", "material deleting failed, try again!", "error");
          });
      }
    });
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
                <div className="card">
                  <div className="card-header card-header-primary">
                    <h4 className="card-title" style={{ fontWeight: "600" }}>
                      Add Material
                    </h4>
                    <p className="category">
                      Fill the form to add a new pdf material
                    </p>
                  </div>
                  <div className="card-body">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>TITLE</th>
                          <th>FILE</th>
                          <th>PUBLISH TIME</th>
                          <th>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Material Title"
                              value={tempMaterialTitle}
                              onChange={(e) => {
                                setTempMaterialTitle(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="file"
                              accept=".pdf"
                              onChange={(e) => {
                                setTempFile(e.target.files[0]);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="datetime-local"
                              onChange={(e) => {
                                setTempMaterialPublishTime(
                                  Number(new Date(e.target.value))
                                );
                              }}
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-success btn-sm btn-block"
                              onClick={addNewMaterialHandler}
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
                      <th>Title</th>
                      <th>Publishing Time</th>
                      <th className="text-center">Pdf</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map((material, ind) => {
                      return (
                        <tr className="std-lines" key={ind}>
                          <td>{ind + 1}</td>
                          <td>{material.title}</td>
                          <td>{new Date(material.publish).toLocaleString()}</td>
                          <td style={{ textAlign: "center" }}>
                            <a
                              href={material.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span className="material-icons">
                                picture_as_pdf
                              </span>
                            </a>
                          </td>
                          <td className="text-center">
                            <button
                              className={`btn btn-sm ${
                                material.isActive
                                  ? "btn-warning"
                                  : "btn-success"
                              }`}
                              onClick={() => {
                                toggleMaterialVisibilityState(
                                  material._id,
                                  material.isActive
                                );
                              }}
                            >
                              {material.isActive ? "DISABLE" : "ENABLE"}
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => {
                                materialDeleteHandler(
                                  material._id,
                                  material.key
                                );
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

export default ClassroomMaterialChapters;
