import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import {
  User,
  Calendar,
  Phone,
  MapPin,
  FileText,
  Activity,
  ClipboardList,
  TestTube,
  Plus,
  Pill,
  AlertCircle,
  Route,
  Brain,
} from "lucide-react";
import { Layout } from "../components/Layout";

const MOCK_PATIENT = {
  id: 1,
  personalInfo: {
    fullName: "Иванова Мария Петровна",
    dateOfBirth: "15.03.1958",
    age: 68,
    phone: "+7 (903) 123-45-67",
    address: "г. Москва, ул. Ленина, д. 10, кв. 45",
    insurancePolicy: "7700 1234 5678 90",
    snils: "123-456-789 00",
  },
  medicalInfo: {
    bloodGroup: "A(II)",
    rhFactor: "Rh+",
    allergies: ["Пенициллин", "Аспирин"],
    chronicDiseases: ["ИБС", "Гипертоническая болезнь II ст."],
  },
  visits: [
    { id: 1, date: "12.09.2026", doctorName: "Смирнов А.В.", type: "Кардиолог", diagnosis: "ИБС, стенокардия напряжения" },
    { id: 2, date: "28.08.2026", doctorName: "Петрова Е.С.", type: "Терапевт", diagnosis: "Гипертонический криз" },
    { id: 3, date: "15.07.2026", doctorName: "Козлов Д.М.", type: "Кардиолог", diagnosis: "Контрольный осмотр" },
  ],
  protocols: [
    { id: 1, date: "12.09.2026", type: "Лечение ИБС", diagnosis: "I25.1", status: "Утверждён" },
    { id: 2, date: "28.08.2026", type: "Купирование криза", diagnosis: "I10", status: "Завершён" },
  ],
};

