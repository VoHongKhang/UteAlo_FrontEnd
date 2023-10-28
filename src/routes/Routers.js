import Login from '../components/auth/Login/Login';
import Register from '../components/auth/register/Register';
import Timeline from '../components/timeline/Timeline';
import Profile from '../components/profile/Profile';
import EditProfile from '../components/editProfile/EditProfile';
import ForgotPassword from '../components/auth/ForgotPassword/ForgotPassword';
import AuthEmail from '../components/auth/AuthEmail/AuthEmail';
import ResetPassord from '../components/auth/ResetPassword/ResetPassword';
import FriendRequest from '../components/friend/friendRequest/FriendRequest';
import Groups from '../components/groups/Group';
import CreateGroup from '../components/groups/createGroup/CreateGroup';
import GroupDetail from '../components/groups/detail/GroupDetail';
import NotFound from '../components/NotFound';
import Topbar from '../components/timeline/topbar/Topbar';
import Sidebar from '../components/timeline/sidebar/Sidebar';
import Rightbar from '../components/timeline/rightbar/Rightbar';
import ManagerGroup from '../components/groups/manager/ManagerGroup';
import SettingManagerGroup from '../components/groups/manager/SettingManagerGroup';
import MemberGroup from '../components/groups/manager/MemberGroup';
const privateRoutes = [
	{ path: '/profile/update/:userId', component: EditProfile },
	{ path: '/groups/manager/:postGroupId', component: ManagerGroup },
	{ path: '/groups/create', component: CreateGroup },
	{ path: '/groups/:postGroupId', component: GroupDetail },
	{ path: '/groups', component: Groups, topbar: Topbar },
	{ path: '/profile/:userId', component: Profile, topbar: Topbar },
	{ path: '/friends', component: FriendRequest },
	{ path: '/update/:userId', component: EditProfile },
	{ path: '/', component: Timeline, topbar: Topbar, sidebar: Sidebar, rightbar: Rightbar },
	{ path: '/:url', component: Timeline },
	{ path: '/groups/manager/:postGroupId/edit', component: SettingManagerGroup },
	{ path: '/groups/manager/:postGroupId/member', component: MemberGroup },
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
