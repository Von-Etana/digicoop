import { Router } from 'express';
import { AuthService } from '../services/auth.service';

const router = Router();

router.post('/register', async (req, res, next) => {
    try {
        const user = await AuthService.register(req.body);
        res.json({ status: 'success', data: user });
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const result = await AuthService.login(req.body.email, req.body.password);
        res.json({ status: 'success', data: result });
    } catch (error) {
        next(error);
    }
});

export default router;
