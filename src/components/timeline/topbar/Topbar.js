import React, { useState, useEffect, useRef } from 'react';
import './Topbar.css';
import axios from 'axios';
import { NightsStay, Search, WbSunny, Home, Group, GroupAdd, Notifications } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import useAuth from '../../../context/auth/AuthContext';
import useTheme, { themes } from '../../../context/ThemeContext';
import { CloseOutlined, ClockCircleOutlined } from '@ant-design/icons';
import noAvatar from '../../../assets/appImages/user.png';
import { BASE_URL } from '../../../context/apiCall';
import { useNavigate } from 'react-router-dom';
import adver4 from '../../../assets/appImages/adver4.jpg';
import { HiChatBubbleOvalLeft } from 'react-icons/hi2';
import { Badge } from 'antd';
import { useWebSocket } from '../../../context/WebSocketContext';

const Topbar = ({ dataUser }) => {
	const [user, setUser] = useState();
	const { user: currentUser } = useAuth();
	const { theme, setTheme } = useTheme();
	const navigate = useNavigate();

	const [searchKey, setSearchKey] = useState('');
	const [searchHistory, setSearchHistory] = useState([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [searchFriends, setSearchFriends] = useState([]);
	const inputRef = useRef(null);
	const [listNotification, setListNotification] = useState([]);

	const { notification } = useWebSocket();
	useEffect(() => {
		console.log('notification', notification);
		if (notification) {
			setListNotification((prev) => [...prev, notification]);
			console.log('listNotification', listNotification);
		}
	}, [notification]);

	// Toggle theme switch
	const themeModeHandler = () => {
		setTheme(theme === themes.light ? themes.dark : themes.light);
		localStorage.setItem('userTheme', theme === themes.light ? 'dark' : 'light');
	};
	const handderMessageClick = () => {
		navigate(`/message/${currentUser.userId}}`);
	};
	const handderNotificationClick = () => {
		navigate(`notification/${currentUser.userId}`);
	};
	// get user details
	useEffect(() => {
		const fetchUsers = async () => {
			const config = {
				headers: {
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/user/profile/${currentUser.userId}`, config);
			setUser(res.data.result);
			dataUser(res.data.result);
		};
		fetchUsers();
	}, [currentUser]);

	const buttonCenterHandler = (e, link) => {
		navigate(link);
	};

	const searchGroupsFromAPI = async (searchKey) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/user/search/key?search=${searchKey}`, config);
			console.log(res.data.result);
			setSearchFriends(res.data.result);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		// Lắng nghe sự kiện click trên toàn bộ trang
		const handleClickOutside = (e) => {
			if (inputRef.current && !inputRef.current.contains(e.target)) {
				setShowDropdown(false);
			}
		};

		// Đăng ký sự kiện khi component được mount
		document.addEventListener('click', handleClickOutside);

		// Hủy đăng ký sự kiện khi component bị unmount
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	const handleSearchInputChange = (e) => {
		const inputText = e.target.value;
		setSearchKey(inputText);

		// Gọi hàm tìm kiếm từ API dựa trên giá trị nhập vào
		searchGroupsFromAPI(inputText);

		//const filteredValues = searchHistory.filter((value) => value.toLowerCase().includes(inputText.toLowerCase()));
		//setSuggestedValues(filteredValues);
		setShowDropdown(true);
	};

	// Trong useEffect của component hoặc trong hàm khởi tạo
	useEffect(() => {
		// Tải lịch sử tìm kiếm từ local storage
		const storedSearchHistory = localStorage.getItem('searchHistory');

		if (storedSearchHistory) {
			setSearchHistory(JSON.parse(storedSearchHistory));
		}
	}, []);

	const handleRemoveSearchItem = (itemToRemove) => {
		// Xóa mục khỏi searchHistory trong trạng thái của component
		const updatedSearchHistory = searchHistory.filter((item) => item !== itemToRemove);
		setSearchHistory(updatedSearchHistory);

		// Cập nhật Local Storage với mảng mới sau khi xóa
		localStorage.setItem('searchHistory', JSON.stringify(updatedSearchHistory));
	};

	const handleSearchSubmit = (e) => {
		e.preventDefault();

		// Lưu tìm kiếm vào lịch sử
		const updatedSearchHistory = [...searchHistory, searchKey];

		// Lấy 10 giá trị mới nhất
		if (updatedSearchHistory.length > 10) {
			updatedSearchHistory.splice(0, updatedSearchHistory.length - 10);
		}

		setSearchHistory(updatedSearchHistory);

		// Lưu lịch sử vào local storage
		localStorage.setItem('searchHistory', JSON.stringify(updatedSearchHistory));

		// Đóng dropdown
		setShowDropdown(false);
		navigate('/groups/searchResult', { state: { searchData: searchFriends } });
	};

	const handleInputClick = () => {
		document.querySelector('.hide--on-click').classList.add('hide');
		setShowDropdown(true);
	};

	console.log(searchFriends);
	const listButton = [
		{
			title: 'Trang chủ',
			icon: <Home className="button-center-home " titleAccess="Trang chủ" />,
			link: '/',
		},
		{
			title: 'Nhóm',
			icon: <Group className="button-center-groups" titleAccess="Nhóm" />,
			link: '/groups',
		},
		{
			title: 'Bạn bè',
			icon: <GroupAdd className="button-center-friends" titleAccess="Bạn bè" />,
			link: '/friends',
		},
	];
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
					<Link to="/" style={{ textDecoration: 'none' }} className="hide--on-click">
						<span className="topbarLogo">UTEALO</span>
					</Link>
					<div className="topbarLeft__search">
						<div className="group--infor-introduce">
							<Search className="icon__search" />
							{showDropdown && (
								<div className="search-dropdown">
									<div className="search-dropdown-title">
										<span className="span-1">Gần đây</span>
										<span className="span-2">Chỉnh sửa</span>
									</div>
									<div className="search-dropdown-history">
										<ul>
											{/* Lịch sử tìm kiếm */}
											{searchHistory.map((item, index) => (
												<li key={index} onClick={() => setSearchKey(item)}>
													<ClockCircleOutlined className="icon--clock" />
													<span>{item}</span>
													<CloseOutlined
														className="icon--remove"
														onClick={() => handleRemoveSearchItem(item)}
													/>
												</li>
											))}
											{/* Tiên đoán */}
											{/* {suggestedValues.map((item, index) => (
											<li key={index} onClick={() => setSearchKey(item)}>
												{item}
											</li>
										))} */}
											{/* Kết quả tìm kiếm */}
											{Object.values(searchFriends).map((item, index) => (
												<li
													key={index}
													onClick={() =>
														setSearchKey(
															item.postGroupName ? item.postGroupName : item.userName
														)
													}
												>
													<img
														className="search--avatarGroup"
														src={item.avatarGroup || item.avatar || adver4}
														alt="avatarGroup"
													></img>
													<span
														className="item--postGroupName"
														onClick={() => {
															navigate(
																item.postGroupName
																	? `/groups/${item.postGroupId}`
																	: `/profile/${item.userId}`
															);
														}}
													>
														{item.postGroupName ? item.postGroupName : item.userName}
													</span>
												</li>
											))}
										</ul>
									</div>
								</div>
							)}
						</div>
						<form onSubmit={handleSearchSubmit}>
							<div ref={inputRef}>
								<input
									type="text"
									placeholder="Tìm kiếm trên UteAlo"
									className="input__search__utealo"
									style={{ fontSize: '14px' }}
									value={searchKey}
									onChange={handleSearchInputChange}
									onClick={handleInputClick}
								/>
							</div>
						</form>
					</div>
				</div>
				<div className="topbarCenter">
					{listButton.map((item, index) => (
						<div
							key={index}
							className="button-center"
							onClick={(e) => buttonCenterHandler(e.target, item.link)}
						>
							{item.icon}
							<span className="button-center-title">{item.title}</span>
						</div>
					))}
					<div className="button-center" onClick={themeModeHandler}>
						{theme.background === '#ffffff' ? (
							<NightsStay className="button-center-theme" titleAccess="Chế độ tối" />
						) : (
							<WbSunny className="button-center-theme" titleAccess="Chế độ sáng" />
						)}
						<span className="button-center-title">Theme</span>
					</div>
				</div>

				<div className="topbarRight">
					<div className="button-right">
						<Badge count={5}>
							<HiChatBubbleOvalLeft
								className="button-right-message"
								titleAccess="Tin nhắn"
								onClick={handderMessageClick}
							/>
						</Badge>
					</div>
					<div className="button-right">
						<Badge count={listNotification.length || 0}>
							<Notifications
								className="button-right-notifications"
								titleAccess="Thông báo"
								onClick={handderNotificationClick}
							/>
						</Badge>
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
