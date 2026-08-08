import React from 'react';
import { 
  X, 
  Edit, 
  FileSpreadsheet, 
  Globe, 
  MapPin, 
  User, 
  Calendar, 
  CreditCard, 
  FileText, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Clock 
} from 'lucide-react';
import { Farmer } from '../types';
import { formatDateArabic, openGoogleEarth } from '../utils/helpers';

interface FarmerDetailModalProps {
  farmer: Farmer | null;
  onClose: () => void;
  onEdit: (farmer: Farmer) => void;
  onExportSingle: (farmer: Farmer) => void;
}

export const FarmerDetailModal: React.FC<FarmerDetailModalProps> = ({
  farmer,
  onClose,
  onEdit,
  onExportSingle,
}) => {
  if (!farmer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl my-8 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#1b4332] text-white flex items-center justify-between border-b border-[#2d6a4f] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2d6a4f] text-white flex items-center justify-center shrink-0 border border-emerald-400/20">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">
                الملف الكامل للفلاح: {farmer.firstName} {farmer.lastName}
              </h3>
              <p className="text-xs text-slate-200 mt-0.5">
                تاريخ إيداع الملف الرئيسي: <span className="text-emerald-300 font-bold">{formatDateArabic(farmer.depositDate)}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-[#2d6a4f] hover:bg-emerald-700 text-slate-200 hover:text-white rounded-xl transition border border-emerald-500/30"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 space-y-8 overflow-y-auto flex-1">
          
          {/* SECTION 1: Farmer Personal Summary Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200 text-slate-900 font-extrabold text-sm">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>بيانات تعريف الفلاح المودع</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-xs text-slate-500 block">الاسم الكامل</span>
                <span className="font-bold text-slate-900">{farmer.firstName} {farmer.lastName}</span>
              </div>

              <div>
                <span className="text-xs text-slate-500 block">اسم الأب</span>
                <span className="font-bold text-slate-800">{farmer.fatherName}</span>
              </div>

              <div>
                <span className="text-xs text-slate-500 block">تاريخ ومكان الميلاد</span>
                <span className="font-bold text-slate-800">
                  {formatDateArabic(farmer.birthDate)} ({farmer.birthPlace || 'غير محدد'})
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-500 block">رقم بطاقة التعريف الوطنية</span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-200 text-slate-900 rounded border border-slate-300 inline-block mt-0.5">
                  {farmer.nationalId}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-500 block">تاريخ صدور البطاقة</span>
                <span className="font-medium text-slate-700">{formatDateArabic(farmer.issueDate)}</span>
              </div>

              <div>
                <span className="text-xs text-slate-500 block">تاريخ إيداع الملف الرئيسي</span>
                <span className="font-bold text-emerald-700">{formatDateArabic(farmer.depositDate)}</span>
              </div>

              <div>
                <span className="text-xs text-slate-500 block">عدد القطع المسجلة</span>
                <span className="font-bold text-slate-900 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs">
                  {farmer.plots.length} قطعة
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: Associated Land Plots */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>تفاصيل القطع الأرضية المشمولة بالتسوية ({farmer.plots.length})</span>
              </h4>
            </div>

            {farmer.plots.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-sm">
                لا توجد قطع أرضية مضافة لهذه الملف حتى الآن.
              </div>
            ) : (
              <div className="space-y-6">
                {farmer.plots.map((plot, index) => (
                  <div 
                    key={plot.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden"
                  >
                    {/* Plot Header */}
                    <div className="px-5 py-3.5 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold">
                          القطعة #{index + 1}
                        </span>
                        <span className="text-sm font-bold text-slate-800">
                          المساحة المطلوبة: <strong className="text-emerald-700">{plot.requestedArea || '0'} هكتار</strong>
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                          النشاط: {plot.activity}
                        </span>
                      </div>

                      {/* GOOGLE EARTH DIRECT LINK BUTTON */}
                      <button
                        onClick={() => openGoogleEarth(plot.coordinates)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow transition"
                        title="فتح الموقع مباشرة في Google Earth"
                      >
                        <Globe className="w-4 h-4" />
                        <span>🌍 فتح في Google Earth</span>
                      </button>
                    </div>

                    {/* Plot Detailed Grid */}
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      
                      {/* Coordinates */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block mb-1">إحداثيات القطعة (Google Earth)</span>
                        <span className="font-mono text-xs font-bold text-slate-900 dir-ltr inline-block">
                          {plot.coordinates || 'غير مدخلة'}
                        </span>
                      </div>

                      {/* Circle Proc */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block mb-1">محضر لجنة الدائرة</span>
                        <span className="font-bold text-slate-800">{plot.circleProc || '-'}</span>
                      </div>

                      {/* Cadastral Ref */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block mb-1">المراجع المساحية (القسم/القطعة)</span>
                        <span className="font-bold text-slate-800">{plot.cadastralRef || '-'}</span>
                      </div>

                      {/* Ownership Nature */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block mb-1">طبيعة الملك</span>
                        <span className="font-bold text-slate-800">{plot.ownershipNature || '-'}</span>
                      </div>

                      {/* Wilaya Proc */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block mb-1">المحضر الولائي</span>
                        <span className="font-bold text-slate-800">{plot.wilayaProc || '-'}</span>
                      </div>

                      {/* Wilaya Decision Badge */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block mb-1">قرار اللجنة الولائية</span>
                        <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full text-xs ${
                          plot.wilayaDecision === 'مقبول' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          plot.wilayaDecision === 'مؤجل' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {plot.wilayaDecision === 'مقبول' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                          {plot.wilayaDecision === 'مؤجل' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                          {plot.wilayaDecision === 'مرفوض' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                          {plot.wilayaDecision}
                        </span>
                      </div>

                      {/* Accepted Area */}
                      <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                        <span className="text-emerald-700 block mb-1 font-semibold">المساحة المقبولة للتسوية</span>
                        <span className="font-extrabold text-sm text-emerald-900">{plot.acceptedArea || '0'} هكتار</span>
                      </div>

                      {/* Cert Info */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block mb-1">شهادة القبول / الرفض</span>
                        <span className="font-bold text-slate-800">{plot.certInfo || '-'}</span>
                      </div>

                      {/* Real Estate Expertise */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block mb-1">إنجاز الخبرة العقارية</span>
                        <span className="font-bold text-slate-800">{plot.realEstateExpertise}</span>
                      </div>

                      {/* Concession File */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block mb-1">ملف عقد الامتياز</span>
                        <span className="font-bold text-slate-800">{plot.concessionFile}</span>
                      </div>

                      {/* Specifications Book */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block mb-1">دفتر الشروط</span>
                        <span className="font-bold text-slate-800">{plot.specificationsBook}</span>
                      </div>

                      {/* Concession Contract Status */}
                      <div className="p-3 bg-sky-50 rounded-xl border border-sky-100">
                        <span className="text-sky-800 block mb-1 font-bold">الحصول على عقد الامتياز</span>
                        <span className="font-extrabold text-sm text-sky-900">{plot.concessionContractStatus}</span>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
          >
            إغلاق
          </button>

          <div className="flex items-center gap-3">
            {/* Single Farmer Excel Export Button */}
            <button
              onClick={() => onExportSingle(farmer)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold text-xs shadow transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>📥 تصدير ملف الفلاح إلى Excel</span>
            </button>

            {/* Edit Farmer Button */}
            <button
              onClick={() => {
                onClose();
                onEdit(farmer);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-md transition"
            >
              <Edit className="w-4 h-4" />
              <span>✏️ تعديل كامل البيانات</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
