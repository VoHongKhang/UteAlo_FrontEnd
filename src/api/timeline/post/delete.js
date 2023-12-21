import { BASE_URL } from '../../../context/apiCall';
import Api from '../../Api';

// delete post
const DeletePostApi = {
    deletePost: async (postId, token) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        await Api
            .delete(`${BASE_URL}/v1/post/delete/${postId}`, config)
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
export default DeletePostApi;