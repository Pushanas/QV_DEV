const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(body) });
        } catch(e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING COMPLETE ADMIN & CODE SYSTEM TESTS ===\n');
  let token = '';
  let generatedCode = '';

  // TEST 1: Admin Login
  console.log('[TEST 1] Testing Admin Login with master password...');
  const loginRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/admin/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { password: 'Q8_ADMIN_9731_ROOT_X2' });

  if (loginRes.status === 200 && loginRes.data.success && loginRes.data.token) {
    token = loginRes.data.token;
    console.log('✅ Admin Login Passed! Token received.');
  } else {
    console.error('❌ Admin Login Failed:', loginRes);
    process.exit(1);
  }

  // TEST 2: Generate Codes
  console.log('\n[TEST 2] Testing Code Generation by Admin...');
  const genRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/admin/codes/generate',
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': `q8_admin_session=${token}`
    }
  }, { count: 2, prefix: 'QV-DEV', days: 30, notes: 'اختبار النظام الآلي' });

  if (genRes.status === 200 && genRes.data.success && genRes.data.codes?.length === 2) {
    generatedCode = genRes.data.codes[0];
    console.log(`✅ Code Generation Passed! Generated codes:`, genRes.data.codes);
  } else {
    console.error('❌ Code Generation Failed:', genRes);
    process.exit(1);
  }

  // TEST 3: Fetch Codes List
  console.log('\n[TEST 3] Testing Fetch Codes in Admin Panel...');
  const listRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/admin/codes',
    method: 'GET',
    headers: { 'Cookie': `q8_admin_session=${token}` }
  });

  const found = Array.isArray(listRes.data) && listRes.data.find(c => c.code === generatedCode);
  if (found && found.status === 'unused') {
    console.log(`✅ Fetch Codes Passed! Found code ${generatedCode} with status 'unused'.`);
  } else {
    console.error('❌ Fetch Codes Failed:', listRes);
    process.exit(1);
  }

  // TEST 4: User Login with Generated Code
  console.log(`\n[TEST 4] Testing User Login with Generated Code (${generatedCode})...`);
  const userLoginRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/auth/vip-login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { 
    password: generatedCode, 
    fingerprint: 'TEST_DEVICE_FP_8899', 
    deviceName: 'Samsung S24 Ultra' 
  });

  if (userLoginRes.status === 200 && userLoginRes.data.success && userLoginRes.data.isCode) {
    console.log(`✅ User Login with Generated Code Passed! Message: "${userLoginRes.data.message}"`);
  } else {
    console.error('❌ User Login with Generated Code Failed:', userLoginRes);
    process.exit(1);
  }

  // TEST 5: Verify Session with Activated Code
  console.log(`\n[TEST 5] Testing Session Verification for (${generatedCode})...`);
  const verifyRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/auth/vip-verify-session',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { 
    password: generatedCode, 
    fingerprint: 'TEST_DEVICE_FP_8899'
  });

  if (verifyRes.status === 200 && verifyRes.data.valid) {
    console.log('✅ Session Verification Passed! Valid session.');
  } else {
    console.error('❌ Session Verification Failed:', verifyRes);
    process.exit(1);
  }

  // TEST 6: Device Mismatch Prevention
  console.log('\n[TEST 6] Testing Security: Unauthorized Device Trying to Use Same Code...');
  const mismatchRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/auth/vip-login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { 
    password: generatedCode, 
    fingerprint: 'DIFFERENT_HACKER_DEVICE_FP', 
    deviceName: 'Unknown Device' 
  });

  if (mismatchRes.status === 403 && mismatchRes.data.code === 'DEVICE_MISMATCH') {
    console.log(`✅ Security Enforcement Passed! Successfully blocked unauthorized device: "${mismatchRes.data.arabicError}"`);
  } else {
    console.error('❌ Security Check Failed:', mismatchRes);
    process.exit(1);
  }

  // TEST 7: Visitor Tracking with Auth Code
  console.log('\n[TEST 7] Testing Visitor Tracking ping with registered code...');
  const pingRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/track/ping',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { 
    fingerprint: 'TEST_DEVICE_FP_8899',
    authCode: generatedCode,
    deviceName: 'Samsung S24 Ultra',
    action: 'توليد إشارة صفقة فجوة'
  });

  if (pingRes.status === 200 && !pingRes.data.isBanned) {
    console.log('✅ Visitor Tracking Passed! Visitor logged successfully.');
  } else {
    console.error('❌ Visitor Tracking Failed:', pingRes);
    process.exit(1);
  }

  // TEST 8: Suspend Code in Admin Panel
  console.log(`\n[TEST 8] Testing Code Suspension in Admin Panel for (${generatedCode})...`);
  const suspendRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: `/api/admin/codes/${generatedCode}/status`,
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': `q8_admin_session=${token}`
    }
  }, { status: 'suspended' });

  if (suspendRes.status === 200 && suspendRes.data.success) {
    console.log('✅ Code Suspension Passed!');
  } else {
    console.error('❌ Code Suspension Failed:', suspendRes);
    process.exit(1);
  }

  // TEST 9: Verify Suspended Code is Rejected
  console.log(`\n[TEST 9] Testing Login with Suspended Code (${generatedCode})...`);
  const suspendedLoginRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/auth/vip-login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { 
    password: generatedCode, 
    fingerprint: 'TEST_DEVICE_FP_8899'
  });

  if (suspendedLoginRes.status === 403 && suspendedLoginRes.data.code === 'CODE_SUSPENDED') {
    console.log(`✅ Suspended Code Block Passed! Blocked: "${suspendedLoginRes.data.arabicError}"`);
  } else {
    console.error('❌ Suspended Code Test Failed:', suspendedLoginRes);
    process.exit(1);
  }

  // TEST 10: Master VIP Password Login
  console.log('\n[TEST 10] Testing Master VIP Password Login (Q8_VIP_6419_T2Z)...');
  const masterVipRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/auth/vip-login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { 
    password: 'Q8_VIP_6419_T2Z', 
    fingerprint: 'MASTER_DEVICE_FP',
    deviceName: 'هاتف العضو الأساسي'
  });

  if (masterVipRes.status === 200 && masterVipRes.data.success) {
    console.log('✅ Master VIP Password Login Passed!');
  } else {
    console.error('❌ Master VIP Password Login Failed:', masterVipRes);
    process.exit(1);
  }

  console.log('\n======================================================');
  console.log('🎉 ALL 10 TESTS COMPLETED SUCCESSFULLY! SYSTEM 100% OPERATIONAL!');
  console.log('======================================================\n');
}

runTests().catch(err => {
  console.error('Fatal Test Error:', err);
  process.exit(1);
});
