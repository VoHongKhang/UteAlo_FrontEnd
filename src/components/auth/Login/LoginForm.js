import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Form, Input, theme, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../../context/auth/AuthContext';

const LoginForm = () => {
	const { user, loading, loginReq } = useAuth();

	const navigate = useNavigate();
	const { token } = theme.useToken();
	const [form] = Form.useForm();
	// Login submit handler
	const onFinish = () => {
		loginReq(form.getFieldValue('credentialId'), form.getFieldValue('password'));
	};
	useEffect(() => {
		if (user) {
			navigate('/');
		}
	}, [user, navigate]);
	return (
		<Card
			title={
				<Typography.Title level={2} style={{ color: token.colorPrimary, margin: 0, textAlign: 'center' }}>
					Đăng nhập
				</Typography.Title>
			}
			style={{ width: 480, margin: 'auto' }}
		>
			<Form layout="vertical" form={form} onFinish={onFinish}>
				<Form.Item
					label="Email"
					name="credentialId"
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập email!',
						},
						{
							type: 'email',
							message: 'Email không hợp lệ!',
						},
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Mật khẩu"
					name="password"
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập mật khẩu!',
						},
						{
							min: 8,
							message: 'Mật khẩu phải có ít nhất 8 ký tự!',
						},
						{
							max: 32,
							message: 'Mật khẩu không được vượt quá 32 ký tự!',
						},
						{
							pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,20})/,
							message:
								'Mật khẩu phải chứa ít nhất 1 ký tự hoa, 1 ký tự thường, 1 số và 1 ký tự đặc biệt!',
						},
					]}
				>
					<Input.Password />
				</Form.Item>

				<Button id='btn--login' type="primary" htmlType="submit" loading={loading} style={{ float: 'right' }}>
					Đăng nhập
				</Button>

				<Form.Item>
					<Link to="/forgot-password">
						<Button type="link" style={{ padding: 0 }}>
							Quên mật khẩu?
						</Button>
					</Link>
				</Form.Item>

				<Divider>Hoặc</Divider>

				<Form.Item style={{ textAlign: 'center' }}>
					Chưa có tài khoản?
					<Link to="/register">
						<Button type="link">Đăng ký ngay!</Button>
					</Link>
				</Form.Item>
			</Form>
		</Card>
	);
};
export default LoginForm;
