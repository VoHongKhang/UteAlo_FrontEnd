import React from 'react';
import { Button, Card, Divider, Form, Input, theme, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import ForgotApi from '../../../api/auth/forgotpwApi';
const ForgotPasswordForm = () => {
	const { token } = theme.useToken();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const onFinish = async () => {
		setLoading(true);

		const toastId = toast.loading('Đang gửi yêu cầu...');
		try {
			await ForgotApi.forgotpw(form.getFieldValue('email'));
			toast.success('Gửi yêu thành công! Vui lòng kiểm tra email của bạn.', { id: toastId });
		} catch (error) {
			console.log(error);
			toast.error(`Gửi yêu thất bại! Lỗi: ${error.response ? error.response.data.message : error}`, { id: toastId });
		}

		setLoading(false);
	};
	return (
		<div>
			<Card
				title={
					<Typography.Title level={2} style={{ color: token.colorPrimary, margin: 0, textAlign: 'center' }}>
						Quên mật khẩu
					</Typography.Title>
				}
				style={{ width: 480, margin: 'auto' }}
			>
				<Form layout="vertical" form={form} onFinish={onFinish}>
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
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item>
						<Button type="primary" block loading={loading} htmlType="submit">
							Gửi yêu cầu
						</Button>
					</Form.Item>

					<Divider>Hoặc</Divider>

					<Link to="/login" style={{ float: 'right' }}>
						<Button type="primary">Đăng nhập</Button>
					</Link>

					<Link to="/register" style={{ float: 'left' }}>
						<Button>Đăng ký</Button>
					</Link>
				</Form>
			</Card>
		</div>
	);
};
export default ForgotPasswordForm;
