import React, { useEffect, useState } from 'react';
import { Modal, Button, Space, Cascader, Image } from 'antd';
import { formatTime } from '../../utils/CommonFuc';
import { Link } from 'react-router-dom';
import './PostCard.css';
import sampleProPic from '../../../assets/appImages/user.png';
import PostGroupApi from '../../../api/postGroups/PostGroupApi';
import TextArea from 'antd/es/input/TextArea';
import { AttachFile, Cancel, PermMedia, Public, Room } from '@material-ui/icons';
import vietnamProvinces from '../../../vietnamProvinces.json';
import toast from 'react-hot-toast';
export const ShareModal = ({ post, user, currentUser, visible, onClose, onShare, action }) => {
	// #region action Share
	const [group, setGroup] = useState([]);
	const [editPost, setEditPost] = useState(post);
	const [file, setFile] = useState({
		photos: null,
		files: null,
	});
	const [newShare, setNewShare] = useState({
		postId: post?.postId,
		postGroupId: 0,
		privacyLevel: '',
		content: '',
		userId: currentUser.userId,
		createAt: new Date().toISOString(),
	});
	const [options, setOptions] = useState([
		{
			value: 'PRIVATE',
			label: 'Chỉ mình tôi',
		},
		{
			value: 'PUBLIC',
			label: 'Công khai',
		},
		{
			value: 'FRIENDS',
			label: 'Bạn bè của bạn',
		},

		{
			value: 'GROUP_MEMBERS',
			label: 'Thành viên nhóm',
			isLeaf: false,
		},
	]);
	useEffect(() => {
		const fetchGroup = async () => {
			try {
				const res = await PostGroupApi.listAllGroup(currentUser);
				if (res.result) {
					setGroup(res.result);
					console.log('fetchGroup');
				}
			} catch (error) {
				console.log(error);
			}
		};

		// Gọi hàm fetchGroup khi component được render
		fetchGroup();
	}, []); // [] đảm bảo useEffect chỉ chạy một lần

	const handleShare = () => {
		// Gọi hàm chia sẻ được truyền từ prop
		if (action === 'sharePost') onShare(newShare);
		else if (action === 'editPost') onShare(editPost);
		else if (action === 'deletePost') onShare(post?.postId);

		console.log(newShare);

		// Đóng modal
		onClose();
	};
	const onChange = (value) => {
		if (action === 'sharePost')
			setNewShare({
				...newShare,
				postGroupId: value[1] || 0,
				privacyLevel: value[0],
			});
		else if (action === 'editPost')
			setEditPost({
				...editPost,
				privacyLevel: value[0],
			});
	};
	const loadData = (selectedOptions) => {
		const targetOption = selectedOptions[selectedOptions.length - 1];

		// load options lazily
		setTimeout(() => {
			targetOption.children = group.map((item) => {
				return {
					value: item.postGroupId,
					label: item.postGroupName,
				};
			});

			setOptions([...options]);
		}, 1000);
	};
	// #endregion
	const listAction = {
		delete: {
			title: 'Bạn có chắc chắn muốn xóa bài viết này?',
			content:
				'Sau khi bài viết bị xóa, tất cả các lượt thích, bình luận và chia sẻ ' +
				'sẽ bị xóa và không thể khôi phục được. Bạn có chắc chắn muốn xóa bài viết này?',
		},
		edit: {
			title: 'Chỉnh sửa bài viết',
		},
		share: {
			title: 'Chia sẻ bài viết',
		},
	};
	// #region action Edit
	const uploadFiles = (data, action) => {
		console.log(data);
		console.log(action);
		if (action === 'files') {
			if (
				data.type === 'application/pdf' ||
				data.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
				data.type === 'text/plain'
			) {
				setFile({ ...file, files: URL.createObjectURL(data) });
				setEditPost({ ...editPost, files: data });
			} else {
				toast.error('Please select an file with pdf/docx/txt type');
			}
		} else {
			if (data.type === 'image/jpeg' || data.type === 'image/png') {
				setFile({ ...file, photos: URL.createObjectURL(data) });
				setEditPost({ ...editPost, photos: data });
			} else {
				toast.error('Please select an image with png/jpg type');
			}
		}
	};
	// #endregion

	return (
		<>
			{action === 'sharePost' ? (
				<Modal
					title={listAction.share.title}
					open={visible}
					onCancel={onClose}
					footer={[
						<Button key="cancel" onClick={onClose}>
							Hủy
						</Button>,
						<Button key="share" type="primary" onClick={handleShare}>
							Xác nhận
						</Button>,
					]}
				>
					<div className="modal--body">
						<Space direction="vertical">
							<div className="postTopLeft">
								<Link to={`/profile/${user?.userId}`}>
									<img className="postProfileImg" src={user?.avatar || sampleProPic} alt="..." />
								</Link>

								<div className="postNameAndDateEdit">
									<span className="postUsername">{user?.userName}</span>
									<Cascader
										options={options}
										loadData={loadData}
										onChange={onChange}
										defaultValue={['PUBLIC']}
										changeOnSelect
									/>
								</div>
							</div>
							<TextArea
								className="postDesc"
								placeholder="Bạn đang nghĩ gì?"
								onChange={(e) => setNewShare({ ...newShare, content: e.target.value })}
								value={newShare.content}
								maxLength={1000}
								autoSize={{ minRows: 2, maxRows: 4 }}
							/>
						</Space>

						<Space direction="vertical" className="postShare--body">
							<div className="modal--post--body">
								<Link to={`/profile/${post?.userId}`}>
									<img className="postProfileImg" src={post?.avatar || sampleProPic} alt="..." />
								</Link>
								<div className="postNameAndDate">
									<span className="postUsername">{post?.userName}</span>
									<span className="postDateShare">{formatTime(post?.postTime)}</span>
								</div>
							</div>
							<div className="postCenter">
								{post?.content && <span className="postText">{post?.content}</span>}
								{post?.files && post?.files.toLowerCase().endsWith('.txt') && (
									<div className="postFile">
										<a href={post?.files} target="_blank" rel="noopener noreferrer">
											{post?.files.substr(post?.files.lastIndexOf('/') + 1)}
										</a>
									</div>
								)}
								{post?.files && post?.files.toLowerCase().endsWith('.docx') && (
									<div className="postFile">
										<a href={post?.files} target="_blank" rel="noopener noreferrer">
											{post?.files.substr(post?.files.lastIndexOf('/') + 1)}
										</a>
									</div>
								)}
								{post?.files && post?.files.toLowerCase().endsWith('.pdf') && (
									<div className="postFile">
										<a href={post?.files} target="_blank" rel="noopener noreferrer">
											{post?.files.substr(post?.files.lastIndexOf('/') + 1)}
										</a>
									</div>
								)}
								{post?.photos && (
									<>
										<Image
											width="100%"
											className="postImg"
											src={post?.photos} // Sử dụng selectedPost.photos thay vì cố định URL như bạn đã đề cập
											alt={post?.content}
											style={{ objectFit: 'cover' }}
										/>
									</>
								)}
							</div>
						</Space>
					</div>
				</Modal>
			) : action === 'editPost' ? (
				<Modal
					title={listAction.edit.title}
					open={visible}
					onCancel={onClose}
					footer={[
						<Button key="cancel" onClick={onClose}>
							Hủy
						</Button>,
						<Button key="share" type="primary" onClick={handleShare}>
							Xác nhận
						</Button>,
					]}
				>
					<div className="modal--body">
						<Space direction="vertical" className="roleUser">
							<span className="roleName">
								{post?.roleName === 'SinhVien'
									? 'Sinh viên'
									: post?.roleName === 'GianVien'
									? 'Giảng viên'
									: post?.roleName === 'PhuHuynh'
									? 'Phụ huynh sinh viên'
									: post?.roleName === 'NhanVien'
									? 'Nhân viên'
									: 'Admin'}
							</span>
						</Space>
						<Space direction="vertical">
							<div className="postTopLeft">
								<Link to={`/profile/${user?.userId}`}>
									<img className="postProfileImg" src={user?.avatar || sampleProPic} alt="..." />
								</Link>
								<div className="postNameAndDateEdit">
									<span className="postUsername">{user?.userName}</span>
									{post?.privacyLevel !== 'GROUP_MEMBERS' && (
										<>
											<Public htmlColor="black" />
											<Cascader
												options={options.filter((item) => item.value !== 'GROUP_MEMBERS')}
												onChange={onChange}
												defaultValue={['PUBLIC']}
												changeOnSelect
											/>
										</>
									)}
									<div className="shareOption">
										<label htmlFor="loc" className="shareOption">
											<Room htmlColor="green" className="shareIcon" />
											<select
												id="loc"
												value={editPost.location}
												onChange={(e) => setEditPost({ ...editPost, location: e.target.value })}
											>
												<option>Vị trí</option>
												{vietnamProvinces.map((province) => (
													<option key={province.id} value={province.name}>
														{province.name}
													</option>
												))}
											</select>
										</label>
									</div>
								</div>
							</div>

							<TextArea
								className="postDesc"
								onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
								value={editPost?.content}
								maxLength={1000}
								autoSize={{ minRows: 2, maxRows: 4 }}
							/>
						</Space>

						<div className="postCenter">
							<label htmlFor="filesEdit" className="shareOption imageEdit">
								<AttachFile htmlColor="brown" className="shareIcon" />
								<span className="shareOptionText">Thay đổi Tệp tin</span>
								<input
									style={{ display: 'none' }}
									type="file"
									id="filesEdit"
									accept=".docx, .txt, .pdf"
									onChange={(e) => uploadFiles(e.target.files[0], 'files')}
								/>
							</label>

							{(file?.files || editPost?.files) && (
								<>
									<div className="postFile">
										<a
											href={file?.files || editPost?.files}
											target="_blank"
											rel="noopener noreferrer"
										>
											{file?.files
												? editPost?.files.name
												: post?.files.substr(post?.files.lastIndexOf('/') + 1)}
										</a>
										<Cancel
											className="shareCancelFile"
											onClick={() => {
												setEditPost({ ...editPost, files: null });
												setFile({ ...file, files: null });
											}}
										/>
									</div>
								</>
							)}

							<label htmlFor="fileImageEdit" className="shareOption imageEdit">
								<PermMedia htmlColor="tomato" className="shareIcon" id="image--icon" />
								<span className="shareOptionText">Thay đổi Hình ảnh</span>
								<input
									style={{ display: 'none' }}
									type="file"
									id="fileImageEdit"
									accept=".png, .jpeg, .jpg"
									onChange={(e) => uploadFiles(e.target.files[0], 'photo')}
								/>
							</label>
							{(file?.photos || editPost?.photos) && (
								<div className="shareImgContainer">
									<Image
										width="100%"
										className="editPostImg"
										src={file?.photos || editPost?.photos}
										alt={'photos'}
										style={{ objectFit: 'cover' }}
									/>
									<Cancel
										className="shareCancelImg"
										onClick={() => {
											setEditPost({ ...editPost, photos: null });
											setFile({ ...file, photos: null });
										}}
									/>
								</div>
							)}
						</div>
					</div>
				</Modal>
			) : action === 'deletePost' ? (
				<Modal
					title={listAction.delete.title}
					open={visible}
					onCancel={onClose}
					footer={[
						<Button key="cancel" onClick={onClose}>
							Hủy
						</Button>,
						<Button key="share" type="primary" onClick={handleShare}>
							Xác nhận
						</Button>,
					]}
				>
					<div className="modal--body">{listAction.delete.content}</div>
				</Modal>
			) : null}
		</>
	);
};
