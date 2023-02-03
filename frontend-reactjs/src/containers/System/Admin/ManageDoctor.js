import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";
import { CRUD_ACTION, LANGUAGES } from "../../../utils";

import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import "./ManageDoctor.scss"
import Select from 'react-select';
import { getDetailInforDoctor } from "../../../services/userService";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // save to Markdown table
      contentMarkdown: '',
      contentHTML: '',
      selectedDoctor: '',
      description: '',
      listDoctors: [],
      hasOldData: false,

      // save to doctor_infor table
      listPrice: [],
      listPayment: [],
      listProvince: [],
      listClinic: [],
      listSpecialty: [],

      selectedPrice: '',
      selectedPayment: '',
      selectedProvince: '',
      selectedClinic: '',
      selectedSpecialty: '',

      // nameClinic: '',
      // addressClinic: '',
      note: '',
      clinicId: '',
      specialtyId: ''
    };
  }
  componentDidMount() {
    this.props.fetchAllDoctors();
    this.props.getAllRequiredDoctorInfor();
  }

  buildDataInputSelect = (inputData, type) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      if (type === 'USERS') {
        inputData.map((item, index) => {
          let object = {};
          let labelVi = `${item.lastName} ${item.firstName}`;
          let labelEn = `${item.firstName} ${item.lastName}`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.id;
          result.push(object);
        })
      }
      if (type === 'PRICE') {
        inputData.map((item, index) => {
          let object = {};
          let labelVi = `${item.valueVi}`;
          let labelEn = `${item.valueEn} USD`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
          result.push(object);
        })
      }
      if (type === 'PAYMENT' || type === 'PROVINCE') {
        inputData.map((item, index) => {
          let object = {};
          let labelVi = `${item.valueVi}`;
          let labelEn = `${item.valueEn}`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
          result.push(object);
        })
      }
      if (type === 'SPECIALTY') {
        inputData.map((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object);
        })
      }
      if (type === 'CLINIC') {
        inputData.map((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object);
        })
      }
    }
    return result;
  }
  doctorLogin = (inputData) => {
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
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
      if (this.props.user.roleId === 'R2') {
        let selectedDoctorDefault = this.doctorLogin(this.props.user)
        this.setState({
          listDoctors: selectedDoctorDefault,
          selectedDoctor: selectedDoctorDefault[0]
        })
        this.handleChangeSelect(this.state.selectedDoctor);
      } else {
        this.setState({
          listDoctors: dataSelect
        })
      }
    }

    if (prevProps.allRequiredDoctorIntor !== this.props.allRequiredDoctorIntor) {
      let { resPrice, resPayment, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorIntor;

      let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
      let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
      let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
      let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');
      let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC')

      this.setState({
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
        listSpecialty: dataSelectSpecialty,
        listClinic: dataSelectClinic
      })
    }

    if (prevProps.language !== this.props.language) {
      let { resPrice, resPayment, resProvince, resClinic } = this.props.allRequiredDoctorIntor;
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors, "USERS")
      let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
      let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
      let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
      let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC')

      this.setState({
        listDoctors: dataSelect,
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
        listClinic: dataSelectClinic
      })
      let selectedDoctorDefault = this.doctorLogin(this.props.user)
      this.setState({
        selectedDoctor: selectedDoctorDefault[0]
      })
    }
  }
  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentMarkdown: text,
      contentHTML: html,
    })
  }

  handleSaveContentMarkdown = async () => {
    let { hasOldData } = this.state;
    this.props.saveDetailDoctor({
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      description: this.state.description,
      doctorId: this.state.selectedDoctor.value,
      action: hasOldData === true ? CRUD_ACTION.EDIT : CRUD_ACTION.CREATE,

      selectedPrice: this.state.selectedPrice.value,
      selectedPayment: this.state.selectedPayment.value,
      selectedProvince: this.state.selectedProvince.value,
      // nameClinic: this.state.nameClinic,
      // addressClinic: this.state.addressClinic,
      note: this.state.note,
      clinicId: this.state.selectedClinic && this.state.selectedClinic.value ?
        this.state.selectedClinic.value : '',
      specialtyId: this.state.selectedSpecialty.value,
    })

  }

  handleChangeSelect = async (selectedDoctor) => {
    this.setState({ selectedDoctor });
    let { listPayment, listPrice, listProvince, listSpecialty, listClinic } = this.state;
    let res = await getDetailInforDoctor(selectedDoctor.value)
    if (res && res.errCode === 0 && res.data && res.data.Markdown) {
      let markdown = res.data.Markdown;

      let addressClinic = '', nameClinic = '', note = '', paymentId = '', priceId = '', clinicId = '',
        provinceId = '', selectedPrice = '', selectedPayment = '', selectedProvince = '',
        specialtyId = '', selectedSpecialty = '', selectedClinic = ''

      if (res.data.Doctor_Infor) {
        // addressClinic = res.data.Doctor_Infor.addressClinic;
        // nameClinic = res.data.Doctor_Infor.nameClinic;
        note = res.data.Doctor_Infor.note;

        paymentId = res.data.Doctor_Infor.paymentId;
        priceId = res.data.Doctor_Infor.priceId;
        provinceId = res.data.Doctor_Infor.provinceId;
        specialtyId = res.data.Doctor_Infor.specialtyId;
        clinicId = res.data.Doctor_Infor.clinicId;

        selectedPrice = listPrice.find(item => {
          return item && item.value === priceId;
        })
        selectedPayment = listPayment.find(item => {
          return item && item.value === paymentId;
        })
        selectedProvince = listProvince.find(item => {
          return item && item.value === provinceId;
        })
        selectedSpecialty = listSpecialty.find(item => {
          return item && item.value === specialtyId;
        })
        selectedClinic = listClinic.find(item => {
          return item && item.value === clinicId;
        })
      }

      this.setState({
        contentHTML: markdown.contentHTML,
        contentMarkdown: markdown.contentMarkdown,
        description: markdown.description,
        hasOldData: true,
        // addressClinic: addressClinic,
        // nameClinic: nameClinic,
        note: note,
        selectedPrice: selectedPrice,
        selectedPayment: selectedPayment,
        selectedProvince: selectedProvince,
        selectedSpecialty: selectedSpecialty,
        selectedClinic: selectedClinic
      })
    } else {
      this.setState({
        contentHTML: '',
        contentMarkdown: '',
        description: '',
        hasOldData: false,
        // addressClinic: '',
        // nameClinic: '',
        note: '',
        selectedPrice: '',
        selectedPayment: '',
        selectedProvince: '',
        selectedSpecialty: '',
        selectedClinic: ''
      })
    }
  };

  handleChangeSelectDoctorInfor = async (selectedOption, name) => {
    let stateName = name.name;
    let stateCopy = { ...this.state };
    stateCopy[stateName] = selectedOption;
    this.setState({
      ...stateCopy
    })
  }

  handleOnChangeText = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy
    })
  }
  render() {
    let { hasOldData } = this.state;
    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title">
          <FormattedMessage id="system.admin.manage-doctor.title" />
        </div>
        <div className="more-infor">
          <div className="content-left form-group">
            <label><FormattedMessage id="system.admin.manage-doctor.select-doctor" /></label>
            <Select
              value={this.state.selectedDoctor}
              onChange={this.handleChangeSelect}
              options={this.state.listDoctors}
              placeholder={<FormattedMessage id="system.admin.manage-doctor.select-doctor" />}
            />
          </div>
          <div className="content-right">
            <label><FormattedMessage id="system.admin.manage-doctor.intro" /></label>
            <textarea className="form-control"
              onChange={(event) => this.handleOnChangeText(event, 'description')}
              value={this.state.description}
            >
            </textarea>
          </div>
        </div>
        <div className="more-infor-extra row">
          <div className="col-4 form-group">
            <label><FormattedMessage id="system.admin.manage-doctor.price" /></label>
            <Select
              value={this.state.selectedPrice}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listPrice}
              placeholder={<FormattedMessage id="system.admin.manage-doctor.price" />}
              name="selectedPrice"
            />
          </div>
          <div className="col-4 form-group">
            <label><FormattedMessage id="system.admin.manage-doctor.payment" /></label>
            <Select
              value={this.state.selectedPayment}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listPayment}
              placeholder={<FormattedMessage id="system.admin.manage-doctor.payment" />}
              name="selectedPayment"
            />
          </div>
          <div className="col-4 form-group">
            <label><FormattedMessage id="system.admin.manage-doctor.province" /></label>
            <Select
              value={this.state.selectedProvince}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listProvince}
              placeholder={<FormattedMessage id="system.admin.manage-doctor.province" />}
              name="selectedProvince"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-4 form-group">
            <label><FormattedMessage id="system.admin.manage-doctor.note" /></label>
            <input className="form-control"
              onChange={(event) => this.handleOnChangeText(event, 'note')}
              value={this.state.note}
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="system.admin.manage-doctor.specialty" />
            </label>
            <Select
              value={this.state.selectedSpecialty}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listSpecialty}
              placeholder={<FormattedMessage id="system.admin.manage-doctor.specialty" />}
              name="selectedSpecialty"
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="system.admin.manage-doctor.select-clinic" />
            </label>
            <Select
              value={this.state.selectedClinic}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listClinic}
              placeholder={<FormattedMessage id="system.admin.manage-doctor.select-clinic" />}
              name="selectedClinic"
            />
          </div>
        </div>
        <div className="manage-doctor-editor">
          <MdEditor
            style={{ height: "300px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
            value={this.state.contentMarkdown}
          />
        </div>
        <button
          onClick={(event) => this.handleSaveContentMarkdown(event)}
          className={hasOldData === true ? "save-content-doctor" : "create-content-doctor"}>
          {hasOldData === true ?
            <span>
              <FormattedMessage id="system.admin.manage-doctor.save" />
            </span>
            :
            <span>
              <FormattedMessage id="system.admin.manage-doctor.add" />
            </span>
          }
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    allDoctors: state.admin.allDoctors,
    allRequiredDoctorIntor: state.admin.allRequiredDoctorIntor,
    user: state.user.userInfo
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    getAllRequiredDoctorInfor: () => dispatch(actions.getRequireDoctorInfor()),
    saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
