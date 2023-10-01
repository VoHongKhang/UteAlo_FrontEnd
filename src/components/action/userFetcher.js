import { useCallback, useEffect, useState } from 'react';
export const useFetcher = ({ api, limit = 20, params = {} }) => {
	// const getKey = useCallback(
	// 	(pageIndex, prevData) => {
	// 		if (pageIndex === 0) return urlUtil.generateUrl(api, { ...params, size: limit });

	// 		const prevOffset = Number(prevData?.offset) || 0;
	// 		const prevItems = prevData?.items || [];
	// 		if (prevOffset + prevItems.length >= prevData.totalItems) return null; // No more data

	// 		const offset = prevOffset + prevItems.length;
	// 		return urlUtil.generateUrl(api, { ...params, offset, size: limit });
	// 	},
	// 	[limit, api, params]
	//);
    const getKey = "";
	const lastRes = listRes?.[listRes.length - 1];
	const hasMore = !!lastRes && page < lastRes.totalPages;

	const resData = listRes?.flatMap((res) => res.items) || [];
	const [data, setData] = useState(resData);
	useEffect(() => {
		if (!validating) {
			const isSame =
				data.length === resData.length &&
				resData.every((item, index) => JSON.stringify(item) === JSON.stringify(data[index]));
			if (!isSame) setData(resData);
		}
	}, [validating]);

	const addData = (newData) => setData((prevData) => [newData, ...prevData]);

	const updateData = (id, newData) =>
		setData((prevData) => prevData.map((item) => (item.id === id ? newData : item)));

	const removeData = (id) => setData((prevData) => prevData.filter((item) => item.id !== id));

	const [loadingMore, setLoadingMore] = useState(false);
	const loadMore = () => {
		if (loadingMore || !hasMore) return;

		setLoadingMore(true);
		setPage(page + 1).finally(() => setLoadingMore(false));
	};

	return {
		data,
		listRes,
		params,
		fetching,
		loadingMore,
		validating,
		hasMore,
		loadMore,
		addData,
		updateData,
		removeData,
		api,
		mutate,
	};
};