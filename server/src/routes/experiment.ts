import { Router } from 'express';
import { ExperimentController } from '../controllers/experimentController';

const router = Router();
const experimentController = new ExperimentController();

router.get('/', experimentController.listExperiments);
router.post('/', experimentController.createExperiment);
router.get('/by-route', experimentController.getExperimentsByRoute);
router.put('/:id', experimentController.updateExperiment);
router.delete('/:id', experimentController.deleteExperiment);
router.get('/:id', experimentController.getExperiment);

export default router;