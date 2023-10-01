import { Button, Card, Dropdown, Popconfirm, theme, Tooltip, Typography, Image } from 'antd';
import { HiDotsHorizontal } from 'react-icons/hi';
import useUserAction from '../../action/useUserAction';
import { Link } from 'react-router-dom';
import {
	HiArrowDownOnSquareStack,
	HiChatBubbleOvalLeft,
	HiExclamationTriangle,
	HiUser,
	HiUserMinus,
	HiUserPlus,
	HiXMark,
} from 'react-icons/hi2';
import UserAvatar from '../../action/UserAvatar';
import { useEffect } from 'react';
const FriendCard = ({ user, type }) => {

	const { token } = theme.useToken();
	const openReport = () => {};

	const relationshipLabel = {
		friend: 'Bạn bè',
		sent: 'Đã gửi',
		request: 'Chờ xác nhận',
		suggest: 'Chưa kết bạn',
		you: 'Bạn',
	};

	const relationshipColor = {
		friend: 'success',
		sent: 'secondary',
		request: 'warning',
		suggest:'info', 
		you: 'secondary',
	};

	const dropdownItems = [
		{
			key: 'report',
			icon: <HiExclamationTriangle />,
			label: 'Báo cáo',
			onClick: openReport,
		},
	];

	const {
		relationship,
		loading,
		handleRequestFriend,
		handleCancelRequestFriend,
		handleAcceptFriend,
		handleUnfriend,
		handleChat,
		handleRejectFriend,
	} = useUserAction({ ...user, relationship: type });

	useEffect(() => {
		switch (relationship) {
			case 'friend':
				dropdownItems.unshift({
					key: 'unfriend',
					icon: <HiUserMinus />,
					danger: true,
					label: (
						<Popconfirm
							title="Bạn có chắc muốn hủy kết bạn?"
							okText="Hủy kết bạn"
							cancelText="Thoát"
							onConfirm={handleUnfriend}
						>
							Hủy kết bạn
						</Popconfirm>
					),
				});
				break;
			case 'sent':
				dropdownItems.unshift({
					key: 'cancel',
					icon: <HiXMark />,
					danger: true,
					label: (
						<Popconfirm
							title="Bạn có chắc muốn hủy lời mời kết bạn?"
							okText="Hủy lời mời"
							cancelText="Thoát"
							onConfirm={handleCancelRequestFriend}
						>
							Hủy lời mời
						</Popconfirm>
					),
				});
				break;
			case 'request':
				dropdownItems.unshift({
					key: 'decline',
					icon: <HiXMark />,
					danger: true,
					label: (
						<Popconfirm
							title="Bạn có chắc muốn từ chối lời mời kết bạn?"
							okText="Từ chối"
							cancelText="Thoát"
							onConfirm={handleRejectFriend}
						>
							Từ chối
						</Popconfirm>
					),
				});

				dropdownItems.unshift({
					key: 'accept',
					icon: <HiArrowDownOnSquareStack />,
					label: 'Chấp nhận lời mời',
					onClick: handleAcceptFriend,
				});
				break;
			case 'suggest':
				dropdownItems.unshift({
					key: 'add',
					icon: <HiUserPlus />,
					label: 'Kết bạn',
					onClick: handleRequestFriend,
				});
				break;
			default:
				break;
		}
	}, [relationship]);
	return (
		<Card
			hoverable
			cover={
				<Image
					width="100%"
					height={100}
					src={user?.background || 'http://via.placeholder.com/200x100?text='}
					alt={user.name}
					style={{ objectFit: 'cover', background: token.colorBgLayout }}
				/>
			}
			actions={[
				<Tooltip key="profile" title="Trang cá nhân">
					<Link to={`/profile/${user.id}`} passHref draggable>
						<Button icon={<HiUser />} />
					</Link>
				</Tooltip>,
				<Tooltip key="message" title="Nhắn tin">
					<Button
						icon={<HiChatBubbleOvalLeft />}
						onClick={handleChat}
						disabled={false}
						loading={loading.chat}
					/>
				</Tooltip>,
				<Dropdown key="more" menu={{ items: dropdownItems }} arrow disabled={false} trigger={['click']}>
					<Button
						icon={<HiDotsHorizontal />}
						disabled={false}
						loading={Object.keys(loading).some((item) => item !== 'chat' && loading[item])} // loading doesn't include chat
					/>
				</Dropdown>,
			]}
			bodyStyle={{ padding: 12 }}
		>
			<Card.Meta
				avatar={<UserAvatar user={user} />}
				title={user.name}
				description={
					<Typography.Text strong type={relationshipColor[relationship]}>
						{relationshipLabel[relationship]}
					</Typography.Text>
				}
			/>
		</Card>
	);
};
export default FriendCard;
