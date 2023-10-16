import axios from 'axios';
import { BASE_URL } from '../../../context/apiCall';

// get comments share post
const GetCommentSharePostApi = {
    getCommentSharePost: async (shareId) => {
        const res = await axios.get(`${BASE_URL}/v1/share/comment/${shareId}`);
        return res.data.result;
    }   
}

export default GetCommentSharePostApi;
