import React, { useEffect, useState } from 'react';
import { AppState } from '../types';
import { generateDataRequirements } from '../services/geminiService';
import { Loader2, Database, Save, HardDrive, Cloud, Table } from 'lucide-react';

interface Props {
  data: AppState;
  updateData: (updates: Partial<AppState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step4Data: React.FC<Props> = ({ data, updateData, onNext, onBack }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data.dataRequirements && !loading) {
      const fetchData = async () => {
        setLoading(true);
        const result = await generateDataRequirements(data);
        if (result.includes("檢查 API Key")) {
            // If error indicates API key issue, we might want to let user edit manually or just show it
            updateData({ dataRequirements: result });
        } else {
            updateData({ dataRequirements: result });
        }
        setLoading(false);
      };
      fetchData();
    }
  }, []);

  const storageOptions = [
    { id: 'none', label: '不用儲存', desc: '重新整理網頁資料就不見 (適合計算機)', icon: Save },
    { id: 'local', label: '暫存在這台電腦', desc: '換電腦資料就沒了 (適合記帳、備忘錄)', icon: HardDrive },
    { id: 'sheets', label: 'Google 試算表', desc: '連動 Google Sheets (適合表單、統計)', icon: Table },
    { id: 'cloud', label: '雲端資料庫', desc: '可以跨裝置登入 (適合完整 App)', icon: Cloud },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">資料要怎麼記？</h2>
        <p className="text-gray-500">關於資料的內容與儲存方式</p>
      </div>

      <div className="space-y-6">
        {/* Data Types */}
        <div className="bg-blue-50/50 p-6 rounded-2xl shadow-sm border border-blue-100">
          <div className="flex items-center gap-2 mb-4 text-blue-600">
            <Database size={20} />
            <h3 className="font-bold">有哪些資料要記錄？</h3>
          </div>
          {loading ? (
             <div className="flex items-center gap-2 text-gray-400 py-4">
                <Loader2 className="animate-spin" size={16} /> AI 正在分析資料結構...
             </div>
          ) : (
            <textarea
              className="w-full min-h-[120px] p-4 bg-white rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700"
              placeholder="例如：交易金額、日期、類別..."
              value={data.dataRequirements}
              onChange={(e) => updateData({ dataRequirements: e.target.value })}
            />
          )}
        </div>

        {/* Constraints */}
        <div>
            <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-blue-300 relative">
            <h3 className="font-bold text-gray-700 mb-3">有沒有什麼限制？ (防呆規則)</h3>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-600">
                    金額欄位必須為有效數字且大於零；備註長度限制為 200 字；類別名稱不可為空。
                </p>
            </div>
            </div>
            <div className="text-blue-400 text-sm mt-2 font-medium">不能修改</div>
        </div>

        {/* Storage Location */}
        <div>
          <h3 className="font-bold text-gray-700 mb-4 pl-1">資料要存在哪裡？</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storageOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateData({ storageType: opt.id as any })}
                className={`p-4 rounded-xl border-2 text-left transition relative overflow-hidden group
                  ${data.storageType === opt.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-100 bg-white hover:border-blue-200'}`}
              >
                <div className="flex items-start gap-3 relative z-10">
                  <div className={`p-2 rounded-lg ${data.storageType === opt.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-500'}`}>
                    <opt.icon size={20} />
                  </div>
                  <div>
                    <div className={`font-bold ${data.storageType === opt.id ? 'text-blue-700' : 'text-gray-800'}`}>{opt.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{opt.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 font-medium px-4">
          &lt; 上一步
        </button>
        <button
          onClick={onNext}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
        >
          下一步 (風格設定)
        </button>
      </div>
    </div>
  );
};
