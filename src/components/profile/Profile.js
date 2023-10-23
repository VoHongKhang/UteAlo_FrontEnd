import React, { useState, useEffect } from 'react';
import './Profile.css';
import noCover from '../../assets/appImages/noCover.jpg';
import sampleProPic from '../../assets/appImages/user.png';
import userFrom from '../../assets/appImages/dkccKhK21Su.png';
import userFollow from '../../assets/appImages/EUZoGZ3xZic.png';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../context/apiCall';
import FeedOfUser from '../timeline/feed/FeedOfUser';
import Topbar from '../timeline/topbar/Topbar';
import { Avatar } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { Helmet } from 'react-helmet';
import toast, { Toaster } from 'react-hot-toast';
import useAuth from '../../context/auth/AuthContext';
import useTheme from '../../context/ThemeContext';
import { Space, Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import userAction from '../../components/action/useUserAction';
const Profile = () => {
	const [user, setUser] = useState({});
	const navigate = useNavigate();
	let listMessage = [
		'Retrieving user profile successfully and access update denied',
		'Retrieving user profile successfully and access update',
	];
	const [message, setMessage] = useState('');

	const params = useParams();

	const { user: currentUser } = useAuth();

	const { theme } = useTheme();

	const [listImage, setListImage] = useState([]);

	const [listImageFriend, setListImageFriend] = useState([]);
	const [status, setStatus] = useState('');
	const [modal, setModal] = useState(false);
	const [modalVisible, setModalVisible] = useState({ modalVisible: false, handle: '' });
	const friendList = [
		{
			Icon: require('@ant-design/icons').UserAddOutlined,
			title: 'Yêu thích',
		},
		{
			Icon: require('@ant-design/icons').UserOutlined,
			title: 'Hủy kết bạn',
		},
		{
			Icon: require('@ant-design/icons').UserSwitchOutlined,
			title: 'Hủy theo dõi',
		},
	];
	const sentList = [
		{
			Icon: require('@ant-design/icons').UserAddOutlined,
			title: 'Hủy lời mời',
		},
	];
	const requestList = [
		{
			Icon: require('@ant-design/icons').UserAddOutlined,
			title: 'Chấp nhận',
		},
		{
			Icon: require('@ant-design/icons').UserOutlined,
			title: 'Xóa lời mời',
		},
	];
	const noList = [
		{
			Icon: require('@ant-design/icons').UserAddOutlined,
			title: 'Kết bạn',
		},
		{
			Icon: require('@ant-design/icons').UserOutlined,
			title: 'Theo dõi',
		},
	];
	const handleButtonFriend = () => {
		setModal(!modal);
	};
	const handleModalConfirm = async (handle) => {
		try {
			await userAction({ currentUser: currentUser, user: params, action: handle });
			setStatus('Kết bạn');
			setModal(!modal);
		} catch {
			console.log('Lỗi khi thực hiện hành động');
		}
	};
	const handlerClickModal = async (title) => {
		// xét từng trường hợp title để xử lý
		switch (title) {
			case 'Yêu thích':
				try {
					const toastId = toast.loading('Đang gửi lời mời kết bạn...');
					toast.success('Gửi lời mời kết bạn thành công!', { id: toastId });
					console.log('Yêu thích');
					setModal(!modal);
				} catch {
					console.log('Lỗi khi thực hiện hành động');
				} finally {
					break;
				}

			case 'Hủy kết bạn':
				setModalVisible({ modalVisible: true, handle: 'unfriend' });
				break;
			case 'Hủy theo dõi':
				try {
					console.log('Hủy theo dõi');
					setModal(!modal);
				} catch {
					console.log('Lỗi khi thực hiện hành động');
				} finally {
					break;
				}
			case 'Hủy lời mời':
				setModalVisible({ modalVisible: true, handle: 'cancel' });
				break;
			case 'Chấp nhận':
				try {
					await userAction({ currentUser: currentUser, user: params, action: 'accept' });
					setStatus('Bạn bè');
					setModal(!modal);
				} catch {
					console.log('Lỗi khi thực hiện hành động');
				} finally {
					break;
				}
			case 'Xóa lời mời':
				setModalVisible({ modalVisible: true, handle: 'decline' });
				break;
			case 'Kết bạn':
				try {
					await userAction({ currentUser: currentUser, user: params, action: 'add' });
					setStatus('Đã gửi lời mời');
					setModal(!modal);
				} catch {
					console.log('Lỗi khi thực hiện hành động');
				} finally {
					break;
				}
			case 'Theo dõi':
				try {
					console.log('Theo dõi');
					setModal(!modal);
				} catch {
					console.log('Lỗi khi thực hiện hành động');
				} finally {
					break;
				}
			default:
				break;
		}
	};
	// Lấy thông tin chi tiết người dùng
	useEffect(() => {
		const fetchUsers = async () => {
			const config = {
				headers: {
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/user/profile/${params.userId}`, config);
			setUser(res.data.result);
			setMessage(res.data.message);
			const getStatus = await axios.get(`${BASE_URL}/v1/friend/status/${params.userId}`, config);
			setStatus(getStatus.data.message);
		};
		fetchUsers();
	}, [params.userId, currentUser.accessToken]);

	// Lấy danh sách ảnh của người dùng
	useEffect(() => {
		const fetchPhotosOfUser = async () => {
			try {
				const res = await axios.get(`${BASE_URL}/v1/post/user/${params.userId}/latest-photos`);
				setListImage(res.data.content);
			} catch (error) {
				console.error('Lỗi khi lấy danh sách ảnh:', error);
			}
		};
		fetchPhotosOfUser();
	}, [params.userId]);

	// Lấy danh sách ảnh đại diện bạn bè của người dùng
	useEffect(() => {
		const fetchFriendOfUser = async () => {
			try {
				const config = {
					headers: {
						'Content-Type': 'application/json',
					},
				};
				const res = await axios.get(`${BASE_URL}/v1/friend/list/pageable/${params.userId}`, config);
				// Lấy danh sách avatar từ kết quả và đặt vào state
				const avatars = res.data.result.map((friend) => friend.avatar);
				setListImageFriend(avatars);
			} catch (error) {
				console.error('Lỗi khi lấy danh sách bạn bè:', error);
			}
		};
		fetchFriendOfUser();
	}, [params.userId]);

	return (
		<>
			<Helmet title={`${user?.fullName ? user?.fullName : 'User'} Profile | UTEALO`} />
			<Toaster />

			<Topbar />
			<div className="profile">
				<div className="profileRight">
					<div className="profileRightTop">
						<div className="profileCover" style={{ color: theme.foreground, background: theme.background }}>
							<img className="profileCoverImg" src={user.background || noCover} alt="..." />

							<img className="profileUserImg" src={user.avatar || sampleProPic} alt="..." />
							{message === listMessage[1] && (
								<Link to={`/update/${currentUser.userId}`}>
									<div className="profile-edit-icon">
										<Avatar style={{ cursor: 'pointer', backgroundColor: 'blue' }}>
											<Edit />
										</Avatar>
									</div>
								</Link>
							)}
						</div>

						<div className="profileInfo" style={{ color: theme.foreground, background: theme.background }}>
							<h4 className="profileInfoName">{user.fullName}</h4>
							<p className="profileInfoDesc">About me: {user.about || '----'}</p>
							<small className="profileInfoDesc">
								Joined on:{' '}
								{(
									<em>
										{user?.createdAt}
									</em>
								) || '----'}
							</small>
						</div>
						{message !== listMessage[1] && (
							<Space className="button--space">
								<Button type="default" onClick={handleButtonFriend}>
									{status}
								</Button>
								<Button type="primary" onClick={() =>navigate(`/message/${currentUser.userId}`)}>
									Message
								</Button>
							</Space>
						)}
						{modal && (
							<div className="modal">
								<div className="modal-content">
									{status === 'Bạn bè' &&
										friendList.map((item) => (
											<div
												key={item.title}
												value={item.title}
												className="item--modal"
												onClick={() => handlerClickModal(item.title)}
											>
												<Space>
													<item.Icon />
													{item.title}
												</Space>
											</div>
										))}
									{status === 'Đã gửi lời mời' &&
										sentList.map((item) => (
											<div
												key={item.title}
												value={item.title}
												className="item--modal"
												onClick={() => handlerClickModal(item.title)}
											>
												<Space>
													<item.Icon />
													{item.title}
												</Space>
											</div>
										))}
									{status === 'Chấp nhận lời mời' &&
										requestList.map((item) => (
											<div
												key={item.title}
												value={item.title}
												className="item--modal"
												onClick={() => handlerClickModal(item.title)}
											>
												<Space>
													<item.Icon />
													{item.title}
												</Space>
											</div>
										))}
									{status === 'Kết bạn' &&
										noList.map((item) => (
											<div
												key={item.title}
												value={item.title}
												className="item--modal"
												onClick={() => handlerClickModal(item.title)}
											>
												<Space>
													<item.Icon />
													{item.title}
												</Space>
											</div>
										))}
								</div>
							</div>
						)}
					</div>
					<div className="profileRightBottom">
						<div className="profileILeft">
							<div className="profileInfor">
								<div className="textGioiThieu">Giới thiệu</div>
								<div className="textTieuSu">Thêm tiểu sử</div>
								<div className="textDenTu">
									<img src={userFrom} alt="Icon" className="icon" />
									Đến từ {user?.address}
								</div>
								<div className="textDenTu">
									<img src={userFollow} alt="Icon" className="icon" />
									Có {user.friends?.length} người theo dõi
								</div>
								<div className="textChinhSua">Chỉnh sửa chi tiết</div>
								<div className="textChinhSua">Thêm sở thích</div>
							</div>

							<div className="profileImage">
								<div className="textprofileImage">
									<div className="textGioiThieu">Ảnh</div>
									<div className="showMorePhoto">Xem tất cả ảnh</div>
								</div>

								<div className="userPhotos">
									{Array.from({ length: 9 }).map((_, index) => (
										<div key={index} className="photoItem">
											<img src={listImage[index] || sampleProPic} alt="" />
										</div>
									))}
								</div>
							</div>
							<Modal
								title="Xác nhận"
								open={modalVisible.modalVisible}
								onCancel={() => {
									setModalVisible({ modalVisible: false, handle: '' });
								}}
								onOk={() => {
									setModalVisible({ modalVisible: false, handle: modalVisible.handle });
									handleModalConfirm(modalVisible.handle);
								}}
							>
								<p>Bạn có chắc chắn muốn tiếp tục?</p>
							</Modal>
							<div className="profileFriend">
								<div className="textprofileImage">
									<div className="textGioiThieu">Bạn bè</div>
									<div className="showMoreFriend">Xem tất cả bạn bè</div>
								</div>
								<div className="textCountFriend">{user.friends?.length} bạn bè</div>
								<div className="userPhotos">
									{Array.from({ length: 9 }).map((_, index) => (
										<div key={index} className="photoItem">
											<img src={listImageFriend[index] || sampleProPic} alt="" />
										</div>
									))}
								</div>
							</div>
						</div>
						<FeedOfUser userId={currentUser.accessToken} />
					</div>
				</div>
			</div>
		</>
	);
};

export default Profile;
