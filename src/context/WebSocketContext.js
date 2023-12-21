import React, { createContext, useContext, useState } from 'react';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';

const WebSocketContext = createContext();

export const useWebSocket = () => {
	return useContext(WebSocketContext);
};
const onError = (err) => {
	console.log(err);
};
export const WebSocketProvider = ({ children }) => {
	const [stompClient, setStompClient] = useState(null);
	const [notification, setNotification] = useState(null);
	const connectWebSocket = (currentUser, onConnectedCallback) => {
		if (currentUser && !stompClient) {
			let Sock = new SockJS('http://localhost:8089/ws');
			const client = over(Sock);

			client.connect(
				{},
				() => {
					console.log('WebSocket connected');
					const data = {
						userId: currentUser.userId,
						isOnline: true,
					};
					client.subscribe('/user/' + currentUser?.userId + '/notification', (e) =>
						setNotification(JSON.parse(e.body))
					);
					client.send('/app/isOnline', {}, JSON.stringify(data));

					if (onConnectedCallback) {
						onConnectedCallback(); // Gọi callback nếu được cung cấp
					}
				},
				onError
			);

			setStompClient(client);
		}
	};
	const disconnectWebSocket = (currentUser) => {
		if (stompClient) {
			// Set timeout để đảm bảo tin nhắn cuối cùng có đủ thời gian để gửi đi

			const data = {
				userId: currentUser.userId,
				isOnline: false,
			};
			stompClient.send('/app/isOnline', {}, JSON.stringify(data));

			// Đóng kết nối WebSocket sau khi tin nhắn cuối cùng đã được gửi đi
			stompClient.disconnect();
			setStompClient(null);
		}
	};

	return (
		<WebSocketContext.Provider value={{ stompClient, connectWebSocket, disconnectWebSocket, notification }}>
			{children}
		</WebSocketContext.Provider>
	);
};
