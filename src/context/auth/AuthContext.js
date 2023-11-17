import axios from 'axios';
import { createContext, useContext, useReducer } from 'react';
import { BASE_URL } from '../apiCall';
import authReducer, { initialState } from './authReducer';
import toast from 'react-hot-toast';
const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialState);

	const loginReq = async (credentialId, password) => {
		const toastId = toast.loading('Đang gửi yêu cầu...');
		try {
			dispatch({
				type: 'LOGIN_REQUEST',
			});
			const config = {
				headers: { 'Content-Type': 'application/json' },
			};
			await axios
				.post(`${BASE_URL}/v1/auth/login`, { credentialId, password }, config)
				.then((response) => {
					const { accessToken, refreshToken, userId } = response.data.result;
					dispatch({
						type: 'LOGIN_SUCCESS',
						payload: {
							accessToken,
							refreshToken,
							userId,
						},
					});
          console.log("123LOgin");
					toast.success('Đăng nhập thành công!', { id: toastId });
					localStorage.setItem(
						'userInfo',
						JSON.stringify({
							accessToken,
							refreshToken,
							userId,
						})
					);
				})
				.catch((error) => {
					dispatch({
						type: 'LOGIN_FAIL',
						payload: error.response.data.message,
					});
					toast.error(`Đăng nhập thất bại! Lỗi: ${error.response.data.message}`, { id: toastId });
				});
		} catch (error) {
			dispatch({
				type: 'LOGIN_FAIL',
				payload: error.response.data.message,
			});
			toast.error(`Đăng nhập thất bại! Lỗi: ${error.response.data.message}`, { id: toastId });
		}
	};

	// user register
	const register = async (name, email, password) => {
		try {
			dispatch({
				type: 'REGISTER_REQUEST',
			});
			const config = {
				headers: {
					'Content-type': 'application/json',
				},
			};
			const { data } = await axios.post(`${BASE_URL}/auth/register`, { name, email, password }, config);

			dispatch({
				type: 'REGISTER_SUCCESS',
				payload: data,
			});
			localStorage.setItem('userInfo', JSON.stringify(data));
		} catch (error) {
			dispatch({
				type: 'REGISTER_FAIL',
				payload: error.response.data.message,
			});
		}
	};

	const value = {
		user: state.user,
		loading: state.loading,
		error: state.error,
		loginReq,
		register,
		dispatch,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error('useAuth must be used within AuthContext');
	}
	return context;
};

export default useAuth;
