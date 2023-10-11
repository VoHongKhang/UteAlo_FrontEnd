import GetFriendApi from '../profile/friend/getFriendApi';

const FriendApi = async ({ currentUser, api }) => {
	switch (api) {
		case 'request':
			return await GetFriendApi.getListFriendRequest({ user: currentUser});
		case 'sent':
			return await GetFriendApi.getSendFriendRequest({ user: currentUser});
		case 'suggest':
			return await GetFriendApi.getSuggestionFriend({ user: currentUser });
		default:
			return await GetFriendApi.getFriend({ user: currentUser });
	}
};
export default FriendApi;
