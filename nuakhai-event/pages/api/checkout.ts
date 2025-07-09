import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      console.log("Creating Stripe checkout session...");

      const { guests } = req.body;

      const { adults = 0, children6to12 = 0, childrenBelow6 = 0, visitingParents = 0 } = guests || {};

      // Pricing in pence
      const amount =
        adults * 4000 +
        children6to12 * 2000 +
        visitingParents * 2500; // childrenBelow6 are free

      if (amount < 30) {
        throw new Error("The Checkout Session's total amount due must add up to at least £0.30");
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'paypal'],
        line_items: [{
          price_data: {
            currency: 'gbp',
            product_data: { name: 'Nuakhai Registration' },
            unit_amount: amount,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.headers.origin}/success`,
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
