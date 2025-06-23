import { Request, Response } from "express";
import Stripe from 'stripe';
import Order from '../models/Order';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const WebhookController= async (req:Request, res:Response) => {
  console.log('webhook controller called')
    const sig = req.headers['stripe-signature']!;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // You can access metadata to store relevant data
      const customerEmail = session.customer_details?.email;
      const amount = session.amount_total;
      const restaurantId = session.metadata?.restaurantId;

      // Store the order in DB
      // await Order.create({
      //   userEmail: customerEmail,
      //   restaurant: restaurantId,
      //   totalAmount: amount,
      //   // items: JSON.parse(session.line_items), // from metadata
      // });
      
      try {
        const orderId=session?.metadata?.orderId;
        console.log('updating order',orderId);
        if(orderId)
        {
          await Order.findByIdAndUpdate(orderId,{
            status:'confirmed',
            paymentStatus:'paid',
            paymentIntentId:session.payment_intent
          })
        }
      } catch (error) {
              console.error('Error updating order:', error);
      }
    }

    res.status(200).json({ received: true });
  }

export {
    WebhookController
}