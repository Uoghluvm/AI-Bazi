
import React from 'react';
import type { BaziData, Pillar } from '../types';

interface BaziResultProps {
  data: BaziData;
}

const PillarCard: React.FC<{ title: string; pillar: Pillar }> = ({ title, pillar }) => (
  <div className="flex flex-col items-center bg-gray-900/50 p-4 rounded-lg border border-amber-400/20 text-center flex-1 min-w-[100px] shadow-lg">
    <span className="text-amber-300 text-lg mb-2">{title}</span>
    <div className="font-calligraphy text-5xl text-white">{pillar.stem}</div>
    <div className="font-calligraphy text-5xl text-amber-200">{pillar.branch}</div>
  </div>
);

const AnalysisSection: React.FC<{ title: string; content: string; icon: string }> = ({ title, content, icon }) => (
    <div className="bg-gray-900/30 p-5 rounded-lg border border-amber-400/10 mb-4">
        <h3 className="text-2xl font-bold text-amber-300 mb-3 flex items-center">
            <span className="text-3xl mr-3">{icon}</span>
            {title}
        </h3>
        <p className="text-amber-100/90 leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
);

export const BaziResult: React.FC<BaziResultProps> = ({ data }) => {
  const { pillars, analysis } = data;

  return (
    <div>
      <h2 className="text-3xl font-calligraphy text-center text-amber-300 mb-6">您的八字命盘</h2>
      
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
        <PillarCard title="年柱" pillar={pillars.year} />
        <PillarCard title="月柱" pillar={pillars.month} />
        <PillarCard title="日柱" pillar={pillars.day} />
        <PillarCard title="时柱" pillar={pillars.hour} />
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-calligraphy text-center text-amber-300 mb-6">AI 命理分析</h2>
        
        <AnalysisSection title="命主" content={analysis.mingZhu} icon="🌟" />
        <AnalysisSection title="性格分析" content={analysis.personality} icon="👤" />
        <AnalysisSection title="事业财运" content={analysis.career} icon="💼" />
        <AnalysisSection title="感情婚姻" content={analysis.relationship} icon="❤️" />
        <AnalysisSection title="健康状况" content={analysis.health} icon="🌿" />
        <AnalysisSection title="综合建议" content={analysis.summary} icon="📜" />
      </div>
    </div>
  );
};
