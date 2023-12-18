import { Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostCard from '../../timeline/post/PostCard';
import SharePostCard from '../../timeline/post/SharePostCard';
import Share from '../../timeline/sharePost/Share';
import { Lock, Public, Room, Visibility } from '@material-ui/icons';
import noCover from '../../../assets/appImages/noCover.jpg';
import useTheme from '../../../context/ThemeContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../context/apiCall';

export default function Discuss({
	postGroup,
	inforUser,
	postLength,
	sortedList,
	hasMore,
	loadMore,
	getNewPost,
	getPostUpdate,
	getNewSharePost,
	onViewAllFilesClick,
}) {
	const [listPhoto, setListPhoto] = useState([]);
	const handleViewAllFilesClick = () => {
		if (onViewAllFilesClick) {
			onViewAllFilesClick();
		}
	};
	useEffect(() => {
		const fetch = async () => {
			try {
				const res = await axios.get(`${BASE_URL}/v1/groupPost/photos/${postGroup.postGroupId}`);
				const data = res.data.content;
				const photoUrls = data.map((item) => item.photos);
				setListPhoto(photoUrls);
			} catch (error) {
				return error.response ? error.response.data.message : error.message;
			}
		};
		fetch();
	}, [postGroup.postGroupId]);
	console.log('listPhoto', listPhoto);
	// Hàm border-radius 4 gốc cho 4 ảnh
	function getImageStyles(index) {
		let borderStyles = '';

		switch (index) {
			case 0:
				borderStyles = '8px 0 0 0';
				break;
			case 1:
				borderStyles = '0 8px 0 0';
				break;
			case 2:
				borderStyles = '0 0 0 8px';
				break;
			case 3:
				borderStyles = '0 0 8px 0';
				break;
			default:
				borderStyles = '0';
		}

		return {
			borderRadius: borderStyles,
		};
	}
	const { theme } = useTheme();
	return (
		<div className="container--group" style={{ color: theme.foreground, background: theme.background }}>
			{(postGroup.roleGroup === 'Waiting Accept' ||
				postGroup.roleGroup === 'Accept Invited' ||
				postGroup.roleGroup === 'None') &&
			postGroup.groupType === 'Private' ? (
				<div></div>
			) : (
				<div className="feed--detail" style={{ color: theme.foreground, background: theme.background }}>
					<div className="feed--detail-feedWrapper" id="feed--group--scroll">
						{(postGroup.roleGroup === 'Admin' ||
							postGroup.roleGroup === 'Member' ||
							postGroup.roleGroup === 'Deputy') && (
							<Share inforUser={inforUser} newPosts={getNewPost} postGroupId={postGroup.postGroupId} />
						)}
						<InfiniteScroll
							scrollableTarget="feed--group--scroll"
							className="feed__scroll"
							dataLength={postLength}
							style={{ color: theme.foreground, background: theme.background, overflow: 'visible' }}
							next={loadMore}
							hasMore={hasMore.posts || hasMore.share}
							loader={
								<Skeleton
									style={{ marginTop: '30px' }}
									active
									avatar
									paragraph={{
										rows: 4,
									}}
								/>
							}
						>
							{sortedList?.map((p) => {
								if (p.postId) {
									return (
										<PostCard
											inforUser={inforUser}
											post={p}
											key={`post-${p.postId}`}
											group={postGroup}
											newShare={getPostUpdate}
										/>
									);
								} else {
									return (
										<SharePostCard
											inforUser={inforUser}
											share={p}
											key={`share-${p.shareId}`}
											newSharePosts={getNewSharePost}
										/>
									);
								}
							})}
						</InfiniteScroll>
					</div>
				</div>
			)}
			{postGroup && (
				<div className="rightbar--group">
					<div className="group--infor" style={{ color: theme.foreground, background: theme.background }}>
						<div className="group--infor-introduce">Giới thiệu</div>
						<div className="group--infor-bio">
							<span>{postGroup.bio}</span>
						</div>
						{postGroup.groupType === 'Public' ? (
							<div style={{ color: theme.foreground, background: theme.background }}>
								<div className="group--infor-public">
									<Public htmlColor="#65676B" className="group--public-icon" />
									<span className="group--public">Nhóm Công khai</span>
								</div>
								<div className="group--infor-public-text">
									<span>
										Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và những gì họ đăng.
									</span>
								</div>
							</div>
						) : (
							<div style={{ color: theme.foreground, background: theme.background }}>
								<div className="group--infor-public">
									<Lock htmlColor="#65676B" className="group--public-icon" />
									<span className="group--public">Nhóm riêng tư</span>
								</div>
								<div className="group--infor-public-text">
									<span>Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ đăng.</span>
								</div>
							</div>
						)}

						<div className="group--infor-show">
							<Visibility htmlColor="#65676B" className="group--show-icon" />
							<span className="group--show">Hiển thị</span>
						</div>
						<div className="group--infor-show-text">
							<span>Ai cũng có thể tìm thấy nhóm này.</span>
						</div>

						<div className="group--infor-location">
							<Room htmlColor="#65676B" className="group--location-icon" />
							<span className="group--location">Thành Phố Hồ Chí Minh</span>
						</div>

						<div className="group--infor-more">Tìm hiểu thêm</div>
					</div>
					{(postGroup.roleGroup === 'Waiting Accept' ||
						postGroup.roleGroup === 'Accept Invited' ||
						postGroup.roleGroup === 'None') &&
					postGroup.groupType === 'Private' ? (
						<div></div>
					) : (
						<div className="group--file" style={{ color: theme.foreground, background: theme.background }}>
							<div
								className="group--file-text"
								style={{ color: theme.foreground, background: theme.background }}
							>
								<div className="group--file-text-title">File phương tiện</div>
								<div
									className="group--file-text-more"
									onClick={handleViewAllFilesClick}
									style={{
										cursor: 'pointer',
									}}
								>
									Xem tất cả file
								</div>
							</div>

							<div className="file--photos">
								{Array.from({ length: 4 }).map((_, index) => (
									<div key={index} className="filePhotoItem" style={getImageStyles(index)}>
										<img src={listPhoto[index] || noCover} alt="" />
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
