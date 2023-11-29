import React from 'react';
import { Button, Card, Divider, Form, Input, Space, theme, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import AuthEmailApi from '../../../api/auth/authEmailApi';
import SendOTP from '../../../api/auth/sendOTP';
const AuthEmailForm = (email) => {
	const { token } = theme.useToken();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [sendOTP, setSendOTP] = useState(false);

	const onFinish = async () => {
		setLoading(true);

		const toastId = toast.loading('Đang gửi yêu cầu...');
		try {
			await AuthEmailApi.authEmail(form.getFieldValue('opt'), email);
			toast.success('Xác thực tài khoản thành công! Hãy đăng nhập tài khoản...', { id: toastId });
		} catch (error) {
			console.log(error);
			toast.error(`Gửi yêu thất bại! Lỗi: ${error}`, { id: toastId });
		}

		setLoading(false);
	};
	const handleAuth = async () => {
		setSendOTP(true);
		const toastId = toast.loading('Đang gửi yêu cầu...');
		try {
			await SendOTP.sendOTP(email);
			toast.success('Gửi yêu thành công! Vui lòng kiểm tra email của bạn.', { id: toastId });
		} catch (error) {
			toast.error(`Gửi yêu thất bại! Lỗi: ${error}`, { id: toastId });
		}
		setSendOTP(false);
	};

	return (
		<div>
			<Card
				title={
					<Typography.Title level={2} style={{ color: token.colorPrimary, margin: 0, textAlign: 'center' }}>
						Xác thực tài khoản
					</Typography.Title>
				}
				style={{ width: 480, margin: 'auto' }}
			>
				<Form layout="vertical" form={form} onFinish={onFinish}>
					<Form.Item
						label="Mã xác thực"
						name="opt"
						rules={[
							{
								required: true,
								message: 'Vui lòng nhập mã xác thực!',
							},
						]}
					>
						<Input />
					</Form.Item>

					<Space style={{ float: 'left' }}>
						<Form.Item>
							<Button
								type="default"
								block
								loading={sendOTP}
								onClick={handleAuth}
								style={{ float: 'left' }}
							>
								Gửi lại mã xác thực
							</Button>
						</Form.Item>
					</Space>
					<Space style={{ float: 'right' }}>
						<Form.Item>
							<Button type="primary" block loading={loading} htmlType="submit" style={{ float: 'right' }}>
								Xác nhận
							</Button>
						</Form.Item>
					</Space>

					<Divider>Xác thực thành công ?</Divider>

					<Space style={{display: 'flex',width: '100%',justifyContent: 'center'}}>
						<Link to="/login" >
							<Button type="primary">Đăng nhập</Button>
						</Link>
					</Space>
				</Form>
			</Card>
		</div>
	);
};
export default AuthEmailForm;
