import './searchGroup.css';
import { useLocation } from 'react-router-dom';
import useAuth from '../../../context/auth/AuthContext';
import { Helmet } from 'react-helmet';

import { useNavigate } from 'react-router-dom';
import adver4 from '../../../assets/appImages/adver4.jpg';
import PostGroupApi from '../../../api/postGroups/PostGroupApi';

const SearchGroup = () => {
	const location = useLocation();
	const searchData = location.state.searchData;
	const { user: currentUser } = useAuth();
	const navigate = useNavigate();

	const joinGroup = async (postGroupId) => {
		PostGroupApi.joinGroup({ token: currentUser.accessToken, postGroupId: postGroupId });
		navigate(`/groups/${postGroupId}`);
	};

	return (
		<>
			<Helmet title="UTEALO" />
			<div className="menu--post" id="search--result">
				<div className="search--result-not-join">
					{Object.values(searchData).length > 0 ? (
						<div className="search--result">
							<ul>
								{Object.values(searchData).map((item, index) => (
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
													className="pGroupName"
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
														· {item.countMember ? item.countMember : 0}K thành viên
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
					) : (
						<span>không tìm thấy kết quả</span>
					)}
				</div>
			</div>
		</>
	);
};

export default SearchGroup;
