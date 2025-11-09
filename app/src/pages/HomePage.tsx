import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  username: string;
  email: string;
}

const HomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем авторизацию пользователя
    const checkAuth = async () => {
      try {
        // Здесь можно сделать запрос к API для проверки auth
        // const response = await fetch('/api/user/profile/');
        // if (response.ok) {
        //   const userData = await response.json();
        //   setUser(userData);
        // } else {
        //   navigate('/login');
        // }

        // Временная заглушка
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (!isAuthenticated) {
          navigate('/login');
        } else {
          setUser({
            username: 'Demo User',
            email: 'user@example.com',
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='home-container'>
      <header className='home-header'>
        <h1>Welcome to Chillin`</h1>
        <button onClick={handleLogout} className='logout-button'>
          Logout
        </button>
      </header>
      <main className='home-main'>
        <p>Hello, {user.username}!</p>
        <p>Email: {user.email}</p>
        {/* Добавьте контент главной страницы здесь */}
      </main>
    </div>
  );
};

export default HomePage;
