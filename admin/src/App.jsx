// Core Modules
import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
// Custom Containers
import Home from "./pages/Home";
import Login from "./pages/Login";
import Classrooms from "./pages/Classrooms";
import IndividualClassroom from "./pages/IndividualClassroom";
import ClassroomStudents from "./pages/ClassroomStudents";
import ClassroomIndividualStudent from "./pages/ClassroomIndividualStudent";
import ClassroomLectures from "./pages/ClassroomLectures";
import ClassroomSubjects from "./pages/ClassroomSubjects";
import ClassroomChapters from "./pages/ClassroomChapters";
import ClassroomMaterials from "./pages/ClassroomMaterials";
import ClassroomMaterialSubjects from "./pages/ClassroomMaterialSubjects";
import ClassroomMaterialChapters from "./pages/ClassroomMaterialChapters";
import ClassroomTimeTables from "./pages/ClassroomTimeTables";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
// Depandancy Modules
import * as firebase from "firebase/app";
import "firebase/auth";
import swal from "sweetalert";
import MoonLoader from "react-spinners/MoonLoader";
// Depandancy Files
import fireConfig from "./config/firebase.config";

firebase.initializeApp(fireConfig);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    let cachedData = sessionStorage.getItem("auth_data");
    if (!!cachedData) {
      let authData = JSON.parse(cachedData);
      firebase
        .auth()
        .signInWithEmailAndPassword(authData.email, authData.password)
        .then(() => {
          setIsLoggedIn(true);
          setIsLoading(false);
        })
        .catch(function (error) {
          swal("Error", error.message, "error").then(() => {
            window.location.reload();
          });
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const authChange = (data) => {
    setIsLoggedIn(true);
    sessionStorage.setItem("auth_data", JSON.stringify(data));
  };

  let routes;
  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/classrooms" exact component={Classrooms} />
        <Route path="/classrooms/:cid" exact component={IndividualClassroom} />
        <Route
          path="/classrooms/:cid/students"
          exact
          component={ClassroomStudents}
        />
        <Route
          path="/classrooms/:cid/students/:username"
          exact
          component={ClassroomIndividualStudent}
        />
        <Route
          path="/classrooms/:cid/lectures"
          exact
          component={ClassroomLectures}
        />
        <Route
          path="/classrooms/:cid/lectures/:sid"
          exact
          component={ClassroomSubjects}
        />
        <Route
          path="/classrooms/:cid/lectures/:sid/:chid"
          exact
          component={ClassroomChapters}
        />
        <Route
          path="/classrooms/:cid/materials"
          exact
          component={ClassroomMaterials}
        />
        <Route
          path="/classrooms/:cid/materials/:sid"
          exact
          component={ClassroomMaterialSubjects}
        />
        <Route
          path="/classrooms/:cid/materials/:sid/:chid"
          exact
          component={ClassroomMaterialChapters}
        />
        <Route
          path="/classrooms/:cid/timetables"
          exact
          component={ClassroomTimeTables}
        />
        <Route path="/settings" exact component={Settings} />
        <Route path="*" component={NotFound} />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => <Login {...props} logHandler={authChange} />}
        />
        <Route path="*" component={NotFound} />
      </Switch>
    );
  }

  return (
    <>
      {isLoading ? (
        <MoonLoader
          css={{ display: "block", margin: "25vh auto", borderColor: "red" }}
          size={100}
          color={"#0000EE"}
          loading={true}
        />
      ) : (
        routes
      )}
    </>
  );
};

export default App;
