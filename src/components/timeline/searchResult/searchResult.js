import './searchResult.css';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adver4 from '../../../assets/appImages/adver4.jpg';
import SidebarSearch from '../../groups/sidebar/SidebarSearch';
import PostCard from '../post/PostCard';
import { Button } from 'antd';

const SearchResult = () => {
	const location = useLocation();
	const searchData = location.state.searchData;
	const navigate = useNavigate();

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
				{searchData.length !== 0 ? (
					<>
						{selectedFilter === 'all' && (
							<div className="menu--post" id="search--result-utealo">
								<>
									{Object.values(groupsTop3Data).length > 0 && (
										<div className="search--result-group">
											<>
												<div className="search--result">
													<div style={{ marginTop: '-15px', marginLeft: '20px' }}>
														<span style={{ fontSize: '18px', fontWeight: '600' }}>
															Nhóm
														</span>
													</div>
													<ul>
														{Object.values(groupsTop3Data).map((item, index) => (
															<li key={index}>
																<div className="search--result-item">
																	<div className="img--avatarGroup">
																		<img
																			src={
																				item.avatarGroup
																					? item.avatarGroup
																					: adver4
																			}
																			alt="avatarGroup"
																		></img>
																	</div>
																	<div className="search--text">
																		<span
																			onClick={() => {
																				navigate(
																					`/groups/${item?.postGroupId}`
																				);
																			}}
																			className="postGroupName"
																		>
																			{item.postGroupName}
																		</span>
																		<div className="search--description">
																			{item.public === true ? (
																				<span className="span-1">
																					Công khai
																				</span>
																			) : (
																				<span className="span-1">Riêng tư</span>
																			)}

																			<span className="span-2">
																				·{' '}
																				{item.countMember
																					? item.countMember
																					: 0}{' '}
																				thành viên
																			</span>
																			<span className="span-3">
																				· 2 bài viết/ngày
																			</span>
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
																	<div
																		className="search--join"
																		onClick={() =>
																			navigate(`/groups/${item.postGroupId}`)
																		}
																	>
																		{item.checkUserInGroup === 'isMember' ? (
																			<Button type="primary">Đã tham gia</Button>
																		) : (
																			<Button type="primary">Truy cập</Button>
																		)}
																	</div>
																</div>
															</li>
														))}
													</ul>
													<div
														className="textShowAll"
														onClick={() => setSelectedFilter('groups')}
													>
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
														<span style={{ fontSize: '18px', fontWeight: '600' }}>
															Mọi người
														</span>
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
																				·{' '}
																				{item.numberFriend
																					? item.numberFriend
																					: 0}{' '}
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
																				onClick={() =>
																					navigate(`/profile/${item.userId}`)
																				}
																			>
																				Xem trang cá nhân
																			</button>
																		) : (
																			<button
																				onClick={() =>
																					navigate(`/profile/${item.userId}`)
																				}
																			>
																				Bạn bè
																			</button>
																		)}
																	</div>
																</div>
															</li>
														))}
													</ul>
													<div
														className="textShowAll"
														onClick={() => setSelectedFilter('people')}
													>
														Xem tất cả
													</div>
												</div>
											</>
										</div>
									)}
								</>
								<>
									{postsTop3Data.length > 0 &&
										postsTop3Data.map((p) => <PostCard post={p} key={p.postId} />)}
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
																			src={
																				item.avatarGroup
																					? item.avatarGroup
																					: adver4
																			}
																			alt="avatarGroup"
																		></img>
																	</div>
																	<div className="search--text">
																		<span
																			onClick={() => {
																				navigate(
																					`/groups/${item?.postGroupId}`
																				);
																			}}
																			className="postGroupName"
																		>
																			{item.postGroupName}
																		</span>
																		<div className="search--description">
																			{item.public === true ? (
																				<span className="span-1">
																					Công khai
																				</span>
																			) : (
																				<span className="span-1">Riêng tư</span>
																			)}

																			<span className="span-2">
																				·{' '}
																				{item.countMember
																					? item.countMember
																					: 0}{' '}
																				thành viên
																			</span>
																			<span className="span-3">
																				· 2 bài viết/ngày
																			</span>
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
																			<button
																				onClick={() =>
																					navigate(
																						`/groups/${item.postGroupId}`
																					)
																				}
																			>
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
																				·{' '}
																				{item.numberFriend
																					? item.numberFriend
																					: 0}{' '}
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
																				onClick={() =>
																					navigate(`/profile/${item.userId}`)
																				}
																			>
																				Xem trang cá nhân
																			</button>
																		) : (
																			<button
																				onClick={() =>
																					navigate(`/profile/${item.userId}`)
																				}
																			>
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
								<>
									{postsData.length > 0 && postsData.map((p) => <PostCard post={p} key={p.postId} />)}
								</>
							</div>
						)}
					</>
				) : (
					<div className="menu--post" id="search--result-utealo">
						<span className='notResult'>Không tìm thấy kết quả nào</span>
					</div>
				)}
			</div>
		</>
	);
};

export default SearchResult;
