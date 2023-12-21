import axios from 'axios';
import { BASE_URL as url } from '../context/apiCall';
import { useNavigate } from 'react-router-dom';

const Api = axios.create({
	baseURL: url,
});

// Thêm interceptor để kiểm tra và cập nhật token
Api.interceptors.request.use(
	(config) => {
		// Kiểm tra token và cập nhật nếu cần
		const { accessToken } = JSON.parse(localStorage.getItem('userInfo'));
		if (accessToken) {
			config.headers['Authorization'] = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

const handleTokenRefreshError = (error) => {
	// Xử lý lỗi khi cập nhật token không thành công
	console.error('Error refreshing token:', error);

	//navigate('/login');

	// Xóa token và thực hiện các xử lý khác (ví dụ: đăng xuất người dùng)
	localStorage.removeItem('userInfo');
};

// Thêm interceptor để xử lý lỗi token hết hạn và cập nhật token
Api.interceptors.response.use(
	(response) => {
		return response;
	},

	async (error) => {
		const originalRequest = error.config;
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			// Kiểm tra sự tồn tại của refreshToken
			const { refreshToken, accessToken } = JSON.parse(localStorage.getItem('userInfo'));
			if (refreshToken) {
				// Thực hiện yêu cầu cập nhật token
				const data = {
					accessToken: accessToken,
					refreshToken: refreshToken,
				};
				const config = {
					headers: {
						'Content-Type': 'application/json',
					},
				};
				try {
					const response = await axios.post(url + '/v1/auth/refresh-access-token', data, config);
					console.log('response', response);
					console.log('originalRequest', originalRequest);
					if (response.data.statusCode === 200) {
						// Lưu token mới và thử lại yêu cầu gốc
						const userInfo = {
							accessToken: response.data.result.accessToken,
							refreshToken: response.data.result.refreshToken,
							userId: response.data.result.userId,
						};
						localStorage.setItem('userInfo', JSON.stringify(userInfo));
						return Api(originalRequest);
					} else {
						// Xử lý lỗi khi cập nhật token không thành công
						handleTokenRefreshError(response);
					}
				} catch (error) {
					// Xử lý lỗi khi gửi yêu cầu cập nhật token
					console.error('Error refreshing token:', error);
					const navigate = useNavigate();
					navigate('/login');

					// Xóa token và thực hiện các xử lý khác (ví dụ: đăng xuất người dùng)
					localStorage.removeItem('userInfo');
				}
			} else {
				// Xử lý lỗi khi không có refreshToken
				handleTokenRefreshError();
			}
		} else {
			console.log('error', error);
		}
		// Xử lý các trường hợp lỗi khác (ví dụ: 403, 404, ...)
		// ...

		return Promise.reject(error);
	}
);

export default Api;
