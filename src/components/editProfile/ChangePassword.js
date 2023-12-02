import { Button, Form, Input } from 'antd';

export default function ChangePassword({ updatePassword, setVisibleModalUpdate }) {
	const [form] = Form.useForm();
	return (
		<Form
			layout="vertical"
			form={form}
			name="info"
			onFinish={() => {
				updatePassword(form.getFieldsValue());
				setVisibleModalUpdate({ visible: false, type: '' });
			}}
		>
			<Form.Item
				label="Mật khẩu cũ"
				name="password"
				rules={[
					{
						required: true,
						message: 'Vui lòng nhập mật khẩu cũ!',
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
				<Input.Password allowClear />
			</Form.Item>
			<Form.Item
				label="Mật khẩu mới"
				name="newPassword"
				rules={[
					{
						required: true,
						message: 'Vui lòng nhập mật khẩu !',
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
					// không trùng với mật khẩu cũ
					{
						validator(_, value) {
							if (!value || form.getFieldValue('password') !== value) {
								return Promise.resolve();
							}
							return Promise.reject(new Error('Mật khẩu mới không được trùng với mật khẩu cũ!'));
						},
					},
				]}
			>
				<Input.Password allowClear />
			</Form.Item>
			<Form.Item
				label="Nhập lại mật khẩu mới"
				name="confirmPassword"
				rules={[
					{
						required: true,
						message: 'Vui lòng nhập mật khẩu!',
					},
					({ getFieldValue }) => ({
						validator(_, value) {
							if (!value || getFieldValue('newPassword') === value) {
								return Promise.resolve();
							}
							return Promise.reject(new Error('Mật khẩu không khớp!'));
						},
					}),
				]}
			>
				<Input.Password allowClear />
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
