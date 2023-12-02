import { Button, Card, Dropdown, Popconfirm, theme, Tooltip, Typography, Image } from 'antd';
import { HiDotsHorizontal } from 'react-icons/hi';
import userAction from '../../action/useUserAction';
import { Link } from 'react-router-dom';
import useAuth from '../../../context/auth/AuthContext';
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
import { useState, useEffect } from 'react';
const FriendCard = ({ user, type }) => {
	const { user: currentUser } = useAuth();
	const [userState, setUserState] = useState(user);
	const [loading, setLoading] = useState({});
	const [relationship, setRelationship] = useState(type);
	const [friendHandler, setFriendHandler] = useState({});
	const handleFriend = ({ tempt, relationship }) => {
		setFriendHandler({ tempt, relationship });
	};
	useEffect(() => {
		if (Object.keys(friendHandler).length > 0) {
			const handleFriend = async (friendHandler) => {
				setLoading({ ...loading, [friendHandler.tempt]: true });
				await userAction({ currentUser: currentUser, user: userState, action: friendHandler.tempt });
				setLoading({ ...loading, [friendHandler.tempt]: false });
				setRelationship(friendHandler.relationship);
			};
			handleFriend(friendHandler);
		}
	}, [friendHandler]);

	useEffect(() => {
		setUserState(user);
		setRelationship(type);
	}, [type, user]);

	const { token } = theme.useToken();
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
		suggest: 'info',
		you: 'secondary',
	};
	const [dropdownItems, setDropdownItems] = useState([]);
	const friend = [
		{
			key: 'unfriend',
			icon: <HiUserMinus />,
			danger: true,
			label: (
				<Popconfirm
					title="Bạn có chắc muốn hủy kết bạn?"
					okText="Hủy kết bạn"
					cancelText="Thoát"
					onConfirm={() => handleFriend({ tempt: 'unfriend', relationship: 'suggest' })}
				>
					Hủy kết bạn
				</Popconfirm>
			),
		},
	];
	const send = [
		{
			key: 'cancel',
			icon: <HiXMark />,
			danger: true,
			label: (
				<Popconfirm
					title="Bạn có chắc muốn hủy lời mời kết bạn?"
					okText="Hủy lời mời"
					cancelText="Thoát"
					onConfirm={() => handleFriend({ tempt: 'cancel', relationship: 'suggest' })}
				>
					Hủy lời mời
				</Popconfirm>
			),
		},
	];
	const request = [
		{
			key: 'accept',
			icon: <HiArrowDownOnSquareStack />,
			label: 'Chấp nhận lời mời',
			onClick: () => handleFriend({ tempt: 'accept', relationship: 'friend' }),
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
					onConfirm={() => handleFriend({ tempt: 'decline', relationship: 'suggest' })}
				>
					Từ chối
				</Popconfirm>
			),
		},
	];
	const suggest = [
		{
			key: 'add',
			icon: <HiUserPlus />,
			label: 'Kết bạn',
			onClick: () => handleFriend({ tempt: 'add', relationship: 'sent' }),
		},
	];

	useEffect(() => {
		switch (relationship) {
			case 'friend':
				setDropdownItems(friend);
				break;
			case 'sent':
				setDropdownItems(send);
				break;
			case 'request':
				setDropdownItems(request);
				break;
			case 'suggest':
				setDropdownItems(suggest);
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
					<Link to={`/message/${user.userId}`}>
						<Button icon={<HiChatBubbleOvalLeft />} />
					</Link>
				</Tooltip>,
				<Tooltip key="more" title="Xem thêm">
					<Dropdown key="more" menu={{ items: dropdownItems }} arrow disabled={false} trigger={['click']}>
						<Button
							icon={<HiDotsHorizontal />}
							disabled={false}
							loading={Object.keys(loading).some((item) => item !== 'chat' && loading[item])} // loading doesn't include chat
						/>
					</Dropdown>
					,
				</Tooltip>,
			]}
			bodyStyle={{ padding: 12 }}
		>
			<Card.Meta
				avatar={<UserAvatar user={user} />}
				title={user.username}
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
