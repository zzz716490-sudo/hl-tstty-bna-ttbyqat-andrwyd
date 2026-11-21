// أنواع البيانات الشاملة للنظام (Corporate Management Data Types)

export type PaymentFrequency = 'monthly' | 'quarterly' | 'semi-annual' | 'annual';

export interface Company {
  id: string;
  name: string;
  commercialRegNo: string; // السجل التجاري
  taxNumber?: string;       // الرقم الضريبي
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt: string;
}

export interface Branch {
  id: string;
  companyId: string;
  name: string;
  city: string;
  address: string;
  managerName: string;
  managerPhone: string;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
}

export interface Installment {
  id: string;
  contractId: string;
  installmentNumber: number;
  dueDate: string; // YYYY-MM-DD
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentReference?: string; // رقم إيصال أو مرجع التحويل
  paidDate?: string;
  receiptNote?: string;
}

export interface LeaseContract {
  id: string;
  branchId: string;
  contractNumber: string;
  landlordName: string;
  landlordPhone: string;
  paymentNumber: string; // رقم السداد (فاتورة / سداد إيجار)
  startDate: string;     // YYYY-MM-DD
  endDate: string;       // YYYY-MM-DD
  totalAnnualAmount: number;
  frequency: PaymentFrequency; // شهري (12), ربع سنوي (4), نصف سنوي (2), سنوي (1)
  installments: Installment[];
  contractDocumentName?: string;
  contractDocumentData?: string; // Base64 data for image/file preview
  notes?: string;
  createdAt: string;
}

export interface UtilityMeter {
  id: string;
  branchId: string;
  facilityId?: string; // إن كان مرتبطاً بمنشأة معينة مثل سكن العمال
  type: 'electricity' | 'water'; // كهرباء أو مياه
  meterNumber: string;   // رقم العداد
  accountNumber: string; // رقم الحساب
  paymentNumber: string; // رقم السداد
  locationDescription: string; // وصف الموقع (الفرع الرئيسي، سكن العمال، الدور الأول..)
  lastBillAmount?: number;
  nextBillDueDate?: string;
  notes?: string;
  createdAt: string;
}

export interface SubFacility {
  id: string;
  branchId: string;
  name: string; // اسم المنشأة (مثلاً: سكن العمال مبنى 1)
  type: 'worker_housing' | 'warehouse' | 'sub_office' | 'workshop' | 'other';
  address: string;
  capacity?: number;       // السعة الاستيعابية (عدد الأفراد)
  currentOccupancy?: number; // العدد الفعلي الحالي
  supervisorName?: string;
  supervisorPhone?: string;
  rentAmount?: number;
  notes?: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  companyId: string;
  branchId?: string;
  plateNumber: string;      // رقم اللوحة
  makeModel: string;        // نوع وموديل المركبة (مثال: تويوتا هايلوكس 2023)
  year: number;             // سنة الصنع
  vinNumber?: string;       // رقم الهيكل
  istimaraExpiryDate: string; // تاريخ انتهاء الاستمارة
  insuranceExpiryDate: string; // تاريخ انتهاء التأمين
  insuranceCompany?: string;   // شركة التأمين
  assignedDriverId?: string;   // السائق المعين
  status: 'active' | 'maintenance' | 'inactive';
  notes?: string;
  createdAt: string;
}

export interface Driver {
  id: string;
  name: string;
  iqamaNumber: string;
  licenseNumber: string;
  licenseExpiryDate: string; // تاريخ انتهاء رخصة القيادة
  phone: string;
  assignedVehicleId?: string;
  notes?: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  companyId: string;
  branchId: string;
  facilityId?: string; // سكن العمال المقيم فيه الموظف
  name: string;
  jobTitle: string;
  nationality: string;
  phone: string;
  
  // بيانات الإقامة
  iqamaNumber: string;
  iqamaExpiryDate: string; // تاريخ انتهاء الإقامة
  
  // بيانات كرت العمل
  workCardNumber?: string;
  workCardExpiryDate?: string; // تاريخ انتهاء كرت العمل
  
  // بيانات الشهادة الصحية (مطلوبة للمطاعم والتموينات والأنشطة الصحية)
  healthCertificateNumber?: string;
  healthCertificateExpiryDate?: string; // تاريخ انتهاء الشهادة الصحية
  
  // معلومات إضافية
  salary?: number;
  status: 'active' | 'on_leave' | 'terminated';
  notes?: string;
  createdAt: string;
}

export interface TelecomAccount {
  id: string;
  companyId: string;
  branchId?: string;
  provider: 'STC' | 'Mobily' | 'Zain' | 'Salam' | 'Go' | 'Other';
  phoneNumber: string;       // رقم الهاتف أو الشريحة
  accountNumber: string;     // رقم الحساب
  paymentNumber: string;     // رقم السداد (رمز المفوتر / سداد)
  lineType: 'landline' | 'mobile' | 'data_sim' | 'fiber';
  monthlyCost?: number;
  assignedTo?: string;       // مخصص لـ (الفرع، المدير، كاشير...)
  notes?: string;
  createdAt: string;
}

export type AlertType = 
  | 'lease_payment'
  | 'lease_contract_expiry'
  | 'iqama_expiry'
  | 'work_card_expiry'
  | 'health_cert_expiry'
  | 'vehicle_istimara'
  | 'vehicle_insurance'
  | 'driver_license';

export interface AlertItem {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  dueDate: string;
  daysRemaining: number;
  status: 'critical' | 'warning' | 'info'; // critical: منتهية أو <= 7 أيام، warning: <= 30 يوم، info: <= 60 يوم
  relatedId: string;
  relatedType: string;
  branchName?: string;
  companyName?: string;
}
