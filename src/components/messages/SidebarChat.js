import { Group, Message, MoreHoriz } from '@material-ui/icons';
import { Button, Segmented } from 'antd';
import Search from 'antd/es/input/Search';
import sampleProPic from '../../assets/appImages/user.png';
import { useEffect, useState } from 'react';
import GetFriendApi from '../../api/profile/friend/getFriendApi';
import toast from 'react-hot-toast';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import PostGroupApi from '../../api/postGroups/PostGroupApi';

const SidebarChat = ({ user, onChangeMessage }) => {
	console.log('user sidebar', user);
	const [friend, setFriend] = useState();
	const [group, setGroup] = useState();
	const [isGroup, setIsGroup] = useState(0);

	const handleClickMessage = (e) => {
		const item = e.currentTarget;
		const list = document.querySelectorAll('.item--message--sidebar');
		list.forEach((item) => {
			item.classList.remove('active--message');
		});
		item.classList.add('active--message');
	};
	useEffect(() => {
		const element = document.querySelector('.item--message--sidebar');
		if (element) {
			// Kiểm tra xem phần tử tồn tại
			element.classList.add('active--message');
		} else {
			console.log('Phần tử không tồn tại');
		}
	}, [friend,isGroup]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await GetFriendApi.getFriend(user);
				console.log('res', res);
				setFriend(res.result);
				const response = await PostGroupApi.listAllGroup(user);
				console.log('response', response);
				setGroup(response.result);
			} catch (error) {
				toast.error(`Lỗi khi lấy danh sách bạn bè ${error}`);
			}
		};
		fetchData();
	}, [user]);
	return (
		<div className="sidebar--chat">
			<div className="header--chat">
				<div className="header--chat--infor">
					<span>Tin nhắn</span>
					<Button type="default" icon={<MoreHoriz />} />
				</div>
				<Search className="search--friend--message" placeholder="tìm kiếm bạn bè" />
				<BottomNavigation
					className="list--message--sidebar"
					showLabels
					value={isGroup}
					onChange={(event, newValue) => {
						console.log('event', event);
						console.log('newValue', newValue);
						setIsGroup(newValue);
					}}
				>
					<BottomNavigationAction label="Hộp thư" icon={<Message />} />
					<BottomNavigationAction label="Cộng đồng" icon={<Group />} />
				</BottomNavigation>
			</div>
			<div className="container--sidebar--message">
				{isGroup === 0 &&
					friend?.map((item, index) => (
						<div className="item--message--sidebar " key={index} onClick={handleClickMessage}>
							<div className="avatar--message--sidebar">
								<img src={item.avatar} alt="avatar" />
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
						<div className="item--message--sidebar " key={index} onClick={handleClickMessage}>
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