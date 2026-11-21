import React from 'react';
import { X, Building2, Zap, Home, Phone, Database, ChevronLeft } from 'lucide-react';

interface MoreMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
  onOpenBackup: () => void;
}

export const MoreMenuModal: React.FC<MoreMenuModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenBackup,
}) => {
  if (!isOpen) return null;

  const items = [
    {
      id: 'companies',
      label: 'إدارة الشركات',
      desc: 'إضافة وتعديل بيانات وسجلات الشركات',
      icon: Building2,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      id: 'branches',
      label: 'عدادات الكهرباء والمياه',
      desc: 'أرقام العدادات وحسابات سداد الفواتير',
      icon: Zap,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      id: 'branches',
      label: 'المنشآت ومساكن العمال',
      desc: 'سكن العمال، المستودعات، وطاقتها الاستيعابية',
      icon: Home,
      color: 'bg-rose-50 text-rose-600',
    },
    {
      id: 'branches',
      label: 'خطوط الهاتف والاشتراكات',
      desc: 'أرقام الهواتف وباقات الإنترنت وحسابات سدادها',
      icon: Phone,
      color: 'bg-sky-50 text-sky-600',
    },
    {
      id: 'backup',
      label: 'النسخ الاحتياطي وتصدير البيانات',
      desc: 'تنزيل أو استعادة البيانات وتصدير ملفات Excel',
      icon: Database,
      color: 'bg-emerald-50 text-emerald-600',
      action: () => {
        onClose();
        onOpenBackup();
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full shadow-2xl overflow-hidden p-6 space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            أقسام وخدمات المنظومة
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => {
            const Icon = item.icon;

            return (
              <div
                key={idx}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    onSelectTab(item.id);
                    onClose();
                  }
                }}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-700">
                      {item.label}
                    </h4>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>

                <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
