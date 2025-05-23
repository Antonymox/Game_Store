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
  service: 'gmail',
  auth: {
    user: process.env['EMAIL_USER'],
    pass: process.env['EMAIL_PASSWORD']
  }
});

// Definimos el tipo correcto para el handler de la ruta
router.post('/send-receipt', async (req: Request<{}, {}, EmailRequest>, res: Response) => {
  try {
    console.log('Recibida solicitud de envío de correo:', req.body);
    const { to, subject, cart, orderNumber, date, total } = req.body;
    
    if (!to || !cart || !orderNumber) {
      res.status(400).json({ message: 'Faltan datos requeridos' });
      return;
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

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Recibo enviado correctamente' });
    return;
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ 
      message: 'Error al enviar el recibo',
      error: error.message 
    });
    return;
  }
});

export default router;