export declare enum Role {
    MEMBER = "MEMBER",
    ADMIN = "ADMIN",
    VENDOR = "VENDOR"
}
export declare enum KycStatus {
    PENDING = "PENDING",
    VERIFIED = "VERIFIED",
    FAILED = "FAILED"
}
export declare enum TransactionType {
    DEPOSIT = "DEPOSIT",
    WITHDRAWAL = "WITHDRAWAL",
    SAVINGS_CONTRIBUTION = "SAVINGS_CONTRIBUTION",
    LOAN_DISBURSEMENT = "LOAN_DISBURSEMENT",
    LOAN_REPAYMENT = "LOAN_REPAYMENT",
    GROUP_BUY = "GROUP_BUY",
    INVESTMENT = "INVESTMENT",
    DIVIDEND = "DIVIDEND"
}
export declare enum TransactionStatus {
    SUCCESS = "SUCCESS",
    PENDING = "PENDING",
    FAILED = "FAILED"
}
export interface User {
    id: string;
    email: string;
    phoneNumber: string;
    fullName: string;
    bvn?: string;
    nin?: string;
    kycStatus: KycStatus;
    membershipId?: string;
    role: Role;
    createdAt: string;
}
export interface Wallet {
    id: string;
    userId: string;
    balance: number;
    currency: string;
}
export interface Transaction {
    id: string;
    walletId: string;
    type: TransactionType;
    amount: number;
    description: string;
    reference?: string;
    status: TransactionStatus;
    createdAt: string;
}
export interface LoginResponse {
    status: 'success';
    data: {
        user: User;
        token: string;
    };
}
export interface KycVerifyRequest {
    bvn: string;
    firstName: string;
    lastName: string;
    dob?: string;
}
