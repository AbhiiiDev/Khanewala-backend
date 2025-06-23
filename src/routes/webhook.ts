// src/routes/webhook.ts
import express from 'express';
import { WebhookController } from '../controllers/webhookController';

const router = express.Router();


// Stripe requires the raw body to validate signature
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
 WebhookController
);

export default router;
