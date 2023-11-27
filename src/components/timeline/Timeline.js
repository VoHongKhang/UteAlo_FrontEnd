import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';
import useAuth from '../../context/auth/AuthContext';
import Feed from './feed/Feed';
import Sidebar from './sidebar/Sidebar';
import Topbar from './topbar/Topbar';
import Rightbar from './rightbar/Rightbar';
const Timeline = () => {
	const { user: currentUser } = useAuth();
	const [inforUser, setInforUser] = useState();
	const getUser = (data) => {
		setInforUser(data);
	};
	
	return (
		<>
			<Helmet title="UTEALO" />
			<Toaster />
			<Topbar dataUser={getUser} />
			<div className="homeContainer">
				{inforUser && (
					<>
						<Sidebar />
						<Feed inforUser={inforUser} />
						<Rightbar user={currentUser} />
					</>
				)}
			</div>
		</>
	);
};

export default Timeline;
