import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { getAllClinic } from "../../../../services/userService";
import HomeHeader from "../../HomeHeader";
import './more_Clinic.scss';

class more_Clinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrClinic: [],
            searchTerm: '',
        }
    }
    async componentDidMount() {
        this.getAllClinicInfor();

    }
    getAllClinicInfor = async () => {
        let res = await getAllClinic();
        this.setState({
            arrClinic: res.data
        })
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }
    handleViewClinic = (clinicId) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinicId}`);
        }
    }
    handleViewAddress = (address) => {
        for (let i = 0; i < address.length; i++) {
            if (address[i] !== '.') {

            } else {
            }
        }
    }
    handleChangeSearch = (event) => {
        this.setState({
            searchTerm: event.target.value
        })
    }

    render() {
        let { arrClinic, searchTerm } = this.state;
        return (
            <>
                <HomeHeader />
                <div className="search-clinic">
                    <div className="search-clinic-containter">
                        <i className="fas fa-search"></i>
                        <input
                            placeholder="Search clinic..."
                            onChange={(event) => this.handleChangeSearch(event)}
                        />
                    </div>
                </div>
                <div className="all-clinic">
                    {arrClinic && arrClinic.length > 0 &&
                        arrClinic.filter((item) => {
                            return searchTerm.toLowerCase() === '' ?
                                item : item.name.toLowerCase().includes(searchTerm.toLowerCase());
                        }
                        ).map((item, index) => {
                            return (
                                <div
                                    className="all-item-clinic"
                                    onClick={() => this.handleViewClinic(item.id)}
                                    key={item.id}
                                >
                                    <div
                                        className="img-clinic"
                                        style={{ backgroundImage: `url(${item.image})` }}
                                    >
                                    </div>
                                    <div className="detail-clinic">
                                        <div className="name-clinic">{item.name}</div>
                                        <div className="address-clinic">{item.address}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
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
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(more_Clinic);
