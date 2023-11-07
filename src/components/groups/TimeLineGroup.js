import React, { useState } from 'react';
import Topbar from '../timeline/topbar/Topbar';
import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';
import useAuth from '../../context/auth/AuthContext';
import NewFeedGroup from './NewFeedGroup';
import SidebarGroup from './sidebar/SidebarGroup';
const TimeLineGroup = () => {
	const { user: currentUser } = useAuth();
	return (
		<>
			<Helmet title="UTEALO" />
			<Toaster />
			<Topbar />
			<div className="homeContainer">
				<SidebarGroup user={currentUser}/>
				<NewFeedGroup user={currentUser}/>
			</div>
		</>
	);
};
export default TimeLineGroup;
