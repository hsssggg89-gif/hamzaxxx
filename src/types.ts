export type WilayaDecision = 'مقبول' | 'مرفوض' | 'مؤجل';
export type RealEstateExpertiseStatus = 'منجزة' | 'طور الإنجاز' | 'لم تنجز';
export type ConcessionFileStatus = 'تم الإيداع' | 'لم يتم الإيداع';
export type SpecificationsBookStatus = 'تم الإمضاء' | 'لم يتم';
export type ConcessionContractStatus = 'نعم' | 'في طور الإنجاز' | 'لا';

export interface LandPlot {
  id: string;
  coordinates: string; // إحداثيات القطعة (Google Earth Coordinates)
  requestedArea: string; // المساحة المطلوبة للتسوية (هكتار)
  activity: string; // النشاط الفلاحي (حبوب، أشجار مثمرة، خضروات، تربية الحيوانات، أخرى)
  circleProc: string; // رقم وتاريخ محضر لجنة الدائرة
  cadastralRef: string; // المراجع المساحية (القسم / القطعة)
  ownershipNature: string; // طبيعة الملك (ملك الدولة خاص/البايليك، ملك بلدية، غير ممسوحة، أخرى)
  wilayaProc: string; // رقم وتاريخ المحضر الولائي
  wilayaDecision: WilayaDecision; // قرار اللجنة الولائية (مقبول، مرفوض، مؤجل)
  acceptedArea: string; // المساحة المقبولة للتسوية (هكتار)
  certInfo: string; // رقم وتاريخ شهادة القبول/الرفض
  realEstateExpertise: RealEstateExpertiseStatus; // إنجاز الخبرة العقارية (منجزة، طور الإنجاز، لم تنجز)
  concessionFile: ConcessionFileStatus; // ملف عقد الامتياز (تم الإيداع، لم يتم الإيداع)
  specificationsBook: SpecificationsBookStatus; // دفتر الشروط (تم الإمضاء، لم يتم)
  concessionContractStatus: ConcessionContractStatus; // الحصول على عقد الامتياز (نعم، في طور الإنجاز، لا)
}

export interface Farmer {
  id: string;
  firstName: string; // الاسم
  lastName: string; // اللقب
  fatherName: string; // اسم الأب
  birthDate: string; // تاريخ الميلاد
  birthPlace: string; // مكان الميلاد
  nationalId: string; // رقم بطاقة التعريف الوطنية
  issueDate: string; // تاريخ الصدور
  depositDate: string; // تاريخ إيداع الملف الرئيسي
  plots: LandPlot[]; // قائمة القطع الأرضية
  createdAt: string;
  updatedAt: string;
}

export type ActiveView = 'dashboard' | 'form';
