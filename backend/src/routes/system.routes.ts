import { Router } from 'express';
import { SystemController } from '../controllers/system.controller';

const router = Router();

// Public System Telemetry & Status Endpoint
router.get('/status', SystemController.getStatus);

export default router;
