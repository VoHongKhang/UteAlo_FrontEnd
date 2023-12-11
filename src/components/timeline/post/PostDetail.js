import { Helmet } from 'react-helmet';
import toast, { Toaster } from 'react-hot-toast';
import Topbar from '../topbar/Topbar';
import Sidebar from '../sidebar/Sidebar';
import Rightbar from '../rightbar/Rightbar';
import PostCard from './PostCard';
import useAuth from '../../../context/auth/AuthContext';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostApi from '../../../api/timeline/post/PostApi';
import { useNavigate } from 'react-router-dom';
import useTheme from '../../../context/ThemeContext';
export default function PostDetail({ inforUser }) {
	const { theme } = useTheme();
	const navigate = useNavigate();
	const { user: currentUser } = useAuth();
	const [post, setPost] = useState();

	const getPostUpdate = (data, action) => {
		console.log('data', data);
		if (action === 'delete') {
			navigate('/');
		} else if (action === 'update') {
			setPost(data);
		}
	};
	const params = useParams();
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await PostApi.findById({ user: currentUser, postId: params.postId });
				setPost(res);
			} catch (error) {
				console.log(error);
				toast.error(error.message);
			}
		};
		fetchData();
	}, [currentUser, params]);
	return (
		<>
			<Helmet title="Chi tiết bài viết" />
			<div className="feed" style={{ color: theme.foreground, background: theme.background }}>
				<div className="feedWrapper">
					{post && <PostCard inforUser={inforUser} post={post} newShare={getPostUpdate} modalDetail={3} />}
				</div>
			</div>
		</>
	);
}
