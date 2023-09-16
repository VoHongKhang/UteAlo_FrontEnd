import React from 'react';
import { Formik, Form, Field ,ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { Input, Button, Space, message } from 'antd';
import TextError from '../TextError';
const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const RegisterForm = () => {
  const initialValues = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    // Điều hướng hoặc gửi dữ liệu đăng ký đến API ở đây
    setTimeout(() => {
      message.success('Registered successfully');
      setSubmitting(false);
    }, 1000);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, isValid }) => (
        <Form>
          <div>
            <label htmlFor="username">Username</label>
            <Field type="text" name="username" as={Input} placeholder="Username" />
            <ErrorMessage name="username" component={TextError} />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <Field
              type="password"
              name="password"
              as={Input.Password}
              placeholder="Password"
            />
             <ErrorMessage name="password" component={TextError} />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <Field
              type="password"
              name="confirmPassword"
              as={Input.Password}
              placeholder="Confirm Password"
            />
             <ErrorMessage name="confirmPassword" component={TextError} />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <Field type="email" name="email" as={Input} placeholder="Email" />
            <ErrorMessage name="email" component={TextError} />
          </div>

          <Space>
            <Button
              type="primary"
              htmlType="submit"
              disabled={isSubmitting || !isValid}
            >
              Register
            </Button>
          </Space>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
