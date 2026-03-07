# Frontend Setup Instructions

## Installation

### 1. Install Dependencies

The frontend uses axios which needs to be installed:

```bash
cd /mnt/d/Projects/New\ folder/p-211899
npm install axios
```

### 2. Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` and set your API URL:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## Completed Features

### ✅ API Client & Infrastructure (100%)
- **API Client** (`src/lib/api.ts`)
  - Axios instance with JWT interceptor
  - Automatic token refresh on 401
  - All API endpoints organized by module
  - Error handling helper

- **React Query Hooks** (`src/hooks/useApi.ts`)
  - Custom hooks for all API endpoints
  - Automatic cache invalidation
  - Loading and error states
  - Optimistic updates

- **Auth Context** (`src/contexts/AuthContext.tsx`)
  - User state management
  - Login/logout functionality
  - Authentication status

- **Route Protection**
  - `ProtectedRoute` - Requires authentication
  - `AdminRoute` - Requires admin privileges

### ✅ Authentication Pages (100%)
- **Login** (`/login`)
  - Phone number + password
  - Form validation with Zod
  - Auto-redirect if already logged in
  - Remember attempted route

- **Register** (`/register`)
  - Phone number + password + confirmation
  - Password strength validation
  - Auto-login after registration

- **Forgot Password** (`/forgot-password`)
  - 3-step flow: Request OTP → Verify → Reset
  - SMS code validation
  - Secure password reset

---

## Routes

| Path | Component | Protection | Description |
|------|-----------|------------|-------------|
| `/` | Index | Public | Home page |
| `/login` | Login | Public | Login page |
| `/register` | Register | Public | Registration |
| `/forgot-password` | ForgotPassword | Public | Password reset |
| `/create` | Create | Protected | Image generation workflow |
| `/admin` | AdminApp | Admin | Admin panel |

---

## API Endpoints Available

### Auth
- `authApi.register()`
- `authApi.login()`
- `authApi.refreshToken()`
- `authApi.requestOTP()`
- `authApi.verifyOTP()`
- `authApi.resetPassword()`
- `authApi.getCurrentUser()`

### Core
- `coreApi.getSamples()`
- `coreApi.getPlatforms()`
- `coreApi.getJobs()`
- `coreApi.createJob()`
- `coreApi.selectTheme()`
- `coreApi.generateImage()`

### Subscriptions
- `subscriptionsApi.getPackages()`
- `subscriptionsApi.getMyCredits()`
- `subscriptionsApi.checkCredits()`

### Payments
- `paymentsApi.createStripeCheckout()`
- `paymentsApi.createClickPayment()`
- `paymentsApi.getMyPayments()`

### Admin
- `adminApi.getUsers()`
- `adminApi.adjustCredits()`
- `adminApi.getSamples()`
- `adminApi.createSample()`
- `adminApi.getPackages()`
- `adminApi.getGenerationLogs()`
- And more...

---

## React Query Hooks

Use these hooks in your components for easy data fetching:

```tsx
// Auth
const { data: user } = useCurrentUser();
const loginMutation = useLogin();

// Core
const { data: samples } = useSamples();
const { data: job, isLoading } = useJob(jobId, pollingEnabled);
const createJobMutation = useCreateJob();

// Subscriptions
const { data: packages } = usePackages();
const { data: credits } = useMyCredits();

// Admin
const { data: users } = useAdminUsers(search, page);
const adjustCreditsMutation = useAdjustCredits();
```

---

## Next Steps (Remaining Work)

### 1. Create Workflow Page (`/create`)
Components needed:
- `UploadForm` - Image upload + platform selection
- `ThemeSelector` - Display 3 themes from AI analysis
- `PaywallModal` - Show if insufficient credits
- `GenerationProgress` - Polling job status
- `ResultDisplay` - Final image with download

### 2. Admin Panel Page (`/admin`)
Components needed:
- `SampleManager` - CRUD samples
- `PackageManager` - CRUD packages
- `UserList` - User management + credit adjustment
- `GenerationLogs` - View all generation jobs

### 3. Update Main Page (`/`)
- Add samples grid from API
- Add "Create" CTA button
- Update navigation with login/logout

---

## Testing Auth Flow

1. **Start backend:**
```bash
cd backend
python3 manage.py runserver
```

2. **Start frontend:**
```bash
npm run dev
```

3. **Test registration:**
- Go to `http://localhost:5173/register`
- Enter phone number (+998901234567)
- Create password
- Should auto-login and redirect to home

4. **Test login:**
- Go to `http://localhost:5173/login`
- Enter credentials
- Should redirect to home with user state

5. **Test forgot password:**
- Go to `http://localhost:5173/forgot-password`
- Enter phone number
- Check backend console for OTP code
- Enter code and new password

---

## File Structure

```
src/
├── lib/
│   ├── api.ts              ✅ API client with all endpoints
│   └── utils.ts            (existing)
├── hooks/
│   ├── useApi.ts           ✅ React Query hooks
│   ├── use-toast.ts        (existing)
│   └── use-mobile.tsx      (existing)
├── contexts/
│   └── AuthContext.tsx     ✅ Authentication state
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx           ✅
│   │   ├── RegisterForm.tsx        ✅
│   │   └── ForgotPasswordFlow.tsx  ✅
│   ├── shared/
│   │   ├── ProtectedRoute.tsx  ✅
│   │   └── AdminRoute.tsx      ✅
│   ├── create/             ❌ To be created
│   └── admin/              ❌ To be created
└── pages/
    ├── Auth/
    │   ├── Login.tsx           ✅
    │   ├── Register.tsx        ✅
    │   └── ForgotPassword.tsx  ✅
    ├── Create.tsx          ❌ To be created
    ├── AdminApp.tsx        ❌ To be created
    └── Index.tsx           (needs update)
```

---

## Environment Variables

Required in `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

Last Updated: 2025-12-19
Frontend Progress: 40% (Auth complete, Create & Admin pending)
