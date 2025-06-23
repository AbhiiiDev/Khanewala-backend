import express from 'express';
import { jwtCheck,jwtParse } from '../middleware/auth';
import { createPayment } from '../controllers/PaymentController';

const router=express.Router();


router.post('/create-checkout-session',jwtCheck,jwtParse,createPayment);

export default router;
