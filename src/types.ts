export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
}

export interface TrialRequestInput {
  storeName: string;
  ownerName: string;
  phone: string;
  city: string;
}

export interface SupportTicketInput {
  storeName: string;
  phone: string;
  subject: string;
  message: string;
}

export interface Testimonial {
  id: string;
  name: string;
  storeName: string;
  city: string;
  avatar: string;
  rating: number;
  text: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  oldPrice?: string;
  period: string;
  badge?: string;
  description: string;
  features: string[];
  ctaText: string;
  color: string;
}
