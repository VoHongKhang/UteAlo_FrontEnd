import { Button, Card, Form, Select, theme, Typography, Input, Radio } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
const listGroups = [
	'201101C',
	'201102C',
	'201103C',
	'Công nghệ thông tin 1',
	'Công nghệ thông tin 2',
	'Công nghệ thông tin 3',
	'Công nghệ thông tin 4',
	'Xây dựng 1',
	'Xây dựng 2',
	'Xây dựng 3',
	'Xây dựng 4',
	'Kinh tế 1',
	'Kinh tế 2',
	'Kinh tế 3',
	'Kinh tế 4',
	'Du lịch 1',
	'Du lịch 2',
	'Du lịch 3',
	'Du lịch 4',
	'Ngoại ngữ 1',
	'Ngoại ngữ 2',
	'Ngoại ngữ 3',
	'Ngoại ngữ 4',
	'Ngân hàng 1',
	'Ngân hàng 2',
	'Ngân hàng 3',
	'Ngân hàng 4',
	'Quản trị kinh doanh 1',
	'Quản trị kinh doanh 2',
	'Quản trị kinh doanh 3',
	'Quản trị kinh doanh 4',
];
function InforFormStudents({ onSubmit, loading }) {
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
				<Form.Item
					label="Tên lớp"
					name="groupName"
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập tên lớp!',
						},
					]}
				>
					<Select
						showSearch
						ptionfilterprop="label"
						options={listGroups.map((item) => ({ label: item, value: item }))}
					/>
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

export default InforFormStudents;
