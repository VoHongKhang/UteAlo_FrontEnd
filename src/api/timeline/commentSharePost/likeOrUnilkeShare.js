import { BASE_URL } from '../../../context/apiCall';
import Api from '../../Api';

// like or unlike post
const LikeOrUnlikeApi = {
    likeOrUnlike: async (shareId, token,userId) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        await Api
            .post(`${BASE_URL}/v1/share/like/toggleLike/${shareId}`,{userId}, config)
            .then((res) => {
                if (res.data.success) {
                    return res.data;
                } else {
                    throw new Error(res.data.message);
                }
            })
            .catch((err) => {
                throw new Error(err.response ? err.response.data.message : err.message);
            });
    }

}
export default LikeOrUnlikeApi;