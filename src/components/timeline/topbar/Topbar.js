import React, { useState, useEffect, useRef } from 'react';
import './Topbar.css';
import axios from 'axios';
import { NightsStay, Search, WbSunny, Home, Group, GroupAdd, Notifications } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import useAuth from '../../../context/auth/AuthContext';
import useTheme, { themes } from '../../../context/ThemeContext';
import { CloseOutlined } from '@ant-design/icons';
import noAvatar from '../../../assets/appImages/user.png';
import { BASE_URL } from '../../../context/apiCall';
import { useNavigate } from 'react-router-dom';
import adver4 from '../../../assets/appImages/adver4.jpg';
import { HiChatBubbleOvalLeft } from 'react-icons/hi2';
import { Badge, Button, List, Typography } from 'antd';
import { useWebSocket } from '../../../context/WebSocketContext';
import NotificationApi from '../../../api/notification/NotificationApi';
import { Popover } from '@material-ui/core';
import toast, { Toaster } from 'react-hot-toast';
import classnames from 'classnames';
import moment from 'moment';
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
	const [page, setPage] = useState(0);
	const { notification } = useWebSocket();
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	useEffect(() => {
		console.log('notification', notification);
		if (notification) {
			// unshift thêm vào đầu mảng
			setListNotification([notification, ...listNotification]);
		}
	}, [notification]);

	useEffect(() => {
		const fetchNotifications = async () => {
			setLoading(true);
			const res = await NotificationApi.getNotifications({ user: currentUser, page: page, size: 10 });
			console.log('res', res);
			if (res.success) {
				console.log(res.data);
				// thêm vào cuối mảng
				setListNotification([...listNotification, ...res.result]);
				if (res.result.length < 10) {
					setHasMore(false);
				} else {
					setHasMore(true);
				}
			} else {
				throw new Error(res.message);
			}
			setLoading(false);
		};
		fetchNotifications();
	}, [page]);

	// Toggle theme switch
	const themeModeHandler = () => {
		setTheme(theme === themes.light ? themes.dark : themes.light);
		localStorage.setItem('userTheme', theme === themes.light ? 'dark' : 'light');
	};
	const handderMessageClick = () => {
		navigate(`/messages`);
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
	}, []);

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
				document.querySelector('.hide--on-click').classList.remove('hide');
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

	const handleRemoveSearchItem = (e, itemToRemove) => {
		// ngăn chặn sự kiện click lan ra ngoài
		e.stopPropagation();
		// Xóa mục khỏi searchHistory trong trạng thái của component
		const updatedSearchHistory = searchHistory.filter((item) => item !== itemToRemove);
		setSearchHistory(updatedSearchHistory);
		setSearchKey('');
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
		document.querySelector('.hide--on-click').classList.remove('hide');
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
	const [anchorEl, setAnchorEl] = useState(null);
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleClick = (e) => {
		setAnchorEl(e.currentTarget);
	};
	const handleReadNotification = async (item) => {
		const toastId = toast.loading('Đang xử lý...');
		const res = await NotificationApi.readNotification({ user: currentUser, notificationId: item.notificationId });
		toast.dismiss(toastId);
		if (res.success) {
			console.log(res.data);
			setAnchorEl(null);

			navigate(`${item.link}`);
		} else {
			toast.error('Nội dung thông báo không còn tồn tại!!!');
		}
		//Chỉnh thông báo đó là đã đọc
		const newListNotification = listNotification.map((notification) => {
			if (notification.notificationId === item.notificationId) {
				return { ...notification, isRead: true };
			}
			return notification;
		});
		setListNotification(newListNotification);
	};
	const unReadAllNotification = async () => {
		const res = await NotificationApi.unReadAllNotification({ user: currentUser });
		if (res.success) {
			//chỉnh tất cả thông báo là đã đọc
			const newListNotification = listNotification.map((notification) => {
				return { ...notification, isRead: true };
			});
			setListNotification(newListNotification);
		} else {
			toast.error('Đã có lỗi xảy ra!!!');
		}
	};
	const clickSearchHistory = async (e) => {
		const item = e.target.innerText;
		setSearchKey(item);
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/user/search/key?search=${item}`, config);

			navigate('/groups/searchResult', {
				state: { searchData: res.data.result },
			});
		} catch (error) {
			console.log(error);
		}
	};

	const classParent = ['notification--item'];
	return (
		<>
			<Toaster />
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
						<div className="topbarLeft--search">
							<div className="group--infor-introduce">
								<Search className="icon__search" />
							</div>
							<form onSubmit={handleSearchSubmit} style={{ flex: 1 }}>
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
						{showDropdown && (
							<div className="search-dropdown">
								<div className="search-dropdown-title" style={{ color: '#000' }}>
									<span className="span-1">Gần đây</span>
								</div>
								<div className="search-dropdown-history">
									<ul className="search-dropdown-history-ul" style={{ color: '#000' }}>
										{/* Lịch sử tìm kiếm */}

										{[...new Set(searchHistory)].map((item, index) => (
											<li key={index} onClick={clickSearchHistory}>
												{item}
												<CloseOutlined
													className="search-dropdown-history-close"
													onClick={(e) => handleRemoveSearchItem(e, item)}
												/>
											</li>
										))}

										{/* Kết quả tìm kiếm */}
										{Object.values(searchFriends).map((item, index) => (
											<li
												key={index}
												onClick={() => {
													setSearchKey(
														item.postGroupName ? item.postGroupName : item.userName
													);
													navigate(
														item.postGroupName
															? `/groups/${item.postGroupId}`
															: `/profile/${item.userId}`
													);
												}}
											>
												<img
													className="search--avatarGroup"
													src={item.avatarGroup || item.avatar || adver4}
													alt="avatarGroup"
												></img>
												<span className="item--postGroupName">
													{item.postGroupName ? item.postGroupName : item.userName}
												</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						)}
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
						<span className="button-center-title">Chủ đề</span>
					</div>
				</div>

				<div className="topbarRight">
					<div className="button-right">
						<Badge count={0}>
							<HiChatBubbleOvalLeft
								className="button-right-message"
								titleAccess="Tin nhắn"
								onClick={handderMessageClick}
							/>
						</Badge>
					</div>
					<div className="button-right">
						<Badge
							// chỉ tính những thông báo chưa đọc
							count={listNotification.filter((item) => item.isRead === false).length}
							aria-describedby="simple-popover"
							onClick={(e) => handleClick(e)}
						>
							<Notifications className="button-right-notifications" titleAccess="Thông báo" />
						</Badge>
						<Popover
							id="simple-popover"
							open={Boolean(anchorEl)}
							className="popper--member"
							anchorEl={anchorEl}
							onClose={handleClose}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'right',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
						>
							<div className="notification--container">
								<div className="notification--header">
									<Typography.Text strong>Thông báo</Typography.Text>

									<Typography.Text
										style={{ color: '#1e90ff', cursor: 'pointer' }}
										onClick={unReadAllNotification}
									>
										Đánh dấu tất cả đã đọc
									</Typography.Text>
								</div>
								<div className="notification--body">
									{listNotification.length > 0 ? (
										<List
											itemLayout="horizontal"
											dataSource={listNotification}
											loadMore={
												<div
													style={{
														textAlign: 'center',
														marginTop: 12,
														height: 32,
														lineHeight: '32px',
														marginBottom: 12,
													}}
												>
													<Button
														disabled={!hasMore}
														type="primary"
														onClick={() => setPage((pre) => pre + 1)}
														loading={loading}
													>
														Xem thêm
													</Button>
												</div>
											}
											renderItem={(item) => (
												<List.Item
													className={classnames(item.isRead ? 'read' : 'unread', classParent)}
													onClick={() => handleReadNotification(item)}
												>
													<List.Item.Meta
														avatar={
															<img
																src={item.photo || adver4}
																alt="avatarGroup"
																className="notification--item-avatar"
															></img>
														}
														description={
															<div style={{ display: 'flex', flexDirection: 'column' }}>
																<span className="notification--item-content">
																	{item.content}
																</span>
																<span className="notification--item-time">
																	Thời gian:{' '}
																	{moment(item.createdAt).format('DD/MM/YYYY')}
																</span>
															</div>
														}
													/>
												</List.Item>
											)}
										/>
									) : (
										<div className="notification--item">
											<img
												src={adver4}
												alt="avatarGroup"
												className="notification--item-avatar"
											></img>
											<div className="notification--item-content">
												<Typography.Text>
													<span className="notification--item-content-content">
														Bạn không có thông báo nào
													</span>
												</Typography.Text>
											</div>
										</div>
									)}
								</div>
							</div>
						</Popover>
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
