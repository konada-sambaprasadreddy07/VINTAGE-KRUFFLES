import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import {
  AdminUser,
  CustomerData,
  MarketingConsentData,
  MenuCategoryData,
  MenuItemData,
  TodaySpecialData,
  GalleryImageData,
  OrderData,
  OrderItemData,
  OrderStatusHistoryData,
  LoyaltyAccountData,
  LoyaltyTransactionData,
  RewardData,
  CustomerFeedbackData,
  ReviewData,
  FestivalCampaignData,
  CampaignRecipientData,
  BusinessSettingData
} from './types.js';

interface DatabaseState {
  admins: AdminUser[];
  customers: CustomerData[];
  marketingConsents: MarketingConsentData[];
  categories: MenuCategoryData[];
  menuItems: MenuItemData[];
  todaySpecials: TodaySpecialData[];
  gallery: GalleryImageData[];
  orders: OrderData[];
  orderItems: OrderItemData[];
  orderStatusHistory: OrderStatusHistoryData[];
  loyaltyAccounts: LoyaltyAccountData[];
  loyaltyTransactions: LoyaltyTransactionData[];
  rewards: RewardData[];
  feedback: CustomerFeedbackData[];
  reviews: ReviewData[];
  campaigns: FestivalCampaignData[];
  campaignRecipients: CampaignRecipientData[];
  businessSettings: BusinessSettingData[];
}

export const prisma = new PrismaClient();
let isPrismaConnected = false;

// Ensure local persistence directory exists
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dbFilePath = path.join(dataDir, 'db.json');

