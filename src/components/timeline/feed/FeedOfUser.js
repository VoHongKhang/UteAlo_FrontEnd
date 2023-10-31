import React, { useEffect, useState } from 'react';
import './Feed.css';
import { useParams } from 'react-router-dom';
import PostCard from '../post/PostCard';
import Share from '../sharePost/Share';
import SharePostCard from '../post/SharePostCard';
import useAuth from '../../../context/auth/AuthContext';
import useTheme from '../../../context/ThemeContext';
import axios from 'axios';
import { BASE_URL } from '../../../context/apiCall';

const FeedOfUser = () => {
	const params = useParams();
	const { user: currentUser } = useAuth();
	const [posts, setPosts] = useState([]);
	const [sharePosts, setSharePosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [visiblePosts, setVisiblePosts] = useState(3); // Số lượng bài viết hiển thị ban đầu
	const { theme } = useTheme();

	// Lấy danh sách bài post
	const fetchPosts = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			setLoading(true);

			const res = await axios.get(`${BASE_URL}/v1/post/${currentUser.userId}/post`, config);
			setLoading(false);
			setPosts(res.data.result);
		} catch (error) {
			console.log(error);
		}
	};

	// Lấy danh sách các bài share post
	const fetchSharePosts = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};
			setLoading(true);

			const res = await axios.get(`${BASE_URL}/v1/share/${currentUser.userId}/posts`, config);
			setLoading(false);
			setSharePosts(res.data.result);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchPosts();
		fetchSharePosts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser.userId, currentUser.accessToken]);

	// Xử lý nạp thêm bài viết khi cuộn xuống
	useEffect(() => {
		const handleScroll = () => {
			if (window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 100) {
				// Khi cuộn xuống gần cuối trang (khoảng cách 100 pixel)
				setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 3); // Nạp thêm 5 bài viết
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const visiblePostData = posts.slice(0, visiblePosts);

	return (
		<div className="feed" style={{ color: theme.foreground, background: theme.background }}>
			<div className="feedWrapper">
				{(!params.userId || params.userId === currentUser.userId) && <Share fetchPosts={fetchPosts} postGroupId={null}/>}

				{visiblePostData.length === 0 ? (
					<h2 style={{ marginTop: '20px' }}>Chưa có bài viết!</h2>
				) : (
					visiblePostData.map((p) => <PostCard post={p} key={p.postId} fetchPosts={fetchPosts} />)
				)}

				{sharePosts.map((p) => (
					<SharePostCard share={p} key={p.shareId} fetchSharePosts={fetchSharePosts} />
				))}
			</div>
		</div>
	);
};

export default FeedOfUser;
