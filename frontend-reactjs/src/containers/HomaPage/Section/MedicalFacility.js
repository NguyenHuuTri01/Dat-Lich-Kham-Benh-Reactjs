import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import { getAllClinic, getTopClinicHomeService } from '../../../services/userService';
import { withRouter } from 'react-router';
import './MedicalFacility.scss';
import { FormattedMessage } from "react-intl";

class MedicalFacility extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataClinics: []
    }
  }
  async componentDidMount() {
    let res = await getTopClinicHomeService(10);
    if (res && res.errCode === 0) {
      this.setState({
        dataClinics: res.data ? res.data : []
      })
    }
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.dataClinics !== this.state.dataClinics) {
      let res = await getTopClinicHomeService(10);
      if (res && res.errCode === 0) {
        this.setState({
          dataClinics: res.data ? res.data : []
        })
      }
    }
  }

  handleViewDetailClinic = (clinic) => {
    if (this.props.history) {
      this.props.history.push(`/detail-clinic/${clinic.id}`);
    }
  }
  handleMoreClinic = () => {
    if (this.props.history) {
      this.props.history.push(`/more-clinic/`);
    }
  }
  render() {
    let { dataClinics } = this.state;

    return (
      <div className="section-share section-medical-facility">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              <FormattedMessage id="homepage.outstanding-medical-facility" />
            </span>
            <button className="btn-section" onClick={() => this.handleMoreClinic()}>
              <FormattedMessage id="homepage.more-infor" />
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {
                dataClinics && dataClinics.length > 0 &&
                dataClinics.map((item, index) => {
                  return (
                    <div
                      className="section-customize clinic-child"
                      key={index}
                      onClick={() => this.handleViewDetailClinic(item)}
                    >
                      <div
                        className="bg-image section-medical-facility"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                      <div className="clinic-name">{item.name}</div>
                    </div>
                  )
                })
              }

            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
