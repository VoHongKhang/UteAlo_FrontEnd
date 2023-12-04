import { IconButton, ListItem, ListItemText, Popover } from '@material-ui/core';
import { MoreHoriz, Search } from '@material-ui/icons';
import { Avatar, List, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostGroupApi from '../../../api/postGroups/PostGroupApi';
import useTheme from '../../../context/ThemeContext';
export default function MemberGroup({ groupId, currentUser }) {
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState(null);
	const [memberGroup, setMemberGroup] = useState();
	const [selectedItem, setSelectedItem] = useState(null);
	const onSearch = (value) => {
		console.log('value', value);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setSelectedItem(null);
	};

	const handleClick = (event, item) => {
		setAnchorEl(event.currentTarget);
		setSelectedItem(item);
	};

	useEffect(() => {
		const fetchGroup = async () => {
			const res = await PostGroupApi.listMemberGroup({ user: currentUser, postId: groupId });
			setMemberGroup(res.result);
		};
		fetchGroup();
	}, [groupId, currentUser]);
	const { theme } = useTheme();
	return (
		<div className="setting--group--member" style={{ color: theme.foreground, background: theme.background }}>
			<div className="member--contaner" style={{ color: theme.foreground, background: theme.background }}>
				<div className="setting--group__title">Thành viên nhóm</div>
				<div
					className="setting--group__search"
					style={{ color: theme.foreground, background: theme.background }}
				>
					<Search
						style={{ color: theme.foreground, background: theme.background }}
						placeholder="Tìm kiếm thành viên"
						allowClear={true}
						enterButton="Search"
						size="large"
						onSearch={onSearch}
					/>
				</div>
				<List className="list--friend">
					{memberGroup?.map((item) => (
						<ListItem key={item.userId}>
							<Avatar className="avatarMember" alt={item.username} src={item.avatarUser} />
							<ListItemText
								style={{ color: theme.foreground, background: theme.background }}
								primary={item.username}
								secondary={
									item.roleName === 'Admin'
										? 'Quản trị viên'
										: item.roleName === 'Member'
										? 'Thành viên'
										: 'Phó quản trị viên'
								}
							/>
							<div>
								<IconButton aria-describedby="simple-popover" onClick={(e) => handleClick(e, item)}>
									<MoreHoriz style={{ color: theme.foreground, background: theme.background }} />
								</IconButton>
								<Popover
									id="simple-popover"
									open={Boolean(anchorEl)}
									className="popper--member"
									anchorEl={anchorEl}
									onClose={handleClose}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'right',
									}}
									transformOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
								>
									<div>
										<Typography
											className="poper--member--item"
											onClick={() => navigate(`/profile/${selectedItem.userId}`)}
										>
											Xem trang cá nhân
										</Typography>
									</div>
								</Popover>
							</div>
						</ListItem>
					))}
				</List>
			</div>
		</div>
	);
}
