import React, { useState } from 'react';
import './EditProfile.css';
import '../profile/Profile.css';
import noCover from '../../assets/appImages/noCover.jpg';
import sampleProPic from '../../assets/appImages/user.png';
import { Helmet } from 'react-helmet';
import useTheme from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import useProfile from '../../context/profile/ProfileContext';
import { Button, Collapse, Image, Modal, Space, Tooltip } from 'antd';
import { Camera, Cancel, Edit, Settings } from '@material-ui/icons';
import Moment from 'react-moment';
import ChangePassword from './ChangePassword';
import EditUser from './EditUser';
import moment from 'moment';
import ChangePasswordApi from '../../api/auth/ChangePasswordApi';
import useAuth from '../../context/auth/AuthContext';
const EditProfile = ({ inforUser, changeUser }) => {
	const { editUser, updateUserAvatar, updateUserBackground } = useProfile();
	const { theme } = useTheme();
	const { user: currentUser } = useAuth();
	const [profileUser, setProfileUser] = useState(inforUser);
	const [photosUrl, setPhotosUrl] = useState();
	const [photos, setPhotos] = useState(null);
	const [targetPhoto, setTargetPhoto] = useState(null);

	console.log('profileUser', profileUser);
	const hanldeEditPhoto = async () => {
		if (targetPhoto === 'fileAvatar') {
			try {
				// trong quá trình thực thi thì không cho phép tác động gì hết
				await updateUserAvatar(photos);

				setProfileUser({ ...profileUser, avatar: photosUrl });
				setPhotos(null);
				//reload lại trang
				//window.location.reload();
			} catch (err) {
				console.log(err);
			}
		}

		if (targetPhoto === 'fileBackgroup') {
			try {
				await updateUserBackground(photos);

				setProfileUser({ ...profileUser, background: photosUrl });
				setPhotos(null);
			} catch (err) {
				console.log(err);
			}
		}
	};
	const openModal = (e) => {
		const file = e.target.files[0];
		setTargetPhoto(e.target.id);
		if (file === undefined) {
			toast.error('Please Select an Image!');
			return;
		}
		if (file.type === 'image/jpeg' || file.type === 'image/png') {
			setPhotos(file);
			setPhotosUrl(URL.createObjectURL(file));
		} else {
			toast.error('Please select an image with png/jpg type');
		}
	};

	const [visibleModalUpdate, setVisibleModalUpdate] = useState({
		visible: false,
		type: '',
	});
	const openModalUpdate = (e) => {
		setVisibleModalUpdate({ visible: true, type: e });
	};
	const items = [
		{
			key: '1',
			label: (
				<div className="title--collapse">
					<span style={{ color: theme.foreground, background: theme.background }}>
						Thông tin cá nhân của bạn
					</span>
					<Tooltip title="Chỉnh sửa thông tin cá nhân" placement="top">
						<Settings
							id="icon--setting--infor"
							htmlColor="#65676B"
							className="icon--setting"
							onClick={() => openModalUpdate('infor')}
						/>
					</Tooltip>
				</div>
			),
			children: (
				<div className="collapse--content">
					<span>Tên người dùng: {profileUser?.userName}</span>
					<span>Địa chỉ: {profileUser?.address || 'Chưa có thông tin'}</span>
					<span>
						Giới tính:{' '}
						{profileUser?.gender === 'MALE'
							? 'Nam giới'
							: profileUser?.gender === 'FEMALE'
							? 'Nữ giới'
							: 'Khác'}
					</span>
					<span>Số điện thoại: {profileUser?.phone || 'Chưa có thông tin'}</span>
					<span>
						Ngày sinh:
						{profileUser?.dayOfBirth === null ? (
							'Chưa có thông tin'
						) : (
							<Moment format="DD/MM/YYYY">{profileUser?.dayOfBirth}</Moment>
						)}
					</span>
				</div>
			),
		},
		{
			key: '2',
			label: (
				<div className="title--collapse">
					<span style={{ color: theme.foreground, background: theme.background }}>
						Thông tin tài khoản của bạn
					</span>
					<Tooltip title="Đổi mật khẩu" placement="top">
						<Settings
							id="icon--setting--pwd"
							htmlColor="#65676B"
							className="icon--setting"
							onClick={() => openModalUpdate('pwd')}
						/>
					</Tooltip>
				</div>
			),
			children: (
				<div className="collapse--content">
					<span>Địa chỉ email: {profileUser?.email}</span>
				</div>
			),
		},
	];
	const updateUser = async (data) => {
		console.log('data', data);
		const res = await editUser({
			fullName: data.userName,
			address: data.address,
			phone: data.phone,
			gender: data.gender,
			dateOfBirth: moment(data.dateOfBirth).toDate(),
		});
		if (res.success) {
			setProfileUser(res.result);
		}
	};
	const updatePassword = async (data) => {
		const toastId = toast.loading('Đang thay đổi mật khẩu...');
		try {
			const res = await ChangePasswordApi.changePassword(data, currentUser);
			if (res.success) {
				toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại', { id: toastId });
				setVisibleModalUpdate({ visible: false, type: '' });
				setTimeout(() => {
					toast.success('Hệ thống sẽ chuyển hướng trang trong 3s', { id: toastId });
				}, 1000);
				setTimeout(() => {
					localStorage.removeItem('userInfo');
					window.location.href = '/login';
				}, 4000);
			}
		} catch (err) {
			toast.error(err.message, { id: toastId });
		}
	};
	return (
		<>
			<Helmet title="Edit profile | UTEALO" />
			{profileUser && (
				<div style={{ color: theme.foreground, background: theme.background }}>
					<div className="header--group">
						<div className="groupCover" style={{ color: theme.foreground, background: theme.background }}>
							{profileUser?.background !== null ? (
								<Image
									hoverable
									cover
									width="100%"
									className="ManagerGroup--groupCoverImg"
									src={profileUser?.background} // Sử dụng selectedPost.photos thay vì cố định URL như bạn đã đề cập
									alt={'backgroup'}
									style={{ objectFit: 'cover', background: theme.background }}
								/>
							) : (
								<img className="groupCoverImg" src={noCover} alt="..." />
							)}
							<div className="contaner--avatar">
								{profileUser?.avatar !== null ? (
									<Image
										hoverable
										cover
										width="100%"
										className="groupUserImg"
										src={profileUser?.avatar} // Sử dụng selectedPost.photos thay vì cố định URL như bạn đã đề cập
										alt={'backgroup'}
										style={{
											objectFit: 'cover',
											background: theme.background,
											top: '-55px',
										}}
									/>
								) : (
									<img className="groupUserImg" src={sampleProPic} alt="..." />
								)}
								<label htmlFor="fileAvatar" className="edit--group--avatar">
									<Camera htmlColor="#65676B" />
									<input
										style={{ display: 'none' }}
										type="file"
										id="fileAvatar"
										accept=".png, .jpeg, .jpg"
										onChange={openModal}
									/>
								</label>
							</div>

							<div className="edit--group--cover">
								<label htmlFor="fileBackgroup" className="button--edit">
									<Edit htmlColor="#65676B" className="icon--edit" />
									<span>Chỉnh sửa</span>
									<input
										style={{ display: 'none' }}
										type="file"
										id="fileBackgroup"
										accept=".png, .jpeg, .jpg"
										onChange={openModal}
									/>
								</label>
							</div>
						</div>
						<div className="group--contanier--top--edit--profle">
							<div className="group--detail">
								<span className="group--name">{profileUser?.userName}</span>
							</div>
						</div>
						{photos && (
							//Mở modal hiển thị hình ảnh đó và 2 nút lưu hoặc hủy
							<div className="modal--group--avatar">
								<div className="modal--group--avatar--content">
									<div className="modal--group--avatar--header">
										<span className="modal--group--avatar--title">Thay đổi ảnh</span>
										<span className="modal--group--avatar--close" onClick={() => setPhotos(null)}>
											<Cancel htmlColor="#65676B" className="icon--close" />
										</span>
									</div>
									<div className="modal--group--avatar--body">
										<div className="modal--group--avatar--body--img">
											<img src={photosUrl} alt="..." />
										</div>
										<Space>
											<Button className="button--cancel" onClick={() => setPhotos(null)}>
												Hủy
											</Button>
											<Button type="primary" className="button--save" onClick={hanldeEditPhoto}>
												Lưu
											</Button>
										</Space>
									</div>
								</div>
							</div>
						)}
					</div>
					<div className="update--user">
						<Collapse
							className="collapse--update"
							items={items}
							collapsible="icon"
							defaultActiveKey={['1']}
						/>
					</div>
				</div>
			)}
			{visibleModalUpdate?.visible && (
				<Modal
					title={visibleModalUpdate.type === 'infor' ? 'Chỉnh sửa thông tin cá nhân' : 'Đổi mật khẩu'}
					centered
					open={visibleModalUpdate?.visible}
					onCancel={() => setVisibleModalUpdate({ visible: false, type: '' })}
					footer={null}
					width={visibleModalUpdate.type === 'infor' ? 500 : 400}
				>
					<>
						{visibleModalUpdate.type === 'infor' ? (
							<EditUser
								profileUser={profileUser}
								updateUser={updateUser}
								setVisibleModalUpdate={setVisibleModalUpdate}
							/>
						) : (
							<ChangePassword
								updatePassword={updatePassword}
								setVisibleModalUpdate={setVisibleModalUpdate}
							/>
						)}
					</>
				</Modal>
			)}
		</>
	);
};

export default EditProfile;
