import axios from 'axios';
import { BASE_URL } from '../../context/apiCall';
const PostGroupApi = {
	listAllGroup: async (user) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user?.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/groupPost/list/all`, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data;
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	listOwnerGroup: async (user) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/groupPost/list/owner`, config);
			if (res.data.success) {
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	listJoinGroup: async (user) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/groupPost/list/join`, config);
			if (res.data.success) {
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	listSuggestGroup: async (user) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/groupPost/list/suggestion`, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	listInviteGroup: async (user) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/groupPost/list/invited`, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	createGroup: async ({ user, data }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.post(`${BASE_URL}/v1/groupPost/create`, data, config);
			if (res.data.success) {
				return res; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	updateBioGroup: async ({ user, data }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.put(`${BASE_URL}/v1/groupPost/update/bio`, data, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	updatePhotoGroup: async ({ data, user }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.put(`${BASE_URL}/v1/groupPost/update/photo`, data, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	deteleGroup: async ({ postId, user }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.put(`${BASE_URL}/v1/groupPost/delete/${postId}`, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	acceptInviteGroup: async ({ postId, user }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.post(`${BASE_URL}/v1/groupPost/accept/${postId}`, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	declineInviteGroup: async ({ postId, user }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.post(`${BASE_URL}/v1/groupPost/decline/${postId}`, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	InviteFriendInGroup: async ({ user, data }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.post(`${BASE_URL}/v1/groupPost/invite`, data, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	acceptMemberGroup: async ({ user, data }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.post(`${BASE_URL}/v1/groupPost/acceptMember`, data, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getGroup: async ({ user, postId }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/groupPost/get/${postId}`, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	joinGroup: async ({ user, postId }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.post(`${BASE_URL}/v1/groupPost/joinGroup/${postId}`, {}, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	listMemberGroup: async ({ user, postId }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/groupPost/list/member/${postId}`, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	listMemberRequiredGroup: async ({ user, postId }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/groupPost/list/memberRequired/${postId}`, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	appointAdminGroup: async ({ user, data }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.post(`${BASE_URL}/v1/groupPost/appoint-admin`, data, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	deleteMember: async ({ user, data }) => {
		console.log('Data', data);
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.post(`${BASE_URL}/v1/groupPost/delete/member`, data, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	declineMemberRequired: async ({ user, data }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.post(`${BASE_URL}/v1/groupPost/decline/memberRequired`, data, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
  cancelJoinGroupRequest: async ({ token, postGroupRequestId }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: Bearer ${token},
				},
			};
			const res = await axios.put(${BASE_URL}/v1/groupPost/request/cancel/${postGroupRequestId},{}, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	acceptJoinGroupRequest: async ({ token, postGroupId }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: Bearer ${token},
				},
			};
			const res = await axios.post(${BASE_URL}/v1/groupPost/accept/${postGroupId}, {}, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	declineJoinGroupRequest: async ({ token, postGroupId }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: Bearer ${token},
				},
			};
			const res = await axios.post(${BASE_URL}/v1/groupPost/decline/${postGroupId}, {}, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
	leaveGroup: async ({ token, postGroupId }) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: Bearer ${token},
				},
			};
			const res = await axios.put(${BASE_URL}/v1/groupPost/leaveGroup/${postGroupId},{}, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
};
export default PostGroupApi;
