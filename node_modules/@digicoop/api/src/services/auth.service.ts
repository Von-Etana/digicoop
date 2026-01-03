import { prisma } from '@digicoop/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
    static async register(data: any) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        return prisma.user.create({
            data: {
                email: data.email,
                phoneNumber: data.phoneNumber,
                passwordHash: hashedPassword,
                fullName: data.fullName,
                kycStatus: "PENDING"
            }
        });
    }

    static async login(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error('User not found');

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) throw new Error('Invalid password');

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret');
        return { user, token };
    }
}
