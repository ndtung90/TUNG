
import { ActivityLevel, Goal, DietPreference } from './types';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  [ActivityLevel.SEDENTARY]: 1.2,
  [ActivityLevel.LIGHT]: 1.375,
  [ActivityLevel.MODERATE]: 1.55,
  [ActivityLevel.ACTIVE]: 1.725,
  [ActivityLevel.VERY_ACTIVE]: 1.9,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  [ActivityLevel.SEDENTARY]: 'Ít vận động (Làm văn phòng, ít tập)',
  [ActivityLevel.LIGHT]: 'Nhẹ (Tập 1-3 ngày/tuần)',
  [ActivityLevel.MODERATE]: 'Vừa (Tập 3-5 ngày/tuần)',
  [ActivityLevel.ACTIVE]: 'Năng động (Tập 6-7 ngày/tuần)',
  [ActivityLevel.VERY_ACTIVE]: 'Rất năng động (VĐV, lao động nặng)',
};

export const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  [Goal.LOSE_WEIGHT]: -500,
  [Goal.MAINTAIN]: 0,
  [Goal.GAIN_WEIGHT]: 500,
};

export const GOAL_LABELS: Record<Goal, string> = {
  [Goal.LOSE_WEIGHT]: 'Giảm cân (-0.5kg/tuần)',
  [Goal.MAINTAIN]: 'Giữ cân nặng hiện tại',
  [Goal.GAIN_WEIGHT]: 'Tăng cân (+0.5kg/tuần)',
};

export const DIET_LABELS: Record<DietPreference, string> = {
  [DietPreference.BALANCED]: 'Cân bằng (Dễ duy trì)',
  [DietPreference.HIGH_PROTEIN]: 'Tăng cơ (Ưu tiên Đạm)',
  [DietPreference.LOW_CARB]: 'Giảm mỡ nhanh (Low Carb)',
  [DietPreference.MEDITERRANEAN]: 'Địa Trung Hải (Tốt cho tim mạch)',
  [DietPreference.DASH]: 'DASH (Ngừa cao huyết áp)',
  [DietPreference.MIND]: 'MIND (Tốt cho trí não)',
  [DietPreference.FASTING]: 'Intermittent Fasting (16:8)',
};
