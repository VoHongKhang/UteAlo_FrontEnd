import React, { useEffect, useRef, useState } from 'react';
import './NewFeedGroup.css';
import PostCard from '../timeline/post/PostCard';
import useTheme from '../../context/ThemeContext';
import { Skeleton, Space } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import SharePostCard from '../timeline/post/SharePostCard';
import PostApi from '../../api/timeline/post/PostApi';
import { Helmet } from 'react-helmet';

const NewFeedGroup = ({ inforUser, currentUser }) => {
	const isMounted = useRef(true);

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
					hasMore.posts && PostApi.getPostInAllGroup({ user: currentUser, page: newPage, size: 20 }),
					hasMore.share && PostApi.getShareInAllGroup({ user: currentUser, page: newPage, size: 20 }),
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
				PostApi.getPostInAllGroup({ user: currentUser, page: page, size: 20 }),
				PostApi.getShareInAllGroup({ user: currentUser, page: page, size: 20 }),
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
		}
	};

	const getNewSharePost = (data, action) => {
		if (action === 'delete') {
			setListPost((prevList) => prevList.filter((item) => item.shareId !== data));
			setPostLength((pre) => pre - 1);
		} else if (action === 'update') {
			setListPost((prevList) => prevList.map((item) => (item.shareId === data.shareId ? data : item)));
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
			<Helmet title="Nhóm của bạn" />
			<div className="feed" style={{ color: theme.foreground, background: theme.background }}>
				<div className="feedWrapper">
					<InfiniteScroll
						scrollableTarget="feed"
						dataLength={postLength}
						style={{ color: theme.foreground, background: theme.background, overflow: 'visible' }}
						className="feed__scroll"
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
								style={{ width: '100%', textAlign: 'center', marginBottom: '20px' }}
							>
								<h3>Yay! You have seen it all</h3>
							</Space>
						}
					>
						{inforUser && currentUser && (
							<>
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
							</>
						)}
					</InfiniteScroll>
				</div>
			</div>
		</>
	);
};

export default NewFeedGroup;
