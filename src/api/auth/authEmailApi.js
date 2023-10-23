import axios from 'axios';
import { BASE_URL } from '../../context/apiCall';

const AuthEmailApi = {
	authEmail: async (otp, emailParams) => {
		const email = emailParams.email;
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		await axios
			.post(`${BASE_URL}/v1/auth/verifyOTP`, { otp, email }, config)
			.then((res) => {
				if (res.data.success) {
					return res.data;
				} else {
					throw new Error(res.data.message);
				}
			})
			.catch((err) => {
				throw new Error(err.response.data.message);
			});
	},
	logout: async (user) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${user.accessToken}`,
			},
		};
		await axios
			.post(`${BASE_URL}/v1/auth/logout`, { refreshToken: user.refreshToken }, config)
			.then((res) => {
				if (res.data.success) {
					return res.data;
				} else {
					throw new Error(res.data.message);
				}
			})
			.catch((err) => {
				throw new Error(err.response.data.message);
			});
	},
};
export default AuthEmailApi;
