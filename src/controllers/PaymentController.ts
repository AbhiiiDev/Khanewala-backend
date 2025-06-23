import { Request, Response } from "express";
import Stripe from "stripe";
import Order from "../models/Order";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

const stripe=new Stripe(stripeSecretKey!);

const createPayment=async(req:Request,res:Response)=>{
    const { items, restaurantId } = req.body;
    const userId=req.userId;
    const totalAmount = items.reduce(
      (acc: number, item: any) => acc + item.price * item.quantity,
      0
    );  
      const line_items=items.map((item:any)=>({
        price_data:{
            currency:"inr",
            product_data:{
                name:item.name,
            },
            unit_amount:item.price *100 ,
        },
        quantity:item.quantity
    }));

    const order=await Order.create({
        user:userId,
        restaurant:restaurantId,
        items:items,
        total:totalAmount,
        status:'pending',
        paymentStatus:'pending',
    })
    const session=await stripe.checkout.sessions.create({
        payment_method_types:["paypal","card","alipay"],
        line_items,
        mode:"payment",
        success_url:`${process.env.CLIENT_URL}/success/${order._id}`,
        cancel_url:`${process.env.CLIENT_URL}/cancel`,
        metadata:{
            userId:req.userId,
            restaurantId,
            orderId:order._id.toString()
        }
    })

    res.json({id:session.id});
}
export {
    createPayment
}