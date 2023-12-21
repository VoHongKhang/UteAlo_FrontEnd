import { BASE_URL } from '../../context/apiCall';
import Api from '../Api';

const MessageApi = {
	getMessage: async ({ userId, page, size }) => {
		console.log('userId', userId);
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${
						localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).accessToken : ''
					}`,
				},
			};
			const res = await Api.get(`${BASE_URL}/v1/messages/get/user/${userId}?page=${page}&size=${size}`, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data;
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getMessageGroup: async ({ currentUser, groupId, page, size }) => {
		console.log('groupId', groupId);
		try {
			const res = await Api.get(`${BASE_URL}/v1/messages/get/group/${groupId}?page=${page}&size=${size}`);
			if (res.data.success) {
				console.log(res.data);
				return res.data;
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	deleteMessage: async (data) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${
						localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).accessToken : ''
					}`,
				},
			};
			const res = await Api.put(`${BASE_URL}/v1/message/delete`, data, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data;
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
};
export default MessageApi;
