import axios from 'axios';
import { BASE_URL } from '../../context/apiCall';
import Api from '../Api';

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
					throw new Error(res);
				}
			})
			.catch((err) => {
				throw new Error(err);
			});
	},
	logout: async (user) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await Api.post(`${BASE_URL}/v1/auth/logout?refreshToken=${user.refreshToken}`, config);
			return res;
		} catch (err) {
			throw new Error(err);
		}
	},
};
export default AuthEmailApi;
