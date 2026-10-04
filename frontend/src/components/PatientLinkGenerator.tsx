import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const PatientLinkGenerator = () => {
  const [patientId, setPatientId] = useState('');
  const [copied, setCopied] = useState(false);

  const generateLink = () => {
    const newId = `patient_${Math.floor(Math.random() * 100000)}`;
    setPatientId(newId);
    setCopied(false);
  };

  const botLink = patientId ? `https://t.me/navimed_bot?start=${patientId}` : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(botLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 max-w-md w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
         Маршрут для пациента
      </h2>

      {!patientId ? (
        <button
          onClick={generateLink}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
        >
          Сгенерировать ссылку и QR-код
        </button>
      ) : (
        <div className="flex flex-col items-center space-y-4 animate-fadeIn">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <QRCodeSVG value={botLink} size={180} level="H" />
          </div>

          <div className="w-full flex items-center space-x-2">
            <input
              type="text"
              value={botLink}
              readOnly
              className="flex-1 p-2 border border-gray-300 rounded text-sm bg-gray-50 text-gray-700 truncate"
            />
            <button
              onClick={copyToClipboard}
              className={`px-4 py-2 rounded transition text-sm font-medium text-white ${
                copied ? 'bg-green-500' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {copied ? '✓ Скопировано' : 'Копировать'}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Пациент сканирует QR или переходит по ссылке, чтобы получить AI-маршрут в Telegram.
          </p>

          <button
            onClick={() => setPatientId('')}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Сгенерировать для другого пациента
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientLinkGenerator;