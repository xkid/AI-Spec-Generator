import React, { useEffect, useState } from 'react';
import { AppState } from '../types';
import { generateFinalSpec } from '../services/geminiService';
import { Loader2, Copy, Check, RotateCw } from 'lucide-react';

interface Props {
  data: AppState;
  updateData: (updates: Partial<AppState>) => void;
  onBack: () => void;
}

export const Step6Result: React.FC<Props> = ({ data, updateData, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!data.finalMarkdown && !loading) {
      handleGenerate();
    }
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateFinalSpec(data);
    updateData({ finalMarkdown: result });
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.finalMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-lg">
           <Check size={18} />
           <span className="font-bold text-sm">規格書已生成！</span>
         </div>
         <div className="flex gap-2">
            <button 
              onClick={handleGenerate} 
              disabled={loading}
              className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition"
              title="重新生成"
            >
              <RotateCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
         </div>
      </div>

      <div className="bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/5">
        <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-white/10">
          <div className="text-gray-400 text-xs font-mono">Product_Spec.md</div>
          <button 
            onClick={handleCopy}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition
              ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            {copied ? <><Check size={14}/> 已複製</> : <><Copy size={14}/> 複製規格書</>}
          </button>
        </div>
        
        <div className="p-6 overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-4">
              <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
              <p>AI 正在撰寫文件中...</p>
            </div>
          ) : (
            <pre className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {data.finalMarkdown}
            </pre>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-8 pb-4 space-x-4">
         <button onClick={onBack} className="text-gray-400 hover:text-gray-600 text-sm">
           &lt; 上一步修改
         </button>
         <button onClick={handleGenerate} className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1">
           <RotateCw size={14} /> 重新寫一份
         </button>
      </div>
    </div>
  );
};
