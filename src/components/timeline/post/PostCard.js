import React, { useState, useEffect, useCallback } from 'react';
import './PostCard.css';
import post1 from '../../../assets/appImages/1.jpeg';
import sampleProPic from '../../../assets/appImages/user.png';
import likeImg from '../../../assets/appImages/heart.png';
import heart from '../../../assets/appImages/like.png';
import { Send } from '@material-ui/icons';
import { Box, CircularProgress } from '@material-ui/core';
import axios from 'axios';
import Moment from 'react-moment';
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

	// get comments post
	useEffect(() => {
		const fetchCommentPost = async () => {
			const res = await GetCommentPostApi.getCommentPost(post.postId);
			setCommentPost(res);
		};
		fetchCommentPost();
	}, [post.postId]);

	// like a post (1 like per user)
	const likePostHandler = async () => {
		try {
			await LikeOrUnlikeApi.likeOrUnlike(post.postId, currentUser.accessToken,currentUser.userId);
		} catch (err) {
			console.log(err);
		}

		setLike(isLiked ? like - 1 : like + 1);
		setIsLiked(!isLiked);
	};

	// delete a comment post
	const deleteCommentPostHandler =async (commentId) => {

		const toastId = toast.loading('Đang gửi yêu cầu...');
		try {
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

	// post a comment (1 comment by each user on a post, 2nd time get's edited)
	const postCommentHandler = async () => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${currentUser.token}`,
				},
			};
			setCommentLoading(true);
			if (post.postId) {
				await axios.post(`${BASE_URL}/v1/post/comment/create`, { content: content,photo: photo, postId: post.postId }, config);
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

	// delete post
	const deleteHandler = async () => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${currentUser.token}`,
				},
			};
			setCommentLoading(true);
			if (post._id) {
				await axios.delete(`${BASE_URL}/post/${post._id}`, config);
			}
			setCommentLoading(false);
			toast.success('Comment deleted successfully!', successOptions);
		} catch (error) {
			setCommentLoading(false);
			toast.error(error.response.data.message, errorOptions);
		}
		fetchPosts();
	};

	// get timeline posts
	useEffect(() => {
		getTimelinePosts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		

	}, []);


	// see weather logged in user has liked the particular post if yes user can dislike else like
	useEffect(() => {
		setIsLiked(post.likes?.includes(currentUser.userId));
	}, [currentUser.userId, post.likes]);

	// get user details
	useEffect(() => {
		const fetchUsers = async () => {
			const config = {
				headers: {
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			if (post.user) {
				const res = await axios.get(`${BASE_URL}/v1/user/profile/${post.user}`, config);
				setUser(res.data);
			}
		};
		fetchUsers();
	}, [post.userId, currentUser.accessToken, post.user]);

	return (
		<div className="post">
			<div className="postWrapper">
				<div className="postTop">
					<div className="postTopLeft">
						<Link to={`/profile/${user.userId}`}>
							<img className="postProfileImg" src={user.avatar || sampleProPic} alt="..." />
						</Link>
						<span className="postUsername">{user.userName}</span>
						<span className="postLocation">• {post.location || 'Location'}</span>
						<span className="postDate">
							<Moment fromNow ago>
								{post.createdAt}
							</Moment>{' '}
							ago
						</span>
					</div>
					<div className="postTopRight">
						{currentUser.userId === post.user ? (
							<>
								<button
									style={{ backgroundColor: '#3b82f6' }}
									className="shareButton"
									onClick={deleteHandler}
								>
									Delete
								</button>
							</>
						) : (
							<></>
						)}
					</div>
				</div>
				<div className="postCenter">
					<span className="postText">{post.desc}</span>
					<img className="postImg" src={post.img ? post.img : post1} alt="..." />
				</div>
				<div className="postBottom">
					<div className="postBottomLeft">
						<img className="likeIcon" onClick={likePostHandler} src={likeImg} alt="like" />
						<img className="likeIcon" onClick={likePostHandler} src={heart} alt="heart" />
						<span className="postLikeCounter">{like} people liked it</span>
					</div>
					<div className="postBottomRight">
						<span className="postCommentText" onClick={showCommentHandler}>
							{commentlength} comments
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
						<InputEmoji value={content} onChange={setContent} placeholder={`Post a content....`} />
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
						<div className= {`comment_${comment.commentId}`}>
							
								<div
									className="postCommentsBox"
									style={{ display: showComment ? '' : 'none' }}
									key={comment.commentId}
								>
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
										<span
											className="postCommentTextDelete"
											onClick={() => deleteCommentPostHandler(comment.commentId)}
										>
											Delete
										</span>
									</div>
								</div>
							
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default PostCard;