// Initial seed generator
const generateInitialData = (): DatabaseState => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(process.env.ADMIN_INITIAL_PASSWORD || 'Admin@Kruffles2026', salt);
  const now = new Date().toISOString();
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  return {
    admins: [
      {
        id: 1,
        email: process.env.ADMIN_INITIAL_EMAIL || 'admin@vintagekruffles.com',
        name: 'Head Cafe Manager',
        password: hashedPassword,
        role: 'SUPERADMIN',
        createdAt: now,
        updatedAt: now
      }
    ],
    customers: [
      {
        id: 1,
        name: 'Ananya Sharma',
        phone: '9848022338',
        email: 'ananya.vizag@gmail.com',
        birthday: '1998-11-15T00:00:00.000Z',
        notes: 'Prefers extra chocolate dip',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        name: 'Rahul Varma',
        phone: '9988776655',
        email: 'rahul.v@outlook.com',
        birthday: '1995-04-22T00:00:00.000Z',
        notes: 'Weekend regular',
        createdAt: now,
        updatedAt: now
      }
    ],
    marketingConsents: [
      {
        id: 1,
        phone: '9848022338',
        consentType: 'WHATSAPP_PROMO',
        isConsented: true,
        source: 'WEBSITE_POPUP',
        ipAddress: '127.0.0.1',
        createdAt: now,
        updatedAt: now,
        customerId: 1
      },
      {
        id: 2,
        phone: '9988776655',
        consentType: 'WHATSAPP_PROMO',
        isConsented: true,
        source: 'CHECKOUT',
        ipAddress: '127.0.0.1',
        createdAt: now,
        updatedAt: now,
        customerId: 2
      }
    ],
    categories: [
      { id: 1, name: 'Classic Waffles', slug: 'classic-waffles', description: 'Crispy golden Belgian waffles with butter, maple syrup & honey', icon: '🧇', sortOrder: 1, isActive: true, createdAt: now, updatedAt: now },
      { id: 2, name: 'Chocolate Waffles', slug: 'chocolate-waffles', description: 'Decadent chocolate loaded waffles with dark & milk Belgian drizzles', icon: '🍫', sortOrder: 2, isActive: true, createdAt: now, updatedAt: now },
      { id: 3, name: 'Signature Waffles', slug: 'signature-waffles', description: 'Chef-curated gourmet waffle creations exclusive to RK Beach', icon: '✨', sortOrder: 3, isActive: true, createdAt: now, updatedAt: now },
      { id: 4, name: 'Fruit Waffles', slug: 'fruit-waffles', description: 'Fresh seasonal berries, bananas, and fruit purees over warm waffles', icon: '🍓', sortOrder: 4, isActive: true, createdAt: now, updatedAt: now },
      { id: 5, name: 'Classic Pancakes', slug: 'classic-pancakes', description: 'Tender fluffy American-style stacks served hot off the griddle', icon: '🥞', sortOrder: 5, isActive: true, createdAt: now, updatedAt: now },
      { id: 6, name: 'Chocolate Pancakes', slug: 'chocolate-pancakes', description: 'Rich cocoa stacks layered with chocolate fudge and choco-chips', icon: '🍪', sortOrder: 6, isActive: true, createdAt: now, updatedAt: now },
      { id: 7, name: 'Premium Pancakes', slug: 'premium-pancakes', description: 'Gourmet Biscoff, Nutella & salted caramel pancake towers', icon: '👑', sortOrder: 7, isActive: true, createdAt: now, updatedAt: now },
      { id: 8, name: 'Combos & Desserts', slug: 'combos-desserts', description: 'Shareable waffle platters, dessert bowls and sweet treats', icon: '🍨', sortOrder: 8, isActive: true, createdAt: now, updatedAt: now },
      { id: 9, name: 'Beverages', slug: 'beverages', description: 'Artisan cold brews, shakes, coolers and iced coffees', icon: '🥤', sortOrder: 9, isActive: true, createdAt: now, updatedAt: now }
    ],
    menuItems: [
      {
        id: 1,
        name: 'Belgian Golden Butter Waffle',
        slug: 'belgian-golden-butter-waffle',
        description: 'Authentic crispy Belgian waffle served with salted French butter, powdered sugar, and warm amber maple syrup. [Sample price for development]',
        price: 149.00,
        image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80',
        categoryId: 1,
        isAvailable: true,
        isBestseller: true,
        isTodaySpecial: false,
        isVeg: true,
        prepTimeMins: 12,
        calories: '380 kcal',
        allergens: 'Contains Wheat, Milk',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        name: 'Triple Chocolate Overload Waffle',
        slug: 'triple-chocolate-overload-waffle',
        description: 'Crispy waffle smothered in Belgian milk chocolate, dark chocolate drizzle, and white chocolate curls. [Sample price for development]',
        price: 199.00,
        image: 'https://images.unsplash.com/photo-1568051243851-f9b136146e97?auto=format&fit=crop&w=800&q=80',
        categoryId: 2,
        isAvailable: true,
        isBestseller: true,
        isTodaySpecial: true,
        isVeg: true,
        prepTimeMins: 15,
        calories: '520 kcal',
        allergens: 'Contains Wheat, Milk, Soy',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 3,
        name: 'Nutella & Roasted Hazelnut Waffle',
        slug: 'nutella-roasted-hazelnut-waffle',
        description: 'Lavishly layered with authentic Italian Nutella and crunchy slow-roasted hazelnuts. [Sample price for development]',
        price: 229.00,
        image: 'https://images.unsplash.com/photo-1598214886806-c87b84b7078b?auto=format&fit=crop&w=800&q=80',
        categoryId: 3,
        isAvailable: true,
        isBestseller: true,
        isTodaySpecial: false,
        isVeg: true,
        prepTimeMins: 15,
        calories: '560 kcal',
        allergens: 'Contains Tree Nuts, Milk, Wheat',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 4,
        name: 'Fresh Berry Blast Waffle',
        slug: 'fresh-berry-blast-waffle',
        description: 'Topped with wild strawberries, blueberries, velvety vanilla cream cheese and berry compote. [Sample price for development]',
        price: 219.00,
        image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80',
        categoryId: 4,
        isAvailable: true,
        isBestseller: false,
        isTodaySpecial: false,
        isVeg: true,
        prepTimeMins: 14,
        calories: '410 kcal',
        allergens: 'Contains Wheat, Milk',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 5,
        name: 'Vintage Fluffy Buttermilk Pancake Stack',
        slug: 'vintage-fluffy-buttermilk-pancake-stack',
        description: 'A 3-tier tower of airy buttermilk pancakes topped with whipped butter and pure maple drizzle. [Sample price for development]',
        price: 159.00,
        image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80',
        categoryId: 5,
        isAvailable: true,
        isBestseller: true,
        isTodaySpecial: false,
        isVeg: true,
        prepTimeMins: 12,
        calories: '420 kcal',
        allergens: 'Contains Wheat, Milk',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 6,
        name: 'Dark Choco-Chip Pancake Tower',
        slug: 'dark-choco-chip-pancake-tower',
        description: 'Fluffy pancakes infused with 55% cocoa chips, warm fudge sauce, and chocolate shavings. [Sample price for development]',
        price: 189.00,
        image: 'https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?auto=format&fit=crop&w=800&q=80',
        categoryId: 6,
        isAvailable: true,
        isBestseller: false,
        isTodaySpecial: false,
        isVeg: true,
        prepTimeMins: 15,
        calories: '490 kcal',
        allergens: 'Contains Wheat, Milk, Soy',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 7,
        name: 'Lotus Biscoff Crunch Pancake Deluxe',
        slug: 'lotus-biscoff-crunch-pancake-deluxe',
        description: 'Layered with molten Biscoff spread, crushed caramelized speculoos cookies and vanilla cream. [Sample price for development]',
        price: 239.00,
        image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=800&q=80',
        categoryId: 7,
        isAvailable: true,
        isBestseller: true,
        isTodaySpecial: false,
        isVeg: true,
        prepTimeMins: 15,
        calories: '580 kcal',
        allergens: 'Contains Wheat, Milk, Soy',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 8,
        name: 'Kruffles Sundae & Waffle Bites Bowl',
        slug: 'kruffles-sundae-waffle-bites-bowl',
        description: 'Mini golden waffle squares, rich chocolate brownie chunks, two scoops of vanilla gelato, and chocolate drizzle. [Sample price for development]',
        price: 269.00,
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
        categoryId: 8,
        isAvailable: true,
        isBestseller: true,
        isTodaySpecial: false,
        isVeg: true,
        prepTimeMins: 16,
        calories: '640 kcal',
        allergens: 'Contains Wheat, Milk',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 9,
        name: 'Vizag Coast Iced Cold Coffee',
        slug: 'vizag-coast-iced-cold-coffee',
        description: 'Slow-brewed espresso blended with chilled milk and a scoop of creamy vanilla ice cream. [Sample price for development]',
        price: 129.00,
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
        categoryId: 9,
        isAvailable: true,
        isBestseller: true,
        isTodaySpecial: false,
        isVeg: true,
        prepTimeMins: 5,
        calories: '210 kcal',
        allergens: 'Contains Milk',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 10,
        name: 'RK Beach Sunset Mojito Cooler',
        slug: 'rk-beach-sunset-mojito-cooler',
        description: 'Refreshing passion fruit, fresh mint leaves, squeezed lime, and sparkling soda. [Sample price for development]',
        price: 119.00,
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
        categoryId: 9,
        isAvailable: true,
        isBestseller: false,
        isTodaySpecial: false,
        isVeg: true,
        prepTimeMins: 5,
        calories: '120 kcal',
        allergens: 'None',
        createdAt: now,
        updatedAt: now
      }
    ],
    todaySpecials: [
      {
        id: 1,
        menuItemId: 2,
        title: 'RK Beach Sunset Special: Triple Chocolate Sensation',
        description: 'Freshly pressed Belgian waffle smothered in molten Belgian dark & milk chocolate, topped with crunchy choco-pearls and vanilla gelato. [Sample offer for development]',
        image: 'https://images.unsplash.com/photo-1568051243851-f9b136146e97?auto=format&fit=crop&w=1200&q=80',
        originalPrice: 249.00,
        offerPrice: 199.00,
        badgeText: "Chef's Beach Special (Save ₹50)",
        startDate: now,
        endDate: nextMonth,
        isActive: true,
        createdAt: now,
        updatedAt: now
      }
    ],
    gallery: [
      { id: 1, title: 'Crisp Belgian Grid Perfection', caption: 'Freshly pressed on our cast iron waffle makers at RK Beach', imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80', category: 'Waffles', sortOrder: 1, createdAt: now, updatedAt: now },
      { id: 2, title: 'Molten Belgian Drizzle', caption: 'Rich chocolate cascaded over warm golden waffles', imageUrl: 'https://images.unsplash.com/photo-1568051243851-f9b136146e97?auto=format&fit=crop&w=800&q=80', category: 'Waffles', sortOrder: 2, createdAt: now, updatedAt: now },
      { id: 3, title: 'Fluffy Stack Heaven', caption: 'Morning till evening, sweet moments stacked high', imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80', category: 'Pancakes', sortOrder: 3, createdAt: now, updatedAt: now },
      { id: 4, title: 'Fresh Berry Compote Deluxe', caption: 'Loaded with handpicked berries and velvety cream', imageUrl: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80', category: 'Fruit Waffles', sortOrder: 4, createdAt: now, updatedAt: now },
      { id: 5, title: 'Biscoff Caramelized Delight', caption: 'Crunchy speculoos cookie crumbles and caramel swirls', imageUrl: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=800&q=80', category: 'Pancakes', sortOrder: 5, createdAt: now, updatedAt: now },
      { id: 6, title: 'Sunset Cold Brew & Gelato', caption: 'The perfect companion for a walk along RK Beach Vizag', imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80', category: 'Beverages', sortOrder: 6, createdAt: now, updatedAt: now }
    ],
    orders: [
      {
        id: 1,
        orderNumber: 'VK-2026-1001',
        customerId: 1,
        customerName: 'Ananya Sharma',
        customerPhone: '9848022338',
        pickupTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        orderNotes: 'Please pack chocolate dip in separate container.',
        status: 'READY',
        subtotal: 398.00,
        discount: 0.00,
        tax: 0.00,
        total: 398.00,
        paymentMethod: 'PAY_AT_PICKUP',
        paymentStatus: 'PENDING',
        isWhatsAppOrder: false,
        createdAt: now,
        updatedAt: now
      }
    ],
    orderItems: [
      { id: 1, orderId: 1, menuItemId: 2, itemName: 'Triple Chocolate Overload Waffle', itemPrice: 199.00, quantity: 2, lineTotal: 398.00, options: 'Extra chocolate', createdAt: now, updatedAt: now }
    ],
    orderStatusHistory: [
      { id: 1, orderId: 1, status: 'PENDING', comment: 'Order received via website pre-order', updatedBy: 'SYSTEM', createdAt: now },
      { id: 2, orderId: 1, status: 'CONFIRMED', comment: 'Order confirmed by kitchen staff', updatedBy: 'ADMIN', createdAt: now },
      { id: 3, orderId: 1, status: 'PREPARING', comment: 'Waffles are in the cast-iron iron griddle', updatedBy: 'KITCHEN', createdAt: now },
      { id: 4, orderId: 1, status: 'READY', comment: 'Packaged hot and waiting at pickup counter', updatedBy: 'ADMIN', createdAt: now }
    ],
    loyaltyAccounts: [
      {
        id: 1,
        customerId: 1,
        phone: '9848022338',
        visitCount: 9,
        currentCycleVisits: 9,
        rewardsEarned: 0,
        rewardsAvailable: 0,
        birthdayMonth: 11,
        birthdayDay: 15,
        customerName: 'Ananya Sharma',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        customerId: 2,
        phone: '9988776655',
        visitCount: 14,
        currentCycleVisits: 4,
        rewardsEarned: 1,
        rewardsAvailable: 1,
        birthdayMonth: 4,
        birthdayDay: 22,
        customerName: 'Rahul Varma',
        createdAt: now,
        updatedAt: now
      }
    ],
    loyaltyTransactions: [
      { id: 1, loyaltyAccountId: 1, orderId: 1, transactionType: 'VISIT_CREDIT', visitsDelta: 1, rewardsDelta: 0, description: 'Order #VK-2026-1001 qualifying visit', createdAt: now },
      { id: 2, loyaltyAccountId: 2, orderId: null, transactionType: 'REWARD_UNLOCKED', visitsDelta: 0, rewardsDelta: 1, description: 'Unlocked 1 Free Signature Waffle after 10 visits!', createdAt: now }
    ],
    rewards: [
      {
        id: 1,
        title: 'Free Belgian Signature Waffle',
        description: 'Earn 1 free eligible signature waffle of your choice after every 10 qualifying visits or orders.',
        requiredVisits: 10,
        rewardType: 'FREE_ITEM',
        discountAmount: 229.00,
        eligibleItemName: 'Any Signature Waffle or Pancake',
        isActive: true,
        termsConditions: 'Valid on in-store pickup or dine-at-beach. Cannot be combined with festival coupons.',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        title: 'Sweet Birthday Celebration Treat',
        description: 'Enjoy a 20% flat discount on your entire order during your birthday week.',
        requiredVisits: 0,
        rewardType: 'PERCENT_OFF',
        discountAmount: 20.00,
        eligibleItemName: 'Entire Order',
        isActive: true,
        termsConditions: 'Requires birthday registered on phone number at least 7 days in advance.',
        createdAt: now,
        updatedAt: now
      }
    ],
    feedback: [
      {
        id: 1,
        customerId: 1,
        customerName: 'Ananya Sharma',
        customerPhone: '9848022338',
        overallRating: 5,
        foodQualityRating: 5,
        serviceRating: 5,
        orderReference: 'VK-2026-1001',
        comments: 'The Triple Chocolate Waffle was out of this world! Warm, super crispy on the outside, and fluffy inside. Love eating here after an evening walk along RK Beach!',
        allowFollowUp: true,
        isApproved: true,
        createdAt: now,
        updatedAt: now
      }
    ],
    reviews: [
      {
        id: 1,
        customerName: 'Sneha R.',
        rating: 5.0,
        comment: 'Hands down the best dessert spot in Vizag! The waffles have the most incredible golden crunch and the chocolate is rich and authentic. Perfect spot right near RK Beach.',
        platform: 'Google Reviews',
        reviewDate: '2026-10-10T19:30:00.000Z',
        isFeatured: true,
        isActive: true,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        customerName: 'Karthik Naidu',
        rating: 4.8,
        comment: 'We visited during our evening stroll at Beach Road. The Biscoff pancake stack was phenomenal. Courteous staff and quick service even during peak hours.',
        platform: 'Google Reviews',
        reviewDate: '2026-10-12T20:15:00.000Z',
        isFeatured: true,
        isActive: true,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 3,
        customerName: 'Divya & Friends',
        rating: 5.0,
        comment: 'The Kruffles Sweet Rewards program is so cool! 10 visits gets you a free waffle. Atmosphere and sea breeze makes dessert time magical.',
        platform: 'In-Store Guestbook',
        reviewDate: '2026-10-14T21:00:00.000Z',
        isFeatured: true,
        isActive: true,
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        createdAt: now,
        updatedAt: now
      }
    ],
    campaigns: [
      {
        id: 1,
        name: 'Diwali Sweet Sparkle Fest 2026',
        occasion: 'DIWALI',
        messageTemplate: '🪔 Happy Diwali {NAME}! Celebrate the festival of lights with warmth & sweetness at Vintage Kruffles, RK Beach! Show this message for a complimentary molten chocolate dip with any waffle order tonight. Open 5 PM - 10 PM. See you at the beach! 🧇✨',
        offerDetails: 'Free Molten Chocolate Dip with any waffle order',
        scheduledFor: '2026-11-01T17:00:00.000Z',
        status: 'SCHEDULED',
        sentCount: 0,
        totalTarget: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        name: 'Sankranti Sweet Celebrations',
        occasion: 'SANKRANTI',
        messageTemplate: '🪁 Happy Sankranti from Vintage Kruffles! Enjoy golden crispy waffles by the Vizag sea breeze with your family. 15% OFF on all shareable dessert platters today!',
        offerDetails: '15% OFF on dessert platters',
        scheduledFor: null,
        status: 'DRAFT',
        sentCount: 0,
        totalTarget: 2,
        createdAt: now,
        updatedAt: now
      }
    ],
    campaignRecipients: [
      { id: 1, campaignId: 1, customerId: 1, phone: '9848022338', customerName: 'Ananya Sharma', status: 'PENDING', createdAt: now },
      { id: 2, campaignId: 1, customerId: 2, phone: '9988776655', customerName: 'Rahul Varma', status: 'PENDING', createdAt: now }
    ],
    businessSettings: [
      { id: 1, key: 'CAFE_NAME', value: 'VINTAGE KRUFFLES', category: 'GENERAL', description: 'Official registered brand name', createdAt: now, updatedAt: now },
      { id: 2, key: 'TAGLINE', value: 'A Little Sweetness, A Lot of Happiness.', category: 'GENERAL', description: 'Hero section headline', createdAt: now, updatedAt: now },
      { id: 3, key: 'SUBTITLE', value: 'Freshly made pancakes, golden crispy waffles, and sweet moments at RK Beach.', category: 'GENERAL', description: 'Hero supporting description', createdAt: now, updatedAt: now },
      { id: 4, key: 'LOCATION_TEXT', value: 'Near RK Beach, Visakhapatnam, Andhra Pradesh 530002, India', category: 'CONTACT', description: 'Address shown on website and footer (Editable in Admin)', createdAt: now, updatedAt: now },
      { id: 5, key: 'PHONE_NUMBER', value: '+91 89789 41336', category: 'CONTACT', description: 'Official contact phone number (Editable in Admin)', createdAt: now, updatedAt: now },
      { id: 6, key: 'WHATSAPP_NUMBER', value: '918978941336', category: 'WHATSAPP', description: 'WhatsApp number for click-to-chat order routing (Editable in Admin)', createdAt: now, updatedAt: now },
      { id: 7, key: 'EMAIL_ADDRESS', value: 'hello@vintagekruffles.com', category: 'CONTACT', description: 'General cafe inquiry email', createdAt: now, updatedAt: now },
      { id: 8, key: 'OPENING_HOURS', value: '5:00 PM to 10:00 PM (Daily)', category: 'TIMINGS', description: 'Operating hours across all 7 days', createdAt: now, updatedAt: now },
      { id: 9, key: 'BUSINESS_RATING', value: '4.5/5', category: 'GENERAL', description: 'Verified customer satisfaction score', createdAt: now, updatedAt: now },
      { id: 10, key: 'GOOGLE_MAPS_EMBED_URL', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15201.258414407842!2d83.3150005!3d17.712613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39433c2a6ff4a1%3A0x6b0938634a475ef!2sRK%20Beach%2C%20Visakhapatnam!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin', category: 'CONTACT', description: 'Google Maps embed link for RK Beach (Editable in Admin)', createdAt: now, updatedAt: now },
      { id: 11, key: 'INSTAGRAM_URL', value: 'https://instagram.com/vintagekruffles', category: 'CONTACT', description: 'Instagram handle link', createdAt: now, updatedAt: now },
      { id: 12, key: 'LOYALTY_VISITS_REQUIRED', value: '10', category: 'LOYALTY', description: 'Number of qualifying visits to earn a free reward', createdAt: now, updatedAt: now },
      { id: 13, key: 'LOYALTY_FREE_REWARD_NAME', value: 'Free Belgian Signature Waffle', category: 'LOYALTY', description: 'Reward granted upon achieving target visits', createdAt: now, updatedAt: now },
      { id: 14, key: 'BIRTHDAY_DISCOUNT_PERCENT', value: '20', category: 'LOYALTY', description: 'Birthday percentage discount for registered members', createdAt: now, updatedAt: now },
      { id: 15, key: 'POPUP_DELAY_SECONDS', value: '5', category: 'APPEARANCE', description: 'Seconds to wait before displaying the Sweet Deals popup', createdAt: now, updatedAt: now }
    ]
  };
};

class DatabaseRepository {
  private data: DatabaseState;

  constructor() {
    if (fs.existsSync(dbFilePath)) {
      try {
        const raw = fs.readFileSync(dbFilePath, 'utf8');
        this.data = JSON.parse(raw);
      } catch {
        this.data = generateInitialData();
        this.save();
      }
    } else {
      this.data = generateInitialData();
      this.save();
    }
  }

  private save() {
    try {
      fs.writeFileSync(dbFilePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to save db.json:', err);
    }
  }

  // Admins
  findAdminByEmail(email: string) {
    return this.data.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
  }

  findAdminById(id: number) {
    return this.data.admins.find(a => a.id === id);
  }

  // Settings
  getSettings(): Record<string, string> {
    const map: Record<string, string> = {};
    for (const s of this.data.businessSettings) {
      map[s.key] = s.value;
    }
    return map;
  }

  getAllSettingsList() {
    return this.data.businessSettings;
  }

  updateSetting(key: string, value: string) {
    const s = this.data.businessSettings.find(item => item.key === key);
    if (s) {
      s.value = value;
      s.updatedAt = new Date().toISOString();
    } else {
      this.data.businessSettings.push({
        id: this.data.businessSettings.length + 1,
        key,
        value,
        category: 'CUSTOM',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    this.save();
    return this.getSettings();
  }

  // Categories
  getCategories(onlyActive = true) {
    let cats = this.data.categories;
    if (onlyActive) {
      cats = cats.filter(c => c.isActive);
    }
    return cats.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  createCategory(data: Omit<MenuCategoryData, 'id' | 'createdAt' | 'updatedAt'>) {
    const newCat: MenuCategoryData = {
      id: this.data.categories.length > 0 ? Math.max(...this.data.categories.map(c => c.id)) + 1 : 1,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.categories.push(newCat);
    this.save();
    return newCat;
  }

  updateCategory(id: number, data: Partial<MenuCategoryData>) {
    const cat = this.data.categories.find(c => c.id === id);
    if (!cat) return null;
    Object.assign(cat, data, { updatedAt: new Date().toISOString() });
    this.save();
    return cat;
  }

  deleteCategory(id: number) {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.data.categories.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  // Menu Items
  getMenuItems(params?: { categoryId?: number; onlyAvailable?: boolean; search?: string }) {
    let items = [...this.data.menuItems];
    if (params?.categoryId) {
      items = items.filter(i => i.categoryId === params.categoryId);
    }
    if (params?.onlyAvailable) {
      items = items.filter(i => i.isAvailable);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter(i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }
    return items;
  }

  getMenuItemById(id: number) {
    return this.data.menuItems.find(i => i.id === id);
  }

  createMenuItem(data: Omit<MenuItemData, 'id' | 'createdAt' | 'updatedAt'>) {
    const newItem: MenuItemData = {
      id: this.data.menuItems.length > 0 ? Math.max(...this.data.menuItems.map(i => i.id)) + 1 : 1,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.menuItems.push(newItem);
    this.save();
    return newItem;
  }

  updateMenuItem(id: number, data: Partial<MenuItemData>) {
    const item = this.data.menuItems.find(i => i.id === id);
    if (!item) return null;
    Object.assign(item, data, { updatedAt: new Date().toISOString() });
    this.save();
    return item;
  }

  deleteMenuItem(id: number) {
    const idx = this.data.menuItems.findIndex(i => i.id === id);
    if (idx !== -1) {
      this.data.menuItems.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  // Today's Special
  getTodaySpecials(onlyActive = true) {
    const now = new Date();
    let specials = this.data.todaySpecials;
    if (onlyActive) {
      specials = specials.filter(s => s.isActive && new Date(s.endDate) > now);
    }
    return specials;
  }

  updateTodaySpecial(id: number, data: Partial<TodaySpecialData>) {
    const s = this.data.todaySpecials.find(item => item.id === id);
    if (!s) return null;
    Object.assign(s, data, { updatedAt: new Date().toISOString() });
    this.save();
    return s;
  }

  createTodaySpecial(data: Omit<TodaySpecialData, 'id' | 'createdAt' | 'updatedAt'>) {
    const newSpecial: TodaySpecialData = {
      id: this.data.todaySpecials.length > 0 ? Math.max(...this.data.todaySpecials.map(i => i.id)) + 1 : 1,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.todaySpecials.push(newSpecial);
    this.save();
    return newSpecial;
  }

  // Gallery
  getGallery() {
    return this.data.gallery.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  createGalleryImage(data: Omit<GalleryImageData, 'id' | 'createdAt' | 'updatedAt'>) {
    const newImg: GalleryImageData = {
      id: this.data.gallery.length > 0 ? Math.max(...this.data.gallery.map(i => i.id)) + 1 : 1,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.gallery.push(newImg);
    this.save();
    return newImg;
  }

  deleteGalleryImage(id: number) {
    const idx = this.data.gallery.findIndex(g => g.id === id);
    if (idx !== -1) {
      this.data.gallery.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  // Customers & Leads
  findOrCreateCustomer(phone: string, name?: string) {
    let customer = this.data.customers.find(c => c.phone === phone);
    const now = new Date().toISOString();
    if (!customer) {
      customer = {
        id: this.data.customers.length > 0 ? Math.max(...this.data.customers.map(c => c.id)) + 1 : 1,
        phone,
        name: name || null,
        email: null,
        birthday: null,
        notes: null,
        createdAt: now,
        updatedAt: now
      };
      this.data.customers.push(customer);
      this.save();
    } else if (name && !customer.name) {
      customer.name = name;
      customer.updatedAt = now;
      this.save();
    }
    return customer;
  }

  recordMarketingConsent(params: { phone: string; name?: string; consentType?: string; source: string; ipAddress?: string }) {
    const customer = this.findOrCreateCustomer(params.phone, params.name);
    const now = new Date().toISOString();
    
    // Check if already consented
    let consent = this.data.marketingConsents.find(m => m.phone === params.phone && m.consentType === (params.consentType || 'WHATSAPP_PROMO'));
    if (!consent) {
      consent = {
        id: this.data.marketingConsents.length > 0 ? Math.max(...this.data.marketingConsents.map(m => m.id)) + 1 : 1,
        phone: params.phone,
        consentType: params.consentType || 'WHATSAPP_PROMO',
        isConsented: true,
        source: params.source,
        ipAddress: params.ipAddress || null,
        createdAt: now,
        updatedAt: now,
        customerId: customer.id
      };
      this.data.marketingConsents.push(consent);
    } else {
      consent.isConsented = true;
      consent.optedOutAt = null;
      consent.updatedAt = now;
    }
    this.save();
    return consent;
  }

  optOutMarketing(phone: string) {
    const consents = this.data.marketingConsents.filter(m => m.phone === phone);
    const now = new Date().toISOString();
    for (const c of consents) {
      c.isConsented = false;
      c.optedOutAt = now;
      c.updatedAt = now;
    }
    this.save();
    return true;
  }

  getAllLeads() {
    return this.data.marketingConsents.map(consent => {
      const customer = this.data.customers.find(c => c.phone === consent.phone);
      return {
        ...consent,
        customerName: customer?.name || 'Guest'
      };
    });
  }

  // Orders
  createOrder(payload: {
    customerName: string;
    customerPhone: string;
    pickupTime: string;
    orderNotes?: string;
    items: { menuItemId: number; quantity: number; options?: string }[];
    isWhatsAppOrder?: boolean;
    paymentMethod?: string;
  }) {
    const customer = this.findOrCreateCustomer(payload.customerPhone, payload.customerName);
    const now = new Date().toISOString();

    // Verify and calculate prices strictly on the server
    let subtotal = 0;
    const resolvedOrderItems: Omit<OrderItemData, 'id' | 'orderId'>[] = [];

    for (const itemReq of payload.items) {
      const product = this.getMenuItemById(itemReq.menuItemId);
      if (!product || !product.isAvailable) {
        throw new Error(`Item ${itemReq.menuItemId} is currently unavailable.`);
      }
      if (itemReq.quantity <= 0) {
        throw new Error(`Invalid quantity for ${product.name}`);
      }
      const lineTotal = product.price * itemReq.quantity;
      subtotal += lineTotal;
      resolvedOrderItems.push({
        menuItemId: product.id,
        itemName: product.name,
        itemPrice: product.price,
        quantity: itemReq.quantity,
        lineTotal,
        options: itemReq.options,
        createdAt: now,
        updatedAt: now
      });
    }

    const total = subtotal; // No hidden charges, prices transparent
    const nextOrderId = this.data.orders.length > 0 ? Math.max(...this.data.orders.map(o => o.id)) + 1 : 1;
    const orderNumber = `VK-${new Date().getFullYear()}-${1000 + nextOrderId}`;

    const newOrder: OrderData = {
      id: nextOrderId,
      orderNumber,
      customerId: customer.id,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      pickupTime: payload.pickupTime,
      orderNotes: payload.orderNotes || '',
      status: 'PENDING',
      subtotal,
      discount: 0,
      tax: 0,
      total,
      paymentMethod: payload.paymentMethod || 'PAY_AT_PICKUP',
      paymentStatus: 'PENDING',
      isWhatsAppOrder: Boolean(payload.isWhatsAppOrder),
      createdAt: now,
      updatedAt: now
    };

    this.data.orders.push(newOrder);

    // Save order items
    let nextItemId = this.data.orderItems.length > 0 ? Math.max(...this.data.orderItems.map(i => i.id)) + 1 : 1;
    const savedItems: OrderItemData[] = [];
    for (const item of resolvedOrderItems) {
      const saved = { ...item, id: nextItemId++, orderId: newOrder.id };
      this.data.orderItems.push(saved);
      savedItems.push(saved);
    }

    // Save initial status history
    this.data.orderStatusHistory.push({
      id: this.data.orderStatusHistory.length + 1,
      orderId: newOrder.id,
      status: 'PENDING',
      comment: payload.isWhatsAppOrder ? 'Pre-order initiated via WhatsApp click-to-chat' : 'Online pickup pre-order placed',
      updatedBy: 'SYSTEM',
      createdAt: now
    });

    this.save();
    return { ...newOrder, items: savedItems };
  }

  getOrderById(id: number) {
    const order = this.data.orders.find(o => o.id === id);
    if (!order) return null;
    const items = this.data.orderItems.filter(i => i.orderId === order.id);
    const history = this.data.orderStatusHistory.filter(h => h.orderId === order.id);
    return { ...order, items, statusHistory: history };
  }

  getOrderByNumber(orderNumber: string) {
    const order = this.data.orders.find(o => o.orderNumber === orderNumber);
    if (!order) return null;
    const items = this.data.orderItems.filter(i => i.orderId === order.id);
    const history = this.data.orderStatusHistory.filter(h => h.orderId === order.id);
    return { ...order, items, statusHistory: history };
  }

  getOrders(params?: { status?: string; search?: string }) {
    let orders = [...this.data.orders];
    if (params?.status) {
      orders = orders.filter(o => o.status === params.status);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      orders = orders.filter(o => o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerPhone.includes(q));
    }
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  updateOrderStatus(orderId: number, status: OrderData['status'], comment?: string, updatedBy = 'ADMIN') {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) return null;

    const previousStatus = order.status;
    order.status = status;
    order.updatedAt = new Date().toISOString();

    this.data.orderStatusHistory.push({
      id: this.data.orderStatusHistory.length + 1,
      orderId: order.id,
      status,
      comment: comment || `Status updated from ${previousStatus} to ${status}`,
      updatedBy,
      createdAt: new Date().toISOString()
    });

    // If order is completed, automatically credit loyalty visit!
    if (status === 'COMPLETED' && previousStatus !== 'COMPLETED') {
      this.creditLoyaltyVisit(order.customerPhone, order.id, order.customerName);
    }

    this.save();
    return this.getOrderById(orderId);
  }

  // Loyalty Program — Kruffles Sweet Rewards
  getLoyaltyAccount(phone: string) {
    let account = this.data.loyaltyAccounts.find(a => a.phone === phone);
    if (!account) {
      const customer = this.findOrCreateCustomer(phone);
      account = {
        id: this.data.loyaltyAccounts.length > 0 ? Math.max(...this.data.loyaltyAccounts.map(a => a.id)) + 1 : 1,
        customerId: customer.id,
        phone,
        visitCount: 0,
        currentCycleVisits: 0,
        rewardsEarned: 0,
        rewardsAvailable: 0,
        birthdayMonth: null,
        birthdayDay: null,
        customerName: customer.name || 'Dessert Lover',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.data.loyaltyAccounts.push(account);
      this.save();
    }
    const transactions = this.data.loyaltyTransactions.filter(t => t.loyaltyAccountId === account!.id);
    return { ...account, transactions };
  }

  creditLoyaltyVisit(phone: string, orderId?: number, customerName?: string) {
    const account = this.getLoyaltyAccount(phone);
    const now = new Date().toISOString();
    account.visitCount += 1;
    account.currentCycleVisits += 1;

    let rewardsUnlocked = 0;
    if (account.currentCycleVisits >= 10) {
      account.currentCycleVisits = 0;
      account.rewardsEarned += 1;
      account.rewardsAvailable += 1;
      rewardsUnlocked = 1;
    }

    account.updatedAt = now;

    // Record transaction
    this.data.loyaltyTransactions.push({
      id: this.data.loyaltyTransactions.length + 1,
      loyaltyAccountId: account.id,
      orderId: orderId || null,
      transactionType: rewardsUnlocked ? 'REWARD_UNLOCKED' : 'VISIT_CREDIT',
      visitsDelta: 1,
      rewardsDelta: rewardsUnlocked,
      description: rewardsUnlocked 
        ? `Unlocked 1 Free Signature Waffle reward after achieving 10 qualifying visits!` 
        : `Credited 1 qualifying cafe visit (${account.currentCycleVisits}/10 in current cycle)`,
      createdAt: now
    });

    this.save();
    return account;
  }

  redeemReward(phone: string, description = 'Redeemed Free Waffle Reward at Counter') {
    const account = this.getLoyaltyAccount(phone);
    if (account.rewardsAvailable <= 0) {
      throw new Error('No available rewards to redeem.');
    }

    account.rewardsAvailable -= 1;
    account.updatedAt = new Date().toISOString();

    this.data.loyaltyTransactions.push({
      id: this.data.loyaltyTransactions.length + 1,
      loyaltyAccountId: account.id,
      orderId: null,
      transactionType: 'REWARD_REDEEMED',
      visitsDelta: 0,
      rewardsDelta: -1,
      description,
      createdAt: new Date().toISOString()
    });

    this.save();
    return account;
  }

  updateLoyaltyBirthday(phone: string, month: number, day: number) {
    const account = this.getLoyaltyAccount(phone);
    account.birthdayMonth = month;
    account.birthdayDay = day;
    account.updatedAt = new Date().toISOString();
    this.save();
    return account;
  }

  getAllLoyaltyAccounts() {
    return this.data.loyaltyAccounts;
  }

  // Feedback & Reviews
  submitFeedback(payload: {
    customerName?: string;
    customerPhone?: string;
    overallRating: number;
    foodQualityRating: number;
    serviceRating: number;
    orderReference?: string;
    comments: string;
    allowFollowUp?: boolean;
  }) {
    const now = new Date().toISOString();
    const newFeedback: CustomerFeedbackData = {
      id: this.data.feedback.length > 0 ? Math.max(...this.data.feedback.map(f => f.id)) + 1 : 1,
      customerName: payload.customerName || 'Anonymous Foodie',
      customerPhone: payload.customerPhone || null,
      overallRating: Math.max(1, Math.min(5, payload.overallRating)),
      foodQualityRating: Math.max(1, Math.min(5, payload.foodQualityRating)),
      serviceRating: Math.max(1, Math.min(5, payload.serviceRating)),
      orderReference: payload.orderReference || null,
      comments: payload.comments,
      allowFollowUp: Boolean(payload.allowFollowUp),
      isApproved: false, // Requires admin moderation
      createdAt: now,
      updatedAt: now
    };

    this.data.feedback.push(newFeedback);
    this.save();
    return newFeedback;
  }

  getApprovedReviews() {
    return this.data.reviews.filter(r => r.isActive);
  }

  getAllFeedback() {
    return this.data.feedback.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  moderateFeedback(id: number, isApproved: boolean) {
    const fb = this.data.feedback.find(f => f.id === id);
    if (!fb) return null;
    fb.isApproved = isApproved;
    fb.updatedAt = new Date().toISOString();

    // If approved, add to public reviews list so real authentic feedback shines
    if (isApproved && !this.data.reviews.some(r => r.comment === fb.comments)) {
      this.data.reviews.push({
        id: this.data.reviews.length + 1,
        customerName: fb.customerName || 'Verified Guest',
        rating: fb.overallRating,
        comment: fb.comments,
        platform: 'Verified In-Store Guest',
        reviewDate: fb.createdAt,
        isFeatured: fb.overallRating >= 4,
        isActive: true,
        avatarUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    this.save();
    return fb;
  }

  // Festival Campaigns
  getCampaigns() {
    return this.data.campaigns.map(c => {
      const recipients = this.data.campaignRecipients.filter(r => r.campaignId === c.id);
      return { ...c, recipients };
    });
  }

  createCampaign(data: Omit<FestivalCampaignData, 'id' | 'createdAt' | 'updatedAt' | 'sentCount' | 'totalTarget'>) {
    // Collect all opted-in leads
    const eligibleLeads = this.data.marketingConsents.filter(m => m.isConsented);
    const now = new Date().toISOString();
    const newCamp: FestivalCampaignData = {
      id: this.data.campaigns.length > 0 ? Math.max(...this.data.campaigns.map(c => c.id)) + 1 : 1,
      ...data,
      sentCount: 0,
      totalTarget: eligibleLeads.length,
      createdAt: now,
      updatedAt: now
    };

    this.data.campaigns.push(newCamp);

    // Build recipient list
    let rId = this.data.campaignRecipients.length > 0 ? Math.max(...this.data.campaignRecipients.map(r => r.id)) + 1 : 1;
    for (const lead of eligibleLeads) {
      const cust = this.data.customers.find(c => c.phone === lead.phone);
      this.data.campaignRecipients.push({
        id: rId++,
        campaignId: newCamp.id,
        customerId: cust?.id || null,
        phone: lead.phone,
        customerName: cust?.name || 'Valued Guest',
        status: 'PENDING',
        createdAt: now
      });
    }

    this.save();
    return this.getCampaigns().find(c => c.id === newCamp.id);
  }

  triggerCampaignDemoSend(campaignId: number) {
    const campaign = this.data.campaigns.find(c => c.id === campaignId);
    if (!campaign) return null;

    const recipients = this.data.campaignRecipients.filter(r => r.campaignId === campaignId);
    const now = new Date().toISOString();

    for (const r of recipients) {
      r.status = 'DEMO_PREVIEWED';
      r.sentAt = now;
    }
    campaign.sentCount = recipients.length;
    campaign.status = 'COMPLETED';
    campaign.updatedAt = now;

    this.save();
    return { campaign, recipients };
  }

  // Dashboard Stats
  getDashboardStats() {
    const totalOrders = this.data.orders.length;
    const pendingOrders = this.data.orders.filter(o => o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PREPARING').length;
    const completedOrders = this.data.orders.filter(o => o.status === 'COMPLETED').length;
    const totalRevenue = this.data.orders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.total, 0);

    const totalLeads = this.data.marketingConsents.filter(m => m.isConsented).length;
    const loyaltyMembers = this.data.loyaltyAccounts.length;

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      totalLeads,
      loyaltyMembers,
      recentOrders: this.getOrders().slice(0, 5),
      menuItemsCount: this.data.menuItems.length,
      categoriesCount: this.data.categories.length
    };
  }
}

export const db = new DatabaseRepository();
