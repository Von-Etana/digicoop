import { Router } from 'express';
import { prisma } from '@digicoop/database';

const router = Router();

// Get all active group buy items
router.get('/', async (req, res, next) => {
    try {
        const items = await prisma.groupBuyItem.findMany({
            where: { deadline: { gte: new Date() } },
            orderBy: { deadline: 'asc' }
        });
        res.json({ status: 'success', data: items });
    } catch (error) {
        next(error);
    }
});

// Get single item with orders
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await prisma.groupBuyItem.findUnique({
            where: { id },
            include: {
                orders: {
                    include: { user: { select: { id: true, fullName: true } } }
                }
            }
        });
        res.json({ status: 'success', data: item });
    } catch (error) {
        next(error);
    }
});

// Place order
router.post('/:id/order', async (req, res, next) => {
    try {
        const userId = (req as any).user?.id;
        const { id } = req.params;
        const { quantity } = req.body;

        const item = await prisma.groupBuyItem.findUnique({ where: { id } });
        const wallet = await prisma.wallet.findUnique({ where: { userId } });

        if (!item || !wallet) {
            return res.status(404).json({ status: 'error', message: 'Item or wallet not found' });
        }

        if (new Date() > new Date(item.deadline)) {
            return res.status(400).json({ status: 'error', message: 'Order deadline has passed' });
        }

        const totalPrice = Number(item.pricePerUnit) * quantity;

        if (Number(wallet.balance) < totalPrice) {
            return res.status(400).json({ status: 'error', message: 'Insufficient wallet balance' });
        }

        await prisma.$transaction([
            prisma.wallet.update({
                where: { userId },
                data: { balance: { decrement: totalPrice } }
            }),
            prisma.groupBuyOrder.create({
                data: {
                    userId,
                    itemId: id,
                    quantity,
                    totalPrice,
                    status: 'PAID'
                }
            }),
            prisma.groupBuyItem.update({
                where: { id },
                data: { currentOrderQuantity: { increment: quantity } }
            }),
            prisma.transaction.create({
                data: {
                    walletId: wallet.id,
                    type: 'GROUP_BUY',
                    amount: -totalPrice,
                    description: `Group Buy: ${item.name} x${quantity}`,
                    status: 'SUCCESS'
                }
            })
        ]);

        res.json({ status: 'success', message: 'Order placed successfully' });
    } catch (error) {
        next(error);
    }
});

// Admin: Create group buy item
router.post('/', async (req, res, next) => {
    try {
        const { name, description, imageUrl, pricePerUnit, minOrderQuantity, deadline } = req.body;

        const item = await prisma.groupBuyItem.create({
            data: {
                name,
                description,
                imageUrl,
                pricePerUnit,
                minOrderQuantity,
                deadline: new Date(deadline)
            }
        });

        res.json({ status: 'success', data: item });
    } catch (error) {
        next(error);
    }
});

export default router;
