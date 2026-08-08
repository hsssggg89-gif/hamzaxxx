import * as XLSX from 'xlsx';
import { Farmer } from '../types';

/**
 * Helper to acquire XLSX instance either from import or CDN global window
 */
function getXLSX() {
  if (typeof window !== 'undefined' && (window as any).XLSX) {
    return (window as any).XLSX;
  }
  return XLSX;
}

/**
 * Export ALL farmers and all their land plots to an Excel file (.xlsx)
 */
export function exportAllFarmersToExcel(farmers: Farmer[]) {
  const xlsxLib = getXLSX();
  
  const flattenedData: any[] = [];

  farmers.forEach((farmer) => {
    if (farmer.plots && farmer.plots.length > 0) {
      farmer.plots.forEach((plot, index) => {
        flattenedData.push({
          'رقم بطاقة التعريف الوطنية': farmer.nationalId,
          'الاسم': farmer.firstName,
          'اللقب': farmer.lastName,
          'اسم الأب': farmer.fatherName,
          'تاريخ الميلاد': farmer.birthDate,
          'مكان الميلاد': farmer.birthPlace,
          'تاريخ الصدور': farmer.issueDate,
          'تاريخ إيداع الملف الرئيسي': farmer.depositDate,
          'رقم القطعة': `قطعة رقم ${index + 1}`,
          'إحداثيات القطعة (Google Earth)': plot.coordinates,
          'المساحة المطلوبة (هكتار)': plot.requestedArea,
          'النشاط الفلاحي': plot.activity,
          'رقم وتاريخ محضر لجنة الدائرة': plot.circleProc,
          'المراجع المساحية (القسم/القطعة)': plot.cadastralRef,
          'طبيعة الملك': plot.ownershipNature,
          'رقم وتاريخ المحضر الولائي': plot.wilayaProc,
          'قرار اللجنة الولائية': plot.wilayaDecision,
          'المساحة المقبولة (هكتار)': plot.acceptedArea,
          'رقم وتاريخ شهادة القبول/الرفض': plot.certInfo,
          'إنجاز الخبرة العقارية': plot.realEstateExpertise,
          'ملف عقد الامتياز': plot.concessionFile,
          'دفتر الشروط': plot.specificationsBook,
          'الحصول على عقد الامتياز': plot.concessionContractStatus,
        });
      });
    } else {
      // Farmer without plots
      flattenedData.push({
        'رقم بطاقة التعريف الوطنية': farmer.nationalId,
        'الاسم': farmer.firstName,
        'اللقب': farmer.lastName,
        'اسم الأب': farmer.fatherName,
        'تاريخ الميلاد': farmer.birthDate,
        'مكان الميلاد': farmer.birthPlace,
        'تاريخ الصدور': farmer.issueDate,
        'تاريخ إيداع الملف الرئيسي': farmer.depositDate,
        'رقم القطعة': 'لا توجد قطع',
        'إحداثيات القطعة (Google Earth)': '-',
        'المساحة المطلوبة (هكتار)': '0',
        'النشاط الفلاحي': '-',
        'رقم وتاريخ محضر لجنة الدائرة': '-',
        'المراجع المساحية (القسم/القطعة)': '-',
        'طبيعة الملك': '-',
        'رقم وتاريخ المحضر الولائي': '-',
        'قرار اللجنة الولائية': '-',
        'المساحة المقبولة (هكتار)': '0',
        'رقم وتاريخ شهادة القبول/الرفض': '-',
        'إنجاز الخبرة العقارية': '-',
        'ملف عقد الامتياز': '-',
        'دفتر الشروط': '-',
        'الحصول على عقد الامتياز': '-',
      });
    }
  });

  const worksheet = xlsxLib.utils.json_to_sheet(flattenedData);

  // Set RTL property on worksheet if supported
  if (!worksheet['!views']) worksheet['!views'] = [];
  worksheet['!views'].push({ RTL: true });

  // Auto column widths
  const colWidths = [
    { wch: 22 }, // National ID
    { wch: 15 }, // First Name
    { wch: 15 }, // Last Name
    { wch: 15 }, // Father Name
    { wch: 14 }, // DOB
    { wch: 15 }, // POB
    { wch: 14 }, // Issue Date
    { wch: 18 }, // Deposit Date
    { wch: 12 }, // Plot #
    { wch: 22 }, // Coordinates
    { wch: 16 }, // Req Area
    { wch: 18 }, // Activity
    { wch: 26 }, // Circle proc
    { wch: 22 }, // Cadastral
    { wch: 24 }, // Ownership
    { wch: 26 }, // Wilaya proc
    { wch: 16 }, // Decision
    { wch: 16 }, // Acc Area
    { wch: 24 }, // Cert
    { wch: 16 }, // Expertise
    { wch: 16 }, // Concession File
    { wch: 16 }, // Spec Book
    { wch: 20 }, // Contract Status
  ];
  worksheet['!cols'] = colWidths;

  const workbook = xlsxLib.utils.book_new();
  xlsxLib.utils.book_append_sheet(workbook, worksheet, 'سجل المطابقة الكلي');

  // Format timestamp for filename
  const dateStr = new Date().toISOString().slice(0, 10);
  xlsxLib.writeFile(workbook, `سجل_مطابقة_الأراضي_الفلاحية_${dateStr}.xlsx`);
}

