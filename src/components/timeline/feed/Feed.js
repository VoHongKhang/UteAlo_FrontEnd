import React, { useEffect, useRef, useState } from 'react';
import './Feed.css';
import PostCard from '../post/PostCard';
import SharePostCard from '../post/SharePostCard';
import Share from '../sharePost/Share';
import useAuth from '../../../context/auth/AuthContext';
import useTheme from '../../../context/ThemeContext';
import { Skeleton, Space, Typography } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import LogoUte from '../../../assets/icons/logo_UTE.png';
import PostApi from '../../../api/timeline/post/PostApi';
import { Helmet } from 'react-helmet';

const Feed = ({ inforUser }) => {
	const isMounted = useRef(true);

	const { user: currentUser } = useAuth();
	const [listPost, setListPost] = useState([]);
	const [sortedList, setSortedList] = useState([]);
	const { theme } = useTheme();
	const [hasMore, setHasMore] = useState({
		posts: false,
		share: false,
	});
	const [page, setPage] = useState(0);
	const [postLength, setPostLength] = useState(0);

	const loadMore = async () => {
		const newPage = page + 1;
		setPage(newPage);

		try {
			if (isMounted.current) {
				const [res, response] = await Promise.all([
					hasMore.posts && PostApi.fetchPostsTimeLine(currentUser, newPage, 20),
					hasMore.share && PostApi.fetchPostsShareTimeLine(currentUser, newPage, 20),
				]);

				if (res) {
					console.log('res', res);
					setListPost((prevList) => [...prevList, ...res]);
					setPostLength((prevLength) => prevLength + res.length);

					if (res.length < 20) {
						setHasMore({ ...hasMore, posts: false });
					} else {
						setHasMore({ ...hasMore, posts: true });
					}
				}

				if (response) {
					console.log('response', response);
					setListPost((prevList) => [...prevList, ...response]);
					setPostLength((prevLength) => prevLength + response.length);

					if (response.length < 20) {
						setHasMore({ ...hasMore, share: false });
					} else {
						setHasMore({ ...hasMore, share: true });
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	const fetchPosts = async () => {
		try {
			const [res, response] = await Promise.all([
				PostApi.fetchPostsTimeLine(currentUser, page, 20),
				PostApi.fetchPostsShareTimeLine(currentUser, page, 20),
			]);

			if (response) {
				console.log('response', response);
				setListPost((prevList) => [...prevList, ...response]);
				setPostLength((pre) => pre + response.length);
				if (response.length < 20) {
					setHasMore({ ...hasMore, share: false });
				} else {
					setHasMore({ ...hasMore, share: true });
				}
			}

			if (res) {
				console.log('res', res);
				setListPost((prevList) => [...prevList, ...res]);
				setPostLength((pre) => pre + res.length);
				if (res.length < 20) {
					setHasMore({ ...hasMore, posts: false });
				} else {
					setHasMore({ ...hasMore, posts: true });
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getNewPost = (data) => {
		setListPost((prevList) => [data, ...prevList]);
		setPostLength((pre) => pre + 1);
	};

	const getPostUpdate = (data, action) => {
		if (action === 'delete') {
			setListPost((prevList) => prevList.filter((item) => item.postId !== data));

			// Check bài share có postId trùng với data thì xóa
			setListPost((prevList) =>
				prevList.filter((item) => !item.postsResponse || item.postsResponse.postId !== data)
			);
			setPostLength((pre) => pre - 1);
		} else if (action === 'update') {
			setListPost((prevList) => prevList.map((item) => (item.postId === data.postId ? data : item)));
		} else if (action === 'create') {
			setListPost((prevList) => [data, ...prevList]);
			setPostLength((pre) => pre + 1);
		}
	};

	const getNewSharePost = (data, action) => {
		if (action === 'delete') {
			setListPost((prevList) => prevList.filter((item) => item.shareId !== data));
			setPostLength((pre) => pre - 1);
		} else if (action === 'update') {
			setListPost((prevList) => prevList.map((item) => (item.shareId === data.shareId ? data : item)));
		} else if (action === 'create') {
			setListPost((prevList) => [data, ...prevList]);
			setPostLength((pre) => pre + 1);
		}
	};

	useEffect(() => {
		isMounted.current = true; // Component đã mounted
		fetchPosts();
		return () => {
			isMounted.current = false; // Component sẽ unmounted
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser]);

	useEffect(() => {
		// Sắp xếp listPost theo updatedAt từ sớm nhất đến muộn nhất
		const sorted = [...listPost].sort((a, b) => new Date(b.updateAt) - new Date(a.updateAt));
		setSortedList(sorted);
		console.log('sorted', sorted);
	}, [listPost]);
	return (
		<>
			<Helmet title="Trang chủ" />
			<div className="feed" style={{ color: theme.foreground, background: theme.background }}>
				<Share inforUser={inforUser} newPosts={getNewPost} postGroupId={null} />
				<InfiniteScroll
					scrollableTarget="messages-history"
					className="feed__scroll"
					style={{ color: theme.foreground, background: theme.background, overflow: 'visible' }}
					dataLength={postLength}
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
					endMessage={
						<Space
							direction="vertical"
							style={{
								color: theme.foreground,
								background: theme.background,
								width: '100%',
								margin: '50px auto',
							}}
							align="center"
						>
							<img className="iamge_end" src={LogoUte} alt="UTEALO" />
							<Typography.Title
								level={4}
								style={{
									color: theme.foreground,
									background: theme.background,
									margin: 0,
								}}
							>
								Mạng xã hội UTEALO
							</Typography.Title>

							<Typography.Text
								type="secondary"
								style={{
									color: theme.foreground,
									background: theme.background,
								}}
							>
								Nơi kết nối, chia sẻ và trao đổi thông tin giữa sinh viên và giảng viên trường Đại học
								Sư phạm Kỹ thuật TP.HCM
							</Typography.Text>
						</Space>
					}
				>
					{sortedList?.map((p) => {
						if (p.postId) {
							return (
								<PostCard
									inforUser={inforUser}
									post={p}
									key={`post-${p.postId}`}
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
		</>
	);
};

export default Feed;
