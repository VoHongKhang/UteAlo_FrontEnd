import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, Menu } from 'antd';
import ListDiscover from '../discover/ListDiscover';
import Topbar from '../../timeline/topbar/Topbar';
import '../../friend/friendRequest/friendRequest.css';
import useAuth from '../../../context/auth/AuthContext';
import SidebarGroup from '../sidebar/SidebarGroup';
const DiscoverGroup = () => {
	const {user: currentUser} = useAuth();
	const [type, setType] = useState('friend');
	const [title, setTitle] = useState('Bạn bè');
	const changeType = (key) => {
		switch (key) {
			case 'request':
				setTitle('Lời mời vào nhóm');
				break;
			case 'sent':
				setTitle('Đã gửi lời mời vào nhóm');
				break;
			default:
				setTitle('Nhóm');
				break;
		}
		setType(key);
	};
	const friendTypeList = [
		{
			type: 'friend',
			title: 'Nhóm',
			Icon: require('@ant-design/icons').UsergroupAddOutlined,
		},
		{
			type: 'request',
			title: 'Lời mời vào nhóm',
			Icon: require('@ant-design/icons').UserAddOutlined,
		},
		{
			type: 'sent',
			title: 'Đã gửi lời mời vào nhóm',
			Icon: require('@ant-design/icons').UserOutlined,
		}
	];
	return (
		<>
			<Helmet title={`${title}`} />
			<Topbar />
			<div className="homeContainer">
			<SidebarGroup user={currentUser} />
				

				<div className="centerbar">
					<ListDiscover currentUser ={currentUser} title={title} type={type} />
				</div>

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
			</div>
		</>
	);
};

export default DiscoverGroup;
