import React, { useState } from 'react';
import { Employee } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, UserCheck, ShieldCheck, HeartPulse } from 'lucide-react';

interface EmployeeModalProps {
  companyId: string;
  employee?: Employee;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Employee, 'id' | 'createdAt'>) => void;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  companyId,
  employee,
  isOpen,
  onClose,
  onSave,
}) => {
  const { branches, facilities } = useApp();
  const companyBranches = branches.filter(b => b.companyId === companyId);
  const companyFacilities = facilities.filter(f => companyBranches.some(b => b.id === f.branchId));

  const [name, setName] = useState(employee?.name || '');
  const [jobTitle, setJobTitle] = useState(employee?.jobTitle || '');
  const [nationality, setNationality] = useState(employee?.nationality || 'سعودي');
  const [phone, setPhone] = useState(employee?.phone || '');
  const [branchId, setBranchId] = useState(employee?.branchId || companyBranches[0]?.id || '');
  const [facilityId, setFacilityId] = useState(employee?.facilityId || '');
  
  // الإقامة
  const [iqamaNumber, setIqamaNumber] = useState(employee?.iqamaNumber || '');
  const [iqamaExpiryDate, setIqamaExpiryDate] = useState(employee?.iqamaExpiryDate || '');

  // كرت العمل
  const [workCardNumber, setWorkCardNumber] = useState(employee?.workCardNumber || '');
  const [workCardExpiryDate, setWorkCardExpiryDate] = useState(employee?.workCardExpiryDate || '');

  // الشهادة الصحية
  const [healthCertificateNumber, setHealthCertificateNumber] = useState(employee?.healthCertificateNumber || '');
  const [healthCertificateExpiryDate, setHealthCertificateExpiryDate] = useState(employee?.healthCertificateExpiryDate || '');

  const [salary, setSalary] = useState<number>(employee?.salary || 0);
  const [status, setStatus] = useState<Employee['status']>(employee?.status || 'active');
  const [notes, setNotes] = useState(employee?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !branchId || !iqamaNumber || !iqamaExpiryDate) return;

    onSave({
      companyId,
      branchId,
      facilityId: facilityId || undefined,
      name,
      jobTitle: jobTitle || 'موظف',
      nationality,
      phone,
      iqamaNumber,
      iqamaExpiryDate,
      workCardNumber: workCardNumber || undefined,
      workCardExpiryDate: workCardExpiryDate || undefined,
      healthCertificateNumber: healthCertificateNumber || undefined,
      healthCertificateExpiryDate: healthCertificateExpiryDate || undefined,
      salary: Number(salary) || undefined,
      status,
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
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {employee ? 'تعديل بيانات الموظف والوثائق' : 'إضافة موظف جديد وتسجيل وثائقه'}
            </h3>
            <p className="text-xs text-slate-500">
              تسجيل الإقامة، كرت العمل، والشهادة الصحية مع تتبع تواريخ الانتهاء
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* المعلومات العامة */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                اسم الموظف الثلاثي *
              </label>
              <input
                type="text"
                required
                placeholder="الاسم الكامل"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                المسمى الوظيفي *
              </label>
              <input
                type="text"
                required
                placeholder="محاسب، فني، عامل، سائق..."
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                الفرع التابع له *
              </label>
              <select
                required
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white font-medium"
              >
                {companyBranches.map((br) => (
                  <option key={br.id} value={br.id}>
                    {br.name} ({br.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                الجنسية
              </label>
              <input
                type="text"
                placeholder="سعودي، مصري، يمني، هندي..."
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                سكن العمال المقيم فيه (اختياري)
              </label>
              <select
                value={facilityId}
                onChange={(e) => setFacilityId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
              >
                <option value="">-- بدون سكن تابع --</option>
                {companyFacilities.map((fac) => (
                  <option key={fac.id} value={fac.id}>
                    🏠 {fac.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* قسم الإقامة وكرت العمل */}
          <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-100 space-y-3">
            <h4 className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-sky-700" />
              بيانات الإقامة والهوية
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  رقم الإقامة / الهوية الوطنية *
                </label>
                <input
                  type="text"
                  required
                  placeholder="2XXXXXXXXX أو 1XXXXXXXXX"
                  value={iqamaNumber}
                  onChange={(e) => setIqamaNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  تاريخ انتهاء الإقامة *
                </label>
                <input
                  type="date"
                  required
                  value={iqamaExpiryDate}
                  onChange={(e) => setIqamaExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>

          {/* قسم كرت العمل */}
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-100 space-y-3">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              بيانات كرت العمل (رخصة العمل)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  رقم كرت العمل
                </label>
                <input
                  type="text"
                  placeholder="رقم رخصة العمل من قوى"
                  value={workCardNumber}
                  onChange={(e) => setWorkCardNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  تاريخ انتهاء كرت العمل
                </label>
                <input
                  type="date"
                  value={workCardExpiryDate}
                  onChange={(e) => setWorkCardExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>

          {/* قسم الشهادة الصحية */}
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 space-y-3">
            <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-emerald-700" />
              الشهادة الصحية (للمطاعم والتموينات والأنشطة الصحية)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  رقم الشهادة الصحية (من منصة بلدي)
                </label>
                <input
                  type="text"
                  placeholder="رقم الكرت الصحي"
                  value={healthCertificateNumber}
                  onChange={(e) => setHealthCertificateNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  تاريخ انتهاء الشهادة الصحية
                </label>
                <input
                  type="date"
                  value={healthCertificateExpiryDate}
                  onChange={(e) => setHealthCertificateExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>

          {/* الراتب والحالة والملاحظات */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                الراتب الأساسي (ريال)
              </label>
              <input
                type="number"
                placeholder="0"
                value={salary || ''}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                حالة الموظف
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Employee['status'])}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white font-medium"
              >
                <option value="active">🟢 على رأس العمل (نشط)</option>
                <option value="on_leave">🟡 في إجازة</option>
                <option value="terminated">🔴 منتهي خدماته</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ملاحظات
            </label>
            <textarea
              rows={2}
              placeholder="أي تفاصيل أو وثائق إضافية..."
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
              حفظ الموظف
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
