import clinicService from '../services/clinicService';

let createClinic = async (req, res) => {
    try {
        let infor = await clinicService.createClinic(req.body);
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
let getAllClinic = async (req, res) => {
    try {
        let infor = await clinicService.getAllClinic();
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
let getTopClinicHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await clinicService.getTopClinicHome(+limit);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        });
    }
};
let getDetailClinicById = async (req, res) => {
    try {
        let infor = await clinicService.getDetailClinicById(req.query.id);
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
let handleEditClinic = async (req, res) => {
    try {
        let infor = await clinicService.handleEditClinic(req.body);
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
let handleDelelteClinic = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters!",
        });
    }
    let message = await clinicService.handleDelelteClinic(req.body.id);
    return res.status(200).json(message);
}
module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById,
    getTopClinicHome: getTopClinicHome,
    handleEditClinic: handleEditClinic,
    handleDelelteClinic: handleDelelteClinic,
}