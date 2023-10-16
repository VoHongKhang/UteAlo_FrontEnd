import { useCallback, useEffect, useState } from 'react';
import FriendApi from '../../api/friends/FriendApi';

export const useFetcher = ({ user, api, limit = 21, params = {}, page }) => {
	const [fetching, setFetching] = useState(false);
	const [fulldata, setFullData] = useState([]);
	const [fitterData, setFitterData] = useState([]);
	const [data, setData] = useState([]);
	const [loadingMore, setLoadingMore] = useState(false);
	const loadMore = () => {
		if (loadingMore || !hasMore) return;
		setLoadingMore(true);
	};

	let hasMore = limit * (page + 1) < fulldata.length;
	const getData = useCallback(async () => {
		setFetching(true);
		try {
			const res = await FriendApi({ user, api });
			// cắt res.result theo limit
			setFullData(res.result);
			setData(res.result.slice(0, limit));
		} catch (error) {
			console.error('Lỗi khi lấy dữ liệu:', error);
		} finally {
			setFetching(false);
		}
	}, [api, user, limit]);

	useEffect(() => {
		getData();
	}, [getData]);

	// xử lý fitter
	useEffect(() => {
		if (Object.keys(params).length !== 0) {
			let content = fulldata?.filter((data) =>
				data.username.toLocaleLowerCase().includes(params.key.toLocaleLowerCase().trim())
			);
			if (content.length > 0) {
				setFitterData(content);
				setData(content.slice(0, limit));
			} else setData([]);
		}
	}, [params]);
	let getPageData = (data, fullData, page, limit) => {
		if (fullData.length > limit * (page + 1))
			setData([...data, ...fullData.slice(limit * page, limit * (page + 1))]);
		else setData([...data, ...fullData.slice(limit * page, fullData.length)]);
	};
	useEffect(() => {
		setLoadingMore(true);
		if (page > 0) {
			if (fitterData.length === 0) {
				getPageData(data, fulldata, page, limit);
			} else {
				getPageData(data, fitterData, page, limit);
			}
		}
		setLoadingMore(false);
	}, [api, user, page]);

	return {
		data,
		params,
		fetching,
		loadingMore,
		hasMore,
		loadMore,
		api,
	};
};
