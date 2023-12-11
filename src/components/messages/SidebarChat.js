import { Group, Message, MoreHoriz } from '@material-ui/icons';
import { Button, Typography } from 'antd';
import Search from 'antd/es/input/Search';
import sampleProPic from '../../assets/appImages/user.png';
import { useEffect, useState } from 'react';
import GetFriendApi from '../../api/profile/friend/getFriendApi';
import toast from 'react-hot-toast';
import { BottomNavigation, BottomNavigationAction, Popover } from '@material-ui/core';
import PostGroupApi from '../../api/postGroups/PostGroupApi';
import { useNavigate, useParams } from 'react-router-dom';
import useTheme from '../../context/ThemeContext';
const SidebarChat = ({ user, onChangeMessage }) => {
	const navigate = useNavigate();
	const [friend, setFriend] = useState();
	const params = useParams();
	const [group, setGroup] = useState();
	const [isGroup, setIsGroup] = useState(0);
	const [selectItem, setSelectItem] = useState(null);

	const handleClickMessage = (e) => {
		const item = e.currentTarget;
		setSelectItem(item.id);
		const list = document.querySelectorAll('.item--message--sidebar');
		list.forEach((item) => {
			item.classList.remove('active--message');
		});
		document.getElementById(item.id).classList.add('active--message');
		if (isGroup === 0) {
			onChangeMessage({
				isGroup: false,
				id: item.id,
			});
		}
		if (isGroup === 1) {
			onChangeMessage({
				isGroup: true,
				id: item.id,
			});
		}
	};

	useEffect(() => {
		const elementCurrent = document.getElementById(selectItem);
		if (elementCurrent) {
			elementCurrent.classList.add('active--message');
		}
	}, [isGroup]);
	// useEffect(() => {
	// 	const element = document.querySelector('.item--message--sidebar');
	// 	if (element) {
	// 		element.classList.add('active--message');
	// 		setSelectItem(element.id);
	// 		onChangeMessage({
	// 			isGroup: false,
	// 			id: element.id,
	// 		});
	// 	}
	// }, [friend]);
	useEffect(() => {
		//Nếu params.userId mà nhỏ hơn 30 kí tự thì là id của group
		//nếu là id của group thì tự động ấn qua cộng đồng và chọn group đó
		if (params.userId) {
			const element = document.getElementById(params.userId);
			if (element) {
				element.classList.add('active--message');
			}
			setSelectItem(params.userId);
			if (params.userId?.length < 30) {
				setIsGroup(1);
				onChangeMessage({
					isGroup: true,
					id: params.userId,
				});
			} else {
				setIsGroup(0);
				onChangeMessage({
					isGroup: false,
					id: params.userId,
				});
			}
		} else {
			const element = document.querySelector('.item--message--sidebar');
			if (element) {
				element.classList.add('active--message');
				setSelectItem(element.id);
				onChangeMessage({
					isGroup: false,
					id: element.id,
				});
			}
		}
	}, [params.userId, friend]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await GetFriendApi.getFriend(user);

				setFriend(res.result);
				const response = await PostGroupApi.listAllGroup(user);

				setGroup(response.result);
			} catch (error) {
				toast.error(`Lỗi khi lấy danh sách bạn bè ${error}`);
			}
		};
		fetchData();
	}, [user]);

	const [anchorEl, setAnchorEl] = useState(null);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const underDev = () => {
		toast.error('Chức năng đang được phát triển');
		setAnchorEl(null);
	};
	const { theme } = useTheme();
	return (
		<div className="sidebar--chat">
			<div className="header--chat" style={{ color: theme.foreground, background: theme.background }}>
				<div className="header--chat--infor">
					<span>Tin nhắn</span>
					<Button
						type="default"
						icon={<MoreHoriz />}
						aria-describedby="simple-popover"
						onClick={handleClick}
					/>
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
						<Typography className="title--popper" onClick={() => navigate('/groups/create')}>
							Tạo nhóm mới
						</Typography>
						<Typography className="title--popper" onClick={() => underDev()}>
							Gửi tin nhắn đến nhiều người
						</Typography>
					</Popover>
				</div>
				<Search className="search--friend--message" placeholder="tìm kiếm bạn bè" />
				<BottomNavigation
					style={{ color: theme.foreground, background: theme.background }}
					className="list--message--sidebar"
					showLabels
					value={isGroup}
					onChange={(event, newValue) => {
						setIsGroup(newValue);
					}}
				>
					<BottomNavigationAction
						style={{ color: theme.foreground, background: theme.background }}
						label="Hộp thư"
						icon={<Message />}
					/>
					<BottomNavigationAction
						style={{ color: theme.foreground, background: theme.background }}
						label="Cộng đồng"
						icon={<Group />}
					/>
				</BottomNavigation>
			</div>
			<div className="container--sidebar--message">
				{isGroup === 0 &&
					friend?.map((item, index) => (
						<div
							className="item--message--sidebar "
							key={index}
							onClick={handleClickMessage}
							id={item.userId}
						>
							<div className="avatar--message--sidebar">
								<img src={item?.avatar || sampleProPic} alt="avatar" />
							</div>
							<div className="infor--message--sidebar">
								<div className="name--message--sidebar">{item.username}</div>
								<div className="content--message--sidebar">
									Tin nhắn mới nhấtTin nhắn mới nhấtTin nhắn mới nhất
								</div>
							</div>
						</div>
					))}
				{isGroup === 1 &&
					group?.map((item, index) => (
						<div
							className="item--message--sidebar "
							key={index}
							onClick={handleClickMessage}
							id={item.postGroupId}
						>
							<div className="avatar--message--sidebar">
								<img src={item?.avatarGroup || sampleProPic} alt="avatar" />
							</div>
							<div className="infor--message--sidebar">
								<div className="name--message--sidebar">{item.postGroupName}</div>
								<div className="content--message--sidebar">
									Tin nhắn mới nhấtTin nhắn mới nhấtTin nhắn mới nhất
								</div>
							</div>
						</div>
					))}
			</div>
		</div>
	);
};
export default SidebarChat;
