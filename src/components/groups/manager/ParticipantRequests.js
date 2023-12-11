import './ManagerGroup.css';
import { useParams } from 'react-router-dom';
import useAuth from '../../../context/auth/AuthContext';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import toast from 'react-hot-toast';
import PostGroupApi from '../../../api/postGroups/PostGroupApi';
import UserCard from './UserCard';
import { FloatButton, List, Modal, Button } from 'antd';
import { DoneAll, HelpOutline, MoreHoriz } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import useTheme from '../../../context/ThemeContext';
import { useWebSocket } from '../../../context/WebSocketContext';
const ParticipantRequests = ({ inforUser }) => {
	const params = useParams();
	const { stompClient } = useWebSocket();
	const navigate = useNavigate();
	const { user: currentUser } = useAuth();
	const [memberGroup, setMemberGroup] = useState();
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [postGroup, setPostGroup] = useState();
	useEffect(() => {
		const fetchGroup = async () => {
			const res = await PostGroupApi.listMemberRequiredGroup({ user: currentUser, postId: params.postGroupId });
			setMemberGroup(res.result);
			const response = await PostGroupApi.getGroup({ user: currentUser, postId: params.postGroupId });
			setPostGroup(response.result);
		};
		fetchGroup();
	}, [params, currentUser]);
	const handleOk = async () => {
		const toastId = toast.loading('Đang gửi yêu cầu...');
		if (memberGroup.length === 0) {
			toast.error('Không có yêu cầu nào!', { id: toastId });
			return;
		}

		try {
			setLoading(true);
			const data = {
				postGroupId: params.postGroupId,
				userId: [],
			};
			memberGroup?.map((item) => {
				return (data.userId = [...data.userId, item.userId]);
			});
			console.log('data', data);
			await PostGroupApi.acceptMemberGroup({ user: currentUser, data: data });
			toast.success('Thêm thành viên thành công!', { id: toastId });
			for (let i = 0; i < memberGroup.length; i++) {
				const dataNotification = {
					groupId: postGroup?.postGroupId,
					userId: memberGroup[i].userId,
					photo: postGroup?.avatar,
					content: `Bạn đã được chấp nhận vào nhóm ${postGroup?.postGroupName}`,
					link: `/groups/${postGroup?.postGroupId}`,
					isRead: false,
					createAt: new Date().toISOString(),
					updateAt: new Date().toISOString(),
				};
				stompClient.send('/app/userNotify/' + inforUser?.userId, {}, JSON.stringify(dataNotification));
			}

			setMemberGroup([]);
			setLoading(false);
		} catch (e) {
			toast.error(`Thêm thành viên thất bại! Lỗi: ${e}`, { id: toastId });
		}
		setOpenModal(false);
	};
	const handleCancel = () => {
		setOpenModal(false);
	};
	const { theme } = useTheme();
	return (
		<>
			<Helmet title={`Quản lý thành viên nhóm ||UTEALO`} />

			<div className="setting--group--member" style={{ color: theme.foreground, background: theme.background }}>
				<List
					style={{ color: theme.foreground, background: theme.background }}
					className="list--member--required"
					itemLayout="horizontal"
					dataSource={memberGroup}
					grid={{ gutter: 16, column: 3 }}
					renderItem={(user) => (
						<List.Item>
							<UserCard user={user} group={postGroup} inforUser={inforUser} />
						</List.Item>
					)}
				/>
			</div>
			<FloatButton.Group trigger="click" type="primary" style={{ right: 24 }} icon={<MoreHoriz />}>
				<FloatButton title="Chấp nhận tất cả" icon={<DoneAll />} onClick={() => setOpenModal(true)} />
				<FloatButton
					title="Trợ giúp"
					icon={<HelpOutline />}
					onClick={() => navigate(`/groups/manager/${params.postGroupId}/help`)}
				/>
			</FloatButton.Group>

			<Modal
				title="Xác nhận"
				open={openModal}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={[
					<Button key="back" onClick={handleCancel}>
						Hủy
					</Button>,
					<Button key="submit" type="primary" loading={loading} onClick={handleOk}>
						Xác nhận
					</Button>,
				]}
			>
				<p>Bạn có chắc chắn muốn chấp nhận tất cả ?</p>
			</Modal>
		</>
	);
};
export default ParticipantRequests;
