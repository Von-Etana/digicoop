import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

enum SavingsType {
    COMPULSORY = 'COMPULSORY',
    VOLUNTARY = 'VOLUNTARY',
    GOAL = 'GOAL'
}

enum LoanStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    ACTIVE = 'ACTIVE',
    PAID = 'PAID',
    DEFAULTED = 'DEFAULTED'
}

enum TransactionType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL',
    SAVINGS_CONTRIBUTION = 'SAVINGS_CONTRIBUTION',
    LOAN_DISBURSEMENT = 'LOAN_DISBURSEMENT',
    LOAN_REPAYMENT = 'LOAN_REPAYMENT',
    GROUP_BUY = 'GROUP_BUY',
    INVESTMENT = 'INVESTMENT',
    DIVIDEND = 'DIVIDEND'
}
enum TransactionStatus {
    SUCCESS = 'SUCCESS',
    PENDING = 'PENDING',
    FAILED = 'FAILED'
}

async function main() {
    console.log('🌱 Seeding database...');

    // Create Users
    const users = [];
    for (let i = 0; i < 10; i++) {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                phoneNumber: faker.phone.number(),
                passwordHash: 'hashed_password_123', // In real app, hash this
                fullName: faker.name.fullName(),
                bvn: faker.random.numeric(11),
                kycStatus: faker.helpers.arrayElement(['PENDING', 'VERIFIED', 'FAILED']),
                membershipId: `DIGI-${faker.random.numeric(4)}`,
                wallet: {
                    create: {
                        balance: faker.finance.amount(5000, 500000, 2),
                        currency: 'NGN'
                    }
                }
            },
        });
        users.push(user);
        console.log(`Created user: ${user.fullName}`);
    }

    // Create Transactions for each User's Wallet
    for (const user of users) {
        const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
        if (wallet) {
            for (let j = 0; j < 5; j++) {
                const amount = faker.datatype.float({ min: 1000, max: 20000, precision: 0.01 });
                await prisma.transaction.create({
                    data: {
                        walletId: wallet.id,
                        type: faker.helpers.arrayElement(Object.values(TransactionType)),
                        amount: amount,
                        description: faker.finance.transactionDescription(),
                        status: faker.helpers.arrayElement(Object.values(TransactionStatus)),
                        reference: faker.random.alphaNumeric(10).toUpperCase(),
                        metadata: {}
                    }
                })
            }
        }
    }

    // Create Savings Goals
    for (const user of users) {
        await prisma.savingsGoal.create({
            data: {
                userId: user.id,
                title: faker.finance.accountName() + ' Savings',
                targetAmount: faker.datatype.float({ min: 50000, max: 200000, precision: 0.01 }),
                currentAmount: faker.datatype.float({ min: 0, max: 50000, precision: 0.01 }),
                type: faker.helpers.arrayElement(Object.values(SavingsType)),
                dueDate: faker.date.future(),
                locked: faker.datatype.boolean()
            }
        });
    }

    // Create Investments
    const projects = [];
    for (let i = 0; i < 3; i++) {
        const project = await prisma.investmentProject.create({
            data: {
                title: faker.company.bs() + ' Project',
                description: faker.lorem.paragraph(),
                targetAmount: 1000000,
                raisedAmount: faker.datatype.float({ min: 0, max: 1000000, precision: 0.01 }),
                roiPercentage: 10 + i * 2,
                durationMonths: 6 + i,
                closingDate: faker.date.future()
            }
        });
        projects.push(project);
    }

    // User Investments
    for (const user of users) {
        if (Math.random() > 0.5) {
            await prisma.investment.create({
                data: {
                    userId: user.id,
                    projectId: faker.helpers.arrayElement(projects).id,
                    amount: faker.datatype.float({ min: 5000, max: 50000, precision: 0.01 })
                }
            })
        }
    }

    // Group Buy Items
    for (let i = 0; i < 3; i++) {
        await prisma.groupBuyItem.create({
            data: {
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                imageUrl: faker.image.food(),
                pricePerUnit: faker.datatype.float({ min: 1000, max: 5000, precision: 0.01 }),
                minOrderQuantity: 50,
                currentOrderQuantity: faker.datatype.number({ min: 0, max: 40 }),
                deadline: faker.date.future()
            }
        })
    }

    // Events
    for (let i = 0; i < 3; i++) {
        await prisma.event.create({
            data: {
                title: faker.company.catchPhrase(),
                date: faker.date.future(),
                location: faker.address.city(),
                imageUrl: faker.image.abstract(),
                status: 'UPCOMING'
            }
        })
    }

    // Polls
    for (let i = 0; i < 2; i++) {
        await prisma.poll.create({
            data: {
                question: faker.lorem.sentence() + '?',
                endDate: faker.date.future(),
                options: {
                    create: [
                        { text: 'Yes' },
                        { text: 'No' },
                        { text: 'Maybe' }
                    ]
                }
            }
        })
    }


    console.log('✅ Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
