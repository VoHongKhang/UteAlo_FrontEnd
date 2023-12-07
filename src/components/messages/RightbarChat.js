import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import sampleProPic from '../../assets/appImages/user.png';
import { FileCopy, Photo, VideoLibrary } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import { Button, Image } from 'antd';
import PostGroupApi from '../../api/postGroups/PostGroupApi';
import ProfileApi from '../../api/profile/ProfileApi';
import { useNavigate } from 'react-router-dom';
import useTheme from '../../context/ThemeContext';
const RightbarChat = ({ user, group, currentData, showRightbar }) => {
	const [data, setData] = useState({});
	const [choose, setChoose] = useState(0);
	const navigate = useNavigate();
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

	useEffect(() => {
		const fetchData = async () => {
			if (group.id) {
				if (group.isGroup) {
					try {
						await PostGroupApi.getGroup({ user: user, postId: group.id })
							.then((res) => {
								setData(res.result);
							})
							.catch((err) => {
								console.log(err);
							});
					} catch (error) {
						console.log(error);
					}
				} else {
					try {
						await ProfileApi.getProfile({ user: user, userId: group.id})
							.then((res) => {
								setData(res.result);
							})
							.catch((err) => {
								console.log(err);
							});
					} catch (error) {
						console.log(error);
					}
				}
			}
		};
		fetchData();
		currentData(data);
	}, [user, group]);
	useEffect(() => {
		currentData(data);
	}, [data]);
	const handleClickAvatar = () => {
		if (data.userId) {
			navigate(`/profile/${data.userId}`);
		}
		if (data.postGroupId) {
			navigate(`/groups/${data.postGroupId}`);
		}
	};
	const { theme } = useTheme();
	return (
		<>
			{showRightbar && (
				<div className="rightbar--chat">
					<div className="rightbar--chat--header">
						<img src={data?.avatar || sampleProPic} alt="avatar" onClick={handleClickAvatar} />
						<p>{data?.fullName || data?.postGroupName}</p>
					</div>
					<BottomNavigation
						style={{ color: theme.foreground, background: theme.background }}
						className="list--message--sidebar"
						showLabels
						value={choose}
						onChange={(event, newValue) => {
							console.log('event', event);
							console.log('newValue', newValue);
							setChoose(newValue);
						}}
					>
						<BottomNavigationAction
							style={{ color: theme.foreground, background: theme.background }}
							label="Ảnh"
							icon={<Photo />}
						/>
						<BottomNavigationAction
							style={{ color: theme.foreground, background: theme.background }}
							label="Video"
							icon={<VideoLibrary />}
						/>
						<BottomNavigationAction
							style={{ color: theme.foreground, background: theme.background }}
							label="File tài liệu"
							icon={<FileCopy />}
						/>
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
					<div className="contaner--item--file">
						{choose === 2 &&
							file?.map((item, index) => (
								<div key={index}>
									<Button icon={<FileCopy />} className="button--file--item">
										<p> {item.name}</p>
									</Button>
								</div>
							))}
					</div>
				</div>
			)}
			;
		</>
	);
};
export default RightbarChat;
