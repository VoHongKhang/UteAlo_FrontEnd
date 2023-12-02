import React, { useEffect, useState } from 'react';
import { Button, List } from 'antd';
import sampleProPic from '../../assets/appImages/user.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../context/apiCall';
const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;
const ListPhoto = ({ currentUser, params }) => {
	const navigate = useNavigate();
	const [initLoading, setInitLoading] = useState(true);
	const [loading, setLoading] = useState(false);
	const [list, setList] = useState([]);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(false);
	useEffect(() => {
		const fetchPhotosOfUser = async () => {
			try {
				const config = {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${currentUser.accessToken}`,
					},
				};

				const res = await axios.get(
					`${BASE_URL}/v1/post/getPhotos/${params.userId}?page=${page}&size=${6}`,
					config
				);
				// Lấy danh sách ảnh từ kết quả và đặt vào state
				setList(res.data.result);
				setInitLoading(false);
				if (res.data.result.length < 6) {
					setHasMore(false);
				} else {
					setHasMore(true);
				}
			} catch (error) {
				console.error('Lỗi khi lấy danh sách ảnh:', error);
			}
		};
		fetchPhotosOfUser();
	}, [currentUser.accessToken, params.userId]);
	const onLoadMore = async () => {
		setLoading(true);
		const newPage = page + 1;
		setPage(newPage);
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${currentUser.accessToken}`,
				},
			};

			const res = await axios.get(
				`${BASE_URL}/v1/post/getPhotos/${params.userId}?page=${newPage}&size=${6}`,
				config
			);
			// Lấy danh sách ảnh từ kết quả và đặt vào state
			setList(list.concat(res.data.result));
			setInitLoading(false);
			setLoading(false);
			if (res.data.result.length < 6) {
				setHasMore(false);
			} else {
				setHasMore(true);
			}
		} catch (error) {
			console.error('Lỗi khi lấy danh sách ảnh:', error);
		}
	};
	const loadMore =
		hasMore && !initLoading && !loading ? (
			<div
				style={{
					textAlign: 'center',
					marginTop: 12,
					height: 32,
					lineHeight: '32px',
				}}
			>
				<Button onClick={onLoadMore}>loading more</Button>
			</div>
		) : null;
	return (
		<List
			grid={{ gutter: 12, column: 3 }}
			dataSource={list}
			loading={initLoading}
			loadMore={loadMore}
			renderItem={(item) => (
				<List.Item className="list--photo--item">
					<img
						src={item.photos || sampleProPic}
						alt="photos"
						onClick={() => navigate(`/post/${item.postId}`)}
					/>
				</List.Item>
			)}
		/>
	);
};
export default ListPhoto;
