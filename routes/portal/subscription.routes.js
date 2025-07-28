
import express from 'express';
import { cancelSubscription ,createCheckoutSession} from '../../controllers/portal/subcription.controller.js';

const router = express.Router();

router.post('/subscribe', createCheckoutSession); 
router.post('/subscribe', createCheckoutSession); 

export default router;
