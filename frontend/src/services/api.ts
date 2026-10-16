const API_BASE = '/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('vk_admin_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('vk_admin_token', token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('vk_admin_token');
};

const getHeaders = (isAuth = false) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (isAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

export const api = {
  // Public
  getSettings: async () => {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },
  getCategories: async () => {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  },
  getMenu: async (categoryId?: number, search?: string) => {
    let url = `${API_BASE}/menu?onlyAvailable=true`;
    if (categoryId) url += `&categoryId=${categoryId}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    const res = await fetch(url);
    return res.json();
  },
  getTodaySpecials: async () => {
    const res = await fetch(`${API_BASE}/specials`);
    return res.json();
  },
  getGallery: async () => {
    const res = await fetch(`${API_BASE}/gallery`);
    return res.json();
  },
  getReviews: async () => {
    const res = await fetch(`${API_BASE}/feedback/reviews`);
    return res.json();
  },
  submitOrder: async (orderData: any) => {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });
    return res.json();
  },
  trackOrder: async (orderNumber: string) => {
    const res = await fetch(`${API_BASE}/orders/track/${encodeURIComponent(orderNumber)}`);
    return res.json();
  },
  lookupLoyalty: async (phone: string) => {
    const res = await fetch(`${API_BASE}/loyalty/lookup/${phone}`);
    return res.json();
  },
  saveBirthday: async (data: { phone: string; month: number; day: number; name?: string }) => {
    const res = await fetch(`${API_BASE}/loyalty/birthday`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  submitLead: async (data: { name?: string; phone: string; consent: boolean }) => {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  submitFeedback: async (feedbackData: any) => {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(feedbackData),
    });
    return res.json();
  },
  generateQRCode: async (targetUrl?: string) => {
    let url = `${API_BASE}/qrcode/generate`;
    if (targetUrl) url += `?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(url);
    return res.json();
  },

  // Admin Auth
  login: async (credentials: { email: string; password: string }) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    return res.json();
  },
  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(true),
    });
    return res.json();
  },

  // Admin Endpoints
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE}/settings/dashboard-stats`, {
      headers: getHeaders(true),
    });
    return res.json();
  },
  getAllOrders: async (status?: string, search?: string) => {
    let url = `${API_BASE}/orders?`;
    if (status) url += `status=${status}&`;
    if (search) url += `search=${encodeURIComponent(search)}`;
    const res = await fetch(url, { headers: getHeaders(true) });
    return res.json();
  },
  updateOrderStatus: async (id: number, status: string, comment?: string) => {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify({ status, comment }),
    });
    return res.json();
  },
  getAllMenuItems: async () => {
    const res = await fetch(`${API_BASE}/menu/all`, { headers: getHeaders(true) });
    return res.json();
  },
  createMenuItem: async (item: any) => {
    const res = await fetch(`${API_BASE}/menu`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(item),
    });
    return res.json();
  },
  updateMenuItem: async (id: number, item: any) => {
    const res = await fetch(`${API_BASE}/menu/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(item),
    });
    return res.json();
  },
  deleteMenuItem: async (id: number) => {
    const res = await fetch(`${API_BASE}/menu/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return res.json();
  },
  getAllCategories: async () => {
    const res = await fetch(`${API_BASE}/categories/all`, { headers: getHeaders(true) });
    return res.json();
  },
  createCategory: async (cat: any) => {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(cat),
    });
    return res.json();
  },
  updateCategory: async (id: number, cat: any) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(cat),
    });
    return res.json();
  },
  deleteCategory: async (id: number) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return res.json();
  },
  getAllSpecials: async () => {
    const res = await fetch(`${API_BASE}/specials/all`, { headers: getHeaders(true) });
    return res.json();
  },
  createSpecial: async (special: any) => {
    const res = await fetch(`${API_BASE}/specials`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(special),
    });
    return res.json();
  },
  updateSpecial: async (id: number, special: any) => {
    const res = await fetch(`${API_BASE}/specials/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(special),
    });
    return res.json();
  },
  getAllLeads: async () => {
    const res = await fetch(`${API_BASE}/leads`, { headers: getHeaders(true) });
    return res.json();
  },
  getCampaigns: async () => {
    const res = await fetch(`${API_BASE}/campaigns`, { headers: getHeaders(true) });
    return res.json();
  },
  createCampaign: async (campaign: any) => {
    const res = await fetch(`${API_BASE}/campaigns`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(campaign),
    });
    return res.json();
  },
  sendCampaign: async (id: number) => {
    const res = await fetch(`${API_BASE}/campaigns/${id}/send`, {
      method: 'POST',
      headers: getHeaders(true),
    });
    return res.json();
  },
  previewCampaignMessage: async (template: string, name?: string) => {
    const res = await fetch(`${API_BASE}/campaigns/preview`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ messageTemplate: template, sampleName: name }),
    });
    return res.json();
  },
  getAllFeedback: async () => {
    const res = await fetch(`${API_BASE}/feedback/all`, { headers: getHeaders(true) });
    return res.json();
  },
  moderateFeedback: async (id: number, isApproved: boolean) => {
    const res = await fetch(`${API_BASE}/feedback/${id}/moderate`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify({ isApproved }),
    });
    return res.json();
  },
  getAllLoyaltyAccounts: async () => {
    const res = await fetch(`${API_BASE}/loyalty/all`, { headers: getHeaders(true) });
    return res.json();
  },
  creditLoyaltyVisit: async (phone: string, customerName?: string) => {
    const res = await fetch(`${API_BASE}/loyalty/credit`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ phone, customerName }),
    });
    return res.json();
  },
  redeemLoyaltyReward: async (phone: string, description?: string) => {
    const res = await fetch(`${API_BASE}/loyalty/redeem`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ phone, description }),
    });
    return res.json();
  },
  getAllSettings: async () => {
    const res = await fetch(`${API_BASE}/settings/all`, { headers: getHeaders(true) });
    return res.json();
  },
  updateSettings: async (updates: any) => {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ updates }),
    });
    return res.json();
  },
  addGalleryImage: async (image: any) => {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(image),
    });
    return res.json();
  },
  deleteGalleryImage: async (id: number) => {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return res.json();
  },
};
