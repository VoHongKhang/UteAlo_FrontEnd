import PostGroupApi	from '../../api/postGroups/PostGroupApi';

const getPostGroupApi = async ({ user, api }) => {
	switch (api) {
		case 'request':
			return await PostGroupApi.listIsInvitedGroup(user);
		case 'sent':
			return await PostGroupApi.listInvitedGroup(user);
		default:
			return await PostGroupApi.listAllGroup(user);
	}
};
export default getPostGroupApi;
