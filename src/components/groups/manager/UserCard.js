import { Button, Card, Dropdown, Popconfirm, theme, Tooltip, Typography, Image } from 'antd';
import { HiDotsHorizontal } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import useAuth from '../../../context/auth/AuthContext';
import { HiArrowDownOnSquareStack, HiChatBubbleOvalLeft, HiExclamationTriangle, HiUser } from 'react-icons/hi2';
import UserAvatar from '../../action/UserAvatar';
import { useState } from 'react';
import sampleProPic from '../../../assets/appImages/cover1.png';
import toast from 'react-hot-toast';
import PostGroupApi from '../../../api/postGroups/PostGroupApi';
import { useWebSocket } from '../../../context/WebSocketContext';
const UserCard = ({ user, group, inforUser }) => {
	const { user: currentUser } = useAuth();
	const [title, setTitle] = useState('Yêu cầu vào nhóm');
	const { stompClient } = useWebSocket();
	const handleFriend = async (tempt) => {
		if (tempt === 'accept') {
			const toastId = toast.loading('Đang gửi yêu cầu...');
			try {
				const data = {
					postGroupId: group?.postGroupId,
					userId: [user.userId],
				};
				await PostGroupApi.acceptMemberGroup({ user: currentUser, data: data });
				const dataNotification = {
					groupId: group?.postGroupId,
					userId: user.userId,
					photo: group?.avatar,
					content: `Bạn đã được chấp nhận vào nhóm ${group?.postGroupName}`,
					link: `/groups/${group?.postGroupId}`,
					isRead: false,
					createAt: new Date().toISOString(),
					updateAt: new Date().toISOString(),
				};
				stompClient.send('/app/userNotify/' + inforUser?.userId, {}, JSON.stringify(dataNotification));
				toast.success('Thêm thành viên thành công!', { id: toastId });
				setTitle('Đã chấp nhận');
			} catch (e) {
				toast.error(`Thêm thành viên thất bại! Lỗi: ${e}`, { id: toastId });
			}
		} else if (tempt === 'decline') {
			const toastId = toast.loading('Đang gửi yêu cầu...');
			try {
				const data = {
					postGroupId: group?.postId,
					userId: [user.userId],
				};
				await PostGroupApi.declineMemberRequired({ user: currentUser, data: data });
				toast.success('Từ chối thành viên thành công!', { id: toastId });
				setTitle('Đã từ chối thành viên');
			} catch (e) {
				toast.error(`Từ chối thành viên thất bại! Lỗi: ${e}`, { id: toastId });
			}
		}
	};

	const { token } = theme.useToken();
	const poperHandle = [
		{
			key: 'accept',
			icon: <HiArrowDownOnSquareStack />,
			label: 'Chấp nhận thành viên',
			onClick: () => handleFriend('accept'),
		},
		{
			key: 'decline',
			icon: <HiExclamationTriangle />,
			danger: true,
			label: (
				<Popconfirm
					title="Bạn có chắc muốn từ chối lời mời kết bạn?"
					okText="Từ chối"
					cancelText="Thoát"
					onConfirm={() => handleFriend('decline')}
				>
					Từ chối
				</Popconfirm>
			),
		},
	];
	return (
		<Card
			hoverable={true}
			cover={
				<Image
					width="100%"
					height={100}
					src={user?.backgroundUser || sampleProPic}
					alt={user.username}
					style={{ objectFit: 'cover', background: token.colorBgLayout }}
				/>
			}
			actions={[
				<Tooltip key="profile" title="Trang cá nhân">
					<Link to={`/profile/${user.userId}`}>
						<Button icon={<HiUser />} />
					</Link>
				</Tooltip>,
				<Tooltip key="message" title="Nhắn tin">
					<Button
						icon={<HiChatBubbleOvalLeft />}
						onClick={() => handleFriend({ tempt: 'chat' })}
						disabled={false}
					/>
				</Tooltip>,
				<Dropdown key="more" menu={{ items: poperHandle }} arrow disabled={false} trigger={['click']}>
					<Button icon={<HiDotsHorizontal />} disabled={false} />
				</Dropdown>,
			]}
			bodyStyle={{ padding: 12 }}
		>
			<Card.Meta
				avatar={<UserAvatar user={user} />}
				title={user.username}
				description={<Typography.Text strong={true}>{title}</Typography.Text>}
			/>
		</Card>
	);
};
export default UserCard;
