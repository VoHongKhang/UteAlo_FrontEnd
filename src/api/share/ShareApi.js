import axios from 'axios';
import { BASE_URL } from '../../context/apiCall';
const Share = {
	findById: async ({ user, shareId }) => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/post/share/${shareId}`, config);
			return res.data.result;
		} catch (error) {
			throw new Error(error?.response ? error.response.data.message : error.message);
		}
	},
};
export default Share;
