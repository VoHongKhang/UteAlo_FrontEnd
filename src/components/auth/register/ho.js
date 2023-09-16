 {/* <div className="register">
        <div className="registerWrapper">
          <div className="registerLeft">
            <h3 className="registerLogo">Splash Social</h3>
            <span className="registerDesc">
              Connect with your friends and the world around you on Splash
              Social
            </span>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
            <div className="registerRight">
              <Form className="registerBox">
                <div className="register-title">Register</div>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  className="registerInput"
                />
                <ErrorMessage name="email" component={TextError} />
                <Field
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Username"
                  className="registerInput"
                />
                <ErrorMessage name="name" component={TextError} />
                <Field
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="registerInput"
                />
                <ErrorMessage name="password" component={TextError} />
                <Field
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="registerInput"
                />
                <ErrorMessage name="confirmPassword" component={TextError} />
                <button
                  type="submit"
                  className={loading ? "registerBtnDisabled" : "registerBtn"}
                  disabled={loading ? true : false}>
                  {loading ? (
                    <CircularProgress color="secondary" size="22px" />
                  ) : (
                    "Sign up"
                  )}
                </button>
                <span className="registerForgotPassword">
                  Already have an account?
                </span>
                <Link to="/login">
                  <button className="registerLoginBtn">Sign In</button>
                </Link>
              </Form>
            </div>
          </Formik>
        </div>
      </div> */}