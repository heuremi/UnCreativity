import nodemailer from 'nodemailer'



export function sendEmail(email) {
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'uncreativity0@gmail.com',
        pass: 'owdd zjlq ojuc owwn'
        }
    });

    var mailOptions = {
        from: 'uncreativity0@gmail.com',
        to: email,
        subject: 'Transaccion completada // Mostrar resumen de compra',
        text: `Es un mensaje de prueba`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });
}