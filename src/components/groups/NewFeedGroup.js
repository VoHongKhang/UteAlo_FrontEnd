import React, { useEffect, useState } from 'react';
import './NewFeedGroup.css';
import PostCard from '../timeline/post/PostCard';
import useAuth from '../../context/auth/AuthContext';
import useTheme from '../../context/ThemeContext';
import axios from 'axios';
import { BASE_URL } from '../../context/apiCall';
import noCover from '../../assets/appImages/noCover.jpg';
import { Skeleton } from 'antd';

const NewFeedGroup = ({ user }) => {
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
			const res = await axios.get(`${BASE_URL}/v1/groupPost/posts/${currentUser.userId}`, config);
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
		//eslint-disable-next-line
	}, []);

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

	const listImage = [noCover, noCover, noCover, noCover];

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

	return (
		<div className="menu--post">
			<div className="container--group">
				<div className="feed">
					<div className="feedWrapper">
						{visiblePostData.length === 0 ? (
							<>
								<Skeleton
									style={{ marginTop: '30px' }}
									active
									avatar
									paragraph={{
										rows: 4,
									}}
								/>
								<Skeleton
									style={{ marginTop: '30px' }}
									active
									avatar
									paragraph={{
										rows: 4,
									}}
								/>
							</>
						) : (
							visiblePostData.map((p) => <PostCard post={p} key={p.postId} fetchPosts={fetchPosts} />)
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewFeedGroup;
