import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import { FormattedMessage } from "react-intl";
import { getAllHandBook } from '../../../services/userService';
import { withRouter } from 'react-router';

class HandBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataHandBook: []
    }
  }
  async componentDidMount() {
    let res = await getAllHandBook();
    if (res && res.errCode === 0) {
      this.setState({
        dataHandBook: res.data
      })
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

  }
  handleOnclick = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-handbook/${item.id}`);
    }
  }
  render() {
    let { dataHandBook } = this.state;
    return (
      <div className="section-share section-handbook">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              <FormattedMessage id="homepage.handbook" />
            </span>
            <button className="btn-section">
              <FormattedMessage id="homepage.more-infor" />
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {
                dataHandBook && dataHandBook.length > 0 &&
                dataHandBook.map((item, index) => {
                  return (
                    <div
                      className="section-customize"
                      key={index}
                      onClick={() => this.handleOnclick(item)}
                    >
                      <div
                        className="bg-image section-handbook"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                      <div>{item.title}</div>
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
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HandBook));
