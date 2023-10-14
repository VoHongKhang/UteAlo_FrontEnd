import React, { useState, useCallback, useEffect } from 'react';
import './PostCard.css';
import './CommentReplyCard.css';
import sampleProPic from '../../../assets/appImages/user.png';
import axios from 'axios';
import moment from 'moment';
import { BASE_URL } from '../../../context/apiCall';
import useAuth from '../../../context/auth/AuthContext';
import LikeOrUnlikeCommentApi from '../../../api/timeline/commentPost/likeOrUnlikeComment';
import DeleteCommentApi from '../../../api/timeline/commentPost/delete';
import toast from 'react-hot-toast';
import { Modal } from 'antd';
import { PermMedia, Cancel } from '@material-ui/icons';
import { errorOptions } from '../../utils/toastStyle';
import { Send } from '@material-ui/icons';
import InputEmoji from 'react-input-emoji';
import { successOptions } from '../../utils/toastStyle';

const CommentCard = ({ commentReply, fetchCommentReply, comment,post, onDelete, commentReplyLength }) => {
	const { user: currentUser } = useAuth();
	const [commentlength, setCommentLength] = useState(post?.comments.length);
	// Hàm kiểm tra xem người dùng đã like bài comment chưa
	const checkUserLikeComment = useCallback(async () => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};

			const response = await axios.get(`${BASE_URL}/v1/comment/like/checkUser/${commentReply.commentId}`, config);
			const responseData = response.data;
			const resultValue = responseData.result;

			return resultValue;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}, [currentUser.accessToken, commentReply.commentId]);

	const [isLikedComment, setIsLikedComment] = useState(false);
	const [likeComment, setLikeComment] = useState(comment.likes?.length || 0);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [commentIdToDelete, setCommentIdToDelete] = useState(null);
	// Chỉnh sửa bình luận
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [editContent, setEditContent] = useState('');
	const [editPhotos, setEditPhotos] = useState('');
	const [editPhotosUrl, setEditPhotosUrl] = useState('');
	// Xử lý phần dấu 3 chấm
	const [showOptions, setShowOptions] = useState(false);
	// Xử lý ẩn hiện phần phản hồi bình luận
	const [isReplyCommentVisible, setIsReplyCommentVisible] = useState(false);
	const [commentLoading, setCommentLoading] = useState(false);
	// Hình ảnh và nội dung của bình luận
	const [photosComment, setPhotosComment] = useState('');
	const [photosCommetUrl, setPhotosCommetUrl] = useState('');
	const [content, setContent] = useState('');
	const [comments, setCommentPost] = useState({});

	// Model xuất hiện khi nhấn chỉnh sửa bài post
	const showDeleteConfirm = (commentReply) => {
		setCommentIdToDelete(commentReply);
		setIsModalVisible(true);
	};

	// Model xuất hiện khi nhấn chỉnh sửa bài post
	const showEditModal = (content, photos) => {
		setEditContent(content);
		setEditPhotos(photos);
		setIsEditModalVisible(true);
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
			if (userId !== currentUser.userId && currentUser.userId !== commentReply.userId) {
				toast.error('Bạn không có quyền xóa comment này!', { id: toastId });
				return;
			}
			await DeleteCommentApi.deleteComment(commentId, currentUser.accessToken);

			const commentDelete = document.querySelector(`.comment_${commentId}`);
			commentDelete.innerHTML = '';

			// Gọi hàm callback để cập nhật commentLength trong PostCard
			onDelete(commentReplyLength - 1);

			toast.success('Xóa bình luận thành công', { id: toastId });
		} catch (error) {
			toast.error(`Gửi yêu thất bại! Lỗi: ${error}`, { id: toastId });
		}
		fetchCommentReply();
	};

	console.log("commentReply", commentReply);

	// Phản hồi bình luận
	const postCommentHandler = async () => {
		try {
			if (!content && !photosComment) {
				toast.error('Vui lòng nhập nội dung hoặc hình ảnh!', errorOptions);
				return; // Dừng việc thực hiện tiếp theo nếu nội dung rỗng
			}
			setCommentLoading(true);
			if (comment.commentId) {
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
				formData.append('postId', commentReply.postId || '');
				formData.append('commentId', commentReply.commentId || '');

				const response = await axios.post(`${BASE_URL}/v1/post/comment/reply`, formData, config);

				// Xử lý kết quả trực tiếp trong khối try
				if (response.status === 200) {
					const newComment = response.data.result;
					// Thêm mới comment vào object comments
					setCommentPost({ ...comments, [newComment.commentId]: newComment });
					//commentReplyLength = commentReplyLength + 1;
					setCommentLength(commentlength + 1);
					toast.success('Đăng bình luận thành công!', successOptions);
				} else {
					// Xử lý trường hợp API trả về lỗi
					toast.error(response.message, errorOptions);
				}
			}
			setCommentLoading(false);
			fetchCommentReply();
			setContent('');
			setPhotosComment('');
		} catch (error) {
			setCommentLoading(false);
			toast.error(error.message, errorOptions);
		}
	};

	// Xử lý hình ảnh của bình luận
	const commentDetails = async (e) => {
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
		if (file.type !== 'image/png' || file.type !== 'image/jpeg') {
			setEditPhotos(file);
			setEditPhotosUrl(URL.createObjectURL(file));
		} else {
			toast.error('Xin hãy chọn ảnh theo đúng định dạng png/jpg');
		}
	};

	// Xử lý hình ảnh của phản hồi bình luận
	const commentReplyDetails = async (e) => {
		const file = e.target.files[0];
		if (file === undefined) {
			toast.error('Vui lòng chọn ảnh!');
			return;
		}
		if (file.type !== 'image/png' || file.type !== 'image/jpeg') {
			setPhotosComment(file);
			setPhotosCommetUrl(URL.createObjectURL(file));
		} else {
			toast.error('Xin hãy chọn ảnh theo đúng định dạng png/jpg');
		}
	};

	// chỉnh sửa bình luận
	const editCommentHandler = async () => {
		const toastId = toast.loading('Đang gửi yêu cầu...');
		try {
			if (commentReply.commentId) {
				const formData = new FormData();
				formData.append('content', editContent || '');

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

				const config = {
					headers: {
						Authorization: `Bearer ${currentUser.accessToken}`,
						'Content-Type': 'multipart/form-data',
					},
				};
				setIsEditModalVisible(false);
				const response = await axios.put(
					`${BASE_URL}/v1/post/comment/update/${commentReply.commentId}`,
					formData,
					config
				);

				// Xử lý kết quả trực tiếp trong khối try
				if (response.status === 200) {
					toast.success('Chỉnh sửa bài đăng thành công!', { id: toastId });

					// Fetch lại danh sách bình luận sau khi chỉnh sửa
					fetchCommentReply();
				} else {
					// Xử lý trường hợp API trả về lỗi
					toast.error(response.message, { id: toastId });
				}
			}
		} catch (error) {
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

	// Xử lý phần dấu 3 chấm
	const handleToggleOptions = () => {
		setShowOptions(!showOptions);
	};

	// Xử lý thời gian
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
		<div id="comment" className={`comment_${commentReply.commentId}`} key={commentReply.commentId}>
			<div className="commentParent">
				<div className="postCommentsBox">
					<div>
						<div className="postCommentInfo">
							<div className="postCommentUser">
								<img
									className="postProfileImg"
									src={commentReply.userAvatar || sampleProPic}
									alt="..."
								/>
								<span className="postCommentUserName">{commentReply.userName}</span>
							</div>
							<div className="postCommentContent">
								<span className="postCommentContentUserName">{commentReply.userName}</span>
								<span>{commentReply.content}</span>
								{commentReply.photos && (
									<img className="commentImg" src={commentReply.photos} alt="..." />
								)}
							</div>
						</div>

						<div className="postCommentAction">
							<span className="postCommentDate">{formatTime(commentReply.createTime)}</span>
							<span
								className={`postCommentLike ${likeButtonClass}`}
								onClick={() => likeCommentHandler(commentReply.commentId)}
							>
								{isLikedComment ? 'Đã thích' : 'Thích'}
							</span>
							<span
								className="postCommentReply"
								onClick={() => setIsReplyCommentVisible(!isReplyCommentVisible)}
							>
								Phản hồi
							</span>

							{isReplyCommentVisible && (
								<div className="postCommentContReply">
									<div className="postCommentCont-1">
										<InputEmoji
											value={content}
											onChange={setContent}
											placeholder={`Viết bình luận ....`}
										/>
										{photosComment && (
											<div className="shareImgContainer">
												<img className="shareimgReply" src={photosCommetUrl} alt="..." />
												<Cancel
													className="shareCancelImg"
													onClick={() => setPhotosComment(null)}
												/>
											</div>
										)}
									</div>
									<label htmlFor="fileCommentReplyChild" className="shareOption">
										<PermMedia htmlColor="tomato" className="shareIcon" />
										<input
											style={{ display: 'none' }}
											type="file"
											id="fileCommentReplyChild"
											accept=".png, .jpeg, .jpg"
											onChange={commentReplyDetails}
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
							)}

							<Modal
								title="Xác nhận xóa"
								open={isModalVisible}
								onOk={() => {
									deleteCommentPostHandler(commentIdToDelete, commentReply.userId);
									setIsModalVisible(false);
								}}
								onCancel={() => setIsModalVisible(false)}
							>
								Bạn có chắc chắn muốn xóa bình luận này?
							</Modal>

							<Modal
								title={<span className="titlEditPost">Chỉnh sửa bình luận</span>}
								open={isEditModalVisible}
								onOk={editCommentHandler}
								onCancel={() => setIsEditModalVisible(false)}
							>
								<div className="editPost">
									<label className="labelEditPost">Nội dung:</label>
									<textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
								</div>

								<div className="editPost">
									<label className="labelEditPost">Ảnh:</label>
									{editPhotosUrl ? (
										<div className="shareImgContainer">
											<img className="shareimg" src={editPhotosUrl} alt="..." />
											<Cancel className="shareCancelImg" onClick={() => setEditPhotosUrl(null)} />
										</div>
									) : editPhotos ? (
										<div className="shareImgContainer">
											<img className="shareimg" src={editPhotos} alt="..." />
											<Cancel className="shareCancelImg" onClick={() => setEditPhotos(null)} />
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
											onChange={commentDetails}
										/>
									</label>
								</div>
							</Modal>
						</div>
					</div>
					<div className="postLikeCommentCounter">{likeComment}</div>
				</div>

				<div className="comment">
					<span className="handleToggleCommentOptions" onClick={handleToggleOptions}>
						...
					</span>
					{showOptions && (
						<div className="commentOption">
							<span
								className="postCommentTextUpdate"
								onClick={() => showEditModal(commentReply.content, commentReply.photos)}
							>
								Chỉnh sửa
							</span>
							<span
								className="postCommentTextDelete"
								onClick={() => showDeleteConfirm(commentReply.commentId)}
							>
								Xóa
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CommentCard;
