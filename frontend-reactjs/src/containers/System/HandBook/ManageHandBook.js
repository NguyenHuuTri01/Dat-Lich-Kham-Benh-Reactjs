import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import './ManageHandBook.scss';
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import TableManageHandBook from './TableManageHandBook';
import { createNewHandBook, editHandBook } from "../../../services/userService";
import { toast } from 'react-toastify';
import { CommonUtils, CRUD_ACTION } from "../../../utils";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageHandBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            title: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            previewImgURL: "",
            isOpen: false,
            action: CRUD_ACTION.CREATE
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
    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                imageBase64: base64,
            });
        }
    };
    openPreviewImage = () => {
        if (!this.state.previewImgURL) return;
        this.setState({
            isOpen: true,
        });
    };
    handleEditHandBookFromParent = (itemHandbook) => {
        this.setState({
            id: itemHandbook.id,
            title: itemHandbook.title,
            previewImgURL: itemHandbook.image,
            descriptionHTML: itemHandbook.descriptionHTML,
            descriptionMarkdown: itemHandbook.descriptionMarkdown,
            action: CRUD_ACTION.EDIT,
            imageBase64: itemHandbook.image
        })
    }
    handleSaveNewHandBook = async () => {
        if (this.state.action === CRUD_ACTION.CREATE) {
            let res = await createNewHandBook(this.state);
            if (res && res.errCode === 0) {
                toast.success('Create a new handbook is success!');
                this.setState({
                    title: '',
                    previewImgURL: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                })
            } else {
                toast.error('Create a new handbook is failed!');
            }
        }
        if (this.state.action === CRUD_ACTION.EDIT) {
            let res = await editHandBook(this.state);
            if (res && res.errCode === 0) {
                toast.success('Update the handbook is success!');
                this.setState({
                    title: '',
                    previewImgURL: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    action: CRUD_ACTION.CREATE
                })
            } else {
                toast.error('Update the handbook is failed!');
            }
        }
    }
    handleReloadInput = () => {
        this.setState({
            title: '',
            previewImgURL: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            action: CRUD_ACTION.CREATE
        })
    }
    render() {
        return (
            <div className="manage-handbook-container">
                <div className="manage-handbook-title">
                    Quản lý cẩm nang
                </div>
                <div className="add-new-handbook row">
                    <div className="col-6 form-group">
                        <label>Tiêu đề</label>
                        <input
                            className="form-control"
                            type="text"
                            value={this.state.title}
                            onChange={(event) => this.handleOnChangeInput(event, 'title')}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label>Ảnh minh họa</label>
                        <div className="preview-img-container">
                            <input
                                id="previewImg"
                                type="file"
                                hidden
                                onChange={(event) => this.handleOnChangeImage(event)}
                            />
                            <label className="label-upload" htmlFor="previewImg">
                                Tải ảnh <i className="fas fa-upload"></i>
                            </label>
                            <div
                                className="preview-image"
                                style={{
                                    backgroundImage: `url(${this.state.previewImgURL})`,
                                }}
                                onClick={() => this.openPreviewImage()}
                            ></div>
                        </div>
                    </div>
                    <div className="col-12">
                        <MdEditor
                            style={{ height: "400px" }}
                            renderHTML={(text) => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className="col-12">
                        <button
                            className={this.state.action === CRUD_ACTION.CREATE ? "btn-create-handbook" : 'btn-save-handbook'}
                            onClick={() => this.handleSaveNewHandBook()}
                        >
                            Save
                        </button>
                        <button className="btn-reload-input"
                            onClick={() => this.handleReloadInput()}
                        >
                            Reload
                        </button>
                    </div>
                    <TableManageHandBook
                        handleEditHandBookFromParent={this.handleEditHandBookFromParent}
                    />
                </div>
                {this.state.isOpen === true && (
                    <Lightbox
                        mainSrc={this.state.previewImgURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                )}
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
