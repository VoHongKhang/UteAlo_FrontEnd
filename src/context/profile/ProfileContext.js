import { createContext, useContext, useReducer } from 'react';
import toast from 'react-hot-toast';
import useAuth from '../auth/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../apiCall';
import profileReducer, { initialProfileState } from './profileReducer';
import { errorOptions, successOptions } from '../../components/utils/toastStyle';

const ProfileContext = createContext(initialProfileState);

export const ProfileProvider = ({ children }) => {
	const [state, dispatch] = useReducer(profileReducer, initialProfileState);

	const { user: loggedUser } = useAuth();

	// update user req
	const editUser = async ({ fullName, about, address, phone, gender, dateOfBirth }) => {
		console.log('dateOfBirth', dateOfBirth);
		const toastId = toast.loading('Updating profile...');
		try {
			dispatch({
				type: 'UPDATE_USER_REQUEST',
			});
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${loggedUser.accessToken}`,
				},
			};
			const { data } = await axios.put(
				`${BASE_URL}/v1/user/update`,
				{ fullName, about, address, phone, gender, dateOfBirth },
				config
			);
			dispatch({
				type: 'UPDATE_USER_SUCCESS',
				payload: data,
			});

			toast.success('Profile updated successfully', { id: toastId });
			// Sau khi cập nhật thành công, tải lại trang
			return data;
		} catch (error) {
			console.log(error.response.data.message);
			dispatch({
				type: 'UPDATE_USER_FAIL',
				payload: error.response.data.message,
			});
			toast.error(error.response.data.message, { id: toastId });
		}
	};

	// update user avatar req
	const updateUserAvatar = async (imageFile) => {
		const toastId = toast.loading('Đang cập nhật...');
		try {
			dispatch({
				type: 'UPDATE_USER_AVATAR_REQUEST',
			});
			const config = {
				headers: {
					Authorization: `Bearer ${loggedUser.accessToken}`,
				},
			};
			const formData = new FormData();
			formData.append('imageFile', imageFile);

			const { data } = await axios.put(`${BASE_URL}/v1/user/avatar`, formData, config);
			console.log(data);
			dispatch({
				type: 'UPDATE_USER_AVATAR_SUCCESS',
				payload: data.result, // Điều này phụ thuộc vào cách server trả về dữ liệu mới của avatar
			});
			toast.success('Avatar updated successfully', { id: toastId });
			// Sau khi cập nhật thành công, tải lại trang
			return data.result;
		} catch (error) {
			console.log(error.response.data.message);
			dispatch({
				type: 'UPDATE_USER_AVATAR_FAIL',
				payload: error.response.data.message,
			});
			toast.error(error.response.data.message, { id: toastId });
		}
	};

	// update user background req
	const updateUserBackground = async (imageFile) => {
		const toastId = toast.loading('Đang cập nhật...');
		try {
			dispatch({
				type: 'UPDATE_USER_BACKGROUND_REQUEST',
			});
			const config = {
				headers: {
					Authorization: `Bearer ${loggedUser.accessToken}`,
				},
			};
			const formData = new FormData();
			formData.append('imageFile', imageFile);

			const { data } = await axios.put(`${BASE_URL}/v1/user/background`, formData, config);
			console.log(data);
			dispatch({
				type: 'UPDATE_USER_BACKGROUND_SUCCESS',
				payload: data.result, // Điều này phụ thuộc vào cách server trả về dữ liệu mới của avatar
			});
			toast.success('Background updated successfully', { id: toastId });
			// Sau khi cập nhật thành công, tải lại trang
			return data.result;
		} catch (error) {
			console.log(error.response.data.message);
			dispatch({
				type: 'UPDATE_USER_BACKGROUND_FAIL',
				payload: error.response.data.message,
			});
			toast.error(error.response.data.message, { id: toastId });
		}
	};

	// follow user req
	const followUser = async (userId) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${loggedUser.token}`,
				},
			};
			await axios.put(`${BASE_URL}/user/follow`, { userId }, config);
			toast.success('You followed the user', successOptions);
		} catch (error) {
			toast.error(error.response.data.message, errorOptions);
		}
	};

	// unfollow user req
	const unfollowUser = async (userId) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${loggedUser.token}`,
				},
			};
			await axios.put(`${BASE_URL}/user/unfollow`, { userId }, config);
			toast.success('You unfollowed the user', successOptions);
		} catch (error) {
			toast.error(error.response.data.message, errorOptions);
		}
	};

	const value = {
		profile: state.profile,
		loading: state.loading,
		error: state.error,
		success: state.success,
		editUser,
		updateUserAvatar,
		updateUserBackground,
		followUser,
		unfollowUser,
	};

	return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

const useProfile = () => {
	const context = useContext(ProfileContext);

	if (context === undefined) {
		throw new Error('useProfile must be used within ProfileContext');
	}
	return context;
};

export default useProfile;
