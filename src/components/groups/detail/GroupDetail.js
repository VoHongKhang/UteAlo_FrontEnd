import React, { useEffect, useRef, useState } from 'react';
import PostCard from '../../timeline/post/PostCard';
import useAuth from '../../../context/auth/AuthContext';
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
import { Image, Typography, theme } from 'antd';
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
import InfiniteScroll from 'react-infinite-scroll-component';
import { postDetail } from '../../../api/postGroups/postDetail';
import { Popover } from '@material-ui/core';
const GroupDetail = () => {
	const isMounted = useRef(true);
	const params = useParams();
	const { user: currentUser } = useAuth();
	const [listPost, setListPost] = useState([]);
	const [sortedList, setSortedList] = useState([]);
	const [popoverItem, setPopoverItem] = useState(null);
	const [hasMore, setHasMore] = useState({
		posts: false,
		share: false,
	});
	const [page, setPage] = useState(0);
	const [postLength, setPostLength] = useState(0);

	const loadMore = async () => {
		const newPage = page + 1;
		setPage(newPage);

		try {
			if (isMounted.current) {
				const [res, response] = await Promise.all([
					hasMore.posts && postDetail.getListPostById(currentUser, params.postGroupId, newPage, 20),
					hasMore.share && postDetail.getSharePostById(currentUser, params.postGroupId, newPage, 20),
				]);

				if (res) {
					console.log('res', res);
					setListPost((prevList) => [...prevList, ...res]);
					setPostLength((prevLength) => prevLength + res.length);

					if (res.length < 20) {
						setHasMore({ ...hasMore, posts: false });
					} else {
						setHasMore({ ...hasMore, posts: true });
					}
				}

				if (response) {
					console.log('response', response);
					setListPost((prevList) => [...prevList, ...response]);
					setPostLength((prevLength) => prevLength + response.length);

					if (response.length < 20) {
						setHasMore({ ...hasMore, share: false });
					} else {
						setHasMore({ ...hasMore, share: true });
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	const fetchPosts = async () => {
		console.log('fetchPosts');
		try {
			const [res, response] = await Promise.all([
				postDetail.getListPostById(currentUser, params.postGroupId, page, 20),
				postDetail.getSharePostById(currentUser, params.postGroupId, page, 20),
			]);

			if (response) {
				console.log('response', response);
				setListPost((prevList) => [...prevList, ...response]);
				setPostLength((pre) => pre + response.length);
				if (response.length < 20) {
					setHasMore({ ...hasMore, share: false });
				} else {
					setHasMore({ ...hasMore, share: true });
				}
			}

			if (res) {
				console.log('res', res);
				setListPost((prevList) => [...prevList, ...res]);
				setPostLength((pre) => pre + res.length);
				if (res.length < 20) {
					setHasMore({ ...hasMore, posts: false });
				} else {
					setHasMore({ ...hasMore, posts: true });
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getNewPost = (data) => {
		setListPost((prevList) => [data, ...prevList]);
		setPostLength((pre) => pre + 1);
	};

	const getPostUpdate = (data, action) => {
		if (action === 'delete') {
			setListPost((prevList) => prevList.filter((item) => item.postId !== data));

			// Check bài share có postId trùng với data thì xóa
			setListPost((prevList) =>
				prevList.filter((item) => !item.postsResponse || item.postsResponse.postId !== data)
			);
			setPostLength((pre) => pre - 1);
		} else if (action === 'update') {
			setListPost((prevList) => prevList.map((item) => (item.postId === data.postId ? data : item)));
		}
		// } else if (action === 'create') {
		// 	console.log('data', data);
		// 	setListPost((prevList) => [data, ...prevList]);
		// 	setPostLength((pre) => pre + 1);
		// }
	};

	const getNewSharePost = (data, action) => {
		if (action === 'delete') {
			setListPost((prevList) => prevList.filter((item) => item.shareId !== data));
			setPostLength((pre) => pre - 1);
		} else if (action === 'update') {
			setListPost((prevList) => prevList.map((item) => (item.shareId === data.shareId ? data : item)));
		} else if (action === 'create') {
			setListPost((prevList) => [data, ...prevList]);
			setPostLength((pre) => pre + 1);
		}
	};

	useEffect(() => {
		isMounted.current = true; // Component đã mounted
		fetchPosts();
		return () => {
			setListPost([]); // Component sẽ unmounted
			isMounted.current = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.postGroupId]);

	useEffect(() => {
		// Sắp xếp listPost theo updatedAt từ sớm nhất đến muộn nhất
		const sorted = [...listPost].sort((a, b) => new Date(b.updateAt) - new Date(a.updateAt));
		setSortedList(sorted);
		console.log('sorted', sorted);
		return () => {
			setSortedList([]);
		};
	}, [listPost]);

	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
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
	const [inforUser, setInforUser] = useState();
	const getUser = (data) => {
		setInforUser(data);
	};
	const [anchorEl, setAnchorEl] = useState(null);
	const handleClose = () => {
		setAnchorEl(null);
	};
	useEffect(() => {
		const fetchGroup = async () => {
			const res = await PostGroupApi.getGroup({ user: currentUser, postId: params.postGroupId });
			setPostGroup(res.result);
			console.log('res', res.result);
		};
		fetchGroup();
	}, [params, currentUser]);

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

	// Model xuất hiện khi nhấn nút mời
	const showInviteModal = () => {
		setIsInviteModalVisible(true);
	};

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
				setAnchorEl(e.currentTarget);
				setPopoverItem('Đã Tham gia');
				break;
			case 'Quản lý nhóm':
				navigate(`/groups/manager/${params.postGroupId}`);
				break;
			case 'Chờ xác nhận':
				setAnchorEl(e.currentTarget);
				setPopoverItem('Chờ xác nhận');
				break;
			case 'Chấp nhận lời mời':
				setAnchorEl(e.currentTarget);
				setPopoverItem('Chấp nhận lời mời');
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
	const leaveGroup = async () => {
		const toastId = toast.loading('Đang rời khỏi nhóm...');

		await PostGroupApi.leaveGroup({ token: currentUser.accessToken, postGroupId: params.postGroupId })
			.then((res) => {
				toast.success('Rời khỏi nhóm thành công!', { id: toastId });
				//reload trang
				console.log('res', { ...postGroup, roleGroup: res.result });
				setPostGroup({ ...postGroup, roleGroup: res.result });
				console.log('postGroup', postGroup);
			})
			.catch((error) => {
				toast.error(error.message || error.toString(), { id: toastId });
			});
	};
	const openModalGroup = () => {
		setAnchorEl(null);
		Modal.confirm({
			title: 'Bạn có chắc muốn rời khỏi nhóm này?',
			icon: '',
			okText: 'Đồng ý',
			cancelText: 'Hủy',
			onOk: () => {
				leaveGroup();
			},
		});
	};
	const cancelLegage = async () => {
		const toastId = toast.loading('Đang hủy yêu cầu tham gia nhóm...');
		await PostGroupApi.cancelJoinGroupRequest({
			token: currentUser.accessToken,
			postGroupId: params.postGroupId,
		})
			.then((res) => {
				toast.success('Hủy yêu cầu tham gia nhóm thành công!', { id: toastId });
				
				//reload trang
				console.log('res', { ...postGroup, roleGroup: res.result });
				setPostGroup({ ...postGroup, roleGroup: res.result });
				console.log('postGroup', postGroup);
			})
			.catch((error) => {
				toast.error(error.message || error.toString(), { id: toastId });
			});
	};
	const cancelInvite = async () => {
		const toastId = toast.loading('Đang từ chối lời mời vào nhóm..');
		await PostGroupApi.declineJoinGroupRequest({
			token: currentUser.accessToken,
			postGroupId: params.postGroupId,
		})
			.then((res) => {
				toast.success('Từ chối lời mời tham gia nhóm thành công!', { id: toastId });
				//reload trang

				console.log('res', { ...postGroup, roleGroup: res.result });
				setPostGroup({ ...postGroup, roleGroup: res.result });
				console.log('postGroup', postGroup);
			})
			.catch((error) => {
				toast.error(error.message || error.toString(), { id: toastId });
			});
	};
	const openCancelInviteModal = () => {
		setAnchorEl(null);
		Modal.confirm({
			title: 'Bạn có chắc muốn hủy lời mời tham gia nhóm này?',
			icon: '',
			okText: 'Đồng ý',
			cancelText: 'Hủy',
			onOk: () => {
				cancelInvite();
			},
		});
	};
	const acceptInvite = async () => {
		const toastId = toast.loading('Đang chấp nhận lời mời tham gia nhóm...');
		await PostGroupApi.acceptJoinGroupRequest({
			token: currentUser.accessToken,
			postGroupId: params.postGroupId,
		})
			.then((res) => {
				toast.success('Chấp nhận lời mời tham gia nhóm thành công!', { id: toastId });
				//reload trang

				console.log('res', { ...postGroup, roleGroup: res.result });
				setPostGroup({ ...postGroup, roleGroup: res.result });
				console.log('postGroup', postGroup);
			})
			.catch((error) => {
				toast.error(error.message || error.toString(), { id: toastId });
			});
	};
	const openAcceptInviteModal = () => {
		setAnchorEl(null);
		Modal.confirm({
			title: 'Bạn có chắc muốn chấp nhận lời mời tham gia nhóm này?',
			icon: '',
			okText: 'Đồng ý',
			cancelText: 'Hủy',
			onOk: () => {
				acceptInvite();
			},
		});
	};

	const openCancelLegageModal = () => {
		setAnchorEl(null);
		Modal.confirm({
			title: 'Bạn có chắc muốn hủy yêu cầu tham gia nhóm này?',
			icon: '',
			okText: 'Đồng ý',
			cancelText: 'Hủy',
			onOk: () => {
				cancelLegage();
			},
		});
	};
	return (
		<>
			<Helmet title={`Nhóm ${postGroup.postGroupName} |UTEALO`} />
			<Toaster />
			<Topbar dataUser={getUser} />
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
											aria-describedby="simple-popover"
										>
											<p>
												{postGroup?.roleGroup === 'Admin' || postGroup?.roleGroup === 'Deputy'
													? 'Quản lý nhóm'
													: postGroup?.roleGroup === 'Member'
													? 'Đã Tham gia'
													: postGroup?.roleGroup === 'Waiting Accept'
													? 'Chờ xác nhận'
													: 'Chấp nhận lời mời'}
											</p>
										</button>
										<Popover
											id="simple-popover"
											className="popover--list"
											anchorOrigin={{
												vertical: 'bottom',
												horizontal: 'right',
											}}
											transformOrigin={{
												vertical: 'top',
												horizontal: 'right',
											}}
											anchorEl={anchorEl}
											onClose={handleClose}
											open={Boolean(anchorEl)}
										>
											{popoverItem === 'Đã Tham gia' && (
												<>
													<Typography
														className="title--popper"
														onClick={() => openModalGroup()}
													>
														Rời khỏi nhóm
													</Typography>
												</>
											)}
											{popoverItem === 'Chờ xác nhận' && (
												<>
													<Typography
														className="title--popper"
														onClick={() => {
															openCancelLegageModal();
														}}
													>
														Hủy yêu cầu tham gia
													</Typography>
												</>
											)}
											{popoverItem === 'Chấp nhận lời mời' && (
												<>
													<Typography
														className="title--popper"
														onClick={() => {
															openAcceptInviteModal();
														}}
													>
														Chấp nhận lời mời
													</Typography>
													<Typography
														className="title--popper"
														onClick={() => {
															openCancelInviteModal();
														}}
													>
														Từ chối lời mời
													</Typography>
												</>
											)}

											<Typography
												className="title--popper"
												onClick={() => {
													toast.error('Chức năng đang phát triển');
													setAnchorEl(null);
												}}
											>
												Hủy theo dõi nhóm
											</Typography>
										</Popover>

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
								<div className="feedWrapper" id="feed--group--scroll">
									{(postGroup.roleGroup === 'Admin' ||
										postGroup.roleGroup === 'Member' ||
										postGroup.roleGroup === 'Deputy') && (
										<Share newPosts={getNewPost} postGroupId={postGroup.postGroupId} />
									)}
									<InfiniteScroll
										scrollableTarget="feed--group--scroll"
										className="feed__scroll"
										dataLength={postLength}
										next={loadMore}
										hasMore={hasMore.posts || hasMore.share}
										loader={
											<Skeleton
												style={{ marginTop: '30px' }}
												active
												avatar
												paragraph={{
													rows: 4,
												}}
											/>
										}
									>
										{sortedList?.map((p) => {
											if (p.postId) {
												return (
													<PostCard
														inforUser={inforUser}
														post={p}
														key={`post-${p.postId}`}
														group={postGroup}
														newShare={getPostUpdate}
													/>
												);
											} else {
												return (
													<SharePostCard
														inforUser={inforUser}
														share={p}
														key={`share-${p.shareId}`}
														newSharePosts={getNewSharePost}
													/>
												);
											}
										})}
									</InfiniteScroll>

									{/* {visiblePostData.length === 0 ? (
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
									))} */}
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
