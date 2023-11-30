import React, { useState } from 'react';
import Topbar from '../timeline/topbar/Topbar';
import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';
import NewFeedGroup from './NewFeedGroup';
import SidebarGroup from './sidebar/SidebarGroup';
import useAuth from '../../context/auth/AuthContext';
const TimeLineGroup = () => {
	const { user: currentUser } = useAuth();
	const [infoUser, setInfoUser] = useState(null);
	const getInforUser = (data) => {
		setInfoUser(data);
	};
	return (
		<>
			<Helmet title="UTEALO" />
			<Toaster />
			<Topbar dataUser={getInforUser} />
			<div className="homeContainer">
				<SidebarGroup user={currentUser} />
				<NewFeedGroup inforUser={infoUser} currentUser={currentUser} />
			</div>
		</>
	);
};
export default TimeLineGroup;
