
import React, { useState } from 'react';
import { BaziInputForm } from './components/BaziInputForm';
import { BaziResult } from './components/BaziResult';
import { LoadingSpinner } from './components/LoadingSpinner';
import { getBaziAnalysisFromAI } from './services/geminiService';
import { getBaziPillars } from './services/baziCalculator';
import type { BaziData } from './types';

const App: React.FC = () => {
  const [baziData, setBaziData] = useState<BaziData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (birthDate: string, birthHour: number, gender: 'male' | 'female') => {
    setIsLoading(true);
    setError(null);
    setBaziData(null);

    try {
      // Step 1: Calculate Bazi pillars on the client-side first.
      const calculatedPillars = getBaziPillars(birthDate, birthHour);
      
      // Step 2: Send birth info and calculated pillars to AI for analysis.
      const result = await getBaziAnalysisFromAI(birthDate, birthHour, gender, calculatedPillars);
      setBaziData(result);
    } catch (err) {
      console.error(err);
      setError('无法连接到AI命理大师，请稍后再试。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white bg-cover bg-center bg-fixed" style={{backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=2')"}}>
      <div className="min-h-screen bg-black bg-opacity-60 backdrop-blur-sm flex flex-col items-center justify-center p-4">
        <header className="text-center mb-8 animate-fade-in-down">
          <h1 className="text-5xl md:text-6xl font-calligraphy text-amber-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            AI 八字精批
          </h1>
          <p className="text-lg md:text-xl text-amber-100 mt-2 tracking-widest">
            洞悉天机・知命改运
          </p>
        </header>

        <main className="w-full max-w-4xl bg-gray-800 bg-opacity-50 rounded-2xl shadow-2xl shadow-amber-500/10 border border-amber-400/20 p-6 md:p-10 transition-all duration-500">
          {!baziData && !isLoading && (
            <BaziInputForm onCalculate={handleCalculate} />
          )}
          
          {isLoading && <LoadingSpinner />}

          {error && (
            <div className="text-center text-red-400 bg-red-900/30 p-4 rounded-lg animate-fade-in">
              <p className="font-bold">发生错误</p>
              <p>{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setBaziData(null);
                  setIsLoading(false);
                }}
                className="mt-4 px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors duration-300"
              >
                重试
              </button>
            </div>
          )}

          {baziData && !isLoading && (
            <div className="animate-fade-in">
              <BaziResult data={baziData} />
              <div className="text-center mt-8">
                <button
                  onClick={() => setBaziData(null)}
                  className="px-8 py-3 bg-amber-600/80 hover:bg-amber-500/90 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  重新测算
                </button>
              </div>
            </div>
          )}
        </main>
        
        <footer className="text-center mt-8 text-amber-200/50 text-sm">
          <p>本服务由AI生成，内容仅供参考娱乐，请勿全信。</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
