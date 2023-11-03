import './searchGroup.css';
import { useLocation } from 'react-router-dom';
import Topbar from '../../timeline/topbar/Topbar';
import useAuth from '../../../context/auth/AuthContext';
import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';
import SidebarGroup from '../sidebar/SidebarGroup';
import { useNavigate } from 'react-router-dom';
import adver4 from '../../../assets/appImages/adver4.jpg';

const SearchGroup = () => {
	const location = useLocation();
	const searchData = location.state.searchData;
	const { user: currentUser } = useAuth();
	const navigate = useNavigate();
	return (
		<>
			<Helmet title="UTEALO" />
			<Toaster />
			<Topbar />
			<div className="homeContainer">
				<SidebarGroup user={currentUser} />
				<div className="menu--post" id="search--result">
					<div className="search--result-not-join">
						{Object.values(searchData).length > 0 ? (
							<div className="search--result">
								<ul>
									{Object.values(searchData).map((item, index) => (
										<li
											onClick={() => {
												navigate(`/groups/${item?.postGroupId}`);
											}}
											key={index}
										>
											<div className="search--result-item">
												<div className="img--avatarGroup">
													<img
														src={item.avatarGroup ? item.avatarGroup : adver4}
														alt="avatarGroup"
													></img>
												</div>
												<div className="search--text">
													<span className="postGroupName">{item.postGroupName}</span>
													<div className="search--description">
														<span className="span-1">Công khai</span>
														<span className="span-2">· 109K thành viên</span>
														<span className="span-3">· 2 bài viết/ngày</span>
													</div>
													<span className="text--more">
														Cộng đồng Logitech Gaming Việt Nam - Theo dõi fanpage của
														Logitech G
													</span>
													<div className="number--friend-joined">
														<img src={adver4} alt="..."></img>
														<span>4 người bạn là thành viên</span>
													</div>
												</div>
												<div className="search--join">
													<button>Tham gia</button>
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
			</div>
		</>
	);
};

export default SearchGroup;
