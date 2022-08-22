import nodemailer from 'nodemailer'
require('dotenv').config();

let sendSimpleEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Huu Tri Dev 👻" <nguyenhuutri0905@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyHTMLEmail(dataSend), // html body
    });
}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin Chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email thì đã đặt lịch khám bệnh online trên Website</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
         <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

         <p>Nếu các thông tin trên là đúng sự thật vui lòng click vào đường link bên 
         dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh
         </p>
         <div>
         <a href=${dataSend.redirectLink} target = "_blank">Click here</a>
         </div>
         <div>Xin chân thành cảm ơn</div>
        `
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email thì đã đặt lịch khám bệnh online trên Website</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
         <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

         <p>Nếu các thông tin trên là đúng sự thật vui lòng click vào đường link bên 
         dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh
         </p>
         <div>
         <a href=${dataSend.redirectLink} target = "_blank">Click here</a>
         </div>
         <div>Xin chân thành cảm ơn</div>
        `
    }
    return result;
}
module.exports = {
    sendSimpleEmail: sendSimpleEmail,
}