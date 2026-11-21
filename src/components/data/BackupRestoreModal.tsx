import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Database, Download, Upload, RefreshCw, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { exportToExcel } from '../../utils/helpers';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({ isOpen, onClose }) => {
  const {
    exportDatabaseJson,
    importDatabaseJson,
    resetToDefaults,
    companies,
    branches,
    contracts,
    meters,
    facilities,
    employees,
    vehicles,
    telecomAccounts,
  } = useApp();

  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleDownloadBackup = () => {
    const jsonStr = exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_corporate_app_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const success = importDatabaseJson(content);
          if (success) {
            setImportStatus('تم استيراد واسترجاع قاعدة البيانات بنجاح! ✅');
            setTimeout(() => {
              setImportStatus(null);
              onClose();
            }, 1500);
          } else {
            setImportStatus('خطأ في صيغة الملف، يرجى التأكد من اختيار ملف نسخ احتياطي سليم ❌');
          }
        } catch (err) {
          setImportStatus('فشل قراءة الملف ❌');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExportFullExcel = () => {
    const branchesData = branches.map(b => ({
      'اسم الفرع': b.name,
      'المدينة': b.city,
      'العنوان': b.address,
      'اسم المدير': b.managerName,
      'هاتف المدير': b.managerPhone,
      'الحالة': b.status,
    }));
    exportToExcel(branchesData, 'فروع_الشركات', 'الفروع');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-brand-600" />
            النسخ الاحتياطي وتصدير البيانات
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {importStatus && (
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-center text-slate-800">
              {importStatus}
            </div>
          )}

          {/* تنزيل نسخة احتياطية كاملة */}
          <div className="bg-brand-50/70 p-4 rounded-2xl border border-brand-100 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-brand-900">حفظ نسخة احتياطية كاملة (JSON)</h4>
              <p className="text-[11px] text-brand-700 mt-0.5">
                تنزيل ملف يحتوي على كافة الشركات، الفروع، العقود، والوثائق.
              </p>
            </div>
            <button
              onClick={handleDownloadBackup}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>تنزيل النسخة</span>
            </button>
          </div>

          {/* استعادة نسخة احتياطية */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">استعادة بيانات سابقة (JSON)</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                رفع ملف نسخة احتياطية واسترجاع كافة البيانات فوراً.
              </p>
            </div>
            <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs cursor-pointer shadow-sm">
              <Upload className="w-4 h-4 text-slate-500" />
              <span>اختيار ملف</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* تصدير جداول Excel */}
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-emerald-900">تصدير تقرير شامل إلى Excel</h4>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                تصدير بيانات الفروع والعقود كملف إكسل للمحاسبة والمراجعة.
              </p>
            </div>
            <button
              onClick={handleExportFullExcel}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>تصدير Excel</span>
            </button>
          </div>

          {/* استعادة البيانات التجريبية الافتراضية */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              إعادة تعيين البيانات للعينات الافتراضية الأولية:
            </span>
            <button
              onClick={() => {
                if (window.confirm('هل تريد إعادة تعيين البيانات للبيانات الافتراضية الأصلية؟')) {
                  resetToDefaults();
                  onClose();
                }
              }}
              className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>استعادة الافتراضي</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
