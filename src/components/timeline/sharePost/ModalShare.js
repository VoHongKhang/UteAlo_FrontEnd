import React, { useEffect, useState } from 'react';
import { Modal, Button, Space, Cascader, Image } from 'antd';
import { formatTime } from '../../utils/CommonFuc';
import { Link } from 'react-router-dom';
import '../post/PostCard.css';
import sampleProPic from '../../../assets/appImages/user.png';
import PostGroupApi from '../../../api/postGroups/PostGroupApi';
import TextArea from 'antd/es/input/TextArea';
import { Public } from '@material-ui/icons';
export const ModalShare = ({ share, user, currentUser, visible, onClose, onShare, action }) => {
	// #region action Share
	const [group, setGroup] = useState([]);
	const [editShare, setEditShare] = useState(share);
	const [newShare, setNewShare] = useState({
		content: '',
		privacyLevel: 'PUBLIC',
		postId: share?.postsResponse.postId,
		userId: user?.userId,
		postGroupId: '',
		createAt: new Date().toISOString(),
		updateAt: new Date().toISOString(),
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
		else if (action === 'editSharePost') onShare(editShare);
		else if (action === 'deleteSharePost') onShare(share?.shareId);

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
		else if (action === 'editSharePost')
			setEditShare({
				...editShare,
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
	return (
		<>
			{action === 'deleteSharePost' ? (
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
			) : action === 'editSharePost' ? (
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
								{user?.roleName === 'SinhVien'
									? 'Sinh viên'
									: user?.roleName === 'GianVien'
									? 'Giảng viên'
									: user?.roleName === 'PhuHuynh'
									? 'Phụ huynh sinh viên'
									: user?.roleName === 'NhanVien'
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
									{share?.privacyLevel !== 'GROUP_MEMBERS' && (
										<div style={{ display: 'flex', alignItems: 'center' }}>
											<Public htmlColor="black" />
											<Cascader
												options={options.filter((item) => item.value !== 'GROUP_MEMBERS')}
												onChange={onChange}
												defaultValue={['PUBLIC']}
												changeOnSelect
											/>
										</div>
									)}
								</div>
							</div>

							<TextArea
								className="postDesc"
								onChange={(e) => setEditShare({ ...editShare, content: e.target.value })}
								value={editShare?.content}
								maxLength={1000}
								autoSize={{ minRows: 2, maxRows: 4 }}
							/>
						</Space>
					</div>
				</Modal>
			) : action === 'sharePost' ? (
				<Modal
					title={listAction.share?.title}
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
								<Link to={`/profile/${share?.postsResponse.userId}`}>
									<img
										className="postProfileImg"
										src={share?.postsResponse.avatarUser || sampleProPic}
										alt="..."
									/>
								</Link>
								<div className="postNameAndDate">
									<span className="postUsername">{share?.postsResponse.userName}</span>
									<span className="postDateShare">{formatTime(share?.postsResponse.postTime)}</span>
								</div>
							</div>
							<div className="postCenter">
								{share?.postsResponse.content && (
									<span className="postText">{share?.postsResponse.content}</span>
								)}
								{share?.postsResponse.files &&
									share?.postsResponse.files.toLowerCase().endsWith('.txt') && (
										<div className="postFile">
											<a
												href={share?.postsResponse.files}
												target="_blank"
												rel="noopener noreferrer"
											>
												{share?.postsResponse.files.substr(
													share?.postsResponse.files.lastIndexOf('/') + 1
												)}
											</a>
										</div>
									)}
								{share?.postsResponse.files &&
									share?.postsResponse.files.toLowerCase().endsWith('.docx') && (
										<div className="postFile">
											<a
												href={share?.postsResponse.files}
												target="_blank"
												rel="noopener noreferrer"
											>
												{share?.postsResponse.files.substr(
													share?.postsResponse.files.lastIndexOf('/') + 1
												)}
											</a>
										</div>
									)}
								{share?.postsResponse.files &&
									share?.postsResponse.files.toLowerCase().endsWith('.pdf') && (
										<div className="postFile">
											<a
												href={share?.postsResponse.files}
												target="_blank"
												rel="noopener noreferrer"
											>
												{share?.postsResponse.files.substr(
													share?.postsResponse.files.lastIndexOf('/') + 1
												)}
											</a>
										</div>
									)}
								{share?.postsResponse.photos && (
									<Image
										width="100%"
										className="postImg"
										src={share?.postsResponse?.photos} // Sử dụng selectedPost.photos thay vì cố định URL như bạn đã đề cập
										alt={share?.postsResponse.content}
										style={{ objectFit: 'cover' }}
									/>
								)}
							</div>
						</Space>
					</div>
				</Modal>
			) : null}
		</>
	);
};
