import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  FileSpreadsheet, 
  Eye, 
  Trash2, 
  FileText, 
  MapPin, 
  X, 
  AlertCircle,
  Filter
} from 'lucide-react';
import { Farmer } from '../types';
import { formatDateArabic } from '../utils/helpers';

interface FarmerTableProps {
  farmers: Farmer[];
  onAddNewFarmer: () => void;
  onExportAll: () => void;
  onViewDetails: (farmer: Farmer) => void;
  onDeleteFarmer: (farmerId: string, farmerName: string) => void;
}

export const FarmerTable: React.FC<FarmerTableProps> = ({
  farmers,
  onAddNewFarmer,
  onExportAll,
  onViewDetails,
  onDeleteFarmer,
}) => {
  // STRICT Search state strictly for National ID Card Number
  const [nationalIdSearch, setNationalIdSearch] = useState('');

  // Filter farmers STRICTLY by National ID Card Number
  const filteredFarmers = farmers.filter((f) => {
    if (!nationalIdSearch.trim()) return true;
    const cleanSearch = nationalIdSearch.trim();
    return f.nationalId.includes(cleanSearch);
  });

  // Calculate metrics for KPI summary cards
  const totalFarmers = farmers.length;
  const totalPlots = farmers.reduce((sum, f) => sum + (f.plots?.length || 0), 0);
  const totalAcceptedHectares = farmers.reduce((sum, f) => {
    return sum + (f.plots?.reduce((pSum, p) => pSum + (parseFloat(p.acceptedArea) || 0), 0) || 0);
  }, 0);
  // Count plots with status rejected/pending if any, or general status
  const pendingOrRejectedCount = farmers.reduce((sum, f) => {
    return sum + (f.plots?.filter(p => p.status === 'rejected' || p.status === 'pending').length || 0);
  }, 0);

  return (
    <div className="space-y-6">

      {/* KPI Stats Grid - Technical Dashboard Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Farmers */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-r-4 border-r-[#1b4332] flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">إجمالي الفلاحين</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#1b4332]">{totalFarmers}</span>
            <span className="text-xs text-slate-400 font-medium">فلاح مسجل</span>
          </div>
        </div>

        {/* Card 2: Registered Plots */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-r-4 border-r-[#d4a373] flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">القطع المسجلة</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#d4a373]">{totalPlots}</span>
            <span className="text-xs text-slate-400 font-medium">قطعة أرضية</span>
          </div>
        </div>

        {/* Card 3: Settlement Area (ha) */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-r-4 border-r-[#2d6a4f] flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">مساحة التسوية (هـ)</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#2d6a4f]">{totalAcceptedHectares.toFixed(1)}</span>
            <span className="text-xs text-slate-400 font-medium">هكتار مقبول</span>
          </div>
        </div>

        {/* Card 4: Rejected / Pending Files */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-r-4 border-r-[#cc4444] flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ملفات مرفوضة / في الانتظار</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#cc4444]">{pendingOrRejectedCount}</span>
            <span className="text-xs text-slate-400 font-medium">ملف قيد المعالجة</span>
          </div>
        </div>
      </div>
      
      {/* Search & Actions Control Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* STRICT Search Input - National ID Only */}
          <div className="flex-1 max-w-xl relative">
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-[#1b4332]" />
              </div>
              <input
                type="text"
                value={nationalIdSearch}
                onChange={(e) => setNationalIdSearch(e.target.value)}
                placeholder="البحث برقم بطاقة التعريف الوطنية فقط (مثال: 109823...)"
                className="w-full pr-11 pl-10 py-3 bg-[#f0f4f1] border border-slate-300 focus:border-[#1b4332] focus:bg-white focus:ring-4 focus:ring-[#1b4332]/10 rounded-xl text-slate-800 placeholder-slate-400 text-sm font-medium transition-all"
                dir="rtl"
              />
              {nationalIdSearch && (
                <button
                  onClick={() => setNationalIdSearch('')}
                  className="absolute left-3 p-1 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600 transition"
                  title="مسح البحث"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Search Helper Tag */}
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 pr-1">
              <Filter className="w-3.5 h-3.5 text-[#1b4332]" />
              <span>البحث مخصص <strong className="text-slate-700">حصرياً برقم بطاقة التعريف الوطنية</strong></span>
              {nationalIdSearch && (
                <span className="text-[#1b4332] font-semibold bg-[#e1ede6] px-2 py-0.5 rounded-md border border-[#2d6a4f]/20">
                  نتيجة البحث: {filteredFarmers.length} فلاح
                </span>
              )}
            </div>
          </div>

          {/* Dedicated Control Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onAddNewFarmer}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
            >
              <UserPlus className="w-5 h-5" />
              <span>إضافة فلاح جديد ➕</span>
            </button>

            <button
              onClick={onExportAll}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-[#d4a373] border border-slate-700 font-bold text-sm shadow-md transition-all active:scale-[0.98]"
            >
              <FileSpreadsheet className="w-5 h-5 text-[#d4a373]" />
              <span>تصدير الكل إلى Excel 📊</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Farmers Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Table Header Info */}
        <div className="px-6 py-4 bg-[#f8faf9] border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#1b4332]" />
            <h2 className="text-base font-bold text-slate-800">
              سجل الفلاحين والملفات المودعة
            </h2>
            <span className="bg-[#e1ede6] text-[#1b4332] text-xs font-bold px-2.5 py-1 rounded-full border border-[#2d6a4f]/20">
              {filteredFarmers.length} ملف
            </span>
          </div>
          {farmers.length > 0 && (
            <div className="text-xs text-slate-500">
              عرض {filteredFarmers.length} من إجمالي {farmers.length} فلاح
            </div>
          )}
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[#f8faf9] text-slate-700 text-xs font-bold border-b border-slate-200 uppercase tracking-wider">
                <th scope="col" className="py-3.5 px-4 text-center w-12">#</th>
                <th scope="col" className="py-3.5 px-4">1. الاسم</th>
                <th scope="col" className="py-3.5 px-4">2. اللقب</th>
                <th scope="col" className="py-3.5 px-4">3. اسم الأب</th>
                <th scope="col" className="py-3.5 px-4">4. تاريخ الميلاد</th>
                <th scope="col" className="py-3.5 px-4">5. رقم بطاقة التعريف الوطنية</th>
                <th scope="col" className="py-3.5 px-4 text-center">6. عدد القطع</th>
                <th scope="col" className="py-3.5 px-4 text-center">7. الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredFarmers.length > 0 ? (
                filteredFarmers.map((farmer, index) => {
                  const plotCount = farmer.plots?.length || 0;
                  return (
                    <tr 
                      key={farmer.id}
                      className="hover:bg-[#f0f4f1]/60 transition-colors group"
                    >
                      {/* Index */}
                      <td className="py-4 px-4 text-center font-bold text-slate-400 group-hover:text-slate-600">
                        {index + 1}
                      </td>

                      {/* 1. First Name */}
                      <td className="py-4 px-4 font-bold text-slate-900">
                        {farmer.firstName}
                      </td>

                      {/* 2. Last Name */}
                      <td className="py-4 px-4 font-bold text-slate-900">
                        {farmer.lastName}
                      </td>

                      {/* 3. Father Name */}
                      <td className="py-4 px-4 text-slate-700">
                        {farmer.fatherName}
                      </td>

                      {/* 4. Birth Date */}
                      <td className="py-4 px-4 text-slate-600 whitespace-nowrap dir-ltr text-right">
                        {formatDateArabic(farmer.birthDate)}
                      </td>

                      {/* 5. National ID */}
                      <td className="py-4 px-4">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 bg-[#f0f4f1] text-[#1b4332] rounded-lg border border-slate-200 tracking-wider">
                          {farmer.nationalId}
                        </span>
                      </td>

                      {/* 6. Plot Count Badge */}
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          plotCount > 0 
                            ? 'bg-[#e1ede6] text-[#1b4332] border border-[#2d6a4f]/20' 
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          <MapPin className="w-3.5 h-3.5" />
                          {plotCount} {plotCount === 1 ? 'قطعة' : 'قطع'}
                        </span>
                      </td>

                      {/* 7. Actions */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          {/* View All & Edit Button */}
                          <button
                            onClick={() => onViewDetails(farmer)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#1b4332] hover:text-[#2d6a4f] font-bold text-xs rounded-xl border border-emerald-200 transition-colors"
                            title="عرض كافة البيانات وتعديل"
                          >
                            <Eye className="w-4 h-4 text-[#1b4332]" />
                            <span>عرض الكل وتعديل 👁️</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => onDeleteFarmer(farmer.id, `${farmer.firstName} ${farmer.lastName}`)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-[#cc4444] hover:text-rose-900 font-bold text-xs rounded-xl border border-rose-200 transition-colors"
                            title="حذف هذا الفلاح"
                          >
                            <Trash2 className="w-4 h-4 text-[#cc4444]" />
                            <span>حذف 🗑️</span>
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="max-w-sm mx-auto flex flex-col items-center justify-center text-slate-400">
                      <div className="w-16 h-16 rounded-2xl bg-[#f0f4f1] flex items-center justify-center mb-3">
                        <AlertCircle className="w-8 h-8 text-[#1b4332]" />
                      </div>
                      <h3 className="text-base font-bold text-slate-700 mb-1">
                        لم يتم العثور على أية نتائج
                      </h3>
                      <p className="text-xs text-slate-500 mb-4">
                        {nationalIdSearch 
                          ? `لا يوجد فلاح مسجل برقم بطاقة التعريف الوطنية (${nationalIdSearch})`
                          : 'لم يتم تسجيل أي فلاح في النظام حتى الآن.'
                        }
                      </p>
                      {nationalIdSearch ? (
                        <button
                          onClick={() => setNationalIdSearch('')}
                          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition"
                        >
                          مسح البحث برقم بطاقة التعريف
                        </button>
                      ) : (
                        <button
                          onClick={onAddNewFarmer}
                          className="px-4 py-2 bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold rounded-xl transition"
                        >
                          ➕ إضافة فلاح جديد الآن
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-3 bg-[#f8faf9] border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <div>
            * يمكن البحث <strong className="text-slate-700">حصرياً عن طريق رقم بطاقة التعريف الوطنية</strong> لضمان دقة الاستعلام العقاري.
          </div>
          <div>
            تحديث السجل تلقائي ومحفوظ محلّياً
          </div>
        </div>

      </div>

    </div>
  );
};
