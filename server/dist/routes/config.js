"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const configController_1 = require("../controllers/configController");
const router = (0, express_1.Router)();
const configController = new configController_1.ConfigController();
router.get('/global', configController.getGlobalConfig);
router.get('/page', configController.getPageConfig);
router.post('/sync', configController.syncConfig);
exports.default = router;
//# sourceMappingURL=config.js.map