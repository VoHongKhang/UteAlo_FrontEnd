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
};
export default PostApi;
