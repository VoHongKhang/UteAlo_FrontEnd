import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import TextError from '../TextError';
import useAuth from '../../../context/auth/AuthContext';
import { useHistory } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
// Formik initial input values
const initialValues = {
	credentialId: '', // Sửa lại thành "credentialId"
	password: '',
};
const savedValues = {
	credentialId: 'vohongkhang202@gmail.com',
	password: 'Khang2002##',
};
// validate using yup
const validationSchema = Yup.object({
	credentialId: Yup.string().required('Email is required'), // Sửa lại thành "credentialId"
	password: Yup.string().required('Password is required'),
});

const LoginForm = () => {
	const history = useHistory();
    const [formData, setFormData] = useState(initialValues);
	const { user, loading, loginReq } = useAuth();

	// Login submit handler
	const onSubmit = (values) => {
		loginReq(values.credentialId, values.password);
	};

	// if req is successfull, i.e. if user is found in local storage push to timeline screen.
	useEffect(() => {
		if (user) {
			history.push('/');
		}
	}, [user, history]);
	return (
		<div>
			<Formik
				initialValues={formData||initialValues}
				validationSchema={validationSchema}
				onSubmit={onSubmit}
				enableReinitialize
			>
				<div className="loginRight">
					<Form className="loginBox">
						<div className="login-title">Đăng nhập</div>
						<div className="login-subtitle">Vui lòng nhập email và mật khẩu để đăng nhập</div>

						<label className="label_email">Email</label>
						<Field type="email" placeholder="Email" name="credentialId" id="email" className="loginInput" />
						<ErrorMessage name="credentialId" component={TextError} />

						<label className="label_password">Mật khẩu</label>
						<Field
							type="password"
							placeholder="Mật khẩu"
							className="loginInput"
							name="password"
							id="password"
						/>
						<ErrorMessage name="password" component={TextError} />
						<div className="contaner_login_btn">
							<div className="login_btn_forgot">
								<Link className="forgot_link" to="/forgot-password">
									<p className="color_link">Quên mật khẩu?</p>
								</Link>
							</div>
							<button className="loginBtn" type="button" onClick={() => setFormData(savedValues)}>
								Get Test User credentials
							</button>
							<button
								className={loading ? 'loginBtnDisabled' : 'loginBtn'}
								type="submit"
								disabled={loading ? true : false}
							>
								{loading ? <CircularProgress color="secondary" size="22px" /> : 'Đăng nhập'}
							</button>
						</div>
						<div className="login-subtitle">
							Bạn chưa có tài khoản?
							<Link className="register_link" to="/register">
								<p className="color_link">Đăng ký ngay!</p>
							</Link>
						</div>
					</Form>
				</div>
			</Formik>
		</div>
	);
};
export default LoginForm;
