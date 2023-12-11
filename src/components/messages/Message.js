import { useState } from 'react';
import useAuth from '../../context/auth/AuthContext';
import ChatRoom from './ChatRoom';
import RightbarChat from './RightbarChat';
import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';
import Topbar from '../timeline/topbar/Topbar';
import SidebarChat from './SidebarChat';
import useTheme from '../../context/ThemeContext';
import { useParams } from 'react-router-dom';
const Meessage = () => {
	const [user, setUser] = useState();
	const params = useParams();
	const { user: currentUser } = useAuth();
	const [postGroup, setPostGroup] = useState({
		isGroup: false,
		id: params?.userId,
	});
	const [data, setData] = useState({});
	const [isShowRightbar, setIsShowRightbar] = useState(true);
	const onChangeMessage = (group) => {
		setPostGroup(group);
	};
	const dataChatRoom = (data) => {
		setData(data);
	};
	const isShowInfo = (info) => {
		setIsShowRightbar(info);
	};
	const getUser = (data) => {
		setUser(data);
	};
	const { theme } = useTheme();

	return (
		<div style={{ color: theme.foreground, background: theme.background }}>
			<Helmet title={`Tin nhắn |UTEALO`} />
			<div className="homeContainer">
				<SidebarChat user={currentUser} onChangeMessage={onChangeMessage} />
				<ChatRoom user={user} data={data} Toggeinfo={isShowInfo} currentUser={currentUser} />

				<RightbarChat
					user={currentUser}
					group={postGroup}
					currentData={dataChatRoom}
					showRightbar={isShowRightbar}
				/>
			</div>
		</div>
	);
};
export default Meessage;
