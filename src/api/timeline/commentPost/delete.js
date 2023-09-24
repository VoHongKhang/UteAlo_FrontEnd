import axios from 'axios';
import { BASE_URL } from '../../../context/apiCall';

//delete comment
const DeleteCommentApi = {
    deleteComment: async (commentId, token) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        await axios
            .put(`${BASE_URL}/v1/post/comment/delete/${commentId}`,{}, config)
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
export default DeleteCommentApi;