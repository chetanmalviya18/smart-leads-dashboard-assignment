import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
  getLeadStats,
} from '../controllers/leadController';
import { authenticate, authorize } from '../middleware/auth';
import {
  leadValidation,
  updateLeadValidation,
  leadQueryValidation,
  mongoIdValidation,
} from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/stats', getLeadStats);
router.get('/export', exportLeadsCSV);
router.get('/', leadQueryValidation, getLeads);
router.get('/:id', mongoIdValidation, getLeadById);
router.post('/', leadValidation, createLead);
router.put('/:id', mongoIdValidation, updateLeadValidation, updateLead);
router.delete('/:id', mongoIdValidation, deleteLead);

export default router;
