import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';
import SidebarManagerGroup from './sidebarManagerGroup/SidebarManagerGroup';
import PostGroupApi from '../../../api/postGroups/PostGroupApi';
import { useParams } from 'react-router-dom';
import useAuth from '../../../context/auth/AuthContext';
import { useState, useEffect } from 'react';
import Topbar from '../../timeline/topbar/Topbar';
import { Avatar, List, Button } from 'antd';
import { MoreHoriz } from '@material-ui/icons';
import './ManagerGroup.css';
import Search from 'antd/es/input/Search';
const MemberGroup = () => {
	const params = useParams();
	const { user: currentUser } = useAuth();
	const [memberGroup, setMemberGroup] = useState();
	const [anchor, setAnchor] = useState();

	const handleClick = (event) => {
		setAnchor(anchor ? null : event.currentTarget);
	};

	const open = Boolean(anchor);
	const id = open ? 'simple-popper' : undefined;
	const handleClickMember = (e) => {
		console.log(e);
	};
	useEffect(() => {
		const fetchGroup = async () => {
			const res = await PostGroupApi.listMemberGroup({ user: currentUser, postId: params.postGroupId });
			setMemberGroup(res.result);
			console.log('member', res.result);
		};
		fetchGroup();
	}, [params, currentUser]);
	const onSearch = (value) => {
		console.log('value', value);
	};
	return (
		<>
			<Helmet title={`Quản lý thành viên nhóm ||UTEALO`} />
			<Toaster />
			<Topbar />
			<div div className="homeContainer">
				<SidebarManagerGroup user={currentUser} groupId={params.postGroupId} />
				<div className="setting--group--member">
					<div className="member--contaner">
						<div className="setting--group__title">Thành viên nhóm</div>
						<div className="setting--group__search">
							<Search
								placeholder="Tìm kiếm thành viên"
								allowClear
								enterButton="Search"
								size="large"
								onSearch={onSearch}
							/>
						</div>
						<List
							className="list--friend"
							itemLayout="horizontal"
							dataSource={memberGroup}
							renderItem={(item) => (
								<List.Item>
									<List.Item.Meta
										avatar={<Avatar src={item.avatarUser} />}
										title={item.username}
										description={item.roleName === 'admin' ? 'Quản trị viên' : 'Thành viên'}
									/>
									<div>
										<Button
											aria-describedby={id}
											type="button"
											onClick={() => handleClickMember(item)}
										>
											<MoreHoriz className="more--icon" />
										</Button>
										
									</div>
								</List.Item>
							)}
						/>
					</div>
				</div>
			</div>
		</>
	);
};
export default MemberGroup;
{
	/* <div className="setting--group__content">
						<div className="setting--group__content__title">Thành viên nhóm</div>
						<div className="setting--group__content__list">
							{memberGroup?.map((member) => (
								<div className="setting--group__content__list__item">
									<div className="setting--group__content__list__item__avatar">
										<img src={member.avatarUser} alt="" />
									</div>
									<div className="setting--group__content__list__item__info">
										<div className="setting--group__content__list__item__info__name">
											{member.username}
										</div>
										<div className="setting--group__content__list__item__info__role">
											{member.roleName === 'admin' ? 'Quản trị viên' : 'Thành viên'}
										</div>
									</div>
								</div>
							))}
						</div>
					</div> */
}
