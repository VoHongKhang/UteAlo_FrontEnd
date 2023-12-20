import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { publicRoutes, privateRoutes, notFoundRoute } from './routes/Routers';
import useAuth from './context/auth/AuthContext';
import { useWebSocket } from './context/WebSocketContext';
import DefaultLayout from './layouts/DefaultLayout';
export default function Application() {
	const { user: currentUser } = useAuth();
	const Page404 = notFoundRoute.component;
	const { connectWebSocket, disconnectWebSocket } = useWebSocket();
	const isComponentUnmounted = useRef(false);
	window.addEventListener('beforeunload', async function (event) {
		// Hủy bỏ sự kiện ngăn chặn đóng trang
		event.preventDefault();

		// Gọi hàm disconnectWebSocket(currentUser) và đợi nó hoàn thành
		await disconnectWebSocket(currentUser);

		// Thực hiện đóng trang
		const confirmationMessage = 'Bạn có chắc muốn rời khỏi trang?';
		event.returnValue = confirmationMessage;

		return confirmationMessage;
	});

	useEffect(() => {
		// Thực hiện kết nối khi component được mount
		connectWebSocket(currentUser);
		return () => {
			// Kiểm tra xem component đã unmount chưa trước khi thực hiện disconnect
			if (!isComponentUnmounted.current) {
				disconnectWebSocket(currentUser);
			}
		};
	}, [currentUser]);

	return (
		<BrowserRouter>
			<Routes>
				<>
					{publicRoutes.map((route, index) => {
						const Page = route.component;
						return <Route key={index} path={route.path} element={<Page />} />;
					})}
					,
					{privateRoutes.map((route, index) => {
						return (
							<Route
								key={index}
								path={route.path}
								element={
									currentUser ? (
										<DefaultLayout
											Topbar={route.topbar}
											Page={route.component}
											SideBar={route.sidebar}
											RightBar={route.rightbar}
										/>
									) : (
										<Navigate to="/login" replace />
									)
								}
							/>
						);
					})}
					,
					<Route key={notFoundRoute.path} path={notFoundRoute.path} element={<Page404 />} />,
				</>
			</Routes>
		</BrowserRouter>
	);
}
