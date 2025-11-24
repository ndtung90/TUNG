import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import CalculatorForm from './components/CalculatorForm';
import ResultsDisplay from './components/ResultsDisplay';
import MenuDisplay from './components/MenuDisplay';
import GuideModal from './components/GuideModal';
import { UserStats, Gender, ActivityLevel, Goal, TDEEResult, DailyMenu, DietPreference, MealDetail, HealthAnalysis, ValidationItem } from './types';
import { ACTIVITY_MULTIPLIERS, GOAL_ADJUSTMENTS, GOAL_LABELS, ACTIVITY_LABELS, DIET_LABELS } from './constants';
import { generateVietnameseMenu } from './services/geminiService';

const DEFAULT_STATS: UserStats = {
  name: '',
  gender: Gender.MALE,
  age: 25,
  height: 170,
  weight: 65,
  activity: ActivityLevel.MODERATE,
  goal: Goal.MAINTAIN,
  dietPreference: DietPreference.BALANCED,
  isSmoker: false
};

const App: React.FC = () => {
  // Reset Key: Changing this forces React to destroy and recreate components, ensuring a "hard" reset of all internal states
  const [resetKey, setResetKey] = useState(0);
  
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [result, setResult] = useState<TDEEResult | null>(null);
  const [menu, setMenu] = useState<DailyMenu | null>(null);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  const resultsRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
      if(window.confirm("Bạn có chắc muốn xóa toàn bộ thông tin và làm lại từ đầu không?")) {
          // 1. Clear State
          setStats(DEFAULT_STATS);
          setResult(null);
          setMenu(null);
          
          // 2. Increment Key to Force Remount of Form
          setResetKey(prev => prev + 1);

          // 3. Scroll to top immediately
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 50);
      }
  }

  const analyzeHealth = (stats: UserStats): HealthAnalysis => {
      const heightM = stats.height / 100;
      const bmi = stats.weight / (heightM * heightM);
      
      // Asian BMI Classifications (IDI & WPRO)
      let bmiClass = "";
      if (bmi < 18.5) bmiClass = "Thiếu cân";
      else if (bmi < 23) bmiClass = "Bình thường";
      else if (bmi < 25) bmiClass = "Thừa cân";
      else bmiClass = "Béo phì";

      const notes: string[] = [];
      if (stats.isSmoker) notes.push("Hút thuốc làm tăng nhu cầu Vitamin C (ổi, cam, ớt chuông).");
      if (stats.sleepHours && stats.sleepHours < 6) notes.push("Thiếu ngủ gây tăng hormone Ghrelin (thèm ăn). Cần kiểm soát carb vào buổi tối.");

      let whr = undefined;
      let whrRisk = undefined;
      let metabolicRisk = "Thấp";

      if (stats.waist && stats.hip) {
          whr = stats.waist / stats.hip;
          const highRiskCutoff = stats.gender === Gender.MALE ? 0.9 : 0.8;
          
          if (whr > highRiskCutoff) {
              whrRisk = "Cao";
              metabolicRisk = "Cao";
              notes.push("Cảnh báo mỡ nội tạng cao. Ưu tiên Carb hấp thu chậm (Gạo lứt, khoai lang) để ổn định đường huyết.");
          } else {
              whrRisk = "Bình thường";
          }
      } else if (stats.waist) {
           const waistCutoff = stats.gender === Gender.MALE ? 90 : 80;
           if (stats.waist > waistCutoff) {
               notes.push("Vòng eo vượt chuẩn Á Đông. Cần giảm mỡ vùng bụng.");
           }
      }

      return {
          bmi,
          bmiClassification: bmiClass,
          whr,
          whrRisk,
          metabolicRisk,
          notes
      };
  };

  const generateValidation = (stats: UserStats, tdee: number, targetCalories: number, bmi: number): ValidationItem[] => {
    const list: ValidationItem[] = [];

    // 1. BMI Check
    let bmiStatus: 'pass' | 'warning' | 'info' = 'pass';
    if (bmi < 18.5 || bmi >= 23) bmiStatus = 'warning';
    list.push({
        criteria: "Chỉ số BMI",
        status: bmiStatus,
        scientificBasis: "Chuẩn IDI & WPRO (Châu Á)",
        detail: `BMI của bạn là ${bmi.toFixed(1)}. Mức lý tưởng cho người Việt là 18.5 - 22.9.`
    });

    // 2. Goal Check
    const adjustment = GOAL_ADJUSTMENTS[stats.goal];
    list.push({
        criteria: "Chiến lược Calories",
        status: 'pass',
        scientificBasis: "Nguyên tắc Cân bằng Năng lượng (CICO)",
        detail: stats.goal === Goal.LOSE_WEIGHT 
            ? "Thâm hụt 500kcal/ngày để giảm ~0.5kg mỡ/tuần an toàn."
            : stats.goal === Goal.GAIN_WEIGHT 
            ? "Dư thừa 500kcal/ngày để tối ưu hóa việc xây dựng cơ bắp."
            : "Duy trì mức Calories bằng TDEE để giữ cân ổn định."
    });

    // 3. Activity Check
    list.push({
        criteria: "Hệ số vận động",
        status: 'info',
        scientificBasis: "Hệ số PAL (Physical Activity Level)",
        detail: `Áp dụng hệ số x${ACTIVITY_MULTIPLIERS[stats.activity]} cho nhóm "${ACTIVITY_LABELS[stats.activity]}".`
    });

    // 4. Diet Check
    list.push({
        criteria: "Chế độ ăn",
        status: 'pass',
        scientificBasis: DIET_LABELS[stats.dietPreference],
        detail: stats.dietPreference === DietPreference.HIGH_PROTEIN 
            ? "Ưu tiên 2.0g-2.2g Protein/kg trọng lượng để bảo vệ cơ bắp."
            : stats.dietPreference === DietPreference.LOW_CARB
            ? "Giảm carbohydrate để thúc đẩy quá trình Ketosis nhẹ hoặc giảm tích nước."
            : stats.dietPreference === DietPreference.DASH
            ? "Tập trung giảm Natri, tăng Kali/Magie để kiểm soát huyết áp."
            : "Phân bổ Macro cân bằng theo khuyến nghị của Viện Dinh Dưỡng."
    });

    return list;
  }

  const calculateTDEE = () => {
    // Validation Inputs
    if (!stats.age || !stats.height || !stats.weight) {
        alert("Vui lòng nhập đầy đủ Tuổi, Chiều cao và Cân nặng để tính toán chính xác.");
        return;
    }

    let bmr = (10 * stats.weight) + (6.25 * stats.height) - (5 * stats.age);
    if (stats.gender === Gender.MALE) {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const tdee = bmr * ACTIVITY_MULTIPLIERS[stats.activity];
    const targetCalories = tdee + GOAL_ADJUSTMENTS[stats.goal];
    const healthAnalysis = analyzeHealth(stats);
    const validation = generateValidation(stats, tdee, targetCalories, healthAnalysis.bmi);

    setResult({
      bmr,
      tdee,
      targetCalories: Math.max(targetCalories, 1200),
      healthAnalysis,
      validation
    });
    
    setMenu(null);

    setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleGetMenu = async () => {
    if (!result) return;
    setLoadingMenu(true);
    try {
      const healthContext = result.healthAnalysis ? 
          `SỨC KHỎE: BMI ${result.healthAnalysis.bmi.toFixed(1)} (${result.healthAnalysis.bmiClassification}). ${result.healthAnalysis.notes.join(' ')}` 
          : "";

      const generatedMenu = await generateVietnameseMenu(
        stats.name,
        Math.round(result.targetCalories), 
        stats.weight,
        GOAL_LABELS[stats.goal],
        stats.dietPreference,
        healthContext
      );
      setMenu(generatedMenu);
      
      setTimeout(() => {
        menuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error(error);
      alert("AI đang bận. Vui lòng thử lại!");
    } finally {
      setLoadingMenu(false);
    }
  };

  const handleUpdateMeal = (mealKey: keyof DailyMenu, newMeal: MealDetail) => {
    setMenu(prev => {
      if (!prev) return null;
      const oldDish = prev[mealKey] as MealDetail;
      return {
        ...prev,
        [mealKey]: newMeal,
        totalDailyCalories: prev.totalDailyCalories + (newMeal.totalCalories - oldDish.totalCalories),
        totalDailyProtein: prev.totalDailyProtein + (newMeal.totalProtein - oldDish.totalProtein),
        totalDailyCarbs: prev.totalDailyCarbs + (newMeal.totalCarbs - oldDish.totalCarbs),
        totalDailyFat: prev.totalDailyFat + (newMeal.totalFat - oldDish.totalFat),
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans relative selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200/30 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-[120px]"></div>
         <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] bg-teal-100/30 rounded-full blur-[100px] transform -translate-x-1/2"></div>
      </div>

      <Header onReset={handleReset} onOpenGuide={() => setShowGuide(true)} />
      <GuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
        <div className="text-center mb-16 animate-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Sức khỏe <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Thông Minh</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Kết hợp Y học dinh dưỡng chuẩn Á Đông & AI thế hệ mới để thiết kế lộ trình tối ưu cho cơ thể bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <CalculatorForm 
              key={`form-${resetKey}`} // Force remount on reset
              stats={stats} 
              setStats={setStats} 
              onCalculate={calculateTDEE} 
            />
          </div>

          <div className="lg:col-span-5 h-full" ref={resultsRef}>
            {result ? (
                <ResultsDisplay 
                    key={`result-${resetKey}`}
                    result={result} 
                    onGetMenu={handleGetMenu}
                    loadingMenu={loadingMenu}
                />
            ) : (
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 h-96 flex items-center justify-center text-center p-8 relative overflow-hidden">
                     <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10"></div>
                     <div>
                        <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <span className="text-4xl animate-pulse">✨</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Sẵn sàng phân tích</h3>
                        <p className="text-slate-500">Nhập chỉ số cơ thể bên trái để AI bắt đầu tính toán TDEE & Rủi ro sức khỏe.</p>
                    </div>
                </div>
            )}
          </div>
        </div>

        <div ref={menuRef}>
            <MenuDisplay 
              key={`menu-${resetKey}`}
              menu={menu} 
              onUpdateMeal={handleUpdateMeal} 
              dietPreference={stats.dietPreference}
              onReset={handleReset}
            />
        </div>
      </main>
    </div>
  );
};

export default App;