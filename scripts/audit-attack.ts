import { setTimeout } from 'timers/promises';

const BASE_URL = 'http://localhost:8000/api';

async function attackXSS() {
  console.log('\n⚔️  [ATTACK] Testing XSS Injection (Register)...');
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `hacker-${Date.now()}@xss.com`,
        password: process.env.TEST_PASSWORD || 'P@ssword123!',
        name: '<script>alert("XSS")</script> hacker' 
      })
    });
    
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    console.log('Response Name:', data.user?.name); // Should be sanitized
    
    if (data.user?.name === '&lt;script&gt;alert("XSS")&lt;/script&gt; hacker' || 
        !data.user?.name.includes('<script>')) {
        console.log('✅ XSS Mitigation: EFFECTIVE (Input sanitized)');
    } else {
        console.log('❌ XSS Mitigation: FAILED (Script tag persisted)');
    }
  } catch (e) {
    console.error('Request Failed:', e);
  }
}

async function attackBruteForce() {
  console.log('\n⚔️  [ATTACK] Testing Brute Force / Rate Limit...');
  const attempts = 15; // Rate limit might be 100, so this won't block but will log.
  // To trigger block we'd need more, but let's verify logs first.
  
  for (let i = 0; i < attempts; i++) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@kaven.com',
        password: `wrongpass${i}`
      })
    });
    
    process.stdout.write(`Attempt ${i+1}: ${res.status} ${res.statusText}\n`);
    if (res.status === 429) {
        console.log('✅ Rate Limit: BLOCKING EFFECTIVE');
        return;
    }
  }
  console.log('ℹ️  Rate Limit: Threshold not reached (expected if Limit > 15)');
}

async function attackIDOR_Unauth() {
    console.log('\n⚔️  [ATTACK] Testing IDOR (Unauthenticated)...');
    try {
        const res = await fetch(`${BASE_URL}/users/123-fake-id`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' } // No Token
        });
        console.log(`Status: ${res.status} (Expected 401)`);
    } catch(e) { console.error(e); }
}

(async () => {
    await attackXSS();
    await attackIDOR_Unauth();
    await attackBruteForce();
})();
