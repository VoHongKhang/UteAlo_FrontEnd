import GetFriendApi from '../profile/friend/getFriendApi';

const FriendApi = async ({ currentUser, api, limit, page }) => {
	switch (api) {
		case 'request':
			return await GetFriendApi.getListFriendRequest({ user: currentUser, limit: limit, page: page });
		case 'sent':
			return await GetFriendApi.getSendFriendRequest({ user: currentUser, limit: limit, page: page });
		case 'suggest':
			return await GetFriendApi.getSuggestionFriend({ user: currentUser, limit: limit, page: page });
		default:
			return await GetFriendApi.getFriend({ user: currentUser, limit: limit, page: page });
	}
};
export default FriendApi;
