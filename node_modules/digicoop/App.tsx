import React, { useState, useMemo } from 'react';
import { 
  Home, 
  Wallet, 
  PiggyBank, 
  ShoppingBag, 
  TrendingUp, 
  Vote, 
  Bell, 
  User, 
  Menu,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  ChevronRight,
  Search,
  Target,
  CreditCard,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  MapPin,
  X
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { 
  MOCK_USER, 
  RECENT_TRANSACTIONS, 
  SAVINGS_GOALS, 
  GROUP_BUY_ITEMS, 
  INVESTMENTS, 
  GOVERNANCE_POLLS, 
  EVENTS 
} from './constants';
import { TransactionType, SavingsGoal, GroupBuyItem, InvestmentProject } from './types';

// --- Utility Components ---

const ProgressBar = ({ current, total, color = 'bg-primary' }: { current: number; total: number; color?: string }) => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  return (
    <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
      <div 
        className={`${color} h-2.5 rounded-full transition-all duration-500`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const Card = ({ children, className = '' }: { children?: React.ReactNode; className?: string; key?: React.Key }) => (
  <div className={`bg-white rounded-3xl p-5 shadow-sm border border-stone-100 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, type = 'success' }: { children?: React.ReactNode; type?: 'success' | 'warning' | 'danger' | 'neutral' }) => {
  const colors = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    neutral: 'bg-stone-100 text-stone-600',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[type]}`}>
      {children}
    </span>
  );
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
};

// --- Views ---

const DashboardView = ({ onChangeView }: { onChangeView: (view: string) => void }) => {
  const data = [
    { name: 'Jan', amount: 40000 },
    { name: 'Feb', amount: 55000 },
    { name: 'Mar', amount: 50000 },
    { name: 'Apr', amount: 80000 },
    { name: 'May', amount: 95000 },
    { name: 'Jun', amount: 120000 },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-stone-500 text-sm">Welcome back,</p>
          <h1 className="text-2xl font-bold text-stone-900">{MOCK_USER.name}</h1>
        </div>
        <div className="relative">
          <Bell className="w-6 h-6 text-stone-600" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#FDFBF7]"></span>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="bg-secondary rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-stone-700 rounded-full -mr-10 -mt-10 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary rounded-full -ml-10 -mb-10 opacity-20"></div>
        
        <p className="text-stone-400 text-sm mb-1">Total Balance</p>
        <h2 className="text-4xl font-bold mb-6">{formatCurrency(MOCK_USER.walletBalance)}</h2>
        
        <div className="flex gap-4">
          <button className="flex-1 bg-primary text-stone-900 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primaryDark transition">
            <Plus className="w-4 h-4" /> Deposit
          </button>
          <button className="flex-1 bg-stone-700 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-stone-600 transition">
            <ArrowUpRight className="w-4 h-4" /> Withdraw
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: PiggyBank, label: 'Save', view: 'savings', color: 'bg-blue-100 text-blue-600' },
          { icon: CreditCard, label: 'Loan', view: 'loans', color: 'bg-green-100 text-green-600' },
          { icon: ShoppingBag, label: 'Buy', view: 'groupbuy', color: 'bg-purple-100 text-purple-600' },
          { icon: TrendingUp, label: 'Invest', view: 'investments', color: 'bg-orange-100 text-orange-600' },
        ].map((action, idx) => (
          <button 
            key={idx} 
            onClick={() => onChangeView(action.view)}
            className="flex flex-col items-center gap-2"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${action.color}`}>
              <action.icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-stone-600">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Savings Growth Chart */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-stone-900">Savings Growth</h3>
          <select className="bg-stone-100 text-xs px-2 py-1 rounded-lg border-none outline-none">
            <option>Last 6 Months</option>
          </select>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F4D35E" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F4D35E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="amount" stroke="#F4D35E" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Transactions */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-stone-900">Recent Activity</h3>
          <button className="text-primaryDark text-sm font-medium">See All</button>
        </div>
        <div className="space-y-3">
          {RECENT_TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === TransactionType.DEPOSIT ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {tx.type === TransactionType.DEPOSIT ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium text-stone-900">{tx.description}</p>
                  <p className="text-xs text-stone-500">{tx.date}</p>
                </div>
              </div>
              <span className={`font-semibold ${
                tx.amount > 0 ? 'text-green-600' : 'text-stone-900'
              }`}>
                {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SavingsView = () => {
  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-2xl font-bold text-stone-900">My Savings</h1>
      
      {/* Create New Goal Button */}
      <button className="w-full bg-secondary text-white p-4 rounded-2xl flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-stone-700 p-2 rounded-xl">
            <Plus className="w-6 h-6 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-bold">Create New Goal</p>
            <p className="text-stone-400 text-sm">Start saving for something special</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-stone-400" />
      </button>

      {/* Active Goals */}
      <div className="space-y-4">
        {SAVINGS_GOALS.map((goal) => (
          <Card key={goal.id} className="relative overflow-hidden">
             {goal.locked && <Lock className="absolute top-4 right-4 w-4 h-4 text-stone-400" />}
             {!goal.locked && <Unlock className="absolute top-4 right-4 w-4 h-4 text-primaryDark" />}
             
             <div className="mb-4">
               <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">{goal.type}</span>
               <h3 className="text-lg font-bold text-stone-900 mt-1">{goal.title}</h3>
             </div>
             
             <div className="flex justify-between items-end mb-2">
               <div>
                 <p className="text-2xl font-bold text-stone-900">{formatCurrency(goal.currentAmount)}</p>
                 <p className="text-xs text-stone-500">of {formatCurrency(goal.targetAmount)}</p>
               </div>
               <p className="text-lg font-bold text-primaryDark">
                 {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
               </p>
             </div>
             
             <ProgressBar current={goal.currentAmount} total={goal.targetAmount} />
             
             <div className="mt-4 flex gap-2">
               <button className="flex-1 bg-primary bg-opacity-20 text-stone-900 py-2 rounded-lg text-sm font-medium hover:bg-opacity-30">
                 Top Up
               </button>
               {!goal.locked && (
                 <button className="flex-1 border border-stone-200 text-stone-600 py-2 rounded-lg text-sm font-medium hover:bg-stone-50">
                   Withdraw
                 </button>
               )}
             </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const GroupBuyView = () => {
  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-stone-900">Group Buy</h1>
        <div className="bg-white p-2 rounded-full shadow-sm">
           <Search className="w-5 h-5 text-stone-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GROUP_BUY_ITEMS.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 flex flex-col">
            <div className="h-48 bg-stone-200 relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-bold text-stone-900 shadow-md">
                Ends {new Date(item.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-lg text-stone-900 mb-1">{item.name}</h3>
              <p className="text-sm text-stone-500 mb-4 line-clamp-2">{item.description}</p>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-primaryDark font-bold text-xl">{formatCurrency(item.pricePerUnit)}</span>
                <span className="text-xs text-stone-400">/ unit</span>
              </div>

              <div className="mt-auto">
                <div className="flex justify-between text-xs mb-1 font-medium text-stone-600">
                  <span>{item.currentOrderQuantity} ordered</span>
                  <span>Target: {item.minOrderQuantity}</span>
                </div>
                <ProgressBar current={item.currentOrderQuantity} total={item.minOrderQuantity} color="bg-green-500" />
                <button className="w-full mt-4 bg-secondary text-white py-3 rounded-xl font-medium hover:bg-stone-800 transition">
                  Join Purchase
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LoansView = () => {
  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-2xl font-bold text-stone-900">Loans</h1>

      {/* Loan Eligibility Card */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl p-6 text-white">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-stone-400 text-sm">Available Limit</p>
            <h2 className="text-3xl font-bold">₦200,000.00</h2>
          </div>
          <div className="bg-primary/20 p-2 rounded-full">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
        </div>
        <p className="text-sm text-stone-300 mb-6">
          Based on your savings history and repayment score, you are eligible for an instant loan.
        </p>
        <button className="w-full bg-primary text-stone-900 py-3 rounded-xl font-bold hover:bg-primaryDark transition">
          Apply Now
        </button>
      </div>

      {/* Calculator (Simplified) */}
      <Card>
        <h3 className="font-bold text-stone-900 mb-4">Loan Calculator</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-500 uppercase">Amount</label>
            <input 
              type="range" 
              min="10000" 
              max="200000" 
              step="5000" 
              defaultValue="50000"
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-primary mt-2" 
            />
            <div className="flex justify-between mt-1 text-sm font-medium text-stone-900">
              <span>₦10,000</span>
              <span>₦200,000</span>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-stone-500 uppercase">Duration</label>
            <div className="flex gap-2 mt-2">
              {[1, 3, 6, 12].map((m) => (
                <button key={m} className={`flex-1 py-2 rounded-lg text-sm border ${m === 3 ? 'bg-primary border-primary text-stone-900 font-bold' : 'border-stone-200 text-stone-600'}`}>
                  {m} Mo
                </button>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
             <div>
               <p className="text-xs text-stone-500">Estimated Repayment</p>
               <p className="text-lg font-bold text-stone-900">₦18,500 <span className="text-xs font-normal">/mo</span></p>
             </div>
             <div className="text-right">
                <p className="text-xs text-stone-500">Interest</p>
                <p className="text-sm font-bold text-green-600">5% p.m.</p>
             </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const InvestmentsView = () => {
  return (
    <div className="space-y-6 pb-24">
       <h1 className="text-2xl font-bold text-stone-900">Investments</h1>
       
       <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
         {['All', 'Agriculture', 'Real Estate', 'Transport'].map((cat, i) => (
           <button key={cat} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${i === 0 ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 border border-stone-200'}`}>
             {cat}
           </button>
         ))}
       </div>

       <div className="space-y-5">
         {INVESTMENTS.map((inv) => (
           <Card key={inv.id}>
             <div className="flex justify-between items-start mb-2">
               <Badge type="success">{inv.roi}% ROI</Badge>
               <span className="text-xs font-bold text-stone-400">{inv.durationMonths} Months</span>
             </div>
             <h3 className="font-bold text-lg text-stone-900">{inv.title}</h3>
             <p className="text-sm text-stone-500 mb-4">{inv.description}</p>
             
             <div className="flex justify-between text-xs text-stone-600 mb-1">
               <span>{formatCurrency(inv.raisedAmount)} raised</span>
               <span>Target: {formatCurrency(inv.targetAmount)}</span>
             </div>
             <ProgressBar current={inv.raisedAmount} total={inv.targetAmount} color="bg-primary" />
             
             <div className="flex justify-between items-center mt-4 pt-4 border-t border-stone-100">
               <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-stone-300"></div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-500">
                    +{inv.investorsCount}
                  </div>
               </div>
               <button className="bg-stone-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-stone-800">
                 Invest
               </button>
             </div>
           </Card>
         ))}
       </div>
    </div>
  );
}

