import { BASE_URL } from '../../context/apiCall';
import Api from '../Api';
const ProfileApi = {
	getProfile: async ({ user, userId }) => {
		const config = {
			headers: {
				Authorization: `Bearer ${user.accessToken}`,
			},
		};
		try {
			const res = await Api.get(`${BASE_URL}/v1/user/profile/${userId}`, config);
			if (res.data.success) {
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (err) {
			throw new Error(err.response.data.message);
		}
	},
	getAvatarAndName : async ({userId }) => {
		try {
			const res = await Api.get(`${BASE_URL}/v1/user/avatarAndName/${userId}`);
			if (res.data.success) {
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (err) {
			throw new Error(err.response.data.message);
		}
	}
};
export default ProfileApi;
