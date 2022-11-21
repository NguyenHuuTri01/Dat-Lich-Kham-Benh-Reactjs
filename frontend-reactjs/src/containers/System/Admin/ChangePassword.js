import React, { Component } from "react";
import { connect } from "react-redux";
import './ChangePassword.scss';
import { changePassword } from '../../../services/userService';

class ChangePassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            newPassword: '',
            confirmPassword: ''
        }
    }
    async componentDidMount() {
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }
    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }
    handleOnChangePassword = async () => {
        let res = await changePassword({
            password: this.state.password,
            newPassword: this.state.newPassword,
            confirmPassword: this.state.confirmPassword,
            userId: this.props.user.id
        });
        if (res && res.errCode === 0) {
            alert(res.errMessage);
            this.setState({
                password: '',
                newPassword: '',
                confirmPassword: '',
            })
        } else {
            alert(res.errMessage)
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
                                <input
                                    type="password"
                                    value={this.state.password}
                                    onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                    className="inputText"
                                    placeholder=" "
                                    required
                                />
                                <label>Password</label>
                            </div>
                            <div className="group">
                                <input
                                    type="password"
                                    value={this.state.newPassword}
                                    onChange={(event) => this.handleOnChangeInput(event, 'newPassword')}
                                    className="inputText"
                                    placeholder=" "
                                    required />
                                <label>New Password</label>
                            </div>
                            <div className="group">
                                <input
                                    type="password"
                                    value={this.state.confirmPassword}
                                    onChange={(event) => this.handleOnChangeInput(event, 'confirmPassword')}
                                    className="inputText"
                                    placeholder=" "
                                    required />
                                <label>Confirm Password</label>
                            </div>
                            <button
                                className="btn-save"
                                onClick={() => this.handleOnChangePassword()}
                            >Save</button>
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
        user: state.user.userInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
