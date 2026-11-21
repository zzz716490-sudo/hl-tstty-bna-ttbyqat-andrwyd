import React, { useState } from 'react';
import { SubFacility } from '../../types';
import { X, Home, Warehouse, Building } from 'lucide-react';

interface FacilityModalProps {
  branchId: string;
  branchName: string;
  facility?: SubFacility;
  isOpen: boolean;
  onClose: () => void;
  onSave: (facData: Omit<SubFacility, 'id' | 'createdAt'>) => void;
}

export const FacilityModal: React.FC<FacilityModalProps> = ({
  branchId,
  branchName,
  facility,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(facility?.name || '');
  const [type, setType] = useState<SubFacility['type']>(facility?.type || 'worker_housing');
  const [address, setAddress] = useState(facility?.address || '');
  const [capacity, setCapacity] = useState<number>(facility?.capacity || 20);
  const [currentOccupancy, setCurrentOccupancy] = useState<number>(facility?.currentOccupancy || 0);
  const [supervisorName, setSupervisorName] = useState(facility?.supervisorName || '');
  const [supervisorPhone, setSupervisorPhone] = useState(facility?.supervisorPhone || '');
  const [rentAmount, setRentAmount] = useState<number>(facility?.rentAmount || 0);
  const [notes, setNotes] = useState(facility?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;

    onSave({
      branchId,
      name,
      type,
      address,
      capacity: Number(capacity) || undefined,
      currentOccupancy: Number(currentOccupancy) || undefined,
      supervisorName,
      supervisorPhone,
      rentAmount: Number(rentAmount) || undefined,
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
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {facility ? 'تعديل المنشأة / سكن العمال' : 'إضافة منشأة أو سكن عمال تابع للفرع'}
            </h3>
            <p className="text-xs text-slate-500">
              فرع: <span className="font-semibold text-brand-600">{branchName}</span>
            </p>
          </div>
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
              اسم المنشأة أو السكن *
            </label>
            <input
              type="text"
              required
              placeholder="مثال: سكن العمال مبنى A، مستودع المواد المركزية..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                نوع المنشأة التابعة *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as SubFacility['type'])}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white font-medium"
              >
                <option value="worker_housing">🏠 سكن عمال</option>
                <option value="warehouse">📦 مستودع بضائع / قطع</option>
                <option value="sub_office">🏢 مكتب فرعي / ملحق</option>
                <option value="workshop">🛠️ ورشة صيانة</option>
                <option value="other">📍 أخرى</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                العنوان والموقع *
              </label>
              <input
                type="text"
                required
                placeholder="الحي، اسم الشارع، رقم المبنى"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {type === 'worker_housing' && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  السعة الاستيعابية (عدد الأفراد/الأسرة)
                </label>
                <input
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  العدد الفعلي المقيم حالياً
                </label>
                <input
                  type="number"
                  min="0"
                  value={currentOccupancy}
                  onChange={(e) => setCurrentOccupancy(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                اسم مشرف السكن / المنشأة
              </label>
              <input
                type="text"
                placeholder="اسم الشخص المسؤول"
                value={supervisorName}
                onChange={(e) => setSupervisorName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                هاتف المشرف
              </label>
              <input
                type="tel"
                placeholder="05XXXXXXXX"
                value={supervisorPhone}
                onChange={(e) => setSupervisorPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ملاحظات
            </label>
            <textarea
              rows={2}
              placeholder="تفاصيل التجهيزات، عدد الغرف، حالة النظافة والسلامة..."
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
              حفظ المنشأة
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
