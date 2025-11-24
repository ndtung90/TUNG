import React, { useState, useRef } from 'react';
import { DailyMenu, MealDetail } from '../types';
import { ChefHat, Lightbulb, Flame, Droplet, Wheat, Beef, RefreshCw, X, Check, Leaf, Utensils, Clock, CheckCircle2, Heart, Zap, Download, RotateCcw, Images } from 'lucide-react';
import { getDishAlternatives } from '../services/geminiService';
import html2canvas from 'html2canvas';

interface MenuDisplayProps {
  menu: DailyMenu | null;
  onUpdateMeal: (mealKey: keyof DailyMenu, newMeal: MealDetail) => void;
  dietPreference: any;
  onReset: () => void;
}

// Internal Modal Component for Swapping
const SwapModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  mealKey: keyof DailyMenu;
  currentMeal: MealDetail;
  dietPreference: any;
  onSelect: (newMeal: MealDetail) => void;
  mealTitle: string;
}> = ({ isOpen, onClose, mealKey, currentMeal, dietPreference, onSelect, mealTitle }) => {
  const [loading, setLoading] = useState(true);
  const [alternatives, setAlternatives] = useState<MealDetail[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getDishAlternatives(mealTitle, currentMeal.mainDishName, currentMeal.totalCalories, dietPreference)
        .then((alts) => {
          setAlternatives(alts);
        })
        .catch((err) => {
          console.error(err);
          onClose();
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, currentMeal, mealTitle, dietPreference]); 

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h3 className="font-bold text-xl text-slate-800">Đổi món</h3>
            <p className="text-xs text-slate-500 font-medium">{mealTitle} • {Math.round(currentMeal.totalCalories)} kcal</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow bg-slate-50/50 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-5">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-indigo-100 rounded-full"></div>
                <div className="w-12 h-12 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
              </div>
              <div className="text-center">
                <p className="text-slate-800 font-bold text-lg">Đang tham khảo ý kiến AI...</p>
                <p className="text-sm text-slate-500">Tìm kiếm nguyên liệu thay thế phù hợp macro</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {alternatives.map((alt, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all cursor-pointer group relative overflow-hidden"
                  onClick={() => {
                    onSelect(alt);
                    onClose();
                  }}
                >
                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-wider">
                                Option {idx + 1}
                            </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-lg">{alt.mainDishName}</h4>
                    </div>
                    <div className="text-right">
                        <span className="block font-black text-slate-900 text-xl">{Math.round(alt.totalCalories)}</span>
                        <span className="text-xs text-slate-400 font-medium uppercase">kcal</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-slate-600 mb-4 line-clamp-2 bg-slate-50 p-3 rounded-xl border border-slate-100 relative z-10">
                    <Utensils className="w-3 h-3 inline mr-2 text-slate-400" />
                    {alt.items.map(i => i.name).join(', ')}
                  </div>

                  <div className="grid grid-cols-3 gap-3 relative z-10">
                    <MacroBadge label="Đạm" value={alt.totalProtein} color="red" />
                    <MacroBadge label="Carb" value={alt.totalCarbs} color="yellow" />
                    <MacroBadge label="Béo" value={alt.totalFat} color="blue" />
                  </div>

                  {/* Hover Selection Overlay */}
                  <div className="absolute inset-0 bg-indigo-50/80 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                      <div className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-xl font-bold flex items-center transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <Check className="w-5 h-5 mr-2" /> Chọn món này
                      </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-white border-t border-slate-100 text-xs text-slate-400 text-center">
           AI Nutrition Engine • RNI Standards
        </div>
      </div>
    </div>
  );
};

const MacroBadge = ({ label, value, color }: { label: string, value: number, color: 'red' | 'yellow' | 'blue' }) => {
    const styles = {
        red: 'bg-rose-50 text-rose-700 border-rose-100',
        yellow: 'bg-amber-50 text-amber-700 border-amber-100',
        blue: 'bg-blue-50 text-blue-700 border-blue-100'
    }[color];

    return (
        <div className={`rounded-xl p-2 border flex flex-col items-center justify-center ${styles}`}>
            <span className="text-[10px] font-bold uppercase opacity-70">{label}</span>
            <span className="font-bold text-sm">{Math.round(value)}g</span>
        </div>
    )
}

const MealCard: React.FC<{ 
  title: string; 
  mealKey: keyof DailyMenu;
  meal: MealDetail; 
  colorTheme: 'orange' | 'blue' | 'green' | 'purple' | 'slate';
  onOpenSwap: (key: keyof DailyMenu, meal: MealDetail, title: string) => void;
}> = ({ title, mealKey, meal, colorTheme, onOpenSwap }) => {

  const theme = {
    orange: 'from-orange-500 to-red-500 shadow-orange-500/20',
    blue: 'from-blue-500 to-indigo-500 shadow-blue-500/20',
    green: 'from-emerald-500 to-teal-500 shadow-emerald-500/20',
    purple: 'from-violet-500 to-purple-500 shadow-purple-500/20',
    slate: 'from-slate-500 to-gray-500 shadow-slate-500/20',
  }[colorTheme];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full relative hover:shadow-xl transition-shadow duration-300 group">
      {/* Header with Gradient */}
      <div className={`p-5 bg-gradient-to-r ${theme} text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div>
             <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-black/20 px-2 py-0.5 rounded text-white/90">{title}</span>
             </div>
             <h3 className="font-bold text-xl leading-snug pr-2 drop-shadow-sm">{meal.mainDishName}</h3>
          </div>
          <div className="text-center bg-white/20 backdrop-blur-md rounded-xl px-2 py-1.5 min-w-[60px] border border-white/20">
             <span className="block text-xl font-black leading-none">{Math.round(meal.totalCalories)}</span>
             <span className="text-[9px] font-bold uppercase opacity-90">kcal</span>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="p-5 flex-grow">
         <div className="mb-4">
            <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-50">
                    {meal.items.map((item, idx) => (
                    <tr key={idx} className="group/item">
                        <td className="py-2 pl-0 pr-2 align-top">
                            <div className="font-semibold text-slate-700 group-hover/item:text-indigo-600 transition-colors">
                                {item.name}
                            </div>
                             <div className="flex gap-2 text-[10px] text-slate-400 mt-0.5 font-medium">
                                <span>P: {Math.round(item.protein)}</span>
                                <span className="w-px bg-slate-200 h-3"></span>
                                <span>C: {Math.round(item.carbs)}</span>
                                <span className="w-px bg-slate-200 h-3"></span>
                                <span>F: {Math.round(item.fat)}</span>
                            </div>
                        </td>
                        <td className="py-2 px-2 text-slate-500 text-xs font-medium text-right align-top whitespace-nowrap">
                            {item.quantity}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
         </div>

        {/* Micronutrients Section */}
        {meal.micronutrients && meal.micronutrients.length > 0 && (
            <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/50 mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wide">Vi chất (Micros)</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {meal.micronutrients.slice(0, 3).map((micro, idx) => (
                        <span key={idx} className="text-[10px] bg-white text-emerald-700 px-2 py-1 rounded-md border border-emerald-100 font-semibold shadow-sm">
                            {micro}
                        </span>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Actions & Macros Footer */}
      <div className="mt-auto">
          {/* Macro Bar */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 bg-slate-50/80">
             <div className="py-3 text-center">
                 <span className="block text-[10px] text-slate-400 font-bold uppercase">Đạm</span>
                 <span className="text-sm font-bold text-slate-700">{Math.round(meal.totalProtein)}g</span>
             </div>
             <div className="py-3 text-center">
                 <span className="block text-[10px] text-slate-400 font-bold uppercase">Carb</span>
                 <span className="text-sm font-bold text-slate-700">{Math.round(meal.totalCarbs)}g</span>
             </div>
             <div className="py-3 text-center">
                 <span className="block text-[10px] text-slate-400 font-bold uppercase">Béo</span>
                 <span className="text-sm font-bold text-slate-700">{Math.round(meal.totalFat)}g</span>
             </div>
          </div>
          
          {/* Swap Action */}
          <button 
            onClick={() => onOpenSwap(mealKey, meal, title)}
            className="w-full py-3 bg-white hover:bg-slate-50 text-slate-500 hover:text-indigo-600 font-semibold text-xs uppercase tracking-wider border-t border-slate-100 transition-colors flex items-center justify-center gap-2 group/btn"
          >
              <RefreshCw className="w-3.5 h-3.5 group-hover/btn:rotate-180 transition-transform duration-500" />
              Đổi món khác
          </button>
      </div>
    </div>
  );
};

const MenuDisplay: React.FC<MenuDisplayProps> = ({ menu, onUpdateMeal, dietPreference, onReset }) => {
  const [swapState, setSwapState] = useState<{
    isOpen: boolean;
    mealKey: keyof DailyMenu | null;
    currentMeal: MealDetail | null;
    mealTitle: string;
  }>({
    isOpen: false,
    mealKey: null,
    currentMeal: null,
    mealTitle: ''
  });
  const [isExporting, setIsExporting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleOpenSwap = (key: keyof DailyMenu, meal: MealDetail, title: string) => {
    setSwapState({
      isOpen: true,
      mealKey: key,
      currentMeal: meal,
      mealTitle: title
    });
  };

  const handleCloseSwap = () => {
    setSwapState(prev => ({ ...prev, isOpen: false }));
  };

  const handleSelectNewMeal = (newMeal: MealDetail) => {
    if (swapState.mealKey) {
      onUpdateMeal(swapState.mealKey, newMeal);
    }
  };

  const captureAndDownload = async (element: HTMLElement, filename: string) => {
    // Clone to a hidden container to enforce layout
    const clone = element.cloneNode(true) as HTMLElement;
    
    Object.assign(clone.style, {
        position: 'fixed',
        top: '-10000px',
        left: '-10000px',
        width: '2000px', // Fixed width for consistency
        height: 'auto',
        zIndex: '-1000',
        backgroundColor: '#f8fafc',
        padding: '50px'
    });

    // Force the Meal Grid to 5 columns if it exists in this section
    const gridContainer = clone.querySelector('.grid.gap-6'); 
    if (gridContainer) {
        (gridContainer as HTMLElement).style.gridTemplateColumns = 'repeat(5, 1fr)';
        (gridContainer as HTMLElement).style.gap = '24px';
    }

    // Clean up buttons
    const buttonsContainer = clone.querySelector('[data-html2canvas-ignore]');
    if(buttonsContainer) buttonsContainer.remove();

    document.body.appendChild(clone);
    await document.fonts.ready;

    const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: '#f8fafc',
        windowWidth: 2000,
        useCORS: true,
        logging: false
    });

    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = filename;
    link.click();

    document.body.removeChild(clone);
  };

  const handleExportImage = async () => {
    if (!printRef.current) return;
    setIsExporting(true);

    try {
      // SECTION 1: MENU (Header + Meals)
      const menuPart = printRef.current.querySelector('#menu-section') as HTMLElement;
      if (menuPart) {
          await captureAndDownload(menuPart, `ThucDon_Phan1_MonAn_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.png`);
      }

      // Small delay to ensure browser handles downloads efficiently
      await new Promise(resolve => setTimeout(resolve, 500));

      // SECTION 2: ADVICE (Expert Advice)
      const advicePart = printRef.current.querySelector('#advice-section') as HTMLElement;
      if (advicePart) {
          await captureAndDownload(advicePart, `ThucDon_Phan2_LoiKhuyen_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.png`);
      }

    } catch (error) {
      console.error('Failed to export image:', error);
      alert("Có lỗi khi xuất ảnh. Vui lòng thử lại.");
    } finally {
      setIsExporting(false);
    }
  };

  if (!menu) return null;

  return (
    <div className="mt-16 animate-in slide-in-from-bottom-8 duration-500">
      <SwapModal 
        isOpen={swapState.isOpen}
        onClose={handleCloseSwap}
        mealKey={swapState.mealKey as keyof DailyMenu}
        currentMeal={swapState.currentMeal!}
        dietPreference={dietPreference}
        onSelect={handleSelectNewMeal}
        mealTitle={swapState.mealTitle}
      />

      {/* Main Wrapper */}
      <div ref={printRef} className="p-0 md:p-0">
        
        {/* SECTION 1: MEAL PLAN */}
        <div id="menu-section" className="bg-slate-50/80 p-8 rounded-3xl mb-8 border border-slate-100">
             <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                        <span className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                            <ChefHat className="w-8 h-8" />
                        </span>
                        Thực đơn 
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium">Thiết kế riêng cho mục tiêu & chỉ số sinh học của bạn</p>
                </div>

                <div className="bg-white/80 backdrop-blur shadow-lg shadow-indigo-500/5 rounded-2xl p-4 border border-white flex items-center gap-6">
                    <div className="text-center min-w-[80px]">
                        <span className="text-xs text-slate-400 font-bold uppercase">Total Cal</span>
                        <div className="text-2xl font-black text-indigo-600">{Math.round(menu.totalDailyCalories)}</div>
                    </div>
                    <div className="h-10 w-px bg-slate-100"></div>
                    <div className="flex gap-4">
                        <div className="text-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Protein</span>
                            <div className="text-lg font-bold text-slate-700">{Math.round(menu.totalDailyProtein)}g</div>
                        </div>
                        <div className="text-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Carbs</span>
                            <div className="text-lg font-bold text-slate-700">{Math.round(menu.totalDailyCarbs)}g</div>
                        </div>
                        <div className="text-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Fat</span>
                            <div className="text-lg font-bold text-slate-700">{Math.round(menu.totalDailyFat)}g</div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Meal Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 lg:gap-8">
                <MealCard title="Bữa Sáng" mealKey="breakfast" meal={menu.breakfast} colorTheme="orange" onOpenSwap={handleOpenSwap} />
                <MealCard title="Phụ Sáng" mealKey="morningSnack" meal={menu.morningSnack} colorTheme="slate" onOpenSwap={handleOpenSwap} />
                <MealCard title="Bữa Trưa" mealKey="lunch" meal={menu.lunch} colorTheme="blue" onOpenSwap={handleOpenSwap} />
                <MealCard title="Phụ Chiều" mealKey="afternoonSnack" meal={menu.afternoonSnack} colorTheme="slate" onOpenSwap={handleOpenSwap} />
                <MealCard title="Bữa Tối" mealKey="dinner" meal={menu.dinner} colorTheme="green" onOpenSwap={handleOpenSwap} />
            </div>
        </div>

        {/* SECTION 2: EXPERT ADVICE */}
        <div id="advice-section" className="relative bg-white rounded-3xl shadow-lg shadow-amber-500/5 border border-amber-100 overflow-hidden mb-8">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>
            <div className="absolute -right-20 top-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
            
            <div className="p-8 relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-amber-100 p-2.5 rounded-xl text-amber-600">
                        <Lightbulb className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900">Lời khuyên từ chuyên gia</h3>
                        <p className="text-sm text-slate-500 font-medium">Chiến lược dinh dưỡng & Lối sống</p>
                    </div>
                </div>

                {/* 1. Summary Quote */}
                <div className="mb-8 bg-amber-50/50 p-5 rounded-2xl border border-amber-100">
                    <p className="text-slate-700 leading-relaxed font-medium italic text-center">
                        "{menu.advice.summary}"
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* 2. Left Column: Schedule Table */}
                    <div className="lg:col-span-5">
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" /> Lịch trình gợi ý
                        </h4>
                        <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-slate-100">
                                    {menu.advice.diningSchedule.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-white transition-colors">
                                            <td className="py-3 px-4 font-bold text-indigo-600 whitespace-nowrap w-1/3">{item.time}</td>
                                            <td className="py-3 px-4 text-slate-600 font-medium">{item.activity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 3. Right Column: Tips & Micros */}
                    <div className="lg:col-span-7 space-y-6">
                        
                        {/* Health Tips Grid */}
                        <div>
                            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <Heart className="w-4 h-4 text-rose-500" /> Ghi chú sức khỏe
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {menu.advice.healthTips.map((tip, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors flex gap-3 items-start">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <p className="text-sm text-slate-600 leading-snug">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Micronutrients Focus */}
                        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 flex gap-4 items-start">
                            <div className="bg-white p-2 rounded-full shadow-sm text-emerald-600 shrink-0">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <h5 className="font-bold text-emerald-800 mb-1 text-sm uppercase">Tiêu điểm Vi chất</h5>
                                <p className="text-sm text-emerald-700 leading-relaxed">
                                    {menu.advice.micronutrientFocus}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
                
                {/* NEW ACTION BUTTONS with data-html2canvas-ignore to hide during export */}
                <div className="mt-10 pt-6 border-t border-amber-100 flex flex-col sm:flex-row items-center justify-center gap-4" data-html2canvas-ignore>
                    <button 
                        onClick={handleExportImage}
                        disabled={isExporting}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-70"
                    >
                        {isExporting ? <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div> : <Images className="w-4 h-4" />}
                        {isExporting ? 'Đang xử lý...' : 'Lưu ảnh Thực đơn & Lời khuyên'}
                    </button>
                    
                    <button 
                        onClick={onReset}
                        className="flex items-center gap-2 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 px-6 py-3 rounded-xl font-semibold border border-slate-200 hover:border-rose-200 transition-all active:scale-95"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset & Nhập lại
                    </button>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};

export default MenuDisplay;