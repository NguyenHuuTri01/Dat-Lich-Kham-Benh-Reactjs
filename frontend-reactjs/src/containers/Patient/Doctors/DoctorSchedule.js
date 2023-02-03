import React, { Component } from "react";
import { connect } from "react-redux";
import './DoctorSchedule.scss';
import moment from "moment";
import localization from 'moment/locale/vi';
import { LANGUAGES } from '../../../utils';
import { getScheduleDoctorByDate } from '../../../services/userService';
import { FormattedMessage } from "react-intl";
import BookingModal from "./Modal/BookingModal";

class DoctorSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvalableTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: {},
            sliceTime: []
        }
    }
    async componentDidMount() {
        let { language } = this.props;
        let allDays = this.getArrDays(language);
        this.setState({
            allDays: allDays,
        })
        if (this.props.doctorIdFromParent) {
            let res = await getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value)
            this.setState({
                allAvalableTime: res.data ? res.data : []
            })
        }
        this.selectiveAvalableTime();
    }
    selectiveAvalableTime = () => {
        let getHoursNow = new Date().getHours();
        let arrTime = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8"]
        let slicetime = []
        if (getHoursNow <= 11) {
            if (getHoursNow < 8) {
                slicetime = arrTime.slice(0)
            } else {
                slicetime = arrTime.slice(getHoursNow - 8)
            }
        }
        if (getHoursNow >= 13 && getHoursNow <= 17) {
            slicetime = arrTime.slice(getHoursNow - 9)
        }
        this.setState({
            sliceTime: slicetime
        })
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    getArrDays = (language) => {
        let allDays = [];
        for (let i = 0; i < 7; i++) {
            let object = {};
            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Hôm nay - ${ddMM}`;
                    object.lablel = today;
                }
                else {
                    let labelVi = moment(new Date()).add(i, 'days').format('dddd - DD/MM');
                    object.lablel = this.capitalizeFirstLetter(labelVi)
                }

            } else {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Today - ${ddMM}`;
                    object.lablel = today;
                } else {
                    object.lablel = moment(new Date()).add(i, 'days').locale('en').format("ddd - DD/MM");
                }
            }
            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            allDays.push(object);
        }
        return allDays;
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            let allDays = this.getArrDays(this.props.language);
            this.setState({
                allDays: allDays
            })
        }
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let allDays = this.getArrDays(this.props.language);
            let res = await getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value)
            this.setState({
                allAvalableTime: res.data ? res.data : []
            })
        }
    }
    handleOnChangeSelect = async (event) => {
        let arrTime = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8"]
        this.setState({
            sliceTime: arrTime
        })
        if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
            let doctorId = this.props.doctorIdFromParent;
            let date = event.target.value;
            let res = await getScheduleDoctorByDate(doctorId, date);
            if (res && res.errCode === 0) {
                this.setState({
                    allAvalableTime: res.data ? res.data : []
                })
            }
            let datetostring = moment(new Date()).add(0, 'days').startOf('day').valueOf().toString();
            if (date === datetostring) {
                this.selectiveAvalableTime();
            }
        }
    }
    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time
        })
    }

    closeBookingClose = () => {
        this.setState({
            isOpenModalBooking: false
        })
    }

    render() {
        let { allDays, allAvalableTime, isOpenModalBooking, dataScheduleTimeModal, sliceTime } = this.state;
        let { language } = this.props;
        return (
            <>
                <div className="doctor-schedule-container">
                    <div className="all-schedule">
                        <select onChange={(event) => this.handleOnChangeSelect(event)}>
                            {
                                allDays && allDays.length > 0 &&
                                allDays.map((item, index) => {
                                    return (
                                        <option
                                            key={index}
                                            value={item.value}
                                        >
                                            {item.lablel}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="all-available-time">
                        <div className="text-calender">
                            <i className="fas fa-calendar-alt">
                                <span><FormattedMessage id="patient.detail-doctor.schedule" /></span>
                            </i>
                        </div>
                        <div className="time-content">
                            {allAvalableTime && allAvalableTime.length > 0 ?
                                <>
                                    <div className="time-content-btns">
                                        {
                                            allAvalableTime.map((item, index) => {
                                                let timeDisplay = language === LANGUAGES.VI ?
                                                    item.timeTypeData.valueVi : item.timeTypeData.valueEn;
                                                return (
                                                    <button
                                                        key={index}
                                                        className={
                                                            sliceTime.includes(item.timeType) ?
                                                                (language === LANGUAGES.VI ? 'btn-vie' : 'btn-en') : 'btn-hide'
                                                        }
                                                        onClick={() => this.handleClickScheduleTime(item)}
                                                    >
                                                        {timeDisplay}
                                                    </button>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="book-free">
                                        <span>
                                            <FormattedMessage id="patient.detail-doctor.choose" />
                                            <i className="far fa-hand-point-up"></i>
                                            <FormattedMessage id="patient.detail-doctor.book-free" />
                                        </span>
                                    </div>
                                </>
                                :
                                <div className="no-schedule">
                                    <FormattedMessage id="patient.detail-doctor.no-schedule" />
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <BookingModal
                    isOpenModal={isOpenModalBooking}
                    closeBookingClose={this.closeBookingClose}
                    dataTime={dataScheduleTimeModal}
                />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
