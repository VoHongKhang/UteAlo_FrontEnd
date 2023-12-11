import axios from 'axios';
import { BASE_URL } from '../../../context/apiCall';

// like or unlike post
const LikeOrUnlikeApi = {
	likeOrUnlike: async (postId, token, userId) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};
			const res = await axios.post(`${BASE_URL}/v1/post/like/toggleLike/${postId}`, { userId }, config);
			return res;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
};
export default LikeOrUnlikeApi;
