import { Router } from 'express';
import { FlutterwaveService } from '../services/flutterwave.service';
import { prisma } from '@digicoop/database';

const router = Router();

router.post('/initiate-deposit', async (req, res, next) => {
    try {
        const { amount } = req.body;
        const userId = (req as any).user.id;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) throw new Error('User not found');

        const txRef = `TX-${Date.now()}-${userId}`;

        const paymentData = await FlutterwaveService.initiatePayment({
            tx_ref: txRef,
            amount: amount.toString(),
            currency: 'NGN',
            redirect_url: 'https://digicoop.app/payments/callback',
            customer: {
                email: user.email,
                phonenumber: user.phoneNumber,
                name: user.fullName
            },
            customizations: {
                title: 'DigiCoop Wallet Deposit',
                logo: 'https://digicoop.app/logo.png'
            }
        });

        // Record pending transaction
        await prisma.transaction.create({
            data: {
                walletId: (await prisma.wallet.findUniqueOrThrow({ where: { userId } })).id,
                type: 'DEPOSIT',
                amount: amount,
                description: 'Wallet Deposit',
                reference: txRef,
                status: 'PENDING'
            }
        });

        res.json({ status: 'success', data: paymentData });

    } catch (error) {
        next(error);
    }
});

router.post('/webhook', async (req, res) => {
    // Verify webhook signature (todo)
    const payload = req.body;

    if (payload.status === 'successful') {
        const txRef = payload.txRef;
        const transaction = await prisma.transaction.findFirst({ where: { reference: txRef } });

        if (transaction && transaction.status === 'PENDING') {
            // Verify from source
            const verified = await FlutterwaveService.verifyTransaction(payload.id);

            if (verified.status === 'success' && verified.data.amount >= transaction.amount) {
                await prisma.$transaction([
                    prisma.transaction.update({
                        where: { id: transaction.id },
                        data: { status: 'SUCCESS' }
                    }),
                    prisma.wallet.update({
                        where: { id: transaction.walletId },
                        data: { balance: { increment: transaction.amount } }
                    })
                ]);
            }
        }
    }

    res.sendStatus(200);
});

export default router;
