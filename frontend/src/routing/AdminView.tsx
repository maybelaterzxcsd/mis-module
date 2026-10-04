import React, { useState, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import { QRCodeSVG } from 'qrcode.react';
import { FileDown, QrCode, Send, Clock, Calendar, HelpCircle } from 'lucide-react';
import type { RoutingCase } from '../data/routingMocks';
import { UrgencyBadge } from './UrgencyBadge';
import { PatientRoutePDF } from './PatientRoutePDF';

interface AdminViewProps {
  caseData: RoutingCase;
}

export const AdminView: React.FC<AdminViewProps> = ({ caseData }) => {
  const [loading, setLoading] = useState(false);
  const [showTelegramLink, setShowTelegramLink] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7200); // 2 часа в секундах

  // Таймер обратного отсчета для бронирования
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      const blob = await pdf(<PatientRoutePDF caseData={caseData} patientName="Иванова Мария Петровна" />).toBlob();
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

  const handleGenerateTelegramLink = () => {
    const correctId = caseData.id || "4"; 
    const newId = `patient_${correctId}`;
    setPatientId(newId);
    setShowTelegramLink(true);
    setCopied(false);
  };

  const handleCopyLink = () => {
    const link = `https://t.me/navimed_bot?start=${patientId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrLink = `https://t.me/navimed_bot?start=${patientId}`;

  return (
    <div style={{ background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 32px rgba(233, 30, 99, 0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#1A1A1A', fontSize: '28px', margin: 0 }}>Результаты анализа</h2>
        <UrgencyBadge level={caseData.urgency} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ color: '#8A8A8A', fontSize: '14px', marginBottom: '4px' }}>Заключение ИИ</div>
        <div style={{ color: '#1A1A1A', fontSize: '16px', fontWeight: 500, padding: '16px', background: '#FCE4EC', borderRadius: '12px', borderLeft: '4px solid #E91E63' }}>
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

      {/* 🔥 НОВЫЙ БЛОК: Предварительно забронированный слот */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ color: '#8A8A8A', fontSize: '14px', marginBottom: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={16} />
          Предварительно забронированный слот
        </div>
        <div style={{ 
          padding: '16px', 
          background: 'linear-gradient(135deg, rgba(233, 30, 99, 0.08) 0%, rgba(156, 39, 176, 0.08) 100%)',
          borderRadius: '12px', 
          border: '2px solid rgba(233, 30, 99, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A' }}>
              {caseData.appointmentSlots[0] || '10:00 завтра'}
            </div>
            <div style={{ fontSize: '13px', color: '#8A8A8A', marginTop: '4px' }}>
              {caseData.specialist} • Бронь держится 2 часа
            </div>
          </div>
          <div style={{ 
            padding: '8px 14px', 
            background: '#EF4444', 
            color: 'white', 
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Clock size={14} />
            {formatTime(timeLeft)}
          </div>
        </div>
        
        {caseData.appointmentSlots.length > 1 && (
          <div style={{ marginTop: '12px' }}>
            <div style={{ color: '#8A8A8A', fontSize: '12px', marginBottom: '6px' }}>Другие доступные слоты:</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {caseData.appointmentSlots.slice(1).map((slot, i) => (
                <span key={i} style={{ 
                  padding: '6px 12px', 
                  borderRadius: '8px', 
                  background: 'rgba(233, 30, 99, 0.1)', 
                  color: '#E91E63', 
                  fontSize: '13px', 
                  fontWeight: 500 
                }}>
                  {slot}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ color: '#8A8A8A', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Красные флаги</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {caseData.redFlags.map((flag, i) => (
            <div key={i} style={{ padding: '10px 16px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#EF4444', fontWeight: 'bold' }}>!</span>
              <span style={{ color: '#1A1A1A', fontSize: '14px' }}>{flag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 НОВЫЙ БЛОК: Персональный план наблюдения */}
      {caseData.nextSteps && caseData.nextSteps.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ color: '#8A8A8A', fontSize: '14px', marginBottom: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} />
            Персональный план наблюдения (3 месяца)
          </div>
          <div style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            {caseData.nextSteps.map((step, i) => (
              <div key={i} style={{ 
                padding: '10px 12px', 
                background: 'rgba(255, 255, 255, 0.7)', 
                borderRadius: '8px', 
                marginBottom: i < caseData.nextSteps!.length - 1 ? '8px' : '0',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <div style={{ 
                  minWidth: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {i + 1}
                </div>
                <span style={{ color: '#1A1A1A', fontSize: '14px', lineHeight: '1.5' }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔥 НОВЫЙ БЛОК: Вопросы к врачу от ИИ */}
      {caseData.questionsForDoctor && caseData.questionsForDoctor.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ color: '#8A8A8A', fontSize: '14px', marginBottom: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HelpCircle size={16} />
            ИИ составил вопросы к врачу
          </div>
          <div style={{ padding: '16px', background: 'rgba(156, 39, 176, 0.05)', borderRadius: '12px', border: '1px solid rgba(156, 39, 176, 0.2)' }}>
            {caseData.questionsForDoctor.map((q, i) => (
              <div key={i} style={{ 
                padding: '10px 12px', 
                background: 'rgba(255, 255, 255, 0.7)', 
                borderRadius: '8px', 
                marginBottom: i < caseData.questionsForDoctor!.length - 1 ? '8px' : '0',
                fontStyle: 'italic'
              }}>
                <span style={{ color: '#9C27B0', fontWeight: 700, marginRight: '8px' }}>{i + 1}.</span>
                <span style={{ color: '#1A1A1A', fontSize: '14px' }}>«{q}»</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* БЛОК С QR-КОДОМ */}
      {showTelegramLink && (
        <div style={{ 
          marginTop: '24px', 
          padding: '32px', 
          background: 'linear-gradient(135deg, rgba(233, 30, 99, 0.05) 0%, rgba(156, 39, 176, 0.05) 100%)',
          borderRadius: '20px', 
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(233, 30, 99, 0.1)',
          border: '2px solid rgba(233, 30, 99, 0.1)',
          animation: 'fadeIn 0.4s ease-out'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '48px', 
              height: '48px',
              background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
              borderRadius: '12px',
              marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)'
            }}>
              <QrCode size={24} color="white" />
            </div>
            <h3 style={{ color: '#1A1A1A', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
              Маршрут для пациента
            </h3>
            <p style={{ color: '#8A8A8A', fontSize: '14px', marginBottom: '24px' }}>
              Отсканируйте код или отправьте ссылку пациенту
            </p>
          </div>

          <div style={{ 
            display: 'inline-block', 
            padding: '20px', 
            background: 'white', 
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '3px solid rgba(233, 30, 99, 0.1)'
          }}>
            <QRCodeSVG value={qrLink} size={200} level="H" />
          </div>

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button 
              onClick={handleCopyLink} 
              style={{ 
                padding: '12px 28px', 
                borderRadius: '12px', 
                border: 'none', 
                background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                color: 'white', 
                fontWeight: 600, 
                fontSize: '14px',
                cursor: 'pointer', 
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(233, 30, 99, 0.4)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(233, 30, 99, 0.3)'; }}
            >
              {copied ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Скопировано
                </>
              ) : (
                <>
                  <Send size={18} />
                  Скопировать ссылку
                </>
              )}
            </button>
          </div>

          <div style={{ marginTop: '16px', padding: '12px 20px', background: 'rgba(76, 175, 80, 0.08)', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#4CAF50' }}>
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ color: '#2E7D32', fontSize: '13px', fontWeight: 500 }}>Готово к отправке</span>
          </div>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}

      {/* КНОПКИ ДЕЙСТВИЙ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
        <button
          onClick={handleGenerateTelegramLink}
          style={{ width: '100%', padding: '14px 24px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)', color: '#FFFFFF', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(233, 30, 99, 0.4)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(233, 30, 99, 0.3)'; }}
        >
          <QrCode size={20} />
          Сгенерировать ссылку для пациента
        </button>

        <button
          onClick={handleDownloadPDF}
          disabled={loading}
          style={{ width: '100%', padding: '14px 24px', borderRadius: '16px', border: '1px solid #E91E63', background: loading ? 'rgba(233, 30, 99, 0.05)' : 'rgba(233, 30, 99, 0.1)', color: '#E91E63', fontSize: '15px', fontWeight: 600, cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = '#E91E63'; e.currentTarget.style.color = '#FFFFFF'; } }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(233, 30, 99, 0.1)'; e.currentTarget.style.color = '#E91E63'; }}
        >
          {loading ? 'Генерация PDF...' : (
            <>
              <FileDown size={20} />
              Скачать PDF-маршрут
            </>
          )}
        </button>
      </div>
    </div>
  );
};