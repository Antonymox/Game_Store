const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

// Verificar si las credenciales de correo están configuradas
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || 
    process.env.EMAIL_USER === 'tu-correo@gmail.com' || 
    process.env.EMAIL_PASSWORD === 'tu-contraseña-de-app') {
  console.warn(
    '\x1b[33m%s\x1b[0m', // Texto en amarillo
    'ADVERTENCIA: Las credenciales de correo electrónico no están configuradas correctamente en el archivo .env.' +
    '\nSi deseas usar la función de recuperación de contraseña, actualiza EMAIL_USER y EMAIL_PASSWORD en el archivo .env.' +
    '\nPara Gmail, debes usar una contraseña de aplicación generada en: https://myaccount.google.com/security'
  );
}

// Configurar el transporter de nodemailer
let transporterConfig = {
  service: 'gmail',  // Puedes cambiar a otro servicio de correo
  auth: {
    user: process.env.EMAIL_USER || 'tu-correo@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'tu-contraseña-de-app'
  }
};

// Opcionalmente puedes usar un servicio SMTP genérico en lugar de un servicio específico
// Por ejemplo, para usar Mailtrap en desarrollo:
/*
transporterConfig = {
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "tu-usuario-mailtrap",
    pass: "tu-contraseña-mailtrap"
  }
}
*/

const transporter = nodemailer.createTransport(transporterConfig);

// Función para enviar correo con código de restablecimiento de contraseña
exports.sendPasswordResetEmail = async (email, resetCode) => {
  try {
    // Verificar transporter antes de enviar
    await transporter.verify();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'tu-correo@gmail.com',
      to: email,
      subject: 'Código de Verificación - GameStore',
      html: `
        <h1>GameStore - Código de Verificación</h1>
        <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código para continuar con el proceso:</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border: 1px solid #ddd; text-align: center;">
          <h2 style="font-size: 30px; letter-spacing: 5px; font-weight: bold; color: #333;">${resetCode}</h2>
        </div>
        <p>Ingresa este código en la página de verificación para establecer una nueva contraseña.</p>
        <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este mensaje.</p>
        <p>El código expirará en 15 minutos.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    
    // En un entorno de producción, es mejor registrar el error y continuar
    // para evitar revelar información sensible al usuario
    if (process.env.NODE_ENV !== 'production') {
      console.error('Detalles del error:', error.message);
      
      if (error.code === 'EAUTH') {
        console.error('\x1b[31m%s\x1b[0m', 'Error de autenticación: Verifica tus credenciales en el archivo .env');
        console.error('\x1b[31m%s\x1b[0m', 'Para Gmail, debes usar una contraseña de aplicación, NO tu contraseña normal');
        console.error('\x1b[31m%s\x1b[0m', 'Genera una contraseña de aplicación en: https://myaccount.google.com/security -> Contraseñas de aplicación');
      }
    }
    
    throw error;
  }
};
