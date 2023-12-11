import { Helmet } from 'react-helmet';
import toast from 'react-hot-toast';
import useAuth from '../../../context/auth/AuthContext';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useTheme from '../../../context/ThemeContext';
import Share from '../../../api/share/ShareApi';
import SharePostCard from '../post/SharePostCard';
export default function ShareDetail({ inforUser }) {
	const { theme } = useTheme();
	const navigate = useNavigate();
	const { user: currentUser } = useAuth();
	const [share, setShare] = useState();

	const getNewSharePost = (data, action) => {
		if (action === 'delete') {
			navigate('/');
		} else if (action === 'update') {
			setShare(data);
		}
	};

	const params = useParams();
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await Share.findById({ user: currentUser, shareId: params.shareId });
				setShare(res);
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
					{share && <SharePostCard inforUser={inforUser} share={share} newSharePosts={getNewSharePost} />}
				</div>
			</div>
		</>
	);
}
