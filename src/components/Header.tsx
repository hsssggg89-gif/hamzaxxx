import React from 'react';
import { Landmark, Sprout, FileSpreadsheet, RotateCcw, ShieldCheck, MapPin } from 'lucide-react';
import { Farmer } from '../types';

interface HeaderProps {
  farmers: Farmer[];
  onResetData: () => void;
  onExportAll: () => void;
  onAddNewFarmer: () => void;
  activeView: 'dashboard' | 'form';
}

export const Header: React.FC<HeaderProps> = ({
  farmers,
  onResetData,
  onExportAll,
  onAddNewFarmer,
  activeView,
}) => {
  // Calculate summary metrics
  const totalFarmers = farmers.length;
  const totalPlots = farmers.reduce((sum, f) => sum + (f.plots?.length || 0), 0);
  const totalAcceptedHectares = farmers.reduce((sum, f) => {
    return sum + (f.plots?.reduce((pSum, p) => pSum + (parseFloat(p.acceptedArea) || 0), 0) || 0);
  }, 0);

  return (
    <header className="bg-[#1b4332] text-white border-b border-[#2d6a4f] shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* System Title & Official Badge */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#2d6a4f] flex items-center justify-center shadow-md shrink-0 border border-emerald-400/20">
              <Landmark className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#2d6a4f]/80 text-emerald-200 font-medium border border-emerald-400/30">
                  الجمهورية الجزائرية الديمقراطية الشعبية
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#1b4332] text-slate-200 border border-[#2d6a4f]">
                  تطهير العقار الفلاحي
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
                نظام إدارة ومطابقة الأراضي الفلاحية
              </h1>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm('هل أنت تأكد من إعادة تحميل البيانات النموذجية؟ سيعيد هذا ضبط السجل لبيانات العينة العادية.')) {
                  onResetData();
                }
              }}
              className="p-2.5 rounded-xl bg-[#2d6a4f] hover:bg-emerald-700 text-slate-100 transition border border-emerald-600/50 text-xs flex items-center gap-1.5 shadow-sm"
              title="إعادة شحن البيانات النموذجية"
            >
              <RotateCcw className="w-4 h-4 text-emerald-200" />
              <span className="hidden sm:inline">إعادة ضبط السجل</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
