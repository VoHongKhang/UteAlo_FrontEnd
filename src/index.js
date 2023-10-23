import React from 'react';
import App from './App';
import { AuthProvider } from './context/auth/AuthContext';
import { PostProvider } from './context/post/PostContext';
import { ProfileProvider } from './context/profile/ProfileContext';
import { ThemeProvider } from './context/ThemeContext';
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
	<ThemeProvider>
		<AuthProvider>
			<PostProvider>
				<ProfileProvider>
					<App />
				</ProfileProvider>
			</PostProvider>
		</AuthProvider>
	</ThemeProvider>
);

reportWebVitals();