/**
 * Export a SINGLE farmer's file to Excel
 */
export function exportSingleFarmerToExcel(farmer: Farmer) {
  const xlsxLib = getXLSX();

  const farmerSummary = [
    { 'البيان': 'الاسم واللقب', 'القيمة': `${farmer.firstName} ${farmer.lastName}` },
    { 'البيان': 'اسم الأب', 'القيمة': farmer.fatherName },
    { 'البيان': 'تاريخ ومكان الميلاد', 'القيمة': `${farmer.birthDate} - ${farmer.birthPlace}` },
    { 'البيان': 'رقم بطاقة التعريف الوطنية', 'القيمة': farmer.nationalId },
    { 'البيان': 'تاريخ الصدور', 'القيمة': farmer.issueDate },
    { 'البيان': 'تاريخ إيداع الملف الرئيسي', 'القيمة': farmer.depositDate },
    { 'البيان': 'إجمالي عدد القطع', 'القيمة': farmer.plots.length },
  ];

  const plotsRows = farmer.plots.map((plot, idx) => ({
    'رقم القطعة': `القطعة ${idx + 1}`,
    'إحداثيات القطعة': plot.coordinates,
    'المساحة المطلوبة (هكتار)': plot.requestedArea,
    'النشاط الفلاحي': plot.activity,
    'محضر لجنة الدائرة': plot.circleProc,
    'المراجع المساحية': plot.cadastralRef,
    'طبيعة الملك': plot.ownershipNature,
    'المحضر الولائي': plot.wilayaProc,
    'قرار اللجنة الولائية': plot.wilayaDecision,
    'المساحة المقبولة (هكتار)': plot.acceptedArea,
    'شهادة القبول/الرفض': plot.certInfo,
    'الخبرة العقارية': plot.realEstateExpertise,
    'ملف عقد الامتياز': plot.concessionFile,
    'دفتر الشروط': plot.specificationsBook,
    'الحصول على عقد الامتياز': plot.concessionContractStatus,
  }));

  const workbook = xlsxLib.utils.book_new();

  // Sheet 1: Personal info
  const wsFarmer = xlsxLib.utils.json_to_sheet(farmerSummary);
  wsFarmer['!cols'] = [{ wch: 26 }, { wch: 35 }];
  if (!wsFarmer['!views']) wsFarmer['!views'] = [];
  wsFarmer['!views'].push({ RTL: true });
  xlsxLib.utils.book_append_sheet(workbook, wsFarmer, 'بيانات الفلاح');

  // Sheet 2: Plots
  const wsPlots = xlsxLib.utils.json_to_sheet(plotsRows);
  if (!wsPlots['!views']) wsPlots['!views'] = [];
  wsPlots['!views'].push({ RTL: true });
  xlsxLib.utils.book_append_sheet(workbook, wsPlots, 'تفاصيل القطع الأرضية');

  const cleanName = `${farmer.firstName}_${farmer.lastName}_${farmer.nationalId}`.replace(/\s+/g, '_');
  xlsxLib.writeFile(workbook, `ملف_فلاح_${cleanName}.xlsx`);
}
