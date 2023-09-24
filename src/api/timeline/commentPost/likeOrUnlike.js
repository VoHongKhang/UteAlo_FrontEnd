import axios from 'axios';
import { BASE_URL } from '../../../context/apiCall';

// like or unlike post
const LikeOrUnlikeApi = {
    likeOrUnlike: async (postId, token,userId) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        await axios
            .post(`${BASE_URL}/v1/post/like/toggleLike/${postId}`,{userId}, config)
            .then((res) => {
                if (res.data.success) {
                    return res.data;
                } else {
                    throw new Error(res.data.message);
                }
            })
            .catch((err) => {
                throw new Error(err.response.data.message);
            });
    }

}
export default LikeOrUnlikeApi;