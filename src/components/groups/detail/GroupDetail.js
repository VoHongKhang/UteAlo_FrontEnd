import React, { useEffect, useState } from 'react';
import PostCard from '../../timeline/post/PostCard';
import useAuth from '../../../context/auth/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../../../context/apiCall';
import sampleProPic from '../../../assets/appImages/user.png';
import noCover from '../../../assets/appImages/noCover.jpg';
import { Search, Public, People, MoreHoriz, Visibility, Room, Lock } from '@material-ui/icons';
import { useParams } from 'react-router-dom';
import Share from '../../timeline/sharePost/Share';
import Topbar from '../../timeline/topbar/Topbar';
import SidebarGroup from '../sidebar/SidebarGroup';
import { Helmet } from 'react-helmet';
import toast, { Toaster } from 'react-hot-toast';
import PostGroupApi from '../../../api/postGroups/PostGroupApi';
import './GroupDetail.css';
import { useNavigate } from 'react-router-dom';
import { Image, theme } from 'antd';
import { Modal, Select, Checkbox } from 'antd';
import qrCode from '../../../assets/icons/qr-code/qr-code.png';
import home from '../../../assets/icons/qr-code/home.png';
import building from '../../../assets/icons/qr-code/building.png';
import people from '../../../assets/icons/qr-code/people.png';
import GetFriendApi from '../../../api/profile/friend/getFriendApi';
import InviteFriendApi from '../../../api/postGroups/inviteFriendApi';
import noAvatar from '../../../assets/appImages/user.png';
import SharePostCard from '../../timeline/post/SharePostCard';
import { Skeleton } from 'antd';

