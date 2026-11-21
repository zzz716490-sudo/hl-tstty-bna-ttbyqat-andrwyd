import { Installment, PaymentFrequency, AlertItem, AlertType } from '../types';
import * as XLSX from 'xlsx';

/**
 * دالة استنتاج وتوليد جدول الدفعات تلقائياً بناءً على تاريخ البداية والنهاية والقيمة والدورية
 */
export function generateInstallments(
  contractId: string,
  startDateStr: string,
  endDateStr: string,
  totalAmount: number,
  frequency: PaymentFrequency
): Installment[] {
  if (!startDateStr || !endDateStr || totalAmount <= 0) return [];

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    return [];
  }

  // تحديد عدد الدفعات في السنة أو الفترة
  let numInstallments = 1;
  let monthsInterval = 12;

  switch (frequency) {
    case 'monthly':
      numInstallments = 12;
      monthsInterval = 1;
      break;
    case 'quarterly':
      numInstallments = 4;
      monthsInterval = 3;
      break;
    case 'semi-annual':
      numInstallments = 2;
      monthsInterval = 6;
      break;
    case 'annual':
      numInstallments = 1;
      monthsInterval = 12;
      break;
  }

  // حساب إجمالي أشهر العقد التقريبية
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const contractYears = Math.max(1, Math.round(diffDays / 365));

  const totalPaymentsCount = numInstallments * contractYears;
  const installmentAmount = Math.round((totalAmount / totalPaymentsCount) * 100) / 100;

  const installments: Installment[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < totalPaymentsCount; i++) {
    const dueDate = new Date(start);
    dueDate.setMonth(dueDate.getMonth() + i * monthsInterval);

    // إذا تجاوزت تاريخ نهاية العقد
    if (dueDate > end) {
      dueDate.setTime(end.getTime());
    }

    const dueDateFormatted = dueDate.toISOString().split('T')[0];
    const isPastDue = dueDate < today;

    installments.push({
      id: `inst-${contractId}-${i + 1}-${Date.now()}`,
      contractId,
      installmentNumber: i + 1,
      dueDate: dueDateFormatted,
      amount: installmentAmount,
      status: isPastDue ? 'overdue' : 'pending',
    });
  }

  return installments;
}

/**
 * حساب الأيام المتبقية وحالة التاريخ
 */
export function calculateDaysRemaining(targetDateStr?: string): {
  days: number;
  status: 'expired' | 'critical' | 'warning' | 'valid' | 'unknown';
  label: string;
} {
  if (!targetDateStr) {
    return { days: 0, status: 'unknown', label: 'غير محدد' };
  }

  const target = new Date(targetDateStr);
  if (isNaN(target.getTime())) {
    return { days: 0, status: 'unknown', label: 'تاريخ غير صالح' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return { days, status: 'expired', label: `منتهية منذ ${Math.abs(days)} يوم` };
  } else if (days === 0) {
    return { days, status: 'critical', label: 'تنتهي اليوم' };
  } else if (days <= 15) {
    return { days, status: 'critical', label: `متبقي ${days} يوم (عاجل)` };
  } else if (days <= 30) {
    return { days, status: 'warning', label: `متبقي ${days} يوم` };
  } else if (days <= 60) {
    return { days, status: 'valid', label: `متبقي شهرين (${days} يوم)` };
  } else {
    return { days, status: 'valid', label: `سارية (${days} يوم)` };
  }
}

/**
 * تنسيق المبالغ المالية بالريال السعودي
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * تنسيق التاريخ للعرض العربي
 */
export function formatDateArabic(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * تصدير البيانات إلى ملف Excel
 */
export function exportToExcel(data: Record<string, any>[], fileName: string, sheetName = 'بيانات') {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * تحويل ملف تم اختياره إلى Base64 للحفظ والعرض
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
