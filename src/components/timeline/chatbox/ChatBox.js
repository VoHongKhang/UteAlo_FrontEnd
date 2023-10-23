import React, { useState } from 'react';
import './ChatBox.css';
import noAvatar from '../../../assets/appImages/user.png';
import { Add, Minimize, Close, Phone, Camera, Photo, SportsCricketRounded } from '@material-ui/icons';
import { Input, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
function ChatBox({ user, onCloseChatBox }) {
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const navigate = useNavigate();
	const handleAvatar = () => {
		navigate(`/profile/${user.userId}`);
	};
	const handleSendMessage = () => {
		if (message.trim() === '') {
			return; // Tránh gửi tin nhắn trống
		}

		const newMessage = {
			text: message,
			sender: user, // Người gửi
			timestamp: new Date().toLocaleString(), // Thời gian gửi
		};

		// Thêm tin nhắn mới vào danh sách tin nhắn
		setMessages([...messages, newMessage]);
		setMessage('');
	};
	const closeChatBox = () => {
		onCloseChatBox(null);
	};

	return (
		<div className={`chatbox ${user.userId}`}>
			<Space direction="vertical" size={12}>
				<div className="chat-header">
					<div className="chat-header_left">
						<img
							src={user.avatar || noAvatar}
							alt="..."
							className="chat-header-avatar"
							onClick={handleAvatar}
						/>
						<div className="chat-header-user">
							<div className="chat-header-username">{user.username}</div>
							<div className="chat-header-timestamp">2 giờ trước</div>
						</div>
					</div>
					<div className="chat-header-icon">
						<Camera />
						<Phone />
						<Minimize />
						<Close onClick={closeChatBox} />
					</div>
				</div>
			</Space>

			<div className="chat-messages">
				{messages.map((msg, index) => (
					<div key={index} className={msg.sender === user ? 'sent' : 'received'}>
						<div>{msg.text}</div>
						<div className="timestamp">{msg.timestamp}</div>
					</div>
				))}
			</div>
			<div className="chat-input">
				<div className="icon-message">
					<Add />
					<Photo />
					<SportsCricketRounded />
				</div>
				<Input
					className="input-message"
					type="text"
					placeholder="Nhập tin nhắn..."
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<Button className="button-message" onClick={handleSendMessage}>
					Gửi
				</Button>
			</div>
		</div>
	);
}

export default ChatBox;
