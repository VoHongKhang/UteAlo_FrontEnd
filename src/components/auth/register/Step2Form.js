import React from 'react';
import { Button, Card, Form, Input, theme, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
function Step2Form({ onSubmit, data }) {
	const { token } = theme.useToken();
	const [form] = Form.useForm();
	const handleNext = () => {
		onSubmit(form.getFieldsValue());
	};
	return (
		<Card
			title={
				<Typography.Title level={2} style={{ color: token.colorPrimary, margin: 0, textAlign: 'center' }}>
					Đăng ký tài khoản
				</Typography.Title>
			}
			style={{ width: 480, margin: 'auto' }}
		>
			<Toaster />
			<Form layout="vertical" form={form} name="account" onFinish={handleNext}>
				<Form.Item
					label="Email"
					name="email"
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập email!',
						},
						{
							type: 'email',
							message: 'Email không hợp lệ!',
						},
						//kiểm tra nếu data = SinhVien thì sau dấu @ là student.hcmute.edu.vn
						//kiểm tra nếu data = GiangVien thì sau dấu @ là edu.hcmute.vn
						// còn lại thì không cần kiểm tra
						{
							pattern:
								data === 'SinhVien'
									? /student.hcmute.edu.vn/
									: data === 'GiangVien'
									? /hcmute.edu.vn/
									: null,
							message:
								data === 'SinhVien'
									? 'Email phải là email sinh viên!'
									: data === 'GiangVien'
									? 'Email phải là email giảng viên!'
									: null,
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
								'Mật khẩu phải chứa ít nhất 1 ký tự hoa, 1 ký tự thường, 1 số và 1 trong các ký tự đặc biệt !@#$%^&*',
						},
					]}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item
					label="Xác nhận mật khẩu"
					name="confirmPassword"
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập mật khẩu!',
						},
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value || getFieldValue('password') === value) {
									return Promise.resolve();
								}
								return Promise.reject(new Error('Mật khẩu không khớp!'));
							},
						}),
					]}
				>
					<Input.Password />
				</Form.Item>

				<Button type="primary" htmlType="submit" style={{ float: 'right' }}>
					Tiếp tục
				</Button>

				<Form.Item>
					Đã có tài khoản?
					<Link to="/login">
						<Button type="link">Đăng nhập ngay!</Button>
					</Link>
				</Form.Item>
			</Form>
		</Card>
	);
}

export default Step2Form;
