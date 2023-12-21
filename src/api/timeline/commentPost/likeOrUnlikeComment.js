
import { BASE_URL } from '../../../context/apiCall';
import Api from '../../Api';

// like or unlike post
const LikeOrUnlikeCommentApi = {
    likeOrUnlikeComment: async (commentId, token,userId) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        await Api
            .post(`${BASE_URL}/v1/comment/like/toggleLike/${commentId}`,{userId}, config)
            .then((res) => {
                if (res.data.success) {
                    return res.data;
                } else {
                    throw new Error(res.data.message);
                }
            })
            .catch((err) => {
                throw new Error(err);
            });
    }

}
export default LikeOrUnlikeCommentApi;