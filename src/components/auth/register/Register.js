import React, { useState, useEffect } from 'react';
import Step1Form from './Step1Form';
import Step2Form from './Step2Form';
import Step3Form from './Step3Form';
import InforFormStudents from './InfoFormStudent';
import { Button, Space, Steps } from 'antd';
import { Toaster } from 'react-hot-toast';
import './Register.css';
import toast from 'react-hot-toast';
import RegisterApi from '../../../api/auth/registerApi';
import { Helmet } from 'react-helmet';
const ACCOUNT_STEP = 0;
const INFO_STEP = 2;

function Register() {
	const [step, setStep] = useState(ACCOUNT_STEP);
	const [formData, setFormData] = useState({});
	const [submited, setSubmited] = useState(false);
	const nextStep = () => setStep((step) => step + 1);
	const prevStep = () => setStep((step) => step - 1);
	const canBack = step <= INFO_STEP && step > ACCOUNT_STEP;

	//Xử lý kết quả submit của các form con
	// useEffect(() => {
	// 	console.log(formData);
	// 	console.log(step);
	// 	if (step === 2) {
	// 		async function fetchData() {
	// 			setSubmited(true);
	// 			const id = toast.loading('Đang gửi yêu cầu..');
	// 			try {
	// 				await RegisterApi.register(formData);
	// 				toast.success('Gửi yêu thành công! Vui lòng kiểm tra email của bạn.', { id: id });
	// 				// Hiển thị thông báo chuyển trang xác thực email
	// 				setTimeout(() => {
	// 					toast.success('Đang chuyển trang xác thực email...', { id: id });
	// 				}, 2000);
	// 				// TỰ ĐỘng chuyển sang trang đăng nhập trong 5s
	// 				setTimeout(() => {
	// 					window.location.href = `/auth-email?email=${formData.email}`;
	// 				}, 6000);
	// 			} catch (error) {
	// 				toast.error(`Gửi yêu thất bại! Lỗi: ${error}`, { id: id });
	// 			}
	// 			setSubmited(false);
	// 		}
	// 		fetchData();
	// 	}
	// }, [formData]);

	const handleStepSubmit = (stepData) => {
		setFormData((preData) => ({ ...preData, ...stepData }));
		if (step < 2) {
			nextStep();
		} else {
			async function fetchData() {
				setSubmited(true);
				const id = toast.loading('Đang gửi yêu cầu..');
				try {
					await RegisterApi.register({ formData: { ...formData, ...stepData } });
					toast.success('Gửi yêu thành công! Vui lòng kiểm tra email của bạn.', { id: id });
					// Hiển thị thông báo chuyển trang xác thực email
					setTimeout(() => {
						toast.success('Đang chuyển trang xác thực email...', { id: id });
					}, 1000);
					// TỰ ĐỘng chuyển sang trang đăng nhập trong 5s
					setTimeout(() => {
						window.location.href = `/auth-email?email=${formData.email}`;
					}, 1000);
				} catch (error) {
					toast.error(`Gửi yêu thất bại! Lỗi: ${error.response ? error.response.data.message : error}`, {
						id: id,
					});
				}
				setSubmited(false);
			}
			fetchData();
		}
	};

	return (
		<div className="register_form">
			<Helmet title="UTEALO - Đăng ký" />
			<Toaster />
			<div className={`step step-${step}`}>
				<Steps current={step}>
					<Steps.Step title="Xác nhận vai trò" />
					<Steps.Step title="Tài khoản" />
					<Steps.Step title="Thông tin cá nhân" />
				</Steps>
			</div>
			{step === 0 && <Step1Form onSubmit={handleStepSubmit} />}
			{step === 1 && <Step2Form onSubmit={handleStepSubmit} data={formData.roleName} />}

			{step === 2 && formData.roleName === 'SinhVien' && (
				<InforFormStudents onSubmit={handleStepSubmit} loading={submited} />
			)}
			{step === 2 && formData.roleName !== 'SinhVien' && (
				<Step3Form onSubmit={handleStepSubmit} loading={submited} />
			)}
			<div className="step-action">
				<Space style={{ justifyContent: 'flex-end' }}>
					{canBack && (
						<Button className="prebtn" onClick={prevStep} disabled={submited}>
							Quay lại
						</Button>
					)}
				</Space>
			</div>
		</div>
	);
}

export default Register;
