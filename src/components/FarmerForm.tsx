import React, { useState } from 'react';
import { 
  ArrowRight, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Globe, 
  MapPin, 
  User, 
  FileText, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Farmer, LandPlot, WilayaDecision, RealEstateExpertiseStatus, ConcessionFileStatus, SpecificationsBookStatus, ConcessionContractStatus } from '../types';
import { openGoogleEarth } from '../utils/helpers';

interface FarmerFormProps {
  initialFarmer?: Farmer | null;
  onSave: (farmer: Farmer) => void;
  onCancel: () => void;
}

const createEmptyPlot = (): LandPlot => ({
  id: `plot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  coordinates: '',
  requestedArea: '',
  activity: 'حبوب',
  circleProc: '',
  cadastralRef: '',
  ownershipNature: 'ملك الدولة خاص (البايليك)',
  wilayaProc: '',
  wilayaDecision: 'مقبول',
  acceptedArea: '',
  certInfo: '',
  realEstateExpertise: 'منجزة',
  concessionFile: 'تم الإيداع',
  specificationsBook: 'تم الإمضاء',
  concessionContractStatus: 'نعم',
});

export const FarmerForm: React.FC<FarmerFormProps> = ({
  initialFarmer,
  onSave,
  onCancel,
}) => {
  // Personal Data State
  const [firstName, setFirstName] = useState(initialFarmer?.firstName || '');
  const [lastName, setLastName] = useState(initialFarmer?.lastName || '');
  const [fatherName, setFatherName] = useState(initialFarmer?.fatherName || '');
  const [birthDate, setBirthDate] = useState(initialFarmer?.birthDate || '');
  const [birthPlace, setBirthPlace] = useState(initialFarmer?.birthPlace || '');
  const [nationalId, setNationalId] = useState(initialFarmer?.nationalId || '');
  const [issueDate, setIssueDate] = useState(initialFarmer?.issueDate || '');
  const [depositDate, setDepositDate] = useState(initialFarmer?.depositDate || new Date().toISOString().slice(0, 10));

  // Dynamic Plots Repeater State
  const [plots, setPlots] = useState<LandPlot[]>(
    initialFarmer?.plots && initialFarmer.plots.length > 0 
      ? initialFarmer.plots 
      : [createEmptyPlot()]
  );

  const [formError, setFormError] = useState<string | null>(null);

  // Add new plot handler
  const handleAddPlot = () => {
    setPlots((prev) => [...prev, createEmptyPlot()]);
  };

  // Remove plot handler
  const handleRemovePlot = (plotId: string) => {
    if (plots.length <= 1) {
      alert('يجب أن يحتوي الملف على قطعة أرضية واحدة على الأقل.');
      return;
    }
    setPlots((prev) => prev.filter((p) => p.id !== plotId));
  };

  // Update specific plot field handler
  const handlePlotChange = (plotId: string, field: keyof LandPlot, value: any) => {
    setPlots((prev) =>
      prev.map((p) => (p.id === plotId ? { ...p, [field]: value } : p))
    );
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation checks
    if (!firstName.trim() || !lastName.trim() || !fatherName.trim()) {
      setFormError('يرجى ملء كافة حقول اسم الفلاح (الاسم، اللقب، واسم الأب).');
      return;
    }
    if (!nationalId.trim()) {
      setFormError('يرجى إدخال رقم بطاقة التعريف الوطنية.');
      return;
    }
    if (!birthDate.trim()) {
      setFormError('يرجى إدخال تاريخ الميلاد.');
      return;
    }

    const newFarmer: Farmer = {
      id: initialFarmer?.id || `farmer-${Date.now()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fatherName: fatherName.trim(),
      birthDate,
      birthPlace: birthPlace.trim(),
      nationalId: nationalId.trim(),
      issueDate,
      depositDate,
      plots,
      createdAt: initialFarmer?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newFarmer);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      
      {/* Top Form Navigation Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
            title="رجوع إلى الصفحة الرئيسية"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {initialFarmer ? 'تعديل بيانات فلاح وملف المطابقة' : 'إضافة فلاح جديد وتفاصيل العقار'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              استكمال البيانات الشخصية والقطع الأرضية الفلاحية التابعة للفلاح
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-sm transition"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>💾 حفظ كافة البيانات</span>
          </button>
        </div>
      </div>

      {formError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-800 text-sm font-bold">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* SECTION 1: Farmer Personal Data */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-[#1b4332] text-white flex items-center gap-3 border-b border-[#2d6a4f]">
          <User className="w-5 h-5 text-emerald-300" />
          <h3 className="text-base font-bold">
            قسم 1: البيانات الشخصية للفلاح (تُملأ مرة واحدة)
          </h3>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* الاسم */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              الاسم <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="مثال: محمد"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-medium transition"
            />
          </div>

          {/* اللقب */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              اللقب <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="مثال: بن علي"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-medium transition"
            />
          </div>

          {/* اسم الأب */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              اسم الأب <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              placeholder="مثال: عبد القادر"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-medium transition"
            />
          </div>

          {/* تاريخ الميلاد */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              تاريخ الميلاد <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-medium transition"
            />
          </div>

          {/* مكان الميلاد */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              مكان الميلاد
            </label>
            <input
              type="text"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              placeholder="مثال: بسكرة"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-medium transition"
            />
          </div>

          {/* رقم بطاقة التعريف الوطنية */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              رقم بطاقة التعريف الوطنية <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              placeholder="رقم البطاقة (مثال: 109823...)"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-mono font-bold transition"
            />
          </div>

          {/* تاريخ الصدور */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              تاريخ الصدور
            </label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-medium transition"
            />
          </div>

          {/* تاريخ إيداع الملف الرئيسي */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              تاريخ إيداع الملف الرئيسي
            </label>
            <input
              type="date"
              value={depositDate}
              onChange={(e) => setDepositDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-medium transition"
            />
          </div>

        </div>
      </div>

      {/* SECTION 2: Dynamic Plot Repeater */}
      <div className="space-y-6">
        
        {/* Plot Section Header & Add Plot Button */}
        <div className="bg-[#1b4332] text-white rounded-2xl p-5 shadow-sm border border-[#2d6a4f] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2d6a4f] text-emerald-200 rounded-xl">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold">
                قسم 2: تفاصيل القطع الأرضية الفلاحية (تكرر حسب عدد القطع)
              </h3>
              <p className="text-xs text-slate-300">
                إجمالي القطع المضافة حالياً لهذا الفلاح: <strong className="text-emerald-300">{plots.length} قطعة</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddPlot}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2d6a4f] hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition active:scale-[0.98] border border-emerald-400/20"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>➕ إضافة قطعة أرض أخرى لهذا الفلاح</span>
          </button>
        </div>

        {/* Plots Loop */}
        {plots.map((plot, index) => (
          <div 
            key={plot.id}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:border-slate-300"
          >
            {/* Plot Card Header */}
            <div className="px-6 py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center">
                  #{index + 1}
                </span>
                <h4 className="font-bold text-slate-800 text-sm">
                  تفاصيل القطعة الأرضية رقم ({index + 1})
                </h4>
              </div>

              {plots.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemovePlot(plot.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition"
                  title="حذف هذه القطعة"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>حذف القطعة</span>
                </button>
              )}
            </div>

            {/* Plot Form Grid - 14 Specified Fields */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* 1. Google Earth Coordinates + Direct Link Button */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. إحداثيات القطعة (Google Earth)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={plot.coordinates}
                    onChange={(e) => handlePlotChange(plot.id, 'coordinates', e.target.value)}
                    placeholder={'مثال: 34.8516, 5.7281 أو 36°15\'14"N 6°35\'21"E'}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-mono transition"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => openGoogleEarth(plot.coordinates)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow transition shrink-0"
                    title="فتح الإحداثيات في Google Earth"
                  >
                    <Globe className="w-4 h-4" />
                    <span>🌍 فتح في Google Earth</span>
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  انقر على الزر لتجربة فتح الموقع مباشرة عبر خرائط Google Earth العالمية.
                </span>
              </div>

              {/* 2. المساحة المطلوبة للتسوية (هكتار) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  2. المساحة المطلوبة للتسوية (هكتار)
                </label>
                <input
                  type="text"
                  value={plot.requestedArea}
                  onChange={(e) => handlePlotChange(plot.id, 'requestedArea', e.target.value)}
                  placeholder="مثال: 12.5"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-bold transition"
                />
              </div>

              {/* 3. النشاط الفلاحي */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  3. النشاط الفلاحي
                </label>
                <select
                  value={plot.activity}
                  onChange={(e) => handlePlotChange(plot.id, 'activity', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-medium transition"
                >
                  <option value="حبوب">حبوب</option>
                  <option value="أشجار مثمرة">أشجار مثمرة</option>
                  <option value="خضروات">خضروات</option>
                  <option value="تربية الحيوانات">تربية الحيوانات</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>

              {/* 4. رقم وتاريخ محضر لجنة الدائرة */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  4. رقم وتاريخ محضر لجنة الدائرة
                </label>
                <input
                  type="text"
                  value={plot.circleProc}
                  onChange={(e) => handlePlotChange(plot.id, 'circleProc', e.target.value)}
                  placeholder="محضر رقم 42/2023 بتاريخ 2023/02/10"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-medium transition"
                />
              </div>

              {/* 5. المراجع المساحية (القسم / القطعة) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  5. المراجع المساحية (القسم / القطعة)
                </label>
                <input
                  type="text"
                  value={plot.cadastralRef}
                  onChange={(e) => handlePlotChange(plot.id, 'cadastralRef', e.target.value)}
                  placeholder="مثال: القسم 14 / القطعة 08"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-medium transition"
                />
              </div>

              {/* 6. طبيعة الملك */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  6. طبيعة الملك
                </label>
                <select
                  value={plot.ownershipNature}
                  onChange={(e) => handlePlotChange(plot.id, 'ownershipNature', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-medium transition"
                >
                  <option value="ملك الدولة خاص (البايليك)">ملك الدولة خاص (البايليك)</option>
                  <option value="ملك بلدية">ملك بلدية</option>
                  <option value="غير ممسوحة">غير ممسوحة</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>

              {/* 7. رقم وتاريخ المحضر الولائي */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  7. رقم وتاريخ المحضر الولائي
                </label>
                <input
                  type="text"
                  value={plot.wilayaProc}
                  onChange={(e) => handlePlotChange(plot.id, 'wilayaProc', e.target.value)}
                  placeholder="محضر رقم 115/2023 بتاريخ 2023/05/20"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-medium transition"
                />
              </div>

              {/* 8. قرار اللجنة الولائية */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  8. قرار اللجنة الولائية
                </label>
                <select
                  value={plot.wilayaDecision}
                  onChange={(e) => handlePlotChange(plot.id, 'wilayaDecision', e.target.value as WilayaDecision)}
                  className={`w-full px-3.5 py-2.5 border focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-bold transition ${
                    plot.wilayaDecision === 'مقبول' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
                    plot.wilayaDecision === 'مؤجل' ? 'bg-amber-50 border-amber-300 text-amber-800' :
                    'bg-rose-50 border-rose-300 text-rose-800'
                  }`}
                >
                  <option value="مقبول">مقبول</option>
                  <option value="مرفوض">مرفوض</option>
                  <option value="مؤجل">مؤجل</option>
                </select>
              </div>

              {/* 9. المساحة المقبولة للتسوية (هكتار) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  9. المساحة المقبولة للتسوية (هكتار)
                </label>
                <input
                  type="text"
                  value={plot.acceptedArea}
                  onChange={(e) => handlePlotChange(plot.id, 'acceptedArea', e.target.value)}
                  placeholder="مثال: 12.5"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-bold text-emerald-700 transition"
                />
              </div>

              {/* 10. رقم وتاريخ شهادة القبول/الرفض */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  10. رقم وتاريخ شهادة القبول/الرفض
                </label>
                <input
                  type="text"
                  value={plot.certInfo}
                  onChange={(e) => handlePlotChange(plot.id, 'certInfo', e.target.value)}
                  placeholder="شهادة رقم 304 بتاريخ 2023/06/01"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-medium transition"
                />
              </div>

              {/* 11. إنجاز الخبرة العقارية */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  11. إنجاز الخبرة العقارية
                </label>
                <select
                  value={plot.realEstateExpertise}
                  onChange={(e) => handlePlotChange(plot.id, 'realEstateExpertise', e.target.value as RealEstateExpertiseStatus)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-medium transition"
                >
                  <option value="منجزة">منجزة</option>
                  <option value="طور الإنجاز">طور الإنجاز</option>
                  <option value="لم تنجز">لم تنجز</option>
                </select>
              </div>

              {/* 12. ملف عقد الامتياز */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  12. ملف عقد الامتياز
                </label>
                <select
                  value={plot.concessionFile}
                  onChange={(e) => handlePlotChange(plot.id, 'concessionFile', e.target.value as ConcessionFileStatus)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-medium transition"
                >
                  <option value="تم الإيداع">تم الإيداع</option>
                  <option value="لم يتم الإيداع">لم يتم الإيداع</option>
                </select>
              </div>

              {/* 13. دفتر الشروط */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  13. دفتر الشروط
                </label>
                <select
                  value={plot.specificationsBook}
                  onChange={(e) => handlePlotChange(plot.id, 'specificationsBook', e.target.value as SpecificationsBookStatus)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-medium transition"
                >
                  <option value="تم الإمضاء">تم الإمضاء</option>
                  <option value="لم يتم">لم يتم</option>
                </select>
              </div>

              {/* 14. الحصول على عقد الامتياز (نعم، في طور الإنجاز، لا) */}
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-xs font-extrabold text-emerald-800 mb-1.5">
                  14. الحصول على عقد الامتياز *
                </label>
                <select
                  value={plot.concessionContractStatus}
                  onChange={(e) => handlePlotChange(plot.id, 'concessionContractStatus', e.target.value as ConcessionContractStatus)}
                  className={`w-full px-3.5 py-2.5 border focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-extrabold transition ${
                    plot.concessionContractStatus === 'نعم' ? 'bg-emerald-100 border-emerald-400 text-emerald-900' :
                    plot.concessionContractStatus === 'في طور الإنجاز' ? 'bg-sky-100 border-sky-400 text-sky-900' :
                    'bg-slate-100 border-slate-300 text-slate-700'
                  }`}
                >
                  <option value="نعم">نعم (تم تسليم العقد)</option>
                  <option value="في طور الإنجاز">في طور الإنجاز</option>
                  <option value="لا">لا (لم يتم التسليم)</option>
                </select>
              </div>

            </div>

          </div>
        ))}

        {/* Bottom Add Plot Button */}
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={handleAddPlot}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-900 text-emerald-400 font-bold text-sm border border-slate-700 shadow-lg transition active:scale-[0.98]"
          >
            <Plus className="w-5 h-5 text-emerald-400 stroke-[3]" />
            <span>➕ إضافة قطعة أرض أخرى لهذا الفلاح</span>
          </button>
        </div>

      </div>

      {/* Form Bottom Save Actions */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium text-slate-300">
            يرجى التأكد من صحة إحداثيات Google Earth ومراجع المحاضر الولائية قبل الحفظ.
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 transition active:scale-[0.98]"
          >
            <Save className="w-5 h-5" />
            <span>💾 حفظ كافة البيانات</span>
          </button>
        </div>
      </div>

    </form>
  );
};
