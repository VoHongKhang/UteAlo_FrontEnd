import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';
import { CircularProgress } from '@material-ui/core';
import { toast } from 'react-hot-toast';
import { errorOptions, successOptions } from '../utils/toastStyle';
import axios from 'axios';
import { BASE_URL } from '../../context/apiCall';
function EmailVerificationModal({ isVisible, onCancel, onSubmit, email }) {
	const [verificationCode, setVerificationCode] = useState('');
	const [isSendingCode, setIsSendingCode] = useState(false);
	const [isCodeSent, setIsCodeSent] = useState(false);

	const handleSendCode = async () => {
		setIsSendingCode(true);
		const timeSendCode = localStorage.getItem('timeSendCode');
		if (timeSendCode && Date.now() - timeSendCode < 60000) {
			// sử dụng toast để hiển thị thông báo
			toast.error('Vui lòng đợi 60s để gửi lại mã xác nhận', errorOptions);
			setIsSendingCode(false);
			return;
		}

		// hàm gửi mã xác nhận sử dụng axios post
		const config = {
			headers: { 'Content-Type': 'application/json' },
		};
		const res = await axios.post(`${BASE_URL}/v1/auth/sendOTP`, { email: email }, config);
		if (res.data.success) {
			toast.success('Gửi mã xác nhận thành công', successOptions);
			setIsCodeSent(true);
			localStorage.setItem('timeSendCode', Date.now());
		} else {
			toast.error('Gửi mã xác nhận thất bại', errorOptions);
		}
		setIsSendingCode(false);
	};

	const handleConfirm = () => {


		// Xác thực mã xác nhận ở đây và xử lý kết quả
		console.log('Mã xác nhận:', verificationCode);
		// Sau khi xác thực thành công, bạn có thể đóng Modal
		onCancel();
	};

	return (
		<Modal
			title="Xác thực email"
			open={isVisible}
			onCancel={onCancel}
			footer={[
				<Button key="cancel" onClick={onCancel}>
					Hủy
				</Button>,
				isCodeSent && (
					<Button key="resend" onClick={handleSendCode}>
						<>{isSendingCode ? <CircularProgress color="secondary" size={22} /> : 'Gửi lại mã xác nhận'}</>
					</Button>
				),
				<Button key="confirm" type="primary" onClick={isCodeSent ? handleConfirm : handleSendCode}>
					{isCodeSent ? (
						'Xác nhận'
					) : (
						<>{isSendingCode ? <CircularProgress color="secondary" size={22} /> : 'Gửi mã xác nhận'}</>
					)}
				</Button>,
			]}
		>
			{isCodeSent ? (
				<div>
					<p>Nhập mã xác thực đã gửi đến email của bạn:</p>
					<Input
						value={verificationCode}
						onChange={(e) => setVerificationCode(e.target.value)}
						placeholder="Mã xác thực"
					/>
				</div>
			) : (
				<p>Click vào "Gửi mã xác nhận" để nhận mã xác nhận qua email.</p>
			)}
		</Modal>
	);
}

export default EmailVerificationModal;
