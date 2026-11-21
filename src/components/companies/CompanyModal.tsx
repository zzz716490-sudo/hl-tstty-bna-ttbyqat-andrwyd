import React, { useState } from 'react';
import { Company } from '../../types';
import { X, Building2 } from 'lucide-react';

interface CompanyModalProps {
  company?: Company;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Company, 'id' | 'createdAt'>) => void;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({
  company,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(company?.name || '');
  const [commercialRegNo, setCommercialRegNo] = useState(company?.commercialRegNo || '');
  const [taxNumber, setTaxNumber] = useState(company?.taxNumber || '');
  const [phone, setPhone] = useState(company?.phone || '');
  const [email, setEmail] = useState(company?.email || '');
  const [address, setAddress] = useState(company?.address || '');
  const [notes, setNotes] = useState(company?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !commercialRegNo || !phone) return;

    onSave({
      name,
      commercialRegNo,
      taxNumber,
      phone,
      email,
      address,
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
            <Building2 className="w-5 h-5 text-brand-600" />
            {company ? 'تعديل بيانات الشركة' : 'إضافة شركة جديدة'}
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
              اسم الشركة التجاري *
            </label>
            <input
              type="text"
              required
              placeholder="مثال: شركة الرواد للمقاولات"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم السجل التجاري (CR) *
              </label>
              <input
                type="text"
                required
                placeholder="1010XXXXXX"
                value={commercialRegNo}
                onChange={(e) => setCommercialRegNo(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                الرقم الضريبي (VAT)
              </label>
              <input
                type="text"
                placeholder="300XXXXXXXXXXXX"
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم الهاتف الرئيسي *
              </label>
              <input
                type="tel"
                required
                placeholder="011XXXXXXX أو 05XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                placeholder="info@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              العنوان الوطني / المقر الرئيسي
            </label>
            <input
              type="text"
              placeholder="المدينة، الحي، الشارع"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ملاحظات
            </label>
            <textarea
              rows={2}
              placeholder="أي تفاصيل أو تصنيفات إضافية..."
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
              حفظ الشركة
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
