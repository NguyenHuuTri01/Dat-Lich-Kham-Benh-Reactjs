import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import './TableManageSpecialty.scss';
import "react-markdown-editor-lite/lib/index.css";
import { getAllSpecialty, deleteSpecialty } from "../../../services/userService";
import { toast } from 'react-toastify';

class TableManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listSpecialty: {},
        };
    }
    async componentDidMount() {
        this.updateListSpecialty();
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        let { updatelist } = this.props;
        if (updatelist) {
            this.updateListSpecialty();
            this.props.handleUnUpdateList();
        }
    }
    updateListSpecialty = async () => {
        let list = await getAllSpecialty();
        if (list && list.errCode === 0) {
            this.setState({
                listSpecialty: list
            })
        }
    }
    handleDeleteSpecialty = async (item) => {
        let res = await deleteSpecialty(item.id);
        if (res && res.errCode === 0) {
            toast.success('Delete Specialty is success!');
            this.updateListSpecialty();
        }
    };
    handleEditSpecialty = (item) => {
        this.props.handleEditSpecialtyFromParent(item);
    };
    render() {
        let { listSpecialty } = this.state;
        return (
            <React.Fragment>
                <table id="TableManageSpecialty">
                    <tbody>
                        <tr>
                            <th>Tên Phòng Khám</th>
                            <th>Actions</th>
                        </tr>
                        {listSpecialty && listSpecialty.data &&
                            listSpecialty.data.length > 0 &&
                            listSpecialty.data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>
                                            <button
                                                className="btn-edit"
                                                onClick={() => this.handleEditSpecialty(item)}
                                            >
                                                <i className="fas fa-pencil-alt"></i>
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => this.handleDeleteSpecialty(item)}
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

export default connect(mapStateToProps, mapDispatchToProps)(TableManageSpecialty);
