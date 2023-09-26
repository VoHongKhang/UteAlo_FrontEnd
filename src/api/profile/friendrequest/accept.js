import axios from 'axios';
import { BASE_URL } from '../../../context/apiCall';

// accept friend request
const AcceptFriendRequestApi = {
    acceptFriendRequest: async (token, userId) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        await axios
            .put(`${BASE_URL}/v1/friend/request/accept/${userId}`,{}, config)
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
export default AcceptFriendRequestApi;