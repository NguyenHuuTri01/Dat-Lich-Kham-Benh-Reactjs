import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import './ManageClinic.scss';
import { CommonUtils, CRUD_ACTION } from "../../../utils";
import { createNewClinic, editClinic } from '../../../services/userService';
import { toast } from "react-toastify";
import Lightbox from "react-image-lightbox";
import TableManageClinic from "./TableManageClinic";

const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            address: '',
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
    handleSaveNewClinic = async () => {
        let { action } = this.state;
        if (action === CRUD_ACTION.CREATE) {
            let res = await createNewClinic(this.state);
            if (res && res.errCode === 0) {
                toast.success('Add new clinic succedd!');
                this.setState({
                    name: '',
                    address: '',
                    previewImgURL: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    updatelist: true
                })
            } else {
                toast.error('Something Wrongs....');
            }
        }
        if (action === CRUD_ACTION.EDIT) {
            let res = await editClinic(this.state);
            if (res && res.errCode === 0) {
                toast.success('Update the clinic is success!');
                this.setState({
                    name: '',
                    address: '',
                    previewImgURL: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    action: CRUD_ACTION.CREATE,
                    updatelist: true
                })
            } else {
                toast.error('Update the clinic is failed!');
            }
        }
    }
    openPreviewImage = () => {
        if (!this.state.previewImgURL) return;
        this.setState({
            isOpen: true,
        });
    };
    handleEditClinicFromParent = (itemClinic) => {
        this.setState({
            id: itemClinic.id,
            name: itemClinic.name,
            address: itemClinic.address,
            previewImgURL: itemClinic.image,
            descriptionHTML: itemClinic.descriptionHTML,
            descriptionMarkdown: itemClinic.descriptionMarkdown,
            action: CRUD_ACTION.EDIT,
            imageBase64: itemClinic.image
        })
    }
    handleUnUpdateList = () => {
        this.setState({
            updatelist: false
        })
    }
    render() {
        return (
            <div className="manage-clinic-container">
                <div className="manage-clinic-title">
                    Quản lý phòng khám
                </div>
                <div className="add-new-clinic row">
                    <div className="col-6 form-group">
                        <label>Tên phòng khám:</label>
                        <input
                            className="form-control"
                            type="text"
                            value={this.state.name}
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label>Ảnh phòng khám:</label>
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
                    <div className="col-6 form-group">
                        <label>Địa chỉ phòng khám:</label>
                        <input
                            className="form-control"
                            type="text"
                            value={this.state.address}
                            onChange={(event) => this.handleOnChangeInput(event, 'address')}
                        />
                    </div>
                    <div className="col-12">
                        <label>Thông tin chi tiết:</label>
                        <MdEditor
                            style={{ height: "300px" }}
                            renderHTML={(text) => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className="col-12">
                        <button
                            className={this.state.action === CRUD_ACTION.CREATE ?
                                "btn-create-clinic" :
                                "btn-save-clinic"}
                            onClick={() => this.handleSaveNewClinic()}
                        >
                            {this.state.action === CRUD_ACTION.CREATE ? "Create" : "Save"}
                        </button>
                    </div>
                    <TableManageClinic
                        handleEditClinicFromParent={this.handleEditClinicFromParent}
                        updatelist={this.state.updatelist}
                        handleUnUpdateList={this.handleUnUpdateList}
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
