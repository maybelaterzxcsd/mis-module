import React from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface UrgencyBadgeProps {
  level: 'red' | 'yellow' | 'green';
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ level }) => {
  const config = {
    red: {
      label: 'ВЫСОКАЯ СРОЧНОСТЬ',
      sublabel: '24-72 часа',
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.3)',
      icon: <AlertTriangle size={16} fill="rgba(239, 68, 68, 0.2)" />
    },
    yellow: {
      label: 'СРЕДНЯЯ СРОЧНОСТЬ',
      sublabel: '2 недели',
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.3)',
      icon: <Clock size={16} />
    },
    green: {
      label: 'ПЛАНОВЫЙ КОНТРОЛЬ',
      sublabel: '1 месяц',
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.3)',
      icon: <CheckCircle size={16} />
    }
  };

  const current = config[level];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '100px',
      background: current.bg,
      border: `1px solid ${current.border}`,
      color: current.color,
      fontWeight: 700,
      fontSize: '12px',
      letterSpacing: '0.5px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    }}>
      {current.icon}
      <span>{current.label}</span>
    </div>
  );
};