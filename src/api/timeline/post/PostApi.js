import { BASE_URL } from '../../../context/apiCall';
import Api from '../../Api';

const PostApi = {
	// Lấy danh sách bài share
	fetchPostsShareTimeLine: async (user, page, size) => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.accessToken}`,
				},
			};

			const res = await Api.get(`${BASE_URL}/v1/share/get/timeLine?page=${page}&size=${size}`, config);
			if (res?.status === 200) {
				return res.data.result;
			}
		} catch (error) {
			console.log(error);
		}
	},
	// Lấy danh sách bài post
	fetchPostsTimeLine: async (user, page, size) => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.accessToken}`,
				},
			};

			const res = await Api.get(`${BASE_URL}/v1/post/get/timeLine?page=${page}&size=${size}`, config);
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

			const res = await Api.get(`${BASE_URL}/v1/post/${userId}/page-posts`, config);
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

			const res = await Api.get(`${BASE_URL}/v1/post/${userId}/user-posts`, config);
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
			const res = await Api.put(`${BASE_URL}/v1/post/delete/${postId}`, postUserid, config);
			return res.data;
		} catch (error) {
			throw new Error(error?.response ? error.response.data.message : error.message);
		}
	},
	findById: async ({ user, postId }) => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await Api.get(`${BASE_URL}/v1/post/${postId}`, config);
			return res.data.result;
		} catch (error) {
			throw new Error(error?.response ? error.response.data.message : error.message);
		}
	},
	fetchPostByUserId: async ({ user, userId, page, size }) => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await Api.get(`${BASE_URL}/v1/post/${userId}/page-posts?page=${page}&size=${size}`, config);
			return res.data.result;
		} catch (error) {
			throw new Error(error?.response ? error.response.data.message : error.message);
		}
	},
	fetchShareByUserId: async ({ user, userId, page, size }) => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await Api.get(`${BASE_URL}/v1/share/${userId}/page-shares?page=${page}&size=${size}`, config);
			return res.data.result;
		} catch (error) {
			throw new Error(error?.response ? error.response.data.message : error.message);
		}
	},
	getPostInAllGroup: async ({ user, page, size }) => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await Api.get(`${BASE_URL}/v1/groupPost/posts?page=${page}&size=${size}`, config);
			return res.data.result;
		} catch (error) {
			throw new Error(error?.response ? error.response.data.message : error.message);
		}
	},
	getShareInAllGroup: async ({ user, page, size }) => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await Api.get(`${BASE_URL}/v1/share/inGroup?page=${page}&size=${size}`, config);
			return res.data.result;
		} catch (error) {
			throw new Error(error?.response ? error.response.data.message : error.message);
		}
	},
	getPostUserInProfile: async (user, userId, page, size) => {
		console.log('user', user);
		console.log('userId', userId);
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			console.log('userId', userId);
			const res = await Api.get(`${BASE_URL}/v1/post/user/${userId}?page=${page}&size=${size}`, config);
			console.log('res', res);
			return res.data.result;
		} catch (error) {
			throw new Error(error?.response ? error.response.data.message : error.message);
		}
	},
	getShareUserInProfile: async (user, userId, page, size) => {
		console.log('user', user);
		console.log('userId', userId);
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.accessToken}`,
				},
			};

			const res = await Api.get(`${BASE_URL}/v1/share/${userId}/post?page=${page}&size=${size}`, config);
			console.log('res', res);
			return res.data.result;
		} catch (error) {
			throw new Error(error?.response ? error.response.data.message : error.message);
		}
	},
};
export default PostApi;
