import { createContext, useContext, useReducer } from 'react';
import toast from 'react-hot-toast';
import useAuth from '../auth/AuthContext';
import postReducer, { initialPostState } from './postReducer';
import axios from 'axios';
import { BASE_URL } from '../apiCall';
import { errorOptions } from '../../components/utils/toastStyle';
import PostApi from '../../api/timeline/post/PostApi';

const PostContext = createContext(initialPostState);

export const PostProvider = ({ children }) => {
	const [state, dispatch] = useReducer(postReducer, initialPostState);

	const { user } = useAuth();

	const createPost = async (location, content, photos, files, privacyLevel, postGroupId) => {
		const toastId = toast.loading('Đang gửi yêu cầu...');
		try {
			dispatch({
				type: 'CREATE_POST_REQUEST',
			});

			const formData = new FormData();
			formData.append('location', location || '');
			formData.append('content', content || '');
			formData.append('postGroupId', postGroupId || 0);
			formData.append('privacyLevel', privacyLevel || 'PUBLIC');
			if (files) {
				formData.append('files', files);
			}
			if (photos) {
				formData.append('photos', photos);
			}
			const config = {
				headers: {
					Authorization: `Bearer ${user.accessToken}`,
					'Content-Type': 'multipart/form-data',
				},
			};

			const { data } = await axios.post(`${BASE_URL}/v1/post/create`, formData, config);

			dispatch({
				type: 'CREATE_POST_SUCCESS',
				payload: data,
			});
			if (privacyLevel === 'CONTRIBUTE' || privacyLevel === 'BUG') {
				toast.success('Gửi đóng góp thành công', { id: toastId });
			} else {
				toast.success('Đăng bài thành công', { id: toastId });
			}
			return data;
		} catch (error) {
			dispatch({
				type: 'CREATE_POST_FAIL',
				payload: error.response ? error.response.data.message : error.message,
			});
			toast.error('Có lỗi trong quá trình thực hiện.Vui lòng thử lại', { id: toastId });
		}
	};

	const createReport = async (location, content, photos, files, privacyLevel, postGroupId) => {
		const toastId = toast.loading('Đang gửi yêu cầu...');
		try {
			dispatch({
				type: 'CREATE_POST_REQUEST',
			});

			const formData = new FormData();
			formData.append('location', location || '');
			formData.append('content', content || '');
			formData.append('postGroupId', postGroupId || 0);
			formData.append('privacyLevel', privacyLevel || 'PUBLIC');
			if (files) {
				formData.append('files', files);
			}
			if (photos) {
				formData.append('photos', photos);
			}
			const config = {
				headers: {
					Authorization: `Bearer ${user.accessToken}`,
					'Content-Type': 'multipart/form-data',
				},
			};

			const { data } = await axios.post(`${BASE_URL}/v1/report/create`, formData, config);

			dispatch({
				type: 'CREATE_POST_SUCCESS',
				payload: data,
			});
			if (privacyLevel === 'CONTRIBUTE' || privacyLevel === 'BUG') {
				toast.success('Gửi đóng góp thành công', { id: toastId });
			} else {
				toast.success('Đăng bài thành công', { id: toastId });
			}
			return data;
		} catch (error) {
			dispatch({
				type: 'CREATE_POST_FAIL',
				payload: error.response ? error.response.data.message : error.message,
			});
			toast.error('Có lỗi trong quá trình thực hiện.Vui lòng thử lại', { id: toastId });
		}
	};

	// Chia sẻ bài post
	const sharePost = async (e) => {
		if (e.privacyLevel === '') e.privacyLevel = 'PUBLIC';
		const toastId = toast.loading('Đang gửi yêu cầu...');
		try {
			dispatch({
				type: 'CREATE_POST_REQUEST',
			});
			const config = {
				headers: {
					Authorization: `Bearer ${user.accessToken}`,
					'Content-Type': 'application/json',
				},
			};

			const { data } = await axios.post(`${BASE_URL}/v1/share/create`, e, config);

			dispatch({
				type: 'CREATE_POST_SUCCESS',
				payload: data,
			});
			toast.success('Chia sẻ bài thành công', { id: toastId });
			return data;
		} catch (error) {
			dispatch({
				type: 'CREATE_POST_FAIL',
				payload: error.response ? error.response.data.message : error.message,
			});
			toast.error(error.response ? error.response.data.message : error.message, { id: toastId });
		}
	};

	// get posts req
	const getTimelinePosts = async () => {
		try {
			dispatch({
				type: 'FETCH_POSTS_REQUEST',
			});

			const res = await PostApi.fetchPostsGroup(user, 1, 20);
			dispatch({
				type: 'FETCH_POSTS_SUCCESS',
				payload: res,
			});
		} catch (error) {
			dispatch({
				type: 'FETCH_POSTS_FAIL',
				payload: error?.response ? error.response.data.message : error.message,
			});
			toast.error(error?.response ? error.response.data.message : error.message, errorOptions);
		}
	};

	const value = {
		post: state.post,
		timelinePosts: state.timelinePosts,
		loading: state.loading,
		createLoading: state.createLoading,
		error: state.error,
		createPost,
		sharePost,
		createReport,
		getTimelinePosts,
	};

	return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

const usePost = () => {
	const context = useContext(PostContext);

	if (context === undefined) {
		throw new Error('usePost must be used within PostContext');
	}
	return context;
};

export default usePost;
