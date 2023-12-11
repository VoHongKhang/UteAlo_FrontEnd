import axios from 'axios';
import { BASE_URL } from '../../context/apiCall';

const notificationApi = {
	getNotifications: async ({ user, page, size }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/notification/get?page=${page}&size=${size}`, config);
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
	readNotification: async ({ user, notificationId }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.put(`${BASE_URL}/v1/notification/read/${notificationId}`, {}, config);
			return res.data;
		} catch (error) {
			return error.response.data;
		}
	},
};
export default notificationApi;
