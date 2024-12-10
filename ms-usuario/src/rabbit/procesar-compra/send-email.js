import nodemailer from 'nodemailer'
import axios from 'axios'



export async function sendEmail(email, cursosIds) {
    
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
        html: await resumenHTML(email, cursosIds)
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });
}

async function getCursosPorIds(ids) {
    console.log("ids en getCursos: ", ids)
    const query = `
        query {
            cursosById(ids:[${ids.join(",")}]) {
                id
                titulo
                precio
                imagenUrl
            }
        }
    `;
    try {
        const resp = await axios.post(
            `http://localhost:3001/graphql`, { query }
        )
        console.log("La respuesta del backend: ", resp)
        return {
            Code: resp.status,
            Status: resp.statusText,
            Data: resp.data.data.cursosById
        }
    } catch (error) {
        console.log("Error : ", error)
        return {
            Code: error?.code,
            Message: error?.message
        }
    }
}

async function resumenHTML(email, cursosIds) {
    // Lista de productos en JavaScript
    const products = (await getCursosPorIds(cursosIds))?.Data || []

    console.log("productos: ", products)
    let total = 0
    
    // Generamos las filas de la tabla a partir del array
    const productRows = products.map(product => {
        total += product.precio
        return `
        <tr>
            <td style="width: 80px;"><img src="${product.imagenUrl}" alt="${product.titulo}" style="max-width: 80px; height: auto;"></td>
            <td>${product.titulo}</td>
            <td style="text-align: right;">$${product.precio}</td>
        </tr>
        `;
    }).join(''); // join para convertir el array de strings en un único string
    
    // Luego integras esas filas en el HTML principal

    return ` <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resumen de Compra</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 5px; border: 1px solid #e0e0e0;">
            <tr>
                <td style="padding: 20px; text-align: center; background-color: #4a90e2; color: #ffffff;">
                    <h1 style="margin: 0;">UnCreativity</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px;">
                    <p style="color: #4a90e2; font-size: 18px; text-align: center;">¡Gracias por tu compra!</p>
                    <p style="text-align: center;">Aquí tienes un resumen de tu pedido:</p>
                    <h2 style="color: #4a90e2; text-align: center;">Resumen de tu Compra</h2>
                    <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #e0e0e0;">
                            <th style="text-align: left;">Imagen</th>
                            <th style="text-align: left;">Producto</th>
                            <th style="text-align: right;">Precio</th>
                        </tr>
                        ${productRows}
                    </table>
                    <table width="100%" cellpadding="5" cellspacing="0" style="margin-top: 20px;">
                        <tr>
                            <td style="text-align: right; font-weight: bold;">Total:</td>
                            <td style="text-align: right; font-weight: bold;">$${total.toFixed(2)}</td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px; text-align: center; background-color: #4a90e2; color: #ffffff;">
                    <p style="margin: 0;">Esperamos que disfrutes de tus productos.</p>
                    <p style="margin: 5px 0 0;">¡Vuelve pronto!</p>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px; font-size: 12px; text-align: center; color: #666666;">
                    <p>Este correo electrónico fue enviado a ${email}</p>
                    <p>Recibes este correo porque realizaste una compra en UnCreativity.</p>
                    <p>Si no realizaste esta compra, por favor contáctanos inmediatamente.</p>
                    <p>© 2024 UnCreativity. Todos los derechos reservados.</p>
                    <p><a href="#" style="color: #4a90e2;">Política de Privacidad</a> | <a href="#" style="color: #4a90e2;">Términos de Servicio</a> | <a href="#" style="color: #4a90e2;">Cancelar Suscripción</a></p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `


    /**
     * `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resumen de Compra</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; border-radius: 5px;">
            <tr>
                <td style="padding: 20px; text-align: center; background-color: #4a90e2; color: #ffffff;">
                    <h1 style="margin: 0;">UnCreativity</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px;">
                    <h2 style="color: #4a90e2;">Resumen de tu Compra</h2>
                    <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #dddddd;">
                            <th style="text-align: left;">Producto</th>
                            <th style="text-align: right;">Precio</th>
                        </tr>
                        ${productRows}
                    </table>
                    <table width="100%" cellpadding="5" cellspacing="0" style="margin-top: 20px;">
                        <tr>
                            <td style="text-align: right; font-weight: bold;">Total:</td>
                            <td style="text-align: right; font-weight: bold;">$${total}</td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px; text-align: center; background-color: #4a90e2; color: #ffffff;">
                    <p style="margin: 0;">¡Gracias por tu compra!</p>
                    <p style="margin: 5px 0 0;">Esperamos que disfrutes de tus productos.</p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
     */
}