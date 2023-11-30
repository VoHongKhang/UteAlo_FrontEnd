import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { publicRoutes, privateRoutes, notFoundRoute } from './routes/Routers';
import useAuth from './context/auth/AuthContext';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
export default function App() {
	const { user: currentUser } = useAuth();
	const Page404 = notFoundRoute.component;

	const onError = (err) => {
		console.log(err);
	};
	useEffect(() => {
		var stompClient = null;
		// Kết nối với web socketJS và STOMPJS
		const onConnected = () => {
			//Đăng ký vào kênh chat nhận thông báo
			stompClient.subscribe('/notification/' + currentUser.userId + '/notify', (data) => {
				var payloadData = JSON.parse(data.body);
				console.log('payloadData', payloadData);
			});

		};
		if (currentUser) {
			let Sock = new SockJS('http://localhost:8089/ws');
			stompClient = over(Sock);
			stompClient.connect({}, onConnected, onError);

			const chatMessage = {
				senderId: "424e1709-68b4-4401-a0a6-fc0963e17805",
				avatar: 'https://i.pravatar.cc/150?img=3',
				content: 'Hello',
				link: 'http://localhost:3000',
				createAt: new Date(),
				status: 'UNREAD',
			};

			setTimeout(() => {
				stompClient.send('/app/private-notification', {}, JSON.stringify(chatMessage));
				console.log('send');
			}, 5000);
		}
		return () => {
			if (stompClient) {
				stompClient.disconnect();
			}
		};
	}, [currentUser]);

	return (
		<BrowserRouter>
			<Routes>
				{publicRoutes.map((route, index) => {
					const Page = route.component;
					return <Route key={index} path={route.path} element={<Page />} />;
				})}
				,
				{privateRoutes.map((route, index) => {
					const Page = route.component;
					return (
						<Route
							key={index}
							path={route.path}
							element={
								currentUser ? (
									// <DefaultLayout Topbar={topbar} SideBar={sidebar} RightBar={rightbar}>
									// 	<Page />
									// </DefaultLayout>
									<Page />
								) : (
									<Navigate to="/login" replace />
								)
							}
						/>
					);
				})}
				,
				<Route key={notFoundRoute.path} path={notFoundRoute.path} element={<Page404 />} />,
			</Routes>
		</BrowserRouter>
	);
}
