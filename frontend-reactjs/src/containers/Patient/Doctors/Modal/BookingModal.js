import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Modal } from "reactstrap";
import './BookingModal.scss'
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import DatePicker from "../../../../components/Input/DatePicker";
import * as actions from '../../../../store/actions';
import { LANGUAGES } from "../../../../utils";
import Select from 'react-select';
import { postPatientBookAppointment } from '../../../../services/userService';
import { toast } from 'react-toastify';
import moment from "moment";
import LoadingOverlay from "react-loading-overlay";

class BookingModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            selectedGender: '',
            doctorId: '',
            genders: '',
            timeType: '',
            isShowLoading: false
        }
    }
    async componentDidMount() {
        this.props.getGenders();
    }
    buildDataGender = (data) => {
        let result = [];
        let language = this.props.language;

        if (data && data.length > 0) {
            data.map(item => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object);
            })
            return result;
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.genders !== prevProps.genders) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.dataTime !== prevProps.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let doctorId = this.props.dataTime.doctorId;
                let timeType = this.props.dataTime.timeType;
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
        }
    }

    handleOnChangeInput = (event, id) => {
        let valueInput = event.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy
        })
    }
    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }
    handleChangeSelect = (selectedOption) => {
        this.setState({
            selectedGender: selectedOption
        })
    }
    handleConfirmBooking = async () => {
        // validate input
        const regExEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        // là dãy kí tự gồm a-z, A-Z, 0-9 và _ dấu (.) ; tiếp theo phải có kí tự(lặp lại nhiều lần)
        // sau đó đến @
        // sau đó đến 1 khối được tạo từ các kí tự, lặp lại nhiều lần, phía sau phải có kí tự
        // tiếp đến cũng 1 khối kí tự gồm 2-4 kí tự
        if (!regExEmail.test(this.state.email) && this.state.email !== '') {
            alert('email is not valid');
            return;
        }
        const regExPhoneNumber = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/g;
        if (!regExPhoneNumber.test(this.state.phoneNumber) && this.state.phoneNumber !== '') {
            alert('phonenumber is not valid');
            return;
        }
        this.setState({
            isShowLoading: true
        })

        let date = new Date(this.state.birthday).getTime();
        let timeString = this.buildTimeBooking(this.props.dataTime);
        let doctorName = this.buildDoctorName(this.props.dataTime);

        let res = await postPatientBookAppointment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: this.props.dataTime.date,
            birthday: date,
            selectedGender: this.state.selectedGender.value,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName
        })
        this.setState({
            isShowLoading: false
        })
        if (res && res.errCode === 0) {
            toast.success('Booking a new appointment succeed!');
            this.props.closeBookingClose();
            this.setState({
                fullName: '',
                phoneNumber: '',
                email: '',
                address: '',
                reason: '',
                birthday: '',
                selectedGender: '',
            })
        } else {
            toast.error('Booking a new appointment error!');
        }
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    buildTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ?
                dataTime.timeTypeData.valueVi :
                dataTime.timeTypeData.valueVi;
            let date = language === LANGUAGES.VI ?
                this.capitalizeFirstLetter(
                    moment.unix(+ dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                )
                :
                moment.unix(+ dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY');
            return `${time} • ${date}`;
        }
        return ''
    }
    buildDoctorName = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let name = language === LANGUAGES.VI ?
                `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
                :
                `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`
            return name;
        }
        return ''
    }
    render() {
        let { isOpenModal, closeBookingClose, dataTime } = this.props;
        let doctorId = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : '';
        let maxDate = new Date(new Date().setDate(new Date().getDate() - 365));
        return (
            <LoadingOverlay
                active={this.state.isShowLoading}
                spinner
                text='Loading...'
            >
                <Modal
                    isOpen={isOpenModal}
                    className={'booking-modal-container'}
                    size="lg"
                    centered
                >
                    <div className="booking-modal-content">
                        <div className="booking-modal-header">
                            <span className="left">
                                <FormattedMessage id="patient.booking-modal.title" />
                            </span>
                            <span className="right"
                                onClick={closeBookingClose}
                            >
                                <i className="fas fa-times"></i>
                            </span>
                        </div>
                        <div className="booking-modal-body">
                            <div className="doctor-infor">
                                <ProfileDoctor
                                    doctorId={doctorId}
                                    isShowDescriptionDoctor={false}
                                    dataTime={dataTime}
                                    isShowLinkDetail={false}
                                    isShowPrice={true}
                                />
                            </div>
                            {
                                dataTime && dataTime.currentNumber === 1 ?
                                    <div className="message-full-slot">
                                        Xin lỗi quý khách, khung giờ này đã có người đặt rồi.
                                    </div>
                                    :
                                    <div className="row">
                                        <div className="col-6 form-group">
                                            <label>
                                                <FormattedMessage id="patient.booking-modal.fullName" />
                                            </label>
                                            <input className="form-control"
                                                value={this.state.fullName}
                                                onChange={(event) => this.handleOnChangeInput(event, 'fullName')}
                                            />
                                        </div>
                                        <div className="col-6 form-group">
                                            <label>
                                                <FormattedMessage id="patient.booking-modal.phoneNumber" />
                                            </label>
                                            <input className="form-control"
                                                value={this.state.phoneNumber}
                                                onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                            />
                                        </div>
                                        <div className="col-6 form-group">
                                            <label>
                                                <FormattedMessage id="patient.booking-modal.email" />
                                            </label>
                                            <input className="form-control"
                                                value={this.state.email}
                                                onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                            />
                                        </div>
                                        <div className="col-6 form-group">
                                            <label>
                                                <FormattedMessage id="patient.booking-modal.address" />
                                            </label>
                                            <input className="form-control"
                                                value={this.state.address}
                                                onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                            />
                                        </div>
                                        <div className="col-12 form-group">
                                            <label>
                                                <FormattedMessage id="patient.booking-modal.reason" />
                                            </label>
                                            <input className="form-control"
                                                value={this.state.reason}
                                                onChange={(event) => this.handleOnChangeInput(event, 'reason')}
                                            />
                                        </div>

                                        <div className="col-6 form-group">
                                            <label>
                                                <FormattedMessage id="patient.booking-modal.birthday" />
                                            </label>
                                            <DatePicker
                                                onChange={this.handleOnChangeDatePicker}
                                                className="form-control"
                                                value={this.state.birthday}
                                                maxDate={maxDate}
                                            />
                                        </div>
                                        <div className="col-6 form-group">
                                            <label>
                                                <FormattedMessage id="patient.booking-modal.gender" />
                                            </label>
                                            <Select
                                                value={this.state.selectedGender}
                                                onChange={this.handleChangeSelect}
                                                options={this.state.genders}
                                            />
                                        </div>
                                    </div>
                            }
                        </div>
                        <div className="booking-modal-footer">
                            <button
                                className={
                                    dataTime && dataTime.currentNumber === 1 ?
                                        "hide-btn-confirm" :
                                        "btn-booking-confirm"
                                }
                                onClick={() => this.handleConfirmBooking()}
                            >
                                <FormattedMessage id="patient.booking-modal.btnConfirm" />
                            </button>
                            <button
                                className="btn-booking-cancel"
                                onClick={closeBookingClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal>
            </LoadingOverlay>
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
        getGenders: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
