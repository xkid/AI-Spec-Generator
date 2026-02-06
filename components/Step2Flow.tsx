import React, { useEffect, useState } from 'react';
import { AppState } from '../types';
import { generateUserFlow } from '../services/geminiService';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  data: AppState;
  updateData: (updates: Partial<AppState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2Flow: React.FC<Props> = ({ data, updateData, onNext, onBack }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auto-generate if empty
    if (!data.happyPath && !loading) {
      const fetchData = async () => {
        setLoading(true);
        const result = await generateUserFlow(data);
        updateData({
          happyPath: result.happyPath,
          exceptionHandling: result.exceptions
        });
        setLoading(false);
      };
      fetchData();
    }
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">使用者會怎麼操作？</h2>
        <p className="text-gray-500">順利的流程通常很容易想像，但意外往往才是關鍵</p>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-gray-500 font-medium">AI 正在規劃流程中...</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Happy Path */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-bl-lg">
               AI 已幫你寫好
             </div>
             <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="text-green-500" />
                <h3 className="font-bold text-gray-800">順利的流程 (Happy Path)</h3>
             </div>
             <textarea
                className="w-full min-h-[200px] p-4 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm leading-relaxed"
                value={data.happyPath}
                onChange={(e) => updateData({ happyPath: e.target.value })}
             />
          </div>

          {/* Exceptions */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
             <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="text-orange-500" />
                <h3 className="font-bold text-gray-800">如果發生這些狀況怎麼辦？ (意外處理)</h3>
             </div>
             <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100 whitespace-nowrap">網路突然斷線</span>
                <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100 whitespace-nowrap">必填資料沒填</span>
                <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100 whitespace-nowrap">重複點擊送出</span>
             </div>
             <textarea
                className="w-full min-h-[150px] p-4 bg-red-50/30 rounded-xl border border-red-100 focus:ring-2 focus:ring-red-200 outline-none text-sm leading-relaxed"
                value={data.exceptionHandling}
                onChange={(e) => updateData({ exceptionHandling: e.target.value })}
             />
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 font-medium px-4">
          &lt; 上一步
        </button>
        <button
          onClick={onNext}
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition"
        >
          下一步 (規劃功能)
        </button>
      </div>
    </div>
  );
};
