import axios from 'axios';
import { BASE_URL } from '../../context/apiCall';
const PostGroupApi = {
	listOwnerGroup: async (user) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/groupPost/list/owner`, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	listJoinGroup: async (user) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/groupPost/list/join`, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	listSuggestGroup: async (user) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/groupPost/list/suggestion`, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	listInviteGroup: async (user) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/groupPost/list/invited`, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
};
export default PostGroupApi;
