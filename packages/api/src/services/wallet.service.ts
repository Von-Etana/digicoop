import { prisma } from '@digicoop/database';
import { User, Wallet } from '@prisma/client';

export class WalletService {
    static async createWallet(userId: string): Promise<Wallet> {
        return prisma.wallet.create({
            data: {
                userId
            }
        });
    }

    static async getBalance(userId: string): Promise<Wallet | null> {
        return prisma.wallet.findUnique({
            where: { userId }
        });
    }

    static async creditWallet(userId: string, amount: number, description: string): Promise<Wallet> {
        // Transaction login should be here
        return prisma.wallet.update({
            where: { userId },
            data: {
                balance: {
                    increment: amount
                }
            }
        });
    }
}
