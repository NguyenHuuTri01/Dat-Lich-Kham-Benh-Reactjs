const db = require("../models");

let createHandBook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.title
                || !data.descriptionHTML
                || !data.descriptionMarkdown
                || !data.imageBase64
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.HandBook.create({
                    title: data.title,
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
let getAllHandBook = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.HandBook.findAll(
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
let handleEditHandBook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.title
                || !data.descriptionHTML
                || !data.descriptionMarkdown
                || !data.imageBase64
                || !data.id
            ) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing require parameters",
                });
            }
            let handbook = await db.HandBook.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (handbook) {
                handbook.title = data.title;
                handbook.image = data.imageBase64;
                handbook.descriptionHTML = data.descriptionHTML;
                handbook.descriptionMarkdown = data.descriptionMarkdown;
                await handbook.save();
                resolve({
                    errCode: 0,
                    message: "Update the handbook succeeds!",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `Handbook's not found!`,
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}
let handleDelelteHandBook = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let handbook = await db.HandBook.findOne({
                where: { id: inputId },
            });
            if (!handbook) {
                resolve({
                    errCode: 2,
                    errMessage: `The handbook isn't exists`,
                });
            }
            await db.HandBook.destroy({
                where: { id: inputId },
            });
            resolve({
                errCode: 0,
                message: "The handbook is deleted",
            });

        } catch (e) {
            reject(e);
        }
    })
}
let getDetailHandBookById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.HandBook.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['title', 'descriptionHTML', 'descriptionMarkdown'],
                })
                if (!data) {
                    data = {};
                }
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

module.exports = {
    createHandBook: createHandBook,
    handleEditHandBook: handleEditHandBook,
    handleDelelteHandBook: handleDelelteHandBook,
    getAllHandBook: getAllHandBook,
    getDetailHandBookById: getDetailHandBookById,
}