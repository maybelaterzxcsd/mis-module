import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import type { RoutingCase } from '../data/routingMocks';
import { UrgencyBadge } from './UrgencyBadge';
import { PatientRoutePDF } from './PatientRoutePDF';

interface AdminViewProps {
  caseData: RoutingCase;
}

export const AdminView: React.FC<AdminViewProps> = ({ caseData }) => {
  const [loading, setLoading] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      
      // Генерируем PDF как blob
      const blob = await pdf(
        <PatientRoutePDF caseData={caseData} patientName="Иванова Мария Петровна" />
      ).toBlob();

      // Создаём ссылку для скачивания
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `маршрут_${caseData.id}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setLoading(false);
    } catch (error) {
      console.error('Ошибка генерации PDF:', error);
      setLoading(false);
      alert('Не удалось сгенерировать PDF. Проверьте консоль.');
    }
  };

  return (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.65)', 
      backdropFilter: 'blur(20px)', 
      border: '1px solid rgba(255, 255, 255, 0.3)', 
      borderRadius: '24px', 
      padding: '32px', 
      boxShadow: '0 8px 32px rgba(233, 30, 99, 0.08)' 
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#1A1A1A', fontSize: '28px', margin: 0 }}>Результаты анализа</h2>
        <UrgencyBadge level={caseData.urgency} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ color: '#8A8A8A', fontSize: '14px', marginBottom: '4px' }}>Заключение ИИ</div>
        <div style={{ 
          color: '#1A1A1A', 
          fontSize: '16px', 
          fontWeight: 500, 
          padding: '16px', 
          background: '#FCE4EC', 
          borderRadius: '12px', 
          borderLeft: '4px solid #E91E63' 
        }}>
          {caseData.aiConclusion}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ padding: '16px', background: '#F8F9FA', borderRadius: '12px' }}>
          <div style={{ color: '#8A8A8A', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase' }}>Специалист</div>
          <div style={{ color: '#1A1A1A', fontSize: '16px', fontWeight: 600 }}>{caseData.specialist}</div>
        </div>
        <div style={{ padding: '16px', background: '#F8F9FA', borderRadius: '12px' }}>
          <div style={{ color: '#8A8A8A', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase' }}>Срок</div>
          <div style={{ color: '#1A1A1A', fontSize: '16px', fontWeight: 600 }}>{caseData.timeframe}</div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ color: '#8A8A8A', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Красные флаги</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {caseData.redFlags.map((flag, i) => (
            <div key={i} style={{ 
              padding: '10px 16px', 
              background: 'rgba(239, 68, 68, 0.08)', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}>
              <span style={{ color: '#EF4444', fontWeight: 'bold' }}>!</span>
              <span style={{ color: '#1A1A1A', fontSize: '14px' }}>{flag}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ color: '#8A8A8A', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Свободные слоты</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {caseData.appointmentSlots.map((slot, i) => (
            <span key={i} style={{ 
              padding: '8px 16px', 
              borderRadius: '12px', 
              background: 'rgba(233, 30, 99, 0.1)', 
              color: '#E91E63', 
              fontSize: '14px', 
              fontWeight: 500 
            }}>
              {slot}
            </span>
          ))}
        </div>
      </div>

      {/* КНОПКА СКАЧИВАНИЯ PDF */}
      <button
        onClick={handleDownloadPDF}
        disabled={loading}
        style={{
          width: '100%', 
          padding: '14px 24px', 
          borderRadius: '16px', 
          border: '1px solid #E91E63',
          background: loading ? 'rgba(233, 30, 99, 0.05)' : 'rgba(233, 30, 99, 0.1)',
          color: '#E91E63', 
          fontSize: '15px', 
          fontWeight: 600, 
          cursor: loading ? 'wait' : 'pointer',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '8px', 
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => { 
          if (!loading) { 
            e.currentTarget.style.background = '#E91E63'; 
            e.currentTarget.style.color = '#FFFFFF'; 
          } 
        }}
        onMouseLeave={(e) => { 
          e.currentTarget.style.background = 'rgba(233, 30, 99, 0.1)'; 
          e.currentTarget.style.color = '#E91E63'; 
        }}
      >
        {loading ? '⏳ Генерация PDF...' : '📄 Скачать PDF-маршрут'}
      </button>
    </div>
  );
};