import { Router } from 'express';
import { prisma } from '@digicoop/database';

const router = Router();

// Get all savings goals for a user
router.get('/', async (req, res, next) => {
    try {
        const userId = (req as any).user?.id;
        const goals = await prisma.savingsGoal.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ status: 'success', data: goals });
    } catch (error) {
        next(error);
    }
});

// Create a new savings goal
router.post('/', async (req, res, next) => {
    try {
        const userId = (req as any).user?.id;
        const { title, targetAmount, type, dueDate, locked } = req.body;

        const goal = await prisma.savingsGoal.create({
            data: {
                userId,
                title,
                targetAmount,
                type,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                locked: locked || type === 'COMPULSORY'
            }
        });
        res.json({ status: 'success', data: goal });
    } catch (error) {
        next(error);
    }
});

// Top up a savings goal
router.post('/:id/topup', async (req, res, next) => {
    try {
        const userId = (req as any).user?.id;
        const { id } = req.params;
        const { amount } = req.body;

        // Get wallet and goal
        const wallet = await prisma.wallet.findUnique({ where: { userId } });
        const goal = await prisma.savingsGoal.findUnique({ where: { id } });

        if (!wallet || !goal) {
            return res.status(404).json({ status: 'error', message: 'Wallet or goal not found' });
        }

        if (Number(wallet.balance) < amount) {
            return res.status(400).json({ status: 'error', message: 'Insufficient wallet balance' });
        }

        // Perform transaction
        await prisma.$transaction([
            prisma.wallet.update({
                where: { userId },
                data: { balance: { decrement: amount } }
            }),
            prisma.savingsGoal.update({
                where: { id },
                data: { currentAmount: { increment: amount } }
            }),
            prisma.transaction.create({
                data: {
                    walletId: wallet.id,
                    type: 'SAVINGS_CONTRIBUTION',
                    amount: -amount,
                    description: `Savings: ${goal.title}`,
                    status: 'SUCCESS'
                }
            })
        ]);

        const updatedGoal = await prisma.savingsGoal.findUnique({ where: { id } });
        res.json({ status: 'success', data: updatedGoal });
    } catch (error) {
        next(error);
    }
});

// Withdraw from savings goal (if not locked)
router.post('/:id/withdraw', async (req, res, next) => {
    try {
        const userId = (req as any).user?.id;
        const { id } = req.params;
        const { amount } = req.body;

        const goal = await prisma.savingsGoal.findUnique({ where: { id } });

        if (!goal) {
            return res.status(404).json({ status: 'error', message: 'Goal not found' });
        }

        if (goal.locked) {
            return res.status(400).json({ status: 'error', message: 'Cannot withdraw from locked savings' });
        }

        if (Number(goal.currentAmount) < amount) {
            return res.status(400).json({ status: 'error', message: 'Insufficient savings balance' });
        }

        const wallet = await prisma.wallet.findUnique({ where: { userId } });
        if (!wallet) {
            return res.status(404).json({ status: 'error', message: 'Wallet not found' });
        }

        await prisma.$transaction([
            prisma.savingsGoal.update({
                where: { id },
                data: { currentAmount: { decrement: amount } }
            }),
            prisma.wallet.update({
                where: { userId },
                data: { balance: { increment: amount } }
            }),
            prisma.transaction.create({
                data: {
                    walletId: wallet.id,
                    type: 'DEPOSIT',
                    amount: amount,
                    description: `Withdrawal from: ${goal.title}`,
                    status: 'SUCCESS'
                }
            })
        ]);

        const updatedGoal = await prisma.savingsGoal.findUnique({ where: { id } });
        res.json({ status: 'success', data: updatedGoal });
    } catch (error) {
        next(error);
    }
});

export default router;
