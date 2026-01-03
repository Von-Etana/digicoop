import { Router } from 'express';
import { prisma } from '@digicoop/database';

const router = Router();

// Get all investment projects
router.get('/', async (req, res, next) => {
    try {
        const projects = await prisma.investmentProject.findMany({
            orderBy: { closingDate: 'asc' }
        });
        res.json({ status: 'success', data: projects });
    } catch (error) {
        next(error);
    }
});

// Get single project with investors
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const project = await prisma.investmentProject.findUnique({
            where: { id },
            include: {
                investments: {
                    include: { user: { select: { id: true, fullName: true } } }
                }
            }
        });

        const investorsCount = await prisma.investment.count({ where: { projectId: id } });

        res.json({ status: 'success', data: { ...project, investorsCount } });
    } catch (error) {
        next(error);
    }
});

// Invest in a project
router.post('/:id/invest', async (req, res, next) => {
    try {
        const userId = (req as any).user?.id;
        const { id } = req.params;
        const { amount } = req.body;

        const project = await prisma.investmentProject.findUnique({ where: { id } });
        const wallet = await prisma.wallet.findUnique({ where: { userId } });

        if (!project || !wallet) {
            return res.status(404).json({ status: 'error', message: 'Project or wallet not found' });
        }

        if (new Date() > new Date(project.closingDate)) {
            return res.status(400).json({ status: 'error', message: 'Investment window has closed' });
        }

        if (Number(wallet.balance) < amount) {
            return res.status(400).json({ status: 'error', message: 'Insufficient wallet balance' });
        }

        await prisma.$transaction([
            prisma.wallet.update({
                where: { userId },
                data: { balance: { decrement: amount } }
            }),
            prisma.investment.create({
                data: {
                    userId,
                    projectId: id,
                    amount
                }
            }),
            prisma.investmentProject.update({
                where: { id },
                data: { raisedAmount: { increment: amount } }
            }),
            prisma.transaction.create({
                data: {
                    walletId: wallet.id,
                    type: 'INVESTMENT',
                    amount: -amount,
                    description: `Investment: ${project.title}`,
                    status: 'SUCCESS'
                }
            })
        ]);

        res.json({ status: 'success', message: 'Investment successful' });
    } catch (error) {
        next(error);
    }
});

// Get user's investments
router.get('/my/portfolio', async (req, res, next) => {
    try {
        const userId = (req as any).user?.id;
        const investments = await prisma.investment.findMany({
            where: { userId },
            include: { project: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ status: 'success', data: investments });
    } catch (error) {
        next(error);
    }
});

// Admin: Create investment project
router.post('/', async (req, res, next) => {
    try {
        const { title, description, pitch, targetAmount, roiPercentage, durationMonths, closingDate } = req.body;

        const project = await prisma.investmentProject.create({
            data: {
                title,
                description,
                pitch,
                targetAmount,
                roiPercentage,
                durationMonths,
                closingDate: new Date(closingDate)
            }
        });

        res.json({ status: 'success', data: project });
    } catch (error) {
        next(error);
    }
});

export default router;
