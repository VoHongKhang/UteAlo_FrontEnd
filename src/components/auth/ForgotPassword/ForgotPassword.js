import './ForgotPassword.css';
import '../../../styles/global.css';
import { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet';
import { forgotPwdJson } from '../../../assets/data/json';
import Lottie from 'lottie-react';
import ForgotPasswordForm from './ForgotPasswordForm';

const ForgotPassword = () => {
	return (
		<>
			<Helmet title="UTEALO - Quên mật khẩu" />
			<Toaster />
			<div className="forgotPassword">
				<div className="forgotPasswordWrapper">
					<div className="forgotPasswordLeft">
						<Lottie animationData={forgotPwdJson} loop autoplay style={{ width: '100%', height: '100%' }} />
					</div>
					<div className="forgotPasswordRight">
						<ForgotPasswordForm />
					</div>
				</div>
			</div>
		</>
	);
};

export default ForgotPassword;
