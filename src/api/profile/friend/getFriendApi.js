import axios from 'axios';
import { BASE_URL } from '../../../context/apiCall';

//get 10 friend
const GetFriendApi = {
	getFriend: async ({ user, limit, page }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			};
			const data = {
				page,
				limit,
			};
			const res = await axios.post(`${BASE_URL}/v1/friend/list/${user.userId}`, data, config);
			if (res.data.success) {
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (err) {
			throw new Error(err.response.data.message);
		}
	},
	getListFriendRequest: async ({ user, limit, page }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const data = {
				page,
				limit,
			};
			const res = await axios.post(`${BASE_URL}/v1/friend/request/list`, data, config);
			if (res.data.success) {
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getSuggestionFriend: async ({ user, limit, page }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const data = {
				page,
				limit,
			};
			const res = await axios.post(`${BASE_URL}/v1/friend/suggestion/list`, data, config);
			if (res.data.success) {
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getSendFriendRequest: async ({ user, limit, page }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const data = {
				page,
				limit,
			};
			const res = await axios.post(`${BASE_URL}/v1/friend/suggestion/list`, data, config);
			if (res.data.success) {
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	deleteFriendRequest: async (token, userId) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};
		await axios
			.put(`${BASE_URL}/v1/friend/request/delete/${userId}`, {}, config)
			.then((res) => {
				if (res.data.success) {
					return res.data.result;
				} else {
					throw new Error(res.data.message);
				}
			})
			.catch((err) => {
				throw new Error(err.response.data.message);
			});
	},
	acceptFriendRequest: async (token, userId) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};
		await axios
			.put(`${BASE_URL}/v1/friend/request/accept/${userId}`, {}, config)
			.then((res) => {
				if (res.data.success) {
					return res.data.result;
				} else {
					throw new Error(res.data.message);
				}
			})
			.catch((err) => {
				throw new Error(err.response.data.message);
			});
	},
};
export default GetFriendApi;
