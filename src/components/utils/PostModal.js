// PostModal.js
import React from 'react';
import { Modal } from 'antd';
import PostCard from '../timeline/post/PostCard';

const PostModal = ({ post, inforUser, visible, onClose, modalDetail }) => {
	return (
		<Modal title={`Chi tiết bài viết`} open={visible} onCancel={onClose} footer={null}>
			<div>
				<PostCard inforUser={inforUser} post={post} modalDetail={modalDetail + 1} />
			</div>
		</Modal>
	);
};

export default PostModal;
