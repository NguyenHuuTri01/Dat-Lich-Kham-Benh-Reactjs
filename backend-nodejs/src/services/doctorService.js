import db from "../models/index";
require('dotenv').config();
import _, { reject } from "lodash";
import emailService from '../services/emailService'

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limit,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: 'R2' },
        attributes: {
          exclude: ["password", 'image'],
        }
      })
      resolve({
        errCode: 0,
        data: doctors
      })
    } catch (e) {
      reject(e)
    }
  })
}

let checkRequireFields = (inputData) => {
  let arrFields = ['doctorId', 'contentHTML', 'contentMarkdown', 'action', 'selectedPrice',
    'selectedPayment', 'selectedProvince', 'note',
    'specialtyId'
  ]
  let isValid = true;
  let element = '';
  for (let i = 0; i < arrFields.length; i++) {
    if (!inputData[arrFields[i]]) {
      isValid = false;
      element = arrFields[i];
      break;
    }
  }
  return {
    isValid: isValid,
    element: element
  }
}

let saveDetailInforDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkObj = checkRequireFields(inputData);

      if (checkObj.isValid === false) {
        resolve({
          errCode: 1,
          errMessage: `Missing parameter: ${checkObj.element}`
        })
      } else {
        // upsert to markDown
        if (inputData.action === 'CREATE') {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            doctorId: inputData.doctorId
          })
        } else if (inputData.action === 'EDIT') {
          let doctorMarkdown = await db.Markdown.findOne({
            where: {
              doctorId: inputData.doctorId,
            },
            raw: false
          })
          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = inputData.contentHTML;
            doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
            doctorMarkdown.description = inputData.description;
            await doctorMarkdown.save();
          }
        }
        // upsert to doctor_infor table
        let doctorInfor = await db.Doctor_Infor.findOne({
          where: {
            doctorId: inputData.doctorId,
          },
          raw: false,
        })

        if (doctorInfor) {
          // update
          doctorInfor.doctorId = inputData.doctorId
          doctorInfor.priceId = inputData.selectedPrice;
          doctorInfor.provinceId = inputData.selectedProvince;
          doctorInfor.paymentId = inputData.selectedPayment;
          // doctorInfor.nameClinic = inputData.nameClinic;
          // doctorInfor.addressClinic = inputData.addressClinic;
          doctorInfor.note = inputData.note;
          doctorInfor.specialtyId = inputData.specialtyId;
          doctorInfor.clinicId = inputData.clinicId;
          await doctorInfor.save();
        } else {
          // create
          await db.Doctor_Infor.create({
            doctorId: inputData.doctorId,
            priceId: inputData.selectedPrice,
            provinceId: inputData.selectedProvince,
            paymentId: inputData.selectedPayment,
            // nameClinic: inputData.nameClinic,
            // addressClinic: inputData.addressClinic,
            note: inputData.note,
            specialtyId: inputData.specialtyId,
            clinicId: inputData.clinicId,
          })
        }

        resolve({
          errCode: 0,
          errMessage: 'Save infor doctor succeed!'
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getDetailDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameter!'
        })
      } else {
        let data = await db.User.findOne({
          where: {
            id: inputId
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ['description', 'contentHTML', 'contentMarkdown']
            },
            {
              model: db.Allcode, as: "positionData", attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ['id', 'doctorId']
              },
              include: [
                { model: db.Allcode, as: "priceTypeData", attributes: ["valueEn", "valueVi"] },
                { model: db.Allcode, as: "provinceTypeData", attributes: ["valueEn", "valueVi"] },
                { model: db.Allcode, as: "paymentTypeData", attributes: ["valueEn", "valueVi"] },
              ]
            },
          ],
          raw: false,
          nest: true,
        })
        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary")
        }
        if (!data) data = {}
        resolve({
          errCode: 0,
          data: data
        })
      }
    } catch (e) {
      reject(e);
    }
  })
}
let bulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameter!'
        })
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map(item => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          })
        }
        // get all existing data
        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.formatedDate },
          attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
          raw: true
        });
        // delete -> create = update
        let toDelete = _.differenceWith(data.allScheduleTime, data.arrSchedule, (a, b) => {
          return a.keyMap === b.timeType
        })
        for (let i = 0; i < toDelete.length; i++) {
          await db.Schedule.destroy({
            where: {
              timeType: toDelete[i].keyMap,
              date: data.arrSchedule[0].date,
              doctorId: data.arrSchedule[0].doctorId
            },
          });
        }
        //compare different
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && + a.date === + b.date;
        });
        // create data
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate)
        }
        resolve({
          errCode: 0,
          errMessage: "ok"
        })
      }
    } catch (e) {
      reject(e);
    }
  })
}
let getScheduleByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let dataSchedule = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: date
          },
          include: [
            { model: db.Allcode, as: "timeTypeData", attributes: ["valueEn", "valueVi"] },
            { model: db.User, as: "doctorData", attributes: ["firstName", "lastName"] },
          ],
          raw: false,
          nest: true,
        })
        if (!dataSchedule) dataSchedule = [];
        resolve({
          errCode: 0,
          data: dataSchedule
        })
      }
    } catch (e) {
      reject(e);
    }
  })
}
let getExtraInforDoctorById = (idInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!idInput) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let data = await db.Doctor_Infor.findOne({
          where: {
            doctorId: idInput
          },
          attributes: {
            exclude: ['id', 'doctorId']
          },
          include: [
            { model: db.Allcode, as: "priceTypeData", attributes: ["valueEn", "valueVi"] },
            { model: db.Allcode, as: "provinceTypeData", attributes: ["valueEn", "valueVi"] },
            { model: db.Allcode, as: "paymentTypeData", attributes: ["valueEn", "valueVi"] },
            { model: db.Clinic, as: "clinicTypeData", attributes: ["name", "address"] },
          ],
          raw: false,
          nest: true
        })
        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}
let getProfileDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let data = await db.User.findOne({
          where: {
            id: inputId
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ['description', 'contentHTML', 'contentMarkdown']
            },
            {
              model: db.Allcode, as: "positionData", attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ['id', 'doctorId']
              },
              include: [
                { model: db.Allcode, as: "priceTypeData", attributes: ["valueEn", "valueVi"] },
                { model: db.Allcode, as: "provinceTypeData", attributes: ["valueEn", "valueVi"] },
                { model: db.Allcode, as: "paymentTypeData", attributes: ["valueEn", "valueVi"] },
              ]
            },
          ],
          raw: false,
          nest: true,
        })
        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary")
        }
        if (!data) data = {}
        resolve({
          errCode: 0,
          data: data
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getListPatientForDoctor = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let data = await db.Booking.findAll({
          where: {
            statusId: 'S2',
            doctorId: doctorId,
            date: date
          },
          include: [
            {
              model: db.User, as: 'patientData',
              attributes: ['email', 'firstName', 'address', 'gender'],
              include: [
                {
                  model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']
                }
              ]
            },
            {
              model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi']
            }
          ],
          raw: false,
          nest: true
        })
        resolve({
          errCode: 0,
          data: data
        })
      }
    } catch (e) {
      reject(e);
    }
  })
}
let sendRemedy = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        // update patient status
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            statusId: 'S2'
          },
          raw: false
        })

        if (appointment) {
          appointment.statusId = 'S3';
          await appointment.save();
        }
        //send email remedy
        await emailService.sendAttachment(data);
        resolve({
          errCode: 0,
          errMessage: 'Ok'
        })
      }
    } catch (e) {
      reject(e);
    }
  })
}
module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  saveDetailInforDoctor: saveDetailInforDoctor,
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleByDate: getScheduleByDate,
  getExtraInforDoctorById: getExtraInforDoctorById,
  getProfileDoctorById: getProfileDoctorById,
  getListPatientForDoctor: getListPatientForDoctor,
  sendRemedy: sendRemedy,
};
