import { Space, Typography } from 'antd';
import useTheme from '../../../context/ThemeContext';
import './SidebarGroup.css';
import { useNavigate } from 'react-router-dom';
import {
	People,
	DynamicFeed,
	PhotoLibrary,
	VideoLibrary,
	Pageview,
	Storefront,
	EventAvailable,
	Room,
	Chat,
} from '@material-ui/icons';
// import PostGroupApi from '../../../api/postGroups/PostGroupApi';
import { useEffect, useState, useRef } from 'react';
// import noAvatar from '../../../assets/appImages/user.png';
// import { BASE_URL } from '../../../context/apiCall';
// import adver4 from '../../../assets/appImages/adver4.jpg';
import useAuth from '../../../context/auth/AuthContext';
// import axios from 'axios';

const SidebarSearch = ({ onFilterChange  }) => {
	const { theme } = useTheme();
	const { user: currentUser } = useAuth();
	const navigate = useNavigate();



	return (
		<div className="sidebar--group">
			<div className="group--infor-introduce" style={{ fontSize: '20px' }}>
				Kết quả tìm kiếm
			</div>
			<div className="sideber--search-line"></div>
			<div className="filter--search">
				<div className="filter--search-text">
					<span>Bộ lọc</span>
				</div>
				<Space align="center" className="filter--search-item"  onClick={() => onFilterChange('all')}>
					<div className="icon-setting">
						<DynamicFeed className="icon--search-filter"></DynamicFeed>
					</div>
					<div className="item--text">
						<Typography.Text strong>
							<span>Tất cả</span>
						</Typography.Text>
					</div>
				</Space>
				<Space align="center" className="filter--search-item" onClick={() => onFilterChange('posts')}>
					<div className="icon-setting">
						<Chat className="icon--search-filter"></Chat>
					</div>
					<div className="item--text">
						<Typography.Text strong>
							<span>Bài viết</span>
						</Typography.Text>
					</div>
				</Space>
				<Space align="center" className="filter--search-item"  onClick={() => onFilterChange('people')}>
					<div className="icon-setting">
						<People className="icon--search-filter"></People>
					</div>
					<div className="item--text">
						<Typography.Text strong>
							<span>Mọi người</span>
						</Typography.Text>
					</div>
				</Space>
				<Space align="center" className="filter--search-item">
					<div className="icon-setting">
						<PhotoLibrary className="icon--search-filter"></PhotoLibrary>
					</div>
					<div className="item--text">
						<Typography.Text strong>
							<span>Ảnh</span>
						</Typography.Text>
					</div>
				</Space>
				<Space align="center" className="filter--search-item">
					<div className="icon-setting">
						<VideoLibrary className="icon--search-filter"></VideoLibrary>
					</div>
					<div className="item--text">
						<Typography.Text strong>
							<span>Video</span>
						</Typography.Text>
					</div>
				</Space>
				<Space align="center" className="filter--search-item">
					<div className="icon-setting">
						<Storefront className="icon--search-filter"></Storefront>
					</div>
					<div className="item--text">
						<Typography.Text strong>
							<span>Marketplace</span>
						</Typography.Text>
					</div>
				</Space>
				<Space align="center" className="filter--search-item">
					<div className="icon-setting">
						<Pageview className="icon--search-filter"></Pageview>
					</div>
					<div className="item--text">
						<Typography.Text strong>
							<span>Trang</span>
						</Typography.Text>
					</div>
				</Space>
				<Space align="center" className="filter--search-item">
					<div className="icon-setting">
						<Room className="icon--search-filter"></Room>
					</div>
					<div className="item--text">
						<Typography.Text strong>
							<span>Địa điểm</span>
						</Typography.Text>
					</div>
				</Space>
				<Space align="center" className="filter--search-item"  onClick={() => onFilterChange('groups')}>
					<div className="icon-setting">
						<People className="icon--search-filter"></People>
					</div>
					<div className="item--text">
						<Typography.Text strong>
							<span>Nhóm</span>
						</Typography.Text>
					</div>
				</Space>
				<Space align="center" className="filter--search-item">
					<div className="icon-setting">
						<EventAvailable className="icon--search-filter"></EventAvailable>
					</div>
					<div className="item--text">
						<Typography.Text strong>
							<span>Sự kiện</span>
						</Typography.Text>
					</div>
				</Space>
			</div>
		</div>
	);
};
export default SidebarSearch;
