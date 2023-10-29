import { toast } from 'react-hot-toast';
import GetFriendApi from '../../api/profile/friend/getFriendApi.js';
import PostGroupApi from '../../api/postGroups/PostGroupApi.js';

const userAction = ({ currentUser, user, action }) => {
	console.log('action', action);
	const handleRequestFriend = async ({ currentUser, user }) => {
		const toastId = toast.loading('Đang gửi lời mời kết bạn...');

		try {
			await GetFriendApi.sendFriendRequest({ token: currentUser.accessToken, userId: user.userId });
			toast.success('Gửi lời mời kết bạn thành công!', { id: toastId });
		} catch (error) {
			toast.error(error.message || error.toString(), { id: toastId });
		}
	};

	const handleUnfriend = async ({ currentUser, user }) => {
		const toastId = toast.loading('Đang hủy kết bạn...');

		try {
			await GetFriendApi.unFriend({ token: currentUser.accessToken, userId: user.userId });
			toast.success('Hủy kết bạn thành công!', { id: toastId });
		} catch (error) {
			toast.error(error.message || error.toString(), { id: toastId });
		}
	};

	const handleChat = async ({ currentUser, user }) => {
		console.log('handleChat', user);
		const toastId = toast.loading('Đang chuyển hướng đến trang nhắn tin...');

		try {
			//const created = await createConversationApi({ members: [{ user: user._id }] });
			//await router.push(`/messages?id=${created._id}`);

			toast.dismiss(toastId);
		} catch (error) {
			toast('Có lỗi xảy ra, vui lòng thử lại sau', { id: toastId });
		}
	};

	const handleAcceptFriend = async ({ currentUser, user }) => {
		const toastId = toast.loading('Đang xác nhận lời mời kết bạn...');

		try {
			await GetFriendApi.acceptFriendRequest({ token: currentUser.accessToken, userId: user.userId });
			toast.success('Xác nhận lời mời kết bạn thành công! Bạn bè với nhau rồi đó!', { id: toastId });
		} catch (error) {
			toast.error(error.message || error.toString(), { id: toastId });
		}
	};

	const handleRejectFriend = async ({ currentUser, user }) => {
		const toastId = toast.loading('Đang từ chối lời mời kết bạn...');

		try {
			await GetFriendApi.rejectFriendRequest({ token: currentUser.accessToken, userId: user.userId });
			toast.success('Từ chối lời mời kết bạn thành công!', { id: toastId });
		} catch (error) {
			toast.error(error.message || error.toString(), { id: toastId });
		}
	};

	const handleCancelRequestFriend = async ({ currentUser, user }) => {
		const toastId = toast.loading('Đang hủy lời mời kết bạn...');
		try {
			await GetFriendApi.cancelFriendRequest({ token: currentUser.accessToken, userId: user.userId });
			toast.success('Hủy lời mời kết bạn thành công!', { id: toastId });
		} catch (error) {
			toast.error(error.message || error.toString(), { id: toastId });
		}
	};

	// Hủy lời mời tham gia nhóm
	const handleCancelJoinGroup = async ({ currentUser, user }) => {
		const toastId = toast.loading('Đang hủy lời mời kết bạn...');
		try {
			await PostGroupApi.cancelJoinGroupRequest({ token: currentUser.accessToken, postGroupRequestId: user.postGroupRequestId });
			toast.success('Hủy lời mời kết bạn thành công!', { id: toastId });
		} catch (error) {
			toast.error(error.message || error.toString(), { id: toastId });
		}
	};

	// Chấp nhận lời mời tham gia nhóm
	const handleAcceptJoinGroup = async ({ currentUser, user }) => {
		const toastId = toast.loading('Đang chấp nhận lời mời tham gia...');
		try {
			await PostGroupApi.acceptJoinGroupRequest({ token: currentUser.accessToken, postGroupId: user.postGroupId });
			toast.success('Đang chấp nhận lời mời kết bạn thành công!', { id: toastId });
		} catch (error) {
			toast.error(error.message || error.toString(), { id: toastId });
		}
	};

	// Từ chối lời mời tham gia nhóm
	const handleDeclineJoinGroup = async ({ currentUser, user }) => {
		const toastId = toast.loading('Đang hủy lời mời kết bạn...');
		try {
			await PostGroupApi.declineJoinGroupRequest({ token: currentUser.accessToken, postGroupId: user.postGroupId });
			toast.success('Hủy lời mời kết bạn thành công!', { id: toastId });
		} catch (error) {
			toast.error(error.message || error.toString(), { id: toastId });
		}
	};

	switch (action) {
		case 'unfriend':
			return handleUnfriend({ currentUser, user });
		case 'cancel':
			return handleCancelRequestFriend({ currentUser, user });
		case 'accept':
			return handleAcceptFriend({ currentUser, user });
		case 'decline':
			return handleRejectFriend({ currentUser, user });
		case 'add':
			return handleRequestFriend({ currentUser, user });
		case 'acceptJoinGroup':
			return handleAcceptJoinGroup({ currentUser, user });
		case 'declineJoinGroup':
			return handleDeclineJoinGroup({ currentUser, user });
		case 'cancelJoinGroup':
			return handleCancelJoinGroup({ currentUser, user });
		default:
			return null;
	}
};
export default userAction;
