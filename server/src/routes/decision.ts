import { Router } from 'express';
import { DecisionController } from '../controllers/decisionController';

const router = Router();
const decisionController = new DecisionController();

router.post('/assign', decisionController.assignGroup);
router.post('/validate', decisionController.validateGroup);

export default router;