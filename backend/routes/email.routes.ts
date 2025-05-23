import { Router, Request, Response } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

interface EmailItem {
  game: {
    title: string;
    price: number;
    discount?: number;
  };
  quantity: number;
}

interface EmailRequest {
  to: string;
  subject: string;
  cart: {
    items: EmailItem[];
    totalPrice: number;
  };
  orderNumber: string;
  date: string;
  total: number;
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env['EMAIL_USER'],
    pass: process.env['EMAIL_PASSWORD']
  },
  tls: {
    rejectUnauthorized: false // No recomendado para producción, pero útil para desarrollo local
  }
});

// Definimos el tipo correcto para el handler de la ruta
router.post('/send-receipt', async (req: Request<{}, {}, EmailRequest>, res: Response) => {
  try {
    // Log de la solicitud completa
    console.log('Headers recibidos:', req.headers);
    console.log('Cuerpo de la solicitud:', req.body);
    
    const { to, subject, cart, orderNumber, date, total } = req.body;
    
    if (!to || !cart || !orderNumber) {
      console.log('Datos faltantes:', { to, cart, orderNumber });
      res.status(400).json({ message: 'Faltan datos requeridos' });
      return;
    }

    console.log('Verificando configuración de correo...');
    console.log('EMAIL_USER:', process.env['EMAIL_USER']);
    console.log('EMAIL_PASSWORD está configurado:', !!process.env['EMAIL_PASSWORD']);

    // Verificar la conexión con el servidor SMTP
    try {
      await transporter.verify();
      console.log('Conexión SMTP verificada correctamente');
    } catch (error) {
      console.error('Error en la verificación SMTP:', error);
      throw error;
    }

    const htmlContent = `
      <h1>Recibo de Compra - GameStore</h1>
      <p>Orden #: ${orderNumber}</p>
      <p>Fecha: ${new Date(date).toLocaleString()}</p>
      <hr>
      ${cart.items.map((item: EmailItem) => `
        <div>
          <h3>${item.game.title}</h3>
          <p>Cantidad: ${item.quantity}</p>
          <p>Precio: $${item.game.price * (1 - (item.game.discount || 0))}</p>
          <p>Subtotal: $${item.quantity * (item.game.price * (1 - (item.game.discount || 0)))}</p>
        </div>
      `).join('<hr>')}
      <hr>
      <p>Subtotal: $${cart.totalPrice}</p>
      <p>IVA (16%): $${cart.totalPrice * 0.16}</p>
      <p><strong>Total: $${total}</strong></p>
    `;

    const mailOptions = {
      from: `"GameStore" <${process.env['EMAIL_USER']}>`,
      to,
      subject,
      html: htmlContent,
    };

    console.log('Intentando enviar correo con opciones:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado exitosamente:', info);

    res.json({ message: 'Recibo enviado correctamente', info });
    return;  } catch (error: any) {
    console.error('Error detallado:', error);
    res.status(500).json({ 
      message: 'Error al enviar el recibo',
      error: error.message 
    });
    return;
  }
});

export default router;