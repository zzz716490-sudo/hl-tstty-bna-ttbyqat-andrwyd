import React, { useState } from 'react';
import { TelecomAccount } from '../../types';
import { X, Phone, Wifi } from 'lucide-react';

interface TelecomModalProps {
  companyId: string;
  branchId?: string;
  telecom?: TelecomAccount;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<TelecomAccount, 'id' | 'createdAt'>) => void;
}

export const TelecomModal: React.FC<TelecomModalProps> = ({
  companyId,
  branchId,
  telecom,
  isOpen,
  onClose,
  onSave,
}) => {
  const [provider, setProvider] = useState<TelecomAccount['provider']>(telecom?.provider || 'STC');
  const [phoneNumber, setPhoneNumber] = useState(telecom?.phoneNumber || '');
  const [accountNumber, setAccountNumber] = useState(telecom?.accountNumber || '');
  const [paymentNumber, setPaymentNumber] = useState(telecom?.paymentNumber || '');
  const [lineType, setLineType] = useState<TelecomAccount['lineType']>(telecom?.lineType || 'landline');
  const [monthlyCost, setMonthlyCost] = useState<number>(telecom?.monthlyCost || 0);
  const [assignedTo, setAssignedTo] = useState(telecom?.assignedTo || '');
  const [notes, setNotes] = useState(telecom?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !paymentNumber) return;

    onSave({
      companyId,
      branchId,
      provider,
      phoneNumber,
      accountNumber,
      paymentNumber,
      lineType,
      monthlyCost: Number(monthlyCost) || undefined,
      assignedTo,
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
            <Phone className="w-5 h-5 text-brand-600" />
            {telecom ? 'تعديل خط الهاتف / حساب السداد' : 'تسجيل خط هاتف أو اشتراك سداد'}
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                شركة الاتصالات / المشغل *
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as TelecomAccount['provider'])}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white font-medium"
              >
                <option value="STC">الاتصالات السعودية (STC)</option>
                <option value="Mobily">موبايلي (Mobily)</option>
                <option value="Zain">زين (Zain)</option>
                <option value="Salam">سلام (Salam)</option>
                <option value="Go">جو (Go)</option>
                <option value="Other">مشغل آخر</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                نوع الخط والخدمة *
              </label>
              <select
                value={lineType}
                onChange={(e) => setLineType(e.target.value as TelecomAccount['lineType'])}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white font-medium"
              >
                <option value="landline">☎️ هاتف أرضي / فاكس</option>
                <option value="mobile">📱 خط جوال أعمال</option>
                <option value="data_sim">📡 شريحة بيانات 5G/4G</option>
                <option value="fiber">🌐 فايبر إنترنت ضوئي</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم الهاتف / الشريحة *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: 0114567890 أو 05XXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم الحساب
              </label>
              <input
                type="text"
                placeholder="رقم حساب العميل"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم حساب السداد (رمز الفاتورة / سداد) *
              </label>
              <input
                type="text"
                required
                placeholder="رقم سداد الفاتورة بالبنك"
                value={paymentNumber}
                onChange={(e) => setPaymentNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                التكلفة الشهرية التقديرية (ريال)
              </label>
              <input
                type="number"
                placeholder="0"
                value={monthlyCost || ''}
                onChange={(e) => setMonthlyCost(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              مخصص لـ (الموقع أو الموظف)
            </label>
            <input
              type="text"
              placeholder="مثال: راوتر الاستقبال، هاتف مدير الفرع، راوتر سكن العمال"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ملاحظات
            </label>
            <textarea
              rows={2}
              placeholder="تفاصيل الباقة، سرعة النت، موعد الفاتورة الشهري..."
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
              حفظ الخط
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
