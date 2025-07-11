// pages/api/webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import bwipjs from 'bwip-js';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🔔 Webhook received');
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;
  console.log('🔒 Stripe signature:', sig);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log('✅ Stripe event constructed:', event.type);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('🎉 Checkout session completed:', session.id);
    console.log('📩 Sending ticket email to:', session.customer_email);
    const metadata = session.metadata || {};
    console.log('🧾 Metadata received:', metadata);

    const receiptNumber = session.payment_intent?.toString() || 'UNKNOWN';

    // Generate QR code as PNG buffer
    const barcode = await bwipjs.toBuffer({
      bcid: 'qrcode',
      text: receiptNumber,
      scale: 5,
      includetext: false,
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Thank you for registering, ${metadata.name}!</h2>
        <p>Your ticket number: <strong>${receiptNumber}</strong></p>
        <p>Show this QR code at the entrance:</p>
        <img src="cid:qrcode" style="margin-top: 10px;"/>
        <p style="margin-top: 20px;">We look forward to seeing you at Nuakhai Bhetghat 2025 🎉</p>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `Juhar Parivar UK <${process.env.EMAIL_USERNAME}>`,
      to: session.customer_email,
      subject: 'Your Nuakhai Bhetghat 2025 Ticket 🎟️',
      html: htmlContent,
      attachments: [
        {
          filename: 'qrcode.png',
          content: barcode,
          cid: 'qrcode',
        },
      ],
    });

    console.log('🎟️ Ticket email sent to:', session.customer_email);
  }

  res.status(200).json({ received: true });
}