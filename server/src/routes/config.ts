import { Router } from 'express';
import { ConfigController } from '../controllers/configController';

const router = Router();
const configController = new ConfigController();

router.get('/global', configController.getGlobalConfig);
router.get('/page', configController.getPageConfig);
router.post('/sync', configController.syncConfig);

export default router;