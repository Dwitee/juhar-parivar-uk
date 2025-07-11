// pages/api/webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import bwipjs from 'bwip-js';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    console.log('✅ checkout.session.completed received. Skipping to avoid duplicate email.');
    return res.status(200).json({ received: true });
  }

  // Handle payment_intent.succeeded event for direct PaymentIntent payments
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const metadata = paymentIntent.metadata || {};
    const customerEmail = paymentIntent.receipt_email;
    const customerName = metadata.name || 'Guest';
    const receiptNumber = paymentIntent.id || 'UNKNOWN';

    if (!customerEmail) {
      console.error('❌ No customer email provided in payment_intent.succeeded');
      return res.status(200).json({ received: true });
    }

    console.log('📩 Sending ticket email to:', customerEmail);
    console.log('🧾 Metadata received:', metadata);

    const guestDetails = `
      Adults - Veg: ${metadata.adults_veg || 0}, Non-Veg: ${metadata.adults_nonVeg || 0}<br/>
      Children (6-12) - Veg: ${metadata.children6to12_veg || 0}, Non-Veg: ${metadata.children6to12_nonVeg || 0}<br/>
      Visiting Parents - Veg: ${metadata.visitingParents_veg || 0}, Non-Veg: ${metadata.visitingParents_nonVeg || 0}
    `;

    // Generate QR code as PNG buffer
    const qrPayload = JSON.stringify({
      ticketId: receiptNumber,
      name: customerName,
      email: customerEmail,
      guests: {
        adults_veg: metadata.adults_veg || 0,
        adults_nonVeg: metadata.adults_nonVeg || 0,
        children6to12_veg: metadata.children6to12_veg || 0,
        children6to12_nonVeg: metadata.children6to12_nonVeg || 0,
        visitingParents_veg: metadata.visitingParents_veg || 0,
        visitingParents_nonVeg: metadata.visitingParents_nonVeg || 0,
      },
      event: 'Nuakhai Bhetghat 2025',
    });

    const barcode = await bwipjs.toBuffer({
      bcid: 'qrcode',
      text: qrPayload,
      scale: 5,
      includetext: false,
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background-color: #f9f9f9; border-radius: 10px;">
        <div style="text-align: center;">
          <h2 style="color: #2c3e50;">🎉 Thank You for Registering, ${customerName}!</h2>
        </div>
        <p style="font-size: 16px; color: #333;">We’re excited to welcome you to <strong>Nuakhai Bhetghat 2025</strong>! Please find your ticket details below:</p>
        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-top: 20px;">
          <p><strong>🎟️ Ticket Number:</strong> ${receiptNumber}</p>
          <p><strong>👥 Guest Details:</strong></p>
          <div style="font-size: 15px; line-height: 1.5; color: #444;">
            ${guestDetails}
          </div>
          <p style="margin-top: 20px;"><strong>📲 Show this QR code at the entrance:</strong></p>
          <div style="text-align: center;">
            <img src="cid:qrcode" alt="QR Code" style="margin-top: 10px; height: 180px;" />
          </div>
        </div>
        <p style="margin-top: 30px; font-size: 15px; color: #555;">We look forward to celebrating with you!<br/>🙏 <em>Juhar Parivar UK Team</em></p>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    try {
      await transporter.sendMail({
        from: `Juhar Parivar UK <${process.env.EMAIL_USERNAME}>`,
        to: customerEmail,
        bcc: ['dwitee@gmail.com', 'ankan.naik@gmail.com'],
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
      console.log('🎟️ Ticket email sent to:', customerEmail);

      // Save user info to Supabase
      try {
        const { error: dbError } = await supabase.from('guests').insert([
          {
            name: customerName,
            email: customerEmail,
            ticket_id:receiptNumber,
            phone: metadata.phone || '',
            amount_paid: paymentIntent.amount_received / 100,
            donation_amount: metadata.donation_amount ? parseFloat(metadata.donation_amount) : null,
            checked_in_at: null,
            adults_veg: parseInt(metadata.adults_veg || '0'),
            adults_nonVeg: parseInt(metadata.adults_nonVeg || '0'),
            children6to12_veg: parseInt(metadata.children6to12_veg || '0'),
            children6to12_nonVeg: parseInt(metadata.children6to12_nonVeg || '0'),
            visitingParents_veg: parseInt(metadata.visitingParents_veg || '0'),
            visitingParents_nonVeg: parseInt(metadata.visitingParents_nonVeg || '0'),
          },
        ]);
        if (dbError) {
          console.error('❌ Error saving to Supabase:', dbError.message);
        } else {
          console.log('✅ Guest info saved to Supabase');
        }
      } catch (err) {
        console.error('❌ Exception while saving to Supabase:', err);
      }
    } catch (emailErr) {
      console.error('❌ Failed to send email:', emailErr);
    }

    return res.status(200).json({ received: true });
  }

  res.status(200).json({ received: true });
}