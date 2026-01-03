import { 
  User, 
  Transaction, 
  TransactionType, 
  SavingsGoal, 
  Loan, 
  GroupBuyItem, 
  InvestmentProject, 
  Poll,
  Event
} from './types';

export const MOCK_USER: User = {
  id: 'u123',
  name: 'Chioma Adebayo',
  email: 'chioma@example.com',
  phoneNumber: '+2348012345678',
  walletBalance: 145500.00,
  kycVerified: true,
  bvn: '1234****901',
  membershipId: 'DIGI-0024'
};

export const RECENT_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    type: TransactionType.DEPOSIT,
    amount: 50000,
    date: '2023-10-25',
    description: 'Bank Transfer Deposit',
    status: 'SUCCESS'
  },
  {
    id: 't2',
    type: TransactionType.SAVINGS_CONTRIBUTION,
    amount: -10000,
    date: '2023-10-26',
    description: 'Auto-save: Rainy Day',
    status: 'SUCCESS'
  },
  {
    id: 't3',
    type: TransactionType.GROUP_BUY,
    amount: -25000,
    date: '2023-10-28',
    description: 'Bag of Rice (50kg)',
    status: 'SUCCESS'
  }
];

export const SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 's1',
    title: 'Compulsory Savings',
    targetAmount: 500000,
    currentAmount: 120000,
    type: 'COMPULSORY',
    locked: true
  },
  {
    id: 's2',
    title: 'December Detty',
    targetAmount: 200000,
    currentAmount: 85000,
    type: 'GOAL',
    dueDate: '2023-12-01',
    locked: false
  },
  {
    id: 's3',
    title: 'New Laptop',
    targetAmount: 450000,
    currentAmount: 15000,
    type: 'VOLUNTARY',
    locked: false
  }
];

export const GROUP_BUY_ITEMS: GroupBuyItem[] = [
  {
    id: 'g1',
    name: 'Mama Gold Rice (50kg)',
    image: 'https://picsum.photos/400/400?random=1',
    pricePerUnit: 52000,
    minOrderQuantity: 100,
    currentOrderQuantity: 85,
    deadline: '2023-11-05',
    description: 'Premium parboiled rice, stone-free. Share bulk purchase discount.'
  },
  {
    id: 'g2',
    name: 'Kings Vegetable Oil (5L)',
    image: 'https://picsum.photos/400/400?random=2',
    pricePerUnit: 8500,
    minOrderQuantity: 200,
    currentOrderQuantity: 45,
    deadline: '2023-11-10',
    description: 'Pure vegetable oil, carton sharing available.'
  }
];

export const INVESTMENTS: InvestmentProject[] = [
  {
    id: 'i1',
    title: 'Cashew Export 2024',
    description: 'Funding the aggregation and export of raw cashew nuts from Ogbomoso.',
    targetAmount: 10000000,
    raisedAmount: 7500000,
    roi: 22,
    durationMonths: 6,
    investorsCount: 420,
    closingDate: '2023-11-15'
  },
  {
    id: 'i2',
    title: 'Poultry Farm Expansion',
    description: 'Expanding layer capacity by 5,000 birds in Ogun State farm.',
    targetAmount: 5000000,
    raisedAmount: 1200000,
    roi: 15,
    durationMonths: 4,
    investorsCount: 85,
    closingDate: '2023-11-30'
  }
];

export const ACTIVE_LOANS: Loan[] = [
  // Uncomment below to simulate active loan
  // {
  //   id: 'l1',
  //   amount: 50000,
  //   purpose: 'Emergency Medical',
  //   status: 'ACTIVE',
  //   repaymentDate: '2023-11-25',
  //   interestRate: 5
  // }
];

export const GOVERNANCE_POLLS: Poll[] = [
  {
    id: 'p1',
    question: 'Should we increase the compulsory monthly savings minimum to ₦5,000?',
    options: [
      { id: 'o1', text: 'Yes, increase it', votes: 120 },
      { id: 'o2', text: 'No, keep it at ₦2,000', votes: 85 }
    ],
    endDate: '2023-11-01'
  }
];

export const EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Annual General Meeting (AGM)',
    date: '2023-12-15T10:00:00',
    location: 'Muson Centre, Lagos & Zoom',
    image: 'https://picsum.photos/600/300?random=10',
    attendees: 150,
    status: 'UPCOMING'
  }
];