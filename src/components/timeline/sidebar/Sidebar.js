import { Button, Divider, List, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import useTheme from '../../../context/ThemeContext';
import './Sidebar.css';
import { CiLogout } from 'react-icons/ci';
import { AiOutlineUserSwitch } from 'react-icons/ai';
import { IoSettingsOutline } from 'react-icons/io5';
import { BiSupport } from 'react-icons/bi';
import { MdRunningWithErrors } from 'react-icons/md';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { MdOutlinePolicy } from 'react-icons/md';
import { GrSecure } from 'react-icons/gr';
import { RiChatPrivateLine } from 'react-icons/ri';
import { useWebSocket } from '../../../context/WebSocketContext';
import useAuth from '../../../context/auth/AuthContext';
const Sidebar = () => {
	const { theme } = useTheme();
	const { disconnectWebSocket } = useWebSocket();
	const { user: currentUser } = useAuth();
	const openReport = () => {
		// openModal(<ReportModal />);
	};

	//Đăng xuất
	const logoutHandler = async () => {
		await disconnectWebSocket(currentUser);

		setTimeout(() => {
			localStorage.removeItem('userInfo');
			// try {
			// 	await AuthEmailApi.logout(currentUser);
			// } catch {
			// 	console.log('Lỗi đăng xuất');
			// }
			window.location.href = '/login';
		}, 1000);
	};

	const listAccountAction = [
		{
			title: 'Chuyển tài khoản',
			icon: AiOutlineUserSwitch,
		},
		{
			title: 'Đăng xuất',
			icon: CiLogout,
			onClick: logoutHandler,
		},
	];

	const listShortCutAction = [
		{
			title: 'Cài đặt',
			icon: IoSettingsOutline,
			href: '/settings',
		},
		{
			title: 'Trợ giúp',
			icon: BiSupport,
			href: '/help',
		},
		{
			title: 'Báo lỗi',
			icon: MdRunningWithErrors,
			onClick: openReport,
		},
		{
			title: 'Giới thiệu',
			icon: IoMdInformationCircleOutline,
			href: '/about',
		},
		{
			title: 'Điều khoản',
			icon: MdOutlinePolicy,
			href: '/terms',
		},
		{
			title: 'Quyền riêng tư',
			icon: RiChatPrivateLine,
			href: '/privacy',
		},
		{
			title: 'Bảo mật',
			icon: GrSecure,
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
		<Space
			className="sidebar"
			direction="vertical"
			style={{ color: theme.foreground, background: theme.background }}
		>
			{lists.map((list, index) => (
				<List
					key={index}
					header={
						<Divider orientation="left" style={{ margin: 0 }}>
							<Typography.Title
								level={4}
								style={{ color: theme.foreground, background: theme.background, margin: 0 }}
							>
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
										style={{
											color: theme.foreground,
											background: theme.background,
											height: 'auto',
											padding: '8px',
										}}
										onClick={item.onClick}
									>
										<Space
											align="center"
											style={{
												color: theme.foreground,
												background: theme.background,
												width: '100%',
											}}
											className="slider--bar--item"
										>
											<item.icon size={20} />

											<Typography.Text
												style={{
													color: theme.foreground,
													background: theme.background,
												}}
												strong
											>
												{item.title}
											</Typography.Text>
										</Space>
									</Button>
								</Link>
							) : (
								<Button
									type="text"
									block
									style={{
										color: theme.foreground,
										background: theme.background,
										height: 'auto',
										padding: '8px',
									}}
									onClick={item.onClick}
								>
									<Space
										align="center"
										style={{ color: theme.foreground, background: theme.background, width: '100%' }}
										className="slider--bar--item"
									>
										<item.icon size={20} />

										<Typography.Text
											style={{
												color: theme.foreground,
												background: theme.background,
											}}
											strong
										>
											{item.title}
										</Typography.Text>
									</Space>
								</Button>
							)}
						</List.Item>
					)}
				/>
			))}
		</Space>
	);
};
export default Sidebar;
