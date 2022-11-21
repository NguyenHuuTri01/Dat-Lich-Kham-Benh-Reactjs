import React, { Component } from "react";
import { connect } from "react-redux";
import './ManageSchedule.scss';
import { FormattedMessage } from "react-intl";
import Select from 'react-select';
import * as actions from "../../../store/actions";
import { LANGUAGES, dateFormat } from "../../../utils";
import DatePicker from "../../../components/Input/DatePicker";
import moment from "moment";
import { toast } from "react-toastify";
import _ from "lodash";
import { saveBulkScheduleDoctor } from '../../../services/userService';
import { getScheduleDoctorByDate } from '../../../services/userService';

class ManageSchedule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            currentDate: '',
            rangeTime: [],
            allSchedule: {}
        }
    }
    async componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.fetchAllScheduleTime();
    }
    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            })
        }
        return result;
    }
    buildDoctorSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.firstName && inputData.lastName && inputData.id) {
            let object = {};
            let labelVi = `${inputData.lastName} ${inputData.firstName}`;
            let labelEn = `${inputData.firstName} ${inputData.lastName}`;
            object.label = language === LANGUAGES.VI ? labelVi : labelEn;
            object.value = inputData.id;
            result.push(object);
        }
        return result;
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            if (this.props.user.roleId === 'R2') {
                let selectedDoctorDefault = this.buildDoctorSelect(this.props.user)
                this.setState({
                    listDoctors: selectedDoctorDefault,
                    selectedDoctor: selectedDoctorDefault[0]
                })
            } else {
                this.setState({
                    listDoctors: dataSelect
                })
            }
        }

        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime;
            if (data && data.length > 0) {
                data = data.map(item => ({
                    ...item, isSelected: false
                }))
            }
            this.setState({
                rangeTime: data
            })
        }
        if (prevProps.language !== this.props.language) {
            let selectedDoctorDefault = this.buildDefaultSelect(this.props.user)
            this.setState({
                selectedDoctor: selectedDoctorDefault[0]
            })
        }
    }

    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor: selectedDoctor });
        this.loadSchedule();
    };
    handleOnChangeDatePicker = async (date) => {
        this.setState({
            currentDate: date[0]
        })
        this.loadSchedule();
    }
    handleClichBtnTime = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            })
            this.setState({
                rangeTime: rangeTime
            })
        }
    }
    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let { allScheduleTime } = this.props;
        let result = [];
        if (selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error("Invalid selected doctor! ");
            return;
        }
        if (!currentDate) {
            toast.error("Invalid date! ");
            return;
        }
        // let formatedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER)
        // let formatedDate = moment(currentDate).unix();
        let formatedDate = new Date(currentDate).getTime();
        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true)
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map((schedule, index) => {
                    let object = {};
                    object.doctorId = selectedDoctor.value;
                    object.date = formatedDate;
                    object.timeType = schedule.keyMap;
                    result.push(object)
                })
            }
            else {
                toast.error("Invalid selected time! ");
                return;
            }
        }
        let res = await saveBulkScheduleDoctor(
            {
                arrSchedule: result,
                doctorId: selectedDoctor.value,
                formatedDate: formatedDate,
                allScheduleTime: allScheduleTime
            }
        )
        if (res && res.errCode === 0) {
            toast.success("Save Infor succeed!");
        } else {
            toast.error("error saveBulkScheduleDoctor! ");
            console.log("error saveBulkScheduleDoctor >>> res: ", res);
        }
    }
    loadSchedule = async () => {
        let { currentDate, selectedDoctor } = this.state;
        if (currentDate && selectedDoctor) {
            // set isSelected = false
            let data = this.props.allScheduleTime;
            if (data && data.length > 0) {
                data = data.map(item => ({
                    ...item, isSelected: false
                }))
            }
            this.setState({
                rangeTime: data
            })
            // get all schedule doctor
            let formatedDate = new Date(currentDate).getTime();
            let res = await getScheduleDoctorByDate(selectedDoctor.value, formatedDate);
            console.log('chjeck res: ', res)
            if (res && res.errCode === 0) {
                this.setState({
                    allSchedule: res.data
                })
            }
            // show schedule
            let { allSchedule } = this.state;
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < this.state.allSchedule.length; j++) {
                    if (data[i].keyMap === allSchedule[j].timeType) {
                        data[i].isSelected = true;
                    }
                }
            }
            this.setState({
                rangeTime: data
            })
        }
    }
    render() {
        let { rangeTime } = this.state;
        let { language, user } = this.props;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
        return (
            <div className="manage-schedule-container">
                <div className="m-s-title">
                    <FormattedMessage id={"manage-schedule.title"} />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-6 form-group">
                            <label><FormattedMessage id={"manage-schedule.choose-doctor"} /></label>
                            <Select
                                value={this.state.selectedDoctor}
                                onChange={this.handleChangeSelect}
                                options={this.state.listDoctors}
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label><FormattedMessage id={"manage-schedule.choose-date"} /></label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className="form-control"
                                value={this.state.currentDate}
                                minDate={yesterday}
                            />
                        </div>
                        <div className="col-12 pick-hour-container">
                            {rangeTime && rangeTime.length > 0 &&
                                rangeTime.map((item, index) => {
                                    return (
                                        <button
                                            className=
                                            {item.isSelected === true ?
                                                "btn btn-schedule active" :
                                                "btn btn-schedule"
                                            }
                                            key={index}
                                            onClick={() => this.handleClichBtnTime(item)}
                                        >
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </button>
                                    )
                                })
                            }
                        </div>
                        <div className="col-12">
                            <button
                                className="btn-primary btn-save-schedule"
                                onClick={() => this.handleSaveSchedule()}
                            >
                                <FormattedMessage id={"manage-schedule.save"} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allScheduleTime: state.admin.allScheduleTime,
        user: state.user.userInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
