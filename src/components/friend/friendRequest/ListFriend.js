import { Button, Card, Form, Input, List, Select, Space } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import FriendCard from './FriendCard.js';
import { useSWRFetcher,useFetcher } from '../../action/userFetcher.js';

const ListFriend = ({ type, title = 'Danh sách bạn bè' }) => {
	const list = [
		{
			id: 1,
			name: 'Nguyễn Văn A',
			avatar: 'https://i.pravatar.cc/150?img=1',
			background: 'https://i.pravatar.cc/150?img=7',
		},
		{
			id: 2,
			name: 'Nguyễn Văn B',
			avatar: 'https://i.pravatar.cc/150?img=2',
			background: 'https://i.pravatar.cc/150?img=8',
		},
		{
			id: 3,
			name: 'Nguyễn Văn C',
			avatar: 'https://i.pravatar.cc/150?img=3',
			background: 'https://i.pravatar.cc/150?img=9',
		},
	];
	const listrequest = [
		{
			id: 1,
			name: 'Nguyễn Văn C',
			avatar: 'https://i.pravatar.cc/150?img=3',
			background: 'https://i.pravatar.cc/150?img=9',
		},
		{
			id: 2,
			name: 'Nguyễn Văn D',
			avatar: 'https://i.pravatar.cc/150?img=4',
			background: 'https://i.pravatar.cc/150?img=10',
		},
		{
			id: 3,
			name: 'Nguyễn Văn E',
			avatar: 'https://i.pravatar.cc/150?img=5',
			background: 'https://i.pravatar.cc/150?img=11',
		},
	];
	const listsent = [
		{
			id: 1,
			name: 'Nguyễn Văn E',
			avatar: 'https://i.pravatar.cc/150?img=5',
			background: 'https://i.pravatar.cc/150?img=11',
		},
		{
			id: 2,
			name: 'Nguyễn Văn F',
			avatar: 'https://i.pravatar.cc/150?img=6',
			background: 'https://i.pravatar.cc/150?img=12',
		},
		{
			id: 3,
			name: 'Nguyễn Văn G',
			avatar: 'https://i.pravatar.cc/150?img=7',
			background: 'https://i.pravatar.cc/150?img=13',
		},
	];
	const listsuggest = [
		{
			id: 1,
			name: 'Nguyễn Văn G',
			avatar: 'https://i.pravatar.cc/150?img=7',
			background: 'https://i.pravatar.cc/150?img=13',
		},
		{
			id: 2,
			name: 'Nguyễn Văn H',
			avatar: 'https://i.pravatar.cc/150?img=8',
			background: 'https://i.pravatar.cc/150?img=14',
		},
		{
			id: 3,
			name: 'Nguyễn Văn I',
			avatar: 'https://i.pravatar.cc/150?img=9',
			background: 'https://i.pravatar.cc/150?img=15',
		},
	];

	const [filter, setFilter] = useState({ sort: 'desc', gender: '' });
	const [friendList, setFriendList] = useState(list);
	useEffect(() => {
		switch (type) {
			case 'request':
				setFriendList(listrequest);
				break;
			case 'sent':
				setFriendList(listsent);
				break;
			case 'suggest':
				setFriendList(listsuggest);
				break;
			default:
				setFriendList(list);
				break;
		}
	}, [type]);
	const [loadingMore, setLoadingMore] = useState(false);
	const typingRef = useRef(null);
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

	const friendFetcher = {
		fetching: false,
		data: friendList,
		hasMore: true,
		loadMore: () => {
			console.log('load more');
			setLoadingMore(true);
			setTimeout(() => {
				setLoadingMore(false);
				setFriendList([...friendList, ...friendList]);
			}, 4000);
		},
		loadingMore: loadingMore,
	};
	//const friendFetcher = useFetcher({ api: '/user/friend', params: filter ,limit: 9});
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
