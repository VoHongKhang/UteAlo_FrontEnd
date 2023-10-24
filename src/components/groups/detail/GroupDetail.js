import React, { useEffect, useState } from 'react';
import PostCard from '../../timeline/post/PostCard';
import useAuth from '../../../context/auth/AuthContext';
import useTheme from '../../../context/ThemeContext';
import axios from 'axios';
import { BASE_URL } from '../../../context/apiCall';
import sampleProPic from '../../../assets/appImages/user.png';
import noCover from '../../../assets/appImages/noCover.jpg';
import { Search, Public, People, MoreHoriz, Visibility, Room, Lock } from '@material-ui/icons';
import { useParams } from 'react-router-dom';
import Share from '../../timeline/sharePost/Share';
import { Box, CircularProgress } from '@material-ui/core';
import Topbar from '../../timeline/topbar/Topbar';
import SidebarGroup from '../sidebar/SidebarGroup';
import { Helmet } from 'react-helmet';
import toast, { Toaster } from 'react-hot-toast';
import PostGroupApi from '../../../api/postGroups/PostGroupApi';
import './GroupDetail.css';
import { useNavigate } from 'react-router-dom';
const GroupDetail = () => {
	const params = useParams();
	const { user: currentUser } = useAuth();
	const [posts, setPosts] = useState([]);
	const [sharePosts, setSharePosts] = useState([]);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [visiblePosts, setVisiblePosts] = useState(3); // Số lượng bài viết hiển thị ban đầu
	const { theme } = useTheme();
	const [postGroup, setPostGroup] = useState([]);
	useEffect(() => {
		const fetchGroup = async () => {
			const res = await PostGroupApi.getGroup({ user: currentUser, postId: params.postGroupId });
			setPostGroup(res.result);
		};
		fetchGroup();
	}, [params]);
	// Lấy danh sách bài post
	const fetchPosts = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			setLoading(true);

			const res = await axios.get(`${BASE_URL}/v1/post/${currentUser.userId}/posts`, config);
			setLoading(false);
			setPosts(res.data.result);
		} catch (error) {
			console.log(error);
		}
	};

	// Lấy danh sách các bài share post
	const fetchSharePosts = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			setLoading(true);

			const res = await axios.get(`${BASE_URL}/v1/share/${currentUser.userId}/posts`, config);
			setLoading(false);
			setSharePosts(res.data.result);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchPosts();
		fetchSharePosts();
		//eslint-disable-next-line
	}, []);

	// Xử lý nạp thêm bài viết khi cuộn xuống
	useEffect(() => {
		const handleScroll = () => {
			if (window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 100) {
				// Khi cuộn xuống gần cuối trang (khoảng cách 100 pixel)
				setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 3); // Nạp thêm 5 bài viết
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const visiblePostData = posts.slice(0, visiblePosts);

	const listImage = [noCover, noCover, noCover, noCover];
	const handleGroup = async (e) => {
		const target = e.target.innerHTML;
		switch (target) {
			case 'Tham gia nhóm':
				const toastId = toast.loading('Đang gửi yêu cầu tham gia...');
				await PostGroupApi.joinGroup({ user: currentUser, postId: params.postGroupId })
					.then((res) => {
						toast.success('Gửi yêu cầu tham gia thành công!', { id: toastId });
						//reload trang
						console.log('res', { ...postGroup, roleGroup: res.result });
						setPostGroup({ ...postGroup, roleGroup: res.result });
						console.log('postGroup', postGroup);
					})
					.catch((error) => {
						toast.error(error.message || error.toString(), { id: toastId });
					});
				break;
			case 'Đã Tham gia':
				break;
			case 'Quản lý nhóm':
				navigate(`/groups/manager/${params.postGroupId}`);
				break;
			case 'Chờ xác nhận':
				break;
			case 'Chấp nhận lời mời':
				break;
			default:
				break;
		}
	};
	// Hàm border-radius 4 gốc cho 4 ảnh
	function getImageStyles(index) {
		let borderStyles = '';

		switch (index) {
			case 0:
				borderStyles = '8px 0 0 0';
				break;
			case 1:
				borderStyles = '0 8px 0 0';
				break;
			case 2:
				borderStyles = '0 0 0 8px';
				break;
			case 3:
				borderStyles = '0 0 8px 0';
				break;
			default:
				borderStyles = '0';
		}

		return {
			borderRadius: borderStyles,
		};
	}

	return (
		<>
			<Helmet title={`Nhóm ${postGroup.postGroupName} |UTEALO`} />
			<Toaster />
			<Topbar />
			<div className="homeContainer">
				<SidebarGroup user={currentUser} />
				<div className="menu--post">
					{postGroup && (
						<div className="header--group">
							<div
								className="groupCover"
								style={{ color: theme.foreground, background: theme.background }}
							>
								<img className="groupCoverImg" src={postGroup.background || noCover} alt="..." />

								<img className="groupUserImg" src={postGroup.avatar || sampleProPic} alt="..." />
							</div>
							<div className="group--contanier--top">
								<div className="group--detail">
									<span className="group--name">{postGroup.postGroupName}</span>
									<div className="group--name-info">
										{postGroup.isPublic === true ? (
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
								{postGroup.roleGroup !== 'None' ? (
									<div className="group--header--button">
										<button
											variant="contained"
											className="group--button-joined"
											onClick={handleGroup}
										>
											<p>
												{postGroup?.roleGroup === 'Admin'
													? 'Quản lý nhóm'
													: postGroup?.roleGroup === 'Member'
													? 'Đã Tham gia'
													: postGroup?.roleGroup === 'Waiting Accept'
													? 'Chờ xác nhận'
													: 'Chấp nhận lời mời'}
											</p>
										</button>
										{(postGroup?.roleGroup === 'Admin' || postGroup?.roleGroup === 'Member') && (
											<button variant="contained" className="group--button-add">
												<p> + Mời</p>
											</button>
										)}
										{/* <button variant="contained" className="group--button-more">
										<p> ▼ </p>
									</button> */}
									</div>
								) : (
									<div className="group--header--button">
										<button
											variant="contained"
											className="group--button-joined"
											onClick={handleGroup}
										>
											<p>Tham gia nhóm</p>
										</button>
									</div>
								)}
							</div>
							<hr />
							<div className="list--feature--group">
								<ul className="list-feature">
									<li>Thảo luận</li>
									<li>Đáng chú ý</li>
									<li>Phòng họp mặt</li>
									<li>Mọi người</li>
									<li>Sự kiện</li>
									<li>File phương tiện</li>
									<li>File</li>
								</ul>
								<div className="container--search--group">
									<div className="container--search--group-icon">
										<Search />
									</div>
									<div className="container--search--group-more">
										<MoreHoriz />
									</div>
								</div>
							</div>
						</div>
					)}
					<div className="container--group">
						{(postGroup.roleGroup === 'Waiting Accept' ||
							postGroup.roleGroup === 'Accept Invited' ||
							postGroup.roleGroup === 'None') &&
						postGroup.isPublic === false ? (
							<div></div>
						) : (
							<div className="feed">
								<div className="feedWrapper">
									{(postGroup.roleGroup == 'Admin' || postGroup.roleGroup == 'Member') && (
										<Share fetchPosts={fetchPosts} />
									)}
									{loading && (
										<Box display="flex" justifyContent="center" sx={{ my: 2 }}>
											<CircularProgress color="secondary" />
										</Box>
									)}
									{visiblePostData.length === 0 ? (
										<h2 style={{ marginTop: '20px' }}>No posts yet!</h2>
									) : (
										visiblePostData.map((p) => (
											<PostCard post={p} key={p.postId} fetchPosts={fetchPosts} />
										))
									)}
								</div>
							</div>
						)}
						{postGroup && (
							<div className="rightbar--group">
								<div className="group--infor">
									<div className="group--infor-introduce">Giới thiệu</div>
									<div className="group--infor-bio">
										<span>{postGroup.bio}</span>
									</div>
									{postGroup.isPublic ? (
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

									<div className="group--infor-more">Tìm hiểu thêm</div>
								</div>
								{(postGroup.roleGroup === 'Waiting Accept' ||
									postGroup.roleGroup === 'Accept Invited' ||
									postGroup.roleGroup === 'None') &&
								postGroup.isPublic === false ? (
									<div></div>
								) : (
									<div className="group--file">
										<div className="group--file-text">
											<div className="group--file-text-title">File phương tiện</div>
											<div className="group--file-text-more">Xem tất cả file</div>
										</div>

										<div className="file--photos">
											{Array.from({ length: 4 }).map((_, index) => (
												<div
													key={index}
													className="filePhotoItem"
													style={getImageStyles(index)}
												>
													<img src={listImage[index] || sampleProPic} alt="" />
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default GroupDetail;
