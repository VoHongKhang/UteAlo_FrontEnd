import { Button, Divider, List, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import useTheme from '../../context/ThemeContext';
import './Sidebar.css';
import { useHistory } from 'react-router-dom';
import { Add, Search } from '@material-ui/icons';

const Sidebar = () => {
	const { theme } = useTheme();
	const history = useHistory();
	const openReport = () => {
		// openModal(<ReportModal />);
	};

	//Đăng xuất
	const logoutHandler = () => {
		localStorage.removeItem('userInfo');
		history.go('/login');
	};

	const listAccountAction = [
		{
			title: 'Bảng feed của bạn',
			icon: 'https://s.net.vn/7mBE',
		},
		{
			title: 'Khám phá',
			icon: 'https://s.net.vn/7mBE',
			onClick: logoutHandler,
		},
		{
			title: 'Nhóm của bạn',
			icon: 'https://s.net.vn/7mBE',
			onClick: logoutHandler,
		},
	];
	const listGroupOfMe = [];

	const listShortCutAction = [
		{
			title: 'Cài đặt',
			icon: 'https://s.net.vn/7mBE',
			href: '/settings',
		},
		{
			title: 'Trợ giúp',
			icon: 'https://s.net.vn/7mBE',
			href: '/help',
		},
	];

	const lists = [
		{
			data: listAccountAction,
		},

		{
			title: 'Nhóm bạn đã tham gia',
			data: listShortCutAction,
		},
		{
			title: 'Nhóm do bạn quản lý',
			data: listGroupOfMe,
		},
	];

	return (
		<>
			<Space className="topSidebar" direction="vertical">
				<div className="topSidebar__search">
					<Search className="icon__search" />
					<input type="text" placeholder="Tìm kiếm" className="input__search" />
				</div>
				<div className="topSidebar__createGroup">
					<Button type="primary" block className="topSidebar__button">
						<Add /> Tạo nhóm
					</Button>
				</div>
			</Space>
			<Space
				className="sidebar__group"
				direction="vertical"
				style={{ overflow: 'auto', color: theme.foreground, background: theme.background, width: '90%' }}
			>
				{lists.map((list, index) => (
					<List
						key={index}
						header={
							<Divider orientation="left" style={{ margin: 0 }}>
								<Typography.Title level={4} style={{ margin: 0 }}>
									{list.title}
								</Typography.Title>
							</Divider>
						}
						split={false}
						dataSource={list.data}
						renderItem={(item) => (
							<List.Item style={{ padding: '4px 0' }}>
								{item.href ? (
									<Link to={item.href} draggable style={{ width: '100%' }}>
										<Button
											type="text"
											block
											style={{ height: 'auto', padding: '8px' }}
											onClick={item.onClick}
										>
											<Space align="center" style={{ width: '100%' }}>
												<img src={item.icon} alt="avatar_group" className="image--group" />
												<Typography.Text strong>{item.title}</Typography.Text>
											</Space>
										</Button>
									</Link>
								) : (
									<Button
										type="text"
										block
										style={{ height: 'auto', padding: '8px' }}
										onClick={item.onClick}
									>
										<Space align="center" style={{ width: '100%' }}>
											<img src={item.icon} alt="avatar_group" className="image--group" />

											<Typography.Text strong>{item.title}</Typography.Text>
										</Space>
									</Button>
								)}
							</List.Item>
						)}
					/>
				))}
			</Space>
		</>
	);
};
export default Sidebar;
