import React, { useState } from 'react';
import { UtilityMeter } from '../../types';
import { X, Zap, Droplets } from 'lucide-react';

interface MeterModalProps {
  branchId: string;
  branchName: string;
  meter?: UtilityMeter;
  isOpen: boolean;
  onClose: () => void;
  onSave: (meterData: Omit<UtilityMeter, 'id' | 'createdAt'>) => void;
}

export const MeterModal: React.FC<MeterModalProps> = ({
  branchId,
  branchName,
  meter,
  isOpen,
  onClose,
  onSave,
}) => {
  const [type, setType] = useState<'electricity' | 'water'>(meter?.type || 'electricity');
  const [meterNumber, setMeterNumber] = useState(meter?.meterNumber || '');
  const [accountNumber, setAccountNumber] = useState(meter?.accountNumber || '');
  const [paymentNumber, setPaymentNumber] = useState(meter?.paymentNumber || '');
  const [locationDescription, setLocationDescription] = useState(meter?.locationDescription || '');
  const [lastBillAmount, setLastBillAmount] = useState<number>(meter?.lastBillAmount || 0);
  const [notes, setNotes] = useState(meter?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meterNumber || !accountNumber || !paymentNumber) return;

    onSave({
      branchId,
      type,
      meterNumber,
      accountNumber,
      paymentNumber,
      locationDescription: locationDescription || (type === 'electricity' ? 'عداد كهرباء' : 'عداد مياه'),
      lastBillAmount: Number(lastBillAmount) || undefined,
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
              {meter ? 'تعديل عداد الخدمة' : 'إضافة عداد جديد للفرع'}
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
          
          {/* نوع العداد */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              نوع الخدمة *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('electricity')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
                  type === 'electricity'
                    ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>عداد كهرباء ⚡</span>
              </button>

              <button
                type="button"
                onClick={() => setType('water')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
                  type === 'water'
                    ? 'bg-blue-50 border-blue-400 text-blue-800 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Droplets className="w-4 h-4 text-blue-500" />
                <span>عداد مياه 💧</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم العداد (المسجل على الجهاز) *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: E-998811"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم الحساب (رقم الاشتراك) *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: 100889922"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              رقم السداد (المستخدم في البنك / تطبيق سداد) *
            </label>
            <input
              type="text"
              required
              placeholder="مثال: 0011008899"
              value={paymentNumber}
              onChange={(e) => setPaymentNumber(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              وصف موقع العداد وتغذيته
            </label>
            <input
              type="text"
              placeholder="مثال: العداد الرئيسي للفرع، عداد سكن العمال بالملحق، عداد المستودع"
              value={locationDescription}
              onChange={(e) => setLocationDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              متوسط قيمة آخر فاتورة (ريال)
            </label>
            <input
              type="number"
              placeholder="0"
              value={lastBillAmount || ''}
              onChange={(e) => setLastBillAmount(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ملاحظات
            </label>
            <textarea
              rows={2}
              placeholder="أي ملاحظات حول الصيانة أو جهة التغذية"
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
              حفظ العداد
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
