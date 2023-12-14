import { Button, Divider, List, Space, Typography } from 'antd';
import { CloseOutlined, ClockCircleOutlined } from '@ant-design/icons';
import useTheme from '../../../context/ThemeContext';
import './SidebarGroup.css';
import { useNavigate } from 'react-router-dom';
import { Search, Settings, RssFeed, Explore } from '@material-ui/icons';
import PostGroupApi from '../../../api/postGroups/PostGroupApi';
import { useEffect, useState, useRef } from 'react';
import noAvatar from '../../../assets/appImages/user.png';
import { BASE_URL } from '../../../context/apiCall';
import adver4 from '../../../assets/appImages/adver4.jpg';
import useAuth from '../../../context/auth/AuthContext';
import axios from 'axios';

const SidebarGroup = ({ user }) => {
	const { theme } = useTheme();
	const { user: currentUser } = useAuth();
	const navigate = useNavigate();
	const [listGroupOfMe, setListGroupOfMe] = useState([]);
	const [listGroupJoin, setListGroupJoin] = useState([]);
	const handlerCreateGroup = () => {
		navigate('/groups/create');
	};

	const [searchKey, setSearchKey] = useState('');
	const [searchHistory, setSearchHistory] = useState([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [searchFriends, setSearchFriends] = useState([]);
	const [suggestedValues, setSuggestedValues] = useState([]);

	const inputRef = useRef(null);

	const searchGroupsFromAPI = async (searchKey) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/groupPost/getPostGroups/key?search=${searchKey}`, config);
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

		const filteredValues = searchHistory.filter((value) => value.toLowerCase().includes(inputText.toLowerCase()));
		setSuggestedValues(filteredValues);
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
		navigate('/groups/searchGroup', { state: { searchData: searchFriends } });
	};

	const handleInputClick = () => {
		setShowDropdown(true);
	};

	const listAccountAction = [
		{
			postGroupName: 'Bảng feed của bạn',
			avatarGroup: <RssFeed style={{ fontSize: '25px', margin: 'auto' }} />,
			href: '/groups',
		},
		{
			postGroupName: 'Khám phá',
			avatarGroup: <Explore style={{ fontSize: '25px', margin: 'auto' }} />,
			href: '/groups/discover',
		},
	];

	useEffect(() => {
		async function fetchData() {
			const res = await PostGroupApi.listOwnerGroup(user);
			setListGroupOfMe(res.result);
			const resList = await PostGroupApi.listJoinGroup(user);
			setListGroupJoin(resList.result);
		}
		fetchData();
	}, [user]);
	const lists = [
		{
			data: listAccountAction,
		},

		{
			title: 'Nhóm bạn đã tham gia',
			data: listGroupJoin,
		},
		{
			title: 'Nhóm do bạn quản lý',
			data: listGroupOfMe,
		},
	];
	return (
		<div
			className="sidebar--group"
			style={{
				color: theme.foreground,
				background: theme.background,
			}}
		>
			<Space
				className="topSidebar"
				direction="vertical"
				style={{
					color: theme.foreground,
					background: theme.background,
				}}
			>
				<div
					className="topSidebar--setting"
					style={{
						color: theme.foreground,
						background: theme.background,
					}}
				>
					<div className="group--infor-introduce">Nhóm</div>
					<div className="icon-setting">
						<Settings
							className="topSidebar--setting-icon"
							style={{
								fontSize: '25px',
								color: theme.foreground,
								background: theme.background,
							}}
						/>
					</div>
				</div>
				<div
					className="topSidebar__search"
					style={{
						color: theme.foreground,
						background: theme.background,
					}}
				>
					<div
						className="group--infor-introduce"
						style={{
							color: theme.foreground,
							background: theme.background,
						}}
					>
						<Search
							className="icon__search"
							style={{
								marginLeft: '10px',
								fontSize: '24px',
							}}
						/>
						{showDropdown && (
							<div
								className="search-dropdown"
								style={{
									color: theme.foreground,
									background: theme.background,
								}}
							>
								<div
									className="search-dropdown-title"
									style={{
										color: theme.foreground,
										background: theme.background,
									}}
								>
									<span className="span-1">Gần đây</span>
									<span className="span-2">Chỉnh sửa</span>
								</div>
								<div className="search-dropdown-history">
									<ul style={{ width: '100%' }}>
										{/* Lịch sử tìm kiếm */}
										{searchHistory.map((item, index) => (
											<li
												key={index}
												onClick={() => {
													setSearchKey(item);
												}}
											>
												<ClockCircleOutlined className="icon--clock" />
												<span>{item}</span>
												<CloseOutlined
													className="icon--remove"
													onClick={() => handleRemoveSearchItem(item)}
												/>
											</li>
										))}

										{Object.values(searchFriends).map((item, index) => (
											<li
												key={index}
												onClick={() => {
													setSearchKey(item.postGroupName);
													navigate(`/groups/${item.postGroupId}`);
												}}
											>
												<img
													className="search--avatarGroup"
													src={item.avatarGroup ? item.avatarGroup : adver4}
													alt="avatarGroup"
												></img>
												<span className="item--postGroupName">{item.postGroupName}</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						)}
					</div>
					<form
						onSubmit={handleSearchSubmit}
						style={{
							color: theme.foreground,
							background: theme.background,
						}}
					>
						<div
							ref={inputRef}
							style={{
								color: theme.foreground,
								background: theme.background,
							}}
						>
							<input
								style={{
									color: theme.foreground,
									background: theme.background,
								}}
								type="text"
								placeholder="Tìm kiếm nhóm"
								className="input__search"
								value={searchKey}
								onChange={handleSearchInputChange}
								onClick={handleInputClick}
							/>
						</div>
					</form>
				</div>
				<div className="topSidebar__createGroup">
					<Button type="primary" block className="topSidebar__button" onClick={handlerCreateGroup}>
						<span className="icon--plus">+</span>
						<span className="createGroup--text">Tạo nhóm mới</span>
					</Button>
				</div>
			</Space>
			<Space
				className="sidebar__group"
				direction="vertical"
				style={{ color: theme.foreground, background: theme.background }}
			>
				{lists.map((list, index) => (
					<List
						key={index}
						header={
							<Divider orientation="left" style={{ margin: 0 }}>
								<Typography.Title
									style={{ color: theme.foreground, background: theme.background, margin: 0 }}
									level={4}
								>
									{list.title}
								</Typography.Title>
							</Divider>
						}
						split={false}
						dataSource={list.data}
						renderItem={(item) => (
							<List.Item style={{ padding: '4px 0' }}>
								{item.href ? (
									<Button
										type="text"
										block
										style={{
											color: theme.foreground,
											background: theme.background,
											height: 'auto',
											padding: '8px',
										}}
										onClick={() => {
											navigate(item.href);
										}}
									>
										<Space
											align="center"
											style={{
												width: '100%',
												marginLeft: '10px',
											}}
										>
											<div className="icon-setting">{item.avatarGroup}</div>
											<div style={{ marginTop: '14px' }}>
												<Typography.Text
													style={{ color: theme.foreground, background: theme.background }}
													strong
												>
													<div style={{ fontSize: '15px' }}>{item.postGroupName}</div>
												</Typography.Text>
											</div>
										</Space>
									</Button>
								) : (
									<Button
										type="text"
										block
										style={{ height: 'auto', padding: '8px' }}
										onClick={() => {
											navigate(`/groups/${item?.postGroupId}`);
										}}
									>
										<Space align="center" style={{ width: '100%' }}>
											<img
												src={item?.avatarGroup ? item?.avatarGroup : noAvatar}
												alt="avatar_group"
												className="image--group"
											/>
											<Typography.Text
												style={{ color: theme.foreground, background: theme.background }}
												strong
											>
												{item.postGroupName}
											</Typography.Text>
										</Space>
									</Button>
								)}
							</List.Item>
						)}
					/>
				))}
			</Space>
		</div>
	);
};
export default SidebarGroup;
