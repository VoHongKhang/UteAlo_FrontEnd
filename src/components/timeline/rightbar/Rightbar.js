import { Button, Divider, List, Space, Typography, Modal } from 'antd';
import { Link } from 'react-router-dom';
import adverSymbol from '../../../assets/appImages/adverSym.jpg';
import adImg from '../../../assets/appImages/adver.jpg';
import adImg2 from '../../../assets/appImages/adver4.jpg';
import useTheme from '../../../context/ThemeContext';
import './Rightbar.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../context/apiCall';
import ChatBox from '../chatbox/ChatBox';
import toast from 'react-hot-toast';
import DeleteFriendRequestApi from '../../../api/profile/friendrequest/delete';
import AcceptFriendRequestApi from '../../../api/profile/friendrequest/accept';

const Rightbar = ({ user }) => {
	const { theme } = useTheme();
	const [listFriend, setListFriend] = useState([]);
	const [listFriendRequest, setListFriendRequest] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isAccept, setIsAccept] = useState(null);
	const [isDeny, setIsDeny] = useState(null);
	//get list friend request

	const getListFriendTop10 = async () => {
		try {
			await axios
				.get(`${BASE_URL}/v1/friend/list/${user.userId}`)
				.then((res) => {
					if (res.data.success) {
						setListFriend(res.data.result);
					} else {
						throw new Error(res.data.message);
					}
				})
				.catch((err) => {
					throw new Error(err.response.data.message);
				});
		} catch (error) {
			console.error(error);
		}
	};

	const getListFriendRequest = async () => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.accessToken}`,
				},
			};

			await axios
				.get(`${BASE_URL}/v1/friend/request/list`, config)
				.then((res) => {
					if (res.data.success) {
						setListFriendRequest(res.data.result);
						return res.data.result;
					} else {
						throw new Error(res.data.message);
					}
				})
				.catch((err) => {
					throw new Error(err.response.data.message);
				});
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		getListFriendRequest();
		getListFriendTop10();
	}, []);
	const messageHandler = (user) => {
		setSelectedUser(user);
	};

	const lists = [
		{
			title: 'Yêu cầu kết bạn',
			data: listFriendRequest,
		},
		{
			title: 'Bạn bè',
			data: listFriend,
		},
	];
	const handlerCloseChatBox = (close) => {
		setSelectedUser(close);
	};
	const handlerAccept = (item) => {
		setIsModalVisible(true);
		setIsAccept(item);
	};
	const handlerAccepts = async (item) => {
		console.log('accessToken', user.accessToken);
		try {
			await AcceptFriendRequestApi.acceptFriendRequest(user.accessToken, item.userId);
			toast.success('Kết bạn thành công', { id: 'success' });
			getListFriendRequest();
			getListFriendTop10();
		} catch (error) {
			toast.error(error.message, { id: 'error' });
		}
		setIsAccept(null);
	};
	const handlerDeny = (item) => {
		setIsModalVisible(true);
		setIsDeny(item);
	};
	const handlerDenys = async (item) => {
		try {
			await DeleteFriendRequestApi.deleteFriendRequest(user.accessToken, item.userId);
			toast.success('Xóa thành công', { id: 'success' });
			getListFriendRequest();
		} catch (error) {
			toast.error(error.message, { id: 'error' });
		}
		setIsDeny(null);
	};

	const ProfileRightbar = () => {
		return (
			<>
				{lists.map((list, index) => (
					<List
						key={index}
						header={
							<Divider orientation="left" style={{ margin: 0 }}>
								<Space align="center" style={{ width: '100%' }}>
									<Typography.Title level={5} style={{ margin: 0 }}>
										{list.title}
									</Typography.Title>

									{list.title === 'Yêu cầu kết bạn' ? (
										<Link to="/friends/request" style={{ float: 'right', color: '#5aa7ff' }}>
											Xem tất cả
										</Link>
									) : (
										''
									)}
								</Space>
							</Divider>
						}
						split={false}
						dataSource={list.data}
						renderItem={(item) => (
							<List.Item style={{ padding: '4px 0' }}>
								{list.title === 'Yêu cầu kết bạn' ? (
									<Space align="center" style={{ width: '100%' }}>
										<Link to={`/profile/${item.userId}`}>
											<img src={item.avatar} alt="..." className="topbarImg" />
										</Link>
										<Typography.Text className="username_fq" strong>
											{item.username}
										</Typography.Text>

										<Button
											type="primary"
											size="small"
											style={{ float: 'right', margin: '0 4px' }}
											onClick={() => handlerAccept(item)}
										>
											Kết bạn
										</Button>

										<Button
											type="default"
											size="small"
											style={{ float: 'right', margin: '0 4px' }}
											onClick={() => handlerDeny(item)}
										>
											Từ chối
										</Button>
									</Space>
								) : (
									<Button type="text" block style={{ height: 'auto', padding: '2px' }}>
										<Space
											align="center"
											style={{ width: '100%', cursor: 'pointer' }}
											onClick={() => messageHandler(item)}
										>
											<img src={item.avatar} alt="..." className="topbarImg" />
											<Typography.Text strong>{item.username}</Typography.Text>
										</Space>
									</Button>
								)}
							</List.Item>
						)}
					/>
				))}
				{selectedUser && <ChatBox user={selectedUser} onCloseChatBox={handlerCloseChatBox} />}
			</>
		);
	};

	const HomeRightbar = () => {
		return (
			<>
				<div className="birthdayContainer">
					<img className="birthdayImg" src={adverSymbol} alt="..." />
					<span className="birthdayText">
						<strong>Ads...</strong>
					</span>
				</div>
				<a href="https://splashstore.netlify.app">
					<img className="rightbarAd" src={adImg} alt="..." />
				</a>
				<a href="https://dev.to/adidoshi">
					<img className="rightbarAd2" src={adImg2} alt="..." />
				</a>
			</>
		);
	};
	return (
		<Space
			direction="vertical"
			className="rightbar"
			style={{ color: theme.foreground, background: theme.background }}
		>
			{user ? <ProfileRightbar /> : <HomeRightbar />}
			<Modal
				title="Xác nhận"
				open={isModalVisible}
				onCancel={() => {
					setIsModalVisible(false);
					setIsAccept(null);
					setIsDeny(null);
				}}
				onOk={() => {
					setIsModalVisible(false);
					if (isAccept != null) handlerAccepts(isAccept); // neu an chap nhan thi accept
					if (isDeny != null) handlerDenys(isDeny);
				}}
			>
				<p>Bạn có chắc chắn muốn tiếp tục?</p>
			</Modal>
		</Space>
	);
};
export default Rightbar;
