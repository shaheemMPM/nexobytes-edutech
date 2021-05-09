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
import PlaceHolderImage from "../public/hqdefault.jpg";

const ClassroomChapters = (props) => {
  const classId = props.match.params.cid;
  const subjectId = props.match.params.sid;
  const chapterId = props.match.params.chid;
  const [token, setToken] = useState("");
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

  const fetchVideos = () => {
    const TOKEN = token;
    const GET_URL = `http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/video/${chapterId}`;
    const header_config = {
      headers: { Authorization: `Bearer ${TOKEN}` },
    };
    axios
      .get(GET_URL, header_config)
      .then((response) => {
        setVideos(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (!!token) {
      fetchChapterData();
      fetchVideos();
    }
    // eslint-disable-next-line
  }, [token]);

  const addNewVideoHandler = () => {
    if (!chapterData) {
      swal("", "chapter data is not loaded, try again", "info");
      return;
    }
    if (!getYouTubeVideoId(tempVideoUrl)) {
      swal("", "enter a valid youtube url", "info");
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
          const TOKEN = token;
          const POST_URL =
            "http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/video";
          const header_config = {
            headers: { Authorization: `Bearer ${TOKEN}` },
          };
          axios
            .post(
              POST_URL,
              {
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
                url: getYouTubeVideoId(tempVideoUrl),
              },
              header_config
            )
            .then((response) => {
              setTempVideoTitle("");
              setTempVideoDescription("");
              setTempVideoUrl("");
              swal("", "New video added", "success").then(fetchVideos());
            })
            .catch((error) => {
              console.error(error);
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

  const getThumbnailUrl = (videoId) => {
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return PlaceHolderImage;
  };

  const getVideoUrl = (videoId) => {
    return `https://www.youtube.com/watch?v=${videoId}`;
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
        const TOKEN = token;
        const PATCH_URL = `http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/video/status/${videoId}`;
        const header_config = {
          headers: { Authorization: `Bearer ${TOKEN}` },
        };
        axios
          .patch(PATCH_URL, {}, header_config)
          .then((response) => {
            swal("", "Video state changed", "success").then(fetchVideos());
          })
          .catch((error) => {
            console.error(error);
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
        const TOKEN = token;
        const DELETE_URL =
          `http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/video/${videoId}`;
        const header_config = {
          headers: { Authorization: `Bearer ${TOKEN}` },
        };
        axios
          .delete(
            DELETE_URL,
            header_config
          )
          .then((response) => {
            swal("", "Video has been deleted", "success").then(fetchVideos());
          })
          .catch((error) => {
            console.error(error);
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
                          <td
                            style={{ minWidth: "75px" }}
                            className="text-center"
                          >
                            {ind + 1}
                          </td>
                          <td style={{ maxWidth: "200px" }}>{video.title}</td>
                          <td style={{ maxWidth: "300px" }}>
                            {video.description}
                          </td>
                          <td>{new Date(video.publish).toLocaleString()}</td>
                          <td>
                            <a
                              href={getVideoUrl(video.url)}
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
                                alt={video.url}
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
                                  video._id,
                                  video.isActive
                                );
                              }}
                            >
                              {video.isActive ? "DISABLE" : "ENABLE"}
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => {
                                videoDeleteHandler(video._id);
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
