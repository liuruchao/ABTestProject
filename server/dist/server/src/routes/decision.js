"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const decisionController_1 = require("../controllers/decisionController");
const router = (0, express_1.Router)();
const decisionController = new decisionController_1.DecisionController();
router.post('/assign', decisionController.assignGroup);
router.post('/validate', decisionController.validateGroup);
exports.default = router;
//# sourceMappingURL=decision.js.map