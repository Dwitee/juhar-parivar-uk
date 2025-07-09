import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      console.log("Creating Stripe checkout session...");
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card','paypal'],
        line_items: [{
          price_data: {
            currency: 'gbp',
            product_data: { name: 'Nuakhai Registration' },
            unit_amount: 30, // £0.30
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.headers.origin}/register?success=true`,
        cancel_url: `${req.headers.origin}/register?canceled=true`,
        billing_address_collection: 'auto',
      });
      console.log("Stripe session created:", session);
      res.status(200).json({ url: session.url });
    } catch (err) {
      console.error("Stripe session creation failed:", err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
