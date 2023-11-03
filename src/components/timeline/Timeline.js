import axios from 'axios';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../context/apiCall';
import useAuth from '../../context/auth/AuthContext';
import Feed from './feed/Feed';
import SearchUser from './searchUser/SearchUser';
import Sidebar from './sidebar/Sidebar';
import Topbar from './topbar/Topbar';
import Rightbar from './rightbar/Rightbar';
const Timeline = () => {
	const [searchFriends, setSearchFriends] = useState([]);
	const [searchKey, setSearchKey] = useState('');
	const { user: currentUser } = useAuth();
	const navigate = useNavigate();
	const [toggle, setToggle] = useState(false);
	// logout user and redirect to login page
	const logoutHandler = () => {
		localStorage.removeItem('userInfo');
		navigate('/login');
	};

	// Toggle menu
	const menuHandler = () => {
		setToggle(!toggle);
	};

	// search user request
	const searchHandler = async () => {
		console.log('searchKey', searchKey);
		const res = await axios.get(`${BASE_URL}/v1/groupPost/getPostGroups/key?search=${searchKey}`);
		setSearchFriends(res.data);
		setSearchKey('');
	};
	
	return (
		<>
			<Helmet title="UTEALO" />
			<Toaster />
			<Topbar
				searchHandler={searchHandler}
				setSearchKey={setSearchKey}
				searchKey={searchKey}
				menuHandler={menuHandler}
			/>
			{toggle && (
				<div className="sidebar-resp">
					<div className="searchbar">
						<input
							type="text"
							placeholder="Tìm kiếm trên UteAlo"
							className="searchInput "
							value={searchKey}
							onChange={(e) => setSearchKey(e.target.value)}
						/>
					</div>
					<button style={{ margin: '0.6rem' }} className="shareButton" onClick={searchHandler}>
						Tìm kiếm trên UteAlo
					</button>
					<h4 className="rightbarTitle sb">Kết quả tìm kiếm</h4>
					<ul className="rightbarFriendList">
						{searchFriends && searchFriends.map((u) => <SearchUser key={u._id} user={u} />)}
					</ul>
					<button className="sidebarButton" onClick={logoutHandler}>
						Logout
					</button>
					<hr className="sidebarHr" />
				</div>
			)}
			<div className="homeContainer" >
				<Sidebar />
				<Feed />
				<Rightbar user={currentUser} />
			</div>
		</>
	);
};

export default Timeline;
