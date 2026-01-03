export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  SAVINGS_CONTRIBUTION = 'SAVINGS_CONTRIBUTION',
  LOAN_DISBURSEMENT = 'LOAN_DISBURSEMENT',
  LOAN_REPAYMENT = 'LOAN_REPAYMENT',
  GROUP_BUY = 'GROUP_BUY',
  INVESTMENT = 'INVESTMENT'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  walletBalance: number;
  kycVerified: boolean;
  bvn: string;
  membershipId: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  type: 'COMPULSORY' | 'VOLUNTARY' | 'GOAL';
  dueDate?: string;
  locked: boolean;
}

export interface Loan {
  id: string;
  amount: number;
  purpose: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'PAID';
  repaymentDate: string;
  interestRate: number;
}

export interface GroupBuyItem {
  id: string;
  name: string;
  image: string;
  pricePerUnit: number;
  minOrderQuantity: number;
  currentOrderQuantity: number;
  deadline: string;
  description: string;
}

export interface InvestmentProject {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  roi: number;
  durationMonths: number;
  investorsCount: number;
  closingDate: string;
}

export interface Poll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  endDate: string;
  userVoted?: string; // optionId
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  attendees: number;
  status: 'UPCOMING' | 'PAST';
}