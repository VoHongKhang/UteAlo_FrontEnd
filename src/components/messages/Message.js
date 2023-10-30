import { useState } from 'react';
import useAuth from '../../context/auth/AuthContext';
import ChatRoom from './ChatRoom';
import RightbarChat from './RightbarChat';
import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';
import Topbar from '../timeline/topbar/Topbar';
import SidebarChat from './SidebarChat'
const Meessage = () => {
	const { user: currentUser } = useAuth();
	const { postGroup, setPostGroup } = useState();
	const onChangeMessage = (group) => {
		setPostGroup(group);
	};
	return (
		<>
			<Helmet title={`Tin nhắn |UTEALO`} />
			<Toaster />
			<Topbar />
			<div className="homeContainer">
				<SidebarChat user={currentUser} onChangeMessage={onChangeMessage} />
				<ChatRoom user={currentUser} groupId={postGroup} />
				<RightbarChat groupId={postGroup} />
			</div>
		</>
	);
};
export default Meessage;
