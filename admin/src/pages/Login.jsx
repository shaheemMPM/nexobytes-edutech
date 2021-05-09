// Core Modules
import React, { useState } from "react";
// Styles
import "../public/Login.css";
// Depandancy Modules
import axios from "axios";
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
    const POST_URL =
      "http://ec2-13-234-31-43.ap-south-1.compute.amazonaws.com/api/v1/admin/admin/login";
    axios
      .post(POST_URL, {
        email: email,
        password: password,
      })
      .then((response) => {
        if (response.status === 200) {
          props.logHandler(response.data);
        } else {
          swal(
            "Error",
            `${response.message}! check your username and password`,
            "error"
          ).then(() => {
            window.location.reload();
          });
        }
      })
      .catch((error) => {
        swal(
          "Error",
          `${error.message}! check your username and password`,
          "error"
        ).then(() => {
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
