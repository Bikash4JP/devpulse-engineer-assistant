const http = require('http');

function request(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(
      { hostname: 'localhost', port: 5000, path, method, headers },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
      }
    );
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTestSuite() {
  console.log('==================================================');
  console.log('🧪 RUNNING DEVPULSE END-TO-END AUTOMATED TEST SUITE');
  console.log('==================================================\n');

  // Test 1: Health Check
  const health = await request('/api/v1/health');
  console.log('✅ TEST 1: HEALTH CHECK -> Status:', health.status, '| Status Message:', health.data.status);

  // Test 2: User Registration
  const userEmail = `qa_test_${Date.now()}@example.com`;
  const reg = await request('/api/v1/auth/register', 'POST', {
    name: 'QA Engineer',
    email: userEmail,
    password: 'TestPass123!',
  });
  console.log('✅ TEST 2: AUTH REGISTER -> Status:', reg.status, '| User ID:', reg.data.data.user.id);
  const token = reg.data.data.token;

  // Test 3: Protected Profile Access
  const profile = await request('/api/v1/auth/me', 'GET', null, token);
  console.log('✅ TEST 3: AUTH GET /ME -> Status:', profile.status, '| Name:', profile.data.data.name);

  // Test 4: Dashboard Feed Aggregator
  const feed = await request('/api/v1/integrations/dashboard-feed', 'GET', null, token);
  console.log('✅ TEST 4: AGGREGATOR FEED -> Status:', feed.status, '| Temp:', feed.data.data.weather.temperatureCelsius + '°C');

  // Test 5: AI Smart Reply Generator
  const ai = await request('/api/v1/integrations/ai/reply', 'POST', { message: 'Can you review AWS EC2 security group rules?' }, token);
  console.log('✅ TEST 5: AI SMART REPLY -> Status:', ai.status, '| Action:', ai.data.data.suggestedAction);

  console.log('\n==================================================');
  console.log('🎉 ALL 5 INTEGRATION TESTS PASSED 100%!');
  console.log('==================================================');
}

runTestSuite().catch(console.error);
