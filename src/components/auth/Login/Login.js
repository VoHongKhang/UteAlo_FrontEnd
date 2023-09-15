import './Login.css';
import '../../../styles/global.css';
import { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet';
import { loginJson } from '../../../assets/data/json';
import Lottie from 'lottie-react';
import LoginForm from './LoginForm';

const Login = () => {
	return (
		<>
			<Helmet title="UTEALO - Đăng Nhập" />
			<Toaster />
			<div className="login">
				<div className="loginWrapper">
					<div className="loginLeft">
						<Lottie animationData={loginJson} loop autoplay style={{ width: '100%', height: '100%' }} />
					</div>
					<div className="loginRight">
						<LoginForm />
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
