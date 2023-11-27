import { useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../context/apiCall';

const RefreshToken = () => {
	let userInfoString = localStorage.getItem('userInfo');
	let userInfo = JSON.parse(userInfoString);
	useEffect(() => {
		// Lấy dữ liệu từ localStorage

		console.log('refresh info', userInfo);
		const config = {
			headers: {
				'Content-type': 'application/json',
			},
		};
		const fetchUsers = async () => {
			try {
				const requestData = {
					accessToken: userInfo.accessToken,
					refreshToken: userInfo.refreshToken,
				};

				const res = await axios.post(`${BASE_URL}/v1/auth/refresh-access-token`, requestData, config);
				console.log('refresh', res);
				// Lưu lại thông tin mới vào localStorage
				localStorage.setItem('userInfo', JSON.stringify(res.data.result));
			} catch (error) {
				console.error(error);
			}
		};
		const intervalId = setInterval(() => {
			fetchUsers();
		}, 5000000); // 1 giờ = 3600000 mili giây

		// Xóa interval khi component unmounted
		return () => clearInterval(intervalId);
	}, [userInfo]);
	return null;
};

export default RefreshToken;
