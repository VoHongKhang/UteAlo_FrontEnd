import { Button, Card, Form, Input, List, Select, Space } from 'antd';
import React, { useRef, useState } from 'react';
import FriendCard from './FriendCard.js';

const ListFriend = ({ api, title = 'Danh sách bạn bè' }) => {
	const handleSearch = (e) => {
		const value = e.target.value;
		if (typingRef.current) clearTimeout(typingRef.current);

		typingRef.current = setTimeout(() => {
			setFilter({ ...filter, key: value });
		}, 300);
	};

	const typingRef = useRef(null);
	const friendFetcher  = {
        fetching: false,
        data: [
			{id:1, name: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/150?img=1'},
			{id:2, name: 'Nguyễn Văn B', avatar: 'https://i.pravatar.cc/150?img=2'}
		],
        hasMore: false,
        loadMore: () => {
            console.log('load more')
        },
        loadingMore: false,

    }
	const [filter, setFilter] = useState({ limit: 9, key: '' });

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
							<FriendCard user={user} />
						</List.Item>
					)}
					loadMore={
						!friendFetcher.fetching &&
						friendFetcher.data.length > 0 && (
							<div style={{ textAlign: 'center', marginTop: 16 }}>
								<Button
									size="small"
									onClick={friendFetcher.loadMore}
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