const GovernanceView = () => {
  const [voted, setVoted] = useState<Record<string, string>>({});

  const handleVote = (pollId: string, optionId: string) => {
    setVoted(prev => ({...prev, [pollId]: optionId}));
  };

  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-2xl font-bold text-stone-900">Governance</h1>

      {/* Events Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-stone-900">Upcoming Events</h2>
        </div>
        {EVENTS.map((evt) => (
          <div key={evt.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100">
             <div className="h-32 bg-stone-200 relative">
               <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
               <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-stone-900 flex items-center gap-1">
                 <Calendar className="w-3 h-3" />
                 {new Date(evt.date).toLocaleDateString()}
               </div>
             </div>
             <div className="p-4">
               <h3 className="font-bold text-stone-900">{evt.title}</h3>
               <div className="flex items-center gap-1 text-xs text-stone-500 mt-1 mb-3">
                 <MapPin className="w-3 h-3" /> {evt.location}
               </div>
               <div className="flex gap-2">
                 <button className="flex-1 bg-primary text-stone-900 py-2 rounded-lg text-sm font-bold">I'm Coming</button>
                 <button className="flex-1 border border-stone-200 text-stone-500 py-2 rounded-lg text-sm font-medium">Can't Make It</button>
               </div>
             </div>
          </div>
        ))}
      </div>

      {/* Voting Section */}
      <div>
        <h2 className="font-bold text-stone-900 mb-4">Active Polls</h2>
        {GOVERNANCE_POLLS.map((poll) => (
          <Card key={poll.id}>
             <div className="flex justify-between items-start mb-3">
                <Badge type="warning">Closing Soon</Badge>
                <span className="text-xs text-stone-400">Ends {new Date(poll.endDate).toLocaleDateString()}</span>
             </div>
             <h3 className="font-semibold text-stone-900 mb-4">{poll.question}</h3>
             
             <div className="space-y-3">
               {poll.options.map((opt) => {
                 const isSelected = voted[poll.id] === opt.id;
                 const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0) + (voted[poll.id] ? 1 : 0);
                 const percentage = Math.round(((opt.votes + (isSelected ? 1 : 0)) / totalVotes) * 100) || 0;
                 
                 return (
                   <button 
                    key={opt.id}
                    onClick={() => handleVote(poll.id, opt.id)}
                    disabled={!!voted[poll.id]}
                    className={`w-full relative p-3 rounded-xl border text-left transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/10' 
                        : 'border-stone-100 hover:border-stone-200 bg-stone-50'
                    }`}
                   >
                     <div className="relative z-10 flex justify-between items-center">
                        <span className={`text-sm font-medium ${isSelected ? 'text-stone-900' : 'text-stone-600'}`}>
                          {opt.text}
                        </span>
                        {voted[poll.id] && (
                          <span className="text-xs font-bold text-stone-900">{percentage}%</span>
                        )}
                     </div>
                     {voted[poll.id] && (
                       <div 
                         className="absolute top-0 left-0 h-full bg-stone-200/50 rounded-xl transition-all duration-500"
                         style={{ width: `${percentage}%` }}
                       ></div>
                     )}
                   </button>
                 );
               })}
             </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// --- Layout & Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch(activeTab) {
      case 'home': return <DashboardView onChangeView={setActiveTab} />;
      case 'savings': return <SavingsView />;
      case 'groupbuy': return <GroupBuyView />;
      case 'loans': return <LoansView />;
      case 'investments': return <InvestmentsView />;
      case 'governance': return <GovernanceView />;
      default: return <DashboardView onChangeView={setActiveTab} />;
    }
  };

  const NavItem = ({ id, icon: Icon, label }: { id: string; icon: any; label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center gap-1 p-2 ${
        activeTab === id ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'
      }`}
    >
      <Icon className={`w-6 h-6 ${activeTab === id ? 'fill-current' : ''}`} strokeWidth={activeTab === id ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen w-full bg-[#FDFBF7] text-stone-900 overflow-hidden font-sans">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-stone-200 p-6 bg-white">
         <div className="flex items-center gap-3 mb-10">
           <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
             <div className="w-6 h-6 bg-secondary rounded-full"></div>
           </div>
           <span className="text-xl font-bold tracking-tight">DigiCoop</span>
         </div>
         
         <nav className="flex-1 space-y-2">
            {[
              { id: 'home', label: 'Overview', icon: Home },
              { id: 'savings', label: 'Savings', icon: PiggyBank },
              { id: 'loans', label: 'Loans', icon: CreditCard },
              { id: 'groupbuy', label: 'Group Buy', icon: ShoppingBag },
              { id: 'investments', label: 'Investments', icon: TrendingUp },
              { id: 'governance', label: 'Governance', icon: Vote },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-secondary text-white shadow-md' 
                    : 'text-stone-500 hover:bg-stone-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
         </nav>
         
         <div className="pt-6 border-t border-stone-100">
           <button className="flex items-center gap-3 px-4 py-3 text-stone-500 hover:text-stone-900 w-full">
             <User className="w-5 h-5" />
             <span className="font-medium">Profile</span>
           </button>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="lg:hidden flex justify-between items-center p-4 bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-stone-100">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
               <div className="w-4 h-4 bg-secondary rounded-full"></div>
             </div>
             <span className="font-bold text-lg">DigiCoop</span>
          </div>
          <button className="p-2 bg-stone-100 rounded-full">
            <User className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-5xl mx-auto w-full">
           {renderContent()}
        </div>

        {/* Bottom Navigation (Mobile) */}
        <div className="lg:hidden absolute bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-6 py-2 pb-5 z-30 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
           <NavItem id="home" icon={Home} label="Home" />
           <NavItem id="savings" icon={PiggyBank} label="Save" />
           <div className="relative -top-6">
             <button 
               onClick={() => setActiveTab('groupbuy')}
               className="w-14 h-14 bg-stone-900 rounded-full flex items-center justify-center text-primary shadow-lg hover:scale-105 transition-transform"
             >
               <ShoppingBag className="w-6 h-6" />
             </button>
           </div>
           <NavItem id="investments" icon={TrendingUp} label="Invest" />
           <NavItem id="governance" icon={Vote} label="Vote" />
        </div>
      </main>

    </div>
  );
}