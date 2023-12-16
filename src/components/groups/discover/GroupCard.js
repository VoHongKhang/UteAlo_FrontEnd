import { Button, Card, Dropdown, Popconfirm, theme, Tooltip, Typography, Image } from 'antd';
import { HiDotsHorizontal } from 'react-icons/hi';
import userAction from '../../action/useUserAction';
import useAuth from '../../../context/auth/AuthContext';
import '../discover/GroupCard.css';
import { HiArrowDownOnSquareStack, HiExclamationTriangle, HiUserMinus, HiXMark } from 'react-icons/hi2';
import UserAvatar from '../../action/UserAvatar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const GroupCard = ({ user, type }) => {
	const navigate = useNavigate();
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
		friend: 'Đã tham gia',
		sent: 'Đã gửi',
		request: 'Chờ xác nhận',
		decline: 'Đã từ chối',
		cancel: 'Đã hủy',
		leaveGroup: 'Đã rời nhóm',
		you: 'Bạn',
	};

	const relationshipColor = {
		friend: 'success',
		sent: 'secondary',
		request: 'warning',
		decline: 'danger',
		cancel: 'danger',
		suggest: 'info',
		leaveGroup: 'danger',
		you: 'secondary',
	};
	const [dropdownItems, setDropdownItems] = useState([]);
	const friend = [
		{
			key: 'leaveGroup',
			icon: <HiUserMinus />,
			danger: true,
			label: (
				<Popconfirm
					title="Bạn có chắc muốn rời nhóm?"
					okText="Rời nhóm"
					cancelText="Thoát"
					onConfirm={() => handleFriend({ tempt: 'leaveGroup', relationship: 'leaveGroup' })}
				>
					Rời nhóm
				</Popconfirm>
			),
		},
	];
	const send = [
		{
			key: 'cancelJoinGroup',
			icon: <HiXMark />,
			danger: true,
			label: (
				<Popconfirm
					title="Bạn có chắc muốn hủy lời mời vào nhóm?"
					okText="Hủy lời mời"
					cancelText="Thoát"
					onConfirm={() => handleFriend({ tempt: 'cancelJoinGroup', relationship: 'cancel' })}
				>
					Hủy lời mời
				</Popconfirm>
			),
		},
	];
	const request = [
		{
			key: 'acceptJoinGroup',
			icon: <HiArrowDownOnSquareStack />,
			label: 'Chấp nhận lời mời',
			onClick: () => handleFriend({ tempt: 'acceptJoinGroup', relationship: 'friend' }),
		},
		{
			key: 'declineJoinGroup',
			icon: <HiExclamationTriangle />,
			danger: true,
			label: (
				<Popconfirm
					title="Bạn có chắc muốn từ chối lời mời vào nhóm?"
					okText="Từ chối"
					cancelText="Thoát"
					onConfirm={() => handleFriend({ tempt: 'declineJoinGroup', relationship: 'decline' })}
				>
					Từ chối
				</Popconfirm>
			),
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
					src={user?.backgroundGroup || 'http://via.placeholder.com/200x100?text='}
					alt={user.postGroupName}
					style={{ objectFit: 'cover', background: token.colorBgLayout }}
				/>
			}
			actions={[
				<Dropdown key="more" menu={{ items: dropdownItems }} arrow disabled={false} trigger={['click']}>
					<Button
						className="btn--action"
						icon={<HiDotsHorizontal />}
						disabled={false}
						loading={Object.keys(loading).some((item) => item !== 'chat' && loading[item])} // loading doesn't include chat
					/>
				</Dropdown>,
			]}
			bodyStyle={{ padding: 12 }}
		>
			<Card.Meta
				className="card--meta-group"
				avatar={<UserAvatar user={user} />}
				title={'Nhóm: ' + user.postGroupName.toUpperCase()}
				description={
					<div>
						<Typography.Text strong type={relationshipColor[relationship]}>
							{relationshipLabel[relationship]}
						</Typography.Text>

						<div className="card--description">
							<Typography.Text className="card--description-text">
								{type === 'sent' ? 'Gửi đến' : type === 'request' ? 'Người mời' : ''}:{' '}
								<span
									style={{ cursor: 'pointer' }}
									onClick={() => navigate(`/profile/${user?.userId}`)}
								>
									{user.userName}
								</span>
							</Typography.Text>
						</div>
					</div>
				}
			/>
		</Card>
	);
};
export default GroupCard;
