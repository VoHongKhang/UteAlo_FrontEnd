// Trong useGetMessage.js
import { useState } from 'react';
import { BASE_URL } from '../../context/apiCall';
import Api from '../Api';
const useGetMessage = ({ isGroup, userId, groupId, page, size }) => {
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${
            localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).accessToken : ''
          }`,
        },
      };
      let res;
      if (isGroup) {
        res = await Api.get(`${BASE_URL}/v1/message/group/${groupId}?page=${page}&size=${size}`, config);
      } else {
        res = await Api.get(`${BASE_URL}/v1/message/user/${userId}?page=${page}&size=${size}`, config);
      }

      if (res.data.success) {
        const newData = res.data.result;

        // Kiểm tra xem còn nhiều dữ liệu hơn để tải hay không
        const newHasMore = newData.length === size;

        // Cập nhật trạng thái dữ liệu và hasMore
        setData((prevData) => [...prevData, ...newData]);
        setHasMore(newHasMore);

        return { data: res.data.result, hasMore: newHasMore };
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const loadMore = async () => {
    try {
      // Tăng trang để tải dữ liệu mới
      const nextPage = page + 1;

      // Gọi fetchData với trang mới
      const result = await fetchData(nextPage);

      return result;
    } catch (error) {
      console.error('Error loading more data:', error.message);
    }
  };

  return { data, hasMore, loadMore };
};

export default useGetMessage;
