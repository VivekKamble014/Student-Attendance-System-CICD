// Test script for registration and login
// Usage: node scripts/test-auth.js

// Load environment variables
require('dotenv').config({ path: '.env' });

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

// Test data
const testUser = {
  email: `test${Date.now()}@example.com`,
  password: 'test123456',
  fullName: 'Test User',
  role: 'STUDENT',
  department: 'Computer Science',
  rollNo: `ROLL${Date.now()}`,
  class: 'A',
  mobile: '1234567890'
};

const testTeacher = {
  email: `teacher${Date.now()}@example.com`,
  password: 'teacher123456',
  fullName: 'Test Teacher',
  role: 'TEACHER',
  department: 'Computer Science',
  mobile: '9876543210'
};

async function testRegistration(userData, userType) {
  console.log(`\n📝 Testing ${userType} Registration...`);
  console.log(`Email: ${userData.email}`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Registration successful!');
      console.log(`   User ID: ${data.user?.id}`);
      console.log(`   Status: ${data.user?.status}`);
      console.log(`   Message: ${data.message}`);
      return { success: true, user: data.user, email: userData.email, password: userData.password };
    } else {
      console.log('❌ Registration failed!');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${data.error}`);
      if (data.details) {
        console.log(`   Details:`, Array.isArray(data.details) ? data.details.join(', ') : data.details);
      }
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.log('❌ Network error during registration!');
    console.log(`   Error: ${error.message}`);
    console.log(`   Make sure the server is running: npm run dev`);
    return { success: false, error: error.message };
  }
}

async function testLogin(email, password) {
  console.log(`\n🔐 Testing Login...`);
  console.log(`Email: ${email}`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Login successful!');
      console.log(`   User: ${data.user?.fullName}`);
      console.log(`   Role: ${data.user?.role}`);
      console.log(`   Token: ${data.token ? 'Received' : 'Missing'}`);
      return { success: true, token: data.token, user: data.user };
    } else {
      console.log('❌ Login failed!');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${data.error}`);
      
      if (data.error?.includes('pending approval')) {
        console.log('   ⚠️  User needs admin approval before login');
      }
      
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.log('❌ Network error during login!');
    console.log(`   Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testGetMe(token) {
  console.log(`\n👤 Testing Get Current User...`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Get user info successful!');
      console.log(`   User: ${data.user?.fullName}`);
      console.log(`   Email: ${data.user?.email}`);
      console.log(`   Role: ${data.user?.role}`);
      return { success: true, user: data.user };
    } else {
      console.log('❌ Get user info failed!');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${data.error}`);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.log('❌ Network error!');
    console.log(`   Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testHealthCheck() {
  console.log('🏥 Testing API Health...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ API is healthy!');
      console.log(`   Database: ${data.database}`);
      console.log(`   Status: ${data.status}`);
      return true;
    } else {
      console.log('⚠️  Health check returned non-200 status');
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot reach API!');
    console.log(`   Error: ${error.message}`);
    console.log(`   Make sure server is running: npm run dev`);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Starting Authentication Tests');
  console.log('=' .repeat(50));
  console.log(`Base URL: ${BASE_URL}`);
  console.log('=' .repeat(50));

  // Test 1: Health Check
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.log('\n❌ Server is not running or not accessible!');
    console.log('   Please start the server: npm run dev');
    process.exit(1);
  }

  // Test 2: Student Registration
  const studentReg = await testRegistration(testUser, 'Student');
  
  // Test 3: Teacher Registration
  const teacherReg = await testRegistration(testTeacher, 'Teacher');

  // Test 4: Login (will fail if user not approved)
  if (studentReg.success) {
    console.log('\n⏳ Waiting 1 second before login test...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const loginResult = await testLogin(studentReg.email, studentReg.password);
    
    if (loginResult.success) {
      // Test 5: Get Current User
      await testGetMe(loginResult.token);
    } else {
      console.log('\n💡 Note: Login failed because user needs admin approval.');
      console.log('   This is expected for new registrations.');
      console.log('   Admin must approve the user in the admin panel first.');
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary');
  console.log('='.repeat(50));
  console.log(`Health Check: ${healthOk ? '✅' : '❌'}`);
  console.log(`Student Registration: ${studentReg.success ? '✅' : '❌'}`);
  console.log(`Teacher Registration: ${teacherReg.success ? '✅' : '❌'}`);
  
  if (studentReg.success) {
    console.log(`\n📧 Test Student Credentials:`);
    console.log(`   Email: ${studentReg.email}`);
    console.log(`   Password: ${testUser.password}`);
    console.log(`   Note: User status is PENDING - needs admin approval`);
  }
  
  if (teacherReg.success) {
    console.log(`\n📧 Test Teacher Credentials:`);
    console.log(`   Email: ${teacherReg.email}`);
    console.log(`   Password: ${testTeacher.password}`);
    console.log(`   Note: User status is PENDING - needs admin approval`);
  }
  
  console.log('\n✅ Testing complete!');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ with native fetch support');
  console.error('   Or install node-fetch: npm install node-fetch');
  process.exit(1);
}

runTests().catch(console.error);

