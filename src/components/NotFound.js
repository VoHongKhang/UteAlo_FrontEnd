import React from 'react';
import { Layout, Space } from 'antd';
import Topbar from './timeline/topbar/Topbar';
import useTheme from '../context/ThemeContext';
const { Footer, Content } = Layout;

const contentStyle = {
	textAlign: 'center',
	height: 'auto',
	lineHeight: '120px',
	color: 'black',
	backgroundColor: 'white',
};

const NotFound = () => {
	const { theme } = useTheme();
	return (
		<Space
			direction="vertical"
			style={{
				color: theme.foreground,
				background: theme.background,
				width: '100%',
				position: 'fixed',
				top: 0,
				height: '100vh',
			}}
			size={[0, 48]}
		>
			<Topbar />
			<Layout style={{ color: theme.foreground, background: theme.background }}>
				<Content style={contentStyle}>
					<div
						style={{
							color: theme.foreground,
							background: theme.background,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<img src="https://th.bing.com/th/id/OIP.Jb4XrrIxatYfB2DQxV0TngHaFs?pid=ImgDet&rs=1" alt="anh" />
					</div>
					<div
						style={{
							color: theme.foreground,
							background: theme.background,
						}}
					></div>
				</Content>
				<Footer
					style={{
						color: theme.foreground,
						background: theme.background,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						position: 'fixed',
						bottom: 0,
						width: '100%',
					}}
				>
					<p>Copyright © 2023 HCMUTE - All Rights Reserved</p>
					<p>Powered and Designed by Ngô Diệp Quang Huy- Võ Hồng Khang</p>
				</Footer>
			</Layout>
		</Space>
	);
};
export default NotFound;
