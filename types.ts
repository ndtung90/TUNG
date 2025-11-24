
export enum Gender {
  MALE = 'Nam',
  FEMALE = 'Nữ'
}

export enum ActivityLevel {
  SEDENTARY = 'sedentary',      // Ít vận động
  LIGHT = 'light',              // Vận động nhẹ
  MODERATE = 'moderate',        // Vận động vừa
  ACTIVE = 'active',            // Năng động
  VERY_ACTIVE = 'very_active'   // Rất năng động
}

export enum Goal {
  LOSE_WEIGHT = 'lose',         // Giảm cân
  MAINTAIN = 'maintain',        // Giữ cân
  GAIN_WEIGHT = 'gain'          // Tăng cân
}

export enum DietPreference {
  BALANCED = 'balanced',             // Cân bằng
  LOW_CARB = 'low_carb',             // Giảm mỡ nhanh (Low Carb/Keto)
  HIGH_PROTEIN = 'high_protein',     // Tăng cơ (High Protein)
  MEDITERRANEAN = 'mediterranean',   // Địa Trung Hải (Tim mạch)
  DASH = 'dash',                     // DASH (Ngừa cao huyết áp)
  MIND = 'mind',                     // MIND (Tốt cho não bộ)
  FASTING = 'fasting'                // Nhịn ăn gián đoạn (16:8)
}

export interface UserStats {
  name: string; // New field
  gender: Gender;
  age: number;
  height: number; // cm
  weight: number; // kg
  activity: ActivityLevel;
  goal: Goal;
  dietPreference: DietPreference;
  
  // Optional Health Stats
  waist?: number; // cm
  hip?: number;   // cm
  isSmoker?: boolean;
  sleepHours?: number;
}

export interface HealthAnalysis {
  bmi: number;
  bmiClassification: string; // Theo chuẩn IDI & WPRO cho người Châu Á
  whr?: number; // Waist to Hip Ratio
  whrRisk?: string;
  metabolicRisk?: string; // Đánh giá tổng quan
  notes: string[];
}

export interface ValidationItem {
  criteria: string;
  status: 'pass' | 'warning' | 'info';
  scientificBasis: string;
  detail: string;
}

export interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

export interface MealDetail {
  mainDishName: string; // e.g., "Phở Bò"
  items: FoodItem[];    // Detailed ingredients
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  micronutrients: string[]; // e.g. ["Vitamin A", "Sắt", "Omega-3"]
}

export interface ScheduleItem {
  time: string;
  activity: string;
}

export interface AdviceContent {
  summary: string;
  healthTips: string[];
  micronutrientFocus: string;
  diningSchedule: ScheduleItem[];
}

export interface DailyMenu {
  breakfast: MealDetail;
  morningSnack: MealDetail;
  lunch: MealDetail;
  afternoonSnack: MealDetail;
  dinner: MealDetail;
  totalDailyCalories: number;
  totalDailyProtein: number;
  totalDailyCarbs: number;
  totalDailyFat: number;
  advice: AdviceContent;
}

export interface TDEEResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  healthAnalysis?: HealthAnalysis;
  validation: ValidationItem[];
}
