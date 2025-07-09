import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'gbp',
            product_data: { name: 'Nuakhai Registration' },
            unit_amount: 500, // £5
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.headers.origin}/register?success=true`,
        cancel_url: `${req.headers.origin}/register?canceled=true`,
      });
      res.status(200).json({ url: session.url });
    } catch (err) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
