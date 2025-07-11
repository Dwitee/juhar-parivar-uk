import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log("Received request body:", req.body);
    try {
      console.log("Creating Stripe checkout session...");

      const { guests, email, name, phone, donation } = req.body;

      const adultsCount =
        parseInt(guests?.adults?.veg || '0') + parseInt(guests?.adults?.nonVeg || '0');
      const children6to12Count =
        parseInt(guests?.children6to12?.veg || '0') + parseInt(guests?.children6to12?.nonVeg || '0');
      const visitingParentsCount =
        parseInt(guests?.visitingParents?.veg || '0') + parseInt(guests?.visitingParents?.nonVeg || '0');

      console.log("Donation amount received:", donation);

      const amount =
        adultsCount * 4000 +
        children6to12Count * 2000 +
        visitingParentsCount * 2500 +
        parseInt(donation || '0')*100;

      if (amount < 30) {
        throw new Error("The Checkout Session's total amount due must add up to at least £0.30");
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
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
        cancel_url: `${req.headers.origin}/failure`,
        billing_address_collection: 'auto',
        customer_email: email,
        phone_number_collection:{
          enabled: true
        },
        payment_intent_data: {
          receipt_email: email,
          metadata: {
            name: req.body.name,
            phone: req.body.phone,
            email: email,
            adults_veg: guests.adults.veg,
            adults_nonVeg: guests.adults.nonVeg,
            children6to12_veg: guests.children6to12.veg,
            children6to12_nonVeg: guests.children6to12.nonVeg,
            visitingParents_veg: guests.visitingParents.veg,
            visitingParents_nonVeg: guests.visitingParents.nonVeg,
            donation_amount: donation
          },
        },
        
        
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
