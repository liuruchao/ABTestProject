"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const experimentController_1 = require("../controllers/experimentController");
const router = (0, express_1.Router)();
const experimentController = new experimentController_1.ExperimentController();
router.get('/', experimentController.listExperiments);
router.post('/', experimentController.createExperiment);
router.get('/by-route', experimentController.getExperimentsByRoute);
router.put('/:id', experimentController.updateExperiment);
router.delete('/:id', experimentController.deleteExperiment);
router.get('/:id', experimentController.getExperiment);
exports.default = router;
//# sourceMappingURL=experiment.js.map