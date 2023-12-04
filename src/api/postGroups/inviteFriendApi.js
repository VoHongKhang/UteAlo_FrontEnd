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
		const toastId = toast.loading('Đang gửi yêu cầu...');
		try {
			const response = await axios.post(`${BASE_URL}/v1/groupPost/invite`, requestData, config);

			if (response.data.success) {
				if (response.data.result.length > 0) {
					toast.success(`Người dùng ${response.data.result} không thể gửi lời mời!!!`, { id: toastId });
					return response.data;
				} else {
					toast.success('Gửi lời mời thành công', { id: toastId });
					return response.data;
				}
			} else {
				toast.error(response.data.message, { id: toastId });
				throw new Error(response.data.message);
			}
		} catch (error) {
			toast.error(error.response ? error.response.data.message : error.message, { id: toastId });
			throw new Error(error.response.data.message);
		}
	},
};

export default InviteFriendApi;
