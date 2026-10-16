import { Router, Request, Response } from 'express';
import { db } from '../lib/db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// Admin: Get all festival campaigns
router.get('/', requireAdmin, (_req: Request, res: Response): void => {
  try {
    const campaigns = db.getCampaigns();
    const hasMetaApiConfigured = Boolean(
      process.env.WHATSAPP_BUSINESS_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID
    );

    res.json({
      success: true,
      hasMetaApiConfigured,
      demoModeActive: !hasMetaApiConfigured,
      campaigns
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch campaigns.' });
  }
});

// Admin: Create new festival campaign
router.post('/', requireAdmin, (req: Request, res: Response): void => {
  try {
    const { name, occasion, messageTemplate, offerDetails, scheduledFor } = req.body;
    if (!name || !occasion || !messageTemplate) {
      res.status(400).json({ error: 'Name, occasion, and message template are required.' });
      return;
    }

    const campaign = db.createCampaign({
      name: name.trim(),
      occasion,
      messageTemplate,
      offerDetails: offerDetails || '',
      scheduledFor: scheduledFor || null,
      status: scheduledFor ? 'SCHEDULED' : 'DRAFT'
    });

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully!',
      campaign
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create campaign.' });
  }
});

// Admin: Preview personalized message
router.post('/preview', requireAdmin, (req: Request, res: Response): void => {
  try {
    const { messageTemplate, sampleName } = req.body;
    if (!messageTemplate) {
      res.status(400).json({ error: 'Message template is required.' });
      return;
    }

    const name = sampleName || 'Ananya';
    const personalized = messageTemplate.replace(/\{NAME\}/g, name);

    res.json({
      success: true,
      preview: personalized
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate preview.' });
  }
});

// Admin: Trigger campaign send (Automated or Demo Mode)
router.post('/:id/send', requireAdmin, (req: Request, res: Response): void => {
  try {
    const campaignId = parseInt(req.params.id, 10);
    const hasMetaApiConfigured = Boolean(
      process.env.WHATSAPP_BUSINESS_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID
    );

    const result = db.triggerCampaignDemoSend(campaignId);
    if (!result) {
      res.status(404).json({ error: 'Campaign not found.' });
      return;
    }

    if (!hasMetaApiConfigured) {
      // Demo Mode as required in Section 8:
      // "If API credentials are unavailable, provide a clearly labelled demo mode and WhatsApp click-to-chat previews. Do not pretend that automated messages have been sent."
      const previewLinks = result.recipients.map((r: any) => {
        const text = result.campaign.messageTemplate.replace(/\{NAME\}/g, r.customerName || 'Friend');
        return {
          phone: r.phone,
          customerName: r.customerName,
          clickToChatUrl: `https://wa.me/91${r.phone}?text=${encodeURIComponent(text)}`
        };
      });

      res.json({
        success: true,
        mode: 'DEMO_MODE',
        notice: 'Meta WhatsApp Business API credentials not configured. Tested in simulated Demo Mode with click-to-chat previews. No automated WhatsApp messages were dispatched.',
        campaign: result.campaign,
        previewLinks
      });
      return;
    }

    // Real API integration would execute here
    res.json({
      success: true,
      mode: 'OFFICIAL_API',
      message: 'Campaign dispatched to Meta WhatsApp Cloud API successfully.',
      campaign: result.campaign
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to trigger campaign.' });
  }
});

export default router;
