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
import Moment from 'react-moment';
import { Avatar } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';
import useAuth from '../../context/auth/AuthContext';
import useTheme from '../../context/ThemeContext';

const Profile = () => {
	const [user, setUser] = useState({});
	let listMessage = [
		'Retrieving user profile successfully and access update denied',
		'Retrieving user profile successfully and access update',
	];
	const [message, setMessage] = useState('');

	const params = useParams();

	const { user: currentUser } = useAuth();

	const { theme } = useTheme();

	const [listImage, setListImage] = useState([]);

	// get user details
	useEffect(() => {
		const fetchUsers = async () => {
			const config = {
				headers: {
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/user/profile/${currentUser.userId}`, config);
			setUser(res.data.result);
			setMessage(res.data.message);
		};
		fetchUsers();
	}, [currentUser.userId, currentUser.accessToken]);

	useEffect(() => {
		const fetchPhotosOfUser = async () => {
			const res = await axios.get(`${BASE_URL}/v1/post/user/${params.userId}/latest-photos`);
			setListImage(res.data.content);
		};
		fetchPhotosOfUser();
	}, [params.userId]);

	//const limitedImageUrls = listImage.slice(0, 9); // Lấy 9 ảnh đầu tiên

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
										<Moment format="YYYY/MM/DD">{user?.createdAt}</Moment>
									</em>
								) || '----'}
							</small>
						</div>
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

							<div className="profileFriend">
								<div className="textprofileImage">
									<div className="textGioiThieu">Bạn bè</div>
									<div className="showMoreFriend">Xem tất cả bạn bè</div>
								</div>
								<div className="textCountFriend">{user.friends?.length} bạn bè</div>
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
