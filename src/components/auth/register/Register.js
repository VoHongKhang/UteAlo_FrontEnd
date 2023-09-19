import React, { useState, useEffect } from 'react';
import Step1Form from './Step1Form';
import Step2Form from './Step2Form';
import Step3Form from './Step3Form';
import InforFormStudents from './InfoFormStudent';
import { Button, Space, Steps } from 'antd';
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
	useEffect(() => {
		if (step === 2) {
			async function fetchData() {
				setSubmited(true);

				const toastId = toast.loading('Đang gửi yêu cầu...');
				try {
					await RegisterApi.register(formData);
					toast.success('Gửi yêu thành công! Vui lòng kiểm tra email của bạn.', { id: toastId });
					// Hiển thị thông báo chuyển trang đăng nhập
					setTimeout(() => {
						toast.success('Đang chuyển trang đăng nhập...', { id: toastId });
					}, 3000);

					// TỰ ĐỘng chuyển sang trang đăng nhập trong 5s
					setTimeout(() => {
						window.location.href = '/login';
					}, 6000);
				} catch (error) {
					toast.error(`Gửi yêu thất bại! Lỗi: ${error}`, { id: toastId });
				}
				setSubmited(false);
			}
			fetchData();
		}
	}, [formData]);

	const handleStepSubmit = (stepData) => {
		setFormData((preData) => ({ ...preData, ...stepData }));
		if (step < 2) {
			nextStep();
		}
	};

	return (
		
		<div className="register_form">
			<Helmet title="UTEALO - Đăng ký" />
			<div className={`step step-${step}`}>
				<Steps current={step}>
					<Steps.Step title="Xác nhận vai trò" />
					<Steps.Step title="Tài khoản" />
					<Steps.Step title="Thông tin cá nhân" />
				</Steps>
			</div>
			{step === 0 && <Step1Form onSubmit={handleStepSubmit} />}
			{step === 1 && <Step2Form onSubmit={handleStepSubmit} data={formData.roleName} />}

			{step === 2 && formData.roleName === 'SinhVien' && <InforFormStudents onSubmit={handleStepSubmit} loading={submited}/>}
			{step === 2 && formData.roleName !== 'SinhVien' && <Step3Form onSubmit={handleStepSubmit} loading={submited}/>}
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
