import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import './DetailHandBook.scss';
import HomeHeader from "../../HomaPage/HomeHeader";
import { getDetailHandBookById } from '../../../services/userService';
import _ from "lodash";

class DetailHandBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataDetailHandBook: {},
        }
    }
    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getDetailHandBookById(id);
            if (res && res.errCode === 0) {
                this.setState(
                    {
                        dataDetailHandBook: res.data
                    }
                )
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }

    render() {
        let { dataDetailHandBook } = this.state;
        return (
            <div className="detail-specialty-container">
                <HomeHeader />
                <div className="detail-specialty-body">
                    {
                        dataDetailHandBook && !_.isEmpty(dataDetailHandBook)
                        && <>
                            <div className="title-handbook">
                                {dataDetailHandBook.title}
                            </div>
                            <div
                                className="description-handbook"
                                dangerouslySetInnerHTML={{ __html: dataDetailHandBook.descriptionHTML }}
                            >
                            </div>
                        </>
                    }
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailHandBook);
