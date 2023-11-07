import React, { useEffect, useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import './Message.css';
import sampleProPic from '../../assets/appImages/user.png';
import {
	Add,
	Call,
	CameraEnhance,
	InfoOutlined,
	MoreHoriz,
	Photo,
	Send,
	SportsCricketRounded,
} from '@material-ui/icons';
import { Button, Input } from 'antd';
var stompClient = null;
const ChatRoom = ({ user, data, Toggeinfo }) => {
	const [messages, setMessages] = useState([]);
	const [privateChats, setPrivateChats] = useState(new Map());
	const [publicChats, setPublicChats] = useState([]);
	const [tab, setTab] = useState('CHATROOM');
	const [info, setInfo] = useState(false);
	const [userData, setUserData] = useState({
		connected: false,
		content: '',
	});
	const handleClickInfo = () => {
		setInfo(!info);
		Toggeinfo(info);
	};

	const handleSendMessage = () => {
		if (stompClient) {
			if (userData.content.trim() === '') {
				return; // Tránh gửi tin nhắn trống
			}
			var chatMessage = {
				senderId: user.userId,
				receiverId: data?.userId,
				groupId: data?.postGroupId,
				messageType: 'TEXT',
				content: userData.content,
				createAt: new Date(),
				status: 'MESSAGE',
			};
			setMessages([...messages, chatMessage]);
			stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
			setUserData({ ...userData, content: '' });
		}
	};
	useEffect(() => {
		connect();
		const fetchData = () => {};
	}, [data]);
	const connect = () => {
		let Sock = new SockJS('http://localhost:8089/ws');
		stompClient = over(Sock);
		stompClient.connect({}, onConnected, onError);
	};

	const onConnected = () => {
		setUserData({ ...userData, connected: true });
		if (data?.userId) {
			stompClient.subscribe('/user/' + user.userId + '/private', onPrivateMessage);
		}
		if (data?.postGroupId) {
			stompClient.subscribe('/chatroom/public', onMessageReceived);
		}
	};

	const userJoin = () => {
		var chatMessage = {
			senderId: user.userId,
			receiverId: data?.userId,
			groupId: data?.postGroupId,
			messageType: 'TEXT',
			status: 'JOIN',
		};
		stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
	};

	const onMessageReceived = (payload) => {
		var payloadData = JSON.parse(payload.body);
		switch (payloadData.status) {
			case 'JOIN':
				if (!privateChats.get(payloadData.senderId)) {
					privateChats.set(payloadData.senderId, []);
					setPrivateChats(new Map(privateChats));
				}
				break;
			case 'MESSAGE':
				publicChats.push(payloadData);
				setPublicChats([...publicChats]);
				break;
		}
	};

	const onPrivateMessage = (payload) => {
		console.log(payload);
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
	};

	const onError = (err) => {
		console.log(err);
	};

	const handleMessage = (event) => {
		const { value } = event.target;
		setUserData({ ...userData, content: value });
	};
	const sendValue = () => {
		if (stompClient) {
			var chatMessage = {
				senderId: user.userId,
				receiverId: data?.userId,
				groupId: data?.postGroupId,
				messageType: 'TEXT',
				content: userData.content,
				status: 'MESSAGE',
			};
			console.log(chatMessage);
			stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
			setUserData({ ...userData, content: '' });
		}
	};

	const handleUsername = (event) => {
		const { value } = event.target;
		setUserData({ ...userData, username: value });
	};

	return (
		<div className="chatroom">
			<div className="header--chatroom">
				<div className="header--chatroom--left">
					<img src={data?.avatar || sampleProPic} alt="avatar" />
					<div>
						<p>{data?.fullName || data?.postGroupName}</p>
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
			<div className="container--chatroom">
				{data?.userId &&
					messages.map((msg, index) => (
						<div key={index} className={msg.senderId === user.userId ? 'sent' : 'received'}>
							<MoreHoriz className="icon--more--message" />
							<span title={msg.createAt.toLocaleString()}>{msg.content}</span>
						</div>
					))}
				<div className="received">
					<MoreHoriz className="icon--more--message" />
					<span> Tôi đang đi học</span>
				</div>
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
					onChange={(e) => setUserData({ ...userData, content: e.target.value })}
				/>
				<Button className="footer--chatroom--button-message" onClick={handleSendMessage} icon={<Send />} />
			</div>
			{/* {userData.connected?
        <div className="chat-box">
            <div className="member-list">
                <ul>
                    <li onClick={()=>{setTab("CHATROOM")}} className={`member ${tab==="CHATROOM" && "active"}`}>Chatroom</li>
                    {[...privateChats.keys()].map((name,index)=>(
                        <li onClick={()=>{setTab(name)}} className={`member ${tab===name && "active"}`} key={index}>{name}</li>
                    ))}
                </ul>
            </div>
            {tab==="CHATROOM" && <div className="chat-content">
                <ul className="chat-messages">
                    {publicChats.map((chat,index)=>(
                        <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                            {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                            <div className="message-data">{chat.content}</div>
                            {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                        </li>
                    ))}
                </ul>

                <div className="send-message">
                    <input type="text" className="input-message" placeholder="enter the message" value={userData.content} onChange={handleMessage} /> 
                    <button type="button" className="send-button" onClick={sendValue}>send</button>
                </div>
            </div>}
            {tab!=="CHATROOM" && <div className="chat-content">
                <ul className="chat-messages">
                    {[...privateChats.get(tab)].map((chat,index)=>(
                        <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                            {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                            <div className="message-data">{chat.content}</div>
                            {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                        </li>
                    ))}
                </ul>

                <div className="send-message">
                    <input type="text" className="input-message" placeholder="enter the message" value={userData.content} onChange={handleMessage} /> 
                    <button type="button" className="send-button" onClick={sendPrivateValue}>send</button>
                </div>
            </div>}
        </div>
        */}
		</div>
	);
};

export default ChatRoom;
