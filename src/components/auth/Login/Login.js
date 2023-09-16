import React, { useEffect, useState } from "react";
import "./Login.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import TextError from "../TextError";
import useAuth from "../../../context/auth/AuthContext";
import { useHistory } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import { Toaster } from "react-hot-toast";
import { Helmet } from "react-helmet";

// Formik initial input values
const initialValues = {
  credentialId: "", // Sửa lại thành "credentialId"
  password: "",
};


// Test User -
const savedValues = {
  credentialId: "vohongkhang202@gmail.com",
  password: "Khang2002##",
};

// validate using yup
const validationSchema = Yup.object({
  credentialId: Yup.string().required("Email is required"), // Sửa lại thành "credentialId"
  password: Yup.string().required("Password is required"),
});



const Login = () => {
  const [formData, setFormData] = useState(null);
  const history = useHistory();
  const { user, loading, loginReq } = useAuth();

  // Login submit handler
  const onSubmit = (values) => {
    loginReq(values.credentialId, values.password);
  };

  // if req is successfull, i.e. if user is found in local storage push to timeline screen.
  useEffect(() => {
    if (user) {
      history.push("/");
    }
  }, [user, history]);

  return (
    <>
      <Helmet title="Login | Splash Social" />
      <Toaster />
      <div className="login">
        <div className="loginWrapper">
          <div className="loginLeft">
            <h3 className="loginLogo">Splash Social</h3>
            <span className="loginDesc">
              Connect with your friends and the world around you on Splash
              Social
            </span>
          </div>
          <Formik
            initialValues={formData || initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize>
            <div className="loginRight">
              <Form className="loginBox">
                <div className="login-title">Sign In</div>
                <Field
                  type="email"
                  placeholder="Email"
                  name="credentialId"
                  id="email"
                  className="loginInput"
                />
                <ErrorMessage name="credentialId" component={TextError} />
                <Field
                  type="password"
                  placeholder="Password"
                  className="loginInput"
                  name="password"
                  id="password"
                />
                <ErrorMessage name="password" component={TextError} />
                <button
                  className={loading ? "loginBtnDisabled" : "loginBtn"}
                  type="submit"
                  disabled={loading ? true : false}>
                  {loading ? (
                    <CircularProgress color="secondary" size="22px" />
                  ) : (
                    "Log in"
                  )}
                </button>
                <button
                  className="loginBtn"
                  type="button"
                  onClick={() => setFormData(savedValues)}>
                  Get Test User credentials
                </button>
                <Link className="loginBtnCenter" to="/register">
                  <button className="loginregistrationButton">
                    Create a new account
                  </button>
                </Link>
              </Form>
            </div>
          </Formik>
        </div>
      </div>
    </>
  );
};

export default Login;
