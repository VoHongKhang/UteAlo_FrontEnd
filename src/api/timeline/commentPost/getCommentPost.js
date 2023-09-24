import axios from 'axios';
import { BASE_URL } from '../../../context/apiCall';

// get comments post
const GetCommentPostApi = {
    getCommentPost: async (postId) => {
        const res = await axios.get(`${BASE_URL}/v1/post/comment/${postId}`);
        return res.data.result;
    }   
}

export default GetCommentPostApi;
