import { Router, Request, Response } from 'express';
import { db } from '../lib/db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public: Submit customer feedback
router.post('/', (req: Request, res: Response): void => {
  try {
    const { customerName, customerPhone, overallRating, foodQualityRating, serviceRating, orderReference, comments, allowFollowUp } = req.body;

    if (!comments || !overallRating) {
      res.status(400).json({ error: 'Overall star rating and written comments are required.' });
      return;
    }

    const saved = db.submitFeedback({
      customerName,
      customerPhone,
      overallRating: Number(overallRating),
      foodQualityRating: Number(foodQualityRating) || Number(overallRating),
      serviceRating: Number(serviceRating) || Number(overallRating),
      orderReference,
      comments: comments.trim(),
      allowFollowUp: Boolean(allowFollowUp)
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your valuable feedback! It helps us make every Kruffles moment sweeter.',
      feedback: saved
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to record feedback.' });
  }
});

// Public: Get verified approved reviews
router.get('/reviews', (_req: Request, res: Response): void => {
  try {
    const reviews = db.getApprovedReviews();
    res.json({ success: true, reviews });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
});

// Admin: Get all feedback submissions
router.get('/all', requireAdmin, (_req: Request, res: Response): void => {
  try {
    const feedback = db.getAllFeedback();
    res.json({ success: true, feedback });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch feedback submissions.' });
  }
});

// Admin: Moderate feedback (Approve or Reject for public display)
router.patch('/:id/moderate', requireAdmin, (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id, 10);
    const { isApproved } = req.body;

    if (isApproved === undefined) {
      res.status(400).json({ error: 'isApproved boolean is required.' });
      return;
    }

    const updated = db.moderateFeedback(id, Boolean(isApproved));
    if (!updated) {
      res.status(404).json({ error: 'Feedback record not found.' });
      return;
    }

    res.json({
      success: true,
      message: isApproved ? 'Feedback approved for public website display.' : 'Feedback unpublished from public display.',
      feedback: updated
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to moderate feedback.' });
  }
});

export default router;
