import React from 'react';
import { Layout, Space } from 'antd';
import Topbar from './timeline/topbar/Topbar';
const { Footer, Content } = Layout;

const contentStyle = {
	textAlign: 'center',
	height: 'auto',
	lineHeight: '120px',
	color: 'black',
	backgroundColor: 'white',
};
const footerStyle = {
	textAlign: 'center',
	color: 'black',
	width: '100%',
	backgroundColor: 'white',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	position: 'fixed',
	bottom: 0,
};

const NotFound = () => {
	return (
		<Space direction="vertical" style={{ width: '100%', position: 'fixed', top: 0 }} size={[0, 48]}>
			<Topbar />
			<Layout>
				<Content style={contentStyle}>
					<div style={{ width: '80%', height: '50%' }}>
						<img
							src="https://th.bing.com/th/id/OIP.Jb4XrrIxatYfB2DQxV0TngHaFs?pid=ImgDet&rs=1"
							alt="anh"
							style={{ margin: '0 0 0 300px' }}
						/>
					</div>
					<div>
						<p>Science (Khoa học), Technology (Công nghệ), Engineering(Kỹ thuật), Maths(Toán học)</p>
					</div>
				</Content>
				<Footer style={footerStyle}>
					<p>Copyright © 2023 HCMUTE - All Rights Reserved</p>
					<p>Powered and Designed by Ngô Diệp Quang Huy- Võ Hồng Khang</p>
				</Footer>
			</Layout>
		</Space>
	);
};
export default NotFound;
