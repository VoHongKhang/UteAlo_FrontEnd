import axios from 'axios';
import { BASE_URL } from '../../context/apiCall';

//register
const LoginApi = {
	login: async ({ credentialId, password }) => {
		const config = {
			headers: { 'Content-Type': 'application/json' },
		};
		await axios
			.post(`${BASE_URL}/v1/auth/login`, { credentialId, password }, config)
			.then((res) => {
				if (res.data.success) {
					localStorage.setItem(
						'userInfo',
						JSON.stringify({
							accessToken: res.data.result.accessToken,
							refreshToken: res.data.result.refreshToken,
							userId: res.data.result.userId,
						})
					);
					return res.data;
				} else {
					throw new Error(res.data.message);
				}
			})
			.catch((err) => {
				throw new Error(err);
			});
	},
};
export default LoginApi;
