
import React, { useState } from 'react';

interface BaziInputFormProps {
  onCalculate: (birthDate: string, birthHour: number) => void;
}

export const BaziInputForm: React.FC<BaziInputFormProps> = ({ onCalculate }) => {
  const [birthDate, setBirthDate] = useState<string>('');
  const [birthHour, setBirthHour] = useState<number>(12); // Default to noon
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) {
      setError('请输入您的出生日期。');
      return;
    }
    setError(null);
    onCalculate(birthDate, birthHour);
  };

  const currentYear = new Date().getFullYear();
  const maxDate = new Date().toISOString().split('T')[0];
  const minDate = `${currentYear - 100}-01-01`;

  const hours = Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: `${i.toString().padStart(2, '0')}:00 - ${i.toString().padStart(2, '0')}:59`
  }));

  return (
    <div className="animate-fade-in">
      <p className="text-center text-amber-200 mb-6 text-lg">
        请输入您的公历出生日期和时间，AI将为您揭示命运的奥秘。
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-amber-100 mb-2">
            出生日期
          </label>
          <input
            type="date"
            id="birthDate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            min={minDate}
            max={maxDate}
            className="w-full bg-gray-900/50 border border-amber-400/30 text-white rounded-lg p-3 focus:ring-amber-400 focus:border-amber-400 transition-colors duration-300"
            required
          />
        </div>
        <div>
          <label htmlFor="birthHour" className="block text-sm font-medium text-amber-100 mb-2">
            出生时辰
          </label>
          <select
            id="birthHour"
            value={birthHour}
            onChange={(e) => setBirthHour(parseInt(e.target.value))}
            className="w-full bg-gray-900/50 border border-amber-400/30 text-white rounded-lg p-3 focus:ring-amber-400 focus:border-amber-400 transition-colors duration-300"
          >
            {hours.map(hour => (
              <option key={hour.value} value={hour.value} className="bg-gray-800 text-white">
                {hour.label}
              </option>
            ))}
          </select>
        </div>
        
        {error && <p className="text-red-400 text-center">{error}</p>}

        <div className="pt-4 text-center">
          <button
            type="submit"
            className="px-10 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg rounded-full shadow-lg shadow-amber-500/20 transition-all duration-300 transform hover:scale-105"
          >
            开始测算
          </button>
        </div>
      </form>
    </div>
  );
};
