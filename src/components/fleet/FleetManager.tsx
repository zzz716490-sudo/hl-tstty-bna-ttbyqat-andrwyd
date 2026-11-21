import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Car, User, Plus, Search, FileSpreadsheet, AlertTriangle, CheckCircle, Shield, Award } from 'lucide-react';
import { calculateDaysRemaining, formatDateArabic, exportToExcel } from '../../utils/helpers';

interface FleetManagerProps {
  onOpenAddVehicle: () => void;
  onOpenAddDriver: () => void;
}

export const FleetManager: React.FC<FleetManagerProps> = ({
  onOpenAddVehicle,
  onOpenAddDriver,
}) => {
  const { vehicles, drivers, branches, selectedCompanyId, deleteVehicle, deleteDriver } = useApp();
  const [activeTab, setActiveTab] = useState<'vehicles' | 'drivers'>('vehicles');
  const [searchTerm, setSearchTerm] = useState('');

  const companyVehicles = vehicles.filter(v => !selectedCompanyId || v.companyId === selectedCompanyId);
  const branchMap = new Map(branches.map(b => [b.id, b.name]));
  const driverMap = new Map(drivers.map(d => [d.id, d.name]));

  const filteredVehicles = companyVehicles.filter(v =>
    v.plateNumber.includes(searchTerm) ||
    v.makeModel.includes(searchTerm) ||
    (v.insuranceCompany && v.insuranceCompany.includes(searchTerm))
  );

  const filteredDrivers = drivers.filter(d =>
    d.name.includes(searchTerm) ||
    d.licenseNumber.includes(searchTerm) ||
    d.iqamaNumber.includes(searchTerm)
  );

  const handleExportVehicles = () => {
    const data = companyVehicles.map(v => {
      const istimara = calculateDaysRemaining(v.istimaraExpiryDate);
      const insurance = calculateDaysRemaining(v.insuranceExpiryDate);
      return {
        'رقم اللوحة': v.plateNumber,
        'الموديل': v.makeModel,
        'سنة الصنع': v.year,
        'الفرع': v.branchId ? branchMap.get(v.branchId) : 'الإدارة',
        'تاريخ انتهاء الاستمارة': v.istimaraExpiryDate,
        'حالة الاستمارة': istimara.label,
        'تاريخ انتهاء التأمين': v.insuranceExpiryDate,
        'شركة التأمين': v.insuranceCompany || '-',
        'حالة التأمين': insurance.label,
        'السائق': v.assignedDriverId ? driverMap.get(v.assignedDriverId) : 'غير معين',
      };
    });
    exportToExcel(data, 'أسطول_السيارات', 'السيارات');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Car className="w-6 h-6 text-brand-600" />
            إدارة أسطول السيارات والسائقين
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            متابعة دقيقة لتواريخ انتهاء استمارات وتأمين السيارات، ورخص القيادة للسائقين
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'vehicles' ? (
            <>
              <button
                onClick={handleExportVehicles}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-all shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>تصدير Excel</span>
              </button>
              <button
                onClick={onOpenAddVehicle}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة مركبة جديدة</span>
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAddDriver}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل سائق جديد</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('vehicles')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
            activeTab === 'vehicles'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>السيارات والمركبات ({companyVehicles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('drivers')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
            activeTab === 'drivers'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>السائقون ورخص القيادة ({drivers.length})</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder={activeTab === 'vehicles' ? 'ابحث برقم اللوحة، الموديل، شركة التأمين...' : 'ابحث باسم السائق أو رقم الرخصة...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-10 pl-4 py-2.5 text-xs bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:outline-none shadow-sm"
        />
      </div>

      {/* Vehicles Tab Content */}
      {activeTab === 'vehicles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVehicles.map((veh) => {
            const istimaraRes = calculateDaysRemaining(veh.istimaraExpiryDate);
            const insuranceRes = calculateDaysRemaining(veh.insuranceExpiryDate);
            const driverName = veh.assignedDriverId ? driverMap.get(veh.assignedDriverId) : 'بدون سائق معين';

            return (
              <div
                key={veh.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 hover:border-brand-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono font-black text-base text-slate-900 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 inline-block">
                      {veh.plateNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 mt-2">{veh.makeModel} ({veh.year})</h3>
                    <p className="text-xs text-slate-500">
                      الفرع: {veh.branchId ? branchMap.get(veh.branchId) : 'الإدارة الرئيسية'}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg ${
                    veh.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {veh.status === 'active' ? 'نشطة' : 'صيانة'}
                  </span>
                </div>

                {/* مؤشرات انتهاء الاستمارة والتأمين */}
                <div className="space-y-2 text-xs">
                  
                  {/* الاستمارة */}
                  <div className="bg-slate-50 p-3 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block">انتهاء الاستمارة:</span>
                      <span className="font-mono text-slate-800">{veh.istimaraExpiryDate}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      istimaraRes.days < 0 ? 'bg-red-100 text-red-800' : istimaraRes.days <= 30 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {istimaraRes.label}
                    </span>
                  </div>

                  {/* التأمين */}
                  <div className="bg-slate-50 p-3 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block">تأمين ({veh.insuranceCompany || '-'}):</span>
                      <span className="font-mono text-slate-800">{veh.insuranceExpiryDate}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      insuranceRes.days < 0 ? 'bg-red-100 text-red-800' : insuranceRes.days <= 30 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {insuranceRes.label}
                    </span>
                  </div>

                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-slate-600 font-medium">👤 السائق: {driverName}</span>
                  <button
                    onClick={() => {
                      if (window.confirm('هل أنت متأكد من حذف هذه السيارة؟')) deleteVehicle(veh.id);
                    }}
                    className="text-slate-400 hover:text-red-600"
                  >
                    حذف
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Drivers Tab Content */}
      {activeTab === 'drivers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDrivers.map((driver) => {
            const licenseRes = calculateDaysRemaining(driver.licenseExpiryDate);

            return (
              <div
                key={driver.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{driver.name}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">إقامة: {driver.iqamaNumber}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg ${
                    licenseRes.days <= 30 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {licenseRes.label}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">رقم رخصة القيادة:</span>
                    <span className="font-mono font-bold text-slate-800">{driver.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">انتهاء الرخصة:</span>
                    <span className="font-mono text-slate-800">{driver.licenseExpiryDate}</span>
                  </div>
                  {driver.phone && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">رقم الجوال:</span>
                      <a href={`tel:${driver.phone}`} className="font-mono text-brand-600 font-bold hover:underline">
                        {driver.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      if (window.confirm('هل تريد حذف هذا السائق؟')) deleteDriver(driver.id);
                    }}
                    className="text-xs text-slate-400 hover:text-red-600"
                  >
                    حذف السائق
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
