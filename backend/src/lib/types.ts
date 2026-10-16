export interface AdminUser {
  id: number;
  email: string;
  name: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerData {
  id: number;
  name: string | null;
  phone: string;
  email: string | null;
  birthday: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MarketingConsentData {
  id: number;
  phone: string;
  consentType: string;
  isConsented: boolean;
  source: string;
  ipAddress?: string | null;
  optedOutAt?: string | null;
  createdAt: string;
  updatedAt: string;
  customerId?: number | null;
}

export interface MenuCategoryData {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItemData {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  categoryId: number;
  isAvailable: boolean;
  isBestseller: boolean;
  isTodaySpecial: boolean;
  isVeg: boolean;
  prepTimeMins: number;
  calories?: string;
  allergens?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TodaySpecialData {
  id: number;
  menuItemId?: number | null;
  title: string;
  description: string;
  image: string;
  originalPrice?: number | null;
  offerPrice: number;
  badgeText: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryImageData {
  id: number;
  title: string;
  caption?: string | null;
  imageUrl: string;
  category: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemData {
  id: number;
  orderId: number;
  menuItemId?: number | null;
  itemName: string;
  itemPrice: number;
  quantity: number;
  lineTotal: number;
  options?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusHistoryData {
  id: number;
  orderId: number;
  status: string;
  comment?: string;
  updatedBy: string;
  createdAt: string;
}

export interface OrderData {
  id: number;
  orderNumber: string;
  customerId?: number | null;
  customerName: string;
  customerPhone: string;
  pickupTime: string;
  orderNotes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  isWhatsAppOrder: boolean;
  createdAt: string;
  updatedAt: string;
  items?: OrderItemData[];
  statusHistory?: OrderStatusHistoryData[];
}

export interface LoyaltyAccountData {
  id: number;
  customerId: number;
  phone: string;
  visitCount: number;
  currentCycleVisits: number;
  rewardsEarned: number;
  rewardsAvailable: number;
  birthdayMonth?: number | null;
  birthdayDay?: number | null;
  createdAt: string;
  updatedAt: string;
  customerName?: string;
}

export interface LoyaltyTransactionData {
  id: number;
  loyaltyAccountId: number;
  orderId?: number | null;
  transactionType: string;
  visitsDelta: number;
  rewardsDelta: number;
  description: string;
  createdAt: string;
}

export interface RewardData {
  id: number;
  title: string;
  description: string;
  requiredVisits: number;
  rewardType: string;
  discountAmount?: number | null;
  eligibleItemName?: string | null;
  isActive: boolean;
  termsConditions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFeedbackData {
  id: number;
  customerId?: number | null;
  customerName?: string | null;
  customerPhone?: string | null;
  overallRating: number;
  foodQualityRating: number;
  serviceRating: number;
  orderReference?: string | null;
  comments: string;
  allowFollowUp: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewData {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  platform: string;
  reviewDate: string;
  isFeatured: boolean;
  isActive: boolean;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FestivalCampaignData {
  id: number;
  name: string;
  occasion: string;
  messageTemplate: string;
  offerDetails?: string;
  scheduledFor?: string | null;
  status: 'DRAFT' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  sentCount: number;
  totalTarget: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignRecipientData {
  id: number;
  campaignId: number;
  customerId?: number | null;
  phone: string;
  customerName?: string;
  status: 'PENDING' | 'SENT' | 'FAILED' | 'DEMO_PREVIEWED';
  sentAt?: string | null;
  errorMessage?: string | null;
  createdAt: string;
}

export interface BusinessSettingData {
  id: number;
  key: string;
  value: string;
  category: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
