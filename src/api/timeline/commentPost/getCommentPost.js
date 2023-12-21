
import { BASE_URL } from '../../../context/apiCall';
import Api from '../../Api';

// get comments post
const GetCommentPostApi = {
    getCommentPost: async (postId) => {
        const res = await Api.get(`${BASE_URL}/v1/post/comment/${postId}`);
        return res.data.result;
    }   
}

export default GetCommentPostApi;
