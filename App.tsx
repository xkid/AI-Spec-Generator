import React, { useState, useEffect } from 'react';
import { AppState, AppStep, INITIAL_STATE } from './types';
import { StepIndicator } from './components/StepIndicator';
import { Step1Idea } from './components/Step1Idea';
import { Step2Flow } from './components/Step2Flow';
import { Step3Features } from './components/Step3Features';
import { Step4Data } from './components/Step4Data';
import { Step5Style } from './components/Step5Style';
import { Step6Result } from './components/Step6Result';
import { Bot, Code2, Key, X } from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.Idea);
  const [data, setData] = useState<AppState>(INITIAL_STATE);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const saveApiKey = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    setShowApiKeyModal(false);
  };

  const updateData = (updates: Partial<AppState>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, AppStep.Result));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, AppStep.Idea));

  const renderStep = () => {
    switch (currentStep) {
      case AppStep.Idea:
        return <Step1Idea data={data} updateData={updateData} onNext={nextStep} />;
      case AppStep.Flow:
        return <Step2Flow data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
      case AppStep.Features:
        return <Step3Features data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
      case AppStep.Data:
        return <Step4Data data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
      case AppStep.Style:
        return <Step5Style data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
      case AppStep.Result:
        return <Step6Result data={data} updateData={updateData} onBack={prevStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 font-sans selection:bg-blue-200">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-sm">
              <Code2 size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-none tracking-tight text-gray-900">AI 規格產生器</h1>
              <p className="text-xs text-blue-500 font-medium mt-0.5">讓 Gemini 幫你想得更周全</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
                onClick={() => setShowApiKeyModal(true)}
                className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 hover:bg-gray-100 transition"
            >
                <Key size={14} className={apiKey ? "text-green-500" : "text-gray-400"} />
                <span className="text-xs font-mono text-gray-500">{apiKey ? 'API Key 已設定' : '設定 API Key'}</span>
            </button>
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <Bot size={16} className="text-blue-600" />
                <span className="text-xs font-mono text-gray-500">v3.3 Gemini</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 pb-20">
        <StepIndicator currentStep={currentStep} />
        
        {/* Step Title Indicator (Big Text Top Left in screenshots) */}
        <div className="hidden lg:block absolute top-24 left-10 opacity-10">
           <span className="text-9xl font-black font-mono">階段{currentStep}</span>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl border-2 border-dashed border-blue-300 relative z-10">
           <div className="bg-white/50 rounded-[20px] p-6 md:p-10">
             {renderStep()}
           </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-xs">
        <p>Made by <span className="text-blue-500 font-bold">Vibe Coding</span> | Powered by Google Gemini</p>
        <p className="mt-1 opacity-60">請尊重著作權，您可自由分享與延伸修改請徵詢同意，並需標註作者、不得商業盈利。</p>
      </footer>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Key size={20} className="text-blue-500"/> 設定 API Key
                    </h3>
                    <button onClick={() => setShowApiKeyModal(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                    本應用程式使用 Google Gemini API。請輸入您的 API Key 以啟用 AI 功能。
                    您的 Key 僅會儲存在瀏覽器中，不會傳送至其他伺服器。
                </p>
                <input 
                    type="password" 
                    placeholder="貼上您的 Gemini API Key"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm mb-4"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={() => setShowApiKeyModal(false)}
                        className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                    >
                        取消
                    </button>
                    <button 
                        onClick={saveApiKey}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        儲存設定
                    </button>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-center text-gray-400">
                    還沒有 Key？ <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">前往 Google AI Studio 取得</a>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;
