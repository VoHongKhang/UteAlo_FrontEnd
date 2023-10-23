import './CreateGroup.css';
import useTheme from '../../../context/ThemeContext';
import sampleProPic from '../../../assets/appImages/user.png';
import noCover from './../../../assets/appImages/noCover.jpg';
import Share from '../../timeline/sharePost/Share';
import { Search, Public, People, MoreHoriz } from '@material-ui/icons';
const CreateGroupCard = ({ nameGroup, role }) => {
	const { theme } = useTheme();
	console.log('nameGroup', nameGroup);
	console.log('role', role);
	return (
		<div className="container--create-group">
			<div className="header--group">
				<div className="groupCover" style={{ color: theme.foreground, background: theme.background }}>
					<img className="groupCoverImg" src={noCover} alt="..." />

					<img className="groupUserImg" src={sampleProPic} alt="..." />
				</div>
				<div className="group--contanier--top">
					<div className="group--detail">
						<span className="group--name">{nameGroup}</span>
						<div className="group--name-info">
							<Public htmlColor="#65676B" className="group--public-icon" />
							<span className="group--public-text">{role}</span>
							<People htmlColor="#65676B" className="group--member-icon" />
							<span className="group--member">1 thành viên</span>
						</div>
					</div>
				</div>
				<hr />
				<div className="list--feature--group">
					<ul className="list-feature">
						<li>Thảo luận</li>
						<li>Đáng chú ý</li>
						<li>Phòng họp mặt</li>
						<li>File</li>
					</ul>
					<div className="container--search--group">
						<div className="container--search--group-icon">
							<Search />
						</div>
						<div className="container--search--group-more">
							<MoreHoriz />
						</div>
					</div>
				</div>
			</div>
			<div className="container--group">
				<div className="feed">
					<div className="feedWrapper">
						<Share />
					</div>
				</div>
			</div>
		</div>
	);
};
export default CreateGroupCard;
