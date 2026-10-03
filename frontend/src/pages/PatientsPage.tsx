import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Search, User, Phone, Calendar, ChevronRight, Brain } from "lucide-react";

// Встроенные моковые данные (чтобы не зависеть от удаленных файлов)
const MOCK_PATIENTS = [
  { 
    id: 1, 
    name: "Иванова Мария Петровна", 
    age: 68, 
    phone: "+7 (903) 123-45-67", 
    lastVisit: "12.09.2026", 
    diagnosis: "ИБС, стенокардия напряжения" 
  },
  { 
    id: 2, 
    name: "Петров Иван Сергеевич", 
    age: 45, 
    phone: "+7 (916) 987-65-43", 
    lastVisit: "10.09.2026", 
    diagnosis: "Гипертоническая болезнь II ст." 
  },
  { 
    id: 3, 
    name: "Сидорова Анна Владимировна", 
    age: 32, 
    phone: "+7 (925) 111-22-33", 
    lastVisit: "05.09.2026", 
    diagnosis: "Профилактический осмотр" 
  },
  { 
    id: 4, 
    name: "Козлов Дмитрий Андреевич", 
    age: 54, 
    phone: "+7 (905) 444-55-66", 
    lastVisit: "01.09.2026", 
    diagnosis: "Сахарный диабет 2 типа" 
  },
];

export default function PatientsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Фильтрация пациентов по поиску
  const filteredPatients = MOCK_PATIENTS.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div style={{ padding: "2.5rem" }}>
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 className="page-title" style={{ color: "var(--text-primary)", fontSize: "2rem", fontWeight: 700, margin: 0 }}>
              Пациенты
            </h1>
            <p className="page-subtitle" style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
              Всего пациентов: {MOCK_PATIENTS.length}
            </p>
          </div>
          
          <div style={{ position: "relative", width: "300px" }}>
            <Search size={20} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Поиск по имени или диагнозу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 12px 12px 40px",
                borderRadius: "12px",
                border: "1px solid var(--login-input-border)",
                background: "var(--login-input-bg)",
                color: "var(--text-primary)",
                fontSize: "0.95rem",
                outline: "none",
              }}
            />
          </div>
        </div>

        <div className="glass-card" style={{ overflow: "hidden", padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(233, 30, 99, 0.08)", borderBottom: "1px solid rgba(233, 30, 99, 0.1)" }}>
                <Th>Пациент</Th>
                <Th>Контакты</Th>
                <Th>Последний визит</Th>
                <Th>Диагноз</Th>
                <Th style={{ textAlign: "right" }}>Действия</Th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient, index) => (
                  <tr
                    key={patient.id}
                    style={{ 
                      borderBottom: index !== filteredPatients.length - 1 ? "1px solid rgba(233, 30, 99, 0.1)" : "none",
                      transition: "background 0.2s",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(233, 30, 99, 0.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    onClick={() => navigate(`/patients/${patient.id}`)}
                  >
                    <Td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(233, 30, 99, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#E91E63" }}>
                          <User size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{patient.name}</div>
                          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{patient.age} лет</div>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)" }}>
                        <Phone size={16} />
                        {patient.phone}
                      </div>
                    </Td>
                    <Td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)" }}>
                        <Calendar size={16} />
                        {patient.lastVisit}
                      </div>
                    </Td>
                    <Td>
                      <span style={{ 
                        padding: "4px 12px", 
                        borderRadius: "100px", 
                        background: "rgba(233, 30, 99, 0.1)", 
                        color: "#E91E63", 
                        fontSize: "0.85rem", 
                        fontWeight: 500 
                      }}>
                        {patient.diagnosis}
                      </span>
                    </Td>
                    <Td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/routing?patientId=${patient.id}`)}
                          title="Сформировать AI-маршрут"
                          style={{
                            padding: "8px",
                            borderRadius: "8px",
                            border: "1px solid rgba(233, 30, 99, 0.2)",
                            background: "transparent",
                            color: "#E91E63",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(233, 30, 99, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <Brain size={18} />
                        </button>
                        
                        <button
                          onClick={() => navigate(`/patients/${patient.id}`)}
                          style={{
                            padding: "8px",
                            borderRadius: "8px",
                            border: "1px solid rgba(233, 30, 99, 0.2)",
                            background: "transparent",
                            color: "var(--text-secondary)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(233, 30, 99, 0.1)";
                            e.currentTarget.style.color = "#E91E63";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "var(--text-secondary)";
                          }}
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                    Пациенты не найдены
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

// Вспомогательный компонент для заголовков таблицы
function Th({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", ...style }}>
      {children}
    </th>
  );
}

// Вспомогательный компонент для ячеек таблицы
function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <td style={{ padding: "1rem 1.5rem", fontSize: "0.95rem", color: "var(--text-secondary)", ...style }}>
      {children}
    </td>
  );
}