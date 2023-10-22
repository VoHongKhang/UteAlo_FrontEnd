import { Button, Divider, List, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import useTheme from '../../context/ThemeContext';
import './Sidebar.css';
import { useHistory } from 'react-router-dom';
import { Search, Settings, RssFeed, Explore, People } from '@material-ui/icons';
import PostGroupApi from '../../api/postGroups/PostGroupApi';
import { useState } from 'react';
import { useEffect } from 'react';
import noAvatar from '../../assets/appImages/user.png';

const Sidebar = ({ user }) => {
	const { theme } = useTheme();
	const history = useHistory();
	const [listGroupOfMe, setListGroupOfMe] = useState([]);
	const [listGroupJoin, setListGroupJoin] = useState([]);
	const discoverHandler = () => {};
	const ownerGroupHandler = () => {};

	const listAccountAction = [
		{
			postGroupName: 'Bảng feed của bạn',
			avatarGroup: <RssFeed style={{ fontSize: '25px', margin: 'auto' }} />,
		},
		{
			postGroupName: 'Khám phá',
			avatarGroup: <Explore style={{ fontSize: '25px', margin: 'auto' }} />,
			onClick: discoverHandler,
		},
		{
			postGroupName: 'Nhóm của bạn',
			avatarGroup: <People style={{ fontSize: '25px', margin: 'auto' }} />,
			onClick: ownerGroupHandler,
		},
	];
	useEffect(async () => {
		const res = await PostGroupApi.listOwnerGroup(user);
		setListGroupOfMe(res.result);
		const resList = await PostGroupApi.listJoinGroup(user);
		setListGroupJoin(resList.result);
	}, [user]);
	const lists = [
		{
			data: listAccountAction,
		},

		{
			title: 'Nhóm bạn đã tham gia',
			data: listGroupJoin,
		},
		{
			title: 'Nhóm do bạn quản lý',
			data: listGroupOfMe,
		},
	];

	return (
		<>
			<Space className="topSidebar" direction="vertical">
				<div className="topSidebar--setting">
					<div className="group--infor-introduce">Nhóm</div>
					<div className="icon-setting">
						<Settings
							className="topSidebar--setting-icon"
							style={{
								fontSize: '25px',
							}}
						/>
					</div>
				</div>
				<div className="topSidebar__search">
					<Search
						className="icon__search"
						style={{
							marginLeft: '10px',
							fontSize: '24px',
						}}
					/>
					<input type="text" placeholder="Tìm kiếm nhóm" className="input__search" />
				</div>
				<div className="topSidebar__createGroup">
					<Button type="primary" block className="topSidebar__button">
						<span className="icon--plus">+</span>
						<span className="createGroup--text">Tạo nhóm mới</span>
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
												<img
													src={item.avatarGroup}
													alt="avatar_group"
													className="image--group"
												/>
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
										<Space align="center" style={{ width: '100%', marginLeft: '10px' }}>
											<div className="icon-setting">{item.avatarGroup}</div>
											<div style={{ marginTop: '14px' }}>
												<Typography.Text strong >
													<div style={{ fontSize: '15px' }}>{item.postGroupName}</div>
												</Typography.Text>
											</div>
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
