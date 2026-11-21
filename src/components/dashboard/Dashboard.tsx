import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  GitFork,
  FileText,
  Users,
  Car,
  Zap,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { formatCurrency, formatDateArabic, calculateDaysRemaining } from '../../utils/helpers';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  onOpenContractModal: (branchId: string, branchName: string) => void;
  onOpenBranchModal: () => void;
  onOpenEmployeeModal: () => void;
  onOpenVehicleModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  setActiveTab,
  onOpenContractModal,
  onOpenBranchModal,
  onOpenEmployeeModal,
  onOpenVehicleModal,
}) => {
  const {
    companies,
    branches,
    contracts,
    meters,
    facilities,
    vehicles,
    employees,
    selectedCompanyId,
    setSelectedBranchId,
    alerts,
    criticalAlertsCount,
    markInstallmentPaid,
  } = useApp();

  const currentCompany = companies.find(c => c.id === selectedCompanyId);
  const companyBranches = branches.filter(b => !selectedCompanyId || b.companyId === selectedCompanyId);
  const branchIds = new Set(companyBranches.map(b => b.id));

  const companyContracts = contracts.filter(c => branchIds.has(c.branchId));
  const companyEmployees = employees.filter(e => branchIds.has(e.branchId));
  const companyMeters = meters.filter(m => branchIds.has(m.branchId));
  const companyFacilities = facilities.filter(f => branchIds.has(f.branchId));
  const companyVehicles = vehicles.filter(v => !selectedCompanyId || v.companyId === selectedCompanyId);

  // حساب إجمالي قيمة الإيجارات السنوية
  const totalRentAmount = companyContracts.reduce((sum, c) => sum + c.totalAnnualAmount, 0);

  // استخراج الدفعات القادمة المستحقة
  interface UpcomingInstallment {
    contractId: string;
    branchId: string;
    branchName: string;
    contractNumber: string;
    paymentNumber: string;
    landlordName: string;
    installmentId: string;
    installmentNumber: number;
    amount: number;
    dueDate: string;
    status: 'paid' | 'pending' | 'overdue';
    daysRemaining: number;
  }

  const upcomingInstallments: UpcomingInstallment[] = [];
  const branchMap = new Map(branches.map(b => [b.id, b.name]));

  companyContracts.forEach(contract => {
    const branchName = branchMap.get(contract.branchId) || 'فرع';
    contract.installments.forEach(inst => {
      if (inst.status !== 'paid') {
        const { days } = calculateDaysRemaining(inst.dueDate);
        upcomingInstallments.push({
          contractId: contract.id,
          branchId: contract.branchId,
          branchName,
          contractNumber: contract.contractNumber,
          paymentNumber: contract.paymentNumber,
          landlordName: contract.landlordName,
          installmentId: inst.id,
          installmentNumber: inst.installmentNumber,
          amount: inst.amount,
          dueDate: inst.dueDate,
          status: inst.status,
          daysRemaining: days,
        });
      }
    });
  });

  // ترتيب الدفعات حسب الأقرب استحقاقاً
  upcomingInstallments.sort((a, b) => a.daysRemaining - b.daysRemaining);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* الترويسة وبطاقة الترحيب */}
      <div className="bg-gradient-to-r from-brand-800 via-brand-700 to-brand-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -left-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm mb-3">
                <Building2 className="w-3.5 h-3.5" />
                {currentCompany?.name || 'كافة الشركات'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                لوحة القيادة والمتابعة التشغيلية
              </h2>
              <p className="text-xs sm:text-sm text-brand-100 mt-1 max-w-xl">
                متابعة عقود الإيجار، الدفعات المستحقة، عدادات الخدمات، الأسطول ومواعيد انتهاء وثائق الموظفين
              </p>
            </div>

            {/* أزرار سريعة */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onOpenBranchModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-brand-800 text-xs font-bold shadow-sm hover:bg-brand-50 transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4 text-brand-600" />
                <span>فرع جديد</span>
              </button>

              <button
                onClick={onOpenEmployeeModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-sm transition-all active:scale-95 border border-white/20"
              >
                <Users className="w-4 h-4" />
                <span>موظف جديد</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* شريط التنبيهات العاجلة */}
      {alerts.length > 0 && (
        <div
          onClick={() => setActiveTab('alerts')}
          className={`cursor-pointer rounded-2xl p-4 border transition-all hover:shadow-md flex items-center justify-between ${
            criticalAlertsCount > 0
              ? 'bg-red-50/90 border-red-200 text-red-900'
              : 'bg-amber-50/90 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                criticalAlertsCount > 0 ? 'bg-red-500 text-white animate-bounce' : 'bg-amber-500 text-white'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold">
                يوجد {alerts.length} تنبيه نشط يتطلب اتخاذ إجراء
                {criticalAlertsCount > 0 && ` (${criticalAlertsCount} تنبيهات حرجة منتهية)`}
              </p>
              <p className="text-xs opacity-80 mt-0.5">
                دفعات إيجار مستحقة، إقامات، كروت عمل، شهادات صحية، أو استمارات سيارات قاربت على الانتهاء
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold shrink-0 mr-2">
            <span>عرض الكل</span>
            <ChevronLeft className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* بطاقات الإحصائيات (KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* الفروع */}
        <div
          onClick={() => setActiveTab('branches')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
            <GitFork className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-slate-900 block">
            {companyBranches.length}
          </span>
          <span className="text-xs text-slate-500 font-medium">الفروع النشطة</span>
        </div>

        {/* عقود الإيجار */}
        <div
          onClick={() => setActiveTab('branches')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-slate-900 block">
            {companyContracts.length}
          </span>
          <span className="text-xs text-slate-500 font-medium">عقود الإيجار</span>
        </div>

        {/* الموظفين */}
        <div
          onClick={() => setActiveTab('employees')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-slate-900 block">
            {companyEmployees.length}
          </span>
          <span className="text-xs text-slate-500 font-medium">الموظفون المسجلون</span>
        </div>

        {/* الأسطول */}
        <div
          onClick={() => setActiveTab('fleet')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
            <Car className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-slate-900 block">
            {companyVehicles.length}
          </span>
          <span className="text-xs text-slate-500 font-medium">مركبات الأسطول</span>
        </div>

        {/* العدادات */}
        <div
          onClick={() => setActiveTab('branches')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center mb-2">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-slate-900 block">
            {companyMeters.length}
          </span>
          <span className="text-xs text-slate-500 font-medium">عدادات الخدمات</span>
        </div>

        {/* مساكن العمال */}
        <div
          onClick={() => setActiveTab('branches')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-slate-900 block">
            {companyFacilities.length}
          </span>
          <span className="text-xs text-slate-500 font-medium">المنشآت والسكن</span>
        </div>

      </div>

      {/* قسم الدفعات القادمة لعقود الإيجار */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-600" />
            <h3 className="text-base font-bold text-slate-900">
              الدفعات المستحقة لعقود الإيجار (جدول السداد الآلي)
            </h3>
          </div>
          <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            إجمالي التزامات الإيجار السنوية: {formatCurrency(totalRentAmount)}
          </span>
        </div>

        {upcomingInstallments.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">جميع دفعات الإيجار مسددة بالكامل!</p>
            <p className="text-xs text-slate-500 mt-1">لا توجد أي دفعات مستحقة في الوقت الحالي.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="py-3 px-4 font-bold">الفرع</th>
                  <th className="py-3 px-4 font-bold">المؤجر وعقد الإيجار</th>
                  <th className="py-3 px-4 font-bold">رقم السداد (الفاتورة)</th>
                  <th className="py-3 px-4 font-bold">الدفعة</th>
                  <th className="py-3 px-4 font-bold">تاريخ الاستحقاق</th>
                  <th className="py-3 px-4 font-bold">المبلغ</th>
                  <th className="py-3 px-4 font-bold">الحالة</th>
                  <th className="py-3 px-4 font-bold text-center">إجراء السداد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcomingInstallments.slice(0, 5).map((inst) => (
                  <tr key={inst.installmentId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {inst.branchName}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{inst.landlordName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">عقد #{inst.contractNumber}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-brand-700">
                      {inst.paymentNumber}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      دفعة #{inst.installmentNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{formatDateArabic(inst.dueDate)}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{inst.dueDate}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {formatCurrency(inst.amount)}
                    </td>
                    <td className="py-3 px-4">
                      {inst.daysRemaining < 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800">
                          متأخرة ({Math.abs(inst.daysRemaining)} يوم)
                        </span>
                      ) : inst.daysRemaining <= 15 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          مستحقة قريباً ({inst.daysRemaining} يوم)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                          بعد {inst.daysRemaining} يوم
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          const ref = window.prompt('يرجى إدخال رقم إيصال أو مرجع التحويل:');
                          if (ref !== null) {
                            markInstallmentPaid(
                              inst.contractId,
                              inst.installmentId,
                              ref || 'مسدد',
                              new Date().toISOString().split('T')[0]
                            );
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm transition-all"
                      >
                        تسجيل السداد
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* قسم الفروع والمنشآت التابعة السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* الفروع المسجلة */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GitFork className="w-5 h-5 text-brand-600" />
              فروع الشركة الحالية
            </h3>
            <button
              onClick={() => setActiveTab('branches')}
              className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1"
            >
              <span>إدارة الفروع</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {companyBranches.map((branch) => {
              const branchContracts = contracts.filter(c => c.branchId === branch.id);
              const branchMeters = meters.filter(m => m.branchId === branch.id);
              const branchStaff = employees.filter(e => e.branchId === branch.id);

              return (
                <div
                  key={branch.id}
                  onClick={() => {
                    setSelectedBranchId(branch.id);
                    setActiveTab('branches');
                  }}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{branch.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{branch.city} - {branch.address}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-600 font-medium">
                      <span>📄 عقود: {branchContracts.length}</span>
                      <span>⚡ عدادات: {branchMeters.length}</span>
                      <span>👥 موظفين: {branchStaff.length}</span>
                    </div>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-slate-400" />
                </div>
              );
            })}
          </div>
        </div>

        {/* المنشآت التابعة ومساكن العمال */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-rose-600" />
              مساكن العمال والمرافق التابعة
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {companyFacilities.length} منشآت
            </span>
          </div>

          <div className="space-y-3">
            {companyFacilities.map((fac) => {
              const branchName = branchMap.get(fac.branchId) || '';
              const percent = fac.capacity && fac.currentOccupancy
                ? Math.round((fac.currentOccupancy / fac.capacity) * 100)
                : 0;

              return (
                <div
                  key={fac.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{fac.name}</h4>
                      <p className="text-xs text-slate-500">
                        تابع لـ: <span className="font-semibold text-brand-700">{branchName}</span> - {fac.address}
                      </p>
                    </div>
                    {fac.supervisorPhone && (
                      <a
                        href={`tel:${fac.supervisorPhone}`}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                      >
                        📞 المشرف: {fac.supervisorName || fac.supervisorPhone}
                      </a>
                    )}
                  </div>

                  {fac.capacity && (
                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                        <span>الإشغال: {fac.currentOccupancy} من {fac.capacity} عامل</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${percent > 90 ? 'bg-red-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, percent)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
