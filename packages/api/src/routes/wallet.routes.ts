import { Router } from 'express';
import { prisma } from '@digicoop/database';

const router = Router();

// Get wallet balance
router.get('/balance', async (req, res, next) => {
    try {
        const userId = (req as any).user?.id;
        let wallet = await prisma.wallet.findUnique({ where: { userId } });

        // Create wallet if doesn't exist
        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: { userId }
            });
        }

        res.json({ status: 'success', data: wallet });
    } catch (error) {
        next(error);
    }
});

// Get transaction history
router.get('/transactions', async (req, res, next) => {
    try {
        const userId = (req as any).user?.id;
        const wallet = await prisma.wallet.findUnique({ where: { userId } });

        if (!wallet) {
            return res.json({ status: 'success', data: [] });
        }

        const transactions = await prisma.transaction.findMany({
            where: { walletId: wallet.id },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        res.json({ status: 'success', data: transactions });
    } catch (error) {
        next(error);
    }
});

export default router;
