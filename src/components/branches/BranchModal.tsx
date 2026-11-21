import React, { useState } from 'react';
import { Branch } from '../../types';
import { X, GitFork } from 'lucide-react';

interface BranchModalProps {
  companyId: string;
  branch?: Branch;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Branch, 'id' | 'createdAt'>) => void;
}

export const BranchModal: React.FC<BranchModalProps> = ({
  companyId,
  branch,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(branch?.name || '');
  const [city, setCity] = useState(branch?.city || 'الرياض');
  const [address, setAddress] = useState(branch?.address || '');
  const [managerName, setManagerName] = useState(branch?.managerName || '');
  const [managerPhone, setManagerPhone] = useState(branch?.managerPhone || '');
  const [status, setStatus] = useState<Branch['status']>(branch?.status || 'active');
  const [notes, setNotes] = useState(branch?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !city || !address) return;

    onSave({
      companyId,
      name,
      city,
      address,
      managerName,
      managerPhone,
      status,
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
            <GitFork className="w-5 h-5 text-brand-600" />
            {branch ? 'تعديل بيانات الفرع' : 'إضافة فرع جديد للشركة'}
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
              اسم الفرع *
            </label>
            <input
              type="text"
              required
              placeholder="مثال: فرع الرياض - حي العليا"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                المدينة *
              </label>
              <input
                type="text"
                required
                placeholder="الرياض، جدة، الدمام..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                حالة الفرع
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Branch['status'])}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white font-medium"
              >
                <option value="active">🟢 فرع نشط وعامل</option>
                <option value="inactive">🔴 فرع مغلق أو مؤقت</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              العنوان التفصيلي للفرع *
            </label>
            <input
              type="text"
              required
              placeholder="الحي، اسم الشارع، رقم المبنى أو المركز"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                اسم مدير الفرع
              </label>
              <input
                type="text"
                placeholder="اسم المسؤول"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم هاتف مدير الفرع
              </label>
              <input
                type="tel"
                placeholder="05XXXXXXXX"
                value={managerPhone}
                onChange={(e) => setManagerPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ملاحظات
            </label>
            <textarea
              rows={2}
              placeholder="أي تفاصيل خاصة بالفرع..."
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
              حفظ الفرع
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
