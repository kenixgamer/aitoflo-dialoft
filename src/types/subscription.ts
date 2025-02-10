export type PlanName = 'trial' | 'starter' | 'professional' | 'business' | 'agency';

export type SubscriptionStatus = 'trial' | 'active' | 'inactive' | 'past_due' | 'cancelled';

export interface SubscriptionData {
  status: SubscriptionStatus;
  planName: PlanName;
  minutesRemaining: number;
  customerId?: string;
  subscriptionId?: string;
  cancelAtPeriodEnd?: boolean;
  expiresAt?: string;
  features?: string[];
}

export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface PricingPlan {
  tier: string;
  price: string;
  period: string;
  planId: string;
  subtitle: string;
  minutes: string;
  features: string[];
  highlight?: boolean;
}

export interface EnterpriseFeaturesSection {
  category: string;
  features: string[];
}

export interface PricingCardProps {
  processingPlanId : string | null;
  tier: string;
  price: string;
  period: string;
  minutes: string;
  features: string[];
  highlight?: boolean;
  planId: string;
  onSubscribe: (planId: string) => void;
  isLoading: boolean;
  isCurrentPlan: boolean;
  subtitle: string;
}
