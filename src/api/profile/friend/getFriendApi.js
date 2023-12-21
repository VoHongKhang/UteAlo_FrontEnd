import { BASE_URL } from '../../../context/apiCall';
import Api from '../../Api';

//get 10 friend
const GetFriendApi = {
	// Lấy danh sách nhóm đã tham gia
	getFriend: async (user) => {
		try {
			const res = await Api.get(`${BASE_URL}/v1/friend/list/${user.userId}`);
			if (res.data.success) {
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (err) {
			throw new Error(err.response.data.message);
		}
	},
	getFriendPageable: async (user) => {
		try {
			const res = await Api.get(`${BASE_URL}/v1/friend/list/pageable/${user.userId}`);
			if (res.data.success) {
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (err) {
			throw new Error(err.response.data.message);
		}
	},
	getListFriendRequest: async (user) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await Api.get(`${BASE_URL}/v1/friend/request/list`, config);
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
	getListFriendRequestPageable: async (user) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await Api.get(`${BASE_URL}/v1/friend/request/list/pageable`, config);
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
	getSuggestionFriend: async (user) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await Api.get(`${BASE_URL}/v1/friend/suggestion/list`, config);
			if (res.data.success) {
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getSendFriendRequest: async (user) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await Api.get(`${BASE_URL}/v1/friend/requestFrom/list`, config);
			if (res.data.success) {
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	rejectFriendRequest: async ({ token, userId }) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};
		await Api.put(`${BASE_URL}/v1/friend/request/delete/${userId}`, {}, config)
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
	acceptFriendRequest: async ({ token, userId }) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};
		await Api.put(`${BASE_URL}/v1/friend/request/accept/${userId}`, {}, config)
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
	sendFriendRequest: async ({ token, userId }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};
			const res = await Api.post(`${BASE_URL}/v1/friend/request/send/${userId}`, {}, config);

			return res;
		} catch (err) {
			throw new Error(err.response ? err.response.data.message : err.message);
		}
	},
	unFriend: async ({ token, userId }) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};
		await Api.put(`${BASE_URL}/v1/friend/delete/${userId}`, {}, config)
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
	cancelFriendRequest: async ({ token, userId }) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};
		await Api.put(`${BASE_URL}/v1/friend/request/cancel/${userId}`, {}, config)
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
