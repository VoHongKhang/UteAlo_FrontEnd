import { Button, Card, Image, List } from 'antd';
import { useNavigate } from 'react-router-dom';
import useTheme from '../../../context/ThemeContext';
import { useEffect, useState } from 'react';
import { postDetail } from '../../../api/postGroups/postDetail';

export default function FileMedia({ groupId, listPost }) {
	const navigate = useNavigate();
	const [page, setPage] = useState(0);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const handleNextPhoto = () => {
		setPage((pre) => pre + 1);
	};
	useEffect(() => {
		const fetch = async () => {
			setLoading(true);
			const res = await postDetail.getFileMediaById(groupId, page, 10);
			setLoading(false);
			setHasMore(page <= res.data.totalPages ? false : true);

			console.log('res', res);
			setData([...data, ...res.data.content]);
		};
		fetch();
	}, [groupId, page]);
	useEffect(() => {
		const fetch = async () => {
			setLoading(true);
			const res = await postDetail.getFileMediaById(groupId, 0, 10);
			setLoading(false);
			setHasMore(page <= res.data.totalPages ? false : true);

			console.log('res', res);
			setData([...res.data.content]);
		};
		fetch();
	}, [groupId, listPost]);
	const { theme } = useTheme();
	return (
		//List file media
		<List
			grid={{ gutter: 16, column: 3 }}
			dataSource={data}
			loadMore={
				<div
					style={{
						textAlign: 'center',
						marginTop: 12,
						height: 32,
						lineHeight: '32px',
						marginBottom: 12,
					}}
				>
					<Button disabled={!hasMore} type="primary" onClick={handleNextPhoto} loading={loading}>
						Xem thêm
					</Button>
				</div>
			}
			renderItem={(item) => (
				<List.Item style={{ color: theme.foreground, background: theme.background }}>
					<Card
						style={{ color: theme.foreground, background: theme.background }}
						title={
							<div
								style={{ cursor: 'pointer', color: theme.foreground, background: theme.background }}
								onClick={() => navigate(`/post/${item.postId}`)}
							>
								{item.userName}
							</div>
						}
					>
						<Image width={280} height={280} src={item.photos} alt="image" style={{ objectFit: 'cover' }} />
					</Card>
				</List.Item>
			)}
		/>
	);
}
