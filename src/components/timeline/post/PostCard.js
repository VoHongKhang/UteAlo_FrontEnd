import React, { useState, useEffect, useCallback, useRef } from 'react';
import './PostCard.css';
import sampleProPic from '../../../assets/appImages/user.png';
import heart from '../../../assets/appImages/heart.png';
import heartEmpty from '../../../assets/appImages/heartEmpty.png';
import { Group, Lock, MoreHoriz, Public, Room, Send } from '@material-ui/icons';
import { Box, CircularProgress, IconButton, Popover } from '@material-ui/core';
import { PermMedia, Cancel } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../context/apiCall';
import InputEmoji from 'react-input-emoji';
import toast from 'react-hot-toast';
import usePost from '../../../context/post/PostContext';
import useAuth from '../../../context/auth/AuthContext';
import LikeOrUnlikeApi from '../../../api/timeline/commentPost/likeOrUnlike';
import GetCommentPostApi from '../../../api/timeline/commentPost/getCommentPost';
import CommentCard from './CommentCard';
import { Image, Skeleton, theme, Typography, Modal } from 'antd';
import PostApi from '../../../api/timeline/post/PostApi';
import { ShareModal } from './ShareModal';
import classnames from 'classnames';
import { formatTime } from '../../utils/CommonFuc';
import PostModal from '../../utils/PostModal';
import { useWebSocket } from '../../../context/WebSocketContext';
import UserAvatar from '../../action/UserAvatar';
const PostCard = ({ inforUser, post, newShare, modalDetail = 0, group }) => {
	const navigate = useNavigate();
	const [isModalVisible, setModalVisible] = useState(false);
	const [currentPost, setCurrentPost] = useState(null);
	const handleButtonClick = (post) => {
		setCurrentPost(post);
		setModalVisible(true);
	};

	const { stompClient } = useWebSocket();
	const handleModalClose = () => {
		setModalVisible(false);
	};

	const classPost = ['post'];
	const classNameUser = [post?.postGroupId && 'hasGroup'];

	//=======Open Handler Button More=======

	const [anchorEl, setAnchorEl] = useState(null);
	const [openConfirmation, setOpenConfirmation] = useState(false);
	const [action, setAction] = useState(null);
	const handleClose = () => {
		setAnchorEl(null);
		setAction(null);
	};
	const handleOpenConfirmation = (action) => {
		setAnchorEl(null);
		setOpenConfirmation(true);
		setAction(action);
	};

	const handleClick = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleCloseConfirmation = () => {
		setOpenConfirmation(false);
		setAnchorEl(null);
		setAction(null);
	};
	const handleConfirmAction = (data) => {
		if (action === 'deletePost') {
			deletePostHandler(data);
		} else if (action === 'editPost') {
			editPostHandler(data);
		} else if (action === 'sharePost') {
			sharePostHandler(data);
		} else if (action === 'reportPost') {
			reportPostHandler(data);
		}
		setOpenConfirmation(false);
		setAction(null);
		setAnchorEl(null);
	};
	//=======Close Handler Button More=======
	const isMounted = useRef(true);
	const { sharePost } = usePost();
	const { user: currentUser } = useAuth();
	useEffect(() => {
		return () => {
			// Cleanup: Set isMounted to false when the component unmounts
			isMounted.current = false;
		};
	}, []);
	// Hàm kiểm tra xem người dùng đã like bài post chưa
	const checkUserLikePost = useCallback(async () => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};

			const response = await axios.get(`${BASE_URL}/v1/post/like/checkUser/${post.postId}`, config);
			const responseData = response.data;
			const resultValue = responseData.result;

			return resultValue;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}, [currentUser.accessToken, post.postId]);

	const [like, setLike] = useState(post.likes?.length);
	const [isLiked, setIsLiked] = useState(false);
	const [commentLoading, setCommentLoading] = useState(false);
	const [comments, setCommentPost] = useState({});
	const [commentlength, setCommentLength] = useState(post?.comments?.length);
	const [showAllComments, setShowAllComments] = useState(false);

	// Hình ảnh và nội dung của bình luận
	const [photosComment, setPhotosComment] = useState('');
	const [photosCommetUrl, setPhotosCommetUrl] = useState('');
	const [content, setContent] = useState('');

	// Màu nền cho xem chi tiết ảnh
	const { token } = theme.useToken();

	// Danh sách người dùng thích bài post
	const [listUserLikePost, setListUserLikePost] = useState([]);

	const [showModalLikePost, setShowModalLikePost] = useState(false);

	const handleLikeCounterClick = () => {
		setShowModalLikePost(true);
	};

	const handleCloseModal = () => {
		setShowModalLikePost(false);
	};

	// Hàm kiểm tra xem người dùng đã like bài post chưa
	useEffect(() => {
		const fetchData = async () => {
			try {
				const resultValue = await checkUserLikePost();
				if (isMounted.current) {
					setIsLiked(resultValue);
				}
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
	}, [checkUserLikePost]);

	// lấy danh sách bình luận trên bài post
	const fetchCommentPost = async () => {
		try {
			const res = await GetCommentPostApi.getCommentPost(post.postId);
			if (isMounted.current) {
				setCommentPost(res);
			}
		} catch (error) {
			console.error(error);
		}
	};

	// Lấy danh sách người dùng thích bài post
	const fetchLikePost = async () => {
		try {
			const res = await axios.get(`${BASE_URL}/v1/post/like/listUser/${post.postId}`);
			setListUserLikePost(res.data.result);
		} catch (error) {
			console.error(error);
		}
	};

	// lấy danh sách bình luận trên bài post
	useEffect(() => {
		fetchLikePost();
		fetchCommentPost();
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser.userId, currentUser.accessToken]);

	// yêu thích và bỏ yêu thích bài post
	const likePostHandler = async () => {
		try {
			await LikeOrUnlikeApi.likeOrUnlike(post.postId, currentUser.accessToken, currentUser.userId);

			console.log('post', post);
			console.log('inforUser', inforUser);

			if (isLiked === false && inforUser.userId !== post.userId) {
				const data = {
					postId: post.postId,
					userId: post.userId,
					photo: inforUser.avatar,
					content: inforUser.userName + ' đã thích bài viết của bạn',
					link: `/post/${post.postId}`,
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
		fetchLikePost();

	};

	// Xử lý xem thêm bình luận
	const toggleShowAllComments = () => {
		setShowAllComments(!showAllComments);
	};

	// Đăng bình luận post
	const postCommentHandler = async () => {
		const toastId = toast.loading('Đang gửi yêu cầu...');
		try {
			if (!content && !photosComment) {
				toast.error('Vui lòng nhập nội dung hoặc hình ảnh!', { id: toastId });
				return; // Dừng việc thực hiện tiếp theo nếu nội dung rỗng
			}
			if (content.length > 250) {
				toast.error('Nội dung bài viết không được vượt quá 250 ký tự!');
				return;
			}
			setCommentLoading(true);
			if (post.postId) {
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
				formData.append('postId', post.postId || '');

				const response = await axios.post(`${BASE_URL}/v1/post/comment/create`, formData, config);

				// Xử lý kết quả trực tiếp trong khối try
				if (response.status === 200) {
					const newComment = response.data.result;
					// Thêm mới comment vào object comments
					setCommentPost({ ...comments, [newComment.commentId]: newComment });
					setCommentLength(commentlength + 1);
					if (inforUser.userId !== post.userId) {
						const data = {
							postId: post.postId,
							userId: post.userId,
							photo: inforUser.avatar,
							content: inforUser.userName + ' đã bình luận bài viết của bạn',
							link: `/post/${post.postId}`,
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
			fetchCommentPost();
			setContent('');
			setPhotosComment('');
		} catch (error) {
			setCommentLoading(false);
			toast.error(error.message, { id: toastId });
		}
	};
	const reportPostHandler = async (e) => {
		e.preventDefault();
		toast.loading('Chức năng đang trong quá trình phát triển');
	};

	//Chia sẻ bài viết
	const sharePostHandler = async (e) => {
		if (group && e.postGroupId === group.postGroupId) {
			toast.error('Không thể chia sẻ bài viết trong chính nhóm này!');
			return;
		} else {
			if (e.content.length > 250) {
				toast.error('Nội dung bài viết không được vượt quá 250 ký tự!');
				return;
			} else {
				try {
					const res = await sharePost(e);
					newShare(res.result, 'create');
				} catch (error) {
					console.error(error);
					toast.error('Có lỗi xảy ra khi tạo bài viết.');
				}
			}
		}
	};

	// cập nhật lại độ dài của bình luận
	const updateCommentLength = (newLength) => {
		setCommentLength(newLength);
	};

	// xóa bài post
	const deletePostHandler = async (data) => {
		const toastId = toast.loading('Đang gửi yêu cầu...');
		try {
			const res = await PostApi.deletePost(currentUser, data, post.userId);
			if (res.success) {
				toast.success('Xóa bài đăng thành công!', { id: toastId });
				newShare(data, 'delete');
			} else {
				toast.error(res.message, { id: toastId });
			}
		} catch (error) {
			toast.error(error.message, { id: toastId });
		}
	};

	// chỉnh sửa bài post
	const editPostHandler = async (data) => {
		console.log('editPostHandler', data);
		const toastId = toast.loading('Đang gửi yêu cầu...');
		if (!data.content && !data.photos && !data.files) {
			toast.error('Vui lòng không được để trống cả 3 trường dữ liệu!', { id: toastId });
			return;
		}
		try {
			if (post.postId) {
				const formData = new FormData();
				formData.append('content', data.content || '');
				formData.append('location', data.location || '');
				if (data.files && typeof data.files !== 'string') {
					formData.append('files', data.files || '');
				} else if (data.files && typeof data.files === 'string') {
					formData.append('fileUrl', data.files || '');
				}
				if (data.photos && typeof data.photos !== 'string') {
					formData.append('photos', data.photos || '');
				} else if (data.photos && typeof data.photos === 'string') {
					formData.append('photoUrl', data.photos || '');
				}

				formData.append('privacyLevel', data.privacyLevel || 'PUBLIC');

				const config = {
					headers: {
						Authorization: `Bearer ${currentUser.accessToken}`,
						'Content-Type': 'multipart/form-data',
					},
				};
				const response = await axios.put(`${BASE_URL}/v1/post/update/${data.postId}`, formData, config);
				console.log('responseEditPost', response);
				// Xử lý kết quả trực tiếp trong khối try
				if (response.status === 200) {
					toast.success('Chỉnh sửa bài đăng thành công!', { id: toastId });
					// Fetch lại danh sách bài post sau khi chỉnh sửa
					newShare(response.data.result, 'update');
				} else {
					// Xử lý trường hợp API trả về lỗi
					toast.error(response.message, { id: toastId });
				}
			}
		} catch (error) {
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

	if (modalDetail === 2) {
		navigate(`/post/${post.postId}`);
		return;
	}
	return (
		<div
			className={classnames(classPost)}
			style={{
				color: theme.foreground,
				background: theme.background,
			}}
		>
			{post === null ? (
				<Skeleton
					style={{ color: theme.foreground, background: theme.background, marginTop: '30px' }}
					active
					avatar
					paragraph={{
						rows: 2,
					}}
				/>
			) : (
				<div
					className="postWrapper"
					style={{
						color: theme.foreground,
						background: theme.background,
					}}
				>
					<div className="postTop">
						<div className="postTopLeft">
							<div className="post--header--left">
								{post.postGroupName && (
									<span
										style={{
											color: theme.foreground,
											background: theme.background,
										}}
										className="postGroupname"
										onClick={() => navigate(`/groups/${post.postGroupId}`)}
									>
										{post.postGroupName}
									</span>
								)}

								<div className="post--header--left--item">
									<UserAvatar user={post} />

									<div className="postNameAndDate">
										<span
											style={{
												color: theme.foreground,
												background: theme.background,
											}}
											className={classnames('postUsername', classNameUser)}
										>
											{post?.roleName === 'SinhVien'
												? 'Sinh viên: '
												: post?.roleName === 'GiangVien'
												? 'Giảng viên: '
												: post?.roleName === 'PhuHuynh'
												? 'Phụ huynh: '
												: post?.roleName === 'NhanVien'
												? 'Nhân viên: '
												: post?.roleName === 'Admin'
												? 'Quản trị viên: '
												: null}
											{post.userName}
										</span>
										{modalDetail !== 3 ? (
											<span
												style={{
													color: theme.foreground,
													background: theme.background,
												}}
												className="postDate"
												onClick={() => handleButtonClick(post)}
											>
												{formatTime(post.updateAt)}
											</span>
										) : (
											<span
												style={{
													color: theme.foreground,
													background: theme.background,
												}}
												className="postDateShare"
											>
												{formatTime(post.updateAt)}
											</span>
										)}
									</div>
								</div>
							</div>
							<div className="postLoAndName">
								{post.location && (
									<span className="postLocation">
										<Room />
										{post.location}
									</span>
								)}
							</div>
							{post?.privacyLevel &&
								(post?.privacyLevel === 'PUBLIC' ? (
									<div className="postPrivacyLevel">
										<Public />
										<span>Công khai</span>
									</div>
								) : post.privacyLevel === 'FRIENDS' ? (
									<div className="postPrivacyLevel">
										<Group />
										<span>Bạn bè</span>
									</div>
								) : post.privacyLevel === 'PRIVATE' ? (
									<div className="postPrivacyLevel">
										<Lock />
										<span>Riêng tư</span>
									</div>
								) : null)}
						</div>
						{(modalDetail === 0 || modalDetail === 3) && (
							<div className="comment" id="postTopRight">
								<IconButton
									style={{
										color: theme.foreground,
										background: theme.background,
									}}
									aria-describedby="simple-popover"
									onClick={(e) => handleClick(e)}
								>
									<MoreHoriz
										style={{
											color: theme.foreground,
											background: theme.background,
										}}
									/>
								</IconButton>
								<Popover
									style={{
										color: theme.foreground,
										background: theme.background,
									}}
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
									<div
										style={{
											color: theme.foreground,
											background: theme.background,
										}}
									>
										{post?.privacyLevel !== 'PRIVATE' && group?.groupType !== 'Private' && (
											<Typography
												style={{
													color: theme.foreground,
													background: theme.background,
												}}
												className="poper--member--item"
												onClick={() => handleOpenConfirmation('sharePost')}
											>
												Chia sẻ bài viết
											</Typography>
										)}
										{post?.userId === currentUser.userId && (
											<>
												<Typography
													style={{
														color: theme.foreground,
														background: theme.background,
													}}
													className="poper--member--item"
													onClick={() => handleOpenConfirmation('editPost')}
												>
													Chỉnh sửa bài viết
												</Typography>
												<Typography
													style={{
														color: theme.foreground,
														background: theme.background,
													}}
													className="poper--member--item"
													onClick={() => handleOpenConfirmation('deletePost')}
												>
													Xóa bài viết
												</Typography>
											</>
										)}

										{post?.userId !== currentUser.userId && (
											<Typography
												style={{
													color: theme.foreground,
													background: theme.background,
												}}
												className="poper--member--item"
												onClick={() => handleOpenConfirmation('reportPost')}
											>
												Báo cáo bài viết
											</Typography>
										)}
									</div>
								</Popover>
							</div>
						)}
						{openConfirmation && (
							<ShareModal
								post={post}
								user={inforUser}
								currentUser={currentUser}
								visible={openConfirmation}
								onClose={handleCloseConfirmation}
								onShare={handleConfirmAction}
								action={action}
							/>
						)}
					</div>
					<PostModal
						post={currentPost}
						inforUser={inforUser}
						visible={isModalVisible}
						onClose={handleModalClose}
						modalDetail={modalDetail}
					/>
					<div
						className="postCenter"
						style={{
							color: theme.foreground,
							background: theme.background,
						}}
					>
						{post.content && <span className="postText">{post.content}</span>}
						{post.photos && (
							<Image
								width="100%"
								className="postImg"
								src={post.photos} // Sử dụng selectedPost.photos thay vì cố định URL như bạn đã đề cập
								alt={post.content}
								style={{ objectFit: 'cover', background: token.colorBgLayout }}
							/>
						)}
						{post.files && post.files.toLowerCase().endsWith('.txt') && (
							<div
								className="postFile"
								style={{
									color: theme.foreground,
									background: theme.background,
								}}
							>
								<a href={post.files} target="_blank" rel="noopener noreferrer">
									{post.files.substr(post.files.lastIndexOf('/') + 1).length > 20
										? post.files.substr(post.files.lastIndexOf('/') + 1).substring(0, 20) + '...'
										: post.files.substr(post.files.lastIndexOf('/') + 1)}
								</a>
							</div>
						)}
						{post.files && post.files.toLowerCase().endsWith('.docx') && (
							<div
								className="postFile"
								style={{
									color: theme.foreground,
									background: theme.background,
								}}
							>
								<a href={post.files} target="_blank" rel="noopener noreferrer">
									{post.files.substr(post.files.lastIndexOf('/') + 1).length > 20
										? post.files.substr(post.files.lastIndexOf('/') + 1).substring(0, 20) + '...'
										: post.files.substr(post.files.lastIndexOf('/') + 1)}
								</a>
							</div>
						)}
						{post.files && post.files.toLowerCase().endsWith('.pdf') && (
							<div
								className="postFile"
								style={{
									color: theme.foreground,
									background: theme.background,
								}}
							>
								<a href={post.files} target="_blank" rel="noopener noreferrer">
									{post.files.substr(post.files.lastIndexOf('/') + 1).length > 20
										? post.files.substr(post.files.lastIndexOf('/') + 1).substring(0, 20) + '...'
										: post.files.substr(post.files.lastIndexOf('/') + 1)}
								</a>
							</div>
						)}
					</div>

					<div
						className="postBottom"
						style={{
							color: theme.foreground,
							background: theme.background,
						}}
					>
						<div className="postBottomLeft">
							<img
								className="likeIcon"
								onClick={likePostHandler}
								src={isLiked ? heart : heartEmpty}
								alt="heart"
							/>
							<span
								className="postLikeCounter"
								style={{
									color: theme.foreground,
									background: theme.background,
								}}
								onClick={handleLikeCounterClick}
							>
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
												<li key={user.userId} style={{display:'flex', marginTop: '10px'}}>
													<img
														src={user.avatar ? user.avatar : sampleProPic}
														alt="Avatar"
														style={{ width: '40px', height: '40px', borderRadius: '50%' }}
													/>
													<span style={{display:'flex', alignItems: 'center', marginLeft: '20px'}}>{user.userName}</span>
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
							<span
								className="postCommentText"
								onClick={toggleShowAllComments}
								style={{
									color: theme.foreground,
									background: theme.background,
								}}
							>
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
									fetchCommentPost={fetchCommentPost}
									post={post}
									key={comment.commentId}
									onDelete={updateCommentLength}
									onCreate={updateCommentLength}
									commentLength={commentlength}
								/>
						  ))
						: Object.values(comments)
								.slice(0, 1)
								.map((comment) => (
									<CommentCard
										inforUser={inforUser}
										comment={comment}
										fetchCommentPost={fetchCommentPost}
										post={post}
										key={comment.commentId}
										onDelete={updateCommentLength}
										onCreate={updateCommentLength}
										commentLength={commentlength}
									/>
								))}

					{Object.values(comments).length >= 2 && (
						<div className="showMoreComment" onClick={toggleShowAllComments}>
							{showAllComments ? 'Ẩn bình luận' : 'Xem thêm bình luận'}
						</div>
					)}

					{/* Modal để mở chi tiết bài viết */}
				</div>
			)}
		</div>
	);
};

export default PostCard;
