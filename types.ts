
export enum LoanStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  PENDING_DEPOSIT = 'PENDING_DEPOSIT',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DISBURSED = 'DISBURSED',
  REPAID = 'REPAID'
}

export interface UserProfile {
  id: string;
  mobile: string;
  name: string;
  address: string;
  nidNumber: string;
  nidFront?: string;
  nidBack?: string;
  selfie?: string;
  isVerified: boolean;
}

export interface LoanRequest {
  id: string;
  userId: string;
  amount: number;
  depositAmount: number;
  status: LoanStatus;
  createdAt: string;
  transactionId?: string;
}

export enum AppScreen {
  LOGIN = 'LOGIN',
  OTP = 'OTP',
  PROFILE_SETUP = 'PROFILE_SETUP',
  DOC_UPLOAD = 'DOC_UPLOAD',
  DASHBOARD = 'DASHBOARD',
  LOAN_APPLY = 'LOAN_APPLY',
  PAYMENT = 'PAYMENT',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  HISTORY = 'HISTORY'
}
