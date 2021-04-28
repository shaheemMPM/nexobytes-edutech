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
import PlaceHolderImage from "../public/hqdefault.jpg";

const ClassroomChapters = (props) => {
  const classId = props.match.params.cid;
  const subjectId = props.match.params.sid;
  const chapterId = props.match.params.chid;
  const [isLoading, setIsLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [chapterData, setChapterData] = useState(null);
  const [tempVideoTitle, setTempVideoTitle] = useState("");
  const [tempVideoDescription, setTempVideoDescription] = useState("");
  const [tempVideoPublishTime, setTempVideoPublishTime] = useState(
    Number(new Date())
  );
  const [tempVideoUrl, setTempVideoUrl] = useState("");

  useEffect(() => {
    if (!!document.getElementsByClassName("nav-open")[0]) {
      document
        .getElementsByClassName("nav-open")[0]
        .classList.remove("nav-open");
    }
    fetchChapterData();
    fetchVideos();
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

  const fetchVideos = () => {
    firebase
      .firestore()
      .collection("videos")
      .where("chapterId", "==", chapterId)
      .get()
      .then((querySnapshot) => {
        let tempVideos = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setVideos(tempVideos);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const addNewVideoHandler = () => {
    if (!chapterData) {
      swal("", "chapter data is not loaded, try again", "info");
      return;
    }
    if (!!tempVideoTitle && !!tempVideoUrl) {
      swal({
        title: "Are you sure?",
        text: "Are you sure you want to add new video?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((sure) => {
        if (sure) {
          firebase
            .firestore()
            .collection("videos")
            .add({
              classId,
              className: chapterData.className,
              subjectId,
              subjectName: chapterData.subjectName,
              chapterId,
              chapterName: chapterData.name,
              title: tempVideoTitle,
              description: tempVideoDescription,
              publish: tempVideoPublishTime,
              isActive: true,
              url: tempVideoUrl,
              createdAt: Number(new Date()),
              createdBy: firebase.auth().currentUser.email,
            })
            .then(() => {
              setTempVideoTitle("");
              setTempVideoDescription("");
              setTempVideoUrl("");
              swal("", "New video added", "success").then(fetchVideos());
            })
            .catch((e) => {
              console.error(e);
              swal("", "video creation failed, try again!", "error");
            });
        }
      });
    } else {
      swal("", "title and video url should not be empty", "warning");
    }
  };

  const getYouTubeVideoId = (url) => {
    let youtubeUrlRegExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    let match = url.match(youtubeUrlRegExp);
    return match && match[7].length === 11 ? match[7] : false;
  };

  const getThumbnailUrl = (videoUrl) => {
    let videoId = getYouTubeVideoId(videoUrl);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return PlaceHolderImage;
  };

  const toggleVideoVisibilityState = (videoId, currentState) => {
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
          .collection("videos")
          .doc(videoId)
          .update({
            isActive: !currentState,
          })
          .then(() => {
            swal("", "Video state changed", "success").then(fetchVideos());
          })
          .catch((e) => {
            console.error(e);
            swal("", "video state changing failed, try again!", "error");
          });
      }
    });
  };

  const videoDeleteHandler = (videoId) => {
    swal({
      title: "Are you sure?",
      text: `Are you sure you want to delete this video?`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((sure) => {
      if (sure) {
        firebase
          .firestore()
          .collection("videos")
          .doc(videoId)
          .delete()
          .then(() => {
            swal("", "Video has been deleted", "success").then(fetchVideos());
          })
          .catch((e) => {
            console.error(e);
            swal("", "video deleting failed, try again!", "error");
          });
      }
    });
  };

  return (
    <div className="wrapper ">
      <Sidebar />
      <div className="main-panel">
        <Navbar header="Lecture Videos" />
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
                      Add Lecture
                    </h4>
                    <p className="category">
                      Fill the form to add a new lecture video
                    </p>
                  </div>
                  <div className="card-body">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>TITLE</th>
                          <th>DESCRIPTION</th>
                          <th>URL</th>
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
                              placeholder="Lecture Title"
                              value={tempVideoTitle}
                              onChange={(e) => {
                                setTempVideoTitle(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Lecture Description"
                              value={tempVideoDescription}
                              onChange={(e) => {
                                setTempVideoDescription(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="YouTube URL"
                              value={tempVideoUrl}
                              onChange={(e) => {
                                setTempVideoUrl(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="datetime-local"
                              onChange={(e) => {
                                setTempVideoPublishTime(
                                  Number(new Date(e.target.value))
                                );
                              }}
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-success btn-sm btn-block"
                              onClick={addNewVideoHandler}
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
                      <th>Description</th>
                      <th>Publishing Time</th>
                      <th className="text-center">Video</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.map((video, ind) => {
                      return (
                        <tr className="std-lines" key={ind}>
                          <td>{ind + 1}</td>
                          <td>{video.title}</td>
                          <td>{video.description}</td>
                          <td>{new Date(video.publish).toLocaleString()}</td>
                          <td>
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                style={{
                                  display: "block",
                                  margin: "0 auto",
                                  height: "100px",
                                }}
                                src={getThumbnailUrl(video.url)}
                                alt={getYouTubeVideoId(video.url)}
                              />
                            </a>
                          </td>
                          <td className="text-center">
                            <button
                              className={`btn btn-sm ${
                                video.isActive ? "btn-warning" : "btn-success"
                              }`}
                              onClick={() => {
                                toggleVideoVisibilityState(
                                  video.id,
                                  video.isActive
                                );
                              }}
                            >
                              {video.isActive ? "DISABLE" : "ENABLE"}
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => {
                                videoDeleteHandler(video.id);
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

export default ClassroomChapters;
