import axios from 'axios';
import { BASE_URL } from '../../context/apiCall';

const ForgotApi = {
	forgotpw: async (email) => {
		await axios
			.post(`${BASE_URL}/v1/user/forgot-password?email=${email}`)
			.then((res) => {
				if (res.data.success) {
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
export default ForgotApi;
