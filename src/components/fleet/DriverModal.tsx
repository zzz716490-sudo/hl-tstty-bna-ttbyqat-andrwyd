import React, { useState } from 'react';
import { Driver } from '../../types';
import { X, User, Award } from 'lucide-react';

interface DriverModalProps {
  driver?: Driver;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Driver, 'id' | 'createdAt'>) => void;
}

export const DriverModal: React.FC<DriverModalProps> = ({
  driver,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(driver?.name || '');
  const [iqamaNumber, setIqamaNumber] = useState(driver?.iqamaNumber || '');
  const [licenseNumber, setLicenseNumber] = useState(driver?.licenseNumber || '');
  const [licenseExpiryDate, setLicenseExpiryDate] = useState(driver?.licenseExpiryDate || '');
  const [phone, setPhone] = useState(driver?.phone || '');
  const [notes, setNotes] = useState(driver?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !licenseNumber || !licenseExpiryDate) return;

    onSave({
      name,
      iqamaNumber,
      licenseNumber,
      licenseExpiryDate,
      phone,
      notes,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-600" />
            {driver ? 'تعديل بيانات السائق' : 'تسجيل سائق جديد'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              اسم السائق الكامل *
            </label>
            <input
              type="text"
              required
              placeholder="الاسم الثلاثي"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم الإقامة / الهوية
              </label>
              <input
                type="text"
                placeholder="2XXXXXXXXX"
                value={iqamaNumber}
                onChange={(e) => setIqamaNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم الجوال
              </label>
              <input
                type="tel"
                placeholder="05XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-amber-900 mb-1">
                رقم رخصة القيادة *
              </label>
              <input
                type="text"
                required
                placeholder="رقم الرخصة"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-900 mb-1">
                تاريخ انتهاء رخصة القيادة *
              </label>
              <input
                type="date"
                required
                value={licenseExpiryDate}
                onChange={(e) => setLicenseExpiryDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ملاحظات
            </label>
            <textarea
              rows={2}
              placeholder="فئة الرخصة (نقل ثقيل، خصوصي، عمومي)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-colors"
            >
              حفظ السائق
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
