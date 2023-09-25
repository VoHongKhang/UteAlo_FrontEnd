import axios from 'axios';
import { BASE_URL } from '../../../context/apiCall';

//get 10 friend
const Get10FriendApi = {
	get10Friend: async ({ user }) => {
		try {
			const res = await axios.get(`${BASE_URL}/v1/friend/list/${user.userId}`);
			if (res.data.success) {
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (err) {
			throw new Error(err.response.data.message);
		}
	},
};
export default Get10FriendApi;
