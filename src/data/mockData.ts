import { Company, Branch, LeaseContract, UtilityMeter, SubFacility, Vehicle, Driver, Employee, TelecomAccount } from '../types';
import { generateInstallments } from '../utils/helpers';

export const initialCompanies: Company[] = [
  {
    id: 'comp-1',
    name: 'مجموعة الرواد للمقاولات والتجارة',
    commercialRegNo: '1010892341',
    taxNumber: '300192837400003',
    phone: '0114567890',
    email: 'info@alrowad-group.com',
    address: 'الرياض - طريق الملك فهد',
    notes: 'الشركة القابضة الرئيسية',
    createdAt: '2025-01-15',
  },
  {
    id: 'comp-2',
    name: 'شركة سلاسل الإمداد اللوجستية',
    commercialRegNo: '1010772211',
    taxNumber: '300551122300003',
    phone: '0126543210',
    email: 'operations@logistics-chains.sa',
    address: 'جدة - حي الأندلس',
    notes: 'متخصصة في النقل والتوزيع',
    createdAt: '2025-02-01',
  }
];

export const initialBranches: Branch[] = [
  {
    id: 'br-1',
    companyId: 'comp-1',
    name: 'فرع الرياض - حي العليا',
    city: 'الرياض',
    address: 'شارع التحلية، مبنى الأبراج الطابق 3',
    managerName: 'م. عبدالله السالم',
    managerPhone: '0501122334',
    status: 'active',
    notes: 'الفرع الإقليمي لقطاع الوسطى',
    createdAt: '2025-01-16',
  },
  {
    id: 'br-2',
    companyId: 'comp-1',
    name: 'فرع جدة - حي الروضة',
    city: 'جدة',
    address: 'طريق المدينة المنورة، بجوار مجمع النخبة',
    managerName: 'أ. طارق الغامدي',
    managerPhone: '0559988776',
    status: 'active',
    notes: 'فرع المنطقة الغربية والمستودع التابع',
    createdAt: '2025-01-20',
  },
  {
    id: 'br-3',
    companyId: 'comp-1',
    name: 'فرع الدمام - حي الشاطئ',
    city: 'الدمام',
    address: 'شارع الأمير محمد بن فهد',
    managerName: 'أ. فهد الخالدي',
    managerPhone: '0544332211',
    status: 'active',
    notes: 'فرع المنطقة الشرقية',
    createdAt: '2025-02-10',
  }
];

// عقود الإيجار
const contract1Installments = generateInstallments(
  'cont-1',
  '2026-01-01',
  '2026-12-31',
  120000,
  'quarterly' // 4 دفعات كل دفعة 30 ألف
);
// جعل الدفعة الأولى مدفوعة
if (contract1Installments.length > 0) {
  contract1Installments[0].status = 'paid';
  contract1Installments[0].paidDate = '2026-01-05';
  contract1Installments[0].paymentReference = 'TRX-998877';
}

const contract2Installments = generateInstallments(
  'cont-2',
  '2026-03-01',
  '2027-02-28',
  80000,
  'semi-annual' // دفعتان كل دفعة 40 ألف
);

export const initialContracts: LeaseContract[] = [
  {
    id: 'cont-1',
    branchId: 'br-1',
    contractNumber: 'EJ-2026-8819',
    landlordName: 'شركة العقارات المتطورة',
    landlordPhone: '0505544332',
    paymentNumber: '9200118822',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    totalAnnualAmount: 120000,
    frequency: 'quarterly',
    installments: contract1Installments,
    notes: 'عقد موثق عبر منصة إيجار - سداد ربع سنوي',
    createdAt: '2026-01-01',
  },
  {
    id: 'cont-2',
    branchId: 'br-2',
    contractNumber: 'EJ-2026-5541',
    landlordName: 'الشيخ إبراهيم القرشي',
    landlordPhone: '0567788990',
    paymentNumber: '9200445566',
    startDate: '2026-03-01',
    endDate: '2027-02-28',
    totalAnnualAmount: 80000,
    frequency: 'semi-annual',
    installments: contract2Installments,
    notes: 'دفعة أولى مستحقة قريباً',
    createdAt: '2026-02-25',
  }
];

