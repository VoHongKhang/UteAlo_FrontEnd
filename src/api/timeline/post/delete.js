import axios from 'axios';
import { BASE_URL } from '../../../context/apiCall';

// delete post
const DeletePostApi = {
    deletePost: async (postId, token) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        await axios
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