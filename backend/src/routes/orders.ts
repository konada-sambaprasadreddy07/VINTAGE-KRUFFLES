import { Router, Request, Response } from 'express';
import { db } from '../lib/db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// Helper to generate WhatsApp prefill message and URL
const buildWhatsAppOrderUrl = (order: any, whatsappNumber: string) => {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const itemsText = order.items
    .map((item: any) => `• ${item.quantity}x ${item.itemName} (₹${item.lineTotal})`)
    .join('\n');

  const text = `🧇 *VINTAGE KRUFFLES — PRE-ORDER #${order.orderNumber}*
━━━━━━━━━━━━━━━━━━
👤 *Customer:* ${order.customerName}
📞 *Phone:* ${order.customerPhone}
⏰ *Pickup Time:* ${new Date(order.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
━━━━━━━━━━━━━━━━━━
🛍️ *Items Ordered:*
${itemsText}
━━━━━━━━━━━━━━━━━━
💰 *Total Amount:* ₹${order.total} (Pay at pickup)
${order.orderNotes ? `📝 *Notes:* ${order.orderNotes}\n` : ''}
📍 *Pickup Location:* Vintage Kruffles, RK Beach, Vizag

_Please confirm my pickup order!_`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
};

// Public: Create online pre-order for pickup
router.post('/', (req: Request, res: Response): void => {
  try {
    const { customerName, customerPhone, pickupTime, orderNotes, items, isWhatsAppOrder, paymentMethod } = req.body;

    if (!customerName || !customerPhone || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Customer name, phone number, and at least one item are required.' });
      return;
    }

    // Validate phone number (Indian 10-digit format)
    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      res.status(400).json({ error: 'Please enter a valid 10-digit phone number.' });
      return;
    }

    // Validate pickup time (must be in future)
    const pickupDate = new Date(pickupTime);
    if (isNaN(pickupDate.getTime())) {
      res.status(400).json({ error: 'Please select a valid pickup time.' });
      return;
    }

    const newOrder = db.createOrder({
      customerName: customerName.trim(),
      customerPhone: cleanPhone.slice(-10),
      pickupTime: pickupDate.toISOString(),
      orderNotes: orderNotes ? orderNotes.trim() : '',
      items,
      isWhatsAppOrder: Boolean(isWhatsAppOrder),
      paymentMethod: paymentMethod || 'PAY_AT_PICKUP'
    });

    const settings = db.getSettings();
    const whatsappNumber = settings.WHATSAPP_NUMBER || '918978941336';
    const whatsappUrl = buildWhatsAppOrderUrl(newOrder, whatsappNumber);

    res.status(201).json({
      success: true,
      message: 'Pre-order created successfully!',
      order: newOrder,
      whatsappUrl
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to place order.' });
  }
});

// Public: Track order by orderNumber
router.get('/track/:orderNumber', (req: Request, res: Response): void => {
  try {
    const order = db.getOrderByNumber(req.params.orderNumber.toUpperCase());
    if (!order) {
      res.status(404).json({ error: 'Order not found. Please check your reference number.' });
      return;
    }
    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to track order.' });
  }
});

// Admin: Get all orders
router.get('/', requireAdmin, (req: Request, res: Response): void => {
  try {
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const orders = db.getOrders({ status, search });
    res.json({ success: true, orders });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

// Admin: Get single order details
router.get('/:id', requireAdmin, (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id, 10);
    const order = db.getOrderById(id);
    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }
    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch order.' });
  }
});

// Admin: Update order status
router.patch('/:id/status', requireAdmin, (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status, comment } = req.body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      return;
    }

    const updated = db.updateOrderStatus(id, status, comment, 'ADMIN');
    if (!updated) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }

    res.json({ success: true, message: `Order status updated to ${status}`, order: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

export default router;
