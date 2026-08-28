export interface ConnectedAccount {
  provider: 'SLACK' | 'LINE' | 'LINKEDIN';
  connected: boolean;
  accountName?: string;
  scopes: string[];
  connectedAt?: string;
}

// In-Memory Token Store for OAuth Integrations
const oauthStore: Map<string, Map<string, ConnectedAccount>> = new Map();

export class OAuthService {
  /**
   * Generates OAuth 2.0 Redirect URL for Slack, LINE, or LinkedIn
   */
  static getAuthUrl(provider: 'SLACK' | 'LINE' | 'LINKEDIN', userId: string): string {
    const redirectUri = encodeURIComponent(`http://localhost:5000/api/v1/integrations/oauth/callback`);
    
    switch (provider) {
      case 'SLACK':
        return `https://slack.com/oauth/v2/authorize?client_id=devpulse_slack_client&scope=channels:read,chat:write&redirect_uri=${redirectUri}&state=${userId}`;
      case 'LINE':
        return `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=devpulse_line_client&redirect_uri=${redirectUri}&state=${userId}&scope=profile%20openid`;
      case 'LINKEDIN':
        return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=devpulse_linkedin_client&redirect_uri=${redirectUri}&state=${userId}&scope=r_liteprofile%20w_member_social`;
    }
  }

  /**
   * Exchanges temporary Auth Code for Access Token
   */
  static async handleCallback(userId: string, provider: 'SLACK' | 'LINE' | 'LINKEDIN', code: string) {
    // Simulated Token Exchange with OAuth Provider
    const simulatedAccessToken = `oauth_token_${provider.toLowerCase()}_${Date.now()}`;
    
    if (!oauthStore.has(userId)) {
      oauthStore.set(userId, new Map());
    }

    const userAccounts = oauthStore.get(userId)!;
    const account: ConnectedAccount = {
      provider,
      connected: true,
      accountName: `@bikas_${provider.toLowerCase()}`,
      scopes: provider === 'SLACK' ? ['channels:read', 'chat:write'] : ['profile', 'notifications'],
      connectedAt: new Date().toISOString(),
    };

    userAccounts.set(provider, account);
    return { success: true, account, token: simulatedAccessToken };
  }

  /**
   * Get all connected OAuth accounts for user
   */
  static getConnectedAccounts(userId: string): ConnectedAccount[] {
    const userAccounts = oauthStore.get(userId);
    if (!userAccounts) {
      return [
        { provider: 'SLACK', connected: false, scopes: ['channels:read', 'chat:write'] },
        { provider: 'LINE', connected: false, scopes: ['profile', 'notifications'] },
        { provider: 'LINKEDIN', connected: false, scopes: ['r_liteprofile', 'w_member_social'] },
      ];
    }
    
    const providers: ('SLACK' | 'LINE' | 'LINKEDIN')[] = ['SLACK', 'LINE', 'LINKEDIN'];
    return providers.map((p) => userAccounts.get(p) || { provider: p, connected: false, scopes: [] });
  }
}
