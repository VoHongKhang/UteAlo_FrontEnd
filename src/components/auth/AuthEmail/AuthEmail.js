import '../../../styles/global.css';
import { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet';
import { AuthEmailJson } from '../../../assets/data/json';
import Lottie from 'lottie-react';
import AuthEmailForm from './AuthEmailForm';
import './AuthEmail.css';
import { useLocation } from 'react-router-dom';
const AuthEmail = () => {
	const location = useLocation();
	const urlParams = new URLSearchParams(location.search);
	const email = urlParams.get('email');
	return (
		<>
			<Helmet title="UTEALO - Xác thực tài khoản" />
			<Toaster />
			<div className="authEmail">
				<div className="authEmailWrapper">
					<div className="authEmailLeft">
						<Lottie animationData={AuthEmailJson} loop autoplay style={{ width: '100%', height: '100%' }} />
					</div>
					<div className="authEmailRight">
						<AuthEmailForm email={email}/>
					</div>
				</div>
			</div>
		</>
	);
};

export default AuthEmail;
