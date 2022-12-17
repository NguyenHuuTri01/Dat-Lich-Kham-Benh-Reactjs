import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { getAllSpecialty } from '../../../../services/userService';
import HomeHeader from "../../HomeHeader";
import './more_Specialty.scss';

class more_Specialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrSpecialty: [],
            searchTerm: ''
        }
    }
    async componentDidMount() {
        let allSpecialty = await getAllSpecialty();
        if (allSpecialty.errCode === 0) {
            this.setState({
                arrSpecialty: allSpecialty.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }
    handleViewSpecialty = (idSpecialty) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${idSpecialty}`);
        }
    }
    handleChangeSearch = (event) => {
        this.setState({
            searchTerm: event.target.value
        })
    }
    render() {
        let { arrSpecialty, searchTerm } = this.state;
        return (
            <>
                <HomeHeader />
                <div className="search-specialty">
                    <div className="search-specialty-containter">
                        <i className="fas fa-search"></i>
                        <input
                            placeholder="Search specialty..."
                            onChange={(event) => this.handleChangeSearch(event)}
                        />
                    </div>
                </div>
                <div className="all-specialty">
                    {
                        arrSpecialty && arrSpecialty.length > 0 &&
                        arrSpecialty.filter((item) => {
                            return searchTerm.toLowerCase() === '' ?
                                item : item.name.toLowerCase().includes(searchTerm.toLowerCase());
                        }
                        )
                            .map((item) => {
                                return (
                                    <div
                                        className="all-item-specialty"
                                        onClick={() => this.handleViewSpecialty(item.id)}
                                        key={item.id}
                                    >
                                        <div
                                            className="img-specialty"
                                            style={{ backgroundImage: `url(${item.image})` }}
                                        >
                                        </div>
                                        <div className="name-specialty">{item.name}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(more_Specialty);
