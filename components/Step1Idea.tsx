import React, { useState } from 'react';
import { AppState } from '../types';
import { Wand2, Users, Baby, Armchair, Briefcase } from 'lucide-react';
import { generateIdeaHelp } from '../services/geminiService';

interface Props {
  data: AppState;
  updateData: (updates: Partial<AppState>) => void;
  onNext: () => void;
}

export const Step1Idea: React.FC<Props> = ({ data, updateData, onNext }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiHelp = async () => {
    setIsGenerating(true);
    const suggestion = await generateIdeaHelp(data.problem);
    if (suggestion) {
      updateData({ problem: suggestion });
    }
    setIsGenerating(false);
  };

  const audiences = [
    { id: 'General', label: '一般大眾', icon: Users },
    { id: 'Kids', label: '小朋友', icon: Baby },
    { id: 'Elders', label: '長輩', icon: Armchair },
    { id: 'Colleagues', label: '公司同事', icon: Briefcase },
  ];

  const toggleAudience = (id: string) => {
    const current = data.targetAudience;
    const isSelected = current.includes(id);
    if (isSelected) {
      updateData({ targetAudience: current.filter(x => x !== id) });
    } else {
      updateData({ targetAudience: [...current, id] });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">你的想法是什麼？</h2>
        <p className="text-gray-500">告訴我你想解決的問題，越簡單越好</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        
        {/* Project Name */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">專案名稱 (隨便取個名字)</label>
          <input
            type="text"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="例如：我的記帳小幫手"
            value={data.projectName}
            onChange={(e) => updateData({ projectName: e.target.value })}
          />
        </div>

        {/* Problem Statement */}
        <div className="relative">
          <label className="block text-sm font-bold text-gray-700 mb-2">想解決什麼問題？</label>
          <div className="relative">
            <textarea
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[100px]"
              placeholder="例如：每次記帳都覺得很不直覺化..."
              value={data.problem}
              onChange={(e) => updateData({ problem: e.target.value })}
            />
            <button
              onClick={handleAiHelp}
              disabled={isGenerating}
              className="absolute bottom-3 right-3 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
            >
              <Wand2 size={14} />
              {isGenerating ? '思考中...' : 'AI 幫我想一下'}
            </button>
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">誰會用這個東西？</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {audiences.map((aud) => (
              <button
                key={aud.id}
                onClick={() => toggleAudience(aud.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition
                  ${data.targetAudience.includes(aud.id) 
                    ? 'bg-blue-50 border-blue-500 text-blue-700' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                <aud.icon size={16} />
                {aud.label}
              </button>
            ))}
          </div>
          <input
             type="text"
             className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
             placeholder="補充說明 (選填)：例如：不太擅長用手機的長輩..."
             value={data.targetAudienceCustom}
             onChange={(e) => updateData({ targetAudienceCustom: e.target.value })}
          />
        </div>

        {/* Success Metrics */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">怎樣才算「成功」？(目標)</label>
          <input
            type="text"
            className="w-full p-3 bg-white border border-green-200 ring-1 ring-green-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="例如：讓我記帳更順利"
            value={data.successMetrics}
            onChange={(e) => updateData({ successMetrics: e.target.value })}
          />
        </div>

      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition transform flex items-center gap-2"
        >
          AI 幫我想一下 <Wand2 size={18} />
        </button>
      </div>
    </div>
  );
};