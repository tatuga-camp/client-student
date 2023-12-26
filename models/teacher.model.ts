export interface User {
  id: string;
  createAt: string;
  updateAt: string;
  email: string;
  firstName: string;
  picture: string;
  lastName: string;
  phone: string;
  school: string;
  provider: string;
  resetToken: string | null;
  resetTokenExpiresAt: string | null;
  IsResetPassword: boolean;
  isSchoolAccount: boolean;
  lastActiveAt: string;
  language: string;
  plan: string;
  role: string;
  isDisabled: boolean;
  isDelete: boolean;
  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  stripeCurrentPeriodEnd: string | null;
}
