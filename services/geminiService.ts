
import { GoogleGenAI, Type } from "@google/genai";
import { DailyMenu, DietPreference, MealDetail } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const foodItemSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Tên nguyên liệu/món ăn (vd: Bún, Thịt bò, Nước dùng)" },
    quantity: { type: Type.STRING, description: "Định lượng (vd: 150g, 1 bát)" },
    calories: { type: Type.NUMBER },
    protein: { type: Type.NUMBER, description: "Gam đạm" },
    carbs: { type: Type.NUMBER, description: "Gam tinh bột" },
    fat: { type: Type.NUMBER, description: "Gam chất béo" }
  },
  required: ["name", "quantity", "calories", "protein", "carbs", "fat"]
};

const mealDetailSchema = {
  type: Type.OBJECT,
  properties: {
    mainDishName: { type: Type.STRING, description: "Tên món chính (vd: Phở Bò Tái)" },
    items: { type: Type.ARRAY, items: foodItemSchema },
    totalCalories: { type: Type.NUMBER },
    totalProtein: { type: Type.NUMBER },
    totalCarbs: { type: Type.NUMBER },
    totalFat: { type: Type.NUMBER },
    micronutrients: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "Danh sách các vi chất quan trọng có trong bữa này. BẮT BUỘC PHẢI CÓ 3-5 chất từ danh sách: Canxi, Magie, Kali, Kẽm, Sắt." 
    }
  },
  required: ["mainDishName", "items", "totalCalories", "totalProtein", "totalCarbs", "totalFat", "micronutrients"]
};

const scheduleItemSchema = {
  type: Type.OBJECT,
  properties: {
    time: { type: Type.STRING, description: "Khung giờ (vd: 07:00 - 07:30)" },
    activity: { type: Type.STRING, description: "Hoạt động ăn uống/sinh hoạt gợi ý" }
  },
  required: ["time", "activity"]
};

const adviceContentSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "Lời khuyên tổng quan ngắn gọn, súc tích, mang tính động viên." },
    healthTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 đầu dòng quan trọng nhất cần ghi nhớ (ngắn gọn)." },
    micronutrientFocus: { type: Type.STRING, description: "Giải thích về các vi chất đã bổ sung trong thực đơn (Canxi, Kẽm, v.v.) và tác dụng của chúng." },
    diningSchedule: { type: Type.ARRAY, items: scheduleItemSchema, description: "Lịch trình ăn uống gợi ý trong ngày." }
  },
  required: ["summary", "healthTips", "micronutrientFocus", "diningSchedule"]
};

const systemInstruction = `
Bạn là Chuyên gia Dinh dưỡng Lâm sàng & Khoa học Thực phẩm cấp cao (Senior Clinical Nutritionist).
Tôn chỉ làm việc:
1. KHOA HỌC: Tuân thủ chuẩn RNI (Việt Nam) & WHO.
2. DỄ ỨNG DỤNG (PRACTICALITY): 
   - Ưu tiên nguyên liệu có sẵn tại chợ dân sinh hoặc siêu thị Việt Nam (WinMart, CoopMart).
   - BỮA SÁNG (QUAN TRỌNG): Người Việt thường rất bận rộn. Gợi ý món làm TRONG VÒNG 5-10 PHÚT hoặc món nước (Bún/Phở) dễ mua/dễ nấu. Ưu tiên: Bánh mì trứng/chả, Xôi (lượng vừa phải), Yến mạch nấu kiểu Việt, Trứng luộc/ốp, Ngũ cốc. TRÁNH CÁC MÓN ÂU PHỨC TẠP như Nướng lò (Baking) vào buổi sáng.
3. DỮ LIỆU LỚN (BIG DATA): Truy cập kho dữ liệu ẩm thực Việt Nam. SÁNG TẠO nhưng GẦN GŨI.
4. TỐI ƯU VI CHẤT (MICRONUTRIENTS - QUAN TRỌNG):
   - Thực đơn không chỉ đủ Macro mà phải giàu Micro.
   - Canxi: Từ sữa, cá nhỏ ăn xương, tôm, rau dền.
   - Magie: Từ hạt điều, hạnh nhân, chuối, rau ngót.
   - Kali: Chuối, khoai lang, nước dừa.
   - Kẽm: Thịt bò, hàu, gan, lòng đỏ trứng.
   - Sắt: Thịt đỏ, rau muống, cải bó xôi.
5. CÁ NHÂN HÓA: Gọi tên người dùng thân mật.

ĐẶC BIỆT CHÚ Ý CÁC CHẾ ĐỘ ĂN:
- MEDITERRANEAN (Địa Trung Hải): Ưu tiên cá, dầu thực vật, rau quả.
- DASH: Giảm mặn, tăng Kali/Magie.
- MIND: Tốt cho não bộ.
- FASTING (16:8): Dồn năng lượng vào bữa chính.
`;

