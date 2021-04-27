// Core Modules
import React, { useState } from "react";
// Styles
import "../public/Login.css";
// Depandancy Modules
import * as firebase from "firebase/app";
import "firebase/auth";
import swal from "sweetalert";
import MoonLoader from "react-spinners/MoonLoader";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const clearFieldsHandler = () => {
    setEmail("");
    setPassword("");
  };

  const loginHandler = () => {
    setIsLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        props.logHandler({ email, password });
      })
      .catch(function (error) {
        swal("Error", error.message, "error").then(() => {
          window.location.reload();
        });
      });
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <MoonLoader
          css={{ display: "block", margin: "25vh auto", borderColor: "red" }}
          size={100}
          color={"#0000EE"}
          loading={true}
        />
      ) : (
        <div className="LoginPage">
          <h1 className="brandname">NEXOBYTES</h1>
          <div className="login-form">
            <div className="divin">
              <h2 className="text-center">Log in</h2>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Username"
                  required="required"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") loginHandler();
                  }}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  required="required"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") loginHandler();
                  }}
                />
              </div>
              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-block"
                  style={{ background: "#0000EE" }}
                  onClick={loginHandler}
                >
                  Log in
                </button>
              </div>
              <div className="clearfix">
                <span
                  className="pull-right"
                  onClick={clearFieldsHandler}
                  style={{ cursor: "pointer" }}
                >
                  Clear Feilds
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Login;
