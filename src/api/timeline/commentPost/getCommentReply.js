import axios from 'axios';
import { BASE_URL } from '../../../context/apiCall';

// get comments reply
const GetCommentReplyApi = {
    getCommentReply: async (commentId) => {
        const res = await axios.get(`${BASE_URL}/v1/post/comment/${commentId}/commentReply`);
        return res.data.result;  
    }   
}

export default GetCommentReplyApi;
