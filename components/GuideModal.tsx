
import React from 'react';
import { X, Scale, Ruler, Activity, Apple, HeartPulse, Info } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10 duration-300">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
                <Info className="w-6 h-6 text-white" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white">Hướng dẫn sử dụng</h2>
                <p className="text-blue-100 text-sm">Quy trình tối ưu hóa dinh dưỡng cá nhân</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar bg-slate-50">
            
            {/* Step 1 */}
            <section className="mb-10 relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-indigo-100"></div>
                <div className="flex gap-6">
                    <div className="relative z-10 flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
                        1
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-grow">
                        <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center">
                            <Ruler className="w-5 h-5 mr-2 text-indigo-500" />
                            Nhập liệu chuẩn xác
                        </h3>
                        <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                            Dữ liệu đầu vào càng chính xác, AI tính toán càng hiệu quả. Hãy đo các chỉ số vào buổi sáng, khi chưa ăn gì.
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5"></span>
                                <span className="text-slate-600"><strong>Chiều cao/Cân nặng:</strong> Cần số thực tế, không ước lượng.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5"></span>
                                <span className="text-slate-600"><strong>Vòng eo:</strong> Đo ngang rốn. Chỉ số quan trọng để đánh giá mỡ nội tạng.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Step 2 */}
            <section className="mb-10 relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-indigo-100"></div>
                <div className="flex gap-6">
                    <div className="relative z-10 flex-shrink-0 w-10 h-10 bg-white border-2 border-indigo-600 rounded-full flex items-center justify-center text-indigo-600 font-bold shadow-md">
                        2
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-grow">
                        <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center">
                            <Activity className="w-5 h-5 mr-2 text-indigo-500" />
                            Chọn mức độ vận động
                        </h3>
                        <p className="text-slate-600 text-sm mb-4">
                            Đa số mọi người thường đánh giá quá cao mức vận động của mình. Hãy tham khảo kỹ:
                        </p>
                        <div className="space-y-3">
                            <div className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="font-bold text-xs uppercase text-slate-500 w-24 shrink-0">Sedentary</div>
                                <div className="text-xs text-slate-700">Dân văn phòng, ngồi nhiều, KHÔNG tập thể dục.</div>
                            </div>
                            <div className="flex gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                                <div className="font-bold text-xs uppercase text-indigo-600 w-24 shrink-0">Moderate</div>
                                <div className="text-xs text-indigo-900 font-medium">Tập luyện có chủ đích 3-5 buổi/tuần (30-60p/buổi) + Di chuyển hàng ngày.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

             {/* Step 3 */}
             <section className="mb-0 relative">
                <div className="flex gap-6">
                    <div className="relative z-10 flex-shrink-0 w-10 h-10 bg-white border-2 border-indigo-600 rounded-full flex items-center justify-center text-indigo-600 font-bold shadow-md">
                        3
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-grow">
                        <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center">
                            <Apple className="w-5 h-5 mr-2 text-indigo-500" />
                            Hiểu về thực đơn AI
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <h4 className="text-sm font-bold text-slate-800 mb-2">Tính năng Đổi Món</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Nếu bạn dị ứng hoặc không thích một món, hãy nhấn nút <strong>"Đổi món khác"</strong>. AI sẽ tìm giải pháp thay thế giữ nguyên Macro.
                                </p>
                             </div>
                             <div>
                                <h4 className="text-sm font-bold text-slate-800 mb-2">Định lượng (Gam)</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Trọng lượng thực phẩm trong thực đơn thường là <strong>trọng lượng sống (chưa chế biến)</strong> trừ khi có ghi chú khác.
                                </p>
                             </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                            <HeartPulse className="w-5 h-5 text-amber-500 shrink-0" />
                            <p className="text-xs text-amber-800 font-medium">
                                Lưu ý: Ứng dụng này cung cấp thông tin tham khảo dựa trên khoa học dinh dưỡng. Người có bệnh lý nền (Tiểu đường, Thận, Gout...) nên tham khảo ý kiến bác sĩ trước khi áp dụng.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
      </div>
    </div>
  );
};

export default GuideModal;
