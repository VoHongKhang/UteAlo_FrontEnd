import { Helmet } from 'react-helmet';
import './ManagerGroup.css';
import toast, { Toaster } from 'react-hot-toast';
import useAuth from '../../../context/auth/AuthContext';
import Topbar from '../../timeline/topbar/Topbar';
import noCover from '../../../assets/appImages/noCover.jpg';
import { Search, Public, People, MoreHoriz, Visibility, Room, Lock, Edit, Camera, Cancel } from '@material-ui/icons';
import useTheme from '../../../context/ThemeContext';
import sampleProPic from '../../../assets/appImages/user.png';
import PostGroupApi from '../../../api/postGroups/PostGroupApi';
import { useParams } from 'react-router-dom';
import SidebarManagerGroup from './sidebarManagerGroup/SidebarManagerGroup';
import { useEffect, useState } from 'react';
import { Button, Image, Space, theme } from 'antd';
import AcceptDenied from '../../AcceptDenied';
const ManagerGroup = () => {
	const params = useParams();
	const { user: currentUser } = useAuth();
	const [postGroup, setPostGroup] = useState([]);
	const { token } = theme.useToken();
	const [photosUrl, setPhotosUrl] = useState();
	const [photos, setPhotos] = useState(null);
	const [targetPhoto, setTargetPhoto] = useState(null);
	const hanldeEditPhoto = async () => {
		const toastId = toast.loading('Đang gửi yêu cầu...');
		if (targetPhoto === 'fileAvatar') {
			const formData = new FormData();
			formData.append('postGroupId', postGroup.postGroupId);
			formData.append('avatar', photos);
			try {
				// trong quá trình thực thi thì không cho phép tác động gì hết
				const res = await PostGroupApi.updatePhotoGroup({ user: currentUser, data: formData });
				if (res.statusCode === 200) {
					toast.success('Thay đổi ảnh thành công!', { id: toastId });
					setPostGroup({ ...postGroup, avatar: photosUrl });
					setPhotos(null);
				} else {
					toast.error('Thay đổi ảnh thất bại!', { id: toastId });
				}
			} catch (err) {
				console.log(err);
				toast.error(`Thay đổi ảnh thất bại! ${err}`, { id: toastId });
			}
		}

		if (targetPhoto === 'fileBackgroup') {
			const formData = new FormData();
			formData.append('postGroupId', postGroup.postGroupId);
			formData.append('background', photos);
			try {
				const res = await PostGroupApi.updatePhotoGroup({ user: currentUser, data: formData });
				if (res.statusCode === 200) {
					toast.success('Thay đổi ảnh thành công!', { id: toastId });
					setPostGroup({ ...postGroup, background: photosUrl });
					setPhotos(null);
				} else {
					toast.error('Thay đổi ảnh thất bại!', { id: toastId });
				}
			} catch (err) {
				console.log(err);
				toast.error(`Thay đổi ảnh thất bại! ${err}`, { id: toastId });
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
	useEffect(() => {
		const fetchGroup = async () => {
			const res = await PostGroupApi.getGroup({ user: currentUser, postId: params.postGroupId });
			setPostGroup(res.result);
		};
		fetchGroup();
	}, [params, currentUser]);

	return (
		<>
			<Helmet title={`Quản lý nhóm ${postGroup.postGroupName}||UTEALO`} />
			<div className="manager--group">
				<div className="header--group">
					<div className="groupCover" style={{ color: theme.foreground, background: theme.background }}>
						{postGroup.background !== null ? (
							<Image
								hoverable
								cover
								width="100%"
								className="ManagerGroup--groupCoverImg"
								src={postGroup.background} // Sử dụng selectedPost.photos thay vì cố định URL như bạn đã đề cập
								alt={'backgroup'}
								style={{ objectFit: 'cover', background: token.colorBgLayout }}
							/>
						) : (
							<img className="groupCoverImg" src={noCover} alt="..." />
						)}
						<div className="contaner--avatar">
							{postGroup.avatar !== null ? (
								<Image
									hoverable
									cover
									width="100%"
									className="groupUserImg"
									src={postGroup.avatar} // Sử dụng selectedPost.photos thay vì cố định URL như bạn đã đề cập
									alt={'backgroup'}
									style={{
										objectFit: 'cover',
										background: token.colorBgLayout,
										top: '-55px',
									}}
								/>
							) : (
								<img className="groupUserImg" src={sampleProPic} alt="..." />
							)}
							<label htmlFor="fileAvatar" className="edit--group--avatar--manager">
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

					<div className="group--contanier--top">
						<div className="group--detail">
							<span className="group--name">{postGroup.postGroupName}</span>
							<div className="group--name-info">
								{postGroup.groupType === 'Public' ? (
									<>
										<Public htmlColor="#65676B" className="group--public-icon" />
										<span className="group--public-text">Nhóm Công khai</span>
									</>
								) : (
									<>
										<Lock htmlColor="#65676B" className="group--public-icon" />
										<span className="group--public-text">Nhóm riêng tư</span>
									</>
								)}
								<People htmlColor="#65676B" className="group--member-icon" />
								<span className="group--member">{postGroup.countMember} thành viên</span>
							</div>
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
					<hr />

					<div className="container--group">
						{postGroup && (
							<div className="rightbar--group">
								<div className="group--infor">
									<div className="group--infor-introduce">Giới thiệu</div>
									<div className="group--infor-bio">
										<span>{postGroup.bio}</span>
									</div>
									{postGroup.groupType === 'Public' ? (
										<>
											<div className="group--infor-public">
												<Public htmlColor="#65676B" className="group--public-icon" />
												<span className="group--public">Nhóm Công khai</span>
											</div>
											<div className="group--infor-public-text">
												<span>
													Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và những gì họ
													đăng.
												</span>
											</div>
										</>
									) : (
										<>
											<div className="group--infor-public">
												<Lock htmlColor="#65676B" className="group--public-icon" />
												<span className="group--public">Nhóm riêng tư</span>
											</div>
											<div className="group--infor-public-text">
												<span>
													Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ
													đăng.
												</span>
											</div>
										</>
									)}

									<div className="group--infor-show">
										<Visibility htmlColor="#65676B" className="group--show-icon" />
										<span className="group--show">Hiển thị</span>
									</div>
									<div className="group--infor-show-text">
										<span>Ai cũng có thể tìm thấy nhóm này.</span>
									</div>

									<div className="group--infor-location">
										<Room htmlColor="#65676B" className="group--location-icon" />
										<span className="group--location">Thành Phố Hồ Chí Minh</span>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};
export default ManagerGroup;
