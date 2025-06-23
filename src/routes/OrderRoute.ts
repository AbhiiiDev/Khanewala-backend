import express from 'express';
import { getAllOrder, getOrder } from '../controllers/OrderController';
import { jwtCheck, jwtParse } from '../middleware/auth';

const router=express.Router();


router.get('/:orderId',getOrder);
router.get('/',jwtParse,jwtCheck,getAllOrder)

export default router;