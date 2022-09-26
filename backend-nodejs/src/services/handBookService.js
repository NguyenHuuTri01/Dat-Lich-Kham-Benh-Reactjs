const db = require("../models");

let createHandBook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.title
                || !data.descriptionHTML
                || !data.descriptionMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.HandBook.create({
                    title: data.title,
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
            let data = await db.HandBook.findAll();
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
            if (!data.title || !data.descriptionHTML || !data.descriptionMarkdown) {
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
                    errMessage: `The user isn't exists`,
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

module.exports = {
    createHandBook: createHandBook,
    handleEditHandBook: handleEditHandBook,
    handleDelelteHandBook: handleDelelteHandBook,
    getAllHandBook: getAllHandBook
}