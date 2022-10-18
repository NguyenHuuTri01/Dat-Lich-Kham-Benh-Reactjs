import React, { Component } from "react";
import { connect } from "react-redux";
import './ChangePassword.scss';

class ChangePassword extends Component {

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
            <div className="change-password-body">
                <div className="change-password-container">
                    <div className="change-password-form">
                        <div className="change-password-content">
                            <h1>Đổi Mật Khẩu</h1>
                            <div className="group">
                                <input type="password" className="inputText" placeholder=" " required />
                                <label>Password</label>
                            </div>
                            <div className="group">
                                <input type="password" className="inputText" placeholder=" " required />
                                <label>New Password</label>
                            </div>
                            <div className="group">
                                <input type="password" className="inputText" placeholder=" " required />
                                <label>Confirm Password</label>
                            </div>
                            <button className="btn-save">Save</button>
                        </div>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
