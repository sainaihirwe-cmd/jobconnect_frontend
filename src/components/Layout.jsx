import { Menu, X, BriefcaseBusiness, Bell, MessageSquare, CheckCheck } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Layout({ language, setLanguage, t }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return undefined;
    }

    let active = true;
    const loadNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        if (active) setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error('Unable to load notifications', error);
      }
    };

    loadNotifications();
    const interval = window.setInterval(loadNotifications, 30000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [user]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
    } catch (error) {
      console.error('Unable to mark notifications read', error);
    }
  };

  const markRead = async (notification) => {
    if (notification.read) return;
    try {
      await api.put(`/notifications/${notification._id}/read`);
      setNotifications((current) => current.map((item) => item._id === notification._id ? { ...item, read: true } : item));
    } catch (error) {
      console.error('Unable to mark notification read', error);
    }
  };

  const navItems = [
    { to: '/', label: t.navHome },
    { to: '/jobs', label: t.navJobs },
    { to: '/about', label: t.navAbout },
    { to: '/how-it-works', label: t.navHow },
    { to: '/contact', label: t.navContact },
  ];

  return (
    <>
      <header className="site-header">
        <div className="container nav-wrap">
          <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
            <BriefcaseBusiness size={26} />
            <span>JobConnect Rwanda</span>
          </Link>

          <nav id="primary-navigation" className={`nav ${menuOpen ? 'open' : ''}`}>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={() => setMenuOpen(false)}>
                {item.label}
              </NavLink>
            ))}

            {!user ? (
              <>
                <NavLink to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>{t.navLogin}</NavLink>
                <Link to="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>{t.navRegister}</Link>
              </>
            ) : (
              <>
                <button className="btn btn-secondary" onClick={() => { logout(); setMenuOpen(false); }}>{t.navLogout}</button>
              </>
            )}

            <div className="lang-switcher">
              <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
              <button className={language === 'rw' ? 'active' : ''} onClick={() => setLanguage('rw')}>RW</button>
            </div>
          </nav>

          <div className="header-tools top-header-tools">
            {user ? (
              <div className="notification-wrap">
                <button className="icon-button" onClick={() => setNotificationsOpen((open) => !open)} aria-label="Open notifications">
                  <Bell size={19} />
                  {unreadCount > 0 && <span className="notification-count">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                </button>
                {notificationsOpen && (
                  <div className="notification-popover">
                    <div className="notification-head"><strong>Notifications</strong><button onClick={markAllRead}><CheckCheck size={15} /> Mark read</button></div>
                    <div className="notification-list">
                      {notifications.length ? notifications.slice(0, 6).map((notification) => (
                        <button key={notification._id} className={`notification-item ${notification.read ? '' : 'unread'}`} onClick={() => markRead(notification)}>
                          <span className="notification-dot" />
                          <span><strong>{notification.title}</strong><small>{notification.message}</small></span>
                        </button>
                      )) : <p className="notification-empty">You are all caught up.</p>}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="icon-button" aria-label="Log in to view notifications"><Bell size={19} /></Link>
            )}
            <Link to="/contact" className="icon-button" aria-label="Send a message or idea"><MessageSquare size={19} /></Link>
          </div>

          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="primary-navigation" aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <h4>JobConnect Rwanda</h4>
            <p>{t.footerText}</p>
          </div>
          <div>
            <h5>{t.quickLinks}</h5>
            <ul>
              <li><Link to="/jobs">{t.navJobs}</Link></li>
              <li><Link to="/about">{t.navAbout}</Link></li>
              <li><Link to="/contact">{t.navContact}</Link></li>
            </ul>
          </div>
          <div>
            <h5>{t.forEmployers}</h5>
            <ul>
              <li>{t.postJobs}</li>
              <li>{t.reviewApplications}</li>
              <li>{t.hireTalent}</li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
