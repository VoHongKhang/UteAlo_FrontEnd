import React, { useState } from 'react';
import Topbar from '../timeline/topbar/Topbar';
import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';
import useAuth from '../../context/auth/AuthContext';
import NewFeedGroup from './NewFeedGroup';
import SidebarGroup from './sidebar/SidebarGroup';
const Groups = () => {
	const { user: currentUser } = useAuth();
	const [postGroup, setPostGroup] = useState();
	const handlePostGroupIdChange = (group) =>{
		setPostGroup(group);
	}
	return (
		<>
			<Helmet title="UTEALO" />
			<Toaster />
			<Topbar />
			<div className="homeContainer">
				<SidebarGroup user={currentUser} onPostGroupIdChange={handlePostGroupIdChange}/>
				<NewFeedGroup user={currentUser} postGroup={postGroup}/>
			</div>
		</>
	);
};
export default Groups;
