import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, Menu } from 'antd';
import ListFriend from './ListFriend';
import './friendRequest.css';
import useAuth from '../../../context/auth/AuthContext';
import useTheme from '../../../context/ThemeContext';
const FriendRequest = ({ inforUser }) => {
	const { user: currentUser } = useAuth();
	const [type, setType] = useState('friend');
	const [title, setTitle] = useState('Bạn bè');
	const changeType = (key) => {
		switch (key) {
			case 'request':
				setTitle('Lời mời kết bạn');
				break;
			case 'sent':
				setTitle('Đã gửi lời mời');
				break;
			case 'suggest':
				setTitle('Gợi ý kết bạn');
				break;
			default:
				setTitle('Bạn bè');
				break;
		}
		setType(key);
	};
	const friendTypeList = [
		{
			type: 'friend',
			title: 'Bạn bè',
			Icon: require('@ant-design/icons').UsergroupAddOutlined,
		},
		{
			type: 'request',
			title: 'Lời mời kết bạn',
			Icon: require('@ant-design/icons').UserAddOutlined,
		},
		{
			type: 'sent',
			title: 'Đã gửi lời mời',
			Icon: require('@ant-design/icons').UserOutlined,
		},
		{
			type: 'suggest',
			title: 'Gợi ý kết bạn',
			Icon: require('@ant-design/icons').UserSwitchOutlined,
		},
	];
	const { theme } = useTheme();
	return (
		<div style={{ color: theme.foreground, background: theme.background }} className="friendUser">
			<Helmet title={`${title}`} />
			<div className="container" style={{ color: theme.foreground, background: theme.background }}>
				<div className="leftbar">
					<Card
						style={{ color: theme.foreground, background: theme.background }}
						title={<span style={{ color: theme.foreground, background: theme.background }}>Danh sách</span>}
						headStyle={{ padding: '0 16px' }}
						bodyStyle={{ padding: 8 }}
					>
						<Menu
							mode="vertical"
							style={{
								color: theme.foreground,
								background: theme.background,
								width: '100%',
								border: 'none',
							}}
							items={friendTypeList.map((item) => ({
								key: item.type,
								icon: <item.Icon size={20} />,
								label: item.title,
							}))}
							selectedKeys={[type]}
							onClick={({ key }) => changeType(key)}
						/>
					</Card>
				</div>

				<div className="centerbar" style={{ color: theme.foreground, background: theme.background }}>
					<ListFriend inforUser={inforUser} currentUser={currentUser} title={title} type={type} />
				</div>
			</div>
		</div>
	);
};

export default FriendRequest;
