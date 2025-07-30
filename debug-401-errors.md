# Debug 401 Errors และ Infinite Loop

## Current Issue
- หน้า dashboard แสดง "Loading your portfolio..." แล้วเกิด infinite loop
- มี 401 Unauthorized errors ใน API calls
- System พยายาม refresh token แต่ล้มเหลว
- เกิด AuthenticationError loop

## Debug Steps

### 1. Check Token Status
เปิด browser console และรัน:
```javascript
console.log('Access Token:', localStorage.getItem('valux_access_token'))
console.log('Refresh Token:', localStorage.getItem('valux_refresh_token'))
```

### 2. Monitor API Calls
1. เปิด Network tab ใน DevTools
2. เข้าไปที่ /dashboard
3. ดู requests ที่เกิดขึ้น:
   - `/api/portfolio/user/0x.../positions` 
   - `/api/portfolio/user/0x.../transactions`

### 3. Check Debug Logs (Expected)

#### Token มีอยู่ในการเรียก API:
```
🔑 Request interceptor - token exists: true
🌐 Request URL: /portfolio/user/0x.../positions
✅ Added Authorization header
```

#### เมื่อได้ 401 Error:
```
🔄 Got 401 error, attempting token refresh...
🔄 Refresh token exists: true
🔄 Attempting token refresh...
🔄 Refresh response status: 200
✅ Got new access token: true
✅ Using new token for retry
```

#### หาก Token Refresh ล้มเหลว:
```
🔄 Token refresh result: false
❌ Token refresh failed, clearing tokens and redirecting
```

### 4. Expected Behaviors

#### Case 1: Token Valid
- API calls ผ่าน
- Portfolio data โหลดสำเร็จ
- ไม่มี 401 errors

#### Case 2: Token Expired but Refresh Success  
- ได้ 401 error แรก
- Token refresh สำเร็จ
- Retry request ผ่าน
- Portfolio data โหลดสำเร็จ

#### Case 3: Token Expired and Refresh Failed
- ได้ 401 error
- Token refresh ล้มเหลว
- Redirect ไปหน้าแรก
- ต้อง login ใหม่

### 5. Troubleshooting

#### ถ้าไม่เห็น logs:
- Browser cache อาจมีปัญหา - ลอง hard refresh (Ctrl+Shift+R)
- Token อาจหมดอายุ - ลอง login ใหม่

#### ถ้าเห็น infinite loop:
- ดูว่า redirect ทำงานหรือไม่
- ตรวจสอบว่า `isRedirecting` flag ทำงาน

#### ถ้า refresh token ล้มเหลว:
- Token อาจ invalid จริงๆ - ต้อง login ใหม่
- Backend อาจมีปัญหา - ตรวจสอบ backend server

## Expected Resolution
หลังจากแก้ไข:
1. Portfolio page ควรโหลดสำเร็จ หรือ
2. Redirect ไปหน้าแรกอย่างสะอาด (ไม่มี infinite loop)
3. User สามารถ login ใหม่ได้ปกติ