import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import { publicRoutes, privateRoutes, notFoundRoute } from './routes/Routers';
import DefaultLayout from './layouts/DefaultLayout';
import useAuth from './context/auth/AuthContext';
export default function App() {
	const { user: currentUser } = useAuth();
	console.log('user', currentUser);
	const Page404 = notFoundRoute.component;
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
						const topbar = route?.topbar ? route?.topbar : null;
						const sidebar = route?.sidebar ? route?.sidebar : null;
						const rightbar = route?.rightbar ? route?.rightbar : null;
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
