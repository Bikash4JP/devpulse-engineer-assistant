import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { AiService } from '../services/ai.service';
import { AggregatorService } from '../services/aggregator.service';
import { OAuthService } from '../services/oauth.service';

export class IntegrationsController {
  /**
   * POST /api/v1/integrations/ai/reply
   * AI Smart Reply Generator
   */
  static async generateAiReply(req: AuthenticatedRequest, res: Response) {
    try {
      const { message, platform, tone } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Validation Error', message: 'Incoming message text is required' });
      }

      const result = await AiService.generateReply(message, { platform, tone });
      return res.status(200).json({
        message: 'AI Smart Reply generated successfully',
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({ error: 'AI Generation Failed', message: error.message });
    }
  }

  /**
   * GET /api/v1/integrations/dashboard-feed
   * Combined Aggregator Feed (Weather, Forex, Tech News)
   */
  static async getDashboardFeed(req: AuthenticatedRequest, res: Response) {
    try {
      const weather = await AggregatorService.getWeather('Tokyo');
      const forex = await AggregatorService.getExchangeRates('USD');
      const news = await AggregatorService.getTechNews();

      return res.status(200).json({
        message: 'Dashboard feed fetched successfully',
        data: {
          weather,
          forex,
          news,
        },
      });
    } catch (error: any) {
      return res.status(500).json({ error: 'Feed Retrieval Failed', message: error.message });
    }
  }

  /**
   * GET /api/v1/integrations/oauth/accounts
   * Get connected SNS accounts
   */
  static async getOAuthAccounts(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId || 'anonymous';
      const accounts = OAuthService.getConnectedAccounts(userId);
      return res.status(200).json({
        message: 'Connected accounts retrieved',
        data: accounts,
      });
    } catch (error: any) {
      return res.status(500).json({ error: 'OAuth Check Failed', message: error.message });
    }
  }

  /**
   * POST /api/v1/integrations/oauth/connect
   * Connect an SNS account (Slack, LINE, LinkedIn)
   */
  static async connectOAuth(req: AuthenticatedRequest, res: Response) {
    try {
      const { provider } = req.body;
      const userId = req.user?.userId || 'usr_dev';

      if (!['SLACK', 'LINE', 'LINKEDIN'].includes(provider)) {
        return res.status(400).json({ error: 'Invalid Provider', message: 'Provider must be SLACK, LINE, or LINKEDIN' });
      }

      const result = await OAuthService.handleCallback(userId, provider, 'auth_code_simulated_123');
      return res.status(200).json({
        message: `Successfully connected ${provider} account!`,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({ error: 'Connection Failed', message: error.message });
    }
  }
}
