import axios from 'axios';
import { BASE_URL } from '../../../context/apiCall';

// get list friend request
const GetListFriendRequestApi = {
    getListFriendRequest: async (token) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        await axios
            .get(`${BASE_URL}/v1/friend/request/list`, config)
            .then((res) => {
                
                if (res.data.success) {
                    return res.data.result;
                } else {
                    throw new Error(res.data.message);
                }
            })
            .catch((err) => {
                throw new Error(err.response.data.message);
            });
    }
}
export default GetListFriendRequestApi;