import React, { useState } from 'react';
import { Branch, LeaseContract, UtilityMeter, SubFacility, TelecomAccount } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  ChevronRight,
  FileText,
  Zap,
  Droplets,
  Home,
  Phone,
  Users,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Upload,
  Calendar,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { formatCurrency, formatDateArabic, calculateDaysRemaining } from '../../utils/helpers';

interface BranchDetailViewProps {
  branch: Branch;
  onBack: () => void;
  onOpenContractModal: (branchId: string, branchName: string) => void;
  onOpenMeterModal: (branchId: string, branchName: string) => void;
  onOpenFacilityModal: (branchId: string, branchName: string) => void;
  onOpenTelecomModal: (branchId: string, companyId: string) => void;
}

export const BranchDetailView: React.FC<BranchDetailViewProps> = ({
  branch,
  onBack,
  onOpenContractModal,
  onOpenMeterModal,
  onOpenFacilityModal,
  onOpenTelecomModal,
}) => {
  const {
    contracts,
    meters,
    facilities,
    telecomAccounts,
    employees,
    markInstallmentPaid,
    markInstallmentUnpaid,
    deleteContract,
    deleteMeter,
    deleteFacility,
    deleteTelecomAccount,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'contracts' | 'meters' | 'facilities' | 'telecom' | 'staff'>('contracts');

  const branchContracts = contracts.filter(c => c.branchId === branch.id);
  const branchMeters = meters.filter(m => m.branchId === branch.id);
  const branchFacilities = facilities.filter(f => f.branchId === branch.id);
  const branchTelecom = telecomAccounts.filter(t => t.branchId === branch.id);
  const branchStaff = employees.filter(e => e.branchId === branch.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Bar with Back Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors shadow-sm"
          title="رجوع لقائمة الفروع"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{branch.name}</h2>
          <p className="text-xs text-slate-500">
            {branch.city} - {branch.address} | المدير: {branch.managerName} ({branch.managerPhone})
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('contracts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all ${
            activeSubTab === 'contracts'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>عقود الإيجار والدفعات ({branchContracts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('meters')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all ${
            activeSubTab === 'meters'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>عدادات الكهرباء والماء ({branchMeters.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('facilities')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all ${
            activeSubTab === 'facilities'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>المنشآت ومساكن العمال ({branchFacilities.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('telecom')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all ${
            activeSubTab === 'telecom'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>الهواتف وحسابات السداد ({branchTelecom.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('staff')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all ${
            activeSubTab === 'staff'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>موظفو الفرع ({branchStaff.length})</span>
        </button>
      </div>

      {/* 1. تبويب عقود الإيجار والدفعات المستنتجة */}
      {activeSubTab === 'contracts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              عقود الإيجار المسجلة للفرع
            </h3>
            <button
              onClick={() => onOpenContractModal(branch.id, branch.name)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل عقد إيجار جديد</span>
            </button>
          </div>

          {branchContracts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300 p-6">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">لم يتم تسجيل عقد إيجار لهذا الفرع بعد</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                سجل بيانات العقد ليتم استنتاج وتوليد جدول الدفعات ومواعيد السداد تلقائياً.
              </p>
              <button
                onClick={() => onOpenContractModal(branch.id, branch.name)}
                className="px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-brand-700"
              >
                تسجيل العقد الآن
              </button>
            </div>
          ) : (
            branchContracts.map((contract) => {
              const contractExpiry = calculateDaysRemaining(contract.endDate);
              const paidCount = contract.installments.filter(i => i.status === 'paid').length;
              const totalCount = contract.installments.length;

              return (
                <div
                  key={contract.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5"
                >
                  {/* رأس بطاقة العقد */}
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-brand-50 text-brand-700 px-2.5 py-1 rounded-lg border border-brand-200">
                          عقد #{contract.contractNumber}
                        </span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                          contractExpiry.days <= 30
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {contractExpiry.label}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-2">
                        المؤجر: {contract.landlordName} ({contract.landlordPhone || 'لا يوجد هاتف مسجل'})
                      </h4>
                    </div>

                    <div className="text-left">
                      <span className="text-xs text-slate-500 block">رقم السداد (فاتورة الإيجار):</span>
                      <span className="text-sm font-mono font-black text-brand-700 bg-slate-100 px-3 py-1 rounded-lg inline-block mt-0.5">
                        {contract.paymentNumber}
                      </span>
                    </div>
                  </div>

                  {/* ملخص العقد المالي */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-2xl">
                      <span className="text-slate-500 block">قيمة العقد السنوية</span>
                      <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                        {formatCurrency(contract.totalAnnualAmount)}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl">
                      <span className="text-slate-500 block">فترة العقد</span>
                      <span className="text-xs font-medium text-slate-800 mt-0.5 block">
                        من {contract.startDate} إلى {contract.endDate}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl">
                      <span className="text-slate-500 block">دورية الدفعات</span>
                      <span className="text-xs font-bold text-brand-700 mt-0.5 block">
                        {contract.frequency === 'monthly' && 'شهرياً (12 دفعة)'}
                        {contract.frequency === 'quarterly' && 'ربع سنوي (4 دفعات)'}
                        {contract.frequency === 'semi-annual' && 'نصف سنوي (دفعتان)'}
                        {contract.frequency === 'annual' && 'سنوي (دفعة واحدة)'}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl">
                      <span className="text-slate-500 block">حالة السداد الكلية</span>
                      <span className="text-xs font-bold text-emerald-700 mt-0.5 block">
                        مسدد {paidCount} من {totalCount} دفعة
                      </span>
                    </div>
                  </div>

                  {/* نسخة العقد المرفقة إن وجدت */}
                  {contract.contractDocumentData && (
                    <div className="flex items-center justify-between p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span>نسخة العقد المرفقة: {contract.contractDocumentName}</span>
                      </div>
                      <a
                        href={contract.contractDocumentData}
                        download={contract.contractDocumentName || 'contract.png'}
                        className="px-3 py-1 bg-white border border-emerald-300 rounded-lg text-emerald-700 font-bold hover:bg-emerald-100 transition-colors"
                      >
                        معاينة / تنزيل العقد
                      </a>
                    </div>
                  )}

                  {/* جدول الدفعات المستنتجة */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-brand-600" />
                      جدول الدفعات المستنتجة آلياً ({contract.installments.length} دفعات):
                    </h5>

                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                            <th className="py-2.5 px-3 font-bold">الدفعة</th>
                            <th className="py-2.5 px-3 font-bold">تاريخ الاستحقاق</th>
                            <th className="py-2.5 px-3 font-bold">قيمة الدفعة</th>
                            <th className="py-2.5 px-3 font-bold">رقم السداد</th>
                            <th className="py-2.5 px-3 font-bold">الحالة</th>
                            <th className="py-2.5 px-3 font-bold">بيانات السداد</th>
                            <th className="py-2.5 px-3 font-bold text-center">إجراء</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {contract.installments.map((inst) => {
                            const { days } = calculateDaysRemaining(inst.dueDate);
                            const isPaid = inst.status === 'paid';

                            return (
                              <tr key={inst.id} className="hover:bg-slate-50/70">
                                <td className="py-2.5 px-3 font-bold text-slate-900">
                                  #{inst.installmentNumber}
                                </td>
                                <td className="py-2.5 px-3 font-medium">
                                  {formatDateArabic(inst.dueDate)}
                                  <span className="text-[10px] text-slate-400 block font-mono">{inst.dueDate}</span>
                                </td>
                                <td className="py-2.5 px-3 font-bold text-slate-900">
                                  {formatCurrency(inst.amount)}
                                </td>
                                <td className="py-2.5 px-3 font-mono font-bold text-brand-700">
                                  {contract.paymentNumber}
                                </td>
                                <td className="py-2.5 px-3">
                                  {isPaid ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                      <CheckCircle className="w-3 h-3" />
                                      تم السداد
                                    </span>
                                  ) : days < 0 ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800">
                                      متأخرة ({Math.abs(days)} يوم)
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                                      مستحقة ({days} يوم)
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-slate-600">
                                  {isPaid ? (
                                    <div>
                                      <span className="font-semibold">{inst.paymentReference || 'سداد إلكتروني'}</span>
                                      <span className="text-[10px] text-slate-400 block">{inst.paidDate}</span>
                                    </div>
                                  ) : (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  {isPaid ? (
                                    <button
                                      onClick={() => markInstallmentUnpaid(contract.id, inst.id)}
                                      className="text-[10px] text-slate-500 hover:text-red-600 underline font-medium"
                                    >
                                      إلغاء السداد
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        const ref = window.prompt('أدخل رقم إيصال أو مرجع التحويل:');
                                        if (ref !== null) {
                                          markInstallmentPaid(
                                            contract.id,
                                            inst.id,
                                            ref || 'سداد مباشر',
                                            new Date().toISOString().split('T')[0]
                                          );
                                        }
                                      }}
                                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm"
                                    >
                                      سداد
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* حذف العقد */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        if (window.confirm('هل أنت متأكد من حذف هذا العقد وكافة دفعاته؟')) {
                          deleteContract(contract.id);
                        }
                      }}
                      className="text-xs text-red-600 hover:text-red-700 font-semibold"
                    >
                      حذف العقد
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* 2. تبويب عدادات الكهرباء والماء */}
      {activeSubTab === 'meters' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                عدادات الكهرباء والمياه الخاصة بالفرع
              </h3>
              <p className="text-xs text-slate-500">
                تسجيل عدة عدادات لكل فرع بأرقام الحسابات وأرقام السداد لتسهيل الدفع
              </p>
            </div>
            <button
              onClick={() => onOpenMeterModal(branch.id, branch.name)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة عداد جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {branchMeters.map((meter) => {
              const isElec = meter.type === 'electricity';

              return (
                <div
                  key={meter.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        isElec ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {isElec ? <Zap className="w-5 h-5" /> : <Droplets className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {isElec ? 'عداد كهرباء ⚡' : 'عداد مياه 💧'}
                        </h4>
                        <span className="text-xs text-slate-500">{meter.locationDescription}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm('هل تريد حذف هذا العداد؟')) deleteMeter(meter.id);
                      }}
                      className="text-xs text-slate-400 hover:text-red-600"
                    >
                      حذف
                    </button>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">رقم السداد (للبنك):</span>
                      <span className="font-mono font-black text-brand-700 text-sm">{meter.paymentNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">رقم الحساب:</span>
                      <span className="font-mono font-bold text-slate-800">{meter.accountNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">رقم العداد المسجل:</span>
                      <span className="font-mono text-slate-700">{meter.meterNumber}</span>
                    </div>
                    {meter.lastBillAmount && (
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                        <span className="text-slate-500">آخر فاتورة:</span>
                        <span className="font-bold text-slate-900">{formatCurrency(meter.lastBillAmount)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. تبويب المنشآت التابعة ومساكن العمال */}
      {activeSubTab === 'facilities' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                المنشآت ومساكن العمال التابعة للفرع
              </h3>
              <p className="text-xs text-slate-500">
                تسجيل السكن، المستودعات، وطاقتها الاستيعابية
              </p>
            </div>
            <button
              onClick={() => onOpenFacilityModal(branch.id, branch.name)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة منشأة أو سكن</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {branchFacilities.map((fac) => (
              <div
                key={fac.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{fac.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{fac.address}</p>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 text-slate-700">
                    {fac.type === 'worker_housing' && '🏠 سكن عمال'}
                    {fac.type === 'warehouse' && '📦 مستودع'}
                    {fac.type === 'sub_office' && '🏢 مكتب فرعي'}
                    {fac.type === 'workshop' && '🛠️ ورشة'}
                  </span>
                </div>

                {fac.capacity && (
                  <div className="bg-slate-50 p-3 rounded-2xl space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span>الإشغال الفعلي:</span>
                      <span>{fac.currentOccupancy || 0} من {fac.capacity} أفراد</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full bg-brand-600"
                        style={{ width: `${Math.min(100, ((fac.currentOccupancy || 0) / fac.capacity) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-600">
                    المشرف: <span className="font-semibold text-slate-800">{fac.supervisorName || '-'}</span> ({fac.supervisorPhone || '-'})
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm('هل تريد حذف هذه المنشأة؟')) deleteFacility(fac.id);
                    }}
                    className="text-slate-400 hover:text-red-600"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. تبويب أرقام الهواتف وحسابات السداد */}
      {activeSubTab === 'telecom' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              خطوط الهاتف واشتراكات الاتصالات
            </h3>
            <button
              onClick={() => onOpenTelecomModal(branch.id, branch.companyId)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة خط هاتف / حساب سداد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {branchTelecom.map((tel) => (
              <div
                key={tel.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-sky-50 text-sky-700">
                    {tel.provider}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {tel.lineType === 'landline' && '☎️ ثابت'}
                    {tel.lineType === 'mobile' && '📱 جوال'}
                    {tel.lineType === 'data_sim' && '📡 بيانات'}
                    {tel.lineType === 'fiber' && '🌐 فايبر'}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block">رقم الهاتف / الشريحة:</span>
                  <span className="text-base font-mono font-bold text-slate-900">{tel.phoneNumber}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl text-xs space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">رقم السداد:</span>
                    <span className="font-bold text-brand-700">{tel.paymentNumber}</span>
                  </div>
                  {tel.accountNumber && (
                    <div className="flex justify-between text-slate-600">
                      <span>رقم الحساب:</span>
                      <span>{tel.accountNumber}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 truncate max-w-[150px]">{tel.assignedTo || 'الفرع'}</span>
                  <button
                    onClick={() => {
                      if (window.confirm('هل تريد حذف هذا الخط؟')) deleteTelecomAccount(tel.id);
                    }}
                    className="text-slate-400 hover:text-red-600"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. تبويب موظفي الفرع */}
      {activeSubTab === 'staff' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            الموظفون المعينون في هذا الفرع ({branchStaff.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {branchStaff.map((emp) => {
              const iqamaRes = calculateDaysRemaining(emp.iqamaExpiryDate);

              return (
                <div
                  key={emp.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{emp.name}</h4>
                      <p className="text-xs text-slate-500">{emp.jobTitle} - {emp.nationality}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                      iqamaRes.days <= 15 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      إقامة: {iqamaRes.label}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 font-mono pt-1">
                    <div>رقم الإقامة: {emp.iqamaNumber}</div>
                    {emp.phone && <div>الجوال: {emp.phone}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
