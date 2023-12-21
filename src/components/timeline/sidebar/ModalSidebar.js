import { Modal } from "antd";
import { IoIosWarning } from "react-icons/io";
import { SiRakuten } from "react-icons/si";

export default function ModalSidebar({ modalVisible, setModalVisible ,handleCancel, openOptionOneSecondModal, openOptionTwoSecondModal}) {
	return (
		<>
			<Modal
				title="Đóng góp ý kiến cho UteAlo"
				open={modalVisible}
				onCancel={handleCancel}
				footer={null}
				className="contribute-modal"
			>
				<div>
					<div className="contribute-line--top"></div>
					<div className="contribute-option option-one" onClick={openOptionOneSecondModal}>
						<div className="contribute-option-icon">
							<SiRakuten />
						</div>
						<div className="contribute-option-text">
							<span className="contribute-option-text-1">Chung tay cải thiện UteAlo</span>
							<span className="contribute-option-text-2">
								Đóng góp ý kiến về trải nghiệm sử dụng UteAlo của bạn.
							</span>
						</div>
					</div>
					<div
						className="contribute-option option-two"
						style={{ marginTop: '0' }}
						onClick={openOptionTwoSecondModal}
					>
						<div className="contribute-option-icon">
							<IoIosWarning />
						</div>
						<div className="contribute-option-text">
							<span className="contribute-option-text-1">Đã xảy ra lỗi</span>
							<span className="contribute-option-text-2">Hãy cho chúng tôi biết tính năng bị lỗi.</span>
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
}
