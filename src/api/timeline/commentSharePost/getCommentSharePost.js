
import { BASE_URL } from '../../../context/apiCall';
import Api from '../../Api';

// get comments share post
const GetCommentSharePostApi = {
    getCommentSharePost: async (shareId) => {
        const res = await Api.get(`${BASE_URL}/v1/share/comment/${shareId}`);
        return res.data.result;
    }   
}

export default GetCommentSharePostApi;
