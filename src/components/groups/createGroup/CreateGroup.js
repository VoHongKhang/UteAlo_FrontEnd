import CreateGroupCard from './CreateGroupCard';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import toast, { Toaster } from 'react-hot-toast';
import useAuth from '../../../context/auth/AuthContext';
import useTheme from '../../../context/ThemeContext';
import noAvatar from '../../../assets/appImages/user.png';
import { useHistory } from 'react-router-dom';
import { BASE_URL } from '../../../context/apiCall';
import { Notifications, Message, Public, LocalActivityOutlined, Lock } from '@material-ui/icons';
import './CreateGroup.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Close } from '@material-ui/icons';
import { Button, Form, Input, Select } from 'antd';
import GetFriendApi from '../../../api/profile/friend/getFriendApi';
import PostGroupApi from '../../../api/postGroups/PostGroupApi';
const CreateGroup = () => {
	const { user: currentUser } = useAuth();
	const [user, setUser] = useState();
	const [nameGroup, setNameGroup] = useState('Tên nhóm');
	const [listFriends, setListFriends] = useState([]);
	const [loading, setLoading] = useState(false);
	const [role, setRole] = useState('Quyền riêng tư nhóm');
	const history = useHistory();
	const handderMessageClick = () => {
		history.push(`/message/${currentUser.userId}}`);
	};
	const handderNotificationClick = () => {
		history.push(`notification/${currentUser.userId}`);
	};
	const [form] = Form.useForm();
	const handlerSelectFriend = async () => {
		try {
			setLoading(true);
			const config = {
				headers: {
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			const response = await GetFriendApi.getFriend(currentUser);
			setListFriends(response.result);
			setLoading(false);
		} catch {
			console.log('error');
		}
	};
	useEffect(() => {
		const fetchUsers = async () => {
			const config = {
				headers: {
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			const res = await axios.get(`${BASE_URL}/v1/user/profile/${currentUser.userId}`, config);
			setUser(res.data.result);
		};
		fetchUsers();
	}, [currentUser]);
	const handlerClose = () => {
		history.push(`/groups`);
	};
	const selectRole = document.querySelector('.select--group--role');
	const listDetailRole = [
		'Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và những gì họ đăng.',
		'Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ đăng.',
	];
	const handlerSelectRole = (e) => {
		if (e === 'Pulic') {
			document.querySelector('.detail--select').innerHTML = listDetailRole[0];
		} else {
			document.querySelector('.detail--select').innerHTML = listDetailRole[1];
		}
		setRole(e);
	};
	const handlefinishForm = async () => {
		const toastId = toast.loading('Đang gửi yêu cầu...');
		const message = "Tạo nhóm thất bại !!!";
		let dataGroup = {
			postGroupName: nameGroup,
			public: role === 'Public' ? true : false,
			userId: listFriends.userId,
		};
		try {
			const res = await PostGroupApi.createGroup({ user: currentUser, data: dataGroup });
			toast.success('Tạo nhóm thành công!!!', { id: toastId });
			message += res.data.message
			history.push(`/groups/${res.data}`)
		} catch {
			toast.error(`${message}`, { id: toastId });
		}

		console.log(form.getFieldsValue());
	};
	const handlerInputName = (e) => {
		setNameGroup(e.target.value);
	};
	return (
		<>
			<Helmet title="UTEALO" />
			<Toaster />
			<div className="homeContainer">
				<div className="create--group--sidebar">
					<div className="create--group--sidebar--header">
						<div className="topbar--create-group-left">
							<Close onClick={handlerClose} className="close--button" />
							<img src={noAvatar} alt="icon" onClick={() => history.push(`/`)} />
						</div>
						<span className="link--create-group">Nhóm {'>'} Tạo nhóm </span>
						<h2>Tạo nhóm</h2>
						<div className="group--user-name">
							<img
								src={user?.avatar ? user?.avatar : noAvatar}
								alt="avatar"
								className="avatar--user--creategroup"
							/>
							<div className="user--create--group">
								<p className="name--user--create--group">{user?.fullName}</p>
								<span>{user?.role ? user?.role : 'Quản trị viên'}</span>
							</div>
						</div>
					</div>
					<div className="create--group-sidebar--container">
						<Form layout="vertical" form={form} name="info" onFinish={handlefinishForm}>
							<div className="formData--create--group">
								<Form.Item
									name={'groupName'}
									rules={[
										{
											required: true,
											message: 'Vui lòng nhập tên nhóm!',
										},
									]}
								>
									<Input
										onChange={handlerInputName}
										placeholder="Tên nhóm"
										className="input--create--group--name"
									/>
								</Form.Item>
								<Form.Item
									name={'groupNameRole'}
									rules={[
										{
											required: true,
											message: 'Vui lòng chọn quyền riêng tư của nhóm!',
										},
									]}
								>
									<Select
										className="select--group--role"
										placeholder="Chọn quyền nhóm"
										ptionfilterprop="label"
										options={[
											{
												label: (
													<>
														<Public /> <p>Công khai</p>{' '}
													</>
												),
												value: 'Pulic',
											},
											{
												label: (
													<>
														<Lock /> <p>Riêng tư</p>{' '}
													</>
												),
												value: 'Private',
											},
										]}
										onChange={handlerSelectRole}
									/>
								</Form.Item>
								<span className="detail--select"></span>
								<Form.Item name={'listFriend'}>
									<Select
										className="select-list--friend"
										showSearch
										mode="multiple"
										loading={loading}
										placeholder="Mời bạn bè (Không bắt buộc)"
										ptionfilterprop="label"
										onClick={handlerSelectFriend}
										options={listFriends.map((item) => ({
											label: (
												<>
													<img src={item?.avatar ? item?.avatar : noAvatar} alt="avatar" />
													<p>{item.username}</p>
												</>
											),
											value: item.userId,
										}))}
									/>
								</Form.Item>
							</div>
							<Form.Item>
								<Button type="primary" htmlType="submit" className="button--create-group">
									Tạo
								</Button>
							</Form.Item>
						</Form>
					</div>
				</div>
				<div className="create-group-right">
					<div className="topbar--create-group-right">
						<div className="button-right">
							<Message
								className="button-right-message"
								titleAccess="Tin nhắn"
								onClick={handderMessageClick}
							/>
						</div>
						<div className="button-right">
							<Notifications
								className="button-right-notifications"
								titleAccess="Thông báo"
								onClick={handderNotificationClick}
							/>
						</div>

						<Link to={`/profile/${currentUser.userId}`}>
							<img src={user?.avatar ? user?.avatar : noAvatar} alt="..." className="topbarImg" />
						</Link>
					</div>
					<CreateGroupCard nameGroup={nameGroup} role={role} />
				</div>
			</div>
		</>
	);
};
export default CreateGroup;
