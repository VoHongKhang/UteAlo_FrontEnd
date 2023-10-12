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
import LikeOrUnlikeApi from '../../../api/timeline/commentPost/likeOrUnlike';
import GetCommentPostApi from '../../../api/timeline/commentPost/getCommentPost';
import CommentCard from './CommentCard';
import { Modal } from 'antd';
import { Country } from 'country-state-city';

const PostCard = ({ post, fetchPosts }) => {
	const isMounted = useRef(true);
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
	const [user, setUser] = useState({});
	const [commentLoading, setCommentLoading] = useState(false);
	const { getTimelinePosts } = usePost();
	const [comments, setCommentPost] = useState({});
	const [commentlength, setCommentLength] = useState(post?.comments.length);
	const [showAllComments, setShowAllComments] = useState(false);
	// Xóa bài post
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [postIdToDelete, setPostIdToDelete] = useState(null);
	// Chỉnh sửa bài post
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [editContent, setEditContent] = useState('');
	const [editLocation, setEditLocation] = useState('');
	const [editPhotos, setEditPhotos] = useState('');
	const [editPhotosUrl, setEditPhotosUrl] = useState('');
	const [editPostGroupId, setEditPostGroupId] = useState('');
	// Hình ảnh và nội dung của bình luận
	const [photosComment, setPhotosComment] = useState('');
	const [photosCommetUrl, setPhotosCommetUrl] = useState('');
	const [content, setContent] = useState('');

	// Model xuất hiện khi nhấn xóa bài post
	const showDeleteConfirm = (postId) => {
		setPostIdToDelete(postId);
		setIsModalVisible(true);
	};

	// Model xuất hiện khi nhấn chỉnh sửa bài post
	const showEditModal = (content, location, photos) => {
		setEditContent(content);
		setEditLocation(location);
		setEditPhotos(photos);
		setIsEditModalVisible(true);
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

	// cập nhật lại độ dài của bình luận
	const updateCommentLength = (newLength) => {
		setCommentLength(newLength);
	};

	// xóa bài post
	const deletePostHandler = async () => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};

			setCommentLoading(true);

			if (postIdToDelete) {
				await axios.put(`${BASE_URL}/v1/post/delete/${postIdToDelete}`, post.userId, config);
			}

			setCommentLoading(false);
			toast.success('Xóa bài đăng thành công!', successOptions);

			// Fetch lại danh sách bài post sau khi xóa
			fetchPosts();
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

			if (post.postId) {
				const formData = new FormData();
				formData.append('content', editContent || '');
				formData.append('location', editLocation || '');

				if (editPhotos) {
					// Kiểm tra xem 'editPhotos' có phải là kiểu 'string' không
					if (typeof editPhotos === 'string') {
						// Chuyển đổi 'editPhotos' từ URL blob thành đối tượng File
						const file = await convertBlobURLToFile(editPhotos, 'ten_file_moi.png');

						if (file) {
							// Thêm đối tượng File vào `formData`
							formData.append('photos', file);
						} else {
							console.error('Không thể chuyển đổi `editPhotos` thành đối tượng File.');
						}
					} else if (editPhotos instanceof File && isImage(editPhotos)) {
						formData.append('photos', editPhotos);
					} else {
						console.error('Tệp không phải là hình ảnh hoặc kiểu MIME không hợp lệ.');
					}
				}

				formData.append('postGroupId', editPostGroupId || 0);

				const config = {
					headers: {
						Authorization: `Bearer ${currentUser.accessToken}`,
						'Content-Type': 'multipart/form-data',
					},
				};
				setIsEditModalVisible(false);
				const response = await axios.put(`${BASE_URL}/v1/post/update/${post.postId}`, formData, config);

				// Xử lý kết quả trực tiếp trong khối try
				if (response.status === 200) {
					toast.success('Chỉnh sửa bài đăng thành công!', { id: toastId });

					// Fetch lại danh sách bài post sau khi chỉnh sửa
					fetchPosts();
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

	// Hàm kiểm tra kiểu MIME của tệp có phải là kiểu hình ảnh
	const isImage = (file) => {
		return file.type.startsWith('image/');
	};

	// Hàm chuyển đổi URL blob thành đối tượng File
	async function convertBlobURLToFile(blobURL, fileName) {
		try {
			const response = await fetch(blobURL);
			const blobData = await response.blob();
			return new File([blobData], fileName || 'file.png', { type: 'image/png' }); // Đặt kiểu MIME ở đây
		} catch (error) {
			console.error('Lỗi chuyển đổi:', error);
			return null;
		}
	}

	// Xử lý hình ảnh của bài post
	const postDetails = (e) => {
		const file = e.target.files[0];
		if (file === undefined) {
			toast.error('Vui lòng chọn ảnh!');
			return;
		}
		if (file.size > 1024 * 1024) {
			// 1MB = 1024 * 1024 bytes
			toast.error('Vui lòng chọn ảnh dưới 1MB', errorOptions);
			return; // Ngăn việc tiếp tục xử lý nếu kích thước vượt quá 1MB
		}
		if (file.type === 'image/jpeg' || file.type === 'image/png') {
			setEditPhotos(file);
			setEditPhotosUrl(URL.createObjectURL(file));
		} else {
			toast.error('Xin hãy chọn ảnh theo đúng định dạng png/jpg');
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
			if (post.userId) {
				const res = await axios.get(`${BASE_URL}/v1/user/profile/${post.userId}`, config);

				setUser(res.data.result);
			}
		};
		fetchUsers();
	}, [post.userId, currentUser.accessToken]);

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
							<span className="postUsername">{user.fullName}</span>
							<span className="postDate">{formatTime(post.postTime)}</span>
						</div>
						<div className="postLoAndName">
							{post.location && <span className="postLocation">• {post.location || 'Vị trí'}</span>}
							{post.postGroupName && <span className="postGroupName">• {post.postGroupName}</span>}
						</div>
					</div>
					<div className="postTopRight">
						<button style={{ backgroundColor: '#3b82f6', marginRight: '10px' }} className="shareButton">
							Chia sẻ
						</button>
						{currentUser.userId === post.userId ? (
							<>
								<button
									style={{ backgroundColor: '#3b82f6', marginRight: '10px' }}
									className="shareButton"
									onClick={() => showEditModal(post.content, post.location, post.photos)}
								>
									Chỉnh sửa
								</button>
								<button
									style={{ backgroundColor: '#3b82f6' }}
									className="shareButton"
									onClick={() => showDeleteConfirm(post.postId)}
								>
									Xóa
								</button>
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
								<Modal
									title={<span className="titlEditPost">Chỉnh sửa bài viết</span>}
									open={isEditModalVisible}
									onOk={editPostHandler}
									onCancel={() => setIsEditModalVisible(false)}
								>
									<div className="editPost">
										<label className="labelEditPost">Nội dung:</label>
										<textarea
											value={editContent}
											onChange={(e) => setEditContent(e.target.value)}
										/>
									</div>
									<div className="editPost">
										<label className="labelEditPost">Vị trí:</label>
										<select value={editLocation} onChange={(e) => setEditLocation(e.target.value)}>
											<option value={editLocation}>{editLocation}</option>
											{Country.getAllCountries().map((item) => (
												<option key={item.isoCode} value={item.name}>
													{item.name}
												</option>
											))}
										</select>
									</div>
									<div className="editPost">
										<label className="labelEditPost">Nhóm:</label>
										<select
											id="postGroupId"
											value={editPostGroupId}
											onChange={(e) => setEditPostGroupId(e.target.value)}
										>
											<option value={-1}>Chỉ mình tôi</option>
											<option value={0}>Công khai</option>
											{user?.postGroup?.map((item) => (
												<option key={item.postGroupId} value={item.postGroupId}>
													{item.postGroupName}
												</option>
											))}
										</select>
									</div>

									<div className="editPost">
										<label className="labelEditPost">Ảnh:</label>
										{editPhotosUrl ? (
											<div className="shareImgContainer">
												<img className="shareimg" src={editPhotosUrl} alt="..." />
												<Cancel
													className="shareCancelImg"
													onClick={() => setEditPhotosUrl(null)}
												/>
											</div>
										) : editPhotos ? (
											<div className="shareImgContainer">
												<img className="shareimg" src={editPhotos} alt="..." />
												<Cancel
													className="shareCancelImg"
													onClick={() => setEditPhotos(null)}
												/>
											</div>
										) : null}

										<label htmlFor="editFile" className="shareOption">
											<PermMedia htmlColor="tomato" className="shareIcon" />
											<span className="shareOptionText">Hình ảnh</span>
											<input
												style={{ display: 'none' }}
												type="file"
												id="editFile"
												accept=".png, .jpeg, .jpg"
												onChange={postDetails}
											/>
										</label>
									</div>
								</Modal>
							</>
						) : (
							<></>
						)}
					</div>
				</div>

				<div className="postCenter">
					<span className="postText">{post.content}</span>
					{post.photos && <img className="postImg" src={post.photos} alt="..." />}
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
									commentLength={commentlength}
								/>
							))}

				{Object.values(comments).length >= 2 && (
					<div className="showMoreComment" onClick={toggleShowAllComments}>
						Xem thêm bình luận
					</div>
				)}
			</div>
		</div>
	);
};

export default PostCard;
