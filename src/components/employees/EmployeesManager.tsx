import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Plus,
  Search,
  Filter,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  HeartPulse,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { calculateDaysRemaining, formatDateArabic, exportToExcel } from '../../utils/helpers';

interface EmployeesManagerProps {
  onOpenAddEmployee: () => void;
}

export const EmployeesManager: React.FC<EmployeesManagerProps> = ({ onOpenAddEmployee }) => {
  const { employees, branches, selectedCompanyId, deleteEmployee } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranchId, setFilterBranchId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'critical' | 'warning' | 'valid'>('all');

  const companyBranches = branches.filter(b => !selectedCompanyId || b.companyId === selectedCompanyId);
  const branchIds = new Set(companyBranches.map(b => b.id));
  const branchMap = new Map(branches.map(b => [b.id, b.name]));

  const companyEmployees = employees.filter(e => branchIds.has(e.branchId));

  // الفلترة والبحث
  const filteredEmployees = companyEmployees.filter(emp => {
    // بحث نصي
    const matchSearch =
      emp.name.includes(searchTerm) ||
      emp.iqamaNumber.includes(searchTerm) ||
      emp.jobTitle.includes(searchTerm) ||
      (emp.phone && emp.phone.includes(searchTerm));

    // فلترة الفرع
    const matchBranch = filterBranchId === 'all' || emp.branchId === filterBranchId;

    // فلترة حالة الصلاحية
    if (filterStatus === 'all') return matchSearch && matchBranch;

    const iqamaRes = calculateDaysRemaining(emp.iqamaExpiryDate);
    const workRes = calculateDaysRemaining(emp.workCardExpiryDate);
    const healthRes = calculateDaysRemaining(emp.healthCertificateExpiryDate);

    const isCritical =
      iqamaRes.days <= 7 ||
      (emp.workCardExpiryDate && workRes.days <= 7) ||
      (emp.healthCertificateExpiryDate && healthRes.days <= 7);

    const isWarning =
      !isCritical &&
      (iqamaRes.days <= 30 ||
        (emp.workCardExpiryDate && workRes.days <= 30) ||
        (emp.healthCertificateExpiryDate && healthRes.days <= 30));

    if (filterStatus === 'critical') return matchSearch && matchBranch && isCritical;
    if (filterStatus === 'warning') return matchSearch && matchBranch && isWarning;
    if (filterStatus === 'valid') return matchSearch && matchBranch && !isCritical && !isWarning;

    return matchSearch && matchBranch;
  });

  const handleExportExcel = () => {
    const excelData = companyEmployees.map(emp => {
      const iqama = calculateDaysRemaining(emp.iqamaExpiryDate);
      const work = calculateDaysRemaining(emp.workCardExpiryDate);
      const health = calculateDaysRemaining(emp.healthCertificateExpiryDate);

      return {
        'اسم الموظف': emp.name,
        'المسمى الوظيفي': emp.jobTitle,
        'الجنسية': emp.nationality,
        'الفرع': branchMap.get(emp.branchId) || '-',
        'رقم الإقامة': emp.iqamaNumber,
        'تاريخ انتهاء الإقامة': emp.iqamaExpiryDate,
        'حالة الإقامة': iqama.label,
        'رقم كرت العمل': emp.workCardNumber || '-',
        'تاريخ انتهاء كرت العمل': emp.workCardExpiryDate || '-',
        'حالة كرت العمل': work.label,
        'رقم الشهادة الصحية': emp.healthCertificateNumber || '-',
        'تاريخ انتهاء الشهادة الصحية': emp.healthCertificateExpiryDate || '-',
        'حالة الشهادة الصحية': health.label,
        'الجوال': emp.phone || '-',
      };
    });

    exportToExcel(excelData, 'موظفو_الشركة_والوثائق', 'الموظفون');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600" />
            إدارة الموظفين والوثائق الرسمية
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            متابعة دقيقة لتواريخ انتهاء الإقامات، كروت العمل، والشهادات الصحية مع تنبيهات استباقية
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-all shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>تصدير Excel</span>
          </button>

          <button
            onClick={onOpenAddEmployee}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة موظف جديد</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* البحث */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث بالاسم، رقم الإقامة، المهنة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* فلتر الفرع */}
          <div>
            <select
              value={filterBranchId}
              onChange={(e) => setFilterBranchId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none font-medium"
            >
              <option value="all">كافة الفروع ({companyEmployees.length} موظف)</option>
              {companyBranches.map((br) => (
                <option key={br.id} value={br.id}>
                  فرع {br.name}
                </option>
              ))}
            </select>
          </div>

          {/* فلتر حالة الصلاحية */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none font-bold"
            >
              <option value="all">كافة حالات الوثائق</option>
              <option value="critical">🔴 وثائق منتهية أو قاربت جداً (خلال 7 أيام)</option>
              <option value="warning">🟡 وثائق تنتهي خلال شهر (30 يوم)</option>
              <option value="valid">🟢 وثائق سارية</option>
            </select>
          </div>

        </div>
      </div>

      {/* Employees Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-3.5 px-4 font-bold">الموظف والمهنة</th>
                <th className="py-3.5 px-4 font-bold">الفرع</th>
                <th className="py-3.5 px-4 font-bold">
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                    بطاقة الإقامة
                  </span>
                </th>
                <th className="py-3.5 px-4 font-bold">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    كرت العمل
                  </span>
                </th>
                <th className="py-3.5 px-4 font-bold">
                  <span className="flex items-center gap-1">
                    <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
                    الشهادة الصحية
                  </span>
                </th>
                <th className="py-3.5 px-4 font-bold">الجوال</th>
                <th className="py-3.5 px-4 font-bold text-center">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    لا يوجد موظفون مطابقون لشروط البحث والفلترة
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const iqamaRes = calculateDaysRemaining(emp.iqamaExpiryDate);
                  const workRes = calculateDaysRemaining(emp.workCardExpiryDate);
                  const healthRes = calculateDaysRemaining(emp.healthCertificateExpiryDate);

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                      
                      {/* الاسم والمهنة */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{emp.name}</div>
                        <div className="text-[11px] text-slate-500">{emp.jobTitle} - {emp.nationality}</div>
                      </td>

                      {/* الفرع */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {branchMap.get(emp.branchId) || '-'}
                      </td>

                      {/* الإقامة */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-800">{emp.iqamaNumber}</div>
                        <span className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          iqamaRes.days < 0
                            ? 'bg-red-100 text-red-800'
                            : iqamaRes.days <= 15
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {iqamaRes.label}
                        </span>
                      </td>

                      {/* كرت العمل */}
                      <td className="py-3.5 px-4">
                        {emp.workCardExpiryDate ? (
                          <>
                            <div className="font-mono text-slate-700 text-[11px]">{emp.workCardNumber || '-'}</div>
                            <span className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              workRes.days < 0
                                ? 'bg-red-100 text-red-800'
                                : workRes.days <= 15
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {workRes.label}
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* الشهادة الصحية */}
                      <td className="py-3.5 px-4">
                        {emp.healthCertificateExpiryDate ? (
                          <>
                            <div className="font-mono text-slate-700 text-[11px]">{emp.healthCertificateNumber || '-'}</div>
                            <span className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              healthRes.days < 0
                                ? 'bg-red-100 text-red-800'
                                : healthRes.days <= 15
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {healthRes.label}
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-400 text-[11px]">غير مطلوبة</span>
                        )}
                      </td>

                      {/* الجوال */}
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {emp.phone || '-'}
                      </td>

                      {/* حذف */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من حذف الموظف ${emp.name}؟`)) {
                              deleteEmployee(emp.id);
                            }
                          }}
                          className="text-slate-400 hover:text-red-600 font-semibold transition-colors"
                        >
                          حذف
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