export const initialMeters: UtilityMeter[] = [
  {
    id: 'meter-1',
    branchId: 'br-1',
    type: 'electricity',
    meterNumber: 'E-55443321',
    accountNumber: '1008899221',
    paymentNumber: '0011008899', // سداد كهرباء
    locationDescription: 'العداد الرئيسي - مبنى الإدارة (الطابق 3)',
    lastBillAmount: 1450,
    nextBillDueDate: '2026-12-05',
    notes: 'الشركة السعودية للكهرباء',
    createdAt: '2025-01-16',
  },
  {
    id: 'meter-2',
    branchId: 'br-1',
    type: 'water',
    meterNumber: 'W-99881122',
    accountNumber: '4005566771',
    paymentNumber: '0154005566', // سداد مياه الوطنية
    locationDescription: 'عداد المياه العام للمبنى والخدمات',
    lastBillAmount: 320,
    nextBillDueDate: '2026-12-10',
    notes: 'شركة المياه الوطنية',
    createdAt: '2025-01-16',
  },
  {
    id: 'meter-3',
    branchId: 'br-1',
    type: 'electricity',
    meterNumber: 'E-77661100',
    accountNumber: '1002233445',
    paymentNumber: '0011002233',
    locationDescription: 'عداد سكن العمال - ملحق حي العليا',
    lastBillAmount: 890,
    nextBillDueDate: '2026-11-28',
    notes: 'تغذية سكن عمال الصيانة',
    createdAt: '2025-02-01',
  },
  {
    id: 'meter-4',
    branchId: 'br-2',
    type: 'electricity',
    meterNumber: 'E-33221144',
    accountNumber: '2009988771',
    paymentNumber: '0012009988',
    locationDescription: 'العداد الرئيسي - معرض ومكتب جدة',
    lastBillAmount: 2100,
    nextBillDueDate: '2026-12-01',
    notes: 'فرع جدة الروضة',
    createdAt: '2025-01-20',
  }
];

export const initialFacilities: SubFacility[] = [
  {
    id: 'fac-1',
    branchId: 'br-1',
    name: 'سكن عمال الصيانة والتشغيل (المبنى A)',
    type: 'worker_housing',
    address: 'الرياض - حي الملز، شارع الجامعة',
    capacity: 24,
    currentOccupancy: 18,
    supervisorName: 'محمد إسماعيل',
    supervisorPhone: '0533221100',
    rentAmount: 36000,
    notes: 'عمارة سكنية مستأجرة 6 شقق للعمالة',
    createdAt: '2025-01-18',
  },
  {
    id: 'fac-2',
    branchId: 'br-1',
    name: 'مستودع المواد المركزية وقطع الغيار',
    type: 'warehouse',
    address: 'الرياض - حي السلي مخرج 18',
    capacity: 1000,
    currentOccupancy: 750,
    supervisorName: 'أحمد رضوان',
    supervisorPhone: '0544556677',
    rentAmount: 65000,
    notes: 'مستودع مجهز بكاميرات وعداد كهرباء مستقل',
    createdAt: '2025-02-05',
  },
  {
    id: 'fac-3',
    branchId: 'br-2',
    name: 'سكن فنيي وموظفي فرع جدة',
    type: 'worker_housing',
    address: 'جدة - حي الصفا',
    capacity: 16,
    currentOccupancy: 14,
    supervisorName: 'خالد السعيد',
    supervisorPhone: '0566778899',
    rentAmount: 28000,
    notes: 'سكن مجهز بالكامل ومكيف',
    createdAt: '2025-01-25',
  }
];

export const initialVehicles: Vehicle[] = [
  {
    id: 'veh-1',
    companyId: 'comp-1',
    branchId: 'br-1',
    plateNumber: 'أ ب ج 4321',
    makeModel: 'تويوتا هايلوكس دبل غمارة',
    year: 2023,
    vinNumber: 'MHFK1234567890123',
    istimaraExpiryDate: '2026-12-15', // قاربت على الانتهاء
    insuranceExpiryDate: '2026-11-29', // تنتهي خلال أيام (تنبيه عاجل!)
    insuranceCompany: 'التعاونية للتأمين',
    assignedDriverId: 'driv-1',
    status: 'active',
    notes: 'سيارة الحركة والتوريد اليومي',
    createdAt: '2025-01-16',
  },
  {
    id: 'veh-2',
    companyId: 'comp-1',
    branchId: 'br-1',
    plateNumber: 'د ر س 8899',
    makeModel: 'إيسوزو ديماكس نقل',
    year: 2022,
    vinNumber: 'ISUZU987654321001',
    istimaraExpiryDate: '2027-04-10',
    insuranceExpiryDate: '2027-03-01',
    insuranceCompany: 'تكافل الراجحي',
    assignedDriverId: 'driv-2',
    status: 'active',
    notes: 'مخصصة لنقل المعدات',
    createdAt: '2025-01-16',
  },
  {
    id: 'veh-3',
    companyId: 'comp-1',
    branchId: 'br-2',
    plateNumber: 'ط ي ر 5566',
    makeModel: 'هيونداي H1 فان بضائع',
    year: 2021,
    vinNumber: 'HYUN8877665544332',
    istimaraExpiryDate: '2026-11-10', // منتهية! (تنبيه حرج)
    insuranceExpiryDate: '2026-12-20',
    insuranceCompany: 'ملاذ للتأمين',
    status: 'maintenance',
    notes: 'تحتاج تجديد الاستمارة فوراً',
    createdAt: '2025-01-20',
  }
];

export const initialDrivers: Driver[] = [
  {
    id: 'driv-1',
    name: 'عثمان عبدالكريم يوسف',
    iqamaNumber: '2411998877',
    licenseNumber: 'LIC-776655',
    licenseExpiryDate: '2026-12-05', // تنتهي خلال أسبوعين
    phone: '0551122998',
    assignedVehicleId: 'veh-1',
    notes: 'سائق عمومي معتمد',
    createdAt: '2025-01-16',
  },
  {
    id: 'driv-2',
    name: 'سليمان راجو خان',
    iqamaNumber: '2399887766',
    licenseNumber: 'LIC-334411',
    licenseExpiryDate: '2027-08-15',
    phone: '0567788112',
    assignedVehicleId: 'veh-2',
    notes: 'سائق نقل ثقيل',
    createdAt: '2025-01-16',
  }
];

