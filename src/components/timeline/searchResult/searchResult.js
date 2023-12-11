import './searchResult.css';
import { useLocation } from 'react-router-dom';
import Topbar from '../topbar/Topbar';
import { Helmet } from 'react-helmet';
import useAuth from '../../../context/auth/AuthContext';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import adver4 from '../../../assets/appImages/adver4.jpg';
import PostGroupApi from '../../../api/postGroups/PostGroupApi';
import SidebarSearch from '../../groups/sidebar/SidebarSearch';
import PostCard from '../post/PostCard';
import GetFriendApi from '../../../api/profile/friend/getFriendApi';
import toast from 'react-hot-toast';

const SearchResult = () => {
	const location = useLocation();
	const searchData = location.state.searchData;
	const { user: currentUser } = useAuth();
	const navigate = useNavigate();

	const handleRequestFriend = async ({ userId }) => {
		const toastId = toast.loading('Đang gửi lời mời kết bạn...');

		try {
			await GetFriendApi.sendFriendRequest({ token: currentUser.accessToken, userId: userId });
			toast.success('Gửi lời mời kết bạn thành công!', { id: toastId });
		} catch (error) {
			toast.error(error.message || error.toString(), { id: toastId });
		}
	};

	// Tham gia nhóm
	const joinGroup = async (postGroupId) => {
		PostGroupApi.joinGroup({ token: currentUser.accessToken, postGroupId: postGroupId });
		navigate(`/groups/${postGroupId}`);
	};

	console.log(searchData);

	// Tách thành 3 mảng riêng biệt, mỗi mảng chỉ lấy 3 giá trị đầu tiên
	const usersTop3Data = searchData
		.filter((item) => item.userId !== undefined && item.postId === undefined)
		.slice(0, 3);
	const groupsTop3Data = searchData
		.filter((item) => item.postGroupId !== undefined && item.postId === undefined)
		.slice(0, 3);
	const postsTop3Data = searchData.filter((item) => item.postId !== undefined).slice(0, 3);

	// Tách thành 3 mảng riêng biệt
	const usersData = searchData.filter((item) => item.userId !== undefined && item.postId === undefined);
	const groupsData = searchData.filter((item) => item.postGroupId !== undefined && item.postId === undefined);
	const postsData = searchData.filter((item) => item.postId !== undefined);

	// Chọn filter
	const [selectedFilter, setSelectedFilter] = useState('all');

	console.log('selectedFilter', selectedFilter);

	return (
		<>
			<Helmet title="UTEALO" />
			<div className="homeContainer">
				<SidebarSearch onFilterChange={(filter) => setSelectedFilter(filter)} />
				{selectedFilter === 'all' && (
					<div className="menu--post" id="search--result-utealo">
						<>
							{Object.values(groupsTop3Data).length > 0 && (
								<div className="search--result-group">
									<>
										<div className="search--result">
											<div style={{ marginTop: '-15px', marginLeft: '20px' }}>
												<span style={{ fontSize: '18px', fontWeight: '600' }}>Nhóm</span>
											</div>
											<ul>
												{Object.values(groupsTop3Data).map((item, index) => (
													<li key={index}>
														<div className="search--result-item">
															<div className="img--avatarGroup">
																<img
																	src={item.avatarGroup ? item.avatarGroup : adver4}
																	alt="avatarGroup"
																></img>
															</div>
															<div className="search--text">
																<span
																	onClick={() => {
																		navigate(`/groups/${item?.postGroupId}`);
																	}}
																	className="postGroupName"
																>
																	{item.postGroupName}
																</span>
																<div className="search--description">
																	{item.public === true ? (
																		<span className="span-1">Công khai</span>
																	) : (
																		<span className="span-1">Riêng tư</span>
																	)}

																	<span className="span-2">
																		· {item.countMember ? item.countMember : 0}K
																		thành viên
																	</span>
																	<span className="span-3">· 2 bài viết/ngày</span>
																</div>
																<span className="text--more">{item.bio}</span>
																<div className="number--friend-joined">
																	<img src={adver4} alt="..."></img>
																	<span>
																		{' '}
																		{item.countFriendJoinnedGroup
																			? item.countFriendJoinnedGroup
																			: 0}{' '}
																		người bạn là thành viên
																	</span>
																</div>
															</div>
															<div className="search--join">
																{item.checkUserInGroup === 'isMember' ? (
																	<button>Đã tham gia</button>
																) : (
																	<button onClick={() => joinGroup(item.postGroupId)}>
																		Tham gia
																	</button>
																)}
															</div>
														</div>
													</li>
												))}
											</ul>
											<div className="textShowAll" onClick={() => setSelectedFilter('groups')}>
												Xem tất cả
											</div>
										</div>
									</>
								</div>
							)}
						</>
						<>
							{Object.values(usersTop3Data).length > 0 && (
								<div className="search--result-people">
									<>
										<div className="search--result">
											<div style={{ marginTop: '-15px', marginLeft: '20px' }}>
												<span style={{ fontSize: '18px', fontWeight: '600' }}>Mọi người</span>
											</div>
											<ul>
												{Object.values(usersTop3Data).map((item, index) => (
													<li key={index}>
														<div className="search--result-item">
															<div className="img--avatarGroup">
																<img
																	src={item.avatar ? item.avatar : adver4}
																	alt="avatarGroup"
																></img>
															</div>
															<div className="search--text">
																<span
																	onClick={() => {
																		navigate(`/profile/${item?.userId}`);
																	}}
																	className="postGroupName"
																>
																	{item.userName}
																</span>
																<div className="search--description">
																	<span className="span-2">
																		· {item.numberFriend ? item.numberFriend : 0}K
																		bạn bè
																	</span>
																	<span className="span-3">
																		· {item.address ? item.address : '---'}
																	</span>
																</div>
																<span className="text--more">{item.bio}</span>
																<div className="number--friend-joined">
																	<img src={adver4} alt="..."></img>
																	<span>
																		{item.countFriendJoinnedGroup
																			? item.countFriendJoinnedGroup
																			: 0}
																		{'  '}
																		bạn chung
																	</span>
																</div>
															</div>
															<div className="search--join">
																{item.checkStatusFriend !== 'isFriend' ? (
																	<button
																		style={{ width: '95px' }}
																		onClick={() => handleRequestFriend(item.userId)}
																	>
																		Thêm bạn bè
																	</button>
																) : (
																	<button onClick={() => joinGroup(item.userId)}>
																		Bạn bè
																	</button>
																)}
															</div>
														</div>
													</li>
												))}
											</ul>
											<div className="textShowAll" onClick={() => setSelectedFilter('people')}>
												Xem tất cả
											</div>
										</div>
									</>
								</div>
							)}
						</>
						<>
							{postsTop3Data.length > 0 && postsTop3Data.map((p) => <PostCard post={p} key={p.postId} />)}
						</>
					</div>
				)}
				{selectedFilter !== 'posts' && selectedFilter !== 'people' && selectedFilter !== 'all' && (
					<div className="menu--post" id="search--result-utealo">
						<>
							{Object.values(groupsData).length > 0 ? (
								<div className="search--result-group" style={{ background: '#f0f2f5' }}>
									<>
										<div className="search--result-all" style={{ background: '#f0f2f5' }}>
											<ul>
												{Object.values(groupsData).map((item, index) => (
													<li key={index}>
														<div
															className="search--result-item"
															style={{ marginBottom: '20px' }}
														>
															<div className="img--avatarGroup">
																<img
																	src={item.avatarGroup ? item.avatarGroup : adver4}
																	alt="avatarGroup"
																></img>
															</div>
															<div className="search--text">
																<span
																	onClick={() => {
																		navigate(`/groups/${item?.postGroupId}`);
																	}}
																	className="postGroupName"
																>
																	{item.postGroupName}
																</span>
																<div className="search--description">
																	{item.public === true ? (
																		<span className="span-1">Công khai</span>
																	) : (
																		<span className="span-1">Riêng tư</span>
																	)}

																	<span className="span-2">
																		· {item.countMember ? item.countMember : 0}K
																		thành viên
																	</span>
																	<span className="span-3">· 2 bài viết/ngày</span>
																</div>
																<span className="text--more">{item.bio}</span>
																<div className="number--friend-joined">
																	<img src={adver4} alt="..."></img>
																	<span>
																		{' '}
																		{item.countFriendJoinnedGroup
																			? item.countFriendJoinnedGroup
																			: 0}{' '}
																		người bạn là thành viên
																	</span>
																</div>
															</div>
															<div className="search--join">
																{item.checkUserInGroup === 'isMember' ? (
																	<button>Đã tham gia</button>
																) : (
																	<button onClick={() => joinGroup(item.postGroupId)}>
																		Tham gia
																	</button>
																)}
															</div>
														</div>
													</li>
												))}
											</ul>
										</div>
									</>
								</div>
							) : (
								<span>Không có nhóm nào được tìm thấy</span>
							)}
						</>
					</div>
				)}
				{selectedFilter !== 'posts' && selectedFilter !== 'groups' && selectedFilter !== 'all' && (
					<div className="menu--post" id="search--result-utealo">
						<>
							{Object.values(usersData).length > 0 ? (
								<div className="search--result-people" style={{ background: '#f0f2f5' }}>
									<>
										<div className="search--result-all" style={{ background: '#f0f2f5' }}>
											<ul>
												{Object.values(usersData).map((item, index) => (
													<li key={index}>
														<div
															className="search--result-item"
															style={{ marginBottom: '20px' }}
														>
															<div className="img--avatarGroup">
																<img
																	src={item.avatar ? item.avatar : adver4}
																	alt="avatarGroup"
																></img>
															</div>
															<div className="search--text">
																<span
																	onClick={() => {
																		navigate(`/profile/${item?.userId}`);
																	}}
																	className="postGroupName"
																>
																	{item.userName}
																</span>
																<div className="search--description">
																	<span className="span-2">
																		· {item.numberFriend ? item.numberFriend : 0}K
																		bạn bè
																	</span>
																	<span className="span-3">
																		· {item.address ? item.address : '---'}
																	</span>
																</div>
																<span className="text--more">{item.bio}</span>
																<div className="number--friend-joined">
																	<img src={adver4} alt="..."></img>
																	<span>
																		{item.countFriendJoinnedGroup
																			? item.countFriendJoinnedGroup
																			: 0}
																		{'  '}
																		bạn chung
																	</span>
																</div>
															</div>
															<div className="search--join">
																{item.checkStatusFriend !== 'isFriend' ? (
																	<button
																		style={{ width: '95px' }}
																		onClick={() => handleRequestFriend(item.userId)}
																	>
																		Thêm bạn bè
																	</button>
																) : (
																	<button onClick={() => joinGroup(item.userId)}>
																		Bạn bè
																	</button>
																)}
															</div>
														</div>
													</li>
												))}
											</ul>
										</div>
									</>
								</div>
							) : (
								<span>Không có người nào được tìm thấy</span>
							)}
						</>
					</div>
				)}
				{selectedFilter !== 'people' && selectedFilter !== 'groups' && selectedFilter !== 'all' && (
					<div className="menu--post" id="search--result-utealo">
						<>{postsData.length > 0 && postsData.map((p) => <PostCard post={p} key={p.postId} />)}</>
					</div>
				)}
			</div>
		</>
	);
};

export default SearchResult;
