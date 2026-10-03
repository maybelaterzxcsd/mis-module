import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { RoutingCase } from '../data/routingMocks';

// Регистрируем Roboto с поддержкой кириллицы (все 4 варианта обязательны!)
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      fontWeight: 300,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
      fontWeight: 500,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Roboto', fontSize: 11 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottom: '2px solid #E91E63', paddingBottom: 10 },
  logo: { fontSize: 18, fontWeight: 'bold', color: '#E91E63' },
  logoSub: { fontSize: 9, color: '#8A8A8A', marginTop: 4 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 5 },
  subtitle: { fontSize: 10, color: '#8A8A8A', marginBottom: 20 },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#E91E63', marginBottom: 8, textTransform: 'uppercase' },
  conclusionBox: { backgroundColor: '#FCE4EC', padding: 12, borderRadius: 6, borderLeft: '3px solid #E91E63', marginBottom: 15 },
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  infoBlock: { flex: 1, padding: 10, backgroundColor: '#F8F9FA', borderRadius: 6, marginHorizontal: 4 },
  infoLabel: { fontSize: 9, color: '#8A8A8A', textTransform: 'uppercase', marginBottom: 4 },
  infoValue: { fontSize: 12, fontWeight: 'bold', color: '#1A1A1A' },
  flagItem: { flexDirection: 'row', alignItems: 'center', padding: 8, backgroundColor: 'rgba(239, 68, 68, 0.08)', borderRadius: 4, marginBottom: 6 },
  flagText: { fontSize: 10, color: '#1A1A1A', marginLeft: 8 },
  disclaimer: { marginTop: 30, padding: 10, backgroundColor: '#F5F5F5', borderRadius: 6, border: '1px solid #E0E0E0' },
  disclaimerText: { fontSize: 8, color: '#8A8A8A', lineHeight: 1.4 },
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, flexDirection: 'row', justifyContent: 'space-between', fontSize: 8, color: '#8A8A8A', borderTop: '1px solid #E0E0E0', paddingTop: 8 }
});

export const PatientRoutePDF: React.FC<{ caseData: RoutingCase; patientName?: string }> = ({ caseData, patientName = 'Пациент' }) => {
  const urgencyText = caseData.urgency === 'red' ? 'ВЫСОКАЯ СРОЧНОСТЬ (24-72 часа)' : caseData.urgency === 'yellow' ? 'СРЕДНЯЯ СРОЧНОСТЬ (2 недели)' : 'ПЛАНОВЫЙ КОНТРОЛЬ';
  const urgencyColor = caseData.urgency === 'red' ? '#C2185B' : caseData.urgency === 'yellow' ? '#F57F17' : '#2E7D32';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>ТРЕТЬЕ МНЕНИЕ</Text>
            <Text style={styles.logoSub}>MedMind AI Routing Module</Text>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#4A4A4A' }}>Маршрут пациента</Text>
            <Text style={{ fontSize: 9, color: '#8A8A8A', marginTop: 4 }}>{new Date().toLocaleDateString('ru-RU')}</Text>
          </View>
        </View>

        <Text style={styles.title}>Индивидуальный маршрут лечения</Text>
        <Text style={styles.subtitle}>Пациент: {patientName} • ID: {caseData.id}</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: caseData.urgency === 'red' ? 'rgba(233,30,99,0.1)' : 'rgba(255,193,7,0.1)', borderRadius: 6, marginBottom: 20, border: `1px solid ${urgencyColor}` }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', color: urgencyColor }}>{urgencyText}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Заключение ИИ-диагностики</Text>
          <View style={styles.conclusionBox}>
            <Text style={{ fontSize: 11, color: '#1A1A1A', lineHeight: 1.5 }}>{caseData.aiConclusion}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Рекомендации</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Специалист</Text>
              <Text style={styles.infoValue}>{caseData.specialist}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Срок визита</Text>
              <Text style={styles.infoValue}>{caseData.timeframe}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Тревожные симптомы (красные флаги)</Text>
          {caseData.redFlags.map((flag, i) => (
            <View key={i} style={styles.flagItem}>
              <Text style={{ color: '#EF4444', fontWeight: 'bold', fontSize: 12 }}>!</Text>
              <Text style={styles.flagText}>{flag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Данный документ сформирован автоматически системой MedMind AI. Он носит информационный характер и не заменяет консультацию врача. Окончательное решение о тактике лечения принимает лечащий врач.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>MedMind Routing Module v1.0</Text>
          <Text>tretye-mnenie.ru</Text>
        </View>
      </Page>
    </Document>
  );
};