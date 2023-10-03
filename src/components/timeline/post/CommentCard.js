import React, { useState, useCallback, useEffect } from 'react';
import './PostCard.css';
import sampleProPic from '../../../assets/appImages/user.png';
import axios from 'axios';
import moment from 'moment';
import { BASE_URL } from '../../../context/apiCall';
import useAuth from '../../../context/auth/AuthContext';
import LikeOrUnlikeCommentApi from '../../../api/timeline/commentPost/likeOrUnlikeComment';
import DeleteCommentApi from '../../../api/timeline/commentPost/delete';
import toast from 'react-hot-toast';
import { Modal } from 'antd';

const CommentCard = ({ comment, fetchCommentPost, post, onDelete, commentLength }) => {
	const { user: currentUser } = useAuth();

	// Hàm kiểm tra xem người dùng đã like bài comment chưa
	const checkUserLikeComment = useCallback(async () => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};

			const response = await axios.get(`${BASE_URL}/v1/comment/like/checkUser/${comment.commentId}`, config);
			const responseData = response.data;
			const resultValue = responseData.result;

			return resultValue;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}, [currentUser.accessToken, comment.commentId]);

	const [isLikedComment, setIsLikedComment] = useState(false);
	const [likeComment, setLikeComment] = useState(comment.likes?.length);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [commentIdToDelete, setCommentIdToDelete] = useState(null);

	const showDeleteConfirm = (commentId) => {
		setCommentIdToDelete(commentId);
		setIsModalVisible(true);
	};

	useEffect(() => {
		const fetchData = async () => {
			let resultValue = null; // Biến tạm để lưu giá trị trả về từ checkUserLikeComment
			try {
				resultValue = await checkUserLikeComment();
			} catch (error) {
				console.error(error);
			}

			setIsLikedComment(resultValue); // Gán giá trị từ biến tạm vào isLiked
		};

		fetchData();
	}, [checkUserLikeComment]);

	// yêu thích và bỏ yêu thích bình luận
	const likeCommentHandler = async (commentId) => {
		try {
			await LikeOrUnlikeCommentApi.likeOrUnlikeComment(commentId, currentUser.accessToken, currentUser.userId);
		} catch (err) {
			console.log(err);
		}

		setLikeComment(isLikedComment ? isLikedComment - 1 : isLikedComment + 1);
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

			// Gọi hàm callback để cập nhật commentLength trong PostCard
			onDelete(commentLength - 1);

			toast.success('Xóa bình luận thành công', { id: toastId });
		} catch (error) {
			toast.error(`Gửi yêu thất bại! Lỗi: ${error}`, { id: toastId });
		}
		fetchCommentPost();
	};

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

	const likeButtonClass = isLikedComment ? 'liked' : 'not-liked';

	return (
		<div className={`comment_${comment.commentId}`} key={comment.commentId}>
			<div className="postCommentsBox">
				<div>
					<div className="postCommentInfo">
						<div className="postCommentUser">
							<img className="postProfileImg" src={comment.userAvatar || sampleProPic} alt="..." />
							<span className="postCommentUserName">{comment.userName}</span>
						</div>
						<div className="postCommentContent">
							<span>{comment.content}</span>
						</div>
					</div>

					<div className="postCommentAction">
						<span className="postCommentDate">{formatTime(comment.createTime)}</span>
						<span
							className={`postCommentLike ${likeButtonClass}`}
							onClick={() => likeCommentHandler(comment.commentId)}
						>
							{isLikedComment ? 'Đã thích' : 'Thích'}
						</span>
						<span className="postCommentTextDelete" onClick={() => showDeleteConfirm(comment.commentId)}>
							Xóa
						</span>
						<Modal
							title="Xác nhận xóa"
							open={isModalVisible}
							onOk={() => {
								deleteCommentPostHandler(commentIdToDelete, comment.userId);
								setIsModalVisible(false);
							}}
							onCancel={() => setIsModalVisible(false)}
						>
							Bạn có chắc chắn muốn xóa bình luận này?
						</Modal>
					</div>
				</div>
				<div className="postLikeCommentCounter">{likeComment}</div>
			</div>
		</div>
	);
};

export default CommentCard;
