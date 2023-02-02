import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";
import { CommonUtils } from "../../../utils";
import './RemedyModal.scss';

class RemedyModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imgBase64: '',
            prescription: ''
        }
    }
    async componentDidMount() {
        if (this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.dataModal !== prevProps.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }
    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }
    handleOnChangePrescription = (event) => {
        this.setState({
            prescription: event.target.value
        })
    }
    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imgBase64: base64,
            });
        }
    }
    handleSendRemedy = () => {
        this.props.sendRemedy(this.state);
        this.setState({
            imgBase64: '',
            prescription: ''
        })
    }
    handleCloseRemedyModal = () => {
        this.props.closeRemedyModal();
        this.setState({
            imgBase64: '',
            prescription: ''
        })
    }
    render() {
        let { isOpenModal } = this.props;
        return (
            <Modal
                isOpen={isOpenModal}
                className={'booking-modal-container'}
                size="md"
                centered
            >
                <div className="modal-header">
                    <h5 className="modal-title">Gửi hóa đơn khám bệnh thành công</h5>
                    <button
                        type="button"
                        className="close"
                        aria-label="Close"
                        onClick={() => this.handleCloseRemedyModal()}
                    >
                        <span aria-hidden="true">x</span>
                    </button>
                </div>
                <ModalBody>
                    <div className="row">
                        <div className="col-6 form-group">
                            <label>Email bệnh nhân</label>
                            <input
                                className="form-control"
                                type="email"
                                value={this.state.email}
                                onChange={(event) => this.handleOnChangeEmail(event)}
                            />
                        </div>
                        <div className="col-12 form-group">
                            <label>Đơn thuốc</label>
                            <input
                                className="form-control-file"
                                type="file"
                                onChange={(event) => this.handleOnChangeImage(event)}
                            />
                            <textarea
                                className="col-12"
                                value={this.state.prescription}
                                onChange={(event) => this.handleOnChangePrescription(event)}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.handleSendRemedy()}>Send</Button>{' '}
                    <Button color="secondary" onClick={() => this.handleCloseRemedyModal()}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
