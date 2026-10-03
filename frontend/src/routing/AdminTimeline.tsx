import React from 'react';

const steps = [
  { label: 'Маршрут сформирован', done: true },
  { label: 'Ссылка отправлена', done: true },
  { label: 'Пациент ознакомился', done: false }, 
  { label: 'Запись подтверждена', done: false }
];

export const AdminTimeline: React.FC = () => {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '24px',
        padding: '24px 32px',
        boxShadow: '0 8px 32px rgba(233, 30, 99, 0.08)',
        marginTop: '24px'
      }}
    >
      <h3 style={{ color: '#1A1A1A', fontSize: '18px', margin: '0 0 20px 0' }}>
        Статус пациента
      </h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '0',
          right: '0',
          height: '2px',
          background: '#E0E0E0',
          zIndex: 0
        }} />
        
        {steps.map((step, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: step.done ? '#E91E63' : '#fff',
              border: `2px solid ${step.done ? '#E91E63' : '#E0E0E0'}`,
              marginBottom: '8px',
              transition: 'all 0.3s'
            }} />
            <span style={{
              fontSize: '12px',
              color: step.done ? '#1A1A1A' : '#8A8A8A',
              fontWeight: step.done ? 600 : 400,
              textAlign: 'center'
            }}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};