import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import ParticleBackground from './ParticleBackground';
import ThemeToggle from '../ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const TABS = [
  { to: '/', label: 'Calculator' },
  { to: '/salary-structure', label: 'Salary Structure' },
  { to: '/compare', label: 'Old vs New' },
  { to: '/history', label: 'History' },
  { to: '/about', label: 'About' },
];

export default function Layout() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout-root">
      <ParticleBackground />
      <header className="layout-header">
        <div className="brand">
          <span className="brand-mark">₹</span>
          <span>TaxLedger</span>
        </div>

        <nav className="tabs">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) => `tab${isActive ? ' active' : ''}`}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <div className="auth-area">
          <ThemeToggle />
          {!loading && user && (
            <>
              <span className="auth-user">Hi, {user.name}</span>
              <button className="btn-secondary" onClick={handleLogout}>Log Out</button>
            </>
          )}
          {!loading && !user && (
            <div className="auth-group">
              <NavLink to="/login" className="auth-login-link">Log In</NavLink>
              <NavLink to="/signup" className="auth-signup-btn">Sign Up</NavLink>
            </div>
          )}
        </div>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}