import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import './TableManageClinic.scss';
import "react-markdown-editor-lite/lib/index.css";
import { getAllClinic, deleteClinic } from "../../../services/userService";
import { toast } from 'react-toastify';

class TableManageClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listClinic: {},
        };
    }
    async componentDidMount() {
        this.updateListClinic();
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        let { updatelist } = this.props;
        if (updatelist) {
            this.updateListClinic();
            this.props.handleUnUpdateList();
        }
    }
    updateListClinic = async () => {
        let list = await getAllClinic();
        if (list && list.errCode === 0) {
            this.setState({
                listClinic: list
            })
        }
    }
    handleDeleteClinic = async (item) => {
        let res = await deleteClinic(item.id);
        if (res && res.errCode === 0) {
            toast.success('Delete clinic is success!');
            this.updateListClinic();
        }
    };
    handleEditClinic = (item) => {
        this.props.handleEditClinicFromParent(item);
    };
    render() {
        let { listClinic } = this.state;
        return (
            <React.Fragment>
                <table id="TableManageClinic">
                    <tbody>
                        <tr>
                            <th>Tên Phòng Khám</th>
                            <th>Actions</th>
                        </tr>
                        {listClinic && listClinic.data &&
                            listClinic.data.length > 0 &&
                            listClinic.data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>
                                            <button
                                                className="btn-edit"
                                                onClick={() => this.handleEditClinic(item)}
                                            >
                                                <i className="fas fa-pencil-alt"></i>
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => this.handleDeleteClinic(item)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageClinic);
