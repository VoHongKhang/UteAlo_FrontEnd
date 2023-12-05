import { Button, Card, Form, theme, Typography, Input, Radio } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function Step3Form({ onSubmit, loading }) {
	const { token } = theme.useToken();
	const [form] = Form.useForm();
	const handleNext = () => {
		onSubmit(form.getFieldsValue());
	};
	return (
		<Card
			title={
				<Typography.Title level={2} style={{ color: token.colorPrimary, margin: 0, textAlign: 'center' }}>
					Thông tin cá nhân
				</Typography.Title>
			}
			style={{ width: 480, margin: 'auto' }}
		>
			<Form layout="vertical" form={form} name="info" onFinish={handleNext}>
				<Form.Item
					label="Họ và tên"
					name="fullName"
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập họ và tên!',
						},
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Giới tính"
					name="gender"
					rules={[
						{
							required: true,
							message: 'Vui lòng chọn giới tính!',
						},
					]}
				>
					<Radio.Group>
						<Radio value="MALE">Nam</Radio>
						<Radio value="FEMALE">Nữ</Radio>
						<Radio value="OTHER">Khác</Radio>
					</Radio.Group>
				</Form.Item>

				<Form.Item
					label="Số điện thoại"
					name="phone"
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập số điện thoại!',
						},
						{
							pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
							message: 'Số điện thoại không hợp lệ!',
						},
					]}
				>
					<Input />
				</Form.Item>
				<Button type="primary" htmlType="submit" style={{ float: 'right' }} loading={loading}>
					Xác nhận
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

export default Step3Form;
