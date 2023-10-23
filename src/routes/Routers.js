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
const privateRoutes = [
	{ path: '/', component: Timeline, topbar: Topbar, sidebar: Sidebar, rightbar: Rightbar },
	{ path: '/groups', component: Groups, topbar: Topbar},
	{ path: '/groups/create', component: CreateGroup },
	{ path: '/groups/detail/:uuid', component: GroupDetail },
	{ path: '/profile/:userId', component: Profile, topbar: Topbar },
	{ path: '/profile/update/:userId', component: EditProfile },
	{ path: '/friends', component: FriendRequest },
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
