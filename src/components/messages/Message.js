import { useState } from 'react';
import useAuth from '../../context/auth/AuthContext';
import ChatRoom from './tempt';
import RightbarChat from './RightbarChat';
import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';
import Topbar from '../timeline/topbar/Topbar';
import SidebarChat from './SidebarChat';
const Meessage = () => {
	const [user, setUser] = useState();
	const { user: currentUser } = useAuth();
	const [postGroup, setPostGroup] = useState({
		isGroup: false,
		id: '',
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
	return (
		<>
			<Helmet title={`Tin nhắn |UTEALO`} />
			<Toaster />
			<Topbar dataUser={getUser} />
			<div className="homeContainer">
				<SidebarChat user={currentUser} onChangeMessage={onChangeMessage} />
				<ChatRoom user={user} data={data} Toggeinfo={isShowInfo} />
				<RightbarChat user={currentUser} group={postGroup} currentData={dataChatRoom} showRightbar={isShowRightbar} />
			</div>
		</>
	);
};
export default Meessage;
