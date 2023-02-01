const db = require("../models");


let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name
                || !data.imageBase64
                || !data.descriptionHTML
                || !data.descriptionMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Specialty.create({
                    name: data.name,
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
let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll(
                {
                    order: [["createdAt", "DESC"]],
                }
            );
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer.from(item.image, "base64").toString("binary");
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
let getTopSpecialty = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll(
                {
                    limit: limit,
                    order: [["createdAt", "DESC"]]
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
let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Specialty.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],
                })
                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    } else {
                        // find by location
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    }

                    data.doctorSpecialty = doctorSpecialty;

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
let handleEditSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name
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
            let specialty = await db.Specialty.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (specialty) {
                specialty.name = data.name;
                specialty.image = data.imageBase64;
                specialty.descriptionHTML = data.descriptionHTML;
                specialty.descriptionMarkdown = data.descriptionMarkdown;
                await specialty.save();
                resolve({
                    errCode: 0,
                    message: "Update the specialty succeeds!",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `Specialty's not found!`,
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}
let handleDelelteSpecialty = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialty = await db.Specialty.findOne({
                where: { id: inputId },
            });
            if (!specialty) {
                resolve({
                    errCode: 2,
                    errMessage: `The specialty isn't exists`,
                });
            }
            await db.Specialty.destroy({
                where: { id: inputId },
            });
            resolve({
                errCode: 0,
                message: "The specialty is deleted",
            });

        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getTopSpecialty: getTopSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById,
    handleEditSpecialty: handleEditSpecialty,
    handleDelelteSpecialty: handleDelelteSpecialty,
}
