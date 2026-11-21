import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Bell, Database, Plus, ChevronDown } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBackup: () => void;
  onOpenAddCompany: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBackup,
  onOpenAddCompany,
}) => {
  const {
    companies,
    selectedCompanyId,
    setSelectedCompanyId,
    criticalAlertsCount,
    alerts,
  } = useApp();

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Company Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                منظومة الشركات والفروع
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                إدارة العقود، العدادات، الأسطول، والموظفين
              </p>
            </div>
          </div>

          {/* Company Selector Dropdown */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="appearance-none bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs sm:text-sm font-medium rounded-lg pl-8 pr-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors max-w-[160px] sm:max-w-xs truncate"
              >
                {companies.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    🏢 {comp.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              onClick={onOpenAddCompany}
              title="إضافة شركة جديدة"
              className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg border border-brand-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Alerts Bell */}
            <button
              onClick={() => setActiveTab('alerts')}
              className={`relative p-2 rounded-lg border transition-all ${
                activeTab === 'alerts'
                  ? 'bg-brand-50 border-brand-300 text-brand-600'
                  : 'text-slate-600 hover:bg-slate-100 border-slate-200'
              }`}
              title="مركز التنبيهات"
            >
              <Bell className="w-5 h-5" />
              {alerts.length > 0 && (
                <span
                  className={`absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-[11px] font-bold text-white rounded-full ${
                    criticalAlertsCount > 0 ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
                  }`}
                >
                  {alerts.length}
                </span>
              )}
            </button>

            {/* Backup & Export Database */}
            <button
              onClick={onOpenBackup}
              title="النسخ الاحتياطي وتصدير البيانات"
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              <Database className="w-5 h-5" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
