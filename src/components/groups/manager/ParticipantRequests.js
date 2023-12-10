import './ManagerGroup.css';
import { useParams } from 'react-router-dom';
import useAuth from '../../../context/auth/AuthContext';
import { useState, useEffect } from 'react';
import Topbar from '../../timeline/topbar/Topbar';
import { Helmet } from 'react-helmet';
import toast, { Toaster } from 'react-hot-toast';
import SidebarManagerGroup from './sidebarManagerGroup/SidebarManagerGroup';
import PostGroupApi from '../../../api/postGroups/PostGroupApi';
import UserCard from './UserCard';
import { FloatButton, List, Modal, Button } from 'antd';
import { DoneAll, HelpOutline, MoreHoriz } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import useTheme from '../../../context/ThemeContext';
const ParticipantRequests = () => {
	const params = useParams();
	const navigate = useNavigate();
	const { user: currentUser } = useAuth();
	const [memberGroup, setMemberGroup] = useState();
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		const fetchGroup = async () => {
			const res = await PostGroupApi.listMemberRequiredGroup({ user: currentUser, postId: params.postGroupId });
			setMemberGroup(res.result);
		};
		fetchGroup();
	}, [params, currentUser]);
	const handleOk = async () => {
		const toastId = toast.loading('Đang gửi yêu cầu...');
		try {
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
			setMemberGroup([]);
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
							<UserCard user={user} postId={params.postGroupId} />
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
