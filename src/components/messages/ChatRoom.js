import React, { useEffect, useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import HeartIcon from '../../assets/icons/heart.png';
import HahaIcon from '../../assets/icons/haha.png';
import LikeIcon from '../../assets/icons/like.png';
import SadIcon from '../../assets/icons/sad.png';
import WowIcon from '../../assets/icons/wow.png';
import AngryIcon from '../../assets/icons/angry.png';
import './Message.css';
import sampleProPic from '../../assets/appImages/user.png';
import {
	Add,
	Call,
	CameraEnhance,
	InfoOutlined,
	InsertEmoticon,
	MoreHoriz,
	Photo,
	Reply,
	Send,
	SportsCricketRounded,
} from '@material-ui/icons';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, Popover } from '@material-ui/core';
import { Button, Input, Typography } from 'antd';
import MessageApi from '../../api/messages/MessageApi';
import toast from 'react-hot-toast';
var stompClient = null;
const ChatRoom = ({ user, data, Toggeinfo }) => {
	const moment = require('moment');
	const chatContainer = document.querySelector('.container--chatroom');

	const [reactIcon, setReactIcon] = useState(null);
	const [privateChats, setPrivateChats] = useState(new Map());
	const [iconMessage, setIconMessage] = useState(null);
	const [publicChats, setPublicChats] = useState(new Map());
	const [info, setInfo] = useState(false);
	const [page, setPage] = useState(0);
	const [loading, setLoading] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedItem, setSelectedItem] = useState(null);
	const [openConfirmation, setOpenConfirmation] = useState(false);
	const [userData, setUserData] = useState({
		connected: false,
		content: '',
	});
	const handleClickInfo = () => {
		setInfo(!info);
		Toggeinfo(info);
	};
	const handleReactIcon = (react) => {
		console.log('react', react);
	};

	const handleSendMessage = () => {
		if (stompClient) {
			if (userData.content.trim() === '') {
				return; // Tránh gửi tin nhắn trống
			}
			var chatMessage = {
				senderId: user.userId,
				senderAvatar: user?.avatar,
				senderName: user?.userName,
				receiverId: data?.userId,
				groupId: data?.postGroupId,
				messageType: 'TEXT',
				content: userData.content,
				createAt: new Date(),
				status: 'MESSAGE',
			};
			console.log('data?.userId', data?.userId);
			if (data?.userId) {
				privateChats.get(data?.userId).push(chatMessage);
				setPrivateChats(new Map(privateChats));
				stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
			}
			if (data?.postGroupId) {
				stompClient.send('/app/sendMessage/' + data?.postGroupId, {}, JSON.stringify(chatMessage));
			}
			setUserData({ ...userData, content: '' });
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	};

	const userJoin = () => {
		if (!privateChats.get(data?.userId)) {
			privateChats.set(data?.userId, []);
			setPrivateChats(new Map(privateChats));
		}

		if (!publicChats.get(data?.postGroupId.toString())) {
			publicChats.set(data?.postGroupId.toString(), []);
			setPublicChats(new Map(publicChats));
		}
	};

	const handleScroll = () => {
		// if (chatContainer) {
		// 	const scrollY = chatContainer.scrollTop; // Lấy vị trí cuộn hiện tại
		// 	// Chiều cao của trang
		// 	const pageHeight = chatContainer.scrollHeight;
		// 	// Tính toán 60% chiều cao
		// 	const sixtyPercentHeight = (pageHeight * 40) / 100;
		// 	if (scrollY < sixtyPercentHeight && !loading) {
		// 		setLoading(true);
		// 		setTimeout(() => {
		// 			AddMessages();
		// 			setLoading(false);
		// 			// 	chatContainer.scrollTo(0, scrollY);
		// 		}, 100); // Giả định thời gian API call
		// 	}
		// }
	};
	// const AddMessages = async () => {
	// 	const res = await MessageApi.getMessage({ userId: data?.userId, page: page + 1, size: 20 });
	// 	console.log('res', res);
	// 	setPage(page + 1);
	// 	if (res) {
	// 		if (privateChats.get(data?.userId)) {
	// 			res.result.forEach((element) => {
	// 				privateChats.get(data?.userId).unshift(element);
	// 				setPrivateChats(new Map(privateChats));
	// 			});
	// 		}
	// 	}
	// };
	useEffect(() => {
		console.log('privateChats', privateChats);
	}, [privateChats]);

	useEffect(() => {
		const fetchData = async () => {
			connect();

			if (!privateChats.get(data.userId) && data.userId) {
				const res = await MessageApi.getMessage({ userId: data.userId, page: page, size: 20 });
				if (res) {
					privateChats.set(data.userId, res.result);
					setPrivateChats(new Map(privateChats));
				}
			}
			if ( data?.postGroupId && !publicChats.get(data?.postGroupId.toString()) ) {
				const res = await MessageApi.getMessageGroup({ groupId: data?.postGroupId, page: page, size: 20 });
				if (res) {
					publicChats.set(data?.postGroupId.toString(), res.result);
					setPublicChats(new Map(publicChats));
				}
			}
			if (chatContainer) {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}
		};
		fetchData();
	}, [data]);
	const connect = () => {
		let Sock = new SockJS('http://localhost:8089/ws');
		stompClient = over(Sock);
		stompClient.connect({}, onConnected, onError);
	};
	const onConnected = () => {
		setUserData({ ...userData, connected: true });

		stompClient.subscribe('/user/' + user?.userId + '/private', onPrivateMessage);
		if (data?.postGroupId) {
			stompClient.subscribe('/chatroom/room/' + data?.postGroupId, onMessageReceived);
		}
		userJoin();
	};

	const onMessageReceived = (payload) => {
		var payloadData = JSON.parse(payload.body);

		if (publicChats.get(payloadData.groupId.toString())) {
			publicChats.get(payloadData.groupId.toString()).push(payloadData);
			setPublicChats(new Map(publicChats));
		} else {
			let list = [];
			list.push(payloadData);
			publicChats.set(payloadData.groupId.toString(), list);
			setPublicChats(new Map(publicChats));
		}
	};
	const onPrivateMessage = (payload) => {
		var payloadData = JSON.parse(payload.body);
		if (privateChats.get(payloadData.senderId)) {
			privateChats.get(payloadData.senderId).push(payloadData);
			setPrivateChats(new Map(privateChats));
		} else {
			let list = [];
			list.push(payloadData);
			privateChats.set(payloadData.senderId, list);
			setPrivateChats(new Map(privateChats));
		}
		chatContainer.scrollTop = chatContainer.scrollHeight;
	};
	const handleClose = () => {
		setIconMessage(null);
		setAnchorEl(null);
		setSelectedItem(null);
	};
	const handleClick = (event, item) => {
		if (event.currentTarget.className.animVal === 'MuiSvgIcon-root icon--more--message') {
			setIconMessage('More');
		}
		if (event.currentTarget.className.animVal === 'MuiSvgIcon-root icon--reply--message') {
			setIconMessage('Reply');
		}
		if (event.currentTarget.className.animVal === 'MuiSvgIcon-root icon--emoticon--message') {
			setIconMessage('Emoticon');
		}

		setAnchorEl(event.currentTarget);
		setSelectedItem(item);
	};
	const onError = (err) => {
		console.log(err);
	};
	const handleConfirmAction = async () => {
		selectedItem.createAt = moment(selectedItem.createAt).format('YYYY-MM-DD HH:mm:ss.SSSSSS');

		const toastId = toast.loading('Đang gửi yêu cầu...');
		try {
			await MessageApi.deleteMessage(selectedItem);
			toast.success('Xóa tin nhắn thành công!', { id: toastId });
			privateChats.set(
				data?.userId,
				[...privateChats.get(data?.userId)].filter((member) => member !== selectedItem)
			);
			setPrivateChats(new Map(privateChats));
		} catch (error) {
			toast.error(`Có lỗi trong khi xóa Lỗi: ${error}`, { id: toastId });
		}
		setOpenConfirmation(false);
		handleClose();
	};

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			handleSendMessage();
		}
	};
	const handleCloseConfirmation = () => {
		setOpenConfirmation(false);
		setAnchorEl(null);
		setSelectedItem(null);
	};
	return (
		<div className="chatroom">
			<div className="header--chatroom">
				<div className="header--chatroom--left">
					<img src={data?.avatar || sampleProPic} alt="avatar" />
					<div>
						<p>{data?.userName || data?.postGroupName}</p>
						<span>Đang hoạt động</span>
					</div>
				</div>
				<div className="header--chatroom--right">
					<Call className="header--chatroom--right--icon" />
					<CameraEnhance className="header--chatroom--right--icon" />
					<InfoOutlined
						titleAccess="Thông tin về cuộc trò chuyện"
						className="header--chatroom--right--icon"
						onClick={handleClickInfo}
					/>
				</div>
			</div>
			<div className="container--chatroom" onScroll={handleScroll}>
				{privateChats.get(data?.userId) &&
					[...privateChats.get(data?.userId)].map((msg, index) => (
						<div className={msg?.senderId === user?.userId ? 'sent--item' : 'received--item'} key={index}>
							<div className={msg.senderId === user?.userId ? 'sent' : 'received'}>
								<div className="icon--message">
									<MoreHoriz className="icon--more--message" onClick={(e) => handleClick(e, msg)} />
									<Reply className="icon--reply--message" onClick={(e) => handleClick(e, msg)} />

									<InsertEmoticon
										className="icon--emoticon--message"
										onClick={(e) => handleClick(e, msg)}
									/>
								</div>

								<span >{msg.content}</span>
							</div>
						</div>
					))}
				{data?.postGroupId &&
					publicChats.get(data?.postGroupId.toString()) &&
					[...publicChats.get(data?.postGroupId.toString())].map((msg, index) => (
						<div className={msg.senderId === user?.userId ? 'sent--item' : 'received--item'} key={index}>
							{msg.senderId !== user?.userId ? (
								<>
									<img src={msg.senderAvatar} alt="Sender Avatar" className="sender-avatar" />
									<div className="content--message--group">
										<span className="sender-name">{msg.senderName}</span>
										<div className={msg.senderId === user?.userId ? 'sent' : 'received'}>
											<div className="icon--message">
												<MoreHoriz
													className="icon--more--message"
													onClick={(e) => handleClick(e, msg)}
												/>
												<Reply
													className="icon--reply--message"
													onClick={(e) => handleClick(e, msg)}
												/>

												<InsertEmoticon
													className="icon--emoticon--message"
													onClick={(e) => handleClick(e, msg)}
												/>
											</div>

											<span title={msg.createAt.toLocaleString()}>{msg.content}</span>
										</div>
									</div>
								</>
							) : (
								<div className={msg.senderId === user?.userId ? 'sent' : 'received'}>
									<div className="icon--message">
										<MoreHoriz
											className="icon--more--message"
											onClick={(e) => handleClick(e, msg)}
										/>
										<Reply className="icon--reply--message" onClick={(e) => handleClick(e, msg)} />

										<InsertEmoticon
											className="icon--emoticon--message"
											onClick={(e) => handleClick(e, msg)}
										/>
									</div>

									<span title={msg.createAt.toLocaleString()}>{msg.content}</span>
								</div>
							)}
						</div>
					))}
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
					<div>
						{iconMessage === 'More' && (
							<Typography className="poper--member--item" onClick={() => setOpenConfirmation(true)}>
								Thu hồi tin nhắn
							</Typography>
						)}
						{iconMessage === 'Reply' && (
							<Typography className="poper--member--item" onClick={() => setOpenConfirmation(true)}>
								Trả lời tin nhắn
							</Typography>
						)}
						{iconMessage === 'Emoticon' && (
							<div className="emotion--container">
								<img
									src={HeartIcon}
									alt="Heart Icon"
									className="icon--emoticon"
									onClick={() => handleReactIcon('Heart')}
								/>
								<img
									src={HahaIcon}
									alt="Haha Icon"
									className="icon--emoticon"
									onClick={() => handleReactIcon('Haha')}
								/>
								<img
									src={LikeIcon}
									alt="Like Icon"
									className="icon--emoticon"
									onClick={() => handleReactIcon('Like')}
								/>
								<img
									src={SadIcon}
									alt="Sad Icon"
									className="icon--emoticon"
									onClick={() => handleReactIcon('Sad')}
								/>
								<img
									src={WowIcon}
									alt="Wow Icon"
									className="icon--emoticon"
									onClick={() => handleReactIcon('Wow')}
								/>
								<img
									src={AngryIcon}
									alt="Angry Icon"
									className="icon--emoticon"
									onClick={() => handleReactIcon('Angry')}
								/>
							</div>
						)}
					</div>
				</Popover>

				<Dialog open={openConfirmation} onClose={handleCloseConfirmation}>
					<DialogTitle>Xác nhận thay đổi</DialogTitle>
					<DialogContent>
						<DialogContentText>Bạn có chắc chắn muốn xóa tin nhắn này ?</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCloseConfirmation} color="primary" variant="outlined">
							Hủy
						</Button>
						<Button onClick={handleConfirmAction} color="primary" variant="contained">
							Xác nhận
						</Button>
					</DialogActions>
				</Dialog>
			</div>
			<div className="footer--chatroom">
				<div className="footer--chatroom--icon-message">
					<Add className="header--chatroom--right--icon" />
					<Photo className="header--chatroom--right--icon" />
					<SportsCricketRounded className="header--chatroom--right--icon" />
				</div>
				<Input
					className="input-message"
					type="text"
					placeholder="Nhập tin nhắn..."
					value={userData.content}
					onKeyPress={handleKeyPress}
					onChange={(e) => setUserData({ ...userData, content: e.target.value })}
				/>
				<Button className="footer--chatroom--button-message" onClick={handleSendMessage} icon={<Send />} />
			</div>
		</div>
	);
};

export default ChatRoom;
