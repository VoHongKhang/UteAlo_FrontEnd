import axios from 'axios';
import { BASE_URL } from '../../../context/apiCall';

//create comment
const CreateCommentApi = {
    createComment: async (content, photo, postId, token,) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        await axios
            .post(`${BASE_URL}/v1/post/comment/create`, { content, photo, postId }, config)
            .then((res) => {
                if (res.data.success) {
                    return res;
                } else {
                    throw new Error(res.data.message);
                }
            })
            .catch((err) => {
                throw new Error(err.response.data.message);
            });
    }
}
export default CreateCommentApi;