import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./TableManageHandBook.scss";
import * as actions from "../../../store/actions";
import "react-markdown-editor-lite/lib/index.css";
import { getAllHandBook, deleteHandBook } from "../../../services/userService";
import { toast } from 'react-toastify';

class TableManageHandBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listHandBook: {},
            title: '',
        };
    }
    async componentDidMount() {
        this.updateListHandBook();
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.updatelist) {
            this.updateListHandBook();
            this.props.handleUnUpdateList();
        }
    }
    updateListHandBook = async () => {
        let list = await getAllHandBook();
        if (list && list.errCode === 0) {
            this.setState({
                listHandBook: list,
            })
        }
    }
    handleDeleteHandBook = async (item) => {
        let answer = window.confirm("Bạn muốn xóa cẩm nang này");
        if (answer) {
            let res = await deleteHandBook(item.id);
            if (res && res.errCode === 0) {
                toast.success('Delete handbook is success!');
                this.updateListHandBook();
            }
        } else {
            // do something
        }
    };
    handleEditHandBook = (item) => {
        this.props.handleEditHandBookFromParent(item);
    };
    render() {
        let { listHandBook } = this.state;
        return (
            <React.Fragment>
                <table id="TableManageHandBook">
                    <tbody>
                        <tr>
                            <th>Title</th>
                            <th>Actions</th>
                        </tr>
                        {listHandBook && listHandBook.data &&
                            listHandBook.data.length > 0 &&
                            listHandBook.data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.title}</td>
                                        <td>
                                            <button
                                                className="btn-edit"
                                                onClick={() => this.handleEditHandBook(item)}
                                            >
                                                <i className="fas fa-pencil-alt"></i>
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => this.handleDeleteHandBook(item)}
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

export default connect(mapStateToProps, mapDispatchToProps)(TableManageHandBook);
