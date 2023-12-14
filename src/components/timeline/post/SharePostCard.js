import React, { useState, useEffect, useCallback, useRef } from 'react';
import './PostCard.css';
import sampleProPic from '../../../assets/appImages/user.png';
import heart from '../../../assets/appImages/heart.png';
import heartEmpty from '../../../assets/appImages/heartEmpty.png';
import { Group, Lock, MoreHoriz, Public, Room, Send } from '@material-ui/icons';
import { Box, CircularProgress, IconButton, Popover } from '@material-ui/core';
import { PermMedia, Cancel } from '@material-ui/icons';
import axios from 'axios';
import { formatTime } from '../../utils/CommonFuc';
import { BASE_URL } from '../../../context/apiCall';
import InputEmoji from 'react-input-emoji';
import toast from 'react-hot-toast';
import usePost from '../../../context/post/PostContext';
import useAuth from '../../../context/auth/AuthContext';
import LikeOrUnlikeApi from '../../../api/timeline/commentSharePost/likeOrUnilkeShare';
import GetCommentSharePostApi from '../../../api/timeline/commentSharePost/getCommentSharePost';
import CommentCard from './CommentCard';
import { Image, Modal, Typography, theme } from 'antd';
import classnames from 'classnames';
import { useNavigate } from 'react-router-dom';
import PostModal from '../../utils/PostModal';
import { ModalShare } from '../sharePost/ModalShare';
import { useWebSocket } from '../../../context/WebSocketContext';
const SharePostCard = ({ inforUser, share, newSharePosts }) => {
	const [isModalVisible, setModalVisible] = useState(false);
	const [currentPost, setCurrentPost] = useState(null);
	const handleButtonClick = (post) => {
		setCurrentPost(post);
		setModalVisible(true);
	};

	const handleModalClose = () => {
		setModalVisible(false);
	};

	const navigate = useNavigate();
	const classNameUser = [share?.postGroupId && 'hasGroup'];
	const classUserPost = [share?.postsResponse.postGroupId && 'hasGroup'];
	const { token } = theme.useToken();
	//=======Open Handler Button More=======

	const [anchor, setAnchor] = useState(null);
	const [openConfirmation, setOpenConfirmation] = useState(false);
	const [action, setAction] = useState(null);
	const handleClose = () => {
		setAnchor(null);
		setAction(null);
	};
	const handleOpenConfirmation = (action) => {
		setAnchor(null);
		setOpenConfirmation(true);
		setAction(action);
	};

	const handleClick = (e) => {
		setAnchor(e.currentTarget);
	};

	const handleCloseConfirmation = () => {
		setOpenConfirmation(false);
		setAnchor(null);
		setAction(null);
	};
	const handleConfirmAction = (data) => {
		if (action === 'deleteSharePost') {
			deletePostHandler(data);
		} else if (action === 'editSharePost') {
			editPostHandler(data);
		} else if (action === 'sharePost') {
			sharePostHandler(data);
		} else if (action === 'reportPost') {
			reportPostHandler(data);
		}
		setOpenConfirmation(false);
		setAction(null);
		setAnchor(null);
	};
	//=======Close Handler Button More=======

	const isMounted = useRef(true);
	const { user: currentUser } = useAuth();
	const [toggleModal, setToggleModal] = useState(false);
	useEffect(() => {
		return () => {
			// Cleanup: Set isMounted to false when the component unmounts
			isMounted.current = false;
		};
	}, []);
	// Hàm kiểm tra xem người dùng đã like bài share chưa
	const checkUserLikeShare = useCallback(async () => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};

			const response = await axios.get(`${BASE_URL}/v1/share/like/checkUser/${share.shareId}`, config);
			const responseData = response.data;
			const resultValue = responseData.result;

			return resultValue;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}, [currentUser.accessToken, share.shareId]);

	const [like, setLike] = useState(share.likes?.length);
	const [isLiked, setIsLiked] = useState(false);
	const [commentLoading, setCommentLoading] = useState(false);
	const [comments, setCommentPost] = useState({});
	const [commentlength, setCommentLength] = useState(share?.comments.length);
	const [showAllComments, setShowAllComments] = useState(false);

	// Hình ảnh và nội dung của bình luận
	const [photosComment, setPhotosComment] = useState('');
	const [photosCommetUrl, setPhotosCommetUrl] = useState('');
	const [content, setContent] = useState('');

	// Danh sách người dùng thích bài share post
	const [listUserLikePost, setListUserLikePost] = useState([]);

	const [showModalLikePost, setShowModalLikePost] = useState(false);

	const handleLikeCounterClick = () => {
		setShowModalLikePost(true);
	};

	const handleCloseModal = () => {
		setShowModalLikePost(false);
	};

	// Chức năng xem chi tiết chia sẻ bài viết
	const [showSharePostDetailModal, setShowSharePostDetailModal] = useState(false);
	const [selectedSharePost, setSelectedSharePost] = useState(null);

	const { sharePost } = usePost();
	//Chia sẻ bài viết
	const sharePostHandler = async (e) => {
		try {
			const res = await sharePost(e);
			console.log(res);
			newSharePosts(res.result, 'create');
		} catch (error) {
			console.error(error);
			toast.error('Có lỗi xảy ra khi tạo bài viết.');
		}
	};
	const reportPostHandler = async (e) => {
		e.preventDefault();
		toast.loading('Chức năng đang trong quá trình phát triển');
	};
	// Hàm kiểm tra xem người dùng đã like bài post chưa
	useEffect(() => {
		const fetchData = async () => {
			try {
				const resultValue = await checkUserLikeShare();
				if (isMounted.current) {
					setIsLiked(resultValue);
				}
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
	}, [checkUserLikeShare]);

	// lấy danh sách bình luận trên bài share post
	const fetchCommentSharePost = async () => {
		try {
			const res = await GetCommentSharePostApi.getCommentSharePost(share.shareId);
			if (isMounted.current) {
				setCommentPost(res);
			}
		} catch (error) {
			console.error(error);
		}
	};

	// Lấy danh sách người dùng thích bài post
	const fetchLikeSharePost = async () => {
		try {
			const res = await axios.get(`${BASE_URL}/v1/share/like/listUser/${share.shareId}`);
			setListUserLikePost(res.data.result);
		} catch (error) {
			console.error(error);
		}
	};

	// lấy danh sách bình luận trên bài share post
	useEffect(() => {
		fetchLikeSharePost();
		fetchCommentSharePost();
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser.userId, currentUser.accessToken]);

	const { stompClient } = useWebSocket();
	// yêu thích và bỏ yêu thích bài post
	const likePostHandler = async () => {
		try {
			await LikeOrUnlikeApi.likeOrUnlike(share.shareId, currentUser.accessToken, currentUser.userId);
			console.log('share', share);
			console.log('inforUser', inforUser);
			if (isLiked === false && inforUser.userId !== share.userId) {
				const data = {
					shareId: share.shareId,
					userId: share.userId,
					photo: inforUser.avatar,
					content: inforUser.userName + ' đã thích bài chia sẻ của bạn',
					link: `/share/${share.shareId}`,
					isRead: false,
					createAt: new Date().toISOString(),
					updateAt: new Date().toISOString(),
				};

				stompClient.send('/app/userNotify/' + inforUser?.userId, {}, JSON.stringify(data));
			}
		} catch (err) {
			console.log(err);
		}
		setLike(isLiked ? like - 1 : like + 1);
		setIsLiked(!isLiked);
		fetchLikeSharePost();
	};

	const toggleShowAllComments = () => {
		setShowAllComments(!showAllComments);
	};

	// Đăng bình luận share post
	const postCommentHandler = async () => {
		const toastId = toast.loading('Đang gửi yêu cầu...');
		try {
			if (!content && !photosComment) {
				toast.error('Vui lòng nhập nội dung hoặc hình ảnh!', { id: toastId });
				return; // Dừng việc thực hiện tiếp theo nếu nội dung rỗng
			}
			setCommentLoading(true);
			if (share.shareId) {
				const formData = new FormData();
				formData.append('content', content || '');
				if (photosComment) {
					formData.append('photos', photosComment);
				}
				const config = {
					headers: {
						Authorization: `Bearer ${currentUser.accessToken}`,
						'Content-Type': 'multipart/form-data',
					},
				};
				formData.append('shareId', share.shareId || '');

				const response = await axios.post(`${BASE_URL}/v1/share/comment/create`, formData, config);

				// Xử lý kết quả trực tiếp trong khối try
				if (response.status === 200) {
					const newComment = response.data.result;
					// Thêm mới comment vào object comments
					setCommentPost({ ...comments, [newComment.commentId]: newComment });
					setCommentLength(commentlength + 1);
					if (inforUser.userId !== share.userId) {
						const data = {
							shareId: share.shareId,
							userId: share.userId,
							photo: inforUser.avatar,
							content: inforUser.userName + ' đã bình luận bài chia sẻ của bạn',
							link: `/share/${share.shareId}`,
							isRead: false,
							createAt: new Date().toISOString(),
							updateAt: new Date().toISOString(),
						};

						stompClient.send('/app/userNotify/' + inforUser?.userId, {}, JSON.stringify(data));
					}
					toast.success('Đăng bình luận thành công!', { id: toastId });
				} else {
					// Xử lý trường hợp API trả về lỗi
					toast.error(response.message, { id: toastId });
				}
			}
			setCommentLoading(false);
			fetchCommentSharePost();
			setContent('');
			setPhotosComment('');
		} catch (error) {
			setCommentLoading(false);
			toast.error(error.message, { id: toastId });
		}
	};

	// cập nhật lại độ dài của bình luận
	const updateCommentLength = (newLength) => {
		setCommentLength(newLength);
	};

	// xóa bài share
	const deletePostHandler = async () => {
		const toastId = toast.loading('Đang gửi yêu cầu...');
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};

			setCommentLoading(true);
			const res = await axios.put(`${BASE_URL}/v1/share/delete/${share.shareId}`, share.userId, config);
			if (res.status === 200) {
				setCommentLoading(false);
				toast.success('Xóa bài chia sẻ thành công!', { id: toastId });
				// Fetch lại danh sách bài share post sau khi xóa
				newSharePosts(share.shareId, 'delete');
			}
		} catch (error) {
			setCommentLoading(false);
			toast.error(error.response.data.message, { id: toastId });
		}
	};

	// chỉnh sửa bài post
	const editPostHandler = async (data) => {
		const toastId = toast.loading('Đang gửi yêu cầu...');
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${currentUser.accessToken}`,
					'Content-Type': 'application/json',
				},
			};
			const response = await axios.put(`${BASE_URL}/v1/share/update`, data, config);
			console.log(response);
			// Xử lý kết quả trực tiếp trong khối try
			if (response.data.success) {
				toast.success('Chỉnh sửa bài đăng thành công!', { id: toastId });

				// Fetch lại danh sách bài post sau khi chỉnh sửa
				newSharePosts(data, 'update');
			} else {
				// Xử lý trường hợp API trả về lỗi
				toast.error(response.message, { id: toastId });
			}
		} catch (error) {
			setCommentLoading(false);
			toast.error(error.message, { id: toastId });
		}
	};

	// Xử lý hình ảnh của bình luận
	const commentDetails = (e) => {
		const file = e.target.files[0];
		if (file === undefined) {
			toast.error('Vui lòng chọn ảnh!');
			return;
		}
		if (file.type === 'image/jpeg' || file.type === 'image/png') {
			setPhotosComment(file);
			setPhotosCommetUrl(URL.createObjectURL(file));
		} else {
			toast.error('Xin hãy chọn ảnh theo đúng định dạng png/jpg');
		}
	};

	return (
		<div className="post">
			<div className="postWrapper">
				<div className="postTop">
					<div className="postTopLeft">
						<div className="post--header--left">
							{share?.postGroupName && (
								<span
									className="postGroupname"
									onClick={() => navigate(`/groups/${share?.postGroupId}`)}
								>
									{share?.postGroupName}
								</span>
							)}

							<div className="post--header--left--item">
								<img
									className="postProfileImg"
									src={share?.avatarUser || sampleProPic}
									alt="..."
									onClick={() => navigate(`/profile/${share?.userId}`)}
								/>

								<div className="postNameAndDate">
									<span className={classnames('postUsername', classNameUser)}>
										{share?.roleName === 'SinhVien'
											? 'Sinh viên: '
											: share?.roleName === 'GiangVien'
											? 'Giảng viên: '
											: share?.roleName === 'PhuHuynh'
											? 'Phụ huynh: '
											: share?.roleName === 'NhanVien'
											? 'Nhân viên: '
											: share?.roleName === 'Admin'
											? 'Quản trị viên: '
											: null}
										{share?.userName}
									</span>
									<span className="postDateShare">{formatTime(share?.updateAt)}</span>
								</div>
							</div>
						</div>
						{share?.privacyLevel &&
							(share?.privacyLevel === 'PUBLIC' ? (
								<div className="postPrivacyLevel">
									<Public />
									<span>Công khai</span>
								</div>
							) : share?.privacyLevel === 'FRIENDS' ? (
								<div className="postPrivacyLevel">
									<Group />
									<span>Bạn bè</span>
								</div>
							) : share?.privacyLevel === 'PRIVATE' ? (
								<div className="postPrivacyLevel">
									<Lock />
									<span>Riêng tư</span>
								</div>
							) : null)}
					</div>
					<div className="comment" id="postTopRight">
						<IconButton aria-describedby="share--popover" onClick={(e) => handleClick(e)}>
							<MoreHoriz />
						</IconButton>
						<Popover
							id="share--popover"
							open={Boolean(anchor)}
							className="popper--member"
							anchorEl={anchor}
							onClose={handleClose}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
						>
							<div>
								{share.postsResponse?.privacyLevel !== 'PRIVATE' && (
									<Typography
										className="poper--member--item"
										onClick={() => handleOpenConfirmation('sharePost')}
									>
										Chia sẻ bài viết
									</Typography>
								)}
								{share?.userId === currentUser.userId && (
									<>
										<Typography
											className="poper--member--item"
											onClick={() => handleOpenConfirmation('editSharePost')}
										>
											Chỉnh sửa bài chia sẻ
										</Typography>
										<Typography
											className="poper--member--item"
											onClick={() => handleOpenConfirmation('deleteSharePost')}
										>
											Xóa bài chia sẻ
										</Typography>
									</>
								)}

								{share?.userId !== currentUser.userId && (
									<Typography
										className="poper--member--item"
										onClick={() => handleOpenConfirmation('reportPost')}
									>
										Báo cáo bài chia sẻ
									</Typography>
								)}
							</div>
						</Popover>
					</div>
					{openConfirmation && (
						<ModalShare
							share={share}
							user={inforUser}
							currentUser={currentUser}
							visible={openConfirmation}
							onClose={handleCloseConfirmation}
							onShare={handleConfirmAction}
							action={action}
						/>
					)}
				</div>

				<div className="postCenter">
					{share.content && <span className="postText">{share.content}</span>}

					<div className="post">
						<div className="postWrapper">
							<div className="postTop">
								<div className="postTopLeft">
									<div className="post--header--left">
										{share.postsResponse?.postGroupName && (
											<span
												className="postGroupname"
												onClick={() => navigate(`/groups/${share.postsResponse?.postGroupId}`)}
											>
												{share.postsResponse?.postGroupName}
											</span>
										)}

										<div className="post--header--left--item">
											<img
												className="postProfileImg"
												src={share.postsResponse?.avatarUser || sampleProPic}
												alt="..."
												onClick={() => navigate(`/profile/${share.postsResponse?.userId}`)}
											/>

											<div className="postNameAndDate">
												<span className={classnames('postUsername', classUserPost)}>
													{share.postsResponse?.roleName === 'SinhVien'
														? 'Sinh viên: '
														: share.postsResponse?.roleName === 'GiangVien'
														? 'Giảng viên: '
														: share.postsResponse?.roleName === 'PhuHuynh'
														? 'Phụ huynh: '
														: share.postsResponse?.roleName === 'NhanVien'
														? 'Nhân viên: '
														: share.postsResponse?.roleName === 'Admin'
														? 'Quản trị viên: '
														: null}
													{share.postsResponse?.userName}
												</span>

												<span
													className="postDate"
													onClick={() => handleButtonClick(share.postsResponse)}
												>
													{formatTime(share.postsResponse?.postTime)}
												</span>
											</div>
										</div>
									</div>

									<>
										<div className="postLoAndName">
											{share.postsResponse?.location && (
												<span className="postLocation">
													<Room />
													{share.postsResponse?.location}
												</span>
											)}
										</div>
									</>

									{share.postsResponse?.privacyLevel &&
										(share.postsResponse?.privacyLevel === 'PUBLIC' ? (
											<div className="postPrivacyLevel">
												<Public />
												<span>Công khai</span>
											</div>
										) : share.postsResponse?.privacyLevel === 'FRIENDS' ? (
											<div className="postPrivacyLevel">
												<Group />
												<span>Bạn bè</span>
											</div>
										) : share.postsResponse?.privacyLevel === 'PRIVATE' ? (
											<div className="postPrivacyLevel">
												<Lock />
												<span>Riêng tư</span>
											</div>
										) : null)}
								</div>
							</div>

							<div className="postCenter">
								{share.postsResponse?.content && (
									<span className="postText">{share.postsResponse?.content}</span>
								)}
								{share.postsResponse?.photos && (
									<Image
										width="100%"
										className="postImg"
										src={share.postsResponse?.photos} // Sử dụng selectedPost.photos thay vì cố định URL như bạn đã đề cập
										alt={share.postsResponse?.content}
										style={{ objectFit: 'cover', background: token.colorBgLayout }}
									/>
								)}
								{share.postsResponse?.files &&
									share.postsResponse?.files.toLowerCase().endsWith('.txt') && (
										<div className="postFile">
											<a
												href={share.postsResponse?.files}
												target="_blank"
												rel="noopener noreferrer"
											>
												{share.postsResponse?.files.substr(
													share.postsResponse?.files.lastIndexOf('/') + 1
												)}
											</a>
										</div>
									)}
								{share.postsResponse?.files &&
									share.postsResponse?.files.toLowerCase().endsWith('.docx') && (
										<div className="postFile">
											<a
												href={share.postsResponse?.files}
												target="_blank"
												rel="noopener noreferrer"
											>
												{share.postsResponse?.files.substr(
													share.postsResponse?.files.lastIndexOf('/') + 1
												)}
											</a>
										</div>
									)}
								{share.postsResponse?.files &&
									share.postsResponse?.files.toLowerCase().endsWith('.pdf') && (
										<div className="postFile">
											<a
												href={share.postsResponse?.files}
												target="_blank"
												rel="noopener noreferrer"
											>
												{share.postsResponse?.files.substr(
													share.postsResponse?.files.lastIndexOf('/') + 1
												)}
											</a>
										</div>
									)}
							</div>
						</div>
					</div>
				</div>
				<PostModal
					post={currentPost}
					inforUser={inforUser}
					visible={isModalVisible}
					onClose={handleModalClose}
					modalDetail={0}
				/>
				<div className="postBottom">
					<div className="postBottomLeft">
						<img
							className="likeIcon"
							onClick={likePostHandler}
							src={isLiked ? heart : heartEmpty}
							alt="heart"
						/>
						<span className="postLikeCounter" onClick={handleLikeCounterClick}>
							{like} người đã thích
						</span>
						<Modal
							title="Danh sách người đã thích"
							open={showModalLikePost}
							onCancel={handleCloseModal}
							footer={null}
						>
							<ul>
								{listUserLikePost.length > 0 ? (
									<ul>
										{listUserLikePost.map((user) => (
											<li key={user.userId} style={{ display: 'flex', marginTop: '10px' }}>
												<img
													src={user.avatar ? user.avatar : sampleProPic}
													alt="Avatar"
													style={{ width: '40px', height: '40px', borderRadius: '50%' }}
												/>
												<span
													style={{
														display: 'flex',
														alignItems: 'center',
														marginLeft: '20px',
													}}
												>
													{user.userName}
												</span>
											</li>
										))}
									</ul>
								) : (
									<p>Chưa có ai thích</p>
								)}
							</ul>
						</Modal>
					</div>
					<div className="postBottomRight">
						<span className="postCommentText" onClick={toggleShowAllComments}>
							{commentlength} bình luận
						</span>
					</div>
				</div>

				{commentLoading && (
					<Box display="flex" justifyContent="center" sx={{ my: 2 }}>
						<CircularProgress color="secondary" />
					</Box>
				)}

				<div className="postCommentCont">
					<div className="postCommentCont-1">
						<InputEmoji value={content} onChange={setContent} placeholder={`Viết bình luận ....`} />
						{photosComment && (
							<div className="shareImgContainer">
								<img className="shareimg" src={photosCommetUrl} alt="..." />
								<Cancel className="shareCancelImg" onClick={() => setPhotosComment(null)} />
							</div>
						)}
					</div>
					<label htmlFor="fileComment" className="shareOption">
						<PermMedia htmlColor="tomato" className="shareIcon" />
						<input
							style={{ display: 'none' }}
							type="file"
							id="fileComment"
							accept=".png, .jpeg, .jpg"
							onChange={commentDetails}
						/>
					</label>
					<div className="postCommentCont-2">
						<button
							className="postCommentBtn"
							onClick={postCommentHandler}
							disabled={commentLoading ? true : false}
						>
							<Send style={{ fontSize: '18px' }} />
						</button>
					</div>
				</div>

				{showAllComments
					? Object.values(comments).map((comment) => (
							<CommentCard
								inforUser={inforUser}
								comment={comment}
								fetchCommentPost={fetchCommentSharePost}
								post={share}
								key={comment.commentId}
								onDelete={updateCommentLength}
								commentLength={commentlength}
							/>
					  ))
					: Object.values(comments)
							.slice(0, 1)
							.map((comment) => (
								<CommentCard
									inforUser={inforUser}
									comment={comment}
									fetchCommentPost={fetchCommentSharePost}
									post={share}
									key={comment.commentId}
									onDelete={updateCommentLength}
									onCreate={updateCommentLength}
									commentLength={commentlength}
								/>
							))}

				{Object.values(comments).length >= 2 && (
					<div className="showMoreComment" onClick={toggleShowAllComments}>
						Xem thêm bình luận
					</div>
				)}

				{/* Modal để mở chi tiết bài viết */}
				{showSharePostDetailModal && (
					<Modal
						title="Chi tiết bài viết"
						open={showSharePostDetailModal}
						onCancel={() => {
							setShowSharePostDetailModal(false);
							setSelectedSharePost(null);
						}}
						footer={null}
					>
						{selectedSharePost && (
							<div>
								{/* Sử dụng toàn bộ dữ liệu của bài viết (SharePostCard) ở đây */}
								<SharePostCard share={selectedSharePost} />
							</div>
						)}
					</Modal>
				)}
			</div>
		</div>
	);
};

export default SharePostCard;
