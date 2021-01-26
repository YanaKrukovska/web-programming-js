let mail = '';
let password = '';

async function send() {
    let nodemailer = require("nodemailer");
    let transporter = nodemailer.createTransport({
        host: mail,
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
            user: mail,
            pass: password
        }
    });

    let result = await transporter.sendMail({
        from: mail,
        to: mail,
        subject: "Miaoo!!",
        text: "Miaoo!"

    });
    console.log(result);

}

send();
