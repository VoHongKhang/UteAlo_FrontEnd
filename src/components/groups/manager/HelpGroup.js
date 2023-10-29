import { Image } from 'antd';
import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';
import Topbar from '../../timeline/topbar/Topbar';
import SidebarManagerGroup from './sidebarManagerGroup/SidebarManagerGroup';
import './ManagerGroup.css';
import { useParams } from 'react-router-dom';
import useAuth from '../../../context/auth/AuthContext';
const HelpGroup = () => {
	const params = useParams();
	const { user: currentUser } = useAuth();
	return (
		<>
			<Helmet title={`Quản lý thành viên nhóm ||UTEALO`} />
			<Toaster />
			<Topbar />
			<div div className="homeContainer">
				<SidebarManagerGroup user={currentUser} groupId={params.postGroupId} />
				<div className="setting--group--member">
					<Image src="https://blogs.sun.ac.za/gergablog/files/2019/02/help-button_large-1200x640.jpg" />
				</div>
			</div>
		</>
	);
};
export default HelpGroup;
