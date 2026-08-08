import React, { useState, useEffect } from 'react';
import { Farmer, ActiveView } from './types';
import { getStoredFarmers, saveFarmers, resetSampleFarmers } from './utils/helpers';
import { exportAllFarmersToExcel, exportSingleFarmerToExcel } from './utils/excelExport';
import { Header } from './components/Header';
import { FarmerTable } from './components/FarmerTable';
import { FarmerForm } from './components/FarmerForm';
import { FarmerDetailModal } from './components/FarmerDetailModal';
import { Toast } from './components/Toast';

export default function App() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [editingFarmer, setEditingFarmer] = useState<Farmer | null>(null);
  const [viewingFarmer, setViewingFarmer] = useState<Farmer | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Load stored farmers on initial render
  useEffect(() => {
    const loaded = getStoredFarmers();
    setFarmers(loaded);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  // Save or update farmer
  const handleSaveFarmer = (savedFarmer: Farmer) => {
    setFarmers((prev) => {
      const existsIndex = prev.findIndex((f) => f.id === savedFarmer.id);
      let updatedList: Farmer[];
      if (existsIndex >= 0) {
        updatedList = [...prev];
        updatedList[existsIndex] = savedFarmer;
      } else {
        updatedList = [savedFarmer, ...prev];
      }
      saveFarmers(updatedList);
      return updatedList;
    });

    showToast('تم حفظ كافة البيانات ونماذج القطع بنجاح 💾', 'success');
    setActiveView('dashboard');
    setEditingFarmer(null);
  };

  // Delete farmer
  const handleDeleteFarmer = (farmerId: string, farmerName: string) => {
    if (window.confirm(`هل أنت تأكد من إرادة حذف الملف الكامل للفلاح (${farmerName})؟ لا يمكن التراجع عن هذا الإجراء.`)) {
      setFarmers((prev) => {
        const updated = prev.filter((f) => f.id !== farmerId);
        saveFarmers(updated);
        return updated;
      });
      showToast(`تم حذف ملف الفلاح (${farmerName}) من السجل 🗑️`, 'info');
      if (viewingFarmer?.id === farmerId) {
        setViewingFarmer(null);
      }
    }
  };

  // Export All
  const handleExportAll = () => {
    if (farmers.length === 0) {
      showToast('السجل فارغ، لا توجد بيانات للتصدير.', 'error');
      return;
    }
    exportAllFarmersToExcel(farmers);
    showToast('تم تصدير سجل كافة الفلاحين والقطع الأرضية إلى ملف Excel بنجاح 📊', 'success');
  };

  // Export Single
  const handleExportSingle = (farmer: Farmer) => {
    exportSingleFarmerToExcel(farmer);
    showToast(`تم تصدير ملف الفلاح (${farmer.firstName} ${farmer.lastName}) إلى Excel 📥`, 'success');
  };

  // Reset sample data
  const handleResetData = () => {
    const defaultData = resetSampleFarmers();
    setFarmers(defaultData);
    showToast('تم إعادة إعمار السجل بالبيانات النموذجية الأصلية 🔄', 'info');
  };

  return (
    <div className="min-h-screen bg-[#f0f4f1] text-slate-800 flex flex-col font-['Tajawal',sans-serif]" dir="rtl">
      
      {/* Top Administrative Header */}
      <Header
        farmers={farmers}
        onResetData={handleResetData}
        onExportAll={handleExportAll}
        onAddNewFarmer={() => {
          setEditingFarmer(null);
          setActiveView('form');
        }}
        activeView={activeView}
      />

      {/* Main Body Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeView === 'dashboard' ? (
          <FarmerTable
            farmers={farmers}
            onAddNewFarmer={() => {
              setEditingFarmer(null);
              setActiveView('form');
            }}
            onExportAll={handleExportAll}
            onViewDetails={(farmer) => setViewingFarmer(farmer)}
            onDeleteFarmer={handleDeleteFarmer}
          />
        ) : (
          <FarmerForm
            initialFarmer={editingFarmer}
            onSave={handleSaveFarmer}
            onCancel={() => {
              setActiveView('dashboard');
              setEditingFarmer(null);
            }}
          />
        )}

      </main>

      {/* Detail Modal */}
      <FarmerDetailModal
        farmer={viewingFarmer}
        onClose={() => setViewingFarmer(null)}
        onEdit={(farmer) => {
          setEditingFarmer(farmer);
          setActiveView('form');
        }}
        onExportSingle={handleExportSingle}
      />

      {/* Footer info */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-medium">
            نظام إدارة ومطابقة الأراضي الفلاحية © {new Date().getFullYear()} — الجمهورية الجزائرية الديمقراطية الشعبية
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            جميع البيانات محفوظة ومخزنة محلّياً في المتصفح بكل أمان.
          </p>
        </div>
      </footer>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}
