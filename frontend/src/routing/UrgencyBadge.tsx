import React from 'react';

interface UrgencyBadgeProps {
  level: 'red' | 'yellow' | 'green';
}

const config = {
  red: {
    label: '🔴 Высокая срочность',
    bg: 'rgba(233, 30, 99, 0.15)',
    border: '#E91E63',
    text: '#C2185B'
  },
  yellow: {
    label: '🟡 Средняя срочность',
    bg: 'rgba(255, 193, 7, 0.15)',
    border: '#FFC107',
    text: '#F57F17'
  },
  green: {
    label: ' Плановый',
    bg: 'rgba(76, 175, 80, 0.15)',
    border: '#4CAF50',
    text: '#2E7D32'
  }
};

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ level }) => {
  const style = config[level];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '8px 16px',
        borderRadius: '100px',
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.text,
        fontWeight: 600,
        fontSize: '14px',
        backdropFilter: 'blur(10px)'
      }}
    >
      {style.label}
    </span>
  );
};