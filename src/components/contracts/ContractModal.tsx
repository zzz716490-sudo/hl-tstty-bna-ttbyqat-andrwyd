import React, { useState, useEffect } from 'react';
import { LeaseContract, PaymentFrequency } from '../../types';
import { generateInstallments, formatCurrency, fileToBase64 } from '../../utils/helpers';
import { X, Calendar, DollarSign, FileText, CheckCircle, Upload, AlertCircle } from 'lucide-react';

interface ContractModalProps {
  branchId: string;
  branchName: string;
  contract?: LeaseContract;
  isOpen: boolean;
  onClose: () => void;
  onSave: (contractData: Omit<LeaseContract, 'id' | 'createdAt'>) => void;
}

export const ContractModal: React.FC<ContractModalProps> = ({
  branchId,
  branchName,
  contract,
  isOpen,
  onClose,
  onSave,
}) => {
  const [contractNumber, setContractNumber] = useState(contract?.contractNumber || '');
  const [landlordName, setLandlordName] = useState(contract?.landlordName || '');
  const [landlordPhone, setLandlordPhone] = useState(contract?.landlordPhone || '');
  const [paymentNumber, setPaymentNumber] = useState(contract?.paymentNumber || '');
  const [startDate, setStartDate] = useState(contract?.startDate || new Date().toISOString().split('T')[0]);
  
  // افتراضي سنة كاملة من تاريخ البداية
  const [endDate, setEndDate] = useState(() => {
    if (contract?.endDate) return contract.endDate;
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  });

  const [totalAnnualAmount, setTotalAnnualAmount] = useState<number>(contract?.totalAnnualAmount || 60000);
  const [frequency, setFrequency] = useState<PaymentFrequency>(contract?.frequency || 'quarterly');
  const [notes, setNotes] = useState(contract?.notes || '');
  
  const [contractDocumentName, setContractDocumentName] = useState(contract?.contractDocumentName || '');
  const [contractDocumentData, setContractDocumentData] = useState(contract?.contractDocumentData || '');

  // معاينة حية للدفعات المستنتجة تلقائياً
  const previewInstallments = generateInstallments(
    'preview',
    startDate,
    endDate,
    totalAnnualAmount,
    frequency
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setContractDocumentName(file.name);
        setContractDocumentData(base64);
      } catch (err) {
        console.error('File read error:', err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractNumber || !landlordName || totalAnnualAmount <= 0) return;

    // توليد الدفعات الفعلية للعقد
    const installments = generateInstallments(
      contract?.id || `cont-${Date.now()}`,
      startDate,
      endDate,
      totalAnnualAmount,
      frequency
    );

    onSave({
      branchId,
      contractNumber,
      landlordName,
      landlordPhone,
      paymentNumber,
      startDate,
      endDate,
      totalAnnualAmount,
      frequency,
      installments,
      contractDocumentName,
      contractDocumentData,
      notes,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {contract ? 'تعديل عقد الإيجار' : 'تسجيل عقد إيجار جديد'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* بيانات العقد والمؤجر */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم العقد (إيجار) *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: EJ-2026-9901"
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم السداد (حساب فاتورة الإيجار / سداد) *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: 9200887711"
                value={paymentNumber}
                onChange={(e) => setPaymentNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                اسم المؤجر / المالك *
              </label>
              <input
                type="text"
                required
                placeholder="اسم الشخص أو الشركة العقارية"
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم هاتف المؤجر
              </label>
              <input
                type="tel"
                placeholder="05XXXXXXXX"
                value={landlordPhone}
                onChange={(e) => setLandlordPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* المدة والمبالغ */}
          <div className="bg-brand-50/60 p-4 rounded-xl border border-brand-100 space-y-4">
            <h4 className="text-xs font-bold text-brand-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-600" />
              المدة ودورية الدفعات وقيمة العقد
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  تاريخ بداية العقد *
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  تاريخ نهاية العقد *
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  إجمالي قيمة العقد السنوية (ريال) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={totalAnnualAmount}
                  onChange={(e) => setTotalAnnualAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  دورية الدفعات (توليد آلي) *
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as PaymentFrequency)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white font-medium"
                >
                  <option value="monthly">شهرياً (12 دفعة في السنة)</option>
                  <option value="quarterly">ربع سنوي (4 دفعات كل 3 أشهر)</option>
                  <option value="semi-annual">نصف سنوي (دفعتان كل 6 أشهر)</option>
                  <option value="annual">سنوياً (دفعة واحدة)</option>
                </select>
              </div>
            </div>
          </div>

          {/* الاستنتاج التلقائي للدفعات (Live Calculation Preview) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                جدول الدفعات المستنتج تلقائياً ({previewInstallments.length} دفعات):
              </span>
              <span className="text-xs font-semibold text-brand-700">
                قيمة كل دفعة: {previewInstallments[0] ? formatCurrency(previewInstallments[0].amount) : '-'}
              </span>
            </div>

            <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
              {previewInstallments.map((inst) => (
                <div
                  key={inst.installmentNumber}
                  className="flex items-center justify-between text-xs bg-white px-3 py-2 rounded-lg border border-slate-200 text-slate-700"
                >
                  <span className="font-medium">
                    الدفعة #{inst.installmentNumber}
                  </span>
                  <span className="font-mono text-slate-500">
                    📅 تاريخ الاستحقاق: {inst.dueDate}
                  </span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(inst.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* نسخة العقد (Upload Document) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              نسخة من عقد الإيجار (صورة أو ملف PDF)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-medium text-slate-700 transition-colors">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>اختر ملف أو صورة العقد</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {contractDocumentName && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 truncate">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span className="truncate">{contractDocumentName}</span>
                </div>
              )}
            </div>
          </div>

          {/* ملاحظات */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ملاحظات إضافية
            </label>
            <textarea
              rows={2}
              placeholder="شروط خاصة، أرقام تواصل، تفاصيل الشيكات..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Footer Buttons */}
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
              حفظ العقد وتوليد الدفعات
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
