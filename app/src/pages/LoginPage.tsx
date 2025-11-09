import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const usernameRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Фокус на поле username при загрузке
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Очищаем ошибку при изменении поля
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin();
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('csrfmiddlewaretoken', getCSRFToken());

      const response = await fetch('/api/login/', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (response.redirected) {
        window.location.href = response.url;
        return;
      }

      const data: LoginResponse = await response.json();

      if (data.success) {
        window.location.reload();
      } else if (data.error) {
        setError(data.error);
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const getCSRFToken = (): string => {
    // Получаем CSRF токен из cookies или meta тега
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('csrftoken='))
      ?.split('=')[1];

    return cookieValue || '';
  };

  const handleGoogleLogin = () => {
    window.location.href = '/accounts/google/login/';
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  // Если пользователь уже авторизован, перенаправляем на главную
  if (window.__USER_DATA__?.is_authenticated) {
    window.location.href = '/';
    return (
      <div id='app-loading'>
        <p>Loading Chillin`...</p>
      </div>
    );
  }

  return (
    <div className='login-container'>
      <form className='login-form' onSubmit={handleSubmit} id='offset'>
        <h4 className='form-title'>Log in</h4>

        <fieldset className='form-fieldset'>
          <legend className='form-label'>Username</legend>
          <div className='form-input'>
            <input
              ref={usernameRef}
              type='text'
              name='username'
              id='username'
              value={formData.username}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              required
              spellCheck={false}
              disabled={isLoading}
            />
          </div>
          <div className='fieldset-focus'></div>
        </fieldset>

        <fieldset className='form-fieldset'>
          <legend className='form-label'>Password</legend>
          <div className='form-input'>
            <input
              type='password'
              name='password'
              id='password'
              value={formData.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              required
              disabled={isLoading}
            />
          </div>
          <div className='fieldset-focus'></div>
        </fieldset>

        {/* Сообщение об ошибке */}
        {error && (
          <div className='error-message' id='ajax-error'>
            {error}
          </div>
        )}

        <button
          className={`next-button controls ${isLoading ? 'loading' : ''}`}
          type='submit'
          disabled={isLoading}
          id='login-btn'
        >
          {isLoading ? 'Logging in...' : 'Next'}
        </button>

        <div className='or-divider'>
          <span className='or-text'>OR</span>
        </div>

        <button
          type='button'
          className='next-button controls google-button'
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className='signup-link'>
          Need an account?
          <button
            type='button'
            className='controls signup-button'
            onClick={handleSignUp}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

// Компонент иконки Google
const GoogleIcon: React.FC = () => (
  <svg
    className='google-icon'
    viewBox='-0.5 0 48 48'
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
      <g id='Google' transform='translate(-401.000000, -860.000000)'>
        <g transform='translate(401.000000, 860.000000)'>
          <path
            d='M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24'
            fill='#FBBC05'
          ></path>
          <path
            d='M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333'
            fill='#EB4335'
          ></path>
          <path
            d='M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667'
            fill='#34A853'
          ></path>
          <path
            d='M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24'
            fill='#4285F4'
          ></path>
        </g>
      </g>
    </g>
  </svg>
);

export default LoginPage;
