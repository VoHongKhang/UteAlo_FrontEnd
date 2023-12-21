import React, { useEffect, useRef, useState } from 'react';
import './Feed.css';
import PostCard from '../post/PostCard';
import SharePostCard from '../post/SharePostCard';
import Share from '../sharePost/Share';
import useAuth from '../../../context/auth/AuthContext';
import useTheme from '../../../context/ThemeContext';
import { Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostApi from '../../../api/timeline/post/PostApi';

const FeedOfUser = ({ inforUser, userProfile }) => {
	console.log('userProfile', userProfile);
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
					hasMore.posts && PostApi.getPostUserInProfile(currentUser, userProfile, newPage, 20),
					hasMore.share && PostApi.getShareUserInProfile(currentUser, userProfile, newPage, 20),
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
				PostApi.getPostUserInProfile(currentUser, userProfile, page, 20),
				PostApi.getShareUserInProfile(currentUser, userProfile, page, 20),
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
			setListPost([]); // Component sẽ unmounted
			isMounted.current = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userProfile, currentUser]);

	useEffect(() => {
		// Sắp xếp listPost theo updatedAt từ sớm nhất đến muộn nhất
		const sorted = [...listPost].sort((a, b) => new Date(b.updateAt) - new Date(a.updateAt));
		setSortedList(sorted);
		console.log('sorted', sorted);
	}, [listPost]);

	useEffect(() => {
		console.log('listPost', listPost);
		console.log(postLength);
		console.log('hasMore', hasMore);
	}, [hasMore, postLength, listPost]);
	return (
		<div className="feed" style={{ color: theme.foreground, background: theme.background }}>
			{userProfile === inforUser?.userId && <Share inforUser={inforUser} newPosts={getNewPost} />}
			<div className="feedUser">
				<InfiniteScroll
					scrollableTarget="messages-history"
					dataLength={postLength}
					style={{ overflow: 'visible' }}
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
	);
};

export default FeedOfUser;
