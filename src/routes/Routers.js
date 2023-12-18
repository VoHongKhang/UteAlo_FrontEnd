import Login from '../components/auth/Login/Login';
import Register from '../components/auth/register/Register';
import Profile from '../components/profile/Profile';
import EditProfile from '../components/editProfile/EditProfile';
import ForgotPassword from '../components/auth/ForgotPassword/ForgotPassword';
import AuthEmail from '../components/auth/AuthEmail/AuthEmail';
import ResetPassord from '../components/auth/ResetPassword/ResetPassword';
import FriendRequest from '../components/friend/friendRequest/FriendRequest';
import CreateGroup from '../components/groups/createGroup/CreateGroup';
import GroupDetail from '../components/groups/detail/GroupDetail';
import NotFound from '../components/NotFound';
import Topbar from '../components/timeline/topbar/Topbar';
import Sidebar from '../components/timeline/sidebar/Sidebar';
import Rightbar from '../components/timeline/rightbar/Rightbar';
import ManagerGroup from '../components/groups/manager/ManagerGroup';
import SettingManagerGroup from '../components/groups/manager/SettingManagerGroup';
import MemberGroup from '../components/groups/manager/MemberGroup';
import ParticipantRequests from '../components/groups/manager/ParticipantRequests';
import HelpGroup from '../components/groups/manager/HelpGroup';
import Meessage from '../components/messages/Message';
import DiscoverGroup from '../components/groups/discover/DiscoverGroup';
import SearchGroup from '../components/groups/searchGroup/searchGroup';
import SearchResult from '../components/timeline/searchResult/searchResult';
import PostDetail from '../components/timeline/post/PostDetail';
import Feed from '../components/timeline/feed/Feed';
import SidebarGroup from '../components/groups/sidebar/SidebarGroup';
import NewFeedGroup from '../components/groups/NewFeedGroup';
import SidebarManagerGroup from '../components/groups/manager/sidebarManagerGroup/SidebarManagerGroup';
import ShareDetail from '../components/timeline/sharePost/ShareDetail';
import FileMedia from '../components/groups/detail/FileMedia';

const privateRoutes = [
	{ path: '/groups/manager/:postGroupId', component: ManagerGroup, topbar: Topbar, sidebar: SidebarManagerGroup },
	{ path: '/groups/create', component: CreateGroup, topbar: Topbar },
	{ path: '/groups/discover', component: DiscoverGroup, topbar: Topbar, sidebar: SidebarGroup },
	{ path: '/groups/:postGroupId', component: GroupDetail, topbar: Topbar, sidebar: SidebarGroup },
	{ path: '/groups/searchGroup', component: SearchGroup, topbar: Topbar, sidebar: SidebarGroup },
	{ path: '/groups/searchResult', component: SearchResult, topbar: Topbar },
	{ path: '/groups', component: NewFeedGroup, topbar: Topbar, sidebar: SidebarGroup },
	{ path: '/profile/:userId', component: Profile, topbar: Topbar },
	{ path: '/friends', component: FriendRequest, topbar: Topbar },
	{ path: '/update/:userId', component: EditProfile, topbar: Topbar },
	{ path: '/', component: Feed, topbar: Topbar, sidebar: Sidebar, rightbar: Rightbar },
	{ path: '/:url', component: Feed, topbar: Topbar, sidebar: Sidebar, rightbar: Rightbar },
	{ path: '/post/:postId', component: PostDetail, topbar: Topbar, sidebar: Sidebar, rightbar: Rightbar },
	{ path: '/share/:shareId', component: ShareDetail, topbar: Topbar, sidebar: Sidebar, rightbar: Rightbar },
	{
		path: '/groups/manager/:postGroupId/edit',
		component: SettingManagerGroup,
		topbar: Topbar,
		sidebar: SidebarManagerGroup,
	},
	{
		path: '/groups/manager/:postGroupId/member',
		component: MemberGroup,
		topbar: Topbar,
		sidebar: SidebarManagerGroup,
	},
	{
		path: '/groups/manager/:postGroupId/participant_requests',
		component: ParticipantRequests,
		topbar: Topbar,
		sidebar: SidebarManagerGroup,
	},
	{ path: '/groups/manager/:postGroupId/help', component: HelpGroup, topbar: Topbar, sidebar: SidebarManagerGroup },
	{
		path: '/groups/manager/:postGroupId/analysis',
		component: HelpGroup,
		topbar: Topbar,
		sidebar: SidebarManagerGroup,
	},
	{ path: '/message/:userId', component: Meessage, topbar: Topbar },
	{ path: '/messages', component: Meessage, topbar: Topbar },
	{ path: '/groups/:postGroupId/file-media', component: FileMedia },
];

const publicRoutes = [
	{ path: '/login', component: Login },
	{ path: '/register', component: Register },
	{ path: '/auth-email', component: AuthEmail },
	{ path: '/reset-password/', component: ResetPassord },
	{ path: '/forgot-password/', component: ForgotPassword },
];

const notFoundRoute = { path: '*', component: NotFound };
export { privateRoutes, publicRoutes, notFoundRoute };
