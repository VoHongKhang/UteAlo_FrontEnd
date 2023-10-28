import axios from 'axios';
import { BASE_URL } from '../../../src/context/apiCall';
import toast from 'react-hot-toast';

const InviteFriendApi = {
    inviteFriendApi: async (token, postGroupId, userIds) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        const requestData = {
            postGroupId: postGroupId,
            userId: userIds,
        };

        try {
            const toastId = toast.loading('Đang gửi yêu cầu...');
            const response = await axios.post(`${BASE_URL}/v1/groupPost/invite`, requestData, config);

            if (response.data.success) {
                toast.success('Gửi lời mời thành công', { id: toastId });
                return response.data;        
            } else {
                throw new Error(response.data.message);
            }
            
        } catch (error) {
            throw new Error(error.response.data.message);
        }
    },
};

export default InviteFriendApi;
