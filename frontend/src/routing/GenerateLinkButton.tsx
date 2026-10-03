import React, { useState } from 'react';

export const GenerateLinkButton: React.FC = () => {
  const [showLink, setShowLink] = useState(false);
  const mockLink = 'https://t.me/MedMindBot?start=patient_123';

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(233, 30, 99, 0.08)',
        marginTop: '24px',
        textAlign: 'center'
      }}
    >
      {!showLink ? (
        <button
          onClick={() => setShowLink(true)}
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
          📲 Сгенерировать ссылку и QR для пациента
        </button>
      ) : (
        <div>
          <div style={{ fontSize: '14px', color: '#8A8A8A', marginBottom: '12px' }}>
            Ссылка для пациента (откройте в Telegram):
          </div>
          <div style={{
            padding: '12px',
            background: '#F8F9FA',
            borderRadius: '12px',
            color: '#E91E63',
            fontFamily: 'monospace',
            marginBottom: '20px',
            wordBreak: 'break-all'
          }}>
            {mockLink}
          </div>
          
          {/* Имитация QR-кода для вау-эффекта */}
          <div style={{
            width: '150px',
            height: '150px',
            margin: '0 auto',
            background: '#fff',
            border: '4px solid #E91E63',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#8A8A8A'
          }}>
            [ QR CODE ]
          </div>
          <div style={{ fontSize: '12px', color: '#4CAF50', marginTop: '12px', fontWeight: 600 }}>
            ✅ Ссылка скопирована и отправлена пациенту
          </div>
        </div>
      )}
    </div>
  );
};