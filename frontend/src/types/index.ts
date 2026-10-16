export interface MenuCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

export interface MenuItem {
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
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  options?: string;
}

export interface TodaySpecial {
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
}

export interface GalleryItem {
  id: number;
  title: string;
  caption?: string | null;
  imageUrl: string;
  category: string;
  sortOrder: number;
}

export interface ReviewItem {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  platform: string;
  reviewDate: string;
  isFeatured: boolean;
  avatarUrl?: string | null;
}

export interface LoyaltyAccount {
  id: number;
  customerId: number;
  phone: string;
  customerName?: string;
  visitCount: number;
  currentCycleVisits: number;
  rewardsEarned: number;
  rewardsAvailable: number;
  birthdayMonth?: number | null;
  birthdayDay?: number | null;
  visitsRemaining: number;
  isBirthdayMonth: boolean;
  isRewardReady: boolean;
  transactions?: {
    id: number;
    transactionType: string;
    visitsDelta: number;
    rewardsDelta: number;
    description: string;
    createdAt: string;
  }[];
}

export interface Order {
  id: number;
  orderNumber: string;
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
  items?: {
    id: number;
    itemName: string;
    itemPrice: number;
    quantity: number;
    lineTotal: number;
    options?: string;
  }[];
  statusHistory?: {
    id: number;
    status: string;
    comment?: string;
    updatedBy: string;
    createdAt: string;
  }[];
}

export interface BusinessSettings {
  [key: string]: string;
}
