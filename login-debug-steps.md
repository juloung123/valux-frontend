# Login Debug Steps

## Current Issue
- Backend returns successful login response with tokens and user data
- Frontend shows "Authenticating..." (stuck in AUTHENTICATING state)
- State never changes to AUTHENTICATED

## Debug Steps

### 1. Open Browser Console
1. Go to http://localhost:3000
2. Open DevTools (F12) 
3. Go to Console tab
4. Clear console

### 2. Perform Login
1. Click "Connect Wallet" and connect your wallet
2. Click "Sign Message"
3. Sign the message in your wallet

### 3. Check Debug Logs (in order)

#### Expected Console Output:
```
🔍 Raw API Response: { success: true, data: { access_token: "...", ... } }
✅ API Response has success field: true
🔍 Response data: { access_token: "...", user: {...}, ... }
📦 Returning direct data from response
🔍 Login response structure: { access_token: "...", user: {...}, ... }
🔑 Access token exists: true
🔄 Refresh token exists: true  
👤 User exists: true
💾 Setting tokens - access: eyJhbG... refresh: eyJhbG...
💾 Tokens saved to localStorage
🔍 AuthContext received login response: { access_token: "...", user: {...}, ... }
👤 User from response: { id: "...", address: "0x...", ... }
🔑 Access token from response: eyJhbG...
✅ Dispatched SET_USER action
🔧 SET_USER reducer - payload: { id: "...", address: "0x...", ... }
🔧 Setting authState to AUTHENTICATED
🎭 AuthButton current state: authenticated
```

### 4. Identify Missing Logs

If you DON'T see certain logs, here's what it means:

#### Missing API Response Logs
```
🔍 Raw API Response: ...
✅ API Response has success field: ...
```
**Problem**: Network/API call failed. Check Network tab for failed requests.

#### Missing Response Processing Logs
```
📦 Returning direct data from response
🔍 Login response structure: ...
```
**Problem**: Response parsing issue. Backend response format doesn't match expected structure.

#### Missing Token Setting Logs
```
💾 Setting tokens - access: ...
💾 Tokens saved to localStorage
```
**Problem**: Response doesn't contain access_token or refresh_token fields.

#### Missing AuthContext Logs
```
🔍 AuthContext received login response: ...
👤 User from response: ...
✅ Dispatched SET_USER action
```
**Problem**: Login promise rejection or error thrown before dispatch.

#### Missing Reducer Logs
```
🔧 SET_USER reducer - payload: ...
🔧 Setting authState to AUTHENTICATED
```
**Problem**: SET_USER action not reaching reducer (rare).

#### Missing State Update Logs
```
🎭 AuthButton current state: authenticated
```
**Problem**: State update not triggering re-render (React issue).

### 5. Check Browser Storage
After login attempt, check:
```javascript
// In console:
localStorage.getItem('valux_access_token')
localStorage.getItem('valux_refresh_token')
```

### 6. Network Tab Check
1. Go to Network tab in DevTools
2. Look for `/auth/login` request
3. Check if it returns 200 status
4. Verify response body matches expected format

## Report Results
After testing, report which logs you see and which are missing. This will help identify exactly where the authentication flow is breaking.