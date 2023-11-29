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
import { errorOptions, successOptions } from '../../utils/toastStyle';
import usePost from '../../../context/post/PostContext';
import useAuth from '../../../context/auth/AuthContext';
import LikeOrUnlikeApi from '../../../api/timeline/commentPost/likeOrUnlike';
import GetCommentPostApi from '../../../api/timeline/commentPost/getCommentPost';
import CommentCard from './CommentCard';
import { Image, theme, Typography } from 'antd';
import PostApi from '../../../api/timeline/post/PostApi';
import { ShareModal } from './ShareModal';
import classnames from 'classnames';
import { formatTime } from '../../utils/CommonFuc';
import PostModal from '../../utils/PostModal';
const PostCard = ({ inforUser, post, newShare }) => {
	const [isModalVisible, setModalVisible] = useState(false);
	const [currentPost, setCurrentPost] = useState(null);
	const handleButtonClick = (post) => {
		setCurrentPost(post);
		setModalVisible(true);
	};

	const handleModalClose = () => {
		setModalVisible(false);
	};

	const classPost = ['post'];
	const classNameUser = [post?.postGroupId && 'hasGroup'];
	const navigate = useNavigate();
	// classPost.push(
	// 	post.roleName === 'SinhVien'
	// 		? 'postCardSV'
	// 		: post.roleName === 'GiangVien'
	// 		? 'postCardGV'
	// 		: post.roleName === 'PhuHuynh'
	// 		? 'postCardPH'
	// 		: post.roleName === 'NhanVien'
	// 		? 'postCardNV'
	// 		: 'postCardADMIN'
	// );

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
	const [toggleModal, setToggleModal] = useState(true);
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

	// lấy danh sách bình luận trên bài post
	useEffect(() => {
		fetchCommentPost();
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser.userId, currentUser.accessToken]);

	// yêu thích và bỏ yêu thích bài post
	const likePostHandler = async () => {
		try {
			await LikeOrUnlikeApi.likeOrUnlike(post.postId, currentUser.accessToken, currentUser.userId);
		} catch (err) {
			console.log(err);
		}

		setLike(isLiked ? like - 1 : like + 1);
		setIsLiked(!isLiked);
	};

	// Xử lý xem thêm bình luận
	const toggleShowAllComments = () => {
		setShowAllComments(!showAllComments);
	};

	// Đăng bình luận post
	const postCommentHandler = async () => {
		try {
			if (!content && !photosComment) {
				toast.error('Vui lòng nhập nội dung hoặc hình ảnh!', errorOptions);
				return; // Dừng việc thực hiện tiếp theo nếu nội dung rỗng
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
					toast.success('Đăng bình luận thành công!', successOptions);
				} else {
					// Xử lý trường hợp API trả về lỗi
					toast.error(response.message, errorOptions);
				}
			}
			setCommentLoading(false);
			fetchCommentPost();
			setContent('');
			setPhotosComment('');
		} catch (error) {
			setCommentLoading(false);
			toast.error(error.message, errorOptions);
		}
	};
	const reportPostHandler = async (e) => {
		e.preventDefault();
		toast.loading('Chức năng đang trong quá trình phát triển');
	};

	//Chia sẻ bài viết
	const sharePostHandler = async (e) => {
		try {
			const res = await sharePost(e);
			newShare(res.result, 'create');
		} catch (error) {
			console.error(error);
			toast.error('Có lỗi xảy ra khi tạo bài viết.');
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
		if (!data.content && !data.photos && !data.files) {
			toast.error('Vui lòng không được để trống cả 3 trường dữ liệu!', errorOptions);
			return;
		}
		const toastId = toast.loading('Đang gửi yêu cầu...');
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

	return (
		<div className={classnames(classPost)}>
			<div className="postWrapper">
				<div className="postTop">
					<div className="postTopLeft">
						<div className="post--header--left">
							{post.postGroupName && (
								<span className="postGroupname" onClick={() => navigate(`/groups/${post.postGroupId}`)}>
									{post.postGroupName}
								</span>
							)}

							<div className="post--header--left--item">
								<img
									className="postProfileImg"
									src={post.avatarUser || sampleProPic}
									alt="..."
									onClick={() => navigate(`/profile/${post.userId}`)}
								/>

								<div className="postNameAndDate">
									<span className={classnames('postUsername', classNameUser)}>
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
									<span className="postDate" onClick={() => handleButtonClick(post)}>
										{formatTime(post.postTime)}
									</span>
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
					<div className="comment" id="postTopRight">
						<IconButton aria-describedby="simple-popover" onClick={(e) => handleClick(e)}>
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
								{post?.privacyLevel !== 'PRIVATE' && (
									<Typography
										className="poper--member--item"
										onClick={() => handleOpenConfirmation('sharePost')}
									>
										Chia sẻ bài viết
									</Typography>
								)}
								{post?.userId === currentUser.userId && (
									<>
										<Typography
											className="poper--member--item"
											onClick={() => handleOpenConfirmation('editPost')}
										>
											Chỉnh sửa bài viết
										</Typography>
										<Typography
											className="poper--member--item"
											onClick={() => handleOpenConfirmation('deletePost')}
										>
											Xóa bài viết
										</Typography>
									</>
								)}

								{post?.userId !== currentUser.userId && (
									<Typography
										className="poper--member--item"
										onClick={() => handleOpenConfirmation('reportPost')}
									>
										Báo cáo bài viết
									</Typography>
								)}
							</div>
						</Popover>
					</div>
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
				/>
				<div className="postCenter">
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
						<div className="postFile">
							<a href={post.files} target="_blank" rel="noopener noreferrer">
								{post.files.substr(post.files.lastIndexOf('/') + 1)}
							</a>
						</div>
					)}
					{post.files && post.files.toLowerCase().endsWith('.docx') && (
						<div className="postFile">
							<a href={post.files} target="_blank" rel="noopener noreferrer">
								{post.files.substr(post.files.lastIndexOf('/') + 1)}
							</a>
						</div>
					)}
					{post.files && post.files.toLowerCase().endsWith('.pdf') && (
						<div className="postFile">
							<a href={post.files} target="_blank" rel="noopener noreferrer">
								{post.files.substr(post.files.lastIndexOf('/') + 1)}
							</a>
						</div>
					)}
				</div>

				<div className="postBottom">
					<div className="postBottomLeft">
						<img
							className="likeIcon"
							onClick={likePostHandler}
							src={isLiked ? heart : heartEmpty}
							alt="heart"
						/>
						<span className="postLikeCounter">{like} người đã thích</span>
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
		</div>
	);
};

export default PostCard;
