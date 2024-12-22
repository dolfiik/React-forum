import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const Header: React.FC = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error: ", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <header className="forum-header">
      <div className='header-content'>
      <div className="title">
        <h1> Moje Forum </h1> 
      </div>
      <nav className="main-nav">
        <Link to="/">Home</Link>
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </>
        ) : (
          <>
            <Link to="/profile">Profil</Link>
            <Link to="/settings">Ustawienia</Link>
            <Link to="/contact">Kontakt</Link>
          </>
        )}
      </nav>
      <div className="user-section">
        {user ? (
          <>
            <div className="user-info">
              <span>Witaj, {user.username}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Wyloguj 
              </button>
            </div>
          </>
        ) : (
          <div className="welcome-message">Witaj na forum</div>
        )}
      </div>
      </div>
    </header>
  );
};

export default Header;
