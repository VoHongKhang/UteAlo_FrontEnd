import React, { useEffect, useState } from 'react';
import './NewFeedGroup.css';
import PostCard from '../timeline/post/PostCard';
import useAuth from '../../context/auth/AuthContext';
import useTheme from '../../context/ThemeContext';
import axios from 'axios';
import { BASE_URL } from '../../context/apiCall';
import sampleProPic from '../../assets/appImages/user.png';
import Moment from 'react-moment';
import { Link, useParams } from 'react-router-dom';
import { Avatar, Button, Menu } from '@material-ui/core';
import noCover from '../../assets/appImages/noCover.jpg';
import { Add, Search, Public, People, MoreHoriz } from '@material-ui/icons';
const NewFeedGroup = ({ user }) => {
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

			const res = await axios.get(`${BASE_URL}/v1/post/${currentUser.userId}/posts`, config);
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

	return (
		<div className="menu--post">
			<div className="header--group">
				<div className="groupCover" style={{ color: theme.foreground, background: theme.background }}>
					<img className="groupCoverImg" src={user.background || noCover} alt="..." />

					<img className="groupUserImg" src={user.avatar || sampleProPic} alt="..." />
				</div>
				<div className="group--contanier--top">
					<div className="group--detail">
						<span className="group--name">DIỄN ĐÀN SINH VIÊN CÔNG NGHỆ THÔNG TIN</span>
						<div className="group--name-info">
							<Public htmlColor="#65676B" className="group--public-icon" />
							<span className="group--public">Nhóm Công khai</span>
							<People htmlColor="#65676B" className="group--member-icon" />
							<span className="group--member">10 thành viên</span>
						</div>
					</div>
					<div className="group--header--button">
						<button variant="contained" className="group--button-joined">
							<p> Đã tham gia </p>
						</button>
						<button variant="contained" className="group--button-add">
							<p> + Mời</p>
						</button>
						<button variant="contained" className="group--button-more">
							<p> ▼ </p>
						</button>
					</div>
				</div>
				<hr />
				<div className="list--feature--group">
					<ul className="list-feature">
						<li>Thảo luận</li>
						<li>Đáng chú ý</li>
						<li>Phòng họp mặt</li>
						<li>Mọi người</li>
						<li>Sự kiện</li>
						<li>File phương tiện</li>
						<li>File</li>
					</ul>
					<div className="container--search--group">
						<div className="container--search--group-icon">
							<Search />
						</div>
						<div className="container--search--group-more">
							<MoreHoriz />
						</div>
					</div>
				</div>
			</div>
			<div className="container--group">
				<div className="feed" style={{ color: theme.foreground, background: theme.background }}>
					<div className="feedWrapper">
						{visiblePostData.length === 0 ? (
							<h2 style={{ marginTop: '20px' }}>No posts yet!</h2>
						) : (
							visiblePostData.map((p) => <PostCard post={p} key={p.postId} fetchPosts={fetchPosts} />)
						)}
					</div>
				</div>
				<div className="rightbar--group"></div>
			</div>
		</div>
	);
};

export default NewFeedGroup;
