import React, { useEffect, useState } from 'react';
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
const Feed = ({ inforUser }) => {
	const { user: currentUser } = useAuth();
	const [posts, setPosts] = useState(new Map());
	const { theme } = useTheme();
	const [hasMore, setHasMore] = useState({
		posts: false,
		share: false,
	});
	const [page, setPage] = useState(0);
	const [postLength, setPostLength] = useState(0);

	const loadMore = () => {
		const newPage = page + 1;
		setPage(newPage);
		if (hasMore.posts) {
			const res = PostApi.fetchPostsGroup(currentUser, newPage, 20);
			if (res) {
				posts.set('post', [...posts.get('post'), ...res]);
				setPostLength((pre) => pre + res.length);
				if (res.length < 20) {
					setHasMore({ ...hasMore, posts: false });
				} else {
					setHasMore({ ...hasMore, posts: true });
				}
				setPosts(new Map(posts.entries()));
			}
		} else if (hasMore.share) {
			const response = PostApi.fetchPostsShare(currentUser, newPage, 20);
			if (response) {
				posts.set('share', [...posts.get('share'), ...response]);
				setPostLength((pre) => pre + response.length);
				if (response.length < 20) {
					setHasMore({ ...hasMore, share: false });
				} else {
					setHasMore({ ...hasMore, share: true });
				}
				setPosts(new Map(posts.entries()));
			}
		}
	};
	// Lấy danh sách bài post
	const fetchPosts = async () => {
		try {
			const res = await PostApi.fetchPostsGroup(currentUser, page, 20);
			const response = await PostApi.fetchPostsShare(currentUser, page, 20);
			console.log('res', res);
			console.log('response', response);
			console.log('length', response.length);
			if (response) {
				posts.set('share', response);
				setPostLength((pre) => pre + response.length);
				if (response.length < 20) {
					setHasMore({ ...hasMore, share: false });
				} else {
					setHasMore({ ...hasMore, share: true });
				}
				setPosts(new Map(posts.entries()));
			}

			if (res) {
				posts.set('post', res);
				setPostLength((pre) => pre + res.length);
				if (res.length < 20) {
					setHasMore({ ...hasMore, posts: false });
				} else {
					setHasMore({ ...hasMore, posts: true });
				}
				setPosts(new Map(posts.entries()));
			}
		} catch (error) {
			console.log(error);
		}
	};
	const getNewPost = (data) => {
		posts.set('post', [data, ...posts.get('post')]);
		setPostLength((pre) => pre + 1);
		setPosts(new Map(posts.entries()));
	};
	const getPostUpdate = (data, action) => {
		if (action === 'delete') {
			console.log('data', data);
			posts.set(
				'post',
				posts.get('post').filter((item) => item.postId !== data)
			);

			//check bài share có postId trùng với data thì xóa
			posts.set(
				'share',
				posts.get('share').filter((item) => item.postsResponse.postId !== data)
			);
			setPostLength((pre) => pre - 1);
			setPosts(new Map(posts.entries()));
			return;
		} else if (action === 'update') {
			posts.set(
				'post',
				posts.get('post').map((item) => {
					if (item.postId === data.postId) {
						return data;
					}
					return item;
				})
			);
			setPosts(new Map(posts.entries()));
			return;
		} else if (action === 'create') {
			posts.set('share', [data, ...posts.get('share')]);
			setPostLength((pre) => pre + 1);
			setPosts(new Map(posts.entries()));
		} else {
			console.log('data', data);
		}
	};
	const getNewSharePost = (data, action) => {
		if (action === 'delete') {
			posts.set(
				'share',
				posts.get('share').filter((item) => item.shareId !== data)
			);
			setPostLength((pre) => pre - 1);
			setPosts(new Map(posts.entries()));
			return;
		} else if (action === 'update') {
			posts.set(
				'share',
				posts.get('share').map((item) => {
					if (item.shareId === data.shareId) {
						return data;
					}
					return item;
				})
			);
			setPosts(new Map(posts.entries()));
			return;
		} else if (action === 'create') {
			posts.set('share', [data, ...posts.get('share')]);
			setPostLength((pre) => pre + 1);
			setPosts(new Map(posts.entries()));
		} else {
			console.log('data', data);
		}
	};
	useEffect(() => {
		fetchPosts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser]);
	useEffect(() => {
		console.log('posts', posts);
		console.log(postLength);
		console.log('hasMore', hasMore);
	}, [hasMore, postLength, posts]);
	return (
		<div className="feed" style={{ color: theme.foreground, background: theme.background }}>
			<div className="feedWrapper">
				{/* {(!params.userId || params.userId === currentUser.userId) && ( */}
				<Share inforUser={inforUser} newPosts={getNewPost} />
				{/* )} */}
				<InfiniteScroll
					scrollableTarget="messages-history"
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
							style={{ width: 'fit-content', margin: '50px auto' }}
							align="center"
						>
							<img className="iamge_end" src={LogoUte} alt="UTEALO" />
							<Typography.Title level={4} style={{ margin: 0 }}>
								Mạng xã hội UTEALO
							</Typography.Title>

							<Typography.Text type="secondary">
								Nơi kết nối, chia sẻ và trao đổi thông tin giữa sinh viên và giảng viên trường Đại học
								Sư phạm Kỹ thuật TP.HCM
							</Typography.Text>
						</Space>
					}
				>
					{posts.get('post')?.map((p) => (
						<PostCard inforUser={inforUser} post={p} key={p.postId} newShare={getPostUpdate} />
					))}
					{posts.get('share')?.map((p) => (
						<SharePostCard
							inforUser={inforUser}
							share={p}
							key={p.shareId}
							newSharePosts={getNewSharePost}
						/>
					))}
				</InfiniteScroll>
			</div>
		</div>
	);
};

export default Feed;
