// Test Authentication Flow
// Run this in browser console to test authentication

console.log('🧪 Testing Authentication Flow...')

// Test 1: Check if backend is accessible
fetch('http://localhost:8080/health')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Backend health check:', data)
    
    // Test 2: Test nonce endpoint
    const testAddress = '0x1234567890123456789012345678901234567890'
    return fetch(`http://localhost:8080/api/auth/nonce?address=${testAddress}`)
  })
  .then(response => response.json())
  .then(data => {
    console.log('✅ Nonce endpoint test:', data)
    console.log('🎉 Backend authentication endpoints are working!')
  })
  .catch(error => {
    console.error('❌ Backend test failed:', error)
    console.log('💡 Make sure backend is running: npm run server:start')
  })

// Instructions for manual testing
console.log(`
📋 Manual Testing Instructions:

1. Open browser at http://localhost:3000
2. Open DevTools Console (F12)
3. Look for these debug messages:
   🔘 AuthButton render - authState: guest
   🔄 Wallet connection changed - isConnected: false, address: undefined

4. Click "Connect Wallet" button
   - Should see RainbowKit modal
   - Connect a wallet (MetaMask, WalletConnect, etc.)

5. After wallet connection, look for:
   🔄 Wallet connection changed - isConnected: true, address: 0x...
   🔄 AuthReducer - action: SET_ADDRESS, payload: 0x...
   🔘 AuthButton render - authState: connected

6. Click "Sign Message" button
   - Should see wallet signature prompt
   - Sign the message

7. Look for authentication flow logs:
   🖱️ Sign Message button clicked
   🔐 Login function called, address: 0x..., isConnected: true
   🚀 Starting authentication process...
   📝 Step 1: Getting nonce for address: 0x...
   ✅ Nonce received: {...}
   ✍️ Step 2: Requesting signature from wallet...
   ✅ Signature received: 0x...
   🔗 Step 3: Authenticating with backend...
   ✅ Login response received: {...}  
   👤 Step 4: Setting authenticated user
   🎉 Authentication completed successfully!

8. Final button should show:
   🔘 AuthButton render - authState: authenticated

If any step fails, check the error messages in console.
`)