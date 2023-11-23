import React, { useState, useEffect, useCallback, useRef } from 'react';
import './PostCard.css';
import sampleProPic from '../../../assets/appImages/user.png';
import heart from '../../../assets/appImages/heart.png';
import heartEmpty from '../../../assets/appImages/heartEmpty.png';
import { Send } from '@material-ui/icons';
import { Box, CircularProgress } from '@material-ui/core';
import { PermMedia, Cancel } from '@material-ui/icons';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../../context/apiCall';
import InputEmoji from 'react-input-emoji';
import toast from 'react-hot-toast';
import { errorOptions, successOptions } from '../../utils/toastStyle';
import usePost from '../../../context/post/PostContext';
import useAuth from '../../../context/auth/AuthContext';
import LikeOrUnlikeApi from '../../../api/timeline/commentSharePost/likeOrUnilkeShare';
import GetCommentSharePostApi from '../../../api/timeline/commentSharePost/getCommentSharePost';
import CommentCard from './CommentCard';
import { Modal } from 'antd';

const SharePostCard = ({ share, fetchSharePosts }) => {
	const isMounted = useRef(true);
	const { user: currentUser } = useAuth();
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
	const [user, setUser] = useState({});
	const [commentLoading, setCommentLoading] = useState(false);
	const { getTimelinePosts } = usePost();
	const [comments, setCommentPost] = useState({});
	const [commentlength, setCommentLength] = useState(share?.comments.length);
	const [showAllComments, setShowAllComments] = useState(false);
	// Xóa bài share
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [postIdToDelete, setPostIdToDelete] = useState(null);
	// Chỉnh sửa bài share
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [editContent, setEditContent] = useState('');
	// Hình ảnh và nội dung của bình luận
	const [photosComment, setPhotosComment] = useState('');
	const [photosCommetUrl, setPhotosCommetUrl] = useState('');
	const [content, setContent] = useState('');
	const [post, setPost] = useState('');
	// Xử lý phần dấu 3 chấm
	const [showOptions, setShowOptions] = useState(false);
	// Chức năng xem chi tiết chia sẻ bài viết
	const [showSharePostDetailModal, setShowSharePostDetailModal] = useState(false);
	const [selectedSharePost, setSelectedSharePost] = useState(null);

	// Xử lý phần dấu 3 chấm
	const handleToggleOptions = () => {
		setShowOptions(!showOptions);
	};

	// Model xuất hiện khi nhấn xóa bài share
	const showDeleteConfirm = (shareId) => {
		setPostIdToDelete(shareId);
		setIsModalVisible(true);
	};

	// Model xuất hiện khi nhấn chỉnh sửa bài share
	const showEditModal = (content) => {
		setEditContent(content);
		setIsEditModalVisible(true);
	};

	// Lấy thông tin của 1 bài post
	useEffect(() => {
		const fetchPost = async () => {
			const config = {
				headers: {
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			if (share.postId) {
				const res = await axios.get(`${BASE_URL}/v1/post/${share.postId}`, config);

				setPost(res.data.result);
			}
		};
		fetchPost();
	}, [share.postId, currentUser.accessToken]);

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

	// lấy danh sách bình luận trên bài post
	useEffect(() => {
		fetchCommentSharePost();
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser.userId, currentUser.accessToken]);

	// yêu thích và bỏ yêu thích bài post
	const likePostHandler = async () => {
		try {
			await LikeOrUnlikeApi.likeOrUnlike(share.shareId, currentUser.accessToken, currentUser.userId);
		} catch (err) {
			console.log(err);
		}

		setLike(isLiked ? like - 1 : like + 1);
		setIsLiked(!isLiked);
	};

	const toggleShowAllComments = () => {
		setShowAllComments(!showAllComments);
	};

	// Đăng bình luận share post
	const postCommentHandler = async () => {
		try {
			if (!content && !photosComment) {
				toast.error('Vui lòng nhập nội dung hoặc hình ảnh!', errorOptions);
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
					toast.success('Đăng bình luận thành công!', successOptions);
				} else {
					// Xử lý trường hợp API trả về lỗi
					toast.error(response.message, errorOptions);
				}
			}
			setCommentLoading(false);
			fetchCommentSharePost();
			setContent('');
			setPhotosComment('');
		} catch (error) {
			setCommentLoading(false);
			toast.error(error.message, errorOptions);
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

			if (postIdToDelete) {
				await axios.put(`${BASE_URL}/v1/share/delete/${postIdToDelete}`, share.userId, config);
			}

			setCommentLoading(false);
			toast.success('Xóa bài chia sẻ thành công!', { id: toastId });
			// Fetch lại danh sách bài share post sau khi xóa
			fetchSharePosts();
		} catch (error) {
			setCommentLoading(false);
			toast.error(error.response.data.message, errorOptions);
		}
	};

	// chỉnh sửa bài post
	const editPostHandler = async () => {
		const toastId = toast.loading('Đang gửi yêu cầu...');
		try {
			setCommentLoading(true);

			if (share.shareId) {
				const formData = new FormData();
				formData.append('content', editContent || '');

				const config = {
					headers: {
						Authorization: `Bearer ${currentUser.accessToken}`,
						'Content-Type': 'multipart/form-data',
					},
				};
				setIsEditModalVisible(false);
				const response = await axios.put(`${BASE_URL}/v1/share/update/${share.shareId}`, formData, config);

				// Xử lý kết quả trực tiếp trong khối try
				if (response.status === 200) {
					toast.success('Chỉnh sửa bài đăng thành công!', { id: toastId });

					// Fetch lại danh sách bài post sau khi chỉnh sửa
					fetchSharePosts();
				} else {
					// Xử lý trường hợp API trả về lỗi
					toast.error(response.message, { id: toastId });
				}
			}

			setCommentLoading(false);
		} catch (error) {
			setCommentLoading(false);
			toast.error(error.message, errorOptions);
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

	// lấy timeline của bài post
	useEffect(() => {
		getTimelinePosts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// lấy thông tin của người dùng hiện tại
	useEffect(() => {
		const fetchUsers = async () => {
			const config = {
				headers: {
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			if (share.userId) {
				const res = await axios.get(`${BASE_URL}/v1/user/profile/${share.userId}`, config);

				setUser(res.data.result);
			}
		};
		fetchUsers();
	}, [share.userId, currentUser.accessToken]);

	// Format thời gian
	function formatTime(time) {
		const postTime = moment(time);
		const timeDifference = moment().diff(postTime, 'minutes');

		let formattedTime;

		if (timeDifference < 60) {
			formattedTime = `${timeDifference} phút trước`;
		} else if (timeDifference < 1440) {
			const hours = Math.floor(timeDifference / 60);
			formattedTime = `${hours} giờ trước`;
		} else {
			formattedTime = postTime.format('DD [tháng] M [lúc] HH:mm');
		}

		return formattedTime;
	}

	return (
		<div className="post">
			<div className="postWrapper">
				<div className="postTop">
					<div className="postTopLeft">
						<Link to={`/profile/${user.userId}`}>
							<img className="postProfileImg" src={user.avatar || sampleProPic} alt="..." />
						</Link>
						<div className="postNameAndDate">
							<span className="postUsername">{user.userName}</span>
							<span
								className="postDate"
								onClick={() => {
									setShowSharePostDetailModal(true);
									setSelectedSharePost(post); // Truyền toàn bộ bài viết vào selectedSharePost
								}}
							>
								{formatTime(share.createAt)}
							</span>
						</div>
					</div>
					<div className="comment" id="postTopRight">
						<span className="handleToggleCommentOptions" onClick={handleToggleOptions}>
							...
						</span>
						{showOptions && (
							<div className="commentOption">
								<span className="postCommentTextUpdate">Chia sẻ</span>
								{currentUser.userId === share.userId && (
									<>
										<span
											className="postCommentTextUpdate"
											onClick={() => showEditModal(share.content)}
										>
											Chỉnh sửa
										</span>
										<span
											className="postCommentTextDelete"
											onClick={() => showDeleteConfirm(share.shareId)}
										>
											Xóa
										</span>
									</>
								)}
							</div>
						)}
					</div>
				</div>
				{/* Modal xóa bài viết */}
				<Modal
					title="Xác nhận xóa"
					open={isModalVisible}
					onOk={() => {
						deletePostHandler();
						setIsModalVisible(false);
					}}
					onCancel={() => setIsModalVisible(false)}
				>
					Bạn có chắc chắn muốn xóa bài viết này?
				</Modal>
				{/* Modal chỉnh sửa bài viết */}
				<Modal
					title={<span className="titlEditPost">Chỉnh sửa bài chia sẻ</span>}
					open={isEditModalVisible}
					onOk={editPostHandler}
					onCancel={() => setIsEditModalVisible(false)}
				>
					<div className="editPost">
						<label className="labelEditPost">Nội dung:</label>
						<textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
					</div>
				</Modal>
				<div className="postCenter">
					{share.content && <span className="postText">{share.content}</span>}

					<div className="post">
						<div className="postWrapper">
							<div className="postTop">
								<div className="postTopLeft">
									<Link to={`/profile/${user.userId}`}>
										<img className="postProfileImg" src={user.avatar || sampleProPic} alt="..." />
									</Link>
									<div className="postNameAndDate">
										<span className="postUsername">{user.userName}</span>
										<span className="postDate">{formatTime(post.postTime)}</span>
									</div>
									<div className="postLoAndName">
										{post.location && (
											<span className="postLocation">• {post.location || 'Vị trí'}</span>
										)}
										{post.postGroupName && (
											<span className="postGroupName">• {post.postGroupName}</span>
										)}
									</div>
								</div>
							</div>

							<div className="postCenter">
								{post.content && <span className="postText">{post.content}</span>}
								{post.photos && <img className="postImg" src={post.photos} alt="..." />}
							</div>
						</div>
					</div>
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
