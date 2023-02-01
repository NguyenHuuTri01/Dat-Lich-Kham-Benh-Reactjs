import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import './ManageSpecialty.scss';
import { CommonUtils, CRUD_ACTION } from "../../../utils";
import { createNewSpecialty, editSpecialty } from '../../../services/userService';
import TableManageSpecialty from './TableManageSpecialty';
import Lightbox from "react-image-lightbox";
import { toast } from "react-toastify";

const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            previewImgURL: "",
            action: CRUD_ACTION.CREATE,
            updatelist: false,
            isOpen: false,
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
                imageBase64: base64,
                previewImgURL: objectUrl
            });
        }
    };
    handleSaveNewSpecialty = async () => {
        let { action } = this.state;
        if (action === CRUD_ACTION.CREATE) {
            let res = await createNewSpecialty(this.state);
            if (res && res.errCode === 0) {
                toast.success('Add new specialty succedd!');
                this.setState({
                    name: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    previewImgURL: '',
                    updatelist: true
                })
            } else {
                toast.error('Something Wrongs....');
            }
        }
        if (action === CRUD_ACTION.EDIT) {
            let res = await editSpecialty(this.state);
            if (res && res.errCode === 0) {
                toast.success('Update the specialty is success!');
                this.setState({
                    name: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    previewImgURL: '',
                    updatelist: true
                })
            } else {
                toast.error('Update the specialty is failed!');
            }
        }
    }
    openPreviewImage = () => {
        if (!this.state.previewImgURL) return;
        this.setState({
            isOpen: true,
        });
    };
    handleEditSpecialtyFromParent = (itemSpecialty) => {
        this.setState({
            id: itemSpecialty.id,
            name: itemSpecialty.name,
            previewImgURL: itemSpecialty.image,
            descriptionHTML: itemSpecialty.descriptionHTML,
            descriptionMarkdown: itemSpecialty.descriptionMarkdown,
            action: CRUD_ACTION.EDIT,
            imageBase64: itemSpecialty.image
        })
    }
    handleUnUpdateList = () => {
        this.setState({
            updatelist: false
        })
    }
    render() {
        let { action, name, descriptionMarkdown, updatelist, previewImgURL } = this.state;
        return (
            <div className="manage-specialty-container">
                <div className="manage-specialty-title">
                    Quản lý chuyên khoa
                </div>
                <div className="add-new-specialty row">
                    <div className="col-6 form-group">
                        <label>Tên chuyên khoa:</label>
                        <input
                            className="form-control"
                            type="text"
                            value={name}
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label>Ảnh chuyên khoa:</label>
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
                        <label>Thông tin chi tiết:</label>
                        <MdEditor
                            style={{ height: "350px" }}
                            renderHTML={(text) => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={descriptionMarkdown}
                        />
                    </div>
                    <div className="col-12">
                        <button
                            className={
                                action === CRUD_ACTION.CREATE ?
                                    "btn-create-specialty" :
                                    "btn-save-specialty"
                            }
                            onClick={() => this.handleSaveNewSpecialty()}
                        >
                            {action === CRUD_ACTION.CREATE ? "Create" : "Save"}
                        </button>
                    </div>
                    <TableManageSpecialty
                        handleEditSpecialtyFromParent={this.handleEditSpecialtyFromParent}
                        updatelist={updatelist}
                        handleUnUpdateList={this.handleUnUpdateList}
                    />
                </div>
                {this.state.isOpen === true && (
                    <Lightbox
                        mainSrc={previewImgURL}
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
