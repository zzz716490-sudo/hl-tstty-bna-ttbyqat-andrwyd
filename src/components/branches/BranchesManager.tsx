import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GitFork, Plus, Search, MapPin, User, Phone, FileText, Zap, ChevronLeft, Building } from 'lucide-react';
import { BranchDetailView } from './BranchDetailView';

interface BranchesManagerProps {
  onOpenAddBranch: () => void;
  onOpenContractModal: (branchId: string, branchName: string) => void;
  onOpenMeterModal: (branchId: string, branchName: string) => void;
  onOpenFacilityModal: (branchId: string, branchName: string) => void;
  onOpenTelecomModal: (branchId: string, companyId: string) => void;
}

export const BranchesManager: React.FC<BranchesManagerProps> = ({
  onOpenAddBranch,
  onOpenContractModal,
  onOpenMeterModal,
  onOpenFacilityModal,
  onOpenTelecomModal,
}) => {
  const {
    companies,
    branches,
    contracts,
    meters,
    facilities,
    employees,
    selectedCompanyId,
    selectedBranchId,
    setSelectedBranchId,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  const companyBranches = branches.filter(
    b => (!selectedCompanyId || b.companyId === selectedCompanyId)
  );

  const filteredBranches = companyBranches.filter(b =>
    b.name.includes(searchTerm) || b.city.includes(searchTerm) || b.managerName.includes(searchTerm)
  );

  // إذا تم اختيار فرع معين لعرض تفاصيله
  const currentBranch = branches.find(b => b.id === selectedBranchId);

  if (currentBranch) {
    return (
      <BranchDetailView
        branch={currentBranch}
        onBack={() => setSelectedBranchId(null)}
        onOpenContractModal={onOpenContractModal}
        onOpenMeterModal={onOpenMeterModal}
        onOpenFacilityModal={onOpenFacilityModal}
        onOpenTelecomModal={onOpenTelecomModal}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GitFork className="w-6 h-6 text-brand-600" />
            إدارة فروع الشركة
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            تسجيل الفروع، عقود الإيجار، العدادات، والمنشآت ومساكن العمال التابعة
          </p>
        </div>

        <button
          onClick={onOpenAddBranch}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة فرع جديد</span>
        </button>
      </div>

      {/* Search & Stats */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="ابحث باسم الفرع، المدينة، أو اسم المدير..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-10 pl-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:outline-none shadow-sm"
        />
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBranches.map((branch) => {
          const branchContracts = contracts.filter(c => c.branchId === branch.id);
          const branchMeters = meters.filter(m => m.branchId === branch.id);
          const branchFacilities = facilities.filter(f => f.branchId === branch.id);
          const branchStaff = employees.filter(e => e.branchId === branch.id);

          return (
            <div
              key={branch.id}
              onClick={() => setSelectedBranchId(branch.id)}
              className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-brand-400 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                      {branch.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {branch.city} - {branch.address}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    نشط
                  </span>
                </div>

                <div className="bg-slate-50 rounded-2xl p-3 space-y-2 mb-4 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <User className="w-3.5 h-3.5" />
                      المدير:
                    </span>
                    <span className="font-semibold text-slate-800">{branch.managerName || 'غير محدد'}</span>
                  </div>
                  {branch.managerPhone && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Phone className="w-3.5 h-3.5" />
                        الهاتف:
                      </span>
                      <span className="font-mono text-slate-800">{branch.managerPhone}</span>
                    </div>
                  )}
                </div>

                {/* مؤشرات الأصول التابعة */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-brand-50/70 p-2 rounded-xl border border-brand-100">
                    <span className="block font-black text-brand-800 text-sm">{branchContracts.length}</span>
                    <span className="text-[10px] text-brand-600">عقود</span>
                  </div>
                  <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-100">
                    <span className="block font-black text-amber-800 text-sm">{branchMeters.length}</span>
                    <span className="text-[10px] text-amber-600">عدادات</span>
                  </div>
                  <div className="bg-rose-50/70 p-2 rounded-xl border border-rose-100">
                    <span className="block font-black text-rose-800 text-sm">{branchFacilities.length}</span>
                    <span className="text-[10px] text-rose-600">سكن عمال</span>
                  </div>
                  <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                    <span className="block font-black text-emerald-800 text-sm">{branchStaff.length}</span>
                    <span className="text-[10px] text-emerald-600">موظفون</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-600 group-hover:text-brand-700">
                <span>فتح ملف وتفاصيل الفرع</span>
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
