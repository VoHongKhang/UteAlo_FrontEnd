import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import GetListFriendRequestApi from '../../../api/profile/friendRequest/getList';
import useAuth from '../../../context/auth/AuthContext';
const FriendRequest = () => {
	const [listFriendRequest, setListFriendRequest] = useState([]);
	const { user: currentUser } = useAuth();
	const fetchFriendRequest = async () => {
		const res = await GetListFriendRequestApi.getListFriendRequest(currentUser);
		if (res.success) {
			setListFriendRequest(res.result);
		}

	};

	useEffect(() => {
		fetchFriendRequest();
	}, []);

	return (
		<div>
			<Helmet title={`Friend Request | UTEALO`} />
			{listFriendRequest.length > 0 ? (
				listFriendRequest.map((user) => (
					<div className="friend-request" key={user._id}>
						<div className="friend-request__avatar">
							<img src={user.avatar} alt="" />
						</div>
						<div className="friend-request__content">
							<div className="friend-request__content__name">{user.name}</div>
							<div className="friend-request__content__btn">
								<button className="btn btn--accept">Accept</button>
								<button className="btn btn--deny">Deny</button>
							</div>
						</div>
					</div>
				))
			) : (
				<div className="friend-request__empty">
					<div className="friend-request__empty__icon">
						<i className="fas fa-user-friends"></i>
					</div>
					<div className="friend-request__empty__text">You don't have any friend request</div>
				</div>
			)}
		</div>
	);
};

export default FriendRequest;
