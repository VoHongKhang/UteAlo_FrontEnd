import React from 'react';
import Application from './App';
import { AuthProvider } from './context/auth/AuthContext';
import { PostProvider } from './context/post/PostContext';
import { ProfileProvider } from './context/profile/ProfileContext';
import { ThemeProvider } from './context/ThemeContext';
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';
import { WebSocketProvider } from './context/WebSocketContext';
import { ConfigProvider } from 'antd';
import { App } from 'antd';
import viVn from 'antd/locale/vi_VN';
const root = createRoot(document.getElementById('root'));
root.render(
	<ConfigProvider locale={viVn}>
		<WebSocketProvider>
			<ThemeProvider>
				<AuthProvider>
					<PostProvider>
						<ProfileProvider>
							<App>
								<Application />
							</App>
						</ProfileProvider>
					</PostProvider>
				</AuthProvider>
			</ThemeProvider>
		</WebSocketProvider>
	</ConfigProvider>
);

reportWebVitals();
