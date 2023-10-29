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
const MemberGroup = () => {
	const params = useParams();
	const navigate = useNavigate();
	const { user: currentUser } = useAuth();
	const [memberGroup, setMemberGroup] = useState();
	const [selectedItem, setSelectedItem] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const [openConfirmation, setOpenConfirmation] = useState(false);
	const [isAdminChange, setIsAdminChange] = useState(false);
	const handleClick = (event, item) => {
		setAnchorEl(event.currentTarget);
		setSelectedItem(item);
		setIsAdminChange(false);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setSelectedItem(null);
		setIsAdminChange(false);
	};
	const handleOpenConfirmation = (isAdminChange) => {
		setOpenConfirmation(true);
		setIsAdminChange(isAdminChange);
	};

	const handleCloseConfirmation = () => {
		setOpenConfirmation(false);
		setIsAdminChange(false);
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

		if (isAdminChange) {
			const toastId = toast.loading('Đang gửi yêu cầu...');
			try {
				await PostGroupApi.appointAdminGroup({ user: currentUser, data: data });
				toast.success('Chuyển quyền thành công!', { id: toastId });
				navigate(`/groups/${params.postGroupId}`);
			} catch (e) {
				toast.error(`Chuyển quyền thất bại! Lỗi: ${e}`, { id: toastId });
			}
		} else {
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
		}
		handleCloseConfirmation();
		handleClose();
	};
	return (
		<>
			<Helmet title={`Quản lý thành viên nhóm ||UTEALO`} />
			<Toaster />
			<Topbar />
			<div div className="homeContainer">
				<SidebarManagerGroup user={currentUser} groupId={params.postGroupId} />
				<div className="setting--group--member">
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
										secondary={item.roleName === 'Admin' ? 'Quản trị viên' : 'Thành viên'}
									/>
									<div>
										<IconButton
											aria-describedby="simple-popover"
											onClick={(e) => handleClick(e, item)}
										>
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
														onClick={() => handleOpenConfirmation(true)}
													>
														Chỉ định làm admin
													</Typography>
												)}
												<Typography
													className="poper--member--item"
													onClick={() => handleOpenConfirmation(false)}
												>
													Xóa khỏi nhóm
												</Typography>
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
										{isAdminChange
											? `Bạn có chắc chắn muốn chỉ định thành viên ${
													selectedItem && selectedItem.username
											  } làm admin?`
											: `Bạn có chắc chắn muốn xóa thành viên ${
													selectedItem && selectedItem.username
											  } khỏi nhóm?`}
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
			</div>
		</>
	);
};
export default MemberGroup;
