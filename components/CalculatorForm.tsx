
import React, { useState } from 'react';
import { ActivityLevel, Gender, Goal, UserStats, DietPreference } from '../types';
import { ACTIVITY_LABELS, GOAL_LABELS, DIET_LABELS } from '../constants';
import { ChevronDown, ChevronUp, HeartPulse, Moon, Cigarette, User2, Ruler, Weight, Zap, UserCheck, Search } from 'lucide-react';

interface CalculatorFormProps {
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  onCalculate: () => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ stats, setStats, onCalculate }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;

    if (type === 'number') {
      newValue = value === '' ? undefined : Number(value);
    } else if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    }

    setStats(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleGenderChange = (gender: Gender) => {
    setStats(prev => ({ ...prev, gender }));
  };

  const handleGoalChange = (goal: Goal) => {
      setStats(prev => ({ ...prev, goal }));
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-8 border border-white/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
            Hồ sơ thể chất
          </h2>
          <div className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full uppercase tracking-wide">
            Bước 1/3
          </div>
        </div>
       

        <div className="space-y-6">
          
          {/* Name Input */}
          <div className="group">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                 <UserCheck className="w-4 h-4 mr-2 text-indigo-500" /> Họ và Tên
              </label>
              <div className="relative transition-all duration-200 focus-within:transform focus-within:-translate-y-0.5">
                  <input
                      type="text"
                      name="name"
                      value={stats.name}
                      onChange={handleChange}
                      className="block w-full rounded-xl border-slate-200 bg-slate-50/50 p-3 text-base font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all outline-none placeholder-slate-300"
                      placeholder="Ví dụ: Nguyễn Văn A"
                  />
              </div>
          </div>

          {/* Gender Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Giới tính sinh học</label>
            <div className="grid grid-cols-2 gap-3">
              {[Gender.MALE, Gender.FEMALE].map((g) => (
                 <button
                  key={g}
                  type="button"
                  onClick={() => handleGenderChange(g)}
                  className={`relative group py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 font-semibold transition-all duration-200 ${
                    stats.gender === g
                      ? g === Gender.MALE 
                        ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-md shadow-blue-500/10' 
                        : 'border-pink-500 bg-pink-50/50 text-pink-700 shadow-md shadow-pink-500/10'
                      : 'border-slate-100 bg-white hover:border-slate-300 text-slate-500'
                  }`}
                >
                  <span className="text-xl">{g === Gender.MALE ? '👨' : '👩'}</span>
                  <span>{g}</span>
                  {stats.gender === g && (
                    <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${g === Gender.MALE ? 'bg-blue-500' : 'bg-pink-500'}`}></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="group">
                <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                   <User2 className="w-3 h-3 mr-1" /> Tuổi
                </label>
                <div className="relative">
                    <input
                        type="number"
                        name="age"
                        value={stats.age}
                        onChange={handleChange}
                        className="block w-full rounded-xl border-slate-200 bg-slate-50/50 p-3 text-base font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all outline-none"
                        placeholder="25"
                    />
                </div>
            </div>
            <div className="group">
                <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                   <Ruler className="w-3 h-3 mr-1" /> Cao (cm)
                </label>
                <div className="relative">
                    <input
                        type="number"
                        name="height"
                        value={stats.height}
                        onChange={handleChange}
                        className="block w-full rounded-xl border-slate-200 bg-slate-50/50 p-3 text-base font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all outline-none"
                        placeholder="170"
                    />
                </div>
            </div>
            <div className="group">
                <label className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                   <Weight className="w-3 h-3 mr-1" /> Nặng (kg)
                </label>
                <div className="relative">
                    <input
                        type="number"
                        name="weight"
                        value={stats.weight}
                        onChange={handleChange}
                        className="block w-full rounded-xl border-slate-200 bg-slate-50/50 p-3 text-base font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all outline-none"
                        placeholder="65"
                    />
                </div>
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                <Zap className="w-4 h-4 mr-2 text-amber-500 fill-amber-500" />
                Mức độ vận động
            </label>
            <div className="relative">
                <select
                    name="activity"
                    value={stats.activity}
                    onChange={handleChange}
                    className="appearance-none block w-full rounded-xl border-slate-200 bg-white p-3 pr-10 text-sm text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm"
                >
                    {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                        {label}
                    </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <ChevronDown className="h-4 w-4" />
                </div>
            </div>
          </div>
          
          <div className="h-px bg-slate-100 my-4"></div>

          {/* Primary Choices */}
          <div className="space-y-5">
              {/* Goal Selection */}
              <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">1. Mục tiêu chính</label>
                  <div className="grid grid-cols-1 gap-2">
                      {Object.entries(GOAL_LABELS).map(([key, label]) => {
                          const isActive = stats.goal === key;
                          const icon = key === Goal.LOSE_WEIGHT ? "📉" : key === Goal.GAIN_WEIGHT ? "💪" : "⚖️";
                          
                          return (
                              <button
                                  key={key}
                                  type="button"
                                  onClick={() => handleGoalChange(key as Goal)}
                                  className={`relative flex items-center px-4 py-3 rounded-xl border transition-all duration-200 ${
                                      isActive 
                                      ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 shadow-sm' 
                                      : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'
                                  }`}
                              >
                                  <span className="text-xl mr-3">{icon}</span>
                                  <span className={`font-bold text-sm ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>{label}</span>
                                  {isActive && <div className="absolute right-4 w-2 h-2 bg-indigo-500 rounded-full"></div>}
                              </button>
                          )
                      })}
                  </div>
              </div>

              {/* Diet Selection */}
              <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">2. Phong cách ăn uống</label>
                  <div className="relative">
                    <select
                        name="dietPreference"
                        value={stats.dietPreference}
                        onChange={handleChange}
                        className="appearance-none block w-full rounded-xl border-slate-200 bg-white p-3 pr-10 text-sm text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-sm"
                    >
                        {Object.entries(DIET_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>
                            {label}
                            </option>
                        ))}
                    </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
              </div>
          </div>

          {/* Advanced / Optional Inputs */}
          <div className="bg-slate-50/80 rounded-xl border border-slate-100 overflow-hidden">
              <button 
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full p-3 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-100/50 transition-colors"
              >
                  <span className="flex items-center">
                      <HeartPulse className="w-3.5 h-3.5 mr-2 text-rose-500" />
                      Chỉ số sức khỏe (Tùy chọn)
                  </span>
                  {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              
              {showAdvanced && (
                  <div className="p-4 border-t border-slate-100 grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                      <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Vòng eo (cm)</label>
                          <input 
                              type="number" 
                              name="waist" 
                              value={stats.waist || ''} 
                              onChange={handleChange}
                              className="block w-full rounded-lg border-slate-200 bg-white p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                      </div>
                      <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Vòng hông (cm)</label>
                          <input 
                              type="number" 
                              name="hip" 
                              value={stats.hip || ''} 
                              onChange={handleChange}
                              className="block w-full rounded-lg border-slate-200 bg-white p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                      </div>
                      <div className="col-span-2 flex items-center gap-4">
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-slate-500 mb-1 flex items-center">
                                <Moon className="w-3 h-3 mr-1" /> Giấc ngủ (giờ)
                            </label>
                            <input 
                                type="number" 
                                name="sleepHours" 
                                value={stats.sleepHours || ''} 
                                onChange={handleChange}
                                className="block w-full rounded-lg border-slate-200 bg-white p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                          <div className="flex items-center h-full pt-5">
                            <label className="flex items-center space-x-2 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        name="isSmoker" 
                                        checked={stats.isSmoker || false} 
                                        onChange={handleChange}
                                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-300 bg-white checked:border-rose-500 checked:bg-rose-500 transition-all"
                                    />
                                    <Cigarette className="absolute left-0 top-0 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none p-0.5" />
                                </div>
                                <span className="text-xs font-medium text-slate-700 group-hover:text-rose-600 transition-colors">
                                    Hút thuốc
                                </span>
                            </label>
                          </div>
                      </div>
                  </div>
              )}
          </div>

          <button
            onClick={onCalculate}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
             <Search className="w-5 h-5" />
             PHÂN TÍCH & LẬP THỰC ĐƠN
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorForm;
