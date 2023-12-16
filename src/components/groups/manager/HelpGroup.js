import { Image } from 'antd';
import { Helmet } from 'react-helmet';
import './ManagerGroup.css';

const HelpGroup = () => {
	return (
		<>
			<Helmet title={`Quản lý thành viên nhóm ||UTEALO`} />
			<div className="setting--group--member">
				<Image src="https://blogs.sun.ac.za/gergablog/files/2019/02/help-button_large-1200x640.jpg" />
			</div>
		</>
	);
};
export default HelpGroup;
