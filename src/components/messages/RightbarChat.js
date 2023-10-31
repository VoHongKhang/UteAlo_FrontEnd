import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import sampleProPic from '../../assets/appImages/user.png';
import { FileCopy, Photo, VideoLibrary } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import { Button, Image } from 'antd';
const RightbarChat = ({ groupId }) => {
	const [choose, setChoose] = useState(0);
	const [photo, setPhoto] = useState([
		'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
		'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
		'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
		'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
	]);
	//video
	const [video, setVideo] = useState([
		'E:/HCMUTE/Nam4/UteAlo_FrontEnd/src/assets/video/test.mp4',
		'https://cdn.videvo.net/videvo_files/video/free/2019-12/small_watermarked/191015_01_Autumn_1080p_013_preview.webm',
		'https://cdn.videvo.net/videvo_files/video/free/2019-12/small_watermarked/191015_01_Autumn_1080p_013_preview.webm',
	]);

	const [file, setFile] = useState([
		{
			name: 'file1',
		},
		{
			name: 'file2',
		},
		{
			name: 'file3',
		},
	]);
	// giả data cho các giá trị photo, file, video

	useEffect(() => {});
	return (
		<div className="rightbar--chat">
			<div className="rightbar--chat--header">
				<img src={`${groupId || sampleProPic}`} alt="avatar" />
				<p>{groupId || 'Quang Huy'}</p>
			</div>
			<BottomNavigation
				className="list--message--sidebar"
				showLabels
				value={choose}
				onChange={(event, newValue) => {
					console.log('event', event);
					console.log('newValue', newValue);
					setChoose(newValue);
				}}
			>
				<BottomNavigationAction label="Ảnh" icon={<Photo />} />
				<BottomNavigationAction label="Video" icon={<VideoLibrary />} />
				<BottomNavigationAction label="File tài liệu" icon={<FileCopy />} />
			</BottomNavigation>
			<div className="file--container">
				{choose === 0 &&
					photo?.map((item, index) => (
						<div className="file--item" key={index}>
							<Image width={87} height={87} src={item} alt="image" />
						</div>
					))}
				{choose === 1 &&
					video?.map((item, index) => (
						<div className="file--item" key={index}>
							<video src={item} alt="file" />
						</div>
					))}
			</div>
			<div className='contaner--item--file'>
				{choose === 2 &&
					file?.map((item, index) => (
						<div  key={index}>
							<Button icon={<FileCopy />} className='button--file--item'>
								<p> {item.name}</p>
							</Button>
						</div>
					))}
			</div>
		</div>
	);
};
export default RightbarChat;
