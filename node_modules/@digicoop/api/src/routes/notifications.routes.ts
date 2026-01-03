import { Router } from 'express';
import { TermiiService } from '../services/termii.service';

const router = Router();

router.post('/send-otp', async (req, res, next) => {
    try {
        const { phoneNumber } = req.body;
        const result = await TermiiService.sendToken(phoneNumber);
        res.json({ status: 'success', data: result });
    } catch (error) {
        next(error);
    }
});

router.post('/verify-otp', async (req, res, next) => {
    try {
        const { pinId, pin } = req.body;
        const result = await TermiiService.verifyToken(pinId, pin);
        res.json({ status: 'success', data: result });
    } catch (error) {
        next(error);
    }
});

export default router;
