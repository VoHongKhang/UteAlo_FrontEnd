import axios from 'axios';
import { BASE_URL } from '../../context/apiCall';
export const postDetail = {
	getListPostById: async (currentUser, postGroupId, page, size) => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			const res = await axios.get(
				`${BASE_URL}/v1/groupPost/${postGroupId}/posts?page=${page}&size=${size}`,
				config
			);
			if (res.data.success) {
				return res.data.result;
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			console.log(error);
		}
	},
	getSharePostById: async (currentUser, postGroupId, page, size) => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			const res = await axios.get(
				`${BASE_URL}/v1/groupPost/${postGroupId}/shares?page=${page}&size=${size}`,
				config
			);
			if (res.data.success) {
				return res.data.result;
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			console.log(error);
		}
	},
};
