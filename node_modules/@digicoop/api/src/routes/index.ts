import { Router } from 'express';
import authRoutes from './auth.routes';
import kycRoutes from './kyc.routes';
import paymentsRoutes from './payments.routes';
import notificationsRoutes from './notifications.routes';
import savingsRoutes from './savings.routes';
import loansRoutes from './loans.routes';
import groupbuyRoutes from './groupbuy.routes';
import investmentsRoutes from './investments.routes';
import governanceRoutes from './governance.routes';
import walletRoutes from './wallet.routes';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/kyc', authenticate, kycRoutes);
router.use('/payments', authenticate, paymentsRoutes);
router.use('/notifications', authenticate, notificationsRoutes);
router.use('/savings', authenticate, savingsRoutes);
router.use('/loans', authenticate, loansRoutes);
router.use('/groupbuy', authenticate, groupbuyRoutes);
router.use('/investments', authenticate, investmentsRoutes);
router.use('/governance', authenticate, governanceRoutes);
router.use('/wallet', authenticate, walletRoutes);

router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

export default router;
