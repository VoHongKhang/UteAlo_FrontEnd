import axios from 'axios';
import { BASE_URL } from '../../../context/apiCall';

// get comments reply
const GetCommentReplyShareApi = {
    getCommentReply: async (commentId) => {
        const res = await axios.get(`${BASE_URL}/v1/share/comment/${commentId}/commentReply`);
        return res.data.result;  
    }   
}

export default GetCommentReplyShareApi;
