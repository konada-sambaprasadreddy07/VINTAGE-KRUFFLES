import React, { useState, useEffect } from 'react';
import { api, clearAuthToken } from '../services/api';
import { BrandLogo } from '../components/BrandLogo';
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Sparkles, MessageSquare,
  Users, Award, Settings, QrCode, LogOut, ArrowLeft, RefreshCw, CheckCircle2,
  Clock, Plus, Edit2, Trash2, Send, Tag, Phone, ExternalLink, AlertCircle, Eye
} from 'lucide-react';

interface AdminDashboardProps {
  admin: any;
  onLogout: () => void;
  onBackToSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  admin,
  onLogout,
  onBackToSite
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'specials' | 'campaigns' | 'leads' | 'loyalty' | 'feedback' | 'settings' | 'qr'>('overview');
  
  // Data states
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [specials, setSpecials] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loyaltyMembers, setLoyaltyMembers] = useState<any[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [businessSettings, setBusinessSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Modals & form states
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: 199,
    categoryId: 1,
    image: '',
    isAvailable: true,
    isBestseller: false,
    isTodaySpecial: false,
    isVeg: true,
    prepTimeMins: 15
  });

  // Campaign modal
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    occasion: 'DIWALI',
    messageTemplate: '🪔 Happy Diwali {NAME}! Celebrate with sweetness at Vintage Kruffles RK Beach. Free chocolate dip with any waffle tonight! 🧇✨',
    offerDetails: 'Free Chocolate Dip'
  });
  const [campaignPreview, setCampaignPreview] = useState('');
  const [campaignDemoResult, setCampaignDemoResult] = useState<any | null>(null);

  // Manual loyalty credit
  const [creditPhone, setCreditPhone] = useState('');
  const [creditName, setCreditName] = useState('');

  // Settings form
  const [settingsForm, setSettingsForm] = useState<Record<string, string>>({});

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        statsRes, ordersRes, menuRes, catRes, specialsRes,
        campRes, leadsRes, loyRes, fbRes, setRes
      ] = await Promise.all([
        api.getDashboardStats(),
        api.getAllOrders(),
        api.getAllMenuItems(),
        api.getAllCategories(),
        api.getAllSpecials(),
        api.getCampaigns(),
        api.getAllLeads(),
        api.getAllLoyaltyAccounts(),
        api.getAllFeedback(),
        api.getAllSettings()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (ordersRes.success) setOrders(ordersRes.orders);
      if (menuRes.success) setMenuItems(menuRes.items);
      if (catRes.success) setCategories(catRes.categories);
      if (specialsRes.success) setSpecials(specialsRes.specials);
      if (campRes.success) setCampaigns(campRes.campaigns);
      if (leadsRes.success) setLeads(leadsRes.leads);
      if (loyRes.success) setLoyaltyMembers(loyRes.accounts);
      if (fbRes.success) setFeedbackList(fbRes.feedback);
      if (setRes.success) {
        setBusinessSettings(setRes.settings);
        const map: Record<string, string> = {};
        for (const s of setRes.settings) {
          map[s.key] = s.value;
        }
        setSettingsForm(map);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  // Order status update
  const handleOrderStatusUpdate = async (orderId: number, status: string) => {
    try {
      const res = await api.updateOrderStatus(orderId, status);
      if (res.success) {
        showNotification(`Order status updated to ${status}`);
        loadAllData();
      }
    } catch {
      alert('Failed to update order status');
    }
  };

  // Menu item save
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await api.updateMenuItem(editingItem.id, itemForm);
        if (res.success) {
          showNotification('Menu item updated successfully.');
        }
      } else {
        const res = await api.createMenuItem(itemForm);
        if (res.success) {
          showNotification('New menu item created.');
        }
      }
      setShowItemModal(false);
      setEditingItem(null);
      loadAllData();
    } catch {
      alert('Failed to save menu item');
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      const res = await api.deleteMenuItem(id);
      if (res.success) {
        showNotification('Menu item deleted.');
        loadAllData();
      }
    } catch {
      alert('Failed to delete item');
    }
  };

  // Campaign create & test
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createCampaign(campaignForm);
      if (res.success) {
        showNotification('Festival campaign created.');
        setShowCampaignModal(false);
        loadAllData();
      }
    } catch {
      alert('Failed to create campaign');
    }
  };

  const handleSendCampaign = async (id: number) => {
    try {
      const res = await api.sendCampaign(id);
      if (res.success) {
        setCampaignDemoResult(res);
        showNotification(res.notice || 'Campaign dispatched.');
        loadAllData();
      }
    } catch {
      alert('Failed to send campaign');
    }
  };

  // Moderate feedback
  const handleModerateFeedback = async (id: number, isApproved: boolean) => {
    try {
      const res = await api.moderateFeedback(id, isApproved);
      if (res.success) {
        showNotification(res.message);
        loadAllData();
      }
    } catch {
      alert('Failed to moderate feedback');
    }
  };

  // Manual Loyalty Punch
  const handleCreditLoyalty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditPhone) return;
    try {
      const res = await api.creditLoyaltyVisit(creditPhone, creditName || undefined);
      if (res.success) {
        showNotification(`Visit credited for +91 ${creditPhone}`);
        setCreditPhone('');
        setCreditName('');
        loadAllData();
      }
    } catch {
      alert('Failed to credit visit');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.updateSettings(settingsForm);
      if (res.success) {
        showNotification('Cafe settings updated successfully.');
        loadAllData();
      }
    } catch {
      alert('Failed to update settings');
    }
  };

  const navTabs = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'orders', label: 'Orders', icon: ShoppingBag, badge: orders.filter(o => o.status === 'PENDING').length },
    { key: 'menu', label: 'Menu Catalog', icon: UtensilsCrossed },
    { key: 'specials', label: "Today's Special", icon: Sparkles },
    { key: 'campaigns', label: 'WhatsApp Greetings', icon: MessageSquare },
    { key: 'leads', label: 'Sweet Deals Leads', icon: Users, badge: leads.length },
    { key: 'loyalty', label: 'Loyalty Rewards', icon: Award },
    { key: 'feedback', label: 'Reviews Moderation', icon: Tag },
    { key: 'settings', label: 'Cafe Settings', icon: Settings },
    { key: 'qr', label: 'Printable QR', icon: QrCode },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      
      {/* Top Navbar */}
      <header className="bg-espresso text-cream px-6 py-4 flex items-center justify-between border-b-2 border-burnt shadow-md">
        <div className="flex items-center gap-4">
          <BrandLogo light size="sm" />
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-golden text-espresso text-[10px] font-black uppercase tracking-wider">
            ADMIN CONSOLE
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onBackToSite}
            className="text-xs text-stone-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">View Public Website</span>
          </button>

          <button
            onClick={loadAllData}
            disabled={loading}
            className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <div className="text-right hidden md:block">
            <span className="block text-xs font-bold text-white">{admin?.name || 'Administrator'}</span>
            <span className="block text-[10px] text-golden">{admin?.email}</span>
          </div>

          <button
            onClick={() => {
              clearAuthToken();
              onLogout();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-espresso-dark text-cream p-4 space-y-1 shrink-0 border-r border-espresso">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-burnt text-white shadow-warm'
                    : 'text-stone-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-golden text-espresso">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          
          {notice && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center justify-between shadow-sm animate-fadeIn">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {notice}
              </span>
              <button onClick={() => setNotice(null)} className="text-stone-400 hover:text-stone-600">×</button>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-serif font-black text-espresso">Dashboard Overview</h2>
                <p className="text-xs text-stone-500">Live operational snapshot for Vintage Kruffles, RK Beach.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-peach/80 shadow-sm">
                  <span className="text-[11px] font-bold text-stone-500 uppercase">Total Revenue</span>
                  <div className="text-2xl font-black text-burnt mt-1">₹{stats?.totalRevenue || 0}</div>
                  <span className="text-[10px] text-stone-400">All non-cancelled orders</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-peach/80 shadow-sm">
                  <span className="text-[11px] font-bold text-stone-500 uppercase">Pending Kitchen Orders</span>
                  <div className="text-2xl font-black text-golden-dark mt-1">{stats?.pendingOrders || 0}</div>
                  <span className="text-[10px] text-stone-400">Action required</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-peach/80 shadow-sm">
                  <span className="text-[11px] font-bold text-stone-500 uppercase">Marketing Leads</span>
                  <div className="text-2xl font-black text-espresso mt-1">{stats?.totalLeads || 0}</div>
                  <span className="text-[10px] text-stone-400">Consented WhatsApp numbers</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-peach/80 shadow-sm">
                  <span className="text-[11px] font-bold text-stone-500 uppercase">Loyalty Members</span>
                  <div className="text-2xl font-black text-emerald-600 mt-1">{stats?.loyaltyMembers || 0}</div>
                  <span className="text-[10px] text-stone-400">Sweet Rewards accounts</span>
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="bg-white rounded-2xl border border-peach/80 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif font-bold text-lg text-espresso">Recent Customer Pre-Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-burnt hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-500 uppercase text-[10px]">
                        <th className="py-2.5">Order #</th>
                        <th>Customer</th>
                        <th>Phone</th>
                        <th>Pickup Time</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-cream-warm/40">
                          <td className="py-3 font-mono font-bold text-burnt">{order.orderNumber}</td>
                          <td className="font-semibold text-espresso">{order.customerName}</td>
                          <td>+91 {order.customerPhone}</td>
                          <td>{new Date(order.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                          <td className="font-black">₹{order.total}</td>
                          <td>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-golden/20 text-espresso">
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <select
                              value={order.status}
                              onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                              className="px-2 py-1 rounded bg-cream border border-peach text-[11px] font-bold"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="PREPARING">PREPARING</option>
                              <option value="READY">READY</option>
                              <option value="COMPLETED">COMPLETED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-black text-espresso">Pre-Order Management</h2>
                  <p className="text-xs text-stone-500">Live order status progression, kitchen communication, and WhatsApp updates.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {orders.map((order) => {
                  const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
                  const notifyMsg = `Hi ${order.customerName}! Your Vintage Kruffles pre-order #${order.orderNumber} is now ${order.status}. Pickup at RK Beach counter! 🧇`;
                  const waNotifyUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(notifyMsg)}`;

                  return (
                    <div key={order.id} className="bg-white rounded-2xl p-5 border border-peach/80 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-stone-100">
                        <div>
                          <span className="font-mono font-bold text-base text-burnt mr-3">{order.orderNumber}</span>
                          <span className="text-xs font-bold text-espresso">{order.customerName} (+91 {order.customerPhone})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-stone-500">
                            Pickup: <strong>{new Date(order.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                          </span>
                          <span className="text-base font-black text-burnt">₹{order.total}</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="bg-cream-warm/60 p-3 rounded-xl space-y-1 text-xs">
                        {order.items?.map((it: any) => (
                          <div key={it.id} className="flex justify-between">
                            <span>{it.quantity}x {it.itemName}</span>
                            <span className="font-bold">₹{it.lineTotal}</span>
                          </div>
                        ))}
                        {order.orderNotes && (
                          <div className="text-[11px] text-stone-500 pt-1 border-t border-peach/40">
                            Notes: <em>{order.orderNotes}</em>
                          </div>
                        )}
                      </div>

                      {/* Status changer & WhatsApp notify button */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-600">Update Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                            className="px-3 py-1.5 rounded-xl bg-cream border border-peach text-xs font-bold text-espresso"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED (Accepted)</option>
                            <option value="PREPARING">PREPARING (In Griddle)</option>
                            <option value="READY">READY (At Counter)</option>
                            <option value="COMPLETED">COMPLETED (Delivered)</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </div>

                        <a
                          href={waNotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>WhatsApp Notify Customer</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: MENU */}
          {activeTab === 'menu' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-black text-espresso">Menu & Products Manager</h2>
                  <p className="text-xs text-stone-500">Edit prices, descriptions, availability, and badges without touching code.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setItemForm({
                      name: '',
                      description: '',
                      price: 199,
                      categoryId: categories[0]?.id || 1,
                      image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80',
                      isAvailable: true,
                      isBestseller: false,
                      isTodaySpecial: false,
                      isVeg: true,
                      prepTimeMins: 15
                    });
                    setShowItemModal(true);
                  }}
                  className="inline-flex items-center gap-2 bg-burnt text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-warm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Menu Item</span>
                </button>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-4 border border-peach/80 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="relative h-36 rounded-xl overflow-hidden mb-3">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 right-2 text-xs bg-white px-2 py-0.5 rounded-md font-bold text-espresso shadow">
                          ₹{item.price}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-espresso">{item.name}</h4>
                      <p className="text-xs text-stone-500 line-clamp-2 mt-1">{item.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                        {item.isBestseller && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-golden text-espresso">
                            Bestseller
                          </span>
                        )}
                        {item.isTodaySpecial && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-burnt text-white">
                            Today Special
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100 mt-4">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setItemForm({
                            name: item.name,
                            description: item.description,
                            price: item.price,
                            categoryId: item.categoryId,
                            image: item.image,
                            isAvailable: item.isAvailable,
                            isBestseller: item.isBestseller,
                            isTodaySpecial: item.isTodaySpecial,
                            isVeg: item.isVeg,
                            prepTimeMins: item.prepTimeMins || 15
                          });
                          setShowItemModal(true);
                        }}
                        className="p-1.5 text-stone-500 hover:text-burnt rounded-lg hover:bg-cream"
                        title="Edit Item"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TODAY'S SPECIAL */}
          {activeTab === 'specials' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-serif font-black text-espresso">Today's Special Management</h2>
                <p className="text-xs text-stone-500">Configure the featured chef special displayed prominently on the public homepage.</p>
              </div>

              {specials.map((sp) => (
                <div key={sp.id} className="bg-white rounded-3xl p-6 border border-peach/80 shadow-sm space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <img src={sp.image} alt={sp.title} className="w-full h-48 rounded-2xl object-cover" />
                    <div className="md:col-span-2 space-y-2">
                      <span className="px-3 py-1 bg-burnt text-white font-black text-xs rounded-full">
                        {sp.badgeText}
                      </span>
                      <h3 className="font-serif font-bold text-xl text-espresso">{sp.title}</h3>
                      <p className="text-xs text-stone-600 leading-relaxed">{sp.description}</p>
                      <div className="flex items-center gap-4 pt-2">
                        <span className="text-2xl font-black text-burnt">Offer Price: ₹{sp.offerPrice}</span>
                        {sp.originalPrice && <span className="text-stone-400 line-through">₹{sp.originalPrice}</span>}
                      </div>
                      <div className="text-[11px] text-stone-400">
                        Valid Until: {new Date(sp.endDate).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-bold text-espresso cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sp.isActive}
                        onChange={async (e) => {
                          await api.updateSpecial(sp.id, { isActive: e.target.checked });
                          showNotification('Special status updated.');
                          loadAllData();
                        }}
                        className="rounded text-burnt focus:ring-burnt"
                      />
                      <span>Active on public website</span>
                    </label>

                    <button
                      onClick={async () => {
                        const newOffer = prompt('Enter new offer price in ₹:', String(sp.offerPrice));
                        if (newOffer && !isNaN(Number(newOffer))) {
                          await api.updateSpecial(sp.id, { offerPrice: Number(newOffer) });
                          showNotification('Price updated.');
                          loadAllData();
                        }
                      }}
                      className="px-4 py-2 bg-espresso text-cream text-xs font-bold rounded-xl hover:bg-espresso-light transition-colors"
                    >
                      Update Offer Price
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: FESTIVAL CAMPAIGNS */}
          {activeTab === 'campaigns' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-black text-espresso">Festival WhatsApp Campaigns</h2>
                  <p className="text-xs text-stone-500">Send festive greetings and secret discount codes to opted-in customers.</p>
                </div>
                <button
                  onClick={() => setShowCampaignModal(true)}
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Campaign</span>
                </button>
              </div>

              {campaignDemoResult && (
                <div className="bg-golden/20 p-5 rounded-2xl border border-golden/50 space-y-3">
                  <h4 className="font-bold text-xs text-espresso uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-burnt" />
                    Simulated Demo Mode Test Output
                  </h4>
                  <p className="text-xs text-stone-700">{campaignDemoResult.notice}</p>
                  
                  {campaignDemoResult.previewLinks && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold text-espresso">Click to test preview WhatsApp link for recipient:</span>
                      {campaignDemoResult.previewLinks.map((link: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-golden/40 text-xs">
                          <span>{link.customerName} (+91 {link.phone})</span>
                          <a
                            href={link.clickToChatUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#25D366] text-white font-bold rounded-lg"
                          >
                            <span>Open WhatsApp Preview</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                {campaigns.map((camp) => (
                  <div key={camp.id} className="bg-white rounded-2xl p-6 border border-peach/80 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-burnt uppercase tracking-wider">{camp.occasion}</span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600">
                        {camp.status}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-espresso">{camp.name}</h3>
                    <div className="bg-cream-warm p-4 rounded-xl border border-peach/60 text-xs text-espresso whitespace-pre-wrap font-sans">
                      {camp.messageTemplate}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-stone-500">
                        Eligible Opted-In Target: <strong>{camp.totalTarget || leads.length} customers</strong>
                      </span>
                      <button
                        onClick={() => handleSendCampaign(camp.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-espresso hover:bg-espresso-light text-cream text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 text-golden" />
                        <span>Trigger Campaign (Demo / Preview)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: LEADS & CONSENT */}
          {activeTab === 'leads' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-black text-espresso">Sweet Deals Leads & Consent</h2>
                  <p className="text-xs text-stone-500">Explicitly opted-in phone numbers captured from website popup and counter visits.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-peach/80 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-warm text-stone-600 uppercase text-[10px] border-b border-peach">
                    <tr>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Mobile Number</th>
                      <th className="p-4">Consent Status</th>
                      <th className="p-4">Source</th>
                      <th className="p-4">Captured At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-cream-warm/40">
                        <td className="p-4 font-bold text-espresso">{lead.customerName || 'Friend'}</td>
                        <td className="p-4 font-mono">+91 {lead.phone}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${lead.isConsented ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {lead.isConsented ? 'Opted In' : 'Opted Out'}
                          </span>
                        </td>
                        <td className="p-4 text-stone-500">{lead.source}</td>
                        <td className="p-4 text-stone-400">
                          {new Date(lead.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: LOYALTY */}
          {activeTab === 'loyalty' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-serif font-black text-espresso">Kruffles Sweet Rewards</h2>
                <p className="text-xs text-stone-500">Manual visit credits, free waffle redemptions, and member ledger.</p>
              </div>

              {/* Manual Visit Punch Bar */}
              <div className="bg-white p-6 rounded-2xl border border-peach/80 shadow-sm">
                <h4 className="font-bold text-sm text-espresso mb-3">Credit Visit at Counter (+1 Stamp)</h4>
                <form onSubmit={handleCreditLoyalty} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="tel"
                    required
                    value={creditPhone}
                    onChange={(e) => setCreditPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="flex-1 px-4 py-2.5 bg-cream rounded-xl border border-peach text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={creditName}
                    onChange={(e) => setCreditName(e.target.value)}
                    placeholder="Customer Name (optional)"
                    className="flex-1 px-4 py-2.5 bg-cream rounded-xl border border-peach text-xs"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-burnt text-white text-xs font-bold rounded-xl shadow-warm cursor-pointer"
                  >
                    Credit Visit (+1)
                  </button>
                </form>
              </div>

              {/* Members Table */}
              <div className="bg-white rounded-2xl border border-peach/80 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-warm text-stone-600 uppercase text-[10px] border-b border-peach">
                    <tr>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Cycle Progress</th>
                      <th className="p-4">Lifetime Visits</th>
                      <th className="p-4">Rewards Available</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {loyaltyMembers.map((acc) => (
                      <tr key={acc.id} className="hover:bg-cream-warm/40">
                        <td className="p-4 font-bold text-espresso">{acc.customerName || 'Member'}</td>
                        <td className="p-4 font-mono">+91 {acc.phone}</td>
                        <td className="p-4 font-bold text-burnt">{acc.currentCycleVisits} / 10 stamps</td>
                        <td className="p-4">{acc.visitCount} visits</td>
                        <td className="p-4">
                          <span className="font-black text-golden-dark text-sm">{acc.rewardsAvailable}</span>
                        </td>
                        <td className="p-4">
                          {acc.rewardsAvailable > 0 ? (
                            <button
                              onClick={async () => {
                                await api.redeemLoyaltyReward(acc.phone);
                                showNotification(`Reward redeemed for ${acc.phone}`);
                                loadAllData();
                              }}
                              className="px-3 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded-lg shadow-sm"
                            >
                              Redeem 1 Reward
                            </button>
                          ) : (
                            <span className="text-stone-400 text-[10px]">No rewards yet</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: FEEDBACK MODERATION */}
          {activeTab === 'feedback' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-serif font-black text-espresso">Customer Reviews Moderation</h2>
                <p className="text-xs text-stone-500">Review feedback submissions before approving them to appear on the public website.</p>
              </div>

              <div className="space-y-4">
                {feedbackList.map((fb) => (
                  <div key={fb.id} className="bg-white rounded-2xl p-5 border border-peach/80 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-espresso">{fb.customerName || 'Anonymous Foodie'}</span>
                        {fb.customerPhone && <span className="text-xs text-stone-400">(+91 {fb.customerPhone})</span>}
                      </div>
                      <div className="text-golden font-black text-sm">
                        {'★'.repeat(fb.overallRating)} ({fb.overallRating}/5)
                      </div>
                    </div>

                    <p className="text-xs text-espresso/80 italic bg-cream-warm/40 p-3 rounded-xl border border-peach/40">
                      "{fb.comments}"
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${fb.isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-golden/30 text-espresso'}`}>
                        {fb.isApproved ? 'Approved & Published' : 'Pending Review'}
                      </span>

                      <div className="flex gap-2">
                        {!fb.isApproved ? (
                          <button
                            onClick={() => handleModerateFeedback(fb.id, true)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                          >
                            Approve for Public Display
                          </button>
                        ) : (
                          <button
                            onClick={() => handleModerateFeedback(fb.id, false)}
                            className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-espresso text-xs font-bold rounded-lg cursor-pointer"
                          >
                            Unpublish
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-serif font-black text-espresso">Cafe Business Settings</h2>
                <p className="text-xs text-stone-500">Edit missing business information, WhatsApp ordering number, and Google Maps embed.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl p-6 border border-peach/80 shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-espresso mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={settingsForm.CAFE_NAME || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, CAFE_NAME: e.target.value })}
                      className="w-full px-3 py-2 bg-cream rounded-xl border border-peach text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-espresso mb-1">Phone Number (Editable)</label>
                    <input
                      type="text"
                      value={settingsForm.PHONE_NUMBER || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, PHONE_NUMBER: e.target.value })}
                      className="w-full px-3 py-2 bg-cream rounded-xl border border-peach text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-espresso mb-1">WhatsApp Order Number (Include Country Code e.g. 91...)</label>
                    <input
                      type="text"
                      value={settingsForm.WHATSAPP_NUMBER || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, WHATSAPP_NUMBER: e.target.value })}
                      className="w-full px-3 py-2 bg-cream rounded-xl border border-peach text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-espresso mb-1">Opening Hours</label>
                    <input
                      type="text"
                      value={settingsForm.OPENING_HOURS || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, OPENING_HOURS: e.target.value })}
                      className="w-full px-3 py-2 bg-cream rounded-xl border border-peach text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-espresso mb-1">Cafe Address Text</label>
                  <input
                    type="text"
                    value={settingsForm.LOCATION_TEXT || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, LOCATION_TEXT: e.target.value })}
                    className="w-full px-3 py-2 bg-cream rounded-xl border border-peach text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-espresso mb-1">Google Maps Embed URL</label>
                  <textarea
                    rows={2}
                    value={settingsForm.GOOGLE_MAPS_EMBED_URL || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, GOOGLE_MAPS_EMBED_URL: e.target.value })}
                    className="w-full px-3 py-2 bg-cream rounded-xl border border-peach text-xs font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-burnt text-white text-xs font-bold rounded-xl shadow-warm cursor-pointer"
                >
                  Save Business Settings
                </button>
              </form>
            </div>
          )}

          {/* TAB 10: PRINTABLE QR */}
          {activeTab === 'qr' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-serif font-black text-espresso">Digital Menu QR Standee</h2>
                <p className="text-xs text-stone-500">Generate high-contrast QR code standees for dining tables and counter display.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-peach/80 shadow-sm max-w-lg">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-espresso text-cream text-xs font-bold rounded-xl shadow-sm"
                >
                  Print QR Standee Page
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Menu Item Edit/Add Modal */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <h3 className="font-serif font-bold text-lg text-espresso">
                {editingItem ? 'Edit Menu Product' : 'Add New Menu Product'}
              </h3>
              <button onClick={() => setShowItemModal(false)} className="text-stone-400 hover:text-espresso font-bold">×</button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-cream rounded-xl border border-peach"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-cream rounded-xl border border-peach"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-cream rounded-xl border border-peach font-bold text-burnt"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Category *</label>
                  <select
                    value={itemForm.categoryId}
                    onChange={(e) => setItemForm({ ...itemForm, categoryId: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-cream rounded-xl border border-peach font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Image URL</label>
                <input
                  type="text"
                  value={itemForm.image}
                  onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                  className="w-full px-3 py-2 bg-cream rounded-xl border border-peach"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.isAvailable}
                    onChange={(e) => setItemForm({ ...itemForm, isAvailable: e.target.checked })}
                  />
                  <span>Available</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.isBestseller}
                    onChange={(e) => setItemForm({ ...itemForm, isBestseller: e.target.checked })}
                  />
                  <span>Bestseller Badge</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.isTodaySpecial}
                    onChange={(e) => setItemForm({ ...itemForm, isTodaySpecial: e.target.checked })}
                  />
                  <span>Today's Special</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-4 py-2 text-stone-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-burnt text-white font-bold rounded-xl shadow-warm"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campaign Create Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <h3 className="font-serif font-bold text-lg text-espresso">Create Festival Greeting Campaign</h3>
              <button onClick={() => setShowCampaignModal(false)} className="text-stone-400 hover:text-espresso font-bold">×</button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Campaign Name *</label>
                <input
                  type="text"
                  required
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                  placeholder="e.g. Diwali Sweet Sparkle 2026"
                  className="w-full px-3 py-2 bg-cream rounded-xl border border-peach"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Occasion *</label>
                <select
                  value={campaignForm.occasion}
                  onChange={(e) => setCampaignForm({ ...campaignForm, occasion: e.target.value })}
                  className="w-full px-3 py-2 bg-cream rounded-xl border border-peach"
                >
                  <option value="DIWALI">Diwali</option>
                  <option value="SANKRANTI">Sankranti</option>
                  <option value="HOLI">Holi</option>
                  <option value="UGADI">Ugadi</option>
                  <option value="CHRISTMAS">Christmas</option>
                  <option value="NEW_YEAR">New Year</option>
                  <option value="VALENTINE">Valentine's Day</option>
                  <option value="BIRTHDAY">Birthday</option>
                  <option value="CUSTOM">Custom Beach Offer</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Message Template (Use {'{NAME}'} placeholder) *</label>
                <textarea
                  rows={4}
                  required
                  value={campaignForm.messageTemplate}
                  onChange={(e) => setCampaignForm({ ...campaignForm, messageTemplate: e.target.value })}
                  className="w-full px-3 py-2 bg-cream rounded-xl border border-peach"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCampaignModal(false)}
                  className="px-4 py-2 text-stone-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#25D366] text-white font-bold rounded-xl shadow"
                >
                  Save Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
