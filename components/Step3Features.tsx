import React, { useEffect, useState } from 'react';
import { AppState } from '../types';
import { generateFeatures } from '../services/geminiService';
import { Loader2, Plus, Trash2, CheckSquare, Sparkles } from 'lucide-react';

interface Props {
  data: AppState;
  updateData: (updates: Partial<AppState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3Features: React.FC<Props> = ({ data, updateData, onNext, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (data.mustHaveFeatures.length === 0 && !loading) {
      const fetchData = async () => {
        setLoading(true);
        const result = await generateFeatures(data);
        updateData({
          mustHaveFeatures: result.mustHave,
          niceToHaveFeatures: result.niceToHave
        });
        setLoading(false);
      };
      fetchData();
    }
  }, []);

  const addFeature = () => {
    if (newFeature.trim()) {
      updateData({ niceToHaveFeatures: [...data.niceToHaveFeatures, newFeature] });
      setNewFeature('');
    }
  };

  const removeFeature = (list: 'must' | 'nice', index: number) => {
    if (list === 'must') {
      const newList = [...data.mustHaveFeatures];
      newList.splice(index, 1);
      updateData({ mustHaveFeatures: newList });
    } else {
      const newList = [...data.niceToHaveFeatures];
      newList.splice(index, 1);
      updateData({ niceToHaveFeatures: newList });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">需要哪些功能？</h2>
        <p className="text-gray-500">分清楚「一定要有」跟「以後再說」</p>
      </div>

      {loading ? (
         <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-gray-500 font-medium">AI 正在拆解功能清單...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Must Have */}
          <div className="space-y-3">
             {data.mustHaveFeatures.map((feat, idx) => (
               <div key={`must-${idx}`} className="flex items-center gap-3 bg-blue-600 text-white p-4 rounded-xl shadow-md shadow-blue-200 transform hover:-translate-y-1 transition duration-200">
                 <div className="bg-white/20 p-1 rounded shrink-0">
                    <CheckSquare size={16} />
                 </div>
                 <span className="flex-1 font-medium text-sm text-left">一定要有</span>
                 <input 
                    className="flex-[4] bg-transparent border-b border-white/30 focus:border-white outline-none"
                    value={feat}
                    onChange={(e) => {
                      const newList = [...data.mustHaveFeatures];
                      newList[idx] = e.target.value;
                      updateData({ mustHaveFeatures: newList });
                    }}
                 />
                 <button onClick={() => removeFeature('must', idx)} className="text-white/70 hover:text-white">
                   <Trash2 size={18} />
                 </button>
               </div>
             ))}
          </div>

          {/* Nice to Have */}
          <div className="space-y-3">
             {data.niceToHaveFeatures.map((feat, idx) => (
               <div key={`nice-${idx}`} className="flex items-center gap-3 bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200">
                 <div className="bg-gray-100 text-gray-500 p-1 rounded shrink-0">
                    <Sparkles size={16} />
                 </div>
                 <span className="flex-1 font-medium text-sm text-gray-500 text-left">有的話更好</span>
                 <input 
                    className="flex-[4] bg-transparent border-b border-gray-200 focus:border-blue-500 outline-none text-gray-700"
                    value={feat}
                    onChange={(e) => {
                      const newList = [...data.niceToHaveFeatures];
                      newList[idx] = e.target.value;
                      updateData({ niceToHaveFeatures: newList });
                    }}
                 />
                 <button onClick={() => removeFeature('nice', idx)} className="text-gray-400 hover:text-red-500">
                   <Trash2 size={18} />
                 </button>
               </div>
             ))}
          </div>
          
          {/* Add New */}
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="+ 新增一個功能" 
              className="w-full p-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-center focus:ring-2 focus:ring-blue-500 outline-none"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addFeature()}
            />
            <button onClick={addFeature} className="bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-xl px-4">
              <Plus />
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 font-medium px-4">
          &lt; 上一步
        </button>
        <button
          onClick={onNext}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
        >
          下一步 (資料定義)
        </button>
      </div>
    </div>
  );
};
