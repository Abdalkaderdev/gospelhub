#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const deploymentUrl = process.argv[2] || 'https://gospelhub.space';

console.log('🔍 Verifying Gospel Hub deployment...\n');

const checks = [
  {
    name: 'Homepage loads',
    url: deploymentUrl,
    expectedStatus: 200
  },
  {
    name: 'Bible Reader page loads',
    url: `${deploymentUrl}/bible-enhanced`,
    expectedStatus: 200
  },
  {
    name: 'Spiritual Growth page loads',
    url: `${deploymentUrl}/spiritual-growth`,
    expectedStatus: 200
  },
  {
    name: 'PWA Manifest exists',
    url: `${deploymentUrl}/manifest.json`,
    expectedStatus: 200
  },
  {
    name: 'Service Worker exists',
    url: `${deploymentUrl}/sw.js`,
    expectedStatus: 200
  },
  {
    name: 'Offline page loads',
    url: `${deploymentUrl}/offline`,
    expectedStatus: 200
  }
];

async function checkUrl(url, expectedStatus) {
  return new Promise((resolve) => {
    const request = https.get(url, (response) => {
      resolve({
        status: response.statusCode,
        success: response.statusCode === expectedStatus
      });
    });
    
    request.on('error', () => {
      resolve({
        status: 'ERROR',
        success: false
      });
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      resolve({
        status: 'TIMEOUT',
        success: false
      });
    });
  });
}

async function runChecks() {
  console.log(`🌐 Testing deployment at: ${deploymentUrl}\n`);
  
  let passed = 0;
  let total = checks.length;
  
  for (const check of checks) {
    process.stdout.write(`⏳ ${check.name}... `);
    
    const result = await checkUrl(check.url, check.expectedStatus);
    
    if (result.success) {
      console.log(`✅ (${result.status})`);
      passed++;
    } else {
      console.log(`❌ (${result.status})`);
    }
  }
  
  console.log(`\n📊 Results: ${passed}/${total} checks passed`);
  
  if (passed === total) {
    console.log('🎉 All checks passed! Deployment is successful.');
    console.log('\n🚀 Your Gospel Hub is ready!');
    console.log(`   📱 PWA: ${deploymentUrl}`);
    console.log(`   📖 Bible Reader: ${deploymentUrl}/bible-enhanced`);
    console.log(`   🌱 Spiritual Growth: ${deploymentUrl}/spiritual-growth`);
  } else {
    console.log('⚠️  Some checks failed. Please review the deployment.');
    process.exit(1);
  }
}

runChecks().catch(console.error);