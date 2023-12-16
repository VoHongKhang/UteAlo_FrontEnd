import { Helmet } from 'react-helmet';
import toast, { Toaster } from 'react-hot-toast';
import SidebarManagerGroup from './sidebarManagerGroup/SidebarManagerGroup';
import PostGroupApi from '../../../api/postGroups/PostGroupApi';
import { useParams } from 'react-router-dom';
import useAuth from '../../../context/auth/AuthContext';
import { useState, useEffect } from 'react';
import Topbar from '../../timeline/topbar/Topbar';
import { Avatar, Button, List, Typography } from 'antd';
import { MoreHoriz } from '@material-ui/icons';
import './ManagerGroup.css';
import Search from 'antd/es/input/Search';
import { useNavigate } from 'react-router-dom';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	ListItem,
	ListItemText,
	Popover,
} from '@material-ui/core';
import useTheme from '../../../context/ThemeContext';
const MemberGroup = () => {
	const params = useParams();
	const navigate = useNavigate();
	const { user: currentUser } = useAuth();
	const [memberGroup, setMemberGroup] = useState();
	const [selectedItem, setSelectedItem] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const [openConfirmation, setOpenConfirmation] = useState(false);
	const [isAdminChange, setIsAdminChange] = useState('');
	const handleClick = (event, item) => {
		setAnchorEl(event.currentTarget);
		setSelectedItem(item);
		setIsAdminChange('');
	};

	const handleClose = () => {
		setAnchorEl(null);
		setSelectedItem(null);
		setIsAdminChange('');
	};
	const handleOpenConfirmation = (isAdminChange) => {
		setOpenConfirmation(true);
		setIsAdminChange(isAdminChange);
	};

	const handleCloseConfirmation = () => {
		setOpenConfirmation(false);
		setIsAdminChange('');
	};
	useEffect(() => {
		const fetchGroup = async () => {
			const res = await PostGroupApi.listMemberGroup({ user: currentUser, postId: params.postGroupId });
			setMemberGroup(res.result);
		};
		fetchGroup();
	}, [params, currentUser]);
	const onSearch = (value) => {
		console.log('value', value);
	};
	const handleConfirmAction = async () => {
		const data = {
			postGroupId: params.postGroupId,
			userId: [selectedItem.userId],
		};
		switch (isAdminChange) {
			case 'appointDeputy':
				const toastId = toast.loading('Đang gửi yêu cầu...');
				try {
					await PostGroupApi.appointDeputyGroup({ user: currentUser, data: data });
					toast.success('Thêm quyền thành công!', { id: toastId });
					// thay đổi quyền của selectItem và cập nhật lại trong list memberGroup
					const updatedMemberGroup = memberGroup.map((member) => {
						if (member.userId === selectedItem.userId) {
							return { ...member, roleName: 'Deputy' };
						}
						return member;
					});
					setMemberGroup(updatedMemberGroup);
				} catch (e) {
					toast.error(`Bạn không có quyền thêm phó quản trị viên`, { id: toastId });
				}
				break;
			case 'removeDeputy':
				const toastId1 = toast.loading('Đang gửi yêu cầu...');
				try {
					await PostGroupApi.removeDeputyGroup({ user: currentUser, data: data });
					toast.success('Xóa quyền thành công!', { id: toastId1 });
					const updatedMemberGroup = memberGroup.map((member) => {
						if (member.userId === selectedItem.userId) {
							return { ...member, roleName: 'Member' };
						}
						return member;
					});
					setMemberGroup(updatedMemberGroup);
				} catch (e) {
					toast.error(`Bạn không có quyền xóa phó quản trị viên`, { id: toastId1 });
				}
				break;
			case 'removeMember':
				if (selectedItem.roleName === 'Admin') {
					toast.error('Không thể xóa quản trị viên khỏi nhóm');
				} else {
					const toastId = toast.loading('Đang gửi yêu cầu...');
					try {
						await PostGroupApi.deleteMember({ user: currentUser, data: data });
						toast.success('Xóa thành viên thành công!', { id: toastId });
						const updatedMemberGroup = memberGroup.filter((member) => member !== selectedItem);
						setMemberGroup(updatedMemberGroup);
					} catch (e) {
						toast.error(`Xóa thành viên thất bại! Lỗi: ${e}`, { id: toastId });
					}
				}
				break;
			case 'appointAdmin':
				const toastId2 = toast.loading('Đang gửi yêu cầu...');
				try {
					await PostGroupApi.appointAdminGroup({ user: currentUser, data: data });
					toast.success('Nhượng quyền thành công!', { id: toastId2 });
					navigate(`/groups/${params.postGroupId}`);
				} catch (e) {
					toast.error(`Bạn không có quyền nhượng quyền quản trị viên`, { id: toastId2 });
				}
				break;
			default:
				break;
		}
		handleCloseConfirmation();
		handleClose();
	};
	const { theme } = useTheme();
	return (
		<>
			<Helmet title={`Quản lý thành viên nhóm ||UTEALO`} />
			<div className="setting--group--member" style={{ color: theme.foreground, background: theme.background }}>
				<div className="member--contaner">
					<div className="setting--group__title">Thành viên nhóm</div>
					<div className="setting--group__search">
						<Search
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
										<MoreHoriz />
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
											{selectedItem?.roleName === 'Member' && (
												<Typography
													className="poper--member--item"
													onClick={() => handleOpenConfirmation('appointDeputy')}
												>
													Chỉ định làm phó quản trị viên
												</Typography>
											)}
											{selectedItem?.roleName === 'Deputy' &&
												selectedItem?.userId !== currentUser.userId && (
													<Typography
														className="poper--member--item"
														onClick={() => handleOpenConfirmation('removeDeputy')}
													>
														Hủy quyền phó quản trị viên
													</Typography>
												)}
											<Typography
												className="poper--member--item"
												onClick={() => handleOpenConfirmation('removeMember')}
											>
												{selectedItem?.roleName === 'Deputy' &&
												selectedItem?.userId === currentUser.userId
													? 'Rời khỏi nhóm'
													: 'Xóa khỏi nhóm'}
											</Typography>
											{selectedItem?.roleName !== 'Admin' && 
												selectedItem?.userId !== currentUser.userId && (
													<Typography
														className="poper--member--item"
														onClick={() => handleOpenConfirmation('appointAdmin')}
													>
														Nhượng quyền quản trị viên
													</Typography>
												)}
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
						<Dialog open={openConfirmation} onClose={handleCloseConfirmation}>
							<DialogTitle>Xác nhận thay đổi</DialogTitle>
							<DialogContent>
								<DialogContentText>
									{isAdminChange === 'appointDeputy'
										? `Bạn có chắc chắn muốn chỉ định thành viên ${
												selectedItem && selectedItem.username
										  } làm Phó quản trị viên? `
										: isAdminChange === 'removeDeputy'
										? `Bạn có chắc chắn muốn hủy quyền phó quản trị viên của ${
												selectedItem && selectedItem.username
										  }
											 `
										: isAdminChange === 'removeMember'
										? `Bạn có chắc chắn muốn xóa thành viên ${
												selectedItem && selectedItem.username
										  } khỏi nhóm? `
										: isAdminChange === 'appointAdmin'
										? `Bạn có chắc chắn muốn nhượng quyền quản trị viên cho ${
												selectedItem && selectedItem.username
										  } `
										: `Bạn có chắc chắn muốn xóa thành viên ${
												selectedItem && selectedItem.username
										  } khỏi nhóm? `}
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button onClick={handleCloseConfirmation} color="primary" variant="outlined">
									Hủy
								</Button>
								<Button onClick={handleConfirmAction} color="primary" variant="contained">
									Xác nhận
								</Button>
							</DialogActions>
						</Dialog>
					</List>
				</div>
			</div>
		</>
	);
};
export default MemberGroup;
