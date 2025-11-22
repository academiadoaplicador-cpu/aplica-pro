
export enum ViewMode {
  HOME = 'HOME',
  MATERIAL_ESTIMATOR = 'MATERIAL_ESTIMATOR',
  AI_ASSISTANT = 'AI_ASSISTANT',
  FINANCIAL_PROFILE = 'FINANCIAL_PROFILE',
  CRM = 'CRM',
  REPORTS = 'REPORTS',
  PROFILE = 'PROFILE',
  MAP = 'MAP',
  SCHEDULER = 'SCHEDULER',
  PAYMENT_MANAGER = 'PAYMENT_MANAGER',
  CLIENT_PORTAL = 'CLIENT_PORTAL',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}

export type UserRole = 'user' | 'admin';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface QuoteResult {
  totalMaterialCost: number;
  totalLaborCost: number;
  totalFixedCost: number;
  totalCost: number;
  suggestedPrice: number;
  estimatedProfit: number;
  profitMargin: number;
  pricePerSqm: number;
}

export interface VehiclePreset {
  id: string;
  name: string;
  avgMaterial: number;
  category?: 'car' | 'truck' | 'bus' | 'van' | 'agri'; // Campo adicionado para corrigir erro
}

export interface FinancialData {
  monthlyFixedCosts: {
    rent: number;
    utilities: number;
    software: number;
    marketing: number;
    mei_taxes: number;
    misc: number;
  };
  proLabore: number;
  workingDaysPerMonth: number;
  workingHoursPerDay: number;
  
  totalMonthlyCost: number;
  dailyCost: number;
  hourlyCost: number;
}

export interface BudgetItem {
  id: string;
  type: 'vehicle' | 'fridge' | 'flat';
  name: string;
  details: string;
  materialType?: string;
  quantity: number;
  rollWidth: number;
  linearMetersTotal: number;
  rawMaterialCost?: number;
  servicePrice?: number;
  estimatedTime?: number;
  pricePerSqm?: number;
  layoutFile?: {
      name: string;
      data: string;
      mimeType: string;
  };
  helpers?: number;
  extraCosts?: number;
  profitMargin?: number;
}

export type QuoteStage = 'Novo' | 'Em análise' | 'Aprovado' | 'Em execução' | 'Concluído' | 'Pago';

export interface CRMQuote {
  id: string;
  technicianID: string;
  clientName: string;
  clientPhone?: string;
  serviceDescription: string;
  quotedValue: number;
  items: BudgetItem[];
  paymentCondition?: string;
  observations?: string;
  dateCreated: Date;
  currentStage: QuoteStage;
  lastUpdated: Date;
}

export type CertificateStatus = 'Pendente' | 'Aprovado' | 'Rejeitado';

export interface Certificate {
  id: string;
  courseName: string;
  institution: string;
  date: string;
  fileName: string;
  status: CertificateStatus;
}

export interface UserSkills {
  ppf: boolean;
  decorative: boolean;
  fleet: boolean;
  visual: boolean;
  colorChange: boolean;
}

export interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
}

export type SubscriptionStatus = 'active' | 'trial' | 'expired' | 'none';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  city: string;
  state: string;
  zipCode?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  experienceYears: number;
  rating: number;
  profilePicture?: string;
  skills: UserSkills;
  certificates: Certificate[];
  reviews: Review[];
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlan?: 'monthly' | 'annual';
  trialEndsAt?: Date;
}

export interface EventType {
  id: string;
  title: string;
  duration: number;
  description?: string;
  color: string;
  price?: number;
}

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    type: 'service' | 'quote' | 'personal';
    clientName?: string;
    status: 'confirmed' | 'pending';
}

export interface ServiceRequest {
    id: string;
    clientName: string;
    contact: string;
    type: string;
    description: string;
    date: Date;
    status: 'pending' | 'responded';
    budgetDetails?: {
        serviceType: string;
        subType: string;
        materialTier: string;
        address: string;
        distanceKm: number;
        estimatedValueMin: number;
        estimatedValueMax: number;
    };
}

export interface PaymentLink {
    id: string;
    title?: string;
    clientName: string;
    description: string;
    amount: number;
    status: 'pending' | 'paid';
    dateCreated: Date;
    method?: 'pix' | 'credit';
}

export interface MapRequest {
    id: string;
    userId: string;
    userName: string;
    city: string;
    status: string;
    date: Date;
}

export interface AdminStats {
    totalUsers: number;
    activeSubscriptions: number;
    mrr: number;
    totalRevenue: number;
}

export interface VinylLine {
    price: number;
    widths: number[];
    colors: string[];
    recommendedFor?: string[]; // Campo adicionado para corrigir erro
}

export interface VinylBrand {
    [line: string]: VinylLine;
}

export interface VinylCategory {
    [brand: string]: VinylBrand;
}

export interface VinylCatalogData {
    [category: string]: VinylCategory;
}
