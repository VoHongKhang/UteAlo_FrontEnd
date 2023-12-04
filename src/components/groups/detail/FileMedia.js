import { Card, Image, List } from 'antd';
import { useNavigate } from 'react-router-dom';
import useTheme from '../../../context/ThemeContext';

export default function FileMedia(params) {
	const navigate = useNavigate();
	const data = [
		{
			title: 'File 1',
			imageUrl: 'https://picsum.photos/200/300',
		},
		{
			title: 'File 2',
			imageUrl: 'https://picsum.photos/200/300',
		},
		{
			title: 'File 3',
			imageUrl: 'https://picsum.photos/200/300',
		},
		{
			title: 'File 4',
			imageUrl: 'https://picsum.photos/200/300',
		},
		{
			title: 'File 5',
			imageUrl: 'https://picsum.photos/200/300',
		},
		{
			title: 'File 6',
			imageUrl: 'https://picsum.photos/200/300',
		},
		{
			title: 'File 7',
			imageUrl: 'https://picsum.photos/200/300',
		},
		{
			title: 'File 8',
			imageUrl: 'https://picsum.photos/200/300',
		},
		{
			title: 'File 9',
			imageUrl: 'https://picsum.photos/200/300',
		},
		{
			title: 'File 10',
			imageUrl: 'https://picsum.photos/200/300',
		},
		// Thêm các phần tử khác tùy ý
	];
	const { theme } = useTheme();
	return (
		//List file media
		<List
			grid={{ gutter: 16, column: 3 }}
			dataSource={data}
			renderItem={(item) => (
				<List.Item style={{ color: theme.foreground, background: theme.background }}>
					<Card
						style={{ color: theme.foreground, background: theme.background }}
						title={
							<div
								style={{ cursor: 'pointer', color: theme.foreground, background: theme.background }}
								onClick={() => navigate(`/post/${item.postId}`)}
							>
								{item.title}
							</div>
						}
					>
						<Image
							width={280}
							height={280}
							src={item.imageUrl}
							alt="image"
							style={{ objectFit: 'cover' }}
						/>
					</Card>
				</List.Item>
			)}
		/>
	);
}