const GroupDetail = () => {
	const params = useParams();
	const { user: currentUser } = useAuth();
	const [posts, setPosts] = useState([]);
	const [sharePosts, setSharePosts] = useState([]);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [visiblePosts, setVisiblePosts] = useState(3); // Số lượng bài viết hiển thị ban đầu
	const [postGroup, setPostGroup] = useState([]);
	const { token } = theme.useToken();
	const [listFriends, setListFriends] = useState([]);
	// Xử lý nút hiện thì modal khi bấm nút mời
	const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
	// Những người bạn được chọn
	const [selectedFriends, setSelectedFriends] = useState([]);
	const [isFriendSelected, setIsFriendSelected] = useState(false);

	const handleSelectChange = (selectedValues) => {
		setSelectedFriends(selectedValues);
		setIsFriendSelected(selectedValues.length > 0);
	};

	useEffect(() => {
		const fetchGroup = async () => {
			const res = await PostGroupApi.getGroup({ user: currentUser, postId: params.postGroupId });
			setPostGroup(res.result);
		};
		fetchGroup();
	}, [params, currentUser]);

	// Lấy danh sách bài post
	const fetchPosts = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			setLoading(true);

			const res = await axios.get(`${BASE_URL}/v1/groupPost/${params.postGroupId}/posts`, config);
			setLoading(false);
			setPosts(res.data.result);
		} catch (error) {
			console.log(error);
		}
	};

	console.log(posts);
	console.log(params.postGroupId);

	// Lấy danh sách các bài share post
	const fetchSharePosts = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			setLoading(true);

			const res = await axios.get(`${BASE_URL}/v1/groupPost/${params.postGroupId}/shares`, config);
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

	// Lấy danh sách bạn bè
	const handlerSelectFriend = async () => {
		try {
			setLoading(true);
			const response = await GetFriendApi.getFriend(currentUser);
			setListFriends(response.result);
			setLoading(false);
		} catch {
			console.log('error');
		}
	};

	// Hàm mời bạn bè vào nhóm
	const inviteFriend = async () => {
		try {
			await InviteFriendApi.inviteFriendApi(currentUser.accessToken, params.postGroupId, selectedFriends);
			// Nếu gửi lời mời thành công, thực hiện các bước sau:
			setSelectedFriends([]); // Đặt selectedFriends thành mảng rỗng
			setIsInviteModalVisible(false); // Đóng modal
		} catch (err) {
			console.log(err);
		}
	};

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

	// Model xuất hiện khi nhấn nút mời
	const showInviteModal = () => {
		setIsInviteModalVisible(true);
	};

	const visiblePostData = posts.slice(0, visiblePosts);

	const listImage = [noCover, noCover, noCover, noCover];
	const handleGroup = async (e) => {
		const target = e.target.innerHTML;
		console.log('postId', params);
		switch (target) {
			case 'Tham gia nhóm':
				const toastId = toast.loading('Đang gửi yêu cầu tham gia...');
				await PostGroupApi.joinGroup({ token: currentUser.accessToken, postGroupId: params.postGroupId })
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
								{postGroup.background !== null ? (
									<Image
										hoverable={true}
										cover={true}
										width="100%"
										className="groupCoverImg"
										src={postGroup.background} // Sử dụng selectedPost.photos thay vì cố định URL như bạn đã đề cập
										alt={'backgroup'}
										style={{ objectFit: 'cover', background: token.colorBgLayout }}
									/>
								) : (
									<img className="groupCoverImg" src={noCover} alt="..." />
								)}
								{postGroup.avatar !== null ? (
									<Image
										hoverable={true}
										cover={true}
										width="100%"
										className="groupUserImg"
										src={postGroup.avatar} // Sử dụng selectedPost.photos thay vì cố định URL như bạn đã đề cập
										alt={'backgroup'}
										style={{
											objectFit: 'cover',
											background: token.colorBgLayout,
											top: '-80px',
										}}
									/>
								) : (
									<img className="groupUserImg" src={sampleProPic} alt="..." />
								)}
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
								{postGroup.roleGroup !== 'None' ? (
									<div className="group--header--button">
										<button
											variant="contained"
											className="group--button-joined"
											onClick={handleGroup}
										>
											<p>
												{(postGroup?.roleGroup === 'Admin' || postGroup?.roleGroup === 'Deputy')
													? 'Quản lý nhóm'
													: postGroup?.roleGroup === 'Member'
													? 'Đã Tham gia'
													: postGroup?.roleGroup === 'Waiting Accept'
													? 'Chờ xác nhận'
													: 'Chấp nhận lời mời'}
											</p>
										</button>
										{(postGroup?.roleGroup === 'Admin' || postGroup?.roleGroup === 'Member') && (
											<button
												variant="contained"
												className="group--button-add"
												onClick={() => showInviteModal()}
											>
												<p> + Mời</p>
											</button>
										)}
										<Modal
											className="modal--invite--friend"
											title={
												<span className="custom-modal-title">Mời bạn bè tham gia nhóm này</span>
											}
											open={isInviteModalVisible}
											onCancel={() => {
												setIsInviteModalVisible(false);
											}}
											okText="Gửi lời mời"
											onOk={inviteFriend}
											cancelText="Hủy"
										>
											<div className="line--top"></div>
											<p className="filter--text">Lọc bạn bè để mời theo hạng mục</p>
											<div className="filter--seletion">
												<div className="filter--seletion-option">
													<img src={building} alt="building" />
													<p>Long Xuyên</p>
												</div>
												<div className="filter--seletion-option">
													<img src={people} alt="people" />
													<p>Nhóm chung</p>
												</div>
												<div className="filter--seletion-option">
													<img src={home} alt="home" />
													<p>Chaudok</p>
												</div>
											</div>
											<div className="invite--friend">
												<div className="invite--friend-search">
													<div className="input--search">
														<Search
															className="icon__search"
															style={{
																marginLeft: '10px',
																fontSize: '24px',
																color: 'rgb(186 193 205)',
															}}
														/>
														<input
															type="text"
															placeholder="Tìm bạn bè theo tên"
															className="input__search"
														/>
													</div>
													<div className="select-friend">
														<Select
															className="select-list--friend"
															showSearch
															mode="multiple"
															loading={loading}
															placeholder="Mời bạn bè (Không bắt buộc)"
															optionFilterProp="label"
															onClick={handlerSelectFriend}
															onChange={handleSelectChange}
														>
															{listFriends.map((item) => (
																<Select.Option
																	key={item.userId}
																	value={item.userId}
																	label={item.username}
																>
																	<div
																		style={{
																			display: 'flex',
																			alignItems: 'center',
																		}}
																	>
																		<Checkbox style={{ marginRight: '10px' }} />
																		<img
																			src={item.avatar ? item.avatar : noAvatar}
																			alt="avatar"
																		/>
																		<p>{item.username}</p>
																	</div>
																</Select.Option>
															))}
														</Select>
													</div>
												</div>

												<div className="number--friend-selected">
													<div className="friend--seleted-text">
														{`ĐÃ CHỌN ${selectedFriends.length} NGƯỜI BẠN`}
													</div>
													{isFriendSelected && (
														<div className="friend--selected">
															{selectedFriends.map((friendId) => {
																const friend = listFriends.find(
																	(item) => item.userId === friendId
																);
																return (
																	<div key={friendId} className="selected">
																		<Checkbox
																			// Thêm sự kiện onClick cho checkbox để xóa bạn đã chọn
																			onClick={() => {
																				const updatedSelectedFriends =
																					selectedFriends.filter(
																						(id) => id !== friendId
																					);
																				setSelectedFriends(
																					updatedSelectedFriends
																				);
																			}}
																		/>
																		<img
																			src={
																				friend?.avatar
																					? friend.avatar
																					: noAvatar
																			}
																			alt="avatar"
																		/>
																		<p>{friend?.username}</p>
																	</div>
																);
															})}
														</div>
													)}
												</div>
											</div>
											<div className="line--mid"></div>
											<div className="invite--friend-qr">
												<div className="icon--qr">
													<img src={qrCode} alt="QR Code" />
												</div>
												<div className="qr--text">
													<p className="qr--text-one">Mời qua mã QR</p>
													<p className="qr--text-two">
														Bạn có thể tạo mã QR cho mọi người quét để truy cập vào nhóm của
														bạn
													</p>
												</div>
											</div>
											<div className="line--bottom"></div>
										</Modal>
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
						postGroup.groupType === 'Private' ? (
							<div></div>
						) : (
							<div className="feed">
								<div className="feedWrapper">
									{(postGroup.roleGroup === 'Admin' || postGroup.roleGroup === 'Member' ||postGroup.roleGroup === 'Deputy') && (
										<Share fetchPosts={fetchPosts} postGroupId={postGroup.postGroupId} />
									)}
									{visiblePostData.length === 0 ? (
										<>
											<Skeleton
												style={{ marginTop: '30px' }}
												active
												avatar
												paragraph={{
													rows: 4,
												}}
											/>
											<Skeleton
												style={{ marginTop: '30px' }}
												active
												avatar
												paragraph={{
													rows: 4,
												}}
											/>
										</>
									) : (
										visiblePostData.map((p) => (
											<PostCard post={p} key={p.postId} fetchPosts={fetchPosts} />
										))
									)}
									{sharePosts.map((p) => (
										<SharePostCard share={p} key={p.shareId} fetchSharePosts={fetchSharePosts} />
									))}
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

									<div className="group--infor-more">Tìm hiểu thêm</div>
								</div>
								{(postGroup.roleGroup === 'Waiting Accept' ||
									postGroup.roleGroup === 'Accept Invited' ||
									postGroup.roleGroup === 'None') &&
								postGroup.groupType === 'Private' ? (
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
