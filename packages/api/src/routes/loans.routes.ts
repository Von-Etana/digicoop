import { Router } from 'express';
import { prisma } from '@digicoop/database';

const router = Router();

// Get user's loans
router.get('/', async (req, res, next) => {
    try {
        const userId = (req as any).user?.id;
        const loans = await prisma.loan.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ status: 'success', data: loans });
    } catch (error) {
        next(error);
    }
});

// Check loan eligibility
router.get('/eligibility', async (req, res, next) => {
    try {
        const userId = (req as any).user?.id;

        // Get total savings
        const savings = await prisma.savingsGoal.aggregate({
            where: { userId },
            _sum: { currentAmount: true }
        });

        // Check for active loans
        const activeLoans = await prisma.loan.findMany({
            where: { userId, status: { in: ['ACTIVE', 'PENDING'] } }
        });

        const totalSavings = Number(savings._sum.currentAmount) || 0;
        const hasActiveLoan = activeLoans.length > 0;

        // Simple eligibility: 2x savings, no active loan
        const maxLoanAmount = hasActiveLoan ? 0 : totalSavings * 2;
        const eligible = maxLoanAmount > 10000;

        res.json({
            status: 'success',
            data: {
                eligible,
                maxLoanAmount,
                totalSavings,
                hasActiveLoan,
                interestRate: 5 // 5% per month
            }
        });
    } catch (error) {
        next(error);
    }
});

// Apply for loan
router.post('/apply', async (req, res, next) => {
    try {
        const userId = (req as any).user?.id;
        const { amount, purpose, durationMonths } = req.body;

        // Check eligibility first
        const savings = await prisma.savingsGoal.aggregate({
            where: { userId },
            _sum: { currentAmount: true }
        });

        const activeLoans = await prisma.loan.findMany({
            where: { userId, status: { in: ['ACTIVE', 'PENDING'] } }
        });

        const totalSavings = Number(savings._sum.currentAmount) || 0;
        const maxLoanAmount = activeLoans.length > 0 ? 0 : totalSavings * 2;

        if (amount > maxLoanAmount) {
            return res.status(400).json({
                status: 'error',
                message: `Maximum loan amount is ${maxLoanAmount}`
            });
        }

        const loan = await prisma.loan.create({
            data: {
                userId,
                amount,
                purpose,
                interestRate: 5,
                durationMonths,
                status: 'PENDING'
            }
        });

        res.json({ status: 'success', data: loan });
    } catch (error) {
        next(error);
    }
});

// Admin: Approve loan
router.post('/:id/approve', async (req, res, next) => {
    try {
        const { id } = req.params;

        const loan = await prisma.loan.findUnique({ where: { id } });
        if (!loan) {
            return res.status(404).json({ status: 'error', message: 'Loan not found' });
        }

        if (loan.status !== 'PENDING') {
            return res.status(400).json({ status: 'error', message: 'Loan is not pending' });
        }

        // Get user wallet
        const wallet = await prisma.wallet.findUnique({ where: { userId: loan.userId } });
        if (!wallet) {
            return res.status(404).json({ status: 'error', message: 'User wallet not found' });
        }

        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + loan.durationMonths);

        await prisma.$transaction([
            prisma.loan.update({
                where: { id },
                data: {
                    status: 'ACTIVE',
                    disbursedAt: new Date(),
                    dueDate
                }
            }),
            prisma.wallet.update({
                where: { userId: loan.userId },
                data: { balance: { increment: loan.amount } }
            }),
            prisma.transaction.create({
                data: {
                    walletId: wallet.id,
                    type: 'LOAN_DISBURSEMENT',
                    amount: Number(loan.amount),
                    description: `Loan disbursement: ${loan.purpose}`,
                    status: 'SUCCESS'
                }
            })
        ]);

        const updatedLoan = await prisma.loan.findUnique({ where: { id } });
        res.json({ status: 'success', data: updatedLoan });
    } catch (error) {
        next(error);
    }
});

// Repay loan
router.post('/:id/repay', async (req, res, next) => {
    try {
        const userId = (req as any).user?.id;
        const { id } = req.params;
        const { amount } = req.body;

        const loan = await prisma.loan.findUnique({ where: { id } });
        const wallet = await prisma.wallet.findUnique({ where: { userId } });

        if (!loan || !wallet) {
            return res.status(404).json({ status: 'error', message: 'Loan or wallet not found' });
        }

        if (Number(wallet.balance) < amount) {
            return res.status(400).json({ status: 'error', message: 'Insufficient balance' });
        }

        await prisma.$transaction([
            prisma.wallet.update({
                where: { userId },
                data: { balance: { decrement: amount } }
            }),
            prisma.transaction.create({
                data: {
                    walletId: wallet.id,
                    type: 'LOAN_REPAYMENT',
                    amount: -amount,
                    description: `Loan repayment`,
                    status: 'SUCCESS',
                    metadata: { loanId: id }
                }
            })
        ]);

        res.json({ status: 'success', message: 'Repayment successful' });
    } catch (error) {
        next(error);
    }
});

export default router;
