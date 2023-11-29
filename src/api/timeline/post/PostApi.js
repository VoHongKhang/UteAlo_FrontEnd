import axios from 'axios';
import { BASE_URL } from '../../../context/apiCall';

const PostApi = {
	// Lấy danh sách bài share
	fetchPostsShare: async (user, page, size) => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.accessToken}`,
				},
			};

			const res = await axios.get(`${BASE_URL}/v1/share/get/timeLine?page=${page}&size=${size}`, config);
			if (res?.status === 200) {
				return res.data.result;
			}
		} catch (error) {
			console.log(error);
		}
	},
	// Lấy danh sách bài post
	fetchPostsGroup: async (user, page, size) => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.accessToken}`,
				},
			};

			const res = await axios.get(`${BASE_URL}/v1/post/get/timeLine?page=${page}&size=${size}`, config);
			if (res?.status === 200) {
				return res.data.result;
			}
		} catch (error) {
			console.log(error);
		}
	},
	// Lấy danh sách bài post
	fetchPostsPage: async (userId, accessToken) => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			};

			const res = await axios.get(`${BASE_URL}/v1/post/${userId}/page-posts`, config);
			if (res?.success) {
				return res.data.result;
			}
		} catch (error) {
			console.log(error);
		}
	},
	// Lấy danh sách bài post
	fetchPostsUser: async (userId, accessToken) => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			};

			const res = await axios.get(`${BASE_URL}/v1/post/${userId}/user-posts`, config);
			if (res?.success) {
				return res.data.result;
			}
		} catch (error) {
			console.log(error);
		}
	},
	deletePost: async (user, postId, postUserid) => {
		console.log('user', user);
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.put(`${BASE_URL}/v1/post/delete/${postId}`, postUserid, config);
			return res.data;
		} catch (error) {
			throw new Error(error?.response ? error.response.data.message : error.message);
		}
	},
};
export default PostApi;
