import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, Menu } from 'antd';
import ListFriend from './ListFriend';
import Topbar from '../../timeline/topbar/Topbar';
import './friendRequest.css';

const FriendRequest = () => {
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
			type:'suggest',
			title: 'Gợi ý kết bạn',
			Icon: require('@ant-design/icons').UserSwitchOutlined,
		}
	];
	return (
		<>
			<Helmet title={`${title}`} />
			<Topbar />
			<div className="container">
				<div className="leftbar">
					<Card title="Danh sách" headStyle={{ padding: '0 16px' }} bodyStyle={{ padding: 8 }}>
						<Menu
							mode="vertical"
							style={{ width: '100%', border: 'none' }}
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

				<div className="centerbar">
					<ListFriend title={title} type={type} />
				</div>
			</div>
		</>
	);
};

export default FriendRequest;
