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

async function runTests() {
  console.log('--- 1. TESTING REGISTER ---');
  const regRes = await makeRequest(
    { hostname: 'localhost', port: 5000, path: '/api/v1/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { name: 'Bikas', email: 'test@example.com', password: 'TestPass123!' }
  );
  console.log('Register Status:', regRes.status);
  console.log('Register Response:', JSON.stringify(regRes.body, null, 2));

  const token = regRes.body.data.token;

  console.log('\n--- 2. TESTING GET /me WITH JWT TOKEN ---');
  const meRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/auth/me',
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('Protected Route Status:', meRes.status);
  console.log('Protected Profile Data:', JSON.stringify(meRes.body, null, 2));

  console.log('\n--- 3. TESTING GET /me WITHOUT TOKEN (UNAUTHORIZED BOUNCER) ---');
  const unauthorizedRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/auth/me',
    method: 'GET'
  });
  console.log('Unauthorized Route Status:', unauthorizedRes.status);
  console.log('Unauthorized Response:', JSON.stringify(unauthorizedRes.body, null, 2));
}

runTests().catch(console.error);
