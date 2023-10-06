import { useEffect, useState } from 'react';
import FriendApi from '../../api/friends/FriendApi';

export const useFetcher = ({ currentUser, api, limit = 21, params = {}, page }) => {
	const [data, setData] = useState([]);
	const [dataEnd, setDataEnd] = useState();
	const [fetching, setFetching] = useState(false);
	const [updateData, setUpdateData] = useState([]);
	useEffect(() => {
		const getData = async () => {
			setFetching(true);
			await FriendApi({ currentUser, api, limit, page }).then((res) => {
				setFetching(false);
				if(res.result.length >1) {
					setData(res.result.splice(0, res.result.length - 1));
					setDataEnd(res.result[res.result.length - 1]);
				}
				else {
					setData(res.result);
					setDataEnd(undefined);
				}
			});
		};
		getData();
	}, [limit, api, page, currentUser]);
	const hasMore = dataEnd !== undefined ? true : false;
	useEffect(() => {
		if(updateData!==undefined&& data.length>0 && dataEnd!==undefined){
			setUpdateData([...updateData,...data,dataEnd]);
		}
		else if(updateData!==undefined&& data.length>0){
			setUpdateData([...updateData,...data]);
		}
		else if(updateData!==undefined&& dataEnd!==undefined){
			setUpdateData([...updateData,dataEnd]);
		}
		else if(updateData!==undefined){
			setUpdateData([...updateData]);
		}
		else if(data.length>0 && dataEnd!==undefined){
			setUpdateData([...data,dataEnd]);
		}
		else if(data.length>0){
			setUpdateData([...data]);
		}
		else if(dataEnd!==undefined){
			setUpdateData([dataEnd]);
		}
		else{
			setUpdateData([]);
		}
			
	}, [page,api]);
	console.log(updateData);
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
		updateData,
		loadMore,
		api,
	};
};
