import { Router } from 'express';
import { SmileIdentityService } from '../services/smile-identity.service';
import { prisma } from '@digicoop/database';

const router = Router();

router.post('/verify-bvn', async (req, res, next) => {
    try {
        const { bvn, firstName, lastName, dob } = req.body;
        const userId = (req as any).user.id; // Middleware should populate this

        // 1. Check if BVN is already used
        const existing = await prisma.user.findUnique({ where: { bvn } });
        if (existing) {
            return res.status(400).json({ status: 'error', message: 'BVN already linked to an account' });
        }

        // 2. Call Smile Identity
        const result = await SmileIdentityService.verifyBVN(bvn, firstName, lastName, dob);

        // 3. Update User Status based on result
        // Note: In a real app, you inspect result.ResultCode and Actions
        const isVerified = result.ResultCode === '1012'; // Example success code

        if (isVerified) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    bvn,
                    kycStatus: "VERIFIED"
                }
            });
            res.json({ status: 'success', message: 'BVN verified successfully', data: result });
        } else {
            await prisma.user.update({
                where: { id: userId },
                data: { kycStatus: "FAILED" }
            });
            res.status(400).json({ status: 'error', message: 'BVN verification failed', data: result });
        }

    } catch (error) {
        next(error);
    }
});

export default router;
