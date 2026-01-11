
import React from 'react';
import { COLORS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  hideNav?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  showBack, 
  onBack, 
  hideNav = false,
  activeTab,
  onTabChange 
}) => {
  return (
    <div className="flex justify-center min-h-screen bg-slate-900 md:py-8">
      {/* Phone Container */}
      <div className="relative w-full max-w-[420px] bg-white md:rounded-[3rem] md:border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col h-full md:h-[840px]">
        
        {/* Android Status Bar Simulation */}
        <div className="bg-white px-6 py-2 flex justify-between items-center text-xs font-bold text-gray-500">
          <span>12:45</span>
          <div className="flex gap-2">
            <i className="fas fa-signal"></i>
            <i className="fas fa-wifi"></i>
            <i className="fas fa-battery-full"></i>
          </div>
        </div>

        {/* Header */}
        {title && (
          <div className="px-6 py-4 flex items-center bg-white border-b border-gray-100">
            {showBack && (
              <button onClick={onBack} className="mr-4 text-gray-700">
                <i className="fas fa-arrow-left text-xl"></i>
              </button>
            )}
            <h1 className="text-xl font-bold text-gray-800 flex-1">{title}</h1>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <i className="fas fa-user-circle text-2xl"></i>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 pb-24">
          {children}
        </div>

        {/* Navigation Bar */}
        {!hideNav && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center md:rounded-b-[2.5rem]">
            <button 
              onClick={() => onTabChange?.('DASHBOARD')}
              className={`flex flex-col items-center space-y-1 ${activeTab === 'DASHBOARD' ? 'text-emerald-600' : 'text-gray-400'}`}
            >
              <i className="fas fa-home text-lg"></i>
              <span className="text-[10px] font-medium">হোম</span>
            </button>
            <button 
              onClick={() => onTabChange?.('HISTORY')}
              className={`flex flex-col items-center space-y-1 ${activeTab === 'HISTORY' ? 'text-emerald-600' : 'text-gray-400'}`}
            >
              <i className="fas fa-history text-lg"></i>
              <span className="text-[10px] font-medium">ইতিহাস</span>
            </button>
            <div className="relative -mt-10">
              <button 
                onClick={() => onTabChange?.('LOAN_APPLY')}
                className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white"
              >
                <i className="fas fa-plus text-xl"></i>
              </button>
            </div>
            <button 
              onClick={() => onTabChange?.('PROFILE_SETUP')}
              className={`flex flex-col items-center space-y-1 ${activeTab === 'PROFILE_SETUP' ? 'text-emerald-600' : 'text-gray-400'}`}
            >
              <i className="fas fa-user text-lg"></i>
              <span className="text-[10px] font-medium">প্রোফাইল</span>
            </button>
            <button 
              onClick={() => onTabChange?.('ADMIN_DASHBOARD')}
              className={`flex flex-col items-center space-y-1 ${activeTab === 'ADMIN_DASHBOARD' ? 'text-emerald-600' : 'text-gray-400'}`}
            >
              <i className="fas fa-shield-alt text-lg"></i>
              <span className="text-[10px] font-medium">অ্যাডমিন</span>
            </button>
          </div>
        )}

        {/* Android Navigation Bar Simulation */}
        <div className="bg-white py-2 flex justify-center gap-12 md:pb-4">
          <div className="w-12 h-1 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
