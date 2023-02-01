const db = require("../models");

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name
                || !data.address
                || !data.imageBase64
                || !data.descriptionHTML
                || !data.descriptionMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                })
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}
let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll(
                {
                    order: [["createdAt", "DESC"]],
                }
            );
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, "base64").toString("binary");
                    return item;
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'Ok',
                data
            })
        } catch (e) {
            reject(e);
        }
    })
}
let getTopClinicHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({
                limit: limit,
                order: [["createdAt", "DESC"]]
            });
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, "base64").toString("binary");
                    return item;
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'Ok',
                data
            })
        } catch (e) {
            reject(e);
        }
    });
};
let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Clinic.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown'],
                })
                if (data) {
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: { clinicId: inputId },
                        attributes: ['doctorId', 'provinceId'],
                    })

                    data.doctorClinic = doctorClinic;

                } else data = {};

                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}
let handleEditClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name
                || !data.address
                || !data.descriptionHTML
                || !data.descriptionMarkdown
                || !data.imageBase64
                || !data.id
            ) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing require parameters",
                });
                return;
            }
            let clinic = await db.Clinic.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (clinic) {
                clinic.name = data.name;
                clinic.address = data.address;
                clinic.image = data.imageBase64;
                clinic.descriptionHTML = data.descriptionHTML;
                clinic.descriptionMarkdown = data.descriptionMarkdown;
                await clinic.save();
                resolve({
                    errCode: 0,
                    message: "Update the clinic succeeds!",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `Clinic's not found!`,
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}
let handleDelelteClinic = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinic = await db.Clinic.findOne({
                where: { id: inputId },
            });
            if (!clinic) {
                resolve({
                    errCode: 2,
                    errMessage: `The clinic isn't exists`,
                });
            }
            await db.Clinic.destroy({
                where: { id: inputId },
            });
            resolve({
                errCode: 0,
                message: "The clinic is deleted",
            });

        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById,
    getTopClinicHome: getTopClinicHome,
    handleEditClinic: handleEditClinic,
    handleDelelteClinic: handleDelelteClinic,
}