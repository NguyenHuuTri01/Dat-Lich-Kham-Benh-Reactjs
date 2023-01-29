import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import HomeHeader from "../../HomeHeader";
import { getAllDoctors } from '../../../../services/userService';
import './more_Doctor.scss';
import { LANGUAGES } from "../../../../utils";

class more_Doctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrDoctor: [],
            searchTerm: ''
        }
    }
    async componentDidMount() {
        let allSpecialty = await getAllDoctors();
        if (allSpecialty.errCode === 0) {
            this.setState({
                arrDoctor: allSpecialty.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }
    handleViewDoctor = (idDoctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${idDoctor}`);
        }
    }
    handleChangeSearch = (event) => {
        this.setState({
            searchTerm: event.target.value
        })
    }
    render() {
        let { arrDoctor, searchTerm } = this.state;
        let { language } = this.props;
        return (
            <>
                <HomeHeader />
                <div className="search-doctor">
                    <div className="search-doctor-containter">
                        <i className="fas fa-search"></i>
                        <input
                            placeholder="Search doctor..."
                            onChange={(event) => this.handleChangeSearch(event)}
                        />
                    </div>
                </div>
                <div className="all-doctor">
                    {
                        arrDoctor && arrDoctor.length > 0 &&
                        arrDoctor.filter((item) => {
                            return searchTerm.toLowerCase() === '' ?
                                item : (item.firstName + item.lastName).toLowerCase().includes(searchTerm.toLowerCase());
                        }
                        )
                            .map((item) => {
                                return (
                                    <div
                                        className="all-item-doctor"
                                        onClick={() => this.handleViewDoctor(item.id)}
                                        key={item.id}
                                    >
                                        <div
                                            className="img-doctor"
                                            style={{ backgroundImage: `url(${item.image})` }}
                                        >
                                        </div>
                                        <div className="name-doctor">{
                                            language === LANGUAGES.VI ?
                                                `${item.lastName} ${item.firstName}` :
                                                `${item.firstName} ${item.lastName}`
                                        }</div>
                                    </div>
                                )
                            })}
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

export default connect(mapStateToProps, mapDispatchToProps)(more_Doctor);
