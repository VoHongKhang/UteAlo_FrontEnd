import { Modal } from 'antd';
import moment from 'moment';
import PostCard from '../timeline/post/PostCard';
export const formatTime = (time) => {
	const postTime = moment(time);
	const timeDifference = moment().diff(postTime, 'minutes');

	let formattedTime;

	if (timeDifference < 60) {
		formattedTime = `${timeDifference} phút trước`;
	} else if (timeDifference < 1440) {
		const hours = Math.floor(timeDifference / 60);
		formattedTime = `${hours} giờ trước`;
	} else {
		formattedTime = postTime.format('DD [tháng] M [lúc] HH:mm');
	}

	return formattedTime;
};
