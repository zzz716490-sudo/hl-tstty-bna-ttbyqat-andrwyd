import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Plus, Phone, Mail, MapPin, Hash, CheckCircle2, ChevronLeft } from 'lucide-react';

interface CompaniesManagerProps {
  onOpenAddCompany: () => void;
}

export const CompaniesManager: React.FC<CompaniesManagerProps> = ({ onOpenAddCompany }) => {
  const { companies, branches, selectedCompanyId, setSelectedCompanyId, deleteCompany } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-brand-600" />
            إدارة الشركات والمؤسسات
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            تسجيل الشركات التابعة، السجلات التجارية، والأرقام الضريبية
          </p>
        </div>

        <button
          onClick={onOpenAddCompany}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة شركة جديدة</span>
        </button>
      </div>

      {/* Companies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {companies.map((comp) => {
          const compBranches = branches.filter(b => b.companyId === comp.id);
          const isSelected = comp.id === selectedCompanyId;

          return (
            <div
              key={comp.id}
              className={`bg-white rounded-3xl p-6 border shadow-sm transition-all space-y-4 ${
                isSelected ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{comp.name}</h3>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800">
                        <CheckCircle2 className="w-3 h-3" />
                        الشركة النشطة
                      </span>
                    )}
                  </div>
                  {comp.notes && <p className="text-xs text-slate-500 mt-1">{comp.notes}</p>}
                </div>

                {!isSelected && (
                  <button
                    onClick={() => setSelectedCompanyId(comp.id)}
                    className="text-xs font-bold text-brand-600 hover:text-brand-800 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 transition-colors"
                  >
                    تحديد كنشطة
                  </button>
                )}
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">السجل التجاري (CR):</span>
                  <span className="font-mono font-bold text-slate-800">{comp.commercialRegNo}</span>
                </div>
                {comp.taxNumber && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">الرقم الضريبي (VAT):</span>
                    <span className="font-mono text-slate-700">{comp.taxNumber}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">رقم الهاتف:</span>
                  <span className="font-mono text-slate-700">{comp.phone}</span>
                </div>
                {comp.address && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">المقر:</span>
                    <span className="text-slate-700">{comp.address}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-600">
                  عدد الفروع التابعة: <span className="text-brand-700 font-bold">{compBranches.length}</span>
                </span>

                {companies.length > 1 && (
                  <button
                    onClick={() => {
                      if (window.confirm(`هل تريد بالتأكيد حذف شركة "${comp.name}"؟`)) {
                        deleteCompany(comp.id);
                      }
                    }}
                    className="text-slate-400 hover:text-red-600"
                  >
                    حذف الشركة
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
