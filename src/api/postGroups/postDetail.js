import { BASE_URL } from '../../context/apiCall';
import Api from '../Api';
export const postDetail = {
	getListPostById: async (currentUser, postGroupId, page, size) => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			const res = await Api.get(
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
			const res = await Api.get(
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
	getFileMediaById: async (groupId, page, size) => {
		try {
			const res = await Api.get(`${BASE_URL}/v1/groupPost/photos/${groupId}?page=${page}&size=${size}`);
			return res;
		} catch (error) {
			return error.response ? error.response.data.message : error.message;
		}
	},
	getFileDocumentById: async (groupId) => {
		console.log('groupID', groupId);
		try {
			const res = await Api.get(`${BASE_URL}/v1/groupPost/files/${groupId}`);

			return res;
		} catch (error) {
			return error.response ? error.response.data.message : error.message;
		}
	},
	getListPostNoteById: async (postGroupId, page, size) => {
		try {
			const res = await Api.get(`${BASE_URL}/v1/groupPost/roleAdmin/${postGroupId}?page=${page}&size=${size}`);
			if (res.data.success) {
				return res.data.result;
			} else {
				return res.data.message;
			}
		} catch (error) {
			return error.response ? error.response.data.message : error.message;
		}
	},
};
