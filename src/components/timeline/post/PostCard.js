import React, { useState, useEffect, useCallback } from 'react';
import './PostCard.css';
import sampleProPic from '../../../assets/appImages/user.png';
import heart from '../../../assets/appImages/heart.png';
import heartEmpty from '../../../assets/appImages/heartEmpty.png';
import { Send } from '@material-ui/icons';
import { Box, CircularProgress } from '@material-ui/core';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../../context/apiCall';
import InputEmoji from 'react-input-emoji';
import toast from 'react-hot-toast';
import { errorOptions, successOptions } from '../../utils/toastStyle';
import usePost from '../../../context/post/PostContext';
import useAuth from '../../../context/auth/AuthContext';
import DeleteCommentApi from '../../../api/timeline/commentPost/delete';
import LikeOrUnlikeApi from '../../../api/timeline/commentPost/likeOrUnlike';
import GetCommentPostApi from '../../../api/timeline/commentPost/getCommentPost';
import LikeOrUnlikeCommentApi from '../../../api/timeline/commentPost/likeOrUnlikeComment';


const PostCard = ({ post, fetchPosts }) => {
	const { user: currentUser } = useAuth();
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
	const [isLikedComment, setIsLikedComment] = useState(false);
	const [user, setUser] = useState({});
	const [commentLoading, setCommentLoading] = useState(false);
	const [showComment, setShowComment] = useState(false);
	const [content, setContent] = useState('');
	const [photo, setPhoto] = useState('');
	const { getTimelinePosts } = usePost();
	const [comments, setCommentPost] = useState({});
	const [commentlength, setCommentLength] = useState(post?.comments.length);

	useEffect(() => {
		const fetchData = async () => {
			let resultValue = null; // Biến tạm để lưu giá trị trả về từ checkUserLikePost
			try {
				resultValue = await checkUserLikePost();
			} catch (error) {
				console.error(error);
			}

			setIsLiked(resultValue); // Gán giá trị từ biến tạm vào isLiked
		};

		fetchData();
	}, [checkUserLikePost]);


	// lấy danh sách bình luận trên bài post
	useEffect(() => {
		const fetchCommentPost = async () => {
			const res = await GetCommentPostApi.getCommentPost(post.postId);
			setCommentPost(res);
		};
		fetchCommentPost();
	}, [post.postId]);

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

	// yêu thích và bỏ yêu thích bình luận
	const likeCommentHandler = async (commentId,countLike) => {
		
		try {
			await LikeOrUnlikeCommentApi.likeOrUnlikeComment(commentId, currentUser.accessToken, currentUser.userId);
		} catch (err) {
			console.log(err);
		}

		if (isLikedComment) {
			countLike = countLike - 1;
		}
		else {
			countLike = countLike + 1;
		}
		setIsLikedComment(!isLikedComment);
	};

	// xóa bình luận trên bài post
	const deleteCommentPostHandler = async (commentId, userId) => {
		const toastId = toast.loading('Đang gửi yêu cầu...');
		try {
			if (userId !== currentUser.userId && currentUser.userId !== post.userId) {
				toast.error('Bạn không có quyền xóa comment này!', { id: toastId });
				return;
			}
			await DeleteCommentApi.deleteComment(commentId, currentUser.accessToken);

			const commentDelete = document.querySelector(`.comment_${commentId}`);
			commentDelete.innerHTML = '';
			setCommentLength(commentlength - 1);
			toast.success('Xóa thành công comment', { id: toastId });
		} catch (error) {
			toast.error(`Gửi yêu thất bại! Lỗi: ${error}`, { id: toastId });
		}
	};

	const showCommentHandler = () => {
		setShowComment(!showComment);
	};

	// viết bình luận
	const postCommentHandler = async () => {
		try {
			if (content === '') {
				toast.error('Comment cannot be empty!', errorOptions);
				return; // Dừng việc thực hiện tiếp theo nếu nội dung rỗng
			}
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			setCommentLoading(true);
			if (post.postId) {
				const rest = await axios.post(
					`${BASE_URL}/v1/post/comment/create`,
					{ content: content, photo: photo, postId: post.postId },
					config
				);
				console.log(rest.data.result);
				// Cập nhật danh sách bình luận sau khi gửi thành công
				const newComment = rest.data.result; // Đảm bảo API trả về thông tin bình luận mới
				setCommentPost([...comments, newComment]); // Thêm bình luận mới vào danh sách hiện có
				setCommentLength(commentlength + 1); // Tăng độ dài của danh sách bình luận lên 1
			}
			setCommentLoading(false);
			toast.success('Comment posted successfully!', successOptions);
		} catch (error) {
			setCommentLoading(false);
			toast.error(error.response.data.message, errorOptions);
		}
		fetchPosts();
		setContent('');
		setPhoto('');
	};

	// xóa bài post
	const deletePostHandler = async () => {
		try {
			const isConfirmed = window.confirm('Bạn có chắc muốn xóa bài viết này?');

			if (!isConfirmed) {
				return; // Nếu người dùng không xác nhận, không thực hiện xóa
			}
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			setCommentLoading(true);
			if (post.postId) {
				console.log(post.userId);
				console.log(currentUser.userId);
				await axios.put(`${BASE_URL}/v1/post/delete/${post.postId}`, post.userId, config);
			}
			setCommentLoading(false);
			toast.success('Post deleted successfully!', successOptions);
		} catch (error) {
			setCommentLoading(false);
			toast.error(error.response.data.message, errorOptions);
		}
		fetchPosts();
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

						<span className="postLocation">• {post.location || 'Vị trí'}</span>
					</div>
					<div className="postTopRight">
						{currentUser.userId === post.userId ? (
							<>
								<button
									style={{ backgroundColor: '#3b82f6' }}
									className="shareButton"
									onClick={deletePostHandler}
								>
									Xóa
								</button>
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
						<span className="postCommentText" onClick={showCommentHandler}>
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
					</div>
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

				{Object.values(comments).map((comment) => {
					return (
						<div className={`comment_${comment.commentId}`} key={comment.commentId}>
							<div className="postCommentsBox" style={{ display: showComment ? '' : 'none' }}>
								<div>
									<div className="postCommentInfo">
										<div className="postCommentUser">
											<img
												className="postProfileImg"
												src={comment.userAvatar || sampleProPic}
												alt="..."
											/>
											<span className="postCommentUserName">{comment.userName}</span>
										</div>
										<div className="postCommentContent">
											<span>{comment.content}</span>
										</div>
									</div>

									<div className="postCommentAction">
										<span className="postCommentDate">{formatTime(comment.createTime)}</span>
										<span className="postCommentLike"
										onClick={() => likeCommentHandler(comment.commentId,comment.likes?.length)}
										>{isLikedComment ? "Đã thích" : "Thích"}</span>
										<span
											className="postCommentTextDelete"
											onClick={() => deleteCommentPostHandler(comment.commentId, comment.userId)}
										>
											Xóa
										</span>
									</div>
								</div>
								<div className="postLikeCommentCounter">{comment.likes?.length}</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default PostCard;