function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("visits");

  const details = MOCK_PATIENT;

  const patient = {
    id: details.id,
    name: details.personalInfo.fullName,
    birthDate: details.personalInfo.dateOfBirth,
    age: details.personalInfo.age,
    phone: details.personalInfo.phone,
    address: details.personalInfo.address,
    oms: details.personalInfo.insurancePolicy || "Не указан",
    snils: details.personalInfo.snils || "Не указан",
    bloodGroup: `${details.medicalInfo.bloodGroup || "Не определена"} ${details.medicalInfo.rhFactor || ""}`,
    allergies: details.medicalInfo.allergies,
    chronicDiseases: details.medicalInfo.chronicDiseases,
  };

  const tabs = [
    { id: "visits", label: "Приёмы", icon: Calendar },
    { id: "protocols", label: "Протоколы", icon: ClipboardList },
    { id: "tests", label: "Анализы", icon: TestTube },
    { id: "prescriptions", label: "Назначения", icon: Pill },
  ];

  const getStatusColor = (status: string) => {
    return status === "Утверждён" || status === "Завершён"
      ? "rgba(76, 175, 80, 0.15)"
      : "rgba(255, 193, 7, 0.15)";
  };

  const handleAIRouting = () => {
    toast.info("AI-маршрутизация", `Формируем маршрут для пациента ${patient.name}`);
    navigate(`/routing?patientId=${patient.id}`);
  };

  return (
    <Layout>
      <div style={{ padding: "2.5rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 className="page-title" style={{ color: "var(--text-primary)", fontSize: "2rem", fontWeight: 700, margin: 0 }}>
                {patient.name}
              </h1>
              <p className="page-subtitle" style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
                ID: {patient.id} • {patient.age} лет
              </p>
            </div>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button
                onClick={handleAIRouting}
                style={{
                  background: "linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)",
                  border: "none",
                  borderRadius: "16px",
                  padding: "1rem 1.5rem",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  boxShadow: "0 8px 20px rgba(233, 30, 99, 0.4)",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 30px rgba(233, 30, 99, 0.6)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 20px rgba(233, 30, 99, 0.4)";
                }}
              >
                <Brain size={20} />
                Сформировать AI-маршрут
              </button>

              <button
                onClick={() => toast.info("Новый приём", "Функция в разработке")}
                className="btn-primary"
                style={{
                  background: "var(--primary-gradient)",
                  border: "none",
                  borderRadius: "16px",
                  padding: "1rem 1.5rem",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <Plus size={20} />
                Новый приём
              </button>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: "2rem", marginBottom: "2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            <div>
              <h3 style={{ color: "var(--text-primary)", fontSize: "1.125rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <User size={20} />
                Основная информация
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <InfoRow icon={<Calendar size={16} />} label="Дата рождения" value={patient.birthDate} />
                <InfoRow icon={<Phone size={16} />} label="Телефон" value={patient.phone} />
                <InfoRow icon={<MapPin size={16} />} label="Адрес" value={patient.address} />
              </div>
            </div>

            <div>
              <h3 style={{ color: "var(--text-primary)", fontSize: "1.125rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FileText size={20} />
                Документы
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <InfoRow icon={<ClipboardList size={16} />} label="Полис ОМС" value={patient.oms} />
                <InfoRow icon={<ClipboardList size={16} />} label="СНИЛС" value={patient.snils} />
                <InfoRow icon={<Activity size={16} />} label="Группа крови" value={patient.bloodGroup} />
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              {patient.allergies.length > 0 && (
                <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "12px", padding: "1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <AlertCircle size={20} color="#ef4444" />
                  <div>
                    <p style={{ color: "var(--text-primary)", fontWeight: 700, margin: 0 }}>Аллергии:</p>
                    <p style={{ color: "var(--text-secondary)", margin: "0.25rem 0 0 0" }}>{patient.allergies.join(", ")}</p>
                  </div>
                </div>
              )}

              {patient.chronicDiseases.length > 0 && (
                <div style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "12px", padding: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <AlertCircle size={20} color="#f59e0b" />
                  <div>
                    <p style={{ color: "var(--text-primary)", fontWeight: 700, margin: 0 }}>Хронические заболевания:</p>
                    <p style={{ color: "var(--text-secondary)", margin: "0.25rem 0 0 0" }}>{patient.chronicDiseases.join(", ")}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", borderBottom: "1px solid rgba(233, 30, 99, 0.1)", padding: "0 1rem" }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "1rem 1.5rem",
                    border: "none",
                    background: "transparent",
                    color: activeTab === tab.id ? "#E91E63" : "var(--text-muted)",
                    fontWeight: activeTab === tab.id ? 600 : 500,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    borderBottom: activeTab === tab.id ? "2px solid #E91E63" : "2px solid transparent",
                    transition: "all 0.2s",
                  }}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div style={{ padding: "2rem" }}>
            {activeTab === "visits" && (
              <div>
                <h3 style={{ color: "var(--text-primary)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>
                  История приёмов
                </h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(233, 30, 99, 0.08)" }}>
                      <Th>Дата</Th>
                      <Th>Врач</Th>
                      <Th>Специализация</Th>
                      <Th>Диагноз</Th>
                      <Th>Статус</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.visits.map((visit, index) => (
                      <tr
                        key={visit.id}
                        style={{ borderBottom: index !== details.visits.length - 1 ? "1px solid rgba(233, 30, 99, 0.1)" : "none" }}
                      >
                        <Td>{visit.date}</Td>
                        <Td style={{ fontWeight: 600 }}>{visit.doctorName}</Td>
                        <Td>{visit.type}</Td>
                        <Td>{visit.diagnosis}</Td>
                        <Td>
                          <span
                            style={{
                              padding: "4px 12px",
                              borderRadius: "100px",
                              background: getStatusColor("Завершён"),
                              color: "var(--text-secondary)",
                              fontSize: "0.85rem",
                              fontWeight: 500,
                            }}
                          >
                            Завершён
                          </span>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "protocols" && (
              <div>
                <h3 style={{ color: "var(--text-primary)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>
                  Протоколы лечения
                </h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(233, 30, 99, 0.08)" }}>
                      <Th>Дата</Th>
                      <Th>Тип протокола</Th>
                      <Th>Диагноз</Th>
                      <Th>Статус</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.protocols.map((protocol, index) => (
                      <tr
                        key={protocol.id}
                        style={{ borderBottom: index !== details.protocols.length - 1 ? "1px solid rgba(233, 30, 99, 0.1)" : "none" }}
                      >
                        <Td>{protocol.date}</Td>
                        <Td style={{ fontWeight: 600 }}>{protocol.type}</Td>
                        <Td>{protocol.diagnosis}</Td>
                        <Td>
                          <span
                            style={{
                              padding: "4px 12px",
                              borderRadius: "100px",
                              background: getStatusColor(protocol.status),
                              color: "var(--text-secondary)",
                              fontSize: "0.85rem",
                              fontWeight: 500,
                            }}
                          >
                            {protocol.status}
                          </span>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "tests" && (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <div style={{ width: "80px", height: "80px", background: "rgba(233, 30, 99, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                  <TestTube size={40} color="#E91E63" />
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem" }}>
                  Результаты анализов будут здесь
                </p>
              </div>
            )}

            {activeTab === "prescriptions" && (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <div style={{ width: "80px", height: "80px", background: "rgba(233, 30, 99, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                  <Pill size={40} color="#E91E63" />
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem" }}>
                  Назначения будут здесь
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <span style={{ color: "var(--text-muted)" }}>{icon}</span>
      <div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", margin: 0 }}>{label}</p>
        <p style={{ color: "var(--text-primary)", fontSize: "0.875rem", fontWeight: 600, margin: "0.25rem 0 0 0" }}>{value}</p>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
      {children}
    </th>
  );
}

function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <td style={{ padding: "1rem", fontSize: "0.875rem", color: "var(--text-secondary)", ...style }}>
      {children}
    </td>
  );
}

export default PatientDetailPage;