/**
 * Helper function to calculate target macros in grams based on weight and preferences.
 */
const calculateTargetMacros = (calories: number, weight: number, preference: DietPreference, goal: string) => {
  let proteinGrams = 0;
  let fatGrams = 0;
  let carbGrams = 0;

  // 1. Protein Calculation (Bodyweight anchor & Goal)
  const isMuscleGain = goal.includes("Tăng cân") || preference === DietPreference.HIGH_PROTEIN;
  
  if (isMuscleGain) {
      proteinGrams = weight * 2.0; 
  } else if (preference === DietPreference.LOW_CARB || preference === DietPreference.FASTING) {
      proteinGrams = weight * 1.8; 
  } else {
      proteinGrams = weight * 1.5; 
  }
  
  if (proteinGrams > 200) proteinGrams = 190; 

  // 2. Fat Calculation
  if (preference === DietPreference.LOW_CARB) {
     fatGrams = (calories * 0.50) / 9;
  } else if (preference === DietPreference.MEDITERRANEAN || preference === DietPreference.MIND) {
     fatGrams = (calories * 0.35) / 9; 
  } else if (preference === DietPreference.DASH) {
     fatGrams = (calories * 0.25) / 9; 
  } else {
     fatGrams = weight * 0.9; 
  }

  // 3. Carbs Calculation (Remainder)
  const caloriesUsed = (proteinGrams * 4) + (fatGrams * 9);
  let remainingCalories = calories - caloriesUsed;
  
  if (remainingCalories < 0) {
      fatGrams = fatGrams * 0.8;
      remainingCalories = calories - ((proteinGrams * 4) + (fatGrams * 9));
  }
  
  carbGrams = Math.max(20, remainingCalories / 4); 

  return {
    p: Math.round(proteinGrams),
    c: Math.round(carbGrams),
    f: Math.round(fatGrams)
  };
};

