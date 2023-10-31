import { Button, Divider, List, Space, Typography } from 'antd';
import useTheme from '../../../../context/ThemeContext';
import './SidebarManagerGroup.css';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Settings, GraphicEq, Group, VerifiedUser, ViewAgenda, Help } from '@material-ui/icons';
const SidebarManagerGroup = ({ user, groupId }) => {
	const { theme } = useTheme();
	const navigate = useNavigate();
	const handlerAddMember = () => {
		console.log('Add member');
	};
	const listAccountAction = [
		{
			postGroupName: 'Tổng quan',
			avatarGroup: <ViewAgenda style={{ fontSize: '25px', margin: 'auto' }} />,
			href: `/groups/manager/${groupId}`,
		},
		{
			postGroupName: 'Cài đặt nhóm ',
			avatarGroup: <Settings style={{ fontSize: '25px', margin: 'auto' }} />,
			href: `/groups/manager/${groupId}/edit`,
		},
		{
			postGroupName: 'Xem thành viên nhóm',
			avatarGroup: <Group style={{ fontSize: '25px', margin: 'auto' }} />,
			href: `/groups/manager/${groupId}/member`,
		},

		{
			postGroupName: 'Yêu cầu tham gia nhóm',
			avatarGroup: <VerifiedUser style={{ fontSize: '25px', margin: 'auto' }} />,
			href: `/groups/manager/${groupId}/participant_requests`,
		},
		{
			postGroupName: 'Phân tích dữ liệu',
			avatarGroup: <GraphicEq style={{ fontSize: '25px', margin: 'auto' }} />,
			href: `/groups/manager/${groupId}/analysis`,
		},

		{
			postGroupName: 'Hỗ trợ',
			avatarGroup: <Help style={{ fontSize: '25px', margin: 'auto' }} />,
			href: `/groups/manager/${groupId}/help`,
		},
	];
	const lists = [
		{
			data: listAccountAction,
		},
	];
	const openMore = () => {
		console.log('Open more');
	};
	return (
		<div className="sidebar--group">
			<Space className="topSidebar" direction="vertical">
				<div className="topSidebar--back">
					<div className="icon-back" onClick={() => navigate(`/groups/${groupId}`)}>
						<ArrowBack
							className="topSidebar--back-icon"
							style={{
								fontSize: '25px',
							}}
						/>
					</div>
					<div className="group--infor-introduce">Quản lý nhóm</div>
				</div>
				<div className="topSidebar__addMemberGroup">
					<Button type="primary" block className="topSidebar__button" onClick={handlerAddMember}>
						<span className="addMember--icon--plus">+</span>
						<span className="addMemberGroup--text">Mời</span>
					</Button>
					<Button type="default" block className="button--more" onClick={openMore}>
						...
					</Button>
				</div>
			</Space>
			<Space
				className="sidebar__group"
				direction="vertical"
				style={{ color: theme.foreground, background: theme.background }}
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
								<Button
									type="text"
									block
									style={{ height: 'auto', padding: '8px' }}
									onClick={() => {
										navigate(item.href);
									}}
								>
									<Space align="center" style={{ width: '100%', marginLeft: '10px' }}>
										<div className="icon-back">{item.avatarGroup}</div>
										<div style={{ marginTop: '14px' }}>
											<Typography.Text strong>
												<div style={{ fontSize: '15px' }}>{item.postGroupName}</div>
											</Typography.Text>
										</div>
									</Space>
								</Button>
							</List.Item>
						)}
					/>
				))}
			</Space>
		</div>
	);
};
export default SidebarManagerGroup;
