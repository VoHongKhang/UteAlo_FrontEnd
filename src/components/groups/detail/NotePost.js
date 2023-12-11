import InfiniteScroll from 'react-infinite-scroll-component';
import PostCard from '../../timeline/post/PostCard';
import { Skeleton } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { postDetail } from '../../../api/postGroups/postDetail';
import useTheme from '../../../context/ThemeContext';

export default function NotePost({ postGroup, inforUser, currentUser }) {
	const isMounted = useRef(true);
	const [postLength, setPostLength] = useState(0);
	const [hasMore, setHasMore] = useState(false);
	const [page, setPage] = useState(0);
	const [listPost, setListPost] = useState([]);
	const [sortedList, setSortedList] = useState([]);
	const loadMore = async () => {
		const newPage = page + 1;
		setPage(newPage);

		try {
			if (isMounted.current && hasMore) {
				const res = await postDetail.getListPostNoteById(postGroup.postGroupId, newPage, 20);
				if (res) {
					console.log('res', res);
					setListPost((prevList) => [...prevList, ...res]);
					setPostLength((prevLength) => prevLength + res.length);

					if (res.length < 20) {
						setHasMore(false);
					} else {
						setHasMore(true);
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	};
	const fetchPosts = async () => {
		console.log('fetchPosts');
		try {
			const res = await postDetail.getListPostNoteById(postGroup.postGroupId, page, 20);
			if (res != 'No posts found for admin of this group') {
				console.log('res', res);
				setListPost((prevList) => [...prevList, ...res]);
				setPostLength((pre) => pre + res.length);
				if (res.length < 20) {
					setHasMore(false);
				} else {
					setHasMore(true);
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
	useEffect(() => {
		isMounted.current = true; // Component đã mounted
		fetchPosts();
		return () => {
			setListPost([]); // Component sẽ unmounted
			isMounted.current = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [postGroup]);

	useEffect(() => {
		// Sắp xếp listPost theo updatedAt từ sớm nhất đến muộn nhất
		const sorted = [...listPost].sort((a, b) => new Date(b.updateAt) - new Date(a.updateAt));
		setSortedList(sorted);
		console.log('sorted', sorted);
		return () => {
			setSortedList([]);
		};
	}, [listPost]);
	const { theme } = useTheme();
	return (
		<div className="container--group" style={{ color: theme.foreground, background: theme.background }}>
			{(postGroup.roleGroup === 'Waiting Accept' ||
				postGroup.roleGroup === 'Accept Invited' ||
				postGroup.roleGroup === 'None') &&
			postGroup.groupType === 'Private' ? (
				<div></div>
			) : (
				<div className="feed--note" style={{ color: theme.foreground, background: theme.background }}>
					<div className="feed--note-feedWrapper" id="feed--group--scroll">
						<InfiniteScroll
							scrollableTarget="feed--group--scroll"
							className="feed__scroll"
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
						>
							{sortedList.length > 0 &&
								sortedList?.map((p) => {
									return (
										<PostCard
											inforUser={inforUser}
											post={p}
											key={`post-${p.postId}`}
											group={postGroup}
											newShare={getPostUpdate}
										/>
									);
								})}
						</InfiniteScroll>
					</div>
				</div>
			)}
		</div>
	);
}