export const initialEmployees: Employee[] = [
  {
    id: 'emp-1',
    companyId: 'comp-1',
    branchId: 'br-1',
    facilityId: 'fac-1',
    name: 'عمر فاروق البشير',
    jobTitle: 'مشرف صيانة كهربائية',
    nationality: 'سوداني',
    phone: '0508877665',
    iqamaNumber: '2355441122',
    iqamaExpiryDate: '2026-11-30', // تنتهي خلال 9 أيام (عاجل جداً)
    workCardNumber: 'WK-88771122',
    workCardExpiryDate: '2026-12-25',
    healthCertificateNumber: 'HC-119900',
    healthCertificateExpiryDate: '2026-11-25', // تنتهي خلال 4 أيام!
    salary: 4500,
    status: 'active',
    notes: 'يقيم في سكن العمال مبنى A',
    createdAt: '2025-01-16',
  },
  {
    id: 'emp-2',
    companyId: 'comp-1',
    branchId: 'br-1',
    facilityId: 'fac-1',
    name: 'محمد نور الإسلام',
    jobTitle: 'فني تكييف وتبريد',
    nationality: 'بنغلاديشي',
    phone: '0533445566',
    iqamaNumber: '2488776655',
    iqamaExpiryDate: '2026-11-15', // منتهية! (تنبيه أحمر)
    workCardNumber: 'WK-55443322',
    workCardExpiryDate: '2026-12-10',
    healthCertificateNumber: 'HC-998877',
    healthCertificateExpiryDate: '2027-01-15',
    salary: 3200,
    status: 'active',
    notes: 'الإقامة بحاجة لتجديد عاجل',
    createdAt: '2025-01-16',
  },
  {
    id: 'emp-3',
    companyId: 'comp-1',
    branchId: 'br-1',
    name: 'عبدالرحمن الشهري',
    jobTitle: 'مسؤول مالي ومحاسب',
    nationality: 'سعودي',
    phone: '0555667788',
    iqamaNumber: '1099887766', // هوية وطنية
    iqamaExpiryDate: '2029-05-20',
    workCardNumber: 'WK-SA-9900',
    workCardExpiryDate: '2029-05-20',
    salary: 7500,
    status: 'active',
    notes: 'الفرع الرئيسي',
    createdAt: '2025-01-16',
  },
  {
    id: 'emp-4',
    companyId: 'comp-1',
    branchId: 'br-2',
    facilityId: 'fac-3',
    name: 'كريم أحمد محمود',
    jobTitle: 'أخصائي مبيعات',
    nationality: 'مصري',
    phone: '0544112233',
    iqamaNumber: '2411556677',
    iqamaExpiryDate: '2027-03-15',
    workCardNumber: 'WK-66778899',
    workCardExpiryDate: '2026-12-05', // كرت العمل ينتهي خلال أسبوعين
    healthCertificateNumber: 'HC-445566',
    healthCertificateExpiryDate: '2026-12-02', // شهادة صحية تنتهي قريباً
    salary: 5000,
    status: 'active',
    notes: 'فرع جدة الروضة',
    createdAt: '2025-01-20',
  }
];

export const initialTelecomAccounts: TelecomAccount[] = [
  {
    id: 'tel-1',
    companyId: 'comp-1',
    branchId: 'br-1',
    provider: 'STC',
    phoneNumber: '0114567890',
    accountNumber: '9001122334',
    paymentNumber: '0019001122', // سداد الاتصالات السعودية
    lineType: 'landline',
    monthlyCost: 350,
    assignedTo: 'الهاتف الثابت والفاكس للإدارة',
    notes: 'باقة الأعمال الموحدة',
    createdAt: '2025-01-16',
  },
  {
    id: 'tel-2',
    companyId: 'comp-1',
    branchId: 'br-1',
    provider: 'Mobily',
    phoneNumber: '0560011223',
    accountNumber: '5008899001',
    paymentNumber: '0055008899', // سداد موبايلي
    lineType: 'data_sim',
    monthlyCost: 220,
    assignedTo: 'راوتر إنترنت احتياطي لسكن العمال',
    notes: 'شريحة بيانات 5G مفتوحة',
    createdAt: '2025-02-01',
  },
  {
    id: 'tel-3',
    companyId: 'comp-1',
    branchId: 'br-2',
    provider: 'Zain',
    phoneNumber: '0599112233',
    accountNumber: '7003344556',
    paymentNumber: '0447003344', // سداد زين
    lineType: 'mobile',
    monthlyCost: 180,
    assignedTo: 'جوال خدمة العملاء والتوصيل',
    notes: 'فرع جدة الروضة',
    createdAt: '2025-01-20',
  }
];
