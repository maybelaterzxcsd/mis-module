import React, { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Route, 
  FileText, 
  FileHeart, 
  CalendarDays,
  Activity
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  path: string;
  label: string;
  icon: ReactNode;
  group: 'main' | 'secondary';
}

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Главная', icon: <LayoutDashboard size={20} />, group: 'main' },
  { path: '/patients', label: 'Пациенты', icon: <Users size={20} />, group: 'main' },
  { path: '/routing', label: 'Маршрутизация', icon: <Route size={20} />, group: 'main' },
  { path: '/protocols', label: 'Протоколы', icon: <FileText size={20} />, group: 'secondary' },
  { path: '/sick-leave', label: 'Больничные', icon: <FileHeart size={20} />, group: 'secondary' },
  { path: '/schedule', label: 'Расписание', icon: <CalendarDays size={20} />, group: 'secondary' },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const mainItems = NAV_ITEMS.filter(item => item.group === 'main');
  const secondaryItems = NAV_ITEMS.filter(item => item.group === 'secondary');

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FDF2F8' }}>
      
      <aside style={{
        width: '260px',
        background: '#FFFFFF',
        borderRight: '1px solid rgba(233, 30, 99, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        position: 'fixed',
        height: '100vh',
        boxShadow: '4px 0 24px rgba(233, 30, 99, 0.04)'
      }}>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          marginBottom: '32px',
          padding: '0 12px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)'
          }}>
            <Activity size={20} color="white" />
          </div>
          <div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 800, 
              color: '#E91E63',
              letterSpacing: '-0.5px'
            }}>
              MedMind
            </div>
            <div style={{ 
              fontSize: '10px', 
              color: '#8A8A8A',
              fontWeight: 500,
              marginTop: '-2px'
            }}>
              AI Routing Module
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {mainItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: active ? 'linear-gradient(135deg, rgba(233, 30, 99, 0.12) 0%, rgba(156, 39, 176, 0.08) 100%)' : 'transparent',
                  color: active ? '#E91E63' : '#4A4A4A',
                  fontWeight: active ? 700 : 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  width: '100%',
                  boxShadow: active ? '0 2px 8px rgba(233, 30, 99, 0.15)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(233, 30, 99, 0.05)';
                    e.currentTarget.style.color = '#E91E63';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#4A4A4A';
                  }
                }}
              >
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px'
                }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={{ 
          height: '1px', 
          background: 'rgba(233, 30, 99, 0.08)', 
          margin: '20px 12px' 
        }} />

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {secondaryItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: active ? 'rgba(233, 30, 99, 0.08)' : 'transparent',
                  color: active ? '#E91E63' : '#6B6B6B',
                  fontWeight: active ? 600 : 400,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(233, 30, 99, 0.05)';
                    e.currentTarget.style.color = '#E91E63';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#6B6B6B';
                  }
                }}
              >
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  opacity: 0.7
                }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto', padding: '16px 12px' }}>
          <div style={{
            padding: '12px',
            background: 'linear-gradient(135deg, rgba(233, 30, 99, 0.05) 0%, rgba(156, 39, 176, 0.05) 100%)',
            borderRadius: '12px',
            border: '1px solid rgba(233, 30, 99, 0.1)'
          }}>
            <div style={{ fontSize: '11px', color: '#8A8A8A', marginBottom: '4px', fontWeight: 500 }}>
              Статус системы
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: '#10B981',
                boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)'
              }} />
              <span style={{ fontSize: '12px', color: '#1A1A1A', fontWeight: 600 }}>
                AI-модель активна
              </span>
            </div>
          </div>
        </div>

      </aside>

      <main style={{ 
        flex: 1, 
        marginLeft: '260px',
        minHeight: '100vh'
      }}>
        {children}
      </main>

    </div>
  );
};