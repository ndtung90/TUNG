
import React from 'react';
import { Activity, Sparkles, RotateCcw, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenGuide: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset, onOpenGuide }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col cursor-pointer" onClick={onReset}>
              <span className="text-lg font-bold text-gray-900 tracking-tight leading-none">Thực Đơn Thông Minh</span>
              <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">by NDT</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Guide Button */}
            <button 
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-all font-medium text-sm"
              title="Hướng dẫn sử dụng"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Hướng dẫn</span>
            </button>

            {/* Reset Button */}
            <button 
              onClick={onReset}
              className="flex items-center gap-1.5 text-slate-500 hover:text-rose-600 px-3 py-2 rounded-lg hover:bg-rose-50 transition-all font-medium text-sm group"
              title="Làm mới phần mềm"
            >
              <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
              <span className="hidden sm:inline">Làm mới</span>
            </button>

            {/* Badge */}
            <div className="hidden md:flex items-center gap-2 bg-gray-100/50 px-3 py-1.5 rounded-full border border-gray-200/50 ml-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-medium text-gray-600">
                Powered by NDT
              </span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
