import React, { useState, useEffect } from 'react';
import './Topbar.css';
import axios from 'axios';
import { NightsStay, Search, WbSunny, Home, Group, GroupAdd, Notifications, Message } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import useAuth from '../../../context/auth/AuthContext';
import useTheme, { themes } from '../../../context/ThemeContext';
import noAvatar from '../../../assets/appImages/user.png';
import { BASE_URL } from '../../../context/apiCall';
import { useHistory } from 'react-router-dom';
const Topbar = ({ searchHandler, setSearchKey, searchKey, menuHandler }) => {
	const [user, setUser] = useState();
	const { user: currentUser } = useAuth();
	const { theme, setTheme } = useTheme();
  const history = useHistory();
	// Toggle theme switch
	const themeModeHandler = () => {
		setTheme(theme === themes.light ? themes.dark : themes.light);
		localStorage.setItem('userTheme', theme === themes.light ? 'dark' : 'light');
	};

	// get user details
	useEffect(() => {
		const fetchUsers = async () => {
			const config = {
				headers: {
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/user/profile`, config);
			setUser(res.data.result);
		};
		fetchUsers();
	}, [currentUser.accessToken]);

	const buttonCenterHandler = (e, link) => {
		if (e.tagName === 'svg') e = e.parentNode;
		if (e.tagName === 'path') e = e.parentNode.parentNode;

		const buttons = document.querySelectorAll('.button-center');
		buttons.forEach((button) => {
			button.classList.remove('button-active');
		});
		e.classList.add('button-active');
    // Chuyển trang theo link sử dụng history
    history.push(link);
	};

	return (
		<>
			<div
				className="topbarContainer"
				style={{
					color: theme.topbarColor,
					background: theme.topbarBackground,
				}}
			>
				<div className="topbarLeft">
					<Link to="/" style={{ textDecoration: 'none' }}>
						<span className="topbarLogo">UTEALO</span>
					</Link>
					<div className="searchbar">
						<input
							type="text"
							placeholder="Search....."
							className="searchInput"
							value={searchKey}
							onChange={(e) => setSearchKey(e.target.value)}
						/>
						<span className="searchIcon">
							<Search style={{ cursor: 'pointer' }} onClick={searchHandler} />
						</span>
					</div>
				</div>
				<div className="topbarCenter">
					<div
						className="button-center button-active"
						onClick={(e) => buttonCenterHandler(e.target, '/')}
					>
						<Home className="button-center-home " titleAccess="Trang chủ" />
					</div>
					<div className="button-center" onClick={(e) => buttonCenterHandler(e.target,'/group')}>
						<Group className="button-center-groups" titleAccess="Nhóm" />
					</div>
					<div
						className="button-center"
						onClick={(e) => buttonCenterHandler(e.target,  '/friends')}
					>
						<GroupAdd className="button-center-friends" titleAccess="Bạn bè" />
					</div>
					<div className="button-center" onClick={themeModeHandler}>
						<div className="topbarIconItem button-center-theme" >
							{theme.background === '#ffffff' ? <NightsStay /> : <WbSunny />}
						</div>
					</div>
				</div>

				<div className="topbarRight">
					<div className="button-right">
						<Message className="button-right-message" titleAccess="Tin nhắn" />
					</div>
					<div className="button-right">
						<Notifications className="button-right-notifications" titleAccess="Thông báo" />
					</div>

					<Link to={`/profile/${currentUser.userId}`}>
						<img src={user?.avatar ? user?.avatar : noAvatar} alt="..." className="topbarImg" />
					</Link>
				</div>
			</div>
		</>
	);
};

export default Topbar;
