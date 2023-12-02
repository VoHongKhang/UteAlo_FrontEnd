import axios from 'axios';
import { BASE_URL } from '../../context/apiCall';
const ChangePasswordApi = {
	changePassword: async (data, currentUser) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			const res = await axios.put(`${BASE_URL}/v1/user/change-password`, data, config);

			if (res.data.success) {
				return res.data;
			} else {
				throw new Error(res.data.message);
			}
		} catch (err) {
			throw new Error(err.response ? err.response.data.message : err.message);
		}
	},
};
export default ChangePasswordApi;
