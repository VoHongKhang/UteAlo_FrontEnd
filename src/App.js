import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './components/auth/Login/Login';
import Register from './components/auth/register/Register';
import ProtectedRoute from './routes/ProtectedRoute';
import Timeline from './components/timeline/Timeline';
import Profile from './components/profile/Profile';
import EditProfile from './components/editProfile/EditProfile';
import RefreshToken from './components/auth/RefreshToken';
import { Toaster } from 'react-hot-toast';
import ForgotPassword from './components/auth/ForgotPassword/ForgotPassword';
import AuthEmail from './components/auth/AuthEmail/AuthEmail';
import ResetPassord from './components/auth/ResetPassword/ResetPassword';
import FriendRequest from './components/friend/friendRequest/FriendRequest';
import Meessage from './components/messages/Message';
import Groups from './components/groups/Group';
import CreateGroup from './components/groups/createGroup/CreateGroup';
function App() {
	RefreshToken();
	return (
		<>
			<Toaster />
			<Router>
				<Switch>
					<Route excat path="/login">
						<Login />
					</Route>
					<Route excat path="/forgot-password">
						<ForgotPassword />
					</Route>
					<Route excat path="/auth-email">
						<AuthEmail />
					</Route>
					<Route excat path="/reset-password">
						<ResetPassord />
					</Route>
					<Route excat path="/friends/request">
						<FriendRequest />
					</Route>
					<Route excat path="/register">
						<Register />
					</Route>
					<Route excat path="/groups/create">
						<CreateGroup />
					</Route>
					<Route excat path="/groups">
						<Groups />
					</Route>
					
					<ProtectedRoute excat path="/profile/:userId" component={Profile}></ProtectedRoute>
					<ProtectedRoute excat path="/update/:userId" component={EditProfile}></ProtectedRoute>
					<ProtectedRoute excat path="/" component={Timeline}></ProtectedRoute>
					<ProtectedRoute excat path="/message/:userId" component={Meessage}></ProtectedRoute>
				</Switch>
			</Router>
		</>
	);
}

export default App;
