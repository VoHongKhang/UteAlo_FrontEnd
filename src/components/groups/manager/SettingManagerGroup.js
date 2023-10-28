import { Helmet } from 'react-helmet';
import toast, { Toaster } from 'react-hot-toast';
import Topbar from '../../timeline/topbar/Topbar';
import SidebarManagerGroup from './sidebarManagerGroup/SidebarManagerGroup';
import AcceptDenied from '../../AcceptDenied';
import { useParams } from 'react-router-dom';
import useAuth from '../../../context/auth/AuthContext';
import PostGroupApi from '../../../api/postGroups/PostGroupApi';
import { useEffect, useState } from 'react';
import './ManagerGroup.css';
import { Button, Form, Input, Select, Space } from 'antd';
import { Edit, Lock, Public } from '@material-ui/icons';
import TextArea from 'antd/es/input/TextArea';
const SettingManagerGroup = () => {
	const params = useParams();
	const { user: currentUser } = useAuth();
	const [postGroup, setPostGroup] = useState([]);
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [isEditing, setIsEditing] = useState({
		name: false,
		role: false,
		required: false,
		bio: false,
	});
	const [inputValue, setInputValue] = useState({});

	const checkBtnSave = () => {
		if (isEditing.name || isEditing.role || isEditing.required || isEditing.bio) {
			return true;
		}
		return false;
	};
	const checkDataChange = () => {
		if (
			inputValue.name === postGroup.postGroupName &&
			(inputValue.role === 'Công khai' ? 'Public' : 'Private') === postGroup.groupType &&
			(inputValue.required === 'Tham gia tự do' ? 'allowed' : 'denied') === postGroup.userJoinStatus &&
			inputValue.bio === postGroup.bio
		) {
			return false;
		}
		return true;
	};
	const handleNext = async () => {
		const toastId = toast.loading('Đang gửi yêu cầu...');
		if (checkDataChange) {
			if (checkBtnSave()) {
				toast.error('Hãy lưu từng thành phần trước khi lưu', { id: toastId });
			} else {
				if (inputValue.name === '') {
					toast.error('Tên nhóm không được để trống', { id: toastId });
					setIsEditing({ ...isEditing, name: true });
				}

				try {
					setLoading(true);
					const data = {
						postGroupId: params.postGroupId,
						postGroupName: inputValue.name,
						isPublic: inputValue.role === 'Công khai' ? true : false,
						isApprovalRequired: inputValue.required === 'Tham gia tự do' ? false : true,
						bio: inputValue.bio,
					};

					await PostGroupApi.updateBioGroup({ user: currentUser, data: data });
					setLoading(false);
					toast.success('Chỉnh sửa thành công!', { id: toastId });
				} catch (e) {
					toast.error(`Lỗi Lưu dữ liệu Lỗi: ${e}`, { id: toastId });
				}
			}
		} else {
			toast.loading('Không có gì thay đổi', { id: toastId });
		}
	};

	const handleIconSave = (target) => {
		setIsEditing({ ...isEditing, [target]: false });
	};
	const handleIconEdit = (target) => {
		setIsEditing({ ...isEditing, [target]: true });
	};
	useEffect(() => {
		const fetchGroup = async () => {
			const res = await PostGroupApi.getGroup({ user: currentUser, postId: params.postGroupId });
			setPostGroup(res.result);
			setInputValue({
				name: res.result.postGroupName,
				role: res.result.groupType === 'Public' ? 'Công khai' : 'Riêng tư',
				required: res.result.userJoinStatus === 'allowed' ? 'Tham gia tự do' : 'Kiểm duyệt thành viên',
				bio: res.result.bio,
			});
		};
		fetchGroup();
	}, [params, currentUser]);
	return (
		<div>
			<Helmet title={`Quản lý nhóm ${postGroup.postGroupName}||UTEALO`} />
			<Toaster />
			<Topbar />
			<div className="homeContainer">
				<SidebarManagerGroup user={currentUser} groupId={params.postGroupId} />
				<div className="setting--group">
					<div className="setting--group--content">
						<Form layout="vertical" form={form} name="detailGroup" onFinish={handleNext}>
							<div className="form--title">Thiết lập nhóm</div>
							<Form.Item label="Tên nhóm" name="postGroupName">
								<div className="input--name--settingGroup">
									{isEditing.name ? (
										<div className="input--nameGroup">
											<Input
												value={inputValue.name}
												className="input--container--name"
												onChange={(e) => setInputValue({ ...inputValue, name: e.target.value })}
											/>
											<Button onClick={() => handleIconSave('name')}>Lưu</Button>
										</div>
									) : (
										<div className="input--nameGroup">
											<Input
												disabled
												defaultValue={inputValue.name}
												value={inputValue.name}
												className="input--container--name"
											/>
											<Edit className="icon--edit" onClick={() => handleIconEdit('name')} />
										</div>
									)}
								</div>
							</Form.Item>

							<Form.Item label="Quyền riêng tư" name="groupType">
								<div>
									{isEditing.role ? (
										// Nếu đang chỉnh sửa, hiển thị input có thể chỉnh sửa
										<div className="input--nameGroup">
											<Select
												className="select--group--role"
												ptionfilterprop="label"
												options={[
													{
														label: (
															<>
																<Public /> <p>Công khai</p>{' '}
															</>
														),
														value: 'Công khai',
													},
													{
														label: (
															<>
																<Lock /> <p>Riêng tư</p>{' '}
															</>
														),
														value: 'Riêng tư',
													},
												]}
												onChange={(e) => setInputValue({ ...inputValue, role: e })}
											/>
											<Button onClick={() => handleIconSave('role')}>Lưu</Button>
										</div>
									) : (
										// Nếu không đang chỉnh sửa, hiển thị input chỉ đọc và biểu tượng chỉnh sửa
										<div className="input--nameGroup">
											<Input
												disabled
												value={inputValue.role}
												className="input--container--name"
											/>
											<Edit className="icon--edit" onClick={() => handleIconEdit('role')} />
										</div>
									)}
								</div>
							</Form.Item>
							<Form.Item label="Phê duyệt người tham gia" name="userJoinStatus">
								<div>
									{isEditing.required ? (
										// Nếu đang chỉnh sửa, hiển thị input có thể chỉnh sửa
										<div className="input--nameGroup">
											<Select
												className="select--group--role"
												ptionfilterprop="label"
												options={[
													{
														label: (
															<>
																<Public /> <p>Tham gia tự do</p>
															</>
														),
														value: 'Tham gia tự do',
													},
													{
														label: (
															<>
																<Lock /> <p>Kiểm duyệt thành viên</p>
															</>
														),
														value: 'Kiểm duyệt thành viên',
													},
												]}
												onChange={(e) => setInputValue({ ...inputValue, required: e })}
											/>
											<Button onClick={() => handleIconSave('required')}>Lưu</Button>
										</div>
									) : (
										// Nếu không đang chỉnh sửa, hiển thị input chỉ đọc và biểu tượng chỉnh sửa
										<div className="input--nameGroup">
											<Input
												disabled
												value={inputValue.required}
												className="input--container--name"
											/>
											<Edit className="icon--edit" onClick={() => handleIconEdit('required')} />
										</div>
									)}
								</div>
							</Form.Item>
							<Form.Item label="Giới thiệu nhóm" name="bio">
								<div className="input--nameGroup">
									{isEditing.bio ? (
										// Nếu đang chỉnh sửa, hiển thị input có thể chỉnh sửa
										<div className="input--nameGroup">
											<TextArea
												rows={3}
												value={inputValue.bio}
												onChange={(e) => setInputValue({ ...inputValue, bio: e.target.value })}
											/>

											<Button onClick={() => handleIconSave('bio')}>Lưu</Button>
										</div>
									) : (
										// Nếu không đang chỉnh sửa, hiển thị input chỉ đọc và biểu tượng chỉnh sửa
										<div className="input--nameGroup">
											<TextArea
												rows={3}
												disabled
												value={inputValue.bio ? inputValue.bio : 'Chưa có '}
											/>
											<Edit className="icon--edit" onClick={() => handleIconEdit('bio')} />
										</div>
									)}
								</div>
							</Form.Item>
							<Space>
								<Button type="default">Hủy</Button>
								<Button type="primary" htmlType="submit" style={{ float: 'right' }} loading={loading}>
									Lưu
								</Button>
							</Space>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
};
export default SettingManagerGroup;
