// Debug Authentication Flow
// Paste this in browser console to debug auth state

console.log('🔍 AUTHENTICATION DEBUG SUMMARY');
console.log('==================================');

// Check localStorage tokens
console.log('📱 LocalStorage Tokens:');
console.log('  Access Token:', localStorage.getItem('valux_access_token')?.substring(0, 20) + '...');
console.log('  Refresh Token:', localStorage.getItem('valux_refresh_token')?.substring(0, 20) + '...');

// Check auth service state
console.log('🔐 Auth Service:');
try {
  // Access the auth service from window if available
  console.log('  IsAuthenticated:', window.authService?.isAuthenticated?.() || 'N/A');
} catch (e) {
  console.log('  Auth service not accessible from window');
}

// Check current auth state from React
console.log('⚛️ React Auth State:');
console.log('  Check the console for "🎭 AuthButton current state:" logs');

// Instructions
console.log('📋 Debug Steps:');
console.log('1. Check if you see these logs when clicking Sign Message:');
console.log('   🔍 Login response structure:');
console.log('   🔑 Access token exists:');
console.log('   👤 User exists:');
console.log('   💾 Setting tokens');
console.log('   🔧 SET_USER reducer');
console.log('');
console.log('2. If some logs are missing, that indicates where the problem is:');
console.log('   - Missing login response logs = API issue');
console.log('   - Missing token setting logs = Response parsing issue');  
console.log('   - Missing SET_USER logs = Dispatch issue');
console.log('   - State not changing = Reducer issue');