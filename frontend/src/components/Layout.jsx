import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Layout({ children }) {
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'Admin';
    const [darkMode, setDarkMode] = React.useState(
    localStorage.getItem('darkMode') === 'true'
);

React.useEffect(() => {
    if (darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    localStorage.setItem('darkMode', darkMode);
}, [darkMode]);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        navigate('/');
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div>
                    <h2 className="logo">🎓 Placement Tracker</h2>

                    <nav className="nav-links">
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) => isActive ? 'active' : ''}
                        >
                            📊 Dashboard
                        </NavLink>

                        <NavLink
                            to="/students"
                            className={({ isActive }) => isActive ? 'active' : ''}
                        >
                            👨‍🎓 Students
                        </NavLink>

                        <NavLink
                            to="/sections"
                            className={({ isActive }) => isActive ? 'active' : ''}
                        >
                            🏫 Sections
                        </NavLink>
                    </nav>
                </div>

                <div className="sidebar-footer">
                    <p>Welcome, {username} 👋</p>
                    <button className="logout-btn" onClick={handleLogout}>
                        🚪 Logout
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <div className="topbar">
                    <div>
                        <h1>Placement Eligibility Tracker</h1>
                        <p>Manage and monitor student placement readiness</p>
                    </div>

                    <div
    style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
    }}
>
    <button
        className="theme-btn"
        onClick={() =>
            setDarkMode(!darkMode)
        }
    >
        {darkMode
            ? '☀️ Light'
            : '🌙 Dark'}
    </button>

    <div className="date-box">
        {new Date().toLocaleDateString()}
    </div>
</div>
                </div>

                {children}
            </main>
        </div>
    );
}

export default Layout;