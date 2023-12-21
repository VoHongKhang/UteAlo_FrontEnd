import { BASE_URL } from '../../../context/apiCall';
import Api from '../../Api';

// get comments reply
const GetCommentReplyApi = {
    getCommentReply: async (commentId) => {
        const res = await Api.get(`${BASE_URL}/v1/post/comment/${commentId}/commentReply`);
        return res.data.result;  
    }   
}

export default GetCommentReplyApi;
