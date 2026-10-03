import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Search, User, Phone, Brain } from 'lucide-react';
import { AdminView } from '../routing/AdminView';
import { AdminTimeline } from '../routing/AdminTimeline';
import { GenerateLinkButton } from '../routing/GenerateLinkButton';
import type { RoutingCase } from '../data/routingMocks';

// Моковые пациенты
const MOCK_PATIENTS = [
  { 
    id: '1', 
    name: 'Иванова Мария Петровна', 
    age: 68, 
    phone: '+7 (903) 123-45-67', 
    lastVisit: '12.09.2026', 
    diagnosis: 'ИБС, стенокардия напряжения' 
  },
  { 
    id: '2', 
    name: 'Петров Иван Сергеевич', 
    age: 45, 
    phone: '+7 (916) 987-65-43', 
    lastVisit: '10.09.2026', 
    diagnosis: 'Гипертоническая болезнь II ст.' 
  },
  { 
    id: '3', 
    name: 'Сидорова Анна Владимировна', 
    age: 32, 
    phone: '+7 (925) 111-22-33', 
    lastVisit: '05.09.2026', 
    diagnosis: 'Профилактический осмотр' 
  },
  { 
    id: '4', 
    name: 'Козлов Дмитрий Андреевич', 
    age: 54, 
    phone: '+7 (905) 444-55-66', 
    lastVisit: '01.09.2026', 
    diagnosis: 'Сахарный диабет 2 типа' 
  },
];

// Тексты заключений для каждого пациента (в реальности приходят из МИС)
const MOCK_CONCLUSIONS: Record<string, string> = {
  '1': 'BI-RADS 4, образование 15 мм в правой молочной железе с неровными контурами',
  '2': 'КТ: солидный узел 8 мм в S6 правого легкого с ровными контурами',
  '3': 'Рентген: инфильтративные изменения в нижней доле правого легкого. Пневмония.',
  '4': 'Профилактический осмотр, жалоб нет, хронические заболевания в стадии компенсации'
};

export const RoutingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<RoutingCase | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Фильтрация пациентов по поиску
  const filteredPatients = MOCK_PATIENTS.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectPatient = async (patientId: string) => {
    setSelectedPatient(patientId);
    setLoading(true);
    setError(null);

    const conclusionText = MOCK_CONCLUSIONS[patientId] || MOCK_CONCLUSIONS['1'];
    const patient = MOCK_PATIENTS.find(p => p.id === patientId);

    try {
      // РЕАЛЬНЫЙ ЗАПРОС К AI-БЭКЕНДУ
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: conclusionText,
          patient_id: patientId,
          patient_name: patient?.name || 'Пациент'
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка сервера');
      }

      const data = await response.json();
      
      // Преобразуем ответ бэка в формат RoutingCase
      setSelectedCase({
        id: data.patient_id,
        type: data.type as 'mammography' | 'ct_lungs' | 'xray',
        aiConclusion: conclusionText,
        urgency: data.urgency as 'red' | 'yellow' | 'green',
        specialist: data.specialist,
        timeframe: data.timeframe,
        patientExplanation: `На основании AI-анализа заключения, рекомендуется консультация специалиста (${data.specialist}) в срок ${data.timeframe}.`,
        redFlags: data.red_flags,
        appointmentSlots: ['10:00 завтра', '14:00 послезавтра', '09:00 через 3 дня']
      });

    } catch (err) {
      console.error('Ошибка AI-анализа:', err);
      setError('Не удалось связаться с AI-сервером. Убедитесь, что бэкенд запущен на порту 8000.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedPatient(null);
    setSelectedCase(null);
    setSearchQuery('');
    setError(null);
  };

  const selectedPatientData = MOCK_PATIENTS.find(p => p.id === selectedPatient);

  return (
    <Layout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Заголовок */}
        <h1 style={{ color: '#1A1A1A', fontSize: '36px', marginBottom: '8px' }}>
          AI-Маршрутизация пациентов
        </h1>
        <p style={{ color: '#8A8A8A', fontSize: '16px', marginBottom: '40px' }}>
          Выберите пациента для формирования индивидуального маршрута лечения
        </p>

        {/* ШАГ 1: Список пациентов */}
        {!selectedPatient && (
          <div>
            {/* Поиск */}
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A8A8A' }} />
              <input
                type="text"
                placeholder="Поиск пациента по имени или диагнозу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  borderRadius: '12px',
                  border: '1px solid rgba(233, 30, 99, 0.2)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: '#1A1A1A',
                  fontSize: '15px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Список пациентов */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.65)', 
              backdropFilter: 'blur(20px)', 
              border: '1px solid rgba(255, 255, 255, 0.3)', 
              borderRadius: '24px', 
              padding: '24px',
              boxShadow: '0 8px 32px rgba(233, 30, 99, 0.08)'
            }}>
              <h3 style={{ color: '#1A1A1A', fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
                Выберите пациента ({filteredPatients.length})
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => handleSelectPatient(patient.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid rgba(233, 30, 99, 0.1)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(233, 30, 99, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(233, 30, 99, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                        e.currentTarget.style.borderColor = 'rgba(233, 30, 99, 0.1)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ 
                          width: '48px', 
                          height: '48px', 
                          borderRadius: '50%', 
                          background: 'rgba(233, 30, 99, 0.1)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: '#E91E63' 
                        }}>
                          <User size={24} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#1A1A1A', fontSize: '16px' }}>{patient.name}</div>
                          <div style={{ fontSize: '14px', color: '#8A8A8A', marginTop: '4px' }}>
                            {patient.age} лет • {patient.diagnosis}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ fontSize: '14px', color: '#8A8A8A' }}>
                          <Phone size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                          {patient.phone}
                        </div>
                        <Brain size={20} color="#E91E63" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#8A8A8A' }}>
                    Пациенты не найдены
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ЗАГРУЗКА */}
        {loading && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '400px',
            gap: '20px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid rgba(233, 30, 99, 0.2)',
              borderTop: '4px solid #E91E63',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#4A4A4A', fontSize: '16px', fontWeight: 500 }}>
              AI анализирует заключение пациента {selectedPatientData?.name}...
            </p>
            <p style={{ color: '#8A8A8A', fontSize: '14px' }}>
              Используется модель MedMind-RuBERT-v2
            </p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* ОШИБКА */}
        {error && !loading && (
          <div style={{ 
            padding: '20px', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)', 
            borderRadius: '12px',
            color: '#EF4444',
            marginBottom: '20px'
          }}>
            {error}
            <button
              onClick={handleBackToList}
              style={{
                marginTop: '12px',
                padding: '8px 16px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: 'none',
                borderRadius: '8px',
                color: '#EF4444',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Вернуться к списку
            </button>
          </div>
        )}

        {/* ШАГ 2: Результат анализа */}
        {selectedCase && !loading && (
          <div>
            <button
              onClick={handleBackToList}
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(233, 30, 99, 0.2)',
                borderRadius: '12px',
                padding: '10px 20px',
                color: '#E91E63',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                marginBottom: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              ← Выбрать другого пациента
            </button>

            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ color: '#1A1A1A', fontSize: '24px', marginBottom: '8px' }}>
                Результат AI-анализа: {selectedPatientData?.name}
              </h2>
              <p style={{ color: '#8A8A8A', fontSize: '14px' }}>
                ID: {selectedPatientData?.id} • {selectedPatientData?.age} лет • Модель: MedMind-RuBERT-v2
              </p>
            </div>

            <AdminView caseData={selectedCase} />
            <GenerateLinkButton />
            <AdminTimeline />
          </div>
        )}
      </div>
    </Layout>
  );
};