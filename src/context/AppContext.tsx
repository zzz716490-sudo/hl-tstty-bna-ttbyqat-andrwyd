import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Company,
  Branch,
  LeaseContract,
  Installment,
  UtilityMeter,
  SubFacility,
  Vehicle,
  Driver,
  Employee,
  TelecomAccount,
  AlertItem
} from '../types';
import {
  initialCompanies,
  initialBranches,
  initialContracts,
  initialMeters,
  initialFacilities,
  initialVehicles,
  initialDrivers,
  initialEmployees,
  initialTelecomAccounts
} from '../data/mockData';
import { calculateDaysRemaining } from '../utils/helpers';

interface AppContextType {
  // State
  companies: Company[];
  branches: Branch[];
  contracts: LeaseContract[];
  meters: UtilityMeter[];
  facilities: SubFacility[];
  vehicles: Vehicle[];
  drivers: Driver[];
  employees: Employee[];
  telecomAccounts: TelecomAccount[];
  
  // Selection & Filter
  selectedCompanyId: string;
  setSelectedCompanyId: (id: string) => void;
  selectedBranchId: string | null;
  setSelectedBranchId: (id: string | null) => void;
  
  // Computed Alerts
  alerts: AlertItem[];
  criticalAlertsCount: number;
  
  // Actions - Companies
  addCompany: (comp: Omit<Company, 'id' | 'createdAt'>) => void;
  updateCompany: (id: string, comp: Partial<Company>) => void;
  deleteCompany: (id: string) => void;

  // Actions - Branches
  addBranch: (br: Omit<Branch, 'id' | 'createdAt'>) => void;
  updateBranch: (id: string, br: Partial<Branch>) => void;
  deleteBranch: (id: string) => void;

  // Actions - Contracts & Installments
  addContract: (cont: Omit<LeaseContract, 'id' | 'createdAt'>) => void;
  updateContract: (id: string, cont: Partial<LeaseContract>) => void;
  deleteContract: (id: string) => void;
  markInstallmentPaid: (contractId: string, installmentId: string, paymentReference: string, paidDate: string) => void;
  markInstallmentUnpaid: (contractId: string, installmentId: string) => void;

  // Actions - Meters
  addMeter: (meter: Omit<UtilityMeter, 'id' | 'createdAt'>) => void;
  updateMeter: (id: string, meter: Partial<UtilityMeter>) => void;
  deleteMeter: (id: string) => void;

  // Actions - Facilities
  addFacility: (fac: Omit<SubFacility, 'id' | 'createdAt'>) => void;
  updateFacility: (id: string, fac: Partial<SubFacility>) => void;
  deleteFacility: (id: string) => void;

  // Actions - Fleet & Drivers
  addVehicle: (veh: Omit<Vehicle, 'id' | 'createdAt'>) => void;
  updateVehicle: (id: string, veh: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  addDriver: (driver: Omit<Driver, 'id' | 'createdAt'>) => void;
  updateDriver: (id: string, driver: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;

  // Actions - Employees
  addEmployee: (emp: Omit<Employee, 'id' | 'createdAt'>) => void;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Actions - Telecom
  addTelecomAccount: (tel: Omit<TelecomAccount, 'id' | 'createdAt'>) => void;
  updateTelecomAccount: (id: string, tel: Partial<TelecomAccount>) => void;
  deleteTelecomAccount: (id: string) => void;

  // Backup & Reset
  exportDatabaseJson: () => string;
  importDatabaseJson: (jsonStr: string) => boolean;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'CORP_APP_DATA_V1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or defaults
  const loadInitial = <T,>(key: string, defaultVal: T): T => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${key}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(`Error loading ${key} from storage:`, e);
    }
    return defaultVal;
  };

