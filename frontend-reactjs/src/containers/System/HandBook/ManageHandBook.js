import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import './ManageHandBook.scss';
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import TableManageHandBook from './TableManageHandBook';
import { createNewHandBook, editHandBook } from "../../../services/userService";
import { toast } from 'react-toastify';
const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageHandBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            descriptionHTML: '',
            descriptionMarkdown: ''
        }
    }
    async componentDidMount() {
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }
    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state }
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }
    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        })
    }
    handleEditHandBookFromParent = (itemHandbook) => {
        this.setState({
            title: itemHandbook.title,
            descriptionHTML: itemHandbook.descriptionHTML,
            descriptionMarkdown: itemHandbook.descriptionMarkdown
        })
    }
    handleSaveNewHandBook = async () => {
        let res = await createNewHandBook(this.state);
        if (res && res.errCode === 0) {
            toast.success('Create a new handbook is success!');
        }
    }
    render() {
        return (
            <div className="manage-specialty-container">
                <div className="manage-specialty-title">
                    Quản lý cẩm nang
                </div>
                <div className="add-new-specialty row">
                    <div className="col-12 form-group">
                        <label>Tiêu đề</label>
                        <input
                            className="form-control"
                            type="text"
                            value={this.state.title}
                            onChange={(event) => this.handleOnChangeInput(event, 'title')}
                        />
                    </div>
                    <div className="col-12">
                        <MdEditor
                            style={{ height: "300px" }}
                            renderHTML={(text) => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className="col-12">
                        <button className="btn-save-specialty"
                            onClick={() => this.handleSaveNewHandBook()}
                        >
                            Save
                        </button>
                    </div>
                    <TableManageHandBook
                        handleEditHandBookFromParent={this.handleEditHandBookFromParent}
                    />
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageHandBook);
