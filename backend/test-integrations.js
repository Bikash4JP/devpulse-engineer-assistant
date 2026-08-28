const http = require('http');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.on('error', reject);
    if (postData) req.write(JSON.stringify(postData));
    req.end();
  });
}

async function runIntegrationsTest() {
  console.log('--- 1. AUTHENTICATING TO GET JWT TOKEN ---');
  const regRes = await makeRequest(
    { hostname: 'localhost', port: 5000, path: '/api/v1/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { name: 'Bikas Engineer', email: `test_${Date.now()}@example.com`, password: 'TestPass123!' }
  );
  const token = regRes.body.data.token;
  console.log('JWT Token Acquired:', token.substring(0, 30) + '...');

  console.log('\n--- 2. TESTING GET /api/v1/integrations/dashboard-feed ---');
  const feedRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/integrations/dashboard-feed',
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('Feed Status:', feedRes.status);
  console.log('Weather Data:', feedRes.body.data.weather.city, feedRes.body.data.weather.temperatureCelsius + '°C', feedRes.body.data.weather.condition);
  console.log('Forex Rates:', 'USD/JPY = ¥' + feedRes.body.data.forex.rates.JPY);
  console.log('News Headline:', feedRes.body.data.news[0].title);

  console.log('\n--- 3. TESTING POST /api/v1/integrations/ai/reply ---');
  const aiRes = await makeRequest(
    { hostname: 'localhost', port: 5000, path: '/api/v1/integrations/ai/reply', method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } },
    { message: 'Can you check the AWS EC2 server logs for port 443 timeout?', platform: 'Slack', tone: 'professional' }
  );
  console.log('AI Reply Status:', aiRes.status);
  console.log('Generated AI Reply:', aiRes.body.data.reply);
  console.log('Suggested Action:', aiRes.body.data.suggestedAction);

  console.log('\n--- 4. TESTING POST /api/v1/integrations/oauth/connect (SLACK) ---');
  const oauthRes = await makeRequest(
    { hostname: 'localhost', port: 5000, path: '/api/v1/integrations/oauth/connect', method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } },
    { provider: 'SLACK' }
  );
  console.log('OAuth Connect Status:', oauthRes.status);
  console.log('Connected Account:', oauthRes.body.data.account);
}

runIntegrationsTest().catch(console.error);