  const [companies, setCompanies] = useState<Company[]>(() => loadInitial('companies', initialCompanies));
  const [branches, setBranches] = useState<Branch[]>(() => loadInitial('branches', initialBranches));
  const [contracts, setContracts] = useState<LeaseContract[]>(() => loadInitial('contracts', initialContracts));
  const [meters, setMeters] = useState<UtilityMeter[]>(() => loadInitial('meters', initialMeters));
  const [facilities, setFacilities] = useState<SubFacility[]>(() => loadInitial('facilities', initialFacilities));
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => loadInitial('vehicles', initialVehicles));
  const [drivers, setDrivers] = useState<Driver[]>(() => loadInitial('drivers', initialDrivers));
  const [employees, setEmployees] = useState<Employee[]>(() => loadInitial('employees', initialEmployees));
  const [telecomAccounts, setTelecomAccounts] = useState<TelecomAccount[]>(() => loadInitial('telecom', initialTelecomAccounts));

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_selectedCompanyId`);
    if (saved && companies.some(c => c.id === saved)) return saved;
    return companies[0]?.id || '';
  });

  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_companies`, JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_branches`, JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_contracts`, JSON.stringify(contracts));
  }, [contracts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_meters`, JSON.stringify(meters));
  }, [meters]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_facilities`, JSON.stringify(facilities));
  }, [facilities]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_vehicles`, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_drivers`, JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_employees`, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_telecom`, JSON.stringify(telecomAccounts));
  }, [telecomAccounts]);

  useEffect(() => {
    if (selectedCompanyId) {
      localStorage.setItem(`${STORAGE_KEY}_selectedCompanyId`, selectedCompanyId);
    }
  }, [selectedCompanyId]);

  // Compute Active Alerts
  const alerts: AlertItem[] = [];
  const currentCompanyBranches = branches.filter(b => !selectedCompanyId || b.companyId === selectedCompanyId);
  const branchIds = new Set(currentCompanyBranches.map(b => b.id));
  const branchMap = new Map(branches.map(b => [b.id, b.name]));
  const companyMap = new Map(companies.map(c => [c.id, c.name]));

  // 1. Lease Installments Alerts
  contracts.forEach(contract => {
    if (!branchIds.has(contract.branchId)) return;
    const branchName = branchMap.get(contract.branchId);

    contract.installments.forEach(inst => {
      if (inst.status !== 'paid') {
        const { days, status } = calculateDaysRemaining(inst.dueDate);
        if (days <= 30) {
          alerts.push({
            id: `alert-inst-${inst.id}`,
            type: 'lease_payment',
            title: `دفعة إيجار مستحقة - ${branchName}`,
            description: `دفعة رقم ${inst.installmentNumber} بقيمة ${inst.amount.toLocaleString()} ريال - رقم السداد: ${contract.paymentNumber}`,
            dueDate: inst.dueDate,
            daysRemaining: days,
            status: days < 0 ? 'critical' : days <= 7 ? 'critical' : 'warning',
            relatedId: contract.id,
            relatedType: 'contract',
            branchName,
          });
        }
      }
    });

    // Contract overall expiry
    const contractExp = calculateDaysRemaining(contract.endDate);
    if (contractExp.days <= 45) {
      alerts.push({
        id: `alert-cont-exp-${contract.id}`,
        type: 'lease_contract_expiry',
        title: `انتهاء عقد إيجار - ${branchName}`,
        description: `ينتهي عقد الإيجار رقم ${contract.contractNumber} للمؤجر ${contract.landlordName}`,
        dueDate: contract.endDate,
        daysRemaining: contractExp.days,
        status: contractExp.days <= 10 ? 'critical' : 'warning',
        relatedId: contract.id,
        relatedType: 'contract',
        branchName,
      });
    }
  });

  // 2. Employee Alerts (Iqama, Work Card, Health Certificate)
  employees.forEach(emp => {
    if (!branchIds.has(emp.branchId)) return;
    const branchName = branchMap.get(emp.branchId);

    // Iqama
    const iqamaRes = calculateDaysRemaining(emp.iqamaExpiryDate);
    if (iqamaRes.days <= 45) {
      alerts.push({
        id: `alert-iqama-${emp.id}`,
        type: 'iqama_expiry',
        title: `انتهاء إقامة الموظف: ${emp.name}`,
        description: `رقم الإقامة: ${emp.iqamaNumber} - المسمى: ${emp.jobTitle}`,
        dueDate: emp.iqamaExpiryDate,
        daysRemaining: iqamaRes.days,
        status: iqamaRes.days <= 7 ? 'critical' : 'warning',
        relatedId: emp.id,
        relatedType: 'employee',
        branchName,
      });
    }

    // Work Card
    if (emp.workCardExpiryDate) {
      const workCardRes = calculateDaysRemaining(emp.workCardExpiryDate);
      if (workCardRes.days <= 30) {
        alerts.push({
          id: `alert-workcard-${emp.id}`,
          type: 'work_card_expiry',
          title: `انتهاء كرت العمل: ${emp.name}`,
          description: `كرت العمل رقم: ${emp.workCardNumber || '-'}`,
          dueDate: emp.workCardExpiryDate,
          daysRemaining: workCardRes.days,
          status: workCardRes.days <= 7 ? 'critical' : 'warning',
          relatedId: emp.id,
          relatedType: 'employee',
          branchName,
        });
      }
    }

    // Health Certificate
    if (emp.healthCertificateExpiryDate) {
      const healthRes = calculateDaysRemaining(emp.healthCertificateExpiryDate);
      if (healthRes.days <= 30) {
        alerts.push({
          id: `alert-health-${emp.id}`,
          type: 'health_cert_expiry',
          title: `انتهاء الشهادة الصحية: ${emp.name}`,
          description: `شهادة صحية رقم: ${emp.healthCertificateNumber || '-'}`,
          dueDate: emp.healthCertificateExpiryDate,
          daysRemaining: healthRes.days,
          status: healthRes.days <= 7 ? 'critical' : 'warning',
          relatedId: emp.id,
          relatedType: 'employee',
          branchName,
        });
      }
    }
  });

  // 3. Vehicles & Drivers Alerts
  vehicles.forEach(veh => {
    if (selectedCompanyId && veh.companyId !== selectedCompanyId) return;
    const branchName = veh.branchId ? branchMap.get(veh.branchId) : 'الفرع الرئيسي';

    // Istimara
    const istimaraRes = calculateDaysRemaining(veh.istimaraExpiryDate);
    if (istimaraRes.days <= 30) {
      alerts.push({
        id: `alert-istimara-${veh.id}`,
        type: 'vehicle_istimara',
        title: `انتهاء استمارة السيارة: ${veh.plateNumber}`,
        description: `الموديل: ${veh.makeModel}`,
        dueDate: veh.istimaraExpiryDate,
        daysRemaining: istimaraRes.days,
        status: istimaraRes.days <= 7 ? 'critical' : 'warning',
        relatedId: veh.id,
        relatedType: 'vehicle',
        branchName,
      });
    }

    // Insurance
    const insuranceRes = calculateDaysRemaining(veh.insuranceExpiryDate);
    if (insuranceRes.days <= 30) {
      alerts.push({
        id: `alert-insurance-${veh.id}`,
        type: 'vehicle_insurance',
        title: `انتهاء تأمين السيارة: ${veh.plateNumber}`,
        description: `شركة التأمين: ${veh.insuranceCompany || '-'}`,
        dueDate: veh.insuranceExpiryDate,
        daysRemaining: insuranceRes.days,
        status: insuranceRes.days <= 7 ? 'critical' : 'warning',
        relatedId: veh.id,
        relatedType: 'vehicle',
        branchName,
      });
    }
  });

  // Drivers Licenses
  drivers.forEach(driver => {
    const licRes = calculateDaysRemaining(driver.licenseExpiryDate);
    if (licRes.days <= 30) {
      alerts.push({
        id: `alert-driver-lic-${driver.id}`,
        type: 'driver_license',
        title: `انتهاء رخصة القيادة للسائق: ${driver.name}`,
        description: `رقم الرخصة: ${driver.licenseNumber} - جوال: ${driver.phone}`,
        dueDate: driver.licenseExpiryDate,
        daysRemaining: licRes.days,
        status: licRes.days <= 7 ? 'critical' : 'warning',
        relatedId: driver.id,
        relatedType: 'driver',
      });
    }
  });

  // Sort alerts by urgency (days remaining ascending)
  alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);

  const criticalAlertsCount = alerts.filter(a => a.status === 'critical').length;

  // Actions
  const addCompany = (comp: Omit<Company, 'id' | 'createdAt'>) => {
    const newComp: Company = {
      ...comp,
      id: `comp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCompanies(prev => [...prev, newComp]);
    if (!selectedCompanyId) setSelectedCompanyId(newComp.id);
  };

  const updateCompany = (id: string, comp: Partial<Company>) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...comp } : c));
  };

  const deleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
    if (selectedCompanyId === id) {
      const remaining = companies.filter(c => c.id !== id);
      setSelectedCompanyId(remaining[0]?.id || '');
    }
  };

  const addBranch = (br: Omit<Branch, 'id' | 'createdAt'>) => {
    const newBr: Branch = {
      ...br,
      id: `br-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setBranches(prev => [...prev, newBr]);
  };

  const updateBranch = (id: string, br: Partial<Branch>) => {
    setBranches(prev => prev.map(b => b.id === id ? { ...b, ...br } : b));
  };

  const deleteBranch = (id: string) => {
    setBranches(prev => prev.filter(b => b.id !== id));
    if (selectedBranchId === id) setSelectedBranchId(null);
  };

  const addContract = (cont: Omit<LeaseContract, 'id' | 'createdAt'>) => {
    const newCont: LeaseContract = {
      ...cont,
      id: `cont-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setContracts(prev => [...prev, newCont]);
  };

  const updateContract = (id: string, cont: Partial<LeaseContract>) => {
    setContracts(prev => prev.map(c => c.id === id ? { ...c, ...cont } : c));
  };

  const deleteContract = (id: string) => {
    setContracts(prev => prev.filter(c => c.id !== id));
  };

  const markInstallmentPaid = (contractId: string, installmentId: string, paymentReference: string, paidDate: string) => {
    setContracts(prev => prev.map(c => {
      if (c.id !== contractId) return c;
      return {
        ...c,
        installments: c.installments.map(inst => {
          if (inst.id !== installmentId) return inst;
          return {
            ...inst,
            status: 'paid',
            paymentReference,
            paidDate: paidDate || new Date().toISOString().split('T')[0],
          };
        })
      };
    }));
  };

  const markInstallmentUnpaid = (contractId: string, installmentId: string) => {
    setContracts(prev => prev.map(c => {
      if (c.id !== contractId) return c;
      return {
        ...c,
        installments: c.installments.map(inst => {
          if (inst.id !== installmentId) return inst;
          const { days } = calculateDaysRemaining(inst.dueDate);
          return {
            ...inst,
            status: days < 0 ? 'overdue' : 'pending',
            paymentReference: undefined,
            paidDate: undefined,
          };
        })
      };
    }));
  };

  const addMeter = (meter: Omit<UtilityMeter, 'id' | 'createdAt'>) => {
    const newMeter: UtilityMeter = {
      ...meter,
      id: `meter-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMeters(prev => [...prev, newMeter]);
  };

  const updateMeter = (id: string, meter: Partial<UtilityMeter>) => {
    setMeters(prev => prev.map(m => m.id === id ? { ...m, ...meter } : m));
  };

  const deleteMeter = (id: string) => {
    setMeters(prev => prev.filter(m => m.id !== id));
  };

  const addFacility = (fac: Omit<SubFacility, 'id' | 'createdAt'>) => {
    const newFac: SubFacility = {
      ...fac,
      id: `fac-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setFacilities(prev => [...prev, newFac]);
  };

  const updateFacility = (id: string, fac: Partial<SubFacility>) => {
    setFacilities(prev => prev.map(f => f.id === id ? { ...f, ...fac } : f));
  };

  const deleteFacility = (id: string) => {
    setFacilities(prev => prev.filter(f => f.id !== id));
  };

  const addVehicle = (veh: Omit<Vehicle, 'id' | 'createdAt'>) => {
    const newVeh: Vehicle = {
      ...veh,
      id: `veh-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setVehicles(prev => [...prev, newVeh]);
  };

  const updateVehicle = (id: string, veh: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...veh } : v));
  };

  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  const addDriver = (driver: Omit<Driver, 'id' | 'createdAt'>) => {
    const newDriver: Driver = {
      ...driver,
      id: `driv-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDrivers(prev => [...prev, newDriver]);
  };

  const updateDriver = (id: string, driver: Partial<Driver>) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, ...driver } : d));
  };

  const deleteDriver = (id: string) => {
    setDrivers(prev => prev.filter(d => d.id !== id));
  };

  const addEmployee = (emp: Omit<Employee, 'id' | 'createdAt'>) => {
    const newEmp: Employee = {
      ...emp,
      id: `emp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setEmployees(prev => [...prev, newEmp]);
  };

  const updateEmployee = (id: string, emp: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...emp } : e));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  const addTelecomAccount = (tel: Omit<TelecomAccount, 'id' | 'createdAt'>) => {
    const newTel: TelecomAccount = {
      ...tel,
      id: `tel-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTelecomAccounts(prev => [...prev, newTel]);
  };

  const updateTelecomAccount = (id: string, tel: Partial<TelecomAccount>) => {
    setTelecomAccounts(prev => prev.map(t => t.id === id ? { ...t, ...tel } : t));
  };

  const deleteTelecomAccount = (id: string) => {
    setTelecomAccounts(prev => prev.filter(t => t.id !== id));
  };

  const exportDatabaseJson = () => {
    const data = {
      companies,
      branches,
      contracts,
      meters,
      facilities,
      vehicles,
      drivers,
      employees,
      telecomAccounts,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  const importDatabaseJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (Array.isArray(data.companies)) setCompanies(data.companies);
      if (Array.isArray(data.branches)) setBranches(data.branches);
      if (Array.isArray(data.contracts)) setContracts(data.contracts);
      if (Array.isArray(data.meters)) setMeters(data.meters);
      if (Array.isArray(data.facilities)) setFacilities(data.facilities);
      if (Array.isArray(data.vehicles)) setVehicles(data.vehicles);
      if (Array.isArray(data.drivers)) setDrivers(data.drivers);
      if (Array.isArray(data.employees)) setEmployees(data.employees);
      if (Array.isArray(data.telecomAccounts)) setTelecomAccounts(data.telecomAccounts);
      return true;
    } catch (e) {
      console.error('Failed to import JSON data:', e);
      return false;
    }
  };

  const resetToDefaults = () => {
    setCompanies(initialCompanies);
    setBranches(initialBranches);
    setContracts(initialContracts);
    setMeters(initialMeters);
    setFacilities(initialFacilities);
    setVehicles(initialVehicles);
    setDrivers(initialDrivers);
    setEmployees(initialEmployees);
    setTelecomAccounts(initialTelecomAccounts);
    setSelectedCompanyId(initialCompanies[0]?.id || '');
    setSelectedBranchId(null);
  };

  return (
    <AppContext.Provider
      value={{
        companies,
        branches,
        contracts,
        meters,
        facilities,
        vehicles,
        drivers,
        employees,
        telecomAccounts,
        selectedCompanyId,
        setSelectedCompanyId,
        selectedBranchId,
        setSelectedBranchId,
        alerts,
        criticalAlertsCount,
        addCompany,
        updateCompany,
        deleteCompany,
        addBranch,
        updateBranch,
        deleteBranch,
        addContract,
        updateContract,
        deleteContract,
        markInstallmentPaid,
        markInstallmentUnpaid,
        addMeter,
        updateMeter,
        deleteMeter,
        addFacility,
        updateFacility,
        deleteFacility,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addDriver,
        updateDriver,
        deleteDriver,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addTelecomAccount,
        updateTelecomAccount,
        deleteTelecomAccount,
        exportDatabaseJson,
        importDatabaseJson,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
