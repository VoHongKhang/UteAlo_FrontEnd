import { Button, Card, Input, List, Space } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import FriendCard from './FriendCard.js';
import { useFetcher } from '../../action/userFetcher.js';
import useTheme from '../../../context/ThemeContext.js';

const ListFriend = ({ inforUser, currentUser, type, title = 'Danh sách bạn bè' }) => {
	const [filter, setFilter] = useState();
	const typingRef = useRef(null);
	const [more, setMore] = useState(0);
	const friendFetcher = useFetcher({ user: currentUser, api: type, params: filter, limit: 5, page: more });

	const loadMore = () => {
		if (friendFetcher.loadingMore) return;
		setMore(more + 1);
	};
	const handleSearch = (e) => {
		const value = e.target.value;
		if (typingRef.current) clearTimeout(typingRef.current);

		typingRef.current = setTimeout(() => {
			setFilter({ ...filter, key: value });
		}, 300);
	};

	useEffect(() => {
		setMore(0);
	}, [type, currentUser, filter]);
	const { theme } = useTheme();
	return (
		<Card
			title={<span style={{ color: theme.foreground, background: theme.background }}>{title}</span>}
			headStyle={{ padding: '0 16px' }}
			bodyStyle={{ padding: 8 }}
			style={{ color: theme.foreground, background: theme.background }}
		>
			<Space direction="vertical" style={{ width: '100%' }}>
				<Input.Search
					style={{ color: theme.foreground, background: theme.background }}
					placeholder="Tìm kiếm bạn bè"
					onChange={handleSearch}
				/>

				<List
					itemLayout="horizontal"
					dataSource={friendFetcher.data}
					loading={friendFetcher.fetching}
					grid={{ gutter: 16, column: 3 }}
					renderItem={(user) => (
						<List.Item>
							<FriendCard inforUser={inforUser} user={user} type={type} />
						</List.Item>
					)}
					loadMore={
						!friendFetcher.fetching &&
						friendFetcher.data.length > 0 && (
							<div style={{ textAlign: 'center', marginTop: 16 }}>
								<Button
									style={{ color: theme.foreground, background: theme.background }}
									size="small"
									onClick={loadMore}
									loading={friendFetcher.loadingMore}
									disabled={!friendFetcher.hasMore}
								>
									{friendFetcher.hasMore ? 'Xem thêm' : 'Hết rồi'}
								</Button>
							</div>
						)
					}
				/>
			</Space>
		</Card>
	);
};
export default ListFriend;
