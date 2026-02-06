import React from 'react';
import { AppState } from '../types';
import { Smartphone, Monitor, CheckSquare, Sparkles } from 'lucide-react';

interface Props {
  data: AppState;
  updateData: (updates: Partial<AppState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step5Style: React.FC<Props> = ({ data, updateData, onNext, onBack }) => {

  const styles = [
    { id: 'modern', label: '現代簡約', sub: 'Apple 風格', color: 'border-blue-500' },
    { id: 'professional', label: '專業商務', sub: '藍灰信任感', color: 'border-slate-500' },
    { id: 'playful', label: '活潑遊戲', sub: '高飽和色彩', color: 'border-yellow-500' },
    { id: 'cozy', label: '溫馨療癒', sub: '柔和色調', color: 'border-orange-300' },
    { id: 'cyberpunk', label: '賽博龐克', sub: '霓虹暗黑', color: 'border-purple-500' },
    { id: 'retro', label: '復古像素', sub: '8-bit 懷舊', color: 'border-green-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">看起來的感覺？</h2>
        <p className="text-gray-500">決定產品的第一印象</p>
      </div>

      {/* Visual Style Grid */}
      <div>
        <h3 className="text-sm font-bold text-gray-600 mb-3">視覺風格</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => updateData({ visualStyle: style.id })}
              className={`p-4 rounded-xl border-2 text-left transition hover:shadow-md
                ${data.visualStyle === style.id 
                  ? `${style.color} bg-white shadow-md ring-1 ring-offset-2 ring-blue-100` 
                  : 'border-gray-100 bg-white hover:border-gray-300'}`}
            >
              <div className="font-bold text-gray-800">{style.label}</div>
              <div className="text-xs text-gray-400 mt-1">{style.sub}</div>
            </button>
          ))}
          
          <button
              onClick={() => updateData({ visualStyle: 'custom' })}
              className={`p-4 rounded-xl border-2 text-left transition border-dashed
                ${data.visualStyle === 'custom' 
                  ? 'border-gray-400 bg-gray-50' 
                  : 'border-gray-200 bg-transparent hover:bg-gray-50'}`}
            >
              <div className="font-bold text-gray-600">我要自訂</div>
              <div className="text-xs text-gray-400 mt-1">自己描述</div>
          </button>
        </div>
      </div>

      {/* Tone */}
      <div>
         <h3 className="text-sm font-bold text-gray-600 mb-3">文案語氣</h3>
         <select 
          className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          value={data.tone}
          onChange={(e) => updateData({ tone: e.target.value })}
         >
           <option value="friendly">親切友善</option>
           <option value="professional">冷靜專業</option>
           <option value="humorous">幽默風趣</option>
           <option value="minimal">極簡省話</option>
         </select>
      </div>

      {/* Device */}
      <div>
        <h3 className="text-sm font-bold text-gray-600 mb-3">主要用什麼裝置看？</h3>
        <div className="flex gap-4">
           <button 
             onClick={() => updateData({ devices: data.devices.includes('mobile') ? data.devices.filter(d=>d!=='mobile') : [...data.devices, 'mobile'] })}
             className={`flex-1 p-4 rounded-xl border flex items-center justify-center gap-2 transition
              ${data.devices.includes('mobile') ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-gray-200 bg-white'}`}
           >
             <Smartphone size={20} /> 手機
           </button>
           <button 
             onClick={() => updateData({ devices: data.devices.includes('desktop') ? data.devices.filter(d=>d!=='desktop') : [...data.devices, 'desktop'] })}
             className={`flex-1 p-4 rounded-xl border flex items-center justify-center gap-2 transition
              ${data.devices.includes('desktop') ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-gray-200 bg-white'}`}
           >
             <Monitor size={20} /> 電腦 (預設)
           </button>
        </div>
      </div>

      {/* Quality Check */}
      <div>
        <h3 className="text-sm font-bold text-gray-600 mb-3">品質要求 (進階)</h3>
        <div className="space-y-2">
           <label className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50">
             <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
             <div className="text-sm">
               <div className="font-bold text-gray-700">嚴格防止亂輸入</div>
               <div className="text-gray-400 text-xs">檢查格式是否正確，防止惡意攻擊</div>
             </div>
           </label>
           <label className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl cursor-pointer">
             <div className="bg-blue-500 text-white rounded p-0.5"><CheckSquare size={14} /></div>
             <div className="text-sm">
               <div className="font-bold text-blue-800">友善的錯誤提示</div>
               <div className="text-blue-600/70 text-xs">出錯時顯示好看的提示框，不要只彈出醜醜的警告</div>
             </div>
           </label>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 font-medium px-4">
          &lt; 上一步
        </button>
        <button
          onClick={onNext}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition flex items-center gap-2"
        >
          生成規格書 <Sparkles size={18} />
        </button>
      </div>
    </div>
  );
};