import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import "./Register.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAuth from "../../../context/auth/AuthContext";
import TextError from "../TextError";
import { CircularProgress } from "@material-ui/core";
import { Toaster } from "react-hot-toast";
import { Helmet } from "react-helmet";
import RegisterForm from "./RegistionForm.js";
// Formik initial input values
const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

// Validate using YUP
const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email format").required("Required"),
  password: Yup.string().required("Required").min(6),
  confirmPassword: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const Register = () => {
  const history = useHistory();
  const { user, loading, register } = useAuth();

  // register submit handler
  const onSubmit = async (values) => {
    register(values.name, values.email, values.password);
  };

  // if req is successfull, i.e. if user is found in local storage push to timeline screen.
  useEffect(() => {
    if (user) {
      history.push("/");
    }
  }, [user, history]);
  return (
    <>
      <Helmet title="UTEALO - Đăng ký" />
      <Toaster />
      <RegisterForm />
    </>
  );
};

export default Register;
