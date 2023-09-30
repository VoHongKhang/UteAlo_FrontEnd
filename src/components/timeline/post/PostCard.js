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
import LikeOrUnlikeApi from '../../../api/timeline/commentPost/likeOrUnlike';
import GetCommentPostApi from '../../../api/timeline/commentPost/getCommentPost';
import CommentCard from './CommentCard';

const PostCard = ({ post, fetchPosts }) => {
	const { user: currentUser } = useAuth();

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

	const fetchCommentPost = async () => {
		const res = await GetCommentPostApi.getCommentPost(post.postId);
		setCommentPost(res);
	};

	// lấy danh sách bình luận trên bài post
	useEffect(() => {
		fetchCommentPost();
	}, []);

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

	const showCommentHandler = () => {
		setShowComment(!showComment);
	};

	const postCommentHandler = async () => {
		try {
			if (content === '') {
				toast.error('Vui lòng nhập nội dung!', errorOptions);
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
				const response = await axios.post(
					`${BASE_URL}/v1/post/comment/create`,
					{ content: content, photo: photo, postId: post.postId },
					config
				);

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
			setPhoto('');
		} catch (error) {
			setCommentLoading(false);
			toast.error(error.message, errorOptions);
		}
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
				console.log(currentUser.userId);
				await axios.put(`${BASE_URL}/v1/post/delete/${post.postId}`, post.userId, config);
			}
			setCommentLoading(false);
			toast.success('Xóa bài đăng thành công!', successOptions);
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
						showComment && (
							<CommentCard
								comment={comment}
								fetchCommentPost={fetchCommentPost}
								fetchPosts={fetchPosts}
								key={comment.commentId}
							/>
						)
					);
				})}
			</div>
		</div>
	);
};

export default PostCard;
