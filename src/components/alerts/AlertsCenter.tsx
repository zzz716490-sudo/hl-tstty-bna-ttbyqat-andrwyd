import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertItem, AlertType } from '../../types';
import {
  Bell,
  AlertTriangle,
  Calendar,
  UserCheck,
  ShieldCheck,
  HeartPulse,
  Car,
  Award,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import { formatDateArabic } from '../../utils/helpers';

export const AlertsCenter: React.FC = () => {
  const { alerts, markInstallmentPaid } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredAlerts = alerts.filter(alert => {
    const matchType = filterType === 'all' || alert.type === filterType;
    const matchStatus = filterStatus === 'all' || alert.status === filterStatus;
    return matchType && matchStatus;
  });

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'lease_payment':
      case 'lease_contract_expiry':
        return <Calendar className="w-5 h-5 text-indigo-600" />;
      case 'iqama_expiry':
        return <UserCheck className="w-5 h-5 text-sky-600" />;
      case 'work_card_expiry':
        return <ShieldCheck className="w-5 h-5 text-amber-600" />;
      case 'health_cert_expiry':
        return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'vehicle_istimara':
      case 'vehicle_insurance':
        return <Car className="w-5 h-5 text-orange-600" />;
      case 'driver_license':
        return <Award className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-6 h-6 text-brand-600" />
          مركز التنبيهات والمواعيد المستحقة
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          رصد آلي لكافة الالتزامات ومواعيد انتهاء الوثائق الرسمية والدفعات لترتيب الأولويات
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filterType === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          الكل ({alerts.length})
        </button>

        <button
          onClick={() => setFilterType('lease_payment')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filterType === 'lease_payment'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          دفعات الإيجار
        </button>

        <button
          onClick={() => setFilterType('iqama_expiry')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filterType === 'iqama_expiry'
              ? 'bg-sky-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          الإقامات
        </button>

        <button
          onClick={() => setFilterType('work_card_expiry')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filterType === 'work_card_expiry'
              ? 'bg-amber-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          كروت العمل
        </button>

        <button
          onClick={() => setFilterType('health_cert_expiry')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filterType === 'health_cert_expiry'
              ? 'bg-rose-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          الشهادات الصحية
        </button>

        <button
          onClick={() => setFilterType('vehicle_insurance')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filterType === 'vehicle_insurance'
              ? 'bg-orange-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          المركبات والتأمين
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">لا توجد تنبيهات نشطة حالياً</h3>
            <p className="text-xs text-slate-500 mt-1">كافة الوثائق والدفعات سارية ومسددة في مواعيدها.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-2xl p-4 border transition-all hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                alert.status === 'critical'
                  ? 'border-red-200 bg-red-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{alert.title}</h4>
                    {alert.daysRemaining < 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-800">
                        منتهية ({Math.abs(alert.daysRemaining)} يوم)
                      </span>
                    ) : alert.daysRemaining <= 15 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        متبقي {alert.daysRemaining} يوم
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                        متبقي {alert.daysRemaining} يوم
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{alert.description}</p>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    تاريخ الاستحقاق: {alert.dueDate} ({formatDateArabic(alert.dueDate)})
                    {alert.branchName && ` • الفرع: ${alert.branchName}`}
                  </div>
                </div>
              </div>

              {/* Action trigger if lease payment */}
              {alert.type === 'lease_payment' && (
                <div className="shrink-0">
                  <button
                    onClick={() => {
                      const ref = window.prompt('أدخل رقم إيصال أو مرجع التحويل لتأكيد السداد:');
                      if (ref !== null) {
                        // find contract and installment
                        const instId = alert.id.replace('alert-inst-', '');
                        markInstallmentPaid(alert.relatedId, instId, ref || 'سداد مباشر', new Date().toISOString().split('T')[0]);
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    تسجيل السداد الآن
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