export const generateVietnameseMenu = async (
  name: string,
  targetCalories: number, 
  userWeight: number,
  goalLabel: string,
  dietPreference: DietPreference,
  healthContext: string = ""
): Promise<DailyMenu> => {
  
  const targets = calculateTargetMacros(targetCalories, userWeight, dietPreference, goalLabel);

  let dietNote = "";
  switch (dietPreference) {
    case DietPreference.MEDITERRANEAN:
      dietNote = "Tuân thủ chế độ ĐỊA TRUNG HẢI: Dùng nhiều cá, dầu thực vật lành mạnh, ngũ cốc nguyên cám.";
      break;
    case DietPreference.DASH:
      dietNote = "Tuân thủ chế độ DASH: Nhạt (ít muối), giàu Kali/Magie.";
      break;
    case DietPreference.MIND:
      dietNote = "Tuân thủ chế độ MIND (Tốt cho não): Ưu tiên rau lá xanh đậm, các loại hạt, cá béo.";
      break;
    case DietPreference.FASTING:
      dietNote = "Tuân thủ chế độ FASTING (Nhịn ăn gián đoạn): Dồn năng lượng vào Bữa Trưa và Tối.";
      break;
    case DietPreference.LOW_CARB:
      dietNote = "Hạn chế tinh bột, ưu tiên rau xanh và đạm/béo tốt.";
      break;
    case DietPreference.HIGH_PROTEIN:
      dietNote = "Tối ưu cho việc xây dựng cơ bắp.";
      break;
    default:
      dietNote = "Cân bằng dinh dưỡng, đa dạng thực phẩm.";
  }

  const prompt = `
    Khách hàng: ${name || "Bạn"}.
    Lập thực đơn khoa học 1 ngày cho người Việt nặng ${userWeight}kg. 
    Tổng năng lượng mục tiêu: ${targetCalories} kcal.
    Chiến lược chính: ${goalLabel}.
    Phong cách ăn uống: ${dietPreference} (Yêu cầu: ${dietNote}).
    
    THÔNG TIN SỨC KHỎE:
    ${healthContext || "Sức khỏe bình thường."}
    
    MỤC TIÊU MACRO (GRAMS):
    - Protein: ~${targets.p}g
    - Carbs: ~${targets.c}g
    - Fat: ~${targets.f}g
    
    YÊU CẦU CỤ THỂ:
    1. Đa dạng hóa nhưng THỰC TẾ. Bữa sáng phải Nhanh - Gọn - Lẹ (Ưu tiên món Việt dễ làm).
    2. TỐI ƯU HÓA VI CHẤT: Trong thực đơn phải xuất hiện các nguyên liệu giàu Canxi, Magie, Kali, Kẽm, Sắt.
    3. Nguyên liệu dễ mua ở chợ Việt Nam.
    4. Tính toán chính xác Macro từng món.
    5. Đưa ra lời khuyên có cấu trúc, bao gồm lịch trình ăn uống gợi ý.
    
    Cấu trúc 5 bữa (Sáng, Phụ sáng, Trưa, Phụ chiều, Tối).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            breakfast: mealDetailSchema,
            morningSnack: mealDetailSchema,
            lunch: mealDetailSchema,
            afternoonSnack: mealDetailSchema,
            dinner: mealDetailSchema,
            totalDailyCalories: { type: Type.NUMBER },
            totalDailyProtein: { type: Type.NUMBER },
            totalDailyCarbs: { type: Type.NUMBER },
            totalDailyFat: { type: Type.NUMBER },
            advice: adviceContentSchema
          },
          required: ["breakfast", "morningSnack", "lunch", "afternoonSnack", "dinner", "totalDailyCalories", "totalDailyProtein", "totalDailyCarbs", "totalDailyFat", "advice"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as DailyMenu;
  } catch (error) {
    console.error("Error generating menu:", error);
    throw error;
  }
};

export const getDishAlternatives = async (
  mealName: string,
  currentDishName: string,
  targetCalories: number,
  dietPreference: DietPreference
): Promise<MealDetail[]> => {
  
  let dietFocus = "";
  if (dietPreference === DietPreference.MEDITERRANEAN) dietFocus = "chuẩn Địa Trung Hải";
  if (dietPreference === DietPreference.DASH) dietFocus = "ít muối";
  if (dietPreference === DietPreference.MIND) dietFocus = "tốt cho não bộ";
  if (dietPreference === DietPreference.FASTING) dietFocus = "mật độ dinh dưỡng cao";
  
  const prompt = `
    Bữa hiện tại: "${currentDishName}" (${mealName}).
    Yêu cầu: 3 món thay thế (~${targetCalories} kcal) tuân thủ chế độ ${dietPreference}.
    Tiêu chí: ${dietFocus}. Ưu tiên món Việt dễ nấu, nguyên liệu phổ thông, giàu vi chất (Kẽm, Sắt, Canxi).
    
    Phân loại:
    1. Món truyền thống (Healthy version).
    2. Món chế biến nhanh (Dưới 15p).
    3. Món thanh đạm (Ít gia vị).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            alternatives: {
              type: Type.ARRAY,
              items: mealDetailSchema,
              description: "Danh sách 3 lựa chọn thay thế"
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text);
    return result.alternatives as MealDetail[];
  } catch (error) {
    console.error("Error getting alternatives:", error);
    throw error;
  }
}
