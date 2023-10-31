import GetFriendApi from '../profile/friend/getFriendApi';

const FriendApi = async ({ user, api }) => {
	switch (api) {
		case 'request':
			return await GetFriendApi.getListFriendRequest(user);
		case 'sent':
			return await GetFriendApi.getSendFriendRequest(user);
		case 'suggest':
			return await GetFriendApi.getSuggestionFriend(user);
		default:
			return await GetFriendApi.getFriend(user);
	}
};
export default FriendApi;
