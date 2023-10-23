import { Button, Divider, List, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import useTheme from "../../../context/ThemeContext";
import './Sidebar.css';
import { useHistory } from 'react-router-dom';
import {
	FcAbout,
	FcCustomerSupport,
	FcFeedback,
	FcInfo,
	FcPrivacy,
	FcReading,
	FcRefresh,
	FcSettings,
	FcSportsMode,
} from 'react-icons/fc';
const Sidebar = () =>{
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
			title: 'Chuyển tài khoản',
			icon: FcRefresh,
		},
		{
			title: 'Đăng xuất',
			icon: FcSportsMode,
			onClick: logoutHandler,
		},
	];

	const listShortCutAction= [
		{
			title: 'Cài đặt',
			icon: FcSettings,
			href: '/settings',
		},
		{
			title: 'Trợ giúp',
			icon: FcCustomerSupport,
			href: '/help',
		},
		{
			title: 'Báo lỗi',
			icon: FcFeedback,
			onClick: openReport,
		},
		{
			title: 'Giới thiệu',
			icon: FcAbout,
			href: '/about',
		},
		{
			title: 'Điều khoản',
			icon: FcReading,
			href: '/terms',
		},
		{
			title: 'Quyền riêng tư',
			icon: FcInfo,
			href: '/privacy',
		},
		{
			title: 'Bảo mật',
			icon: FcPrivacy,
			href: '/security',
		},
	];

	const lists = [
		{
			title: 'Tài khoản',
			data: listAccountAction,
		},
		{
			title: 'Lối tắt',
			data: listShortCutAction,
		},
	];

	return (
        
		<Space  className="sidebar" direction="vertical" style={{ overflow: 'auto',color: theme.foreground, background: theme.background }}>
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
					dataSource={list.data}S
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
											<item.icon size={20} />

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
										<item.icon size={20} />

										<Typography.Text strong>{item.title}</Typography.Text>
									</Space>
								</Button>
							)}
						</List.Item>
					)}
				/>
			))}
		</Space>
	);
}
export default Sidebar;