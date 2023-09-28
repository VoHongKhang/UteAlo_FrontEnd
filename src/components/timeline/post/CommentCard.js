// import React, { useState, useEffect, useCallback } from 'react';
// import './PostCard.css';
// import sampleProPic from '../../../assets/appImages/user.png';
// import heart from '../../../assets/appImages/heart.png';
// import heartEmpty from '../../../assets/appImages/heartEmpty.png';
// import { Send } from '@material-ui/icons';
// import { Box, CircularProgress } from '@material-ui/core';
// import axios from 'axios';
// import moment from 'moment';
// import { Link } from 'react-router-dom';
// import { BASE_URL } from '../../../context/apiCall';
// import InputEmoji from 'react-input-emoji';
// import toast from 'react-hot-toast';
// import { errorOptions, successOptions } from '../../utils/toastStyle';
// import usePost from '../../../context/post/PostContext';
// import useAuth from '../../../context/auth/AuthContext';
// import DeleteCommentApi from '../../../api/timeline/commentPost/delete';
// import LikeOrUnlikeApi from '../../../api/timeline/commentPost/likeOrUnlike';
// import GetCommentPostApi from '../../../api/timeline/commentPost/getCommentPost';
// import LikeOrUnlikeCommentApi from '../../../api/timeline/commentPost/likeOrUnlikeComment';

// const CommentCard = ({ comment, fetchCommentPost}) => {

//     const { user: currentUser } = useAuth();
    
// 	const [isLiked, setIsLiked] = useState(false);
// 	const [isLikedComment, setIsLikedComment] = useState(false);
// 	const [user, setUser] = useState({});
// 	const [commentLoading, setCommentLoading] = useState(false);
// 	const [showComment, setShowComment] = useState(false);
// 	const [content, setContent] = useState('');
// 	const [photo, setPhoto] = useState('');
// 	const { getTimelinePosts } = usePost();
// 	const [comments, setCommentPost] = useState({});
	

//     // yêu thích và bỏ yêu thích bình luận
// 	const likeCommentHandler = async (commentId,countLike) => {
		
// 		try {
// 			await LikeOrUnlikeCommentApi.likeOrUnlikeComment(commentId, currentUser.accessToken, currentUser.userId);
// 		} catch (err) {
// 			console.log(err);
// 		}

// 		if (isLikedComment) {
// 			countLike = countLike - 1;
// 		}
// 		else {
// 			countLike = countLike + 1;
// 		}
// 		setIsLikedComment(!isLikedComment);
// 	};

//     const showCommentHandler = () => {
// 		setShowComment(!showComment);
// 	};

//     // xóa bình luận trên bài post
// 	// const deleteCommentPostHandler = async (commentId, userId) => {
// 	// 	const toastId = toast.loading('Đang gửi yêu cầu...');
// 	// 	try {
// 	// 		if (userId !== currentUser.userId && currentUser.userId !== post.userId) {
// 	// 			toast.error('Bạn không có quyền xóa comment này!', { id: toastId });
// 	// 			return;
// 	// 		}
// 	// 		await DeleteCommentApi.deleteComment(commentId, currentUser.accessToken);

// 	// 		const commentDelete = document.querySelector(`.comment_${commentId}`);
// 	// 		commentDelete.innerHTML = '';
// 	// 		setCommentLength(commentlength - 1);
// 	// 		toast.success('Xóa thành công comment', { id: toastId });
// 	// 	} catch (error) {
// 	// 		toast.error(`Gửi yêu thất bại! Lỗi: ${error}`, { id: toastId });
// 	// 	}
// 	// };

//     function formatTime(time) {
// 		const postTime = moment(time);
// 		const timeDifference = moment().diff(postTime, 'minutes');

// 		let formattedTime;

// 		if (timeDifference < 60) {
// 			formattedTime = `${timeDifference} phút trước`;
// 		} else if (timeDifference < 1440) {
// 			const hours = Math.floor(timeDifference / 60);
// 			formattedTime = `${hours} giờ trước`;
// 		} else {
// 			formattedTime = postTime.format('DD [tháng] M [lúc] HH:mm');
// 		}

// 		return formattedTime;
// 	}

//     return (
//         <div className={`comment_${comment.commentId}`} key={comment.commentId}>
//             <div className="postCommentsBox" style={{ display: showComment ? '' : 'none' }}>
//                 <div>
//                     <div className="postCommentInfo">
//                         <div className="postCommentUser">
//                             <img
//                                 className="postProfileImg"
//                                 src={comment.userAvatar || sampleProPic}
//                                 alt="..."
//                             />
//                             <span className="postCommentUserName">{comment.userName}</span>
//                         </div>
//                         <div className="postCommentContent">
//                             <span>{comment.content}</span>
//                         </div>
//                     </div>

//                     <div className="postCommentAction">
//                         <span className="postCommentDate">{formatTime(comment.createTime)}</span>
//                         <span className="postCommentLike"
//                         onClick={() => likeCommentHandler(comment.commentId,comment.likes?.length)}
//                         >{isLikedComment ? "Đã thích" : "Thích"}</span>
//                         <span
//                             className="postCommentTextDelete"
//                             // onClick={() => deleteCommentPostHandler(comment.commentId, comment.userId)}
//                         >
//                             Xóa
//                         </span>
//                     </div>
//                 </div>
//                 <div className="postLikeCommentCounter">{comment.likes?.length}</div>
//             </div>
//         </div>
//     );
// };

// export default CommentCard;