import { Button, Card, Col, Divider, Form, Input, Row, theme, Typography } from 'antd';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { resetPwdJson } from '../../../assets/data/json';
import Lottie from 'lottie-react';
import { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import ResetPasswordApi from '../../../api/auth/resetPasswordApi';
import { useLocation } from 'react-router-dom';
const ResetPassord = () => {
	const { token } = theme.useToken();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const location = useLocation();
	const urlParams = new URLSearchParams(location.search);
	const tokenForm = urlParams.get('token');
	const onFinish = async () => {
		setLoading(true);

		const toastId = toast.loading('Đang đặt lại mật khẩu...');
		try {
			await ResetPasswordApi.resetPassword(tokenForm,form.getFieldValue());

			toast.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.', { id: toastId });

			setTimeout(() => {
				window.location.href = '/auth/login';
			}, 1000);
		} catch (error) {
			toast.error(`Đặt lại mật khẩu thất bại! Lỗi: ${error.response ? error.response.data.message : error}`, { id: toastId });
		}

		setLoading(false);
	};
	return (
		<>
			<Helmet title="UTEALO - Đặt lại mật khẩu" />
			<Toaster />
			<Row style={{ maxWidth: 1200, margin: 'auto', flex: 1, height: '100%' }} align="middle" justify="center">
				<Col span={12} style={{ height: 'fit-content' }}>
					<Lottie animationData={resetPwdJson} loop autoplay style={{ width: '100%', height: '100%' }} />
				</Col>

				<Card
					title={
						<Typography.Title
							level={2}
							style={{ color: token.colorPrimary, margin: 0, textAlign: 'center' }}
						>
							Đặt lại mật khẩu
						</Typography.Title>
					}
					style={{ width: 480, margin: 'auto' }}
				>
					<Form layout="vertical" form={form} onFinish={onFinish}>
						<Form.Item
							label="Mật khẩu"
							name="newPassword"
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

						<Form.Item
							label="Nhập lại mật khẩu"
							name="confirmPassword"
							rules={[
								{
									required: true,
									message: 'Vui lòng nhập lại mật khẩu!',
								},
								{
									validator: (_, value) => {
										if (value === form.getFieldValue('newPassword')) {
											return Promise.resolve();
										}

										return Promise.reject(new Error('Mật khẩu không khớp!'));
									},
								},
							]}
						>
							<Input.Password />
						</Form.Item>

						<Form.Item>
							<Button type="primary" block loading={loading} htmlType="submit">
                            Đặt lại mật khẩu
							</Button>
						</Form.Item>

						<Divider>Hoặc</Divider>

						<Link to="/login" style={{ float: 'right' }}>
							<Button type="primary">Đăng nhập</Button>
						</Link>

						<Link to="register" style={{ float: 'left' }}>
							<Button>Đăng ký</Button>
						</Link>
					</Form>
				</Card>
			</Row>
		</>
	);
};
export default ResetPassord;
