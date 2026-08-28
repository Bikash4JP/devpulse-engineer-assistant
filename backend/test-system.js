const http = require('http');

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
    }).on('error', reject);
  });
}

async function runSystemTest() {
  console.log('--- TESTING ENTERPRISE SYSTEM TELEMETRY & OPENAPI SPECS ---');
  try {
    const statusRes = await testEndpoint('/api/v1/system/status');
    console.log('1. TELEMETRY STATUS:', statusRes.status);
    console.log('Telemetry Data:', JSON.stringify(statusRes.data, null, 2));

    const docsRes = await testEndpoint('/api/v1/docs');
    console.log('\n2. OPENAPI DOCS STATUS:', docsRes.status);
    console.log('API Title:', docsRes.data.info.title);
    console.log('API Version:', docsRes.data.info.version);
    console.log('Available Endpoints:', Object.keys(docsRes.data.paths).join(', '));
  } catch (err) {
    console.error('Server test error (Make sure backend is running):', err.message);
  }
}

runSystemTest();
