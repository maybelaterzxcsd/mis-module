import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!login.trim() || !password.trim()) {
      toast.error('Ошибка входа', 'Пожалуйста, заполните все поля');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (login === 'doctor' && password === '12345') {
        authLogin('fake-jwt-token-123');
        toast.success('Добро пожаловать!', `Вы успешно вошли в систему как ${login}`);
        navigate('/dashboard');
      } else {
        toast.error('Неверные данные', 'Логин или пароль указаны неправильно. Попробуйте doctor / 12345');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="login-page-bg" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'var(--bg-gradient)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Декоративные круги на фоне */}
        <div className="login-circle" style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
          borderRadius: '50%',
          opacity: 'var(--login-circle-opacity, 0.1)',
          filter: 'blur(60px)'
        }} />
        <div className="login-circle" style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '400px',
          height: '400px',
          background: 'linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%)',
          borderRadius: '50%',
          opacity: 'var(--login-circle-opacity, 0.1)',
          filter: 'blur(60px)'
        }} />

        <form
          onSubmit={handleSubmit}
          className="login-card"
          style={{
            background: 'var(--login-card-bg, rgba(255, 255, 255, 0.95))',
            backdropFilter: 'blur(20px)',
            padding: '3rem',
            borderRadius: '24px',
            boxShadow: 'var(--login-card-shadow, 0 20px 60px rgba(139, 92, 246, 0.15))',
            width: '100%',
            maxWidth: '420px',
            border: '1px solid var(--login-card-border, rgba(139, 92, 246, 0.1))',
            position: 'relative',
            zIndex: 1,
            animation: 'fadeIn 0.5s ease-out'
          }}
        >
          {/* Логотип */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)'
            }}>
              <Lock size={40} color="white" strokeWidth={2} />
            </div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              letterSpacing: '-1px',
              color: 'var(--text-primary)',
              margin: '0 0 0.5rem 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              Третье мнение
            </h1>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              fontWeight: '500',
              letterSpacing: '0.5px'
            }}>
              Интеллектуальная система протоколов
            </p>
          </div>

          {/* Поле логина */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}>
              Логин
            </label>
            <div style={{ position: 'relative' }}>
              <User 
                size={20} 
                color={focusedField === 'login' ? '#8b5cf6' : 'var(--text-muted)'} 
                style={{ 
                  position: 'absolute', 
                  left: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  transition: 'color 0.3s'
                }} 
              />
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                onFocus={() => setFocusedField('login')}
                onBlur={() => setFocusedField(null)}
                placeholder="Введите логин"
                className="search-input login-input"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 3rem',
                  border: `2px solid ${focusedField === 'login' ? '#8b5cf6' : 'var(--login-input-border, rgba(139, 92, 246, 0.2))'}`,
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s',
                  background: 'var(--login-input-bg, rgba(255, 255, 255, 0.9))',
                  color: 'var(--text-primary)'
                }}
                required
              />
            </div>
          </div>

          {/* Поле пароля */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}>
              Пароль
            </label>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={20} 
                color={focusedField === 'password' ? '#8b5cf6' : 'var(--text-muted)'} 
                style={{ 
                  position: 'absolute', 
                  left: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  transition: 'color 0.3s'
                }} 
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                className="search-input login-input"
                style={{
                  width: '100%',
                  padding: '0.875rem 3rem 0.875rem 3rem',
                  border: `2px solid ${focusedField === 'password' ? '#8b5cf6' : 'var(--login-input-border, rgba(139, 92, 246, 0.2))'}`,
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s',
                  background: 'var(--login-input-bg, rgba(255, 255, 255, 0.9))',
                  color: 'var(--text-primary)'
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? (
                  <EyeOff size={20} color="var(--text-muted)" />
                ) : (
                  <Eye size={20} color="var(--text-muted)" />
                )}
              </button>
            </div>
          </div>

          {/* Кнопка входа */}
          <button
            type="submit"
            disabled={!login || !password || isLoading}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '1rem',
              background: 'var(--primary-gradient)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: (!login || !password || isLoading) ? 'not-allowed' : 'pointer',
              opacity: !login || !password || isLoading ? 0.5 : 1,
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              if (login && password && !isLoading) {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.6)';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.4)';
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                Вход...
              </>
            ) : (
              'Войти'
            )}
          </button>

          {/* Демо-подсказка */}
          <div 
            className="login-demo-box"
            style={{
              marginTop: '2rem',
              padding: '1rem',
              background: 'var(--login-demo-bg, rgba(139, 92, 246, 0.05))',
              border: '1px solid var(--login-demo-border, rgba(139, 92, 246, 0.15))',
              borderRadius: '12px',
              textAlign: 'center'
            }}
          >
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              margin: '0 0 0.25rem 0'
            }}>
              Демо-доступ:
            </p>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: '600',
              margin: 0
            }}>
              Логин: <span style={{ color: '#8b5cf6' }}>doctor</span> • Пароль: <span style={{ color: '#8b5cf6' }}>12345</span>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginForm;