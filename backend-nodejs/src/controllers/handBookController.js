import handBookService from '../services/handBookService';

let createHandBook = async (req, res) => {
    try {
        let infor = await handBookService.createHandBook(req.body);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let getAllHandBook = async (req, res) => {
    try {
        let infor = await handBookService.getAllHandBook();
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let handleEditHandBook = async (req, res) => {
    try {
        let infor = await handBookService.handleEditHandBook(req.body);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let handleDelelteHandBook = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters!",
        });
    }
    let message = await handBookService.handleDelelteHandBook(req.body.id);
    return res.status(200).json(message);
}
let getDetailHandBookById = async (req, res) => {
    try {
        let infor = await handBookService.getDetailHandBookById(req.query.id);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
module.exports = {
    createHandBook: createHandBook,
    handleEditHandBook: handleEditHandBook,
    handleDelelteHandBook: handleDelelteHandBook,
    getAllHandBook: getAllHandBook,
    getDetailHandBookById: getDetailHandBookById,
}