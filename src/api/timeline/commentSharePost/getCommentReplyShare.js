
import { BASE_URL } from '../../../context/apiCall';
import Api from '../../Api';

// get comments reply
const GetCommentReplyShareApi = {
    getCommentReply: async (commentId) => {
        const res = await Api.get(`${BASE_URL}/v1/share/comment/${commentId}/commentReply`);
        return res.data.result;  
    }   
}

export default GetCommentReplyShareApi;
