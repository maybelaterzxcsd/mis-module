import html2pdf from 'html2pdf.js';

const createSection = (title: string, content: string, color: string = '#1e40af') => {
  if (!content) return '';
  return `
    <p style="margin: 15px 0 5px 0; font-size: 14px;"><strong>${title}:</strong></p>
    <p style="margin: 5px 0 10px 20px; font-size: 14px; line-height: 1.6;">${content}</p>
  `;
};

const createDataRow = (label: string, value: string) => {
  if (!value) return '';
  return `<p style="margin: 5px 0; font-size: 14px;"><strong>${label}:</strong> ${value}</p>`;
};

export const generateProtocolPDF = (protocol: any) => {
  const specialization = protocol.specialization || 'therapist';
  
  const getProfileTitle = () => {
    switch (specialization) {
      case 'cardiologist': return 'кардиологии';
      case 'neurologist': return 'неврологии';
      default: return 'терапии';
    }
  };

  const getProtocolTitle = () => {
    switch (specialization) {
      case 'cardiologist': return 'Протокол осмотра врача-кардиолога';
      case 'neurologist': return 'Протокол осмотра врача-невролога';
      default: return 'Протокол осмотра врача-терапевта';
    }
  };

  const getDepartmentTitle = () => {
    switch (specialization) {
      case 'cardiologist': return 'Кардиологическое отделение';
      case 'neurologist': return 'Неврологическое отделение';
      default: return 'Терапевтическое отделение';
    }
  };

  const getSpecializationContent = () => {
    switch (specialization) {
      case 'cardiologist':
        return `
          ${createDataRow('Кардиологический статус', protocol.cardioStatus)}
          ${createDataRow('АД на правой руке', protocol.bloodPressureRight ? `${protocol.bloodPressureRight} мм рт.ст.` : '')}
          ${createDataRow('АД на левой руке', protocol.bloodPressureLeft ? `${protocol.bloodPressureLeft} мм рт.ст.` : '')}
          ${createDataRow('ЧСС', protocol.heartRate ? `${protocol.heartRate} уд/мин` : '')}
          ${createSection('ЭКГ-заключение', protocol.ecgConclusion)}
          ${createSection('ЭхоКГ данные', protocol.echoKgData)}
        `;
      
      case 'neurologist':
        return `
          ${createSection('Неврологический статус', protocol.neuroStatus)}
          ${createSection('Черепные нервы', protocol.cranialNerves)}
          ${createSection('Рефлексы', protocol.reflexes)}
          ${createSection('Чувствительность', protocol.sensitivity)}
          ${createSection('Менингеальные знаки', protocol.meningealSigns)}
          ${createSection('Координация', protocol.coordination)}
        `;
      
      default: 
        return `
          ${createSection('Анамнез жизни', protocol.anamnesisVita)}
          ${createSection('Анамнез заболевания', protocol.anamnesisMorbi)}
          ${createSection('Объективный статус', protocol.objectiveStatus)}
          ${createSection('Локальный статус', protocol.localStatus)}
        `;
    }
  };

  const content = `
    <div style="font-family: 'Times New Roman', Times, serif; padding: 20px; max-width: 800px; margin: 0 auto; color: #000; line-height: 1.6;">
      <!-- Шапка документа -->
      <div style="margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 15px;">
        <p style="margin: 5px 0; font-size: 14px;"><strong>Пациент:</strong> ${protocol.patient?.name || 'Не указан'}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Дата рождения:</strong> ${protocol.patient?.birthDate || 'Не указана'}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Полис ОМС:</strong> ${protocol.patient?.oms || 'Не указан'}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Дата и время посещения:</strong> ${protocol.date || ''}${protocol.time ? `, ${protocol.time}` : ''}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>МО:</strong> ${protocol.institution || 'Городская поликлиника №15'}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Профиль:</strong> ${getProfileTitle()}</p>
      </div>

      <!-- Заголовок протокола -->
      <div style="text-align: center; margin: 30px 0;">
        <h2 style="margin: 10px 0; font-size: 16px; text-transform: uppercase;">${protocol.institution || 'ГОРОДСКАЯ ПОЛИКЛИНИКА №15'}</h2>
        <h3 style="margin: 10px 0; font-size: 14px;">${getDepartmentTitle()}</h3>
        <h3 style="margin: 10px 0; font-size: 14px;">${getProtocolTitle()}</h3>
      </div>

      <!-- Жалобы (общие для всех) -->
      <p style="margin: 15px 0 5px 0; font-size: 14px;"><strong>Жалобы:</strong></p>
      <p style="margin: 5px 0 15px 20px; font-size: 14px; line-height: 1.6;">${protocol.complaints || 'Не заполнено'}</p>

      <!-- Специфические поля для специализации -->
      ${getSpecializationContent()}

      <!-- Диагноз (общий для всех) -->
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #000;">
        <p style="margin: 15px 0 5px 0; font-size: 14px;"><strong>Основной диагноз:</strong></p>
        <p style="margin: 5px 0 10px 20px; font-size: 14px; font-weight: bold; line-height: 1.6;">${protocol.diagnosis || 'Не установлен'}</p>
        <p style="margin: 5px 0 10px 20px; font-size: 14px;"><strong>Код МКБ-10:</strong> ${protocol.icd10 || 'Не указан'}</p>
      </div>

      <!-- Подпись врача -->
      <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #000;">
        <p style="margin: 10px 0; font-size: 14px;"><strong>Врач:</strong> ${protocol.doctor || 'Не указан'}</p>
        <p style="margin: 10px 0; font-size: 14px;"><strong>Специализация:</strong> ${specialization === 'cardiologist' ? 'Кардиолог' : specialization === 'neurologist' ? 'Невролог' : 'Терапевт'}</p>
        <div style="margin-top: 30px; display: flex; justify-content: space-between;">
          <p style="margin: 0; font-size: 14px;"><strong>Подпись:</strong> _______________</p>
          <p style="margin: 0; font-size: 14px;"><strong>Печать:</strong> _______________</p>
        </div>
        <p style="margin: 10px 0; font-size: 14px;"><strong>Дата:</strong> ${protocol.date || new Date().toLocaleDateString('ru-RU')}</p>
      </div>

      <!-- Сноска -->
      <p style="text-align: center; color: #666; font-size: 10px; margin-top: 40px; font-style: italic;">
        Документ сгенерирован системой MedMind ${new Date().toLocaleDateString('ru-RU')}
      </p>
    </div>
  `;

  const opt: any = {
    margin: 15,
    filename: `Протокол_${protocol.id || 'new'}_${(protocol.patient?.name || 'patient').replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().from(content).set(opt).save();
};

export const generateSickLeavePDF = (sickLeave: any) => {
  const content = `
    <div style="font-family: 'Times New Roman', Times, serif; padding: 20px; max-width: 800px; margin: 0 auto; color: #000; line-height: 1.6;">
      <div style="text-align: center; margin: 30px 0; border-bottom: 2px solid #000; padding-bottom: 15px;">
        <h2 style="margin: 10px 0; font-size: 16px; text-transform: uppercase;">Листок нетрудоспособности</h2>
        <p style="margin: 10px 0; font-size: 14px;">№ ${sickLeave.id} от ${sickLeave.startDate}</p>
      </div>

      <div style="margin: 20px 0;">
        <p style="margin: 15px 0; font-size: 14px;"><strong>Пациент:</strong> ${sickLeave.patient}</p>
        <p style="margin: 15px 0; font-size: 14px;"><strong>Место работы:</strong> ${sickLeave.workplace}</p>
        <p style="margin: 15px 0; font-size: 14px;"><strong>Должность:</strong> ${sickLeave.position}</p>
        <p style="margin: 15px 0; font-size: 14px;"><strong>Период нетрудоспособности:</strong> ${sickLeave.startDate} — ${sickLeave.endDate}</p>
        <p style="margin: 15px 0; font-size: 14px;"><strong>Причина:</strong> ${sickLeave.reason}</p>
        <p style="margin: 15px 0; font-size: 14px;"><strong>Диагноз:</strong> ${sickLeave.diagnosis}</p>
        <p style="margin: 15px 0; font-size: 14px;"><strong>Код МКБ-10:</strong> ${sickLeave.icd10}</p>
        <p style="margin: 15px 0; font-size: 14px;"><strong>Статус:</strong> ${sickLeave.status}</p>
      </div>

      <div style="margin: 40px 0; padding-top: 20px; border-top: 1px solid #000;">
        <p style="margin: 10px 0; font-size: 14px;"><strong>Врач:</strong> ${sickLeave.doctor || 'Петрова М.С.'}</p>
        <div style="margin-top: 30px; display: flex; justify-content: space-between;">
          <p style="margin: 0; font-size: 14px;"><strong>Подпись:</strong> _______________</p>
          <p style="margin: 0; font-size: 14px;"><strong>Печать:</strong> _______________</p>
        </div>
      </div>
    </div>
  `;

  const opt: any = {
    margin: 15,
    filename: `Больничный_${sickLeave.id}_${sickLeave.patient.replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().from(content).set(opt).save();
};