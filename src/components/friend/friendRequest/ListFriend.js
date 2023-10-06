import { Button, Card, Form, Input, List, Select, Space } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import FriendCard from './FriendCard.js';
import { useFetcher } from '../../action/userFetcher.js';

const ListFriend = ({currentUser, type, title = 'Danh sách bạn bè' }) => {
	
	const [filter, setFilter] = useState({ sort: 'desc', gender: '' });
	const typingRef = useRef(null);
	const [loadingMore, setLoadingMore] = useState(false);
	const [more, setMore] = useState(0);
	const [data, setData] = useState([]);
	const loadMore = () => {
		if (loadingMore) return;
		setLoadingMore(true);
		setMore(more + 1);
		setData(data.concat(friendFetcher.data));
		setLoadingMore(false);
	};
	const handleSearch = (e) => {
		const value = e.target.value;
		if (typingRef.current) clearTimeout(typingRef.current);

		typingRef.current = setTimeout(() => {
			setFilter({ ...filter, key: value });
		}, 300);
	};
	useEffect(() => {
		console.log(filter);
		// call api get friend list

	}, [filter]);

	const friendFetcher = useFetcher({currentUser: currentUser ,api: type, params: filter ,limit: 2,page: more});
	useEffect(() => {
		setData(friendFetcher.data);
	}, [friendFetcher.data]);
	console.log("Data",friendFetcher.data);
	console.log("update Data",friendFetcher.updateData);
	console.log(friendFetcher.hasMore);
	return (
		<Card title={title} headStyle={{ padding: '0 16px' }} bodyStyle={{ padding: 8 }}>
			<Space direction="vertical" style={{ width: '100%' }}>
				<Input.Search placeholder="Tìm kiếm bạn bè" onChange={handleSearch} />

				<Form
					layout="inline"
					style={{ float: 'right' }}
					size="small"
					initialValues={{ sort: 'desc', gender: '' }}
					onValuesChange={(_, values) => setFilter({ ...filter, ...values })}
				>
					<Form.Item label="Sắp xếp" name="sort">
						<Select
							options={[
								{ label: 'Mới nhất', value: 'desc' },
								{ label: 'Cũ nhất', value: 'asc' },
							]}
							showSearch={false}
							style={{ width: 120 }}
						/>
					</Form.Item>

					<Form.Item label="Giới tính" name="gender">
						<Select
							options={[
								{ label: 'Tất cả', value: '' },
								{ label: 'Nam', value: 'male' },
								{ label: 'Nữ', value: 'female' },
								{ label: 'Khác', value: 'other' },
							]}
							showSearch={false}
							style={{ width: 120 }}
						/>
					</Form.Item>
				</Form>

				<List
					itemLayout="horizontal"
					dataSource={friendFetcher.data}
					loading={friendFetcher.fetching}
					grid={{ gutter: 16, column: 3 }}
					renderItem={(user) => (
						<List.Item>
							<FriendCard user={user} type={type} />
						</List.Item>
					)}
					loadMore={
						!friendFetcher.fetching &&
						friendFetcher.data.length > 0 && (
							<div style={{ textAlign: 'center', marginTop: 16 }}>
								<Button
									size="small"
									onClick={loadMore}
									loading={loadingMore}
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
