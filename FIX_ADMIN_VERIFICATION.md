# Fix Summary: Admin Practitioner Verification Issue

## Problem
When clicking on "Verify Practitioners" menu in admin role, the application was:
1. Making requests to `http://localhost:8080/api/api/practitioners` (double `/api`)
2. Getting 403 Forbidden error even with valid authentication token

## Root Causes Identified and Fixed

### Issue 1: Incorrect API Path in Component
**File:** `frontend/src/pages/AdminVerifyPractitioners.jsx`

**Problem:** 
- Component was importing default axios instance and making direct calls with `/api/practitioners`
- The axios instance was already configured with baseURL `http://localhost:8080/api`
- This resulted in double path: `/api` + `/api/practitioners` = `/api/api/practitioners`

**Solution:**
- Changed imports to use the exported `practitionerService` from api.js
- Now uses: `practitionerService.getAll()` and `practitionerService.verify(id)`
- Axios instance handles the base URL, avoiding duplication

### Issue 2: 403 Forbidden - Spring Security Authorization
**File:** `backend/src/main/java/com/wellness/marketplace/config/SecurityConfig.java`

**Problem:**
- All `/api/practitioners/**` endpoints were set to `permitAll()` 
- PUT request to `/api/practitioners/{id}/verify` requires admin authorization
- Spring Security wasn't recognizing admin users due to:
  1. Roles not being included in JWT token
  2. Admin verification not being properly enforced

**Solution:**
- Updated SecurityConfig to differentiate between HTTP methods:
  - `GET /api/practitioners/**` → `permitAll()` (public access)
  - `PUT /api/practitioners/**/verify` → `hasRole("ADMIN")` (admin only)
  - `POST /api/practitioners` → `authenticated()` (any authenticated user)

### Issue 3: Roles Not in JWT Token
**File:** `backend/src/main/java/com/wellness/marketplace/security/JwtUtil.java`

**Problem:**
- JWT tokens were only containing email (subject) and expiration
- Spring Security couldn't determine if user was admin based on token alone
- Filter had to load full UserDetails each time to check roles

**Solution:**
- Added overloaded `generateToken(String email, String role)` method
- Role is now stored as a claim in JWT token
- Added `getRoleFromToken(String token)` method to extract role
- Maintains backward compatibility with existing `generateToken(String email)` method

### Issue 4: Role Not Passed to Token Generation
**File:** `backend/src/main/java/com/wellness/marketplace/service/AuthService.java`

**Problem:**
- AuthService was not passing user role to JwtUtil.generateToken()
- Token generation was ignoring role information

**Solution:**
- Updated `register()` method to call `jwtUtil.generateToken(user.getEmail(), user.getRole())`
- Updated `login()` method to call `jwtUtil.generateToken(user.getEmail(), user.getRole())`
- Now role is captured in JWT for authorization checks

## Files Modified

1. **Frontend:**
   - `frontend/src/pages/AdminVerifyPractitioners.jsx` - Fixed API calls

2. **Backend:**
   - `backend/src/main/java/com/wellness/marketplace/config/SecurityConfig.java` - Added role-based endpoint authorization
   - `backend/src/main/java/com/wellness/marketplace/security/JwtUtil.java` - Added role support in JWT
   - `backend/src/main/java/com/wellness/marketplace/service/AuthService.java` - Pass role to token generation

## How It Works Now

### Authentication Flow:
1. Admin logs in with credentials
2. Backend generates JWT with role claim: `{"sub": "admin@wellness.com", "role": "admin"}`
3. Frontend stores token in localStorage
4. Frontend sends Authorization header with token

### Authorization Flow:
1. Admin clicks "Verify Practitioners" → navigates to `/admin/verify-practitioners`
2. Page checks `user.role === 'admin'` and redirects if not
3. AdminRoute wrapper also checks user role before rendering component
4. Component calls `practitionerService.getAll()` → sends `GET /api/practitioners`
5. Spring Security allows (public endpoint)
6. Component displays practitioners list
7. Admin clicks "Verify" button → calls `practitionerService.verify(id)`
8. Sends `PUT /api/practitioners/{id}/verify` with Authorization header
9. Spring Security:
   - Validates JWT signature
   - Extracts role from JWT token
   - Checks if user has role "ADMIN"
   - Grants access if authorized
10. Backend updates PractitionerProfile.verified = true
11. Frontend updates UI to show "Already Verified"

## Testing

### Test with Admin User:
1. Start backend: `mvn spring-boot:run`
2. Check logs for admin credentials:
   ```
   ADMIN:
     Name: Admin User
     Email: admin@wellness.com
     Password: Admin@123
   ```
3. Login as admin with these credentials
4. Navigate to "Verify Practitioners" (visible in navbar for admin only)
5. Should see list of practitioners
6. Click "Verify Practitioner" button
7. Should update successfully without 403 error

### Test with Non-Admin User:
1. Login as patient: patient@example.com / password123
2. "Verify Practitioners" menu should NOT appear
3. If user tries to access `/admin/verify-practitioners` directly:
   - Should be redirected to home page (/)
   - If JWT check is bypassed, Spring Security returns 403

## Backward Compatibility

✅ All changes are backward compatible:
- Old JWT tokens (without role claim) still work for public endpoints
- Non-admin endpoints unchanged
- Patient and Practitioner roles work as before
- CustomUserDetailsService already provides ROLE_ prefix for Spring Security

## Security Improvements

✅ Enhanced security with these changes:
- Role-based endpoint protection
- Role information in JWT token
- Spring Security validates admin role for sensitive operations
- Multi-layer protection (frontend + backend)
