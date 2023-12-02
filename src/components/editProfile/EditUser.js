import { Button, DatePicker, Form, Input, Radio, theme } from 'antd';
import moment from 'moment';
import { useCallback } from 'react';

export default function EditUser({ profileUser, updateUser, setVisibleModalUpdate }) {
	const [form] = Form.useForm();
	const { token } = theme.useToken();
	const style = {
		border: `1px solid ${token.colorPrimary}`,
		borderRadius: '50%',
	};
	const cellRender = useCallback((current, info) => {
		if (info.type !== 'date') {
			return info.originNode;
		}
		if (typeof current === 'number') {
			return <div className="ant-picker-cell-inner">{current}</div>;
		}
		return (
			<div className="ant-picker-cell-inner" style={current.date() === 1 ? style : {}}>
				{current.date()}
			</div>
		);
	}, []);
	return (
		<Form
			layout="vertical"
			form={form}
			initialValues={{
				userName: profileUser?.userName,
				address: profileUser?.address,
				gender: profileUser?.gender,
				phone: profileUser?.phone,
				dayOfBirth: moment(profileUser?.dayOfBirth),
			}}
			name="info"
			onFinish={() => {
				updateUser(form.getFieldsValue());
				setVisibleModalUpdate({ visible: false, type: '' });
			}}
		>
			<Form.Item
				label="Họ và tên"
				name="userName"
				rules={[
					{
						required: true,
						message: 'Vui lòng nhập họ và tên!',
					},
				]}
			>
				<Input allowClear />
			</Form.Item>
			<Form.Item label="Địa chỉ" name="address">
				<Input allowClear />
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
				<Input allowClear />
			</Form.Item>
			<Form.Item label="Ngày sinh" name="dayOfBirth">
				<DatePicker cellRender={cellRender} format={'DD/MM/YYYY'} />
			</Form.Item>
			<div>
				<Button className="button--cancel" onClick={() => setVisibleModalUpdate({ visible: false, type: '' })}>
					Hủy
				</Button>
				<Button type="primary" htmlType="submit" style={{ float: 'right' }}>
					Lưu
				</Button>
			</div>
		</Form>
	);
}
