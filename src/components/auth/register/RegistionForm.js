import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const RegistrationForm = () => {
  // Khởi tạo giá trị ban đầu và các tùy chọn
  const initialValues = {
    role: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    studentID: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    selectedClass: '',
  };

  // Quy tắc xác thực dữ liệu bằng Yup
  const validationSchema = Yup.object().shape({
    role: Yup.string().required('Vui lòng chọn vai trò'),
    fullName: Yup.string().required('Vui lòng nhập họ và tên'),
    dateOfBirth: Yup.date().required('Vui lòng nhập ngày sinh'),
    gender: Yup.string().required('Vui lòng chọn giới tính'),
    studentID: Yup.string().when('role', {
      is: 'student',
      then: Yup.string().required('Vui lòng nhập mã số sinh viên'),
    }),
    email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
    phoneNumber: Yup.string().required('Vui lòng nhập số điện thoại'),
    password: Yup.string().required('Vui lòng nhập mật khẩu'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp')
      .required('Vui lòng xác nhận mật khẩu'),
    selectedClass: Yup.string().when('role', {
      is: 'student',
      then: Yup.string().required('Vui lòng chọn lớp học'),
    }),
  });

  // Xử lý submit form
  const handleSubmit = (values) => {
    console.log('Dữ liệu đã nhập:', values);
    // Đưa dữ liệu này lên máy chủ hoặc thực hiện các thao tác cần thiết
  };

  return (
    <div>
      <h1>Biểu mẫu đăng ký</h1>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <Form>
          {/* Form 1: Chọn vai trò */}
          <div>
            <label>Vai trò:</label>
            <Field name="role" as="select">
              <option value="">Chọn vai trò</option>
              <option value="student">Sinh viên</option>
              <option value="lecturer">Giảng viên</option>
              <option value="parent">Phụ huynh</option>
            </Field>
            <ErrorMessage name="role" component="div" className="error" />
          </div>

          {/* Form 2: Thông tin cá nhân */}
          <div>
            <label>Họ và tên:</label>
            <Field type="text" name="fullName" />
            <ErrorMessage name="fullName" component="div" className="error" />
          </div>
          <div>
            <label>Ngày sinh:</label>
            <Field type="date" name="dateOfBirth" />
            <ErrorMessage name="dateOfBirth" component="div" className="error" />
          </div>
          <div>
            <label>Giới tính:</label>
            <Field name="gender" as="select">
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </Field>
            <ErrorMessage name="gender" component="div" className="error" />
          </div>
          <div>
            <label>Mã số sinh viên:</label>
            <Field type="text" name="studentID" />
            <ErrorMessage name="studentID" component="div" className="error" />
          </div>
          <div>
            <label>Email:</label>
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" className="error" />
          </div>
          <div>
            <label>Số điện thoại:</label>
            <Field type="text" name="phoneNumber" />
            <ErrorMessage name="phoneNumber" component="div" className="error" />
          </div>
          <div>
            <label>Mật khẩu:</label>
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" className="error" />
          </div>
          <div>
            <label>Xác nhận mật khẩu:</label>
            <Field type="password" name="confirmPassword" />
            <ErrorMessage name="confirmPassword" component="div" className="error" />
          </div>

          {/* Form 3: Chọn lớp (chỉ dành cho sinh viên) */}
          {initialValues.role === 'student' && (
            <div>
              <label>Chọn lớp:</label>
              <Field name="selectedClass" as="select">
                <option value="">Chọn lớp</option>
                <option value="classA">Lớp A</option>
                <option value="classB">Lớp B</option>
              </Field>
              <ErrorMessage name="selectedClass" component="div" className="error" />
            </div>
          )}

          <div>
            <button type="submit">Đăng ký</button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default RegistrationForm;
