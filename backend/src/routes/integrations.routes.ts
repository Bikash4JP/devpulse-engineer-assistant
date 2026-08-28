import { Router } from 'express';
import { IntegrationsController } from '../controllers/integrations.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Protect all integration endpoints with JWT Bearer Token
router.use(authenticateToken);

// AI Smart Reply Route
router.post('/ai/reply', IntegrationsController.generateAiReply);

// Aggregator Feed Route (Weather, Forex, Tech News)
router.get('/dashboard-feed', IntegrationsController.getDashboardFeed);

// OAuth SNS Integrations Routes
router.get('/oauth/accounts', IntegrationsController.getOAuthAccounts);
router.post('/oauth/connect', IntegrationsController.connectOAuth);

export default router;
