import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar,
  FileText, 
  FileHeart,
  Route
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Главная', icon: Home, path: '/dashboard' },
    { id: 'patients', label: 'Пациенты', icon: Users, path: '/patients' },
    { id: 'routing', label: 'Маршрутизация', icon: Route, path: '/routing' },
    { id: 'protocols', label: 'Протоколы', icon: FileText, path: '/protocols' },
    { id: 'sick-leaves', label: 'Больничные', icon: FileHeart, path: '/sick-leaves' },    
    { id: 'schedule', label: 'Расписание', icon: Calendar, path: '/schedule' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="page-background" style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className="sidebar">
        <div className="profile-header">
          <h1 className="logo-title" style={{ color: '#E91E63', fontWeight: 800 }}>
            MedMind
          </h1>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <Icon size={24} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};