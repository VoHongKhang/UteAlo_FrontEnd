
import { useCallback, useEffect, useState } from 'react';
import FriendApi from '../../api/friends/FriendApi';

export const useFetcher = ({ currentUser, api, limit = 20, params = {}, page }) => {
	const [data, setData] = useState([]);
	const [fetching,setFetching] = useState(false);
	useEffect(() => {
		const getData = async () => {
			setFetching(true);
			await FriendApi({ currentUser, api, limit, page }).then((res) => {
				setFetching(false);
				setData(res.result);
			});
		};
		getData();
	}, [limit, api, page]);
	const hasMore = params.sizePage < data.length;
	const addData = (newData) => setData((prevData) => [newData, ...prevData]);

	const updateData = (id, newData) =>
		setData((prevData) => prevData.map((item) => (item.id === id ? newData : item)));

	const removeData = (id) => setData((prevData) => prevData.filter((item) => item.id !== id));

	const [loadingMore, setLoadingMore] = useState(false);
	const loadMore = () => {
		if (loadingMore || !hasMore) return;
		setLoadingMore(true);
	};

	return {
		data,
		params,
		fetching,
		loadingMore,
		hasMore,
		loadMore,
		addData,
		updateData,
		removeData,
		api,
	};
};

