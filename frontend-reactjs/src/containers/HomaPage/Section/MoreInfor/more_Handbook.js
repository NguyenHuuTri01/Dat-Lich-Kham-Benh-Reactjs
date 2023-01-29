import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import HomeHeader from "../../HomeHeader";
import { getAllHandBook } from '../../../../services/userService';
import './more_Handbook.scss';

class more_Handbook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrHandBook: [],
            searchTerm: ''
        }
    }
    async componentDidMount() {
        let allHandBook = await getAllHandBook();
        if (allHandBook.errCode === 0) {
            this.setState({
                arrHandBook: allHandBook.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }
    handleViewHandbook = (idHandbook) => {
        if (this.props.history) {
            this.props.history.push(`/detail-handbook/${idHandbook}`);
        }
    }
    handleChangeSearch = (event) => {
        this.setState({
            searchTerm: event.target.value
        })
    }
    render() {
        let { arrHandBook, searchTerm } = this.state;
        return (
            <>
                <HomeHeader />
                <div className="search-handbook">
                    <div className="search-handbook-containter">
                        <i className="fas fa-search"></i>
                        <input
                            placeholder="Search handbook..."
                            onChange={(event) => this.handleChangeSearch(event)}
                        />
                    </div>
                </div>
                <div className="all-handbook">
                    {
                        arrHandBook && arrHandBook.length > 0 &&
                        arrHandBook.filter((item) => {
                            return searchTerm.toLowerCase() === '' ?
                                item : item.title.toLowerCase().includes(searchTerm.toLowerCase());
                        }
                        )
                            .map((item) => {
                                return (
                                    <div
                                        className="all-item-handbook"
                                        onClick={() => this.handleViewHandbook(item.id)}
                                        key={item.id}
                                    >
                                        <div
                                            className="img-handbook"
                                            style={{ backgroundImage: `url(${item.image})` }}
                                        >
                                        </div>
                                        <div className="name-handbook">{item.title}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(more_Handbook);
