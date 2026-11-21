import React, { useState } from 'react';
import { Vehicle } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Car } from 'lucide-react';

interface VehicleModalProps {
  companyId: string;
  vehicle?: Vehicle;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Vehicle, 'id' | 'createdAt'>) => void;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({
  companyId,
  vehicle,
  isOpen,
  onClose,
  onSave,
}) => {
  const { branches, drivers } = useApp();
  const companyBranches = branches.filter(b => b.companyId === companyId);

  const [plateNumber, setPlateNumber] = useState(vehicle?.plateNumber || '');
  const [makeModel, setMakeModel] = useState(vehicle?.makeModel || '');
  const [year, setYear] = useState<number>(vehicle?.year || new Date().getFullYear());
  const [vinNumber, setVinNumber] = useState(vehicle?.vinNumber || '');
  const [istimaraExpiryDate, setIstimaraExpiryDate] = useState(vehicle?.istimaraExpiryDate || '');
  const [insuranceExpiryDate, setInsuranceExpiryDate] = useState(vehicle?.insuranceExpiryDate || '');
  const [insuranceCompany, setInsuranceCompany] = useState(vehicle?.insuranceCompany || 'التعاونية للتأمين');
  const [branchId, setBranchId] = useState(vehicle?.branchId || companyBranches[0]?.id || '');
  const [assignedDriverId, setAssignedDriverId] = useState(vehicle?.assignedDriverId || '');
  const [status, setStatus] = useState<Vehicle['status']>(vehicle?.status || 'active');
  const [notes, setNotes] = useState(vehicle?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber || !makeModel || !istimaraExpiryDate || !insuranceExpiryDate) return;

    onSave({
      companyId,
      branchId: branchId || undefined,
      plateNumber,
      makeModel,
      year: Number(year) || new Date().getFullYear(),
      vinNumber,
      istimaraExpiryDate,
      insuranceExpiryDate,
      insuranceCompany,
      assignedDriverId: assignedDriverId || undefined,
      status,
      notes,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Car className="w-5 h-5 text-brand-600" />
            {vehicle ? 'تعديل بيانات المركبة' : 'إضافة مركبة جديدة للأسطول'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم اللوحة *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: أ ب ج 1234"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                نوع وموديل المركبة *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: تويوتا هايلوكس دبل"
                value={makeModel}
                onChange={(e) => setMakeModel(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                سنة الصنع
              </label>
              <input
                type="number"
                placeholder="2024"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                الفرع التابع له
              </label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white font-medium"
              >
                <option value="">-- الفرع الرئيسي / الإدارة --</option>
                {companyBranches.map((br) => (
                  <option key={br.id} value={br.id}>
                    {br.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-amber-900 mb-1">
                تاريخ انتهاء الاستمارة *
              </label>
              <input
                type="date"
                required
                value={istimaraExpiryDate}
                onChange={(e) => setIstimaraExpiryDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-900 mb-1">
                تاريخ انتهاء التأمين *
              </label>
              <input
                type="date"
                required
                value={insuranceExpiryDate}
                onChange={(e) => setInsuranceExpiryDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                شركة التأمين
              </label>
              <input
                type="text"
                placeholder="التعاونية، تكافل الراجحي، ملاذ..."
                value={insuranceCompany}
                onChange={(e) => setInsuranceCompany(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                السائق المعين
              </label>
              <select
                value={assignedDriverId}
                onChange={(e) => setAssignedDriverId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
              >
                <option value="">-- بدون سائق محدد --</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    👤 {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                حالة السيارة
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Vehicle['status'])}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white font-medium"
              >
                <option value="active">🟢 نشطة وجاهزة</option>
                <option value="maintenance">🟡 في الصيانة</option>
                <option value="inactive">🔴 متوقفة</option>
              </select>
            </div>
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
              حفظ المركبة
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
