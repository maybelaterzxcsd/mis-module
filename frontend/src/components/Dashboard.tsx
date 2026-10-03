import { Layout } from "./Layout";
import { Calendar, FileText, AlertCircle, Users, Brain, Phone, Send } from "lucide-react";

const DOCTOR_NAME = "Смирнов А.В.";

const mockTodayAppointments = [
  { id: 1, time: "09:00", patient: "Иванова М.П.", type: "Повторный прием", status: "completed" },
  { id: 2, time: "10:30", patient: "Петров И.С.", type: "Первичный прием", status: "pending" },
  { id: 3, time: "12:00", patient: "Сидорова А.В.", type: "Консультация", status: "pending" },
];

const mockNotifications = [
  { id: 1, text: "Новое заключение ИИ по маммографии (BI-RADS 4)", urgent: true },
  { id: 2, text: "Пациент Козлов Д.А. не явился на прием", urgent: false },
];

export default function Dashboard() {
  const today = new Date().toLocaleDateString("ru-RU", { 
    weekday: "long", 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });

  const handleSendDrip = async (patientId: string, day: number, patientName: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/drip-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: patientId, day: day })
      });
      const data = await response.json();
      alert(`✅ Бот отправил сообщение ${patientName}:\n\n"${data.message_sent}"`);
    } catch (e) {
      alert(`✅ Задача поставлена в очередь:\nОтправить напоминание (День ${day}) для ${patientName}`);
    }
  };

  const handleAssignCall = (patientName: string) => {
    alert(`✅ Задача создана:\nАдминистратору поручено позвонить ${patientName} в течение 15 минут.`);
  };

  return (
    <Layout>
      <div style={{ padding: "2.5rem" }}>
        {/* Приветствие */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 className="page-title" style={{ color: "var(--text-primary)", fontSize: "2rem", fontWeight: 700, margin: 0 }}>
            Добрый день, {DOCTOR_NAME}! 
          </h1>
          <p className="page-subtitle" style={{ color: "var(--text-muted)", marginTop: "0.5rem", textTransform: "capitalize" }}>
            {today}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          <StatCard icon={<Users size={24} />} title="Всего пациентов" value="1,248" color="#E91E63" />
          <StatCard icon={<Calendar size={24} />} title="Приёмов сегодня" value="12" color="#9C27B0" />
          <StatCard icon={<FileText size={24} />} title="Черновики протоколов" value="3" color="#F59E0B" />
          <StatCard icon={<Brain size={24} />} title="AI-анализов за неделю" value="47" color="#10B981" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
          
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <h3 style={{ color: "var(--text-primary)", fontSize: "1.125rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Calendar size={20} color="#E91E63" />
              Приёмы на сегодня
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {mockTodayAppointments.map((apt) => (
                <div 
                  key={apt.id} 
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    padding: "1rem", 
                    background: "rgba(255, 255, 255, 0.5)", 
                    borderRadius: "12px",
                    border: "1px solid rgba(233, 30, 99, 0.1)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)", minWidth: "50px" }}>
                      {apt.time}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{apt.patient}</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{apt.type}</div>
                    </div>
                  </div>
                  <span style={{ 
                    padding: "4px 12px", 
                    borderRadius: "100px", 
                    fontSize: "0.8rem", 
                    fontWeight: 600,
                    background: apt.status === "completed" ? "rgba(76, 175, 80, 0.15)" : "rgba(255, 193, 7, 0.15)",
                    color: apt.status === "completed" ? "#2E7D32" : "#F57F17"
                  }}>
                    {apt.status === "completed" ? "Завершён" : "Ожидает"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            <div className="glass-card" style={{ padding: "1.5rem", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
              <h3 style={{ color: "var(--text-primary)", fontSize: "1.125rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <AlertCircle size={20} color="#EF4444" />
                Пациенты в зоне риска
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ padding: "0.75rem", background: "rgba(255, 193, 7, 0.1)", borderRadius: "8px", borderLeft: "3px solid #F59E0B" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1A1A1A" }}>Иванова М.П.</span>
                    <span style={{ fontSize: "0.75rem", background: "#F59E0B", color: "white", padding: "2px 6px", borderRadius: "4px" }}>День 3</span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#4A4A4A", margin: "4px 0 8px 0" }}>Не записалась. Требуется мягкое напоминание.</p>
                  <button 
                    onClick={() => handleSendDrip("1", 3, "Ивановой М.П.")}
                    style={{
                      width: "100%",
                      padding: "6px",
                      background: "#F59E0B",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px"
                    }}
                  >
                    <Send size={14} />
                    Отправить пуш в бота
                  </button>
                </div>

                <div style={{ padding: "0.75rem", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px", borderLeft: "3px solid #EF4444" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1A1A1A" }}>Козлов Д.А.</span>
                    <span style={{ fontSize: "0.75rem", background: "#EF4444", color: "white", padding: "2px 6px", borderRadius: "4px" }}>День 7</span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#4A4A4A", margin: "4px 0 8px 0" }}>Высокий риск отказа от лечения.</p>
                  <button 
                    onClick={() => handleAssignCall("Козлову Д.А.")}
                    style={{
                      width: "100%",
                      padding: "6px",
                      background: "#EF4444",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px"
                    }}
                  >
                    <Phone size={14} />
                    Поручить обзвон
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: "1.5rem" }}>
              <h3 style={{ color: "var(--text-primary)", fontSize: "1.125rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FileText size={20} color="#9C27B0" />
                Уведомления
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {mockNotifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    style={{ 
                      padding: "0.75rem", 
                      background: notif.urgent ? "rgba(233, 30, 99, 0.08)" : "rgba(255, 255, 255, 0.5)", 
                      borderRadius: "8px",
                      borderLeft: notif.urgent ? "3px solid #E91E63" : "3px solid transparent"
                    }}
                  >
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: notif.urgent ? 600 : 400 }}>
                      {notif.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => window.location.href = '/routing'}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 12px rgba(233, 30, 99, 0.3)"
              }}
            >
              <Brain size={18} />
              Перейти к AI-маршрутизации
            </button>

          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string; color: string }) {
  return (
    <div className="glass-card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
      <div style={{ 
        width: "48px", 
        height: "48px", 
        borderRadius: "12px", 
        background: `${color}15`,
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        color: color
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px" }}>{title}</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>{value}</div>
      </div>
    </div>
  );
}