import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import HomeHeader from "../../HomeHeader";
import './more_Doctor.scss';

class more_Doctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }
    render() {
        return (
            <>
                <HomeHeader />
                <div>
                    Hello word more doctor
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
