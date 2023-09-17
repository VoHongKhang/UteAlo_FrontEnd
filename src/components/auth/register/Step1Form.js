import React from 'react';
import { Button, Card, Form, Select, theme, Typography } from 'antd';
import { Link } from 'react-router-dom';
function Step1Form({ onSubmit }) {
	const { token } = theme.useToken();
	const [form] = Form.useForm();
	const { Option } = Select;

	const handleInputChange = () => {
		
		onSubmit(form.getFieldsValue());
	};
	const options = ['Sinh Viên', 'Giảng Viên', 'Phụ Huynh', 'Nhân viên'];
	const valueOptions = ['SinhVien', 'GiangVien', 'PhuHuynh', 'NhanVien'];
	return (
		<div className="form1">
			<Card
				title={
					<Typography.Title level={2} style={{ color: token.colorPrimary, margin: 0, textAlign: 'center' }}>
						Bạn là ai?
					</Typography.Title>
				}
				style={{ width: 480, margin: 'auto' }}
			>
				<Form layout="vertical" form={form} name="role" onFinish={handleInputChange}>
					<Form.Item name="roleName" label="Chọn vai trò" initialValue={valueOptions[0]}>
						<Select style={{ width: 200 }}>
							{options.map((option, index) => (
								<Option key={index} value={valueOptions[index]}>
									{option}
								</Option>
							))}
						</Select>
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
			</Card>{' '}
		</div>
	);
}
export default Step1Form;
