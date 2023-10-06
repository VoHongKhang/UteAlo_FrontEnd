import { Avatar, Badge, Skeleton, theme, Tooltip } from 'antd';
import { HiUser } from 'react-icons/hi2';
import styles from './UserAvatar.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const UserAvatar = ({ user: initUser, nickname, badgeProps, avtSize = 40, ...avatarProps }) => {

	const { token } = theme.useToken();
	const badgeSize = avtSize / 4;

	const [user, setUser] = useState(initUser);
	const profilePic = user?.avatar;

	useEffect(() => {
		setUser(initUser);
	}, [initUser]);

	useEffect(() => {
		if (user)
			window.socket?.on(`online:${user?.id}`, (user) => {
				console.log('online', user);
				setUser(user);
			});

		return () => {
			window.socket?.off(`online:${user?.id}`);
		};
	}, [user]);

	if (!user) return <Skeleton.Avatar size={avtSize} shape="circle" active />;

	return (
		<Tooltip title={nickname || user?.username} placement="top">
			<Badge
				className={styles.badge}
				count={
					user?.isOnline ? (
						<div
							className={styles.online}
							style={{
								background: token.colorSuccess,
								width: badgeSize,
								height: badgeSize,
							}}
						/>
					) : null
				}
				dot={false}
				offset={[0 - badgeSize / 2, avtSize - badgeSize / 2]}
				{...badgeProps}
			>
				<Link to={`/profile/${user?.userId}`} draggable onClick={(e) => e.stopPropagation()}>
					<Avatar
						shape="circle"
						src={profilePic}
						alt={user?.username}
						icon={<HiUser size={avtSize} />}
						{...avatarProps}
						style={{ width: avtSize, height: avtSize, border: 'none', ...avatarProps?.style }}
					/>
				</Link>
			</Badge>
		</Tooltip>
	);
};
export default UserAvatar;
