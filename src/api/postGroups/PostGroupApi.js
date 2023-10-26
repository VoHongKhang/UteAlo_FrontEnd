import axios from 'axios';
import { BASE_URL } from '../../context/apiCall';
const PostGroupApi = {
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
	createGroup: async ({user, data}) =>{
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
	updateBioGroup: async({user,data}) =>{
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
	updatePhotoGroup: async ({data, user}) =>{
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
	deteleGroup: async ({postId,user}) =>{
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
	acceptInviteGroup: async ({postId, user}) =>{
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
	declineInviteGroup: async ({postId, user}) => {
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
	InviteFriendInGroup: async ({user, data}) =>{
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
	acceptMemberGroup: async ({user,data}) =>{
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`, 
				},
			};
			const res = await axios.post(`${BASE_URL}/v1/groupPost/accept/member`, data, config);
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
	getGroup: async ({user, postId}) =>{
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
	joinGroup: async({user, postId}) =>{
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`, 
				},
			};
			const res = await axios.post(`${BASE_URL}/v1/groupPost/joinGroup/${postId}`,{}, config);
			if (res.data.success) {
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công 
			} else {
				throw new Error(res.data.message);
			} 
		} catch (error) {
			throw new Error(error.message);
		}
	}
	
};
export default PostGroupApi;