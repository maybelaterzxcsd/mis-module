export const protocolTemplates = {
  therapist: {
    title: 'Протокол осмотра врача-терапевта',
    fields: ['complaints', 'anamnesisVita', 'anamnesisMorbi', 'objectiveStatus', 'localStatus', 'diagnosis']
  },
  cardiologist: {
    title: 'Протокол осмотра врача-кардиолога',
    fields: ['complaints', 'cardioStatus', 'bloodPressureRight', 'bloodPressureLeft', 'heartRate', 'ecgConclusion', 'echoKgData', 'diagnosis']
  },
  neurologist: {
    title: 'Протокол осмотра врача-невролога',
    fields: ['complaints', 'neuroStatus', 'cranialNerves', 'reflexes', 'sensitivity', 'meningealSigns', 'coordination', 'diagnosis']
  },
  pediatrician: {
    title: 'Протокол осмотра врача-педиатра',
    fields: ['complaints', 'developmentHistory', 'physicalDevelopment', 'objectiveStatus', 'localStatus', 'diagnosis']
  },
  endocrinologist: {
    title: 'Протокол осмотра врача-эндокринолога',
    fields: ['complaints', 'endocrineStatus', 'bloodSugar', 'hba1c', 'thyroidStatus', 'diagnosis']
  },
  pulmonologist: {
    title: 'Протокол осмотра врача-пульмонолога',
    fields: ['complaints', 'respStatus', 'spO2', 'auscultationData', 'spirometryData', 'diagnosis']
  },
  gastroenterologist: {
    title: 'Протокол осмотра врача-гастроэнтеролога',
    fields: ['complaints', 'gastroStatus', 'abdomenPalpation', 'endoscopyData', 'diagnosis']
  },
  surgeon: {
    title: 'Протокол осмотра врача-хирурга',
    fields: ['complaints', 'surgicalStatus', 'woundStatus', 'postOpPlan', 'diagnosis']
  },
  ophthalmologist: {
    title: 'Протокол осмотра врача-офтальмолога',
    fields: ['complaints', 'visualAcuity', 'intraocularPressure', 'fundusData', 'diagnosis']
  },
  otolaryngologist: {
    title: 'Протокол осмотра врача-оториноларинголога (ЛОР)',
    fields: ['complaints', 'entStatus', 'otoscopyData', 'rhinoscopyData', 'diagnosis']
  }
};