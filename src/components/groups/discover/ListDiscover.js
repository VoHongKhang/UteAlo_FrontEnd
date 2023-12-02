import { Button, Card, Input, List, Space } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import GroupCard from './GroupCard.js';
import { useFetcher } from '../../../components/action/groupFetcher.js';

const ListDiscover = ({ currentUser, type, title = 'Danh sách nhóm' }) => {
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
	}, [type, currentUser,filter]);

	return (
		<Card title={title} headStyle={{ padding: '0 16px' }} bodyStyle={{ padding: 8 }}>
			<Space direction="vertical" style={{ width: '100%' }}>
				<Input.Search placeholder="Tìm kiếm" onChange={handleSearch} />

				<List
					itemLayout="horizontal"
					dataSource={friendFetcher.data}
					loading={friendFetcher.fetching}
					grid={{ gutter: 16, column: 2 }}
					renderItem={(user) => (
						<List.Item>
							<GroupCard user={user} type={type} />
						</List.Item>
					)}
					loadMore={
						!friendFetcher.fetching &&
						friendFetcher.data.length > 0 && (
							<div style={{ textAlign: 'center', marginTop: 16 }}>
								<Button
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
export default ListDiscover;
