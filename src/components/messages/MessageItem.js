import { Button, Image, List, Space, Spin, theme, Tooltip, Typography } from 'antd';
import classnames from 'classnames';
import { HiDownload } from 'react-icons/hi';
import { HiArrowPath, HiEye } from 'react-icons/hi2';
import HeartIcon from '../../assets/icons/heart.png';
import HahaIcon from '../../assets/icons/haha.png';
import LikeIcon from '../../assets/icons/like.png';
import SadIcon from '../../assets/icons/sad.png';
import WowIcon from '../../assets/icons/wow.png';
import AngryIcon from '../../assets/icons/angry.png';
import { Link } from 'react-router-dom';
import { InsertEmoticon, MoreHoriz, Reply } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Popover } from '@material-ui/core';
import { fileUtil } from './utils/fileUtil';
function MessageItem({ isOwner, message, prevCombine, nextCombine, onRetry }) {
	const { token } = theme.useToken();
	const classes = ['message'];
	const classParent = [isOwner ? 'sent--item' : 'received--item'];
	classes.push(isOwner ? 'sent' : 'received');

	const [iconMessage, setIconMessage] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedItem, setSelectedItem] = useState(null);
	const [openConfirmation, setOpenConfirmation] = useState(false);
	const handleCloseConfirmation = () => {
		setOpenConfirmation(false);
		setAnchorEl(null);
		setSelectedItem(null);
	};

	const handleClose = () => {
		setIconMessage(null);
		setAnchorEl(null);
		setSelectedItem(null);
	};
	const handleReactIcon = (react) => {
		console.log('react', react);
	};
	const handleClick = (event, item) => {
		if (event.currentTarget.className.animVal === 'MuiSvgIcon-root icon--more--message') {
			setIconMessage('More');
		}
		if (event.currentTarget.className.animVal === 'MuiSvgIcon-root icon--reply--message') {
			setIconMessage('Reply');
		}
		if (event.currentTarget.className.animVal === 'MuiSvgIcon-root icon--emoticon--message') {
			setIconMessage('Emoticon');
		}

		setAnchorEl(event.currentTarget);
		setSelectedItem(item);
	};
	const handleConfirmAction = async () => {
		setOpenConfirmation(false);
		handleClose();
	};

	return (
		<Space
			className={classnames(classParent)}
			align={isOwner ? 'end' : 'start'}
		>
			{!isOwner && <img src={message?.senderAvatar} alt="avatar" className="sender-avatar" />}
			<div className={isOwner ? 'senderMessage' : 'receivedMessage'}>
				{!isOwner && <Typography.Text className="sender-name">{message?.senderName}</Typography.Text>}
				<Space direction="vertical" className={classnames(classes)}>
					<div className="icon--message">
						<MoreHoriz className="icon--more--message" onClick={(e) => handleClick(e, message)} />
						<Reply className="icon--reply--message" onClick={(e) => handleClick(e, message)} />

						<InsertEmoticon className="icon--emoticon--message" onClick={(e) => handleClick(e, message)} />
					</div>
					<Typography.Text className="text">{message.content}</Typography.Text>
				</Space>
				{/* <Space direction="vertical" className={classnames(classes)}>
					{message.files?.length > 0 && (
						<List
							size="small"
							dataSource={message.media}
							renderItem={(item) => (
								<List.Item
									className="file_item"
									extra={
										<Link href={item.link} target="_blank" download>
											<Button shape="circle" key="download" icon={<HiDownload />} size="small" />
										</Link>
									}
								>
									<Image
										className="file_icon"
										preview={
											!!fileUtil.isImage(item.name) && {
												maskClassName: 'file_icon',
												mask: <HiEye />,
											}
										}
										src={fileUtil.getFilePreview(item)}
										alt={item.originalname}
									/>

									<Typography.Text strong className="file_name">
										{item.originalname}
									</Typography.Text>
								</List.Item>
							)}
						/>
					)}

					
				</Space> */}
			</div>
			{message.sending && <Spin size="small" style={{ alignSelf: 'center' }} />}

			{message.error && (
				<Tooltip title="Thử lại">
					<Button size="small" type="text" shape="circle" icon={<HiArrowPath />} onClick={onRetry} danger />
				</Tooltip>
			)}

			{message.error && <Typography.Text type="danger">{message.error}</Typography.Text>}
			<Popover
				id="simple-popover"
				open={Boolean(anchorEl)}
				className="popper--member"
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			>
				<div>
					{iconMessage === 'More' && (
						<Typography className="poper--member--item" onClick={() => setOpenConfirmation(true)}>
							Thu hồi tin nhắn
						</Typography>
					)}
					{iconMessage === 'Reply' && (
						<Typography className="poper--member--item" onClick={() => setOpenConfirmation(true)}>
							Trả lời tin nhắn
						</Typography>
					)}
					{iconMessage === 'Emoticon' && (
						<div className="emotion--container">
							<img
								src={HeartIcon}
								alt="Heart Icon"
								className="icon--emoticon"
								onClick={() => handleReactIcon('Heart')}
							/>
							<img
								src={HahaIcon}
								alt="Haha Icon"
								className="icon--emoticon"
								onClick={() => handleReactIcon('Haha')}
							/>
							<img
								src={LikeIcon}
								alt="Like Icon"
								className="icon--emoticon"
								onClick={() => handleReactIcon('Like')}
							/>
							<img
								src={SadIcon}
								alt="Sad Icon"
								className="icon--emoticon"
								onClick={() => handleReactIcon('Sad')}
							/>
							<img
								src={WowIcon}
								alt="Wow Icon"
								className="icon--emoticon"
								onClick={() => handleReactIcon('Wow')}
							/>
							<img
								src={AngryIcon}
								alt="Angry Icon"
								className="icon--emoticon"
								onClick={() => handleReactIcon('Angry')}
							/>
						</div>
					)}
				</div>
			</Popover>

			<Dialog open={openConfirmation} onClose={handleCloseConfirmation}>
				<DialogTitle>Xác nhận thay đổi</DialogTitle>
				<DialogContent>
					<DialogContentText>Bạn có chắc chắn muốn xóa tin nhắn này ?</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseConfirmation} color="primary" variant="outlined">
						Hủy
					</Button>
					<Button onClick={handleConfirmAction} color="primary" variant="contained">
						Xác nhận
					</Button>
				</DialogActions>
			</Dialog>
		</Space>
	);
}
export default MessageItem;
