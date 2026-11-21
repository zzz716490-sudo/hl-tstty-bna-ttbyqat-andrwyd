import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { Dashboard } from './components/dashboard/Dashboard';
import { BranchesManager } from './components/branches/BranchesManager';
import { EmployeesManager } from './components/employees/EmployeesManager';
import { FleetManager } from './components/fleet/FleetManager';
import { AlertsCenter } from './components/alerts/AlertsCenter';
import { CompaniesManager } from './components/companies/CompaniesManager';

// Modals
import { CompanyModal } from './components/companies/CompanyModal';
import { BranchModal } from './components/branches/BranchModal';
import { ContractModal } from './components/contracts/ContractModal';
import { MeterModal } from './components/meters/MeterModal';
import { FacilityModal } from './components/facilities/FacilityModal';
import { TelecomModal } from './components/telecom/TelecomModal';
import { EmployeeModal } from './components/employees/EmployeeModal';
import { VehicleModal } from './components/fleet/VehicleModal';
import { DriverModal } from './components/fleet/DriverModal';
import { BackupRestoreModal } from './components/data/BackupRestoreModal';
import { MoreMenuModal } from './components/layout/MoreMenuModal';

const AppContent: React.FC = () => {
  const {
    selectedCompanyId,
    addCompany,
    addBranch,
    addContract,
    addMeter,
    addFacility,
    addTelecomAccount,
    addEmployee,
    addVehicle,
    addDriver,
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modal States
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Branch-specific modals
  const [contractModalData, setContractModalData] = useState<{ branchId: string; branchName: string } | null>(null);
  const [meterModalData, setMeterModalData] = useState<{ branchId: string; branchName: string } | null>(null);
  const [facilityModalData, setFacilityModalData] = useState<{ branchId: string; branchName: string } | null>(null);
  const [telecomModalData, setTelecomModalData] = useState<{ branchId: string; companyId: string } | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenAddCompany={() => setIsCompanyModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            onOpenContractModal={(branchId, branchName) => setContractModalData({ branchId, branchName })}
            onOpenBranchModal={() => setIsBranchModalOpen(true)}
            onOpenEmployeeModal={() => setIsEmployeeModalOpen(true)}
            onOpenVehicleModal={() => setIsVehicleModalOpen(true)}
          />
        )}

        {activeTab === 'branches' && (
          <BranchesManager
            onOpenAddBranch={() => setIsBranchModalOpen(true)}
            onOpenContractModal={(branchId, branchName) => setContractModalData({ branchId, branchName })}
            onOpenMeterModal={(branchId, branchName) => setMeterModalData({ branchId, branchName })}
            onOpenFacilityModal={(branchId, branchName) => setFacilityModalData({ branchId, branchName })}
            onOpenTelecomModal={(branchId, companyId) => setTelecomModalData({ branchId, companyId })}
          />
        )}

        {activeTab === 'employees' && (
          <EmployeesManager onOpenAddEmployee={() => setIsEmployeeModalOpen(true)} />
        )}

        {activeTab === 'fleet' && (
          <FleetManager
            onOpenAddVehicle={() => setIsVehicleModalOpen(true)}
            onOpenAddDriver={() => setIsDriverModalOpen(true)}
          />
        )}

        {activeTab === 'alerts' && <AlertsCenter />}

        {activeTab === 'companies' && (
          <CompaniesManager onOpenAddCompany={() => setIsCompanyModalOpen(true)} />
        )}
      </main>

      {/* Mobile-Friendly Sticky Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMoreMenu={() => setIsMoreMenuOpen(true)}
      />

      {/* Modals */}
      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        onSave={addCompany}
      />

      <BranchModal
        companyId={selectedCompanyId}
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        onSave={addBranch}
      />

      {contractModalData && (
        <ContractModal
          branchId={contractModalData.branchId}
          branchName={contractModalData.branchName}
          isOpen={true}
          onClose={() => setContractModalData(null)}
          onSave={addContract}
        />
      )}

      {meterModalData && (
        <MeterModal
          branchId={meterModalData.branchId}
          branchName={meterModalData.branchName}
          isOpen={true}
          onClose={() => setMeterModalData(null)}
          onSave={addMeter}
        />
      )}

      {facilityModalData && (
        <FacilityModal
          branchId={facilityModalData.branchId}
          branchName={facilityModalData.branchName}
          isOpen={true}
          onClose={() => setFacilityModalData(null)}
          onSave={addFacility}
        />
      )}

      {telecomModalData && (
        <TelecomModal
          branchId={telecomModalData.branchId}
          companyId={telecomModalData.companyId}
          isOpen={true}
          onClose={() => setTelecomModalData(null)}
          onSave={addTelecomAccount}
        />
      )}

      <EmployeeModal
        companyId={selectedCompanyId}
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSave={addEmployee}
      />

      <VehicleModal
        companyId={selectedCompanyId}
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSave={addVehicle}
      />

      <DriverModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        onSave={addDriver}
      />

      <BackupRestoreModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />

      <MoreMenuModal
        isOpen={isMoreMenuOpen}
        onClose={() => setIsMoreMenuOpen(false)}
        onSelectTab={setActiveTab}
        onOpenBackup={() => setIsBackupModalOpen(true)}
      />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
