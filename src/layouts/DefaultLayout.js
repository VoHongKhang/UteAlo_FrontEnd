import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';
import '../styles/global.css';
import useAuth from '../context/auth/AuthContext';
const DefaultLayout = ({ Title, Topbar, SideBar, RightBar, Page }) => {
	const { user: currentUser } = useAuth();
	const [inforUser, setInforUser] = useState();
	const getUser = (data) => {
		setInforUser(data);
	};

	return (
		<>
			<Helmet title={Title} />
			<Toaster />
			{Topbar && <Topbar dataUser={getUser} />}
			{SideBar ? (
				<div className="homeContainer">
					{SideBar && <SideBar user={currentUser} inforUser={inforUser ? inforUser : null} />}
					{Page && <Page inforUser={inforUser ? inforUser : null} currentUser={currentUser} />}
					{RightBar && <RightBar user={currentUser} inforUser={inforUser ? inforUser : null} />}
				</div>
			) : (
				<Page inforUser={inforUser ? inforUser : null} currentUser={currentUser} />
			)}
		</>
	);
};
export default DefaultLayout;
