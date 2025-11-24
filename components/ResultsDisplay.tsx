
import React from 'react';
import { TDEEResult } from '../types';
import { Flame, Target, Battery, Activity, Info, CheckCircle2, AlertTriangle, BookOpen, Sparkles } from 'lucide-react';

interface ResultsDisplayProps {
  result: TDEEResult;
  onGetMenu: () => void;
  loadingMenu: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onGetMenu, loadingMenu }) => {
  const analysis = result.healthAnalysis;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-8 border border-white/50 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4">
       <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Kết quả phân tích
        </h2>
        <div className="bg-green-50 text-green-600 text-xs font-bold px-3 py-1 rounded-full border border-green-100">
            Ready to Plan
        </div>
       </div>

      <div className="flex-grow space-y-4">
        {/* Main Target Card - Bento Large */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-center relative overflow-hidden shadow-lg group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                <Target className="w-40 h-40 text-white" />
            </div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20"></div>

            <p className="text-slate-300 font-medium mb-2 uppercase tracking-widest text-xs">Target Calories</p>
            <div className="flex items-baseline justify-center text-white">
                <span className="text-6xl font-black tracking-tighter">{Math.round(result.targetCalories)}</span>
                <span className="text-lg font-medium ml-2 text-slate-400">kcal/day</span>
            </div>
            
            <div className="mt-4 inline-flex items-center bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                <span className="text-xs text-slate-200">Đã tối ưu cho mục tiêu của bạn</span>
            </div>
        </div>

        {/* Metrics Grid - Bento Small */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                        <Battery className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Resting</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">{Math.round(result.bmr)}</div>
                <p className="text-xs text-slate-500">Năng lượng nền (BMR)</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                        <Flame className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Total Burn</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">{Math.round(result.tdee)}</div>
                <p className="text-xs text-slate-500">Tổng tiêu hao (TDEE)</p>
            </div>
        </div>

        {/* Health Analysis Section */}
        {analysis && (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="flex items-center mb-4">
                    <Activity className="w-4 h-4 text-blue-500 mr-2" />
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Sức khỏe (Chuẩn Á Đông)</h3>
                </div>
                
                <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100">
                        <span className="text-sm text-slate-600 font-medium">BMI</span>
                        <div className="flex items-center">
                             <span className="font-bold text-slate-900 mr-2">{analysis.bmi.toFixed(1)}</span>
                             <span className={`text-[10px] px-2 py-1 rounded-md font-bold ${
                                analysis.bmiClassification === 'Bình thường' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                                {analysis.bmiClassification}
                            </span>
                        </div>
                    </div>

                    {analysis.whr && (
                        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100">
                            <span className="text-sm text-slate-600 font-medium">WHR (Eo/Hông)</span>
                            <div className="flex items-center">
                                <span className="font-bold text-slate-900 mr-2">{analysis.whr.toFixed(2)}</span>
                                <span className={`text-[10px] px-2 py-1 rounded-md font-bold ${
                                    analysis.whrRisk === 'Bình thường' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-rose-100 text-rose-700'
                                }`}>
                                    {analysis.whrRisk}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Scientific Validation Checklist */}
        {result.validation && result.validation.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                 <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Kiểm tra & Căn cứ khoa học</h3>
                 </div>
                 <div className="divide-y divide-slate-50">
                    {result.validation.map((item, idx) => (
                        <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-start gap-3">
                                <div className={`mt-0.5 flex-shrink-0 ${
                                    item.status === 'pass' ? 'text-green-500' : 
                                    item.status === 'warning' ? 'text-amber-500' : 'text-blue-500'
                                }`}>
                                    {item.status === 'pass' ? <CheckCircle2 className="w-4 h-4" /> : 
                                     item.status === 'warning' ? <AlertTriangle className="w-4 h-4" /> : 
                                     <Info className="w-4 h-4" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-bold text-slate-800">{item.criteria}</span>
                                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200 font-medium">
                                            {item.scientificBasis}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed">{item.detail}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        )}

      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <button 
            onClick={onGetMenu}
            disabled={loadingMenu}
            className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-[2px] focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
        >
            <div className="relative flex items-center justify-center rounded-[10px] bg-transparent px-6 py-3.5 transition-all group-hover:bg-white/10">
                 {loadingMenu ? (
                    <div className="flex items-center space-x-2 text-white">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="font-bold">AI đang thiết kế...</span>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2 text-white">
                        <BookOpen className="w-5 h-5 text-yellow-300" />
                        <span className="font-bold text-lg">Lập thực đơn 5 bữa</span>
                    </div>
                )}
            </div>
        </button>
        <p className="text-[10px] text-center text-slate-400 mt-3 font-medium">
            *Sử dụng công nghệ AI & Dữ liệu Viện Dinh Dưỡng Quốc Gia
        </p>
      </div>
    </div>
  );
};

export default ResultsDisplay;
