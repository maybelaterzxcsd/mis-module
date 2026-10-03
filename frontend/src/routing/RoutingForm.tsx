import React, { useState } from 'react';

interface RoutingFormProps {
  onSubmit: (type: 'mammography' | 'ct_lungs' | 'xray') => void;
}

const options = [
  { value: 'mammography', label: 'Маммография' },
  { value: 'ct_lungs', label: 'КТ легких' },
  { value: 'xray', label: 'Рентген' }
];

export const RoutingForm: React.FC<RoutingFormProps> = ({ onSubmit }) => {
  const [selected, setSelected] = useState<'mammography' | 'ct_lungs' | 'xray'>('mammography');

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(233, 30, 99, 0.08)'
      }}
    >
      <h2 style={{ color: '#1A1A1A', marginBottom: '24px', fontSize: '28px' }}>
        Формирование маршрута пациента
      </h2>

      <label style={{ display: 'block', marginBottom: '8px', color: '#4A4A4A', fontWeight: 500 }}>
        Тип заключения ИИ:
      </label>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value as any)}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '12px',
          border: '1px solid #E0E0E0',
          background: '#fff',
          fontSize: '16px',
          marginBottom: '24px'
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <button
        onClick={() => onSubmit(selected)}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '16px',
          border: 'none',
          background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
          color: '#fff',
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(233, 30, 99, 0.3)'
        }}
      >
        Сформировать маршрут
      </button>
    </div>
  );
};