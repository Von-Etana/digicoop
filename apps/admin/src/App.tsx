import { createBrowserRouter, RouterProvider, Outlet, Link, useLocation } from 'react-router-dom'
import './App.css'

// Icons
const HomeIcon = () => <span>🏠</span>
const UsersIcon = () => <span>👥</span>
const LoansIcon = () => <span>💰</span>
const GroupBuyIcon = () => <span>🛒</span>
const InvestIcon = () => <span>📈</span>
const GovernanceIcon = () => <span>🗳️</span>
const SettingsIcon = () => <span>⚙️</span>

// Sidebar
function Sidebar() {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <HomeIcon /> },
    { path: '/members', label: 'Members', icon: <UsersIcon /> },
    { path: '/loans', label: 'Loans', icon: <LoansIcon /> },
    { path: '/groupbuy', label: 'Group Buy', icon: <GroupBuyIcon /> },
    { path: '/investments', label: 'Investments', icon: <InvestIcon /> },
    { path: '/governance', label: 'Governance', icon: <GovernanceIcon /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">🏦</div>
        <span className="logo-text">DigiCoop Admin</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

// Layout
function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

// Pages
function Dashboard() {
  const stats = [
    { label: 'Total Members', value: '1,234', change: '+12%' },
    { label: 'Total Savings', value: '₦45.2M', change: '+8%' },
    { label: 'Active Loans', value: '56', change: '-3%' },
    { label: 'Pending Approvals', value: '12', change: '+5' },
  ]

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
            <span className="stat-change">{stat.change}</span>
          </div>
        ))}
      </div>

      <div className="content-grid">
        <div className="card">
          <h3>Recent Activity</h3>
          <p>Activity feed coming soon...</p>
        </div>
        <div className="card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <button className="btn">Approve Loan</button>
            <button className="btn">Add Member</button>
            <button className="btn">Create Poll</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Members() {
  return (
    <div className="page">
      <h1>Members</h1>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>KYC Status</th>
              <th>Wallet</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Chioma Adebayo</td>
              <td>chioma@example.com</td>
              <td><span className="badge success">Verified</span></td>
              <td>₦145,500</td>
              <td><button className="btn-sm">View</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Loans() {
  return (
    <div className="page">
      <h1>Loan Applications</h1>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Amount</th>
              <th>Purpose</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>₦50,000</td>
              <td>Business Expansion</td>
              <td><span className="badge warning">Pending</span></td>
              <td>
                <button className="btn-sm success">Approve</button>
                <button className="btn-sm danger">Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function GroupBuy() {
  return (
    <div className="page">
      <h1>Group Buy Items</h1>
      <button className="btn primary">+ Add New Item</button>
      <div className="card">
        <p>Group buy management coming soon...</p>
      </div>
    </div>
  )
}

function Investments() {
  return (
    <div className="page">
      <h1>Investment Projects</h1>
      <button className="btn primary">+ Create Project</button>
      <div className="card">
        <p>Investment projects management coming soon...</p>
      </div>
    </div>
  )
}

function Governance() {
  return (
    <div className="page">
      <h1>Governance</h1>
      <div className="tabs">
        <button className="tab active">Polls</button>
        <button className="tab">Events</button>
        <button className="tab">Notices</button>
      </div>
      <div className="card">
        <p>Governance management coming soon...</p>
      </div>
    </div>
  )
}

function Settings() {
  return (
    <div className="page">
      <h1>Settings</h1>
      <div className="card">
        <p>Admin settings coming soon...</p>
      </div>
    </div>
  )
}

// Router
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'members', element: <Members /> },
      { path: 'loans', element: <Loans /> },
      { path: 'groupbuy', element: <GroupBuy /> },
      { path: 'investments', element: <Investments /> },
      { path: 'governance', element: <Governance /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
