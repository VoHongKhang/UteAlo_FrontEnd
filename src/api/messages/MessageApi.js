import axios from 'axios';
import { BASE_URL } from '../../context/apiCall';

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
			const res = await axios.get(`${BASE_URL}/v1/message/user/${userId}?page=${page}&size=${size}`, config);
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
	addMessage: async (message) => {
		const response = await axios.post(`${BASE_URL}/messages`, message);
		return response.data;
	},
	updateMessage: async (message) => {
		const response = await axios.put(`${BASE_URL}/messages/${message.id}`, message);
		return response.data;
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
			const res = await axios.put(`${BASE_URL}/v1/message/delete`, data, config);
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
