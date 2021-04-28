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
import "firebase/storage";
import swal from "sweetalert";
import MoonLoader from "react-spinners/MoonLoader";
// Import Styles
import "../public/ClassroomStudents.css";

const ClassroomMaterialChapters = (props) => {
  const classId = props.match.params.cid;
  const subjectId = props.match.params.sid;
  const chapterId = props.match.params.chid;
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
    fetchChapterData();
    fetchMaterials();
    // eslint-disable-next-line
  }, []);

  const fetchChapterData = () => {
    firebase
      .firestore()
      .collection("chapters")
      .doc(chapterId)
      .get()
      .then((chapterData) => {
        setChapterData(chapterData.data());
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const fetchMaterials = () => {
    firebase
      .firestore()
      .collection("materials")
      .where("chapterId", "==", chapterId)
      .get()
      .then((querySnapshot) => {
        let tempMaterials = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setMaterials(tempMaterials);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
      });
  };

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
          let uploadTask = firebase
            .storage()
            .ref("/materials/" + tempFile.name.split(" ").join(""))
            .put(tempFile);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              let progressPercent =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              progressPercent = progressPercent.toFixed(2);
              console.log(progressPercent);
            },
            (error) => {
              console.error(error);
            },
            () => {
              uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                firebase
                  .firestore()
                  .collection("materials")
                  .add({
                    classId,
                    className: chapterData.className,
                    subjectId,
                    subjectName: chapterData.subjectName,
                    chapterId,
                    chapterName: chapterData.name,
                    title: tempMaterialTitle,
                    publish: tempMaterialPublishTime,
                    isActive: true,
                    url,
                    createdAt: Number(new Date()),
                    createdBy: firebase.auth().currentUser.email,
                  })
                  .then(() => {
                    setTempMaterialTitle("");
                    setTempFile(null);
                    swal("", "New material added", "success").then(
                      fetchMaterials()
                    );
                  })
                  .catch((e) => {
                    console.error(e);
                    swal("", "material creation failed, try again!", "error");
                  });
              });
            }
          );
        }
      });
    } else {
      swal("", "title and video url should not be empty", "warning");
    }
  };

  const toggleMaterialVisibilityState = (materialId, currentState) => {
    swal({
      title: "Are you sure?",
      text: `Are you sure you want to ${
        currentState ? "disable" : "enable"
      } the video?`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((sure) => {
      if (sure) {
        firebase
          .firestore()
          .collection("materials")
          .doc(materialId)
          .update({
            isActive: !currentState,
          })
          .then(() => {
            swal("", "material state changed", "success").then(fetchMaterials());
          })
          .catch((e) => {
            console.error(e);
            swal("", "material state changing failed, try again!", "error");
          });
      }
    });
  };

  const materialDeleteHandler = (materialId) => {
    swal({
      title: "Are you sure?",
      text: `Are you sure you want to delete this material?`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((sure) => {
      if (sure) {
        firebase
          .firestore()
          .collection("materials")
          .doc(materialId)
          .delete()
          .then(() => {
            swal("", "material has been deleted", "success").then(fetchMaterials());
          })
          .catch((e) => {
            console.error(e);
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
                          <td style={{textAlign: "center"}}>
                            <a
                              href={material.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span className="material-icons">picture_as_pdf</span>
                            </a>
                          </td>
                          <td className="text-center">
                            <button
                              className={`btn btn-sm ${
                                material.isActive ? "btn-warning" : "btn-success"
                              }`}
                              onClick={() => {
                                toggleMaterialVisibilityState(
                                  material.id,
                                  material.isActive
                                );
                              }}
                            >
                              {material.isActive ? "DISABLE" : "ENABLE"}
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => {
                                materialDeleteHandler(material.id);
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
