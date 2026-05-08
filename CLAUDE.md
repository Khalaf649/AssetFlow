# AssetTrack — Frontend Feature Specifications (CLAUDE.MD)

## Global Architecture Principles

- **Framework:** Next.js App Router
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod (zodResolver)
- **Server State:** TanStack Query v5 (`useQuery`, `useMutation`)
- **UI State:** URL Search Params (`useSearchParams`) — no `useState` for filters/pagination
- **Global Client State:** React Context API (`AuthContext`)
- **Icons:** Lucide React
- **Base URL:** `http://localhost:8080/api/v1`
- **Auth:** Bearer JWT in `Authorization` header

### Standard API Response Envelope

Every API call must be wrapped/unwrapped through the envelope pattern:

- **Success:** `{ success: true, status, message, data }`
- **Error:** `{ success: false, status, message, error: { code, details[] } }`
- **Paginated:** `data.items[]` + `data.pagination { page (0-indexed), size, totalElements, totalPages }`

### Zero-Local-State Error Mapping Pattern

Never use `useState` for server errors. All mutation errors must flow through React Hook Form's `setError`:

- **Field errors (409/422):** `setError('fieldName', { message: '...' })`
- **Auth errors (401):** `setError('root', { message: '...' })` — never map to a specific field
- **Server errors (500):** `setError('root.serverError', { message: '...' })`

---

## Feature Specification: Authentication (auth)

### Overview

Handles user identity, secure token storage, and initial application entry points. Uses a strict "Zero-Local-State" error handling pattern.

### Feature Tech Stack

- **Routing:** Next.js App Router (`/auth/login`, `/auth/register`)
- **Forms:** React Hook Form + Zod (`zodResolver`)
- **Server State:** TanStack Query (`useMutation`)
- **Global Client State:** React Context API (`AuthContext`)

### Specific Business Rules (Zod Schemas — `auth-schemas.ts`)

- **Name:** String, length 1–120 characters
- **Email:** Valid email format, `.transform(v => v.toLowerCase())` before submission
- **Password:** Min 8 chars, regex requiring ≥1 uppercase, ≥1 lowercase, ≥1 number, ≥1 special character

### Directory Structure

```
src/app/auth/
├── layout.tsx          # Passive: visual container only, no logic
├── login/
│   └── page.tsx
├── register/
│   └── page.tsx
├── api/
│   └── auth-api.ts     # Envelope-unwrapping fetchers
├── components/
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
├── context/
│   └── AuthContext.tsx  # Global identity & roles
├── hooks/
│   └── useAuth.ts       # Context consumer
└── schemas/
    └── auth-schemas.ts  # Zod schemas with regex
```

### Logic Workflow

#### 1. Passive Layout (`layout.tsx`)

Strictly presentational. Renders a centered card/background/logo. Contains **no** business logic or route protection. Only job: render `{children}`.

#### 2. Client-Side Form Management

- React Hook Form via `zodResolver` connects `auth-schemas.ts` to the form
- The API is fully blocked if client-side validation fails (email format, password complexity)

#### 3. Registration Flow — `POST /auth/register`

- **Request:** `{ name, email (lowercase), password }`
- **Success (201 Created):** Returns user data only — **no token is issued**
  - On success, redirect the user to `/auth/login` with a success toast/message
  - Do **not** attempt to call `AuthContext.login()` — there is no `accessToken` in the register response
- **Error (409 EMAIL_CONFLICT):** Map via `setError('email', { message: 'An account with this email already exists.' })`
- **Error (422):** Map field errors from `error.details` array to their respective form fields

#### 4. Login Flow — `POST /auth/login`

- **Request:** `{ email, password }`
- **Success (200 OK):** Response `data` contains `{ accessToken, tokenType, expiresIn, user: { id, name, role } }`
  - Extract `accessToken` and `user` (`id`, `name`, `role`) — **note:** the login response does NOT include `email` in the user object
  - Call `login(token, user)` from `AuthContext`
  - Store JWT and user profile (including `role` for RBAC) in `localStorage`
  - Navigate to `router.push('/dashboard')`
- **Error (401 UNAUTHORIZED):** Map strictly to `setError('root', { message: 'Invalid email or password' })` — never map to a specific field (prevents user enumeration)
- **Error (500):** Map to `setError('root.serverError', { message: '...' })`

---

## Feature Specification: Dashboard (dashboard)

### Overview

The secure primary navigation hub. Dynamically adapts its UI based on the user's role (RBAC).

### Feature Tech Stack

- **Routing:** Next.js App Router (`/dashboard`)
- **Global Client State:** React Context API (`AuthContext`)
- **Server State:** TanStack Query (`useQuery`)
- **Icons:** Lucide React

### Directory Structure

```
src/app/dashboard/
├── layout.tsx                  # The Guardian: auth protection & Navbar
├── page.tsx                    # Traffic Controller: role-based rendering
└── components/
    ├── AdminManagerView.tsx    # Dashboard metrics & navigation
    ├── DeveloperView.tsx       # Focused personal hardware view
    ├── DashboardCard.tsx       # Reusable navigation/metric card
    └── NotificationBell.tsx    # Navbar widget for unread alerts
```

### Logic Workflow

#### 1. The Guardian (`layout.tsx`)

Active and protected. Consumes `AuthContext` — if no valid session/token, redirect to `/auth/login`. Renders the global Navbar containing:

- Company branding & dynamic greeting
- `<NotificationBell />` — fetches `GET /notifications`
- User profile dropdown & logout (clears `AuthContext` + `localStorage`, redirect to `/auth/login`)

#### 2. The Traffic Controller (`page.tsx`)

Minimal UI logic. Reads `user.role` from `AuthContext` and delegates:

- `user.role === 'DEVELOPER'` → `<DeveloperView />`
- `user.role === 'ADMIN' || user.role === 'MANAGER'` → `<AdminManagerView />`

Both sub-components consume `AuthContext` directly (no prop drilling).

#### 3. Admin & Manager View (`AdminManagerView.tsx`)

Live KPI cards via `GET /reports/dashboard`:

- Total Assets (by type breakdown)
- Open Condition Reports count
- Upcoming Warranty Expirations (within 30 days)

Navigation modules:

- **Personnel Directory** → `/users` (role assignment hidden unless `ADMIN`)
- **Asset Inventory** → `/assets`
- **Condition Reports** → `/condition-reports`
- **Analytics & Reports** → `/reports`

#### 4. Developer View (`DeveloperView.tsx`)

Personal hardware overview. Navigation modules:

- **My Equipment** → `/assets?assignedUserId={currentUser.id}`
- **Spare Laptops** → `/assets/spare-laptops` (calls `GET /assets/spare-laptops`)
- **Report Issue** → Quick-action to `/condition-reports/new`
- **My Profile** → `/users/{currentUser.id}`

---

## Feature Specification: User Management (users)

### Overview

Personnel directory and individual profiles. Enforces RBAC via layout guards and UI element rendering. Uses "Zero-Local-State" pattern — URL as filter state, TanStack Query for server data.

### Feature Tech Stack

- **Routing:** Next.js App Router (`/users`, `/users/[id]`)
- **Server State:** TanStack Query v5 (`useQuery`, `useMutation`)
- **UI/Filter State:** URL Search Params (`useSearchParams`)
- **Validation:** Zod
- **Global Client State:** React Context API (`AuthContext`)

### Directory Structure

```
src/app/users/
├── layout.tsx                  # The Guardian: RBAC & ID checking
├── page.tsx                    # User Directory (Collection View)
├── [id]/
│   └── page.tsx               # Specific User Profile (Resource View)
├── api/
│   └── users-api.ts
├── components/
│   ├── UserTable.tsx          # Renders data; disables actions for non-Admins
│   ├── FilterBar.tsx          # Updates URL (role filter)
│   ├── UpdateRoleModal.tsx    # Role modifications only
│   └── DeleteUserModal.tsx    # Deletion confirmation
├── hooks/
│   ├── useUsers.ts            # GET /users (consumes URL filters)
│   ├── useUser.ts             # GET /users/{id}
│   ├── useUserFilters.ts      # URL-as-State custom hook
│   ├── useUpdateRole.ts       # PATCH /users/{id}/role (ADMIN only)
│   └── useDeleteUser.ts       # DELETE /users/{id} (ADMIN only)
└── schemas/
    ├── filter-schema.ts       # Zod URL coercion (0-indexed page mapping)
    └── users-schemas.ts       # Zod for role enum: ADMIN | MANAGER | DEVELOPER
```

### Logic Workflow

#### 1. The Guardian (Layout & UI Protection)

- **ADMIN & MANAGER:** Unrestricted view access to `/users` and `/users/[id]`
- **DEVELOPER:**
  - `/users` → redirect to `/dashboard`
  - `/users/[id]` where `id === currentUser.id` → access granted (own profile)
  - `/users/[id]` where `id !== currentUser.id` → redirect to `/dashboard`
- **UI Guard:** `UserTable.tsx` reads `AuthContext` and **completely hides** "Edit Role" and "Delete" buttons unless the active user is `ADMIN`

#### 2. URL-as-State (`filter-schema.ts`, `useUserFilters.ts`)

- Zod coerces URL strings to typed values
- **Page mapping:** UI URL `?page=1` → API payload `page: 0` (0-indexed)
- `setFilter` calls `router.replace()` to update URL — triggers automatic TanStack Query refetch
- Query params: `page` (int ≥0), `size` (int 1–100), `role` (ADMIN|MANAGER|DEVELOPER)

#### 3. Server State (TanStack Query)

- `useUsers` — accepts typed output of `useUserFilters`; filter object is the query key
- `useDeleteUser`:
  - **409 USER_HAS_ACTIVE_ALLOCATIONS** → show specific modal error: "Return user's assigned assets first"
  - **422** (self-deletion) → block the action with an error message
  - On success: `queryClient.invalidateQueries({ queryKey: ['users'] })`

#### 4. Role Update (`UpdateRoleModal.tsx`, `useUpdateRole.ts`)

- Schema: role must be one of `ADMIN | MANAGER | DEVELOPER`
- `PATCH /users/{id}/role` → `{ role: "MANAGER" }`
- **409 LAST_ADMIN_PROTECTION** → map to `setError('root', { message: 'Cannot remove the last admin.' })`
- On success: `queryClient.invalidateQueries` for both `['users']` and `['user', id]`, then close modal

---

## Feature Specification: Asset Management (assets)

### Overview

Manages the lifecycle of hardware (Laptops, Monitors, Accessories) and their allocation to personnel. Uses a "Traffic Controller" page for role-based views and "The Guardian" layout for access control.

### Feature Tech Stack

- **Routing:** Next.js App Router (`/assets`, `/assets/[id]`, `/assets/search`)
- **Server State:** TanStack Query v5 (`useQuery`, `useMutation`)
- **UI/Filter State:** URL Search Params (`useSearchParams`)
- **Forms & Validation:** React Hook Form + Zod
- **Global Client State:** React Context API (`AuthContext`)

### Directory Structure

```
src/app/assets/
├── layout.tsx                    # The Guardian: RBAC & assignment check
├── page.tsx                      # Traffic Controller: role-based directory
├── [id]/
│   └── page.tsx                 # Asset Detail View (history & reports)
├── api/
│   └── assets-api.ts
├── components/
│   ├── AdminAssetView.tsx        # Full inventory for Admin/Manager
│   ├── DeveloperAssetView.tsx    # Filtered view for Developer
│   ├── AssetFilterBar.tsx        # URL-based filtering
│   ├── AssetFormModal.tsx        # Unified RHF+Zod form: Create/Update
│   ├── AllocationModal.tsx       # Assign/Return assets
│   ├── AllocationHistoryTable.tsx # Renders GET /assets/{id}/allocations
│   └── DeleteAssetCard.tsx       # Admin-only decommissioning
├── hooks/
│   ├── useAssets.ts              # GET /assets (URL filters)
│   ├── useAssetSearch.ts         # GET /assets/search
│   ├── useSpareLaptops.ts        # GET /assets/spare-laptops
│   ├── useAsset.ts               # GET /assets/{id}
│   ├── useAssetAllocations.ts    # GET /assets/{id}/allocations
│   ├── useAssetFilters.ts        # URL-as-State (0-indexed mapping)
│   ├── useAssetMutations.ts      # POST/PUT asset metadata
│   ├── useAllocations.ts         # POST/DELETE allocation lifecycle
│   └── useDeleteAsset.ts         # DELETE /assets/{id} (Admin only)
└── schemas/
    ├── asset-filter-schema.ts
    └── asset-schemas.ts          # Strict date/length rules
```

### Logic Workflow

#### 1. The Guardian (Layout Protection)

- **ADMIN & MANAGER:** Unrestricted access to all asset pages, search, and details
- **DEVELOPER:**
  - `/assets` root → allowed (Traffic Controller renders `DeveloperAssetView`)
  - `/assets/spare-laptops` → allowed
  - `/assets/[id]` → layout verifies via API/cache that asset is assigned to `currentUser.id`; if not → redirect to `/dashboard`
  - Search and admin operations → blocked

#### 2. Traffic Controller (`page.tsx`)

- `<AdminAssetView />` — full inventory table with Create, Update, Allocate, Delete buttons
- `<DeveloperAssetView />` — filtered to current user's assets + spare laptops; action limited to submitting Condition Reports

#### 3. URL-as-State

- `asset-filter-schema.ts`: coerces `?status=AVAILABLE&type=LAPTOP`, 1-indexed UI page → 0-indexed API page
- Filter params: `type` (LAPTOP|MONITOR|ACCESSORY), `status` (AVAILABLE|ASSIGNED|UNDER_REPAIR|DECOMMISSIONED), `brand`, `assignedUserId`, `warrantyExpiresBefore`, `page`, `size`

#### 4. Mutation Architecture

**`AssetFormModal.tsx` — Create (`POST /assets`) & Update (`PUT /assets/{id}`)**

Zod validation blocks submission unless:

- `brand` ≤ 80 chars, `model` ≤ 120 chars, `serialNumber` ≤ 100 chars
- `purchaseDate` ≤ today (ISO date)
- `warrantyExpirationDate` ≥ `purchaseDate`
- `type` ∈ `LAPTOP | MONITOR | ACCESSORY`

Error mapping:

- **409 SERIAL_NUMBER_CONFLICT** → `setError('serialNumber', { message: 'Serial number already exists.' })`

On success: `queryClient.invalidateQueries(['assets'])`, close modal.

**`AllocationModal.tsx` — Assign (`POST /assets/{id}/allocations`) & Return (`DELETE /assets/{id}/allocations`)**

- Request body for assign: `{ userId: "u-xxx" }`
- **409 ASSET_ALREADY_ASSIGNED** → `setError('root', { message: 'Asset is already deployed to another user.' })`
- **409 NO_ACTIVE_ALLOCATION** → `setError('root', { message: 'No active allocation to return.' })`
- On success: invalidate `['assets']` and `['asset', id]`

**`AllocationHistoryTable.tsx` — `GET /assets/{id}/allocations`**

- Roles: ADMIN, MANAGER only
- Displayed inside the Asset Detail page alongside asset metadata
- Shows `allocationId`, `user (id + name)`, `assignedAt`, `returnedAt` (null = currently assigned)

**`DeleteAssetCard.tsx` — `DELETE /assets/{id}`**

- Rendered only if `user.role === 'ADMIN'`
- Requires confirmation window before firing `useDeleteAsset`
- Returns asset to `DECOMMISSIONED` status

#### 5. Asset Search (`/assets/search` — `GET /assets/search`)

- Roles: ADMIN, MANAGER only
- Free-text query across serial number, brand, model via `q` param
- Additional filters: `type`, `status`, `assignedUserId`, `brand`, `warrantyExpired` (boolean), `page`, `size`
- Handled by `useAssetSearch` hook with its own URL query params (separate from column filters)

---

## Feature Specification: Condition Reports (condition-reports)

### Overview

Allows Developers to report hardware issues on their assigned assets, and Admins/Managers to review, update, and resolve those reports.

### Feature Tech Stack

- **Routing:** Next.js App Router (`/condition-reports`, `/condition-reports/[id]`)
- **Server State:** TanStack Query v5 (`useQuery`, `useMutation`)
- **UI/Filter State:** URL Search Params
- **Forms & Validation:** React Hook Form + Zod
- **Global Client State:** React Context API (`AuthContext`)

### Directory Structure

```
src/app/condition-reports/
├── layout.tsx                       # The Guardian: authentication check
├── page.tsx                         # Traffic Controller: role-based view
├── [id]/
│   └── page.tsx                    # Report Detail + Resolution Form
├── api/
│   └── condition-reports-api.ts
├── components/
│   ├── AdminConditionReportView.tsx  # Full list with filters (Admin/Manager)
│   ├── ReportIssueForm.tsx           # Submit new report (all roles on own assets)
│   ├── ResolveReportModal.tsx        # Update status/resolution (Admin/Manager)
│   └── ConditionReportFilterBar.tsx  # URL-based filter bar
├── hooks/
│   ├── useConditionReports.ts        # GET /condition-reports
│   ├── useConditionReport.ts         # GET /condition-reports/{id} (detail)
│   ├── useSubmitReport.ts            # POST /assets/{id}/condition-reports
│   ├── useResolveReport.ts           # PATCH /condition-reports/{id}
│   └── useReportFilters.ts           # URL-as-State hook
└── schemas/
    └── condition-report-schemas.ts   # Zod schemas
```

### API Endpoints

| Method | Endpoint                         | Roles                           | Description                   |
| ------ | -------------------------------- | ------------------------------- | ----------------------------- |
| POST   | `/assets/{id}/condition-reports` | DEVELOPER (own), ADMIN, MANAGER | Submit a new report           |
| GET    | `/condition-reports`             | ADMIN, MANAGER                  | List all reports with filters |
| PATCH  | `/condition-reports/{id}`        | ADMIN, MANAGER                  | Update status/resolution      |

### Logic Workflow

#### 1. The Guardian (`layout.tsx`)

All authenticated users can access condition reports (submit on own assets). The page layout checks auth via `AuthContext`; unauthenticated users are redirected to `/auth/login`.

#### 2. Traffic Controller (`page.tsx`)

- **DEVELOPER:** Sees only their own submitted reports; can only use `ReportIssueForm`
- **ADMIN / MANAGER:** Sees `AdminConditionReportView` — full list with filters and status management

#### 3. Submit Report (`ReportIssueForm.tsx`, `useSubmitReport.ts`)

- Endpoint: `POST /assets/{assetId}/condition-reports`
- **Zod validation:**
  - `issue`: min 10 characters (non-blank)
  - `severity`: must be one of `LOW | MEDIUM | HIGH`
- **Error (422 VALIDATION_ERROR):** Map `error.details` fields (`issue`, `severity`) to form errors
- On success (201): invalidate `['condition-reports']` and `['asset', assetId]`

#### 4. Filter & List (`AdminConditionReportView.tsx`, `useConditionReports.ts`)

- Query params: `status` (OPEN|IN_PROGRESS|RESOLVED), `severity` (LOW|MEDIUM|HIGH), `assetId`, `page`, `size`
- URL is the single source of truth for all filter state

#### 5. Resolve Report (`ResolveReportModal.tsx`, `useResolveReport.ts`)

- Endpoint: `PATCH /condition-reports/{id}`
- Request: `{ status: "RESOLVED", resolution: "..." }`
- Status transitions: OPEN → IN_PROGRESS → RESOLVED (validate allowed transitions on the client)
- **RESOLVED** status requires a non-empty `resolution` field
- On success: invalidate `['condition-reports']` and `['condition-report', id]`

---

## Feature Specification: Reports & Analytics (reports)

### Overview

Provides Admins and Managers with data-driven organizational insights: asset usage statistics, warranty expiry tracking, and dashboard KPIs.

### Feature Tech Stack

- **Routing:** Next.js App Router (`/reports`)
- **Server State:** TanStack Query v5 (`useQuery`)
- **UI/Filter State:** URL Search Params
- **Global Client State:** React Context API (`AuthContext`)
- **Charts:** Recharts (or similar)

### Directory Structure

```
src/app/reports/
├── layout.tsx                       # The Guardian: ADMIN/MANAGER only
├── page.tsx                         # Reports Hub: tab/section navigation
├── api/
│   └── reports-api.ts
├── components/
│   ├── DashboardStatsPanel.tsx       # KPI cards from /reports/dashboard
│   ├── UsageReportView.tsx           # Allocation history charts
│   ├── WarrantyExpiryView.tsx        # Warranty expiry list + actions
│   └── ReportFilterBar.tsx          # Date range + type filters
└── hooks/
    ├── useDashboardStats.ts          # GET /reports/dashboard
    ├── useUsageReport.ts             # GET /reports/usage
    └── useWarrantyExpiry.ts          # GET /reports/warranty-expiry
```

### API Endpoints

| Method | Endpoint                   | Roles          | Description                               |
| ------ | -------------------------- | -------------- | ----------------------------------------- |
| GET    | `/reports/dashboard`       | ADMIN, MANAGER | Aggregate KPI statistics                  |
| GET    | `/reports/usage`           | ADMIN, MANAGER | Asset usage + allocation history          |
| GET    | `/reports/warranty-expiry` | ADMIN, MANAGER | Assets with upcoming/past warranty expiry |

### Logic Workflow

#### 1. The Guardian (`layout.tsx`)

Blocks DEVELOPER role — redirects to `/dashboard`. Only ADMIN and MANAGER can access `/reports/*`.

#### 2. Dashboard Stats (`DashboardStatsPanel.tsx`, `useDashboardStats.ts`)

Fetches `GET /reports/dashboard`. Displays:

- `totalAssets` + `byType` breakdown (LAPTOP, MONITOR, ACCESSORY)
- `byStatus` breakdown (AVAILABLE, ASSIGNED, UNDER_REPAIR, DECOMMISSIONED)
- `warrantyExpiringIn30Days`
- `openConditionReports`

#### 3. Usage Report (`UsageReportView.tsx`, `useUsageReport.ts`)

Fetches `GET /reports/usage`. Query params: `from` (ISO date), `to` (ISO date), `type`, `userId`.
Displays:

- `totalAllocations`, `averageAllocationDays`
- `topUsers` list
- `conditionReportsByMonth` chart data

#### 4. Warranty Expiry (`WarrantyExpiryView.tsx`, `useWarrantyExpiry.ts`)

Fetches `GET /reports/warranty-expiry`. Query param: `daysAhead` (default 30).
Displays:

- Asset list with `daysUntilExpiry` and `suggestedAction` (REASSIGN_AS_SPARE | DECOMMISSION | RENEW_WARRANTY)
- Each row links to the asset detail page

---

## Feature Specification: Notifications (notifications)

### Overview

In-app notification system for all authenticated users. Alerts users (especially Admins/Managers) about system events such as warranty expirations and low stock.

### Feature Tech Stack

- **Routing:** Integrated into the global Navbar (no dedicated route)
- **Server State:** TanStack Query v5 (`useQuery`, `useMutation`)
- **Global Client State:** React Context API (`AuthContext`)

### Directory Structure

```
src/app/
├── (shared)/
│   └── components/
│       └── NotificationBell.tsx   # Navbar bell with unread count badge
└── notifications/
    ├── api/
    │   └── notifications-api.ts
    └── hooks/
        ├── useNotifications.ts          # GET /notifications
        ├── useMarkNotificationRead.ts   # PATCH /notifications/{id}/read
        ├── useNotificationPreferences.ts # GET /notifications/preferences
        └── useUpdatePreferences.ts      # PUT /notifications/preferences
```

### API Endpoints

| Method | Endpoint                     | Roles             | Description                     |
| ------ | ---------------------------- | ----------------- | ------------------------------- |
| GET    | `/notifications`             | All authenticated | Get user's notifications        |
| PATCH  | `/notifications/{id}/read`   | All authenticated | Mark a notification as read     |
| GET    | `/notifications/preferences` | All authenticated | Get notification preferences    |
| PUT    | `/notifications/preferences` | All authenticated | Update notification preferences |

### Logic Workflow

#### 1. Notification Bell (`NotificationBell.tsx`)

- Lives in the global Navbar rendered by `dashboard/layout.tsx`
- Calls `GET /notifications` on mount and polls periodically (e.g., every 60s via `refetchInterval`)
- Displays a badge with the count of items where `read === false`
- Clicking opens a dropdown listing the latest notifications
- Each notification item calls `PATCH /notifications/{id}/read` on click (`useMarkNotificationRead`)

#### 2. Notification Types

Notification `type` field values to handle:

- `WARRANTY_EXPIRY` — link to asset detail or warranty report
- Additional types may be added; render a generic fallback for unknown types

#### 3. Notification Preferences

- Accessible via user profile settings or a dedicated preferences page
- Fetches `GET /notifications/preferences`: `{ warrantyExpiryAlerts, lowStockAlerts, emailNotifications, daysBeforeWarrantyAlert }`
- Updates via `PUT /notifications/preferences`
- **Validation:** `daysBeforeWarrantyAlert` ∈ 1..365 (Zod)

---

## Role Permission Summary

| Feature                  | DEVELOPER       | MANAGER | ADMIN |
| ------------------------ | --------------- | ------- | ----- |
| Auth (register/login)    | ✅              | ✅      | ✅    |
| View own profile         | ✅              | ✅      | ✅    |
| View all users           | ❌              | ✅      | ✅    |
| Manage user roles        | ❌              | ❌      | ✅    |
| Delete users             | ❌              | ❌      | ✅    |
| View own assets          | ✅              | ✅      | ✅    |
| View all assets          | ❌              | ✅      | ✅    |
| Create/update assets     | ❌              | ✅      | ✅    |
| Delete assets            | ❌              | ❌      | ✅    |
| Allocate/return assets   | ❌              | ✅      | ✅    |
| View allocation history  | ❌              | ✅      | ✅    |
| Submit condition reports | ✅ (own assets) | ✅      | ✅    |
| Manage condition reports | ❌              | ✅      | ✅    |
| View reports & analytics | ❌              | ✅      | ✅    |
| Manage notifications     | ✅              | ✅      | ✅    |

---

## Global Error Codes Reference

| HTTP | Code                        | Frontend Handling                     |
| ---- | --------------------------- | ------------------------------------- |
| 400  | BAD_REQUEST                 | Show generic form error               |
| 401  | UNAUTHORIZED                | Clear auth, redirect to `/auth/login` |
| 403  | FORBIDDEN                   | Redirect to `/dashboard`              |
| 404  | \*\_NOT_FOUND               | Show "not found" UI state             |
| 409  | \*\_CONFLICT                | Map to specific field via `setError`  |
| 409  | LAST_ADMIN_PROTECTION       | Map to `root` error                   |
| 409  | USER_HAS_ACTIVE_ALLOCATIONS | Show specific modal error             |
| 409  | ASSET_ALREADY_ASSIGNED      | Map to `root` in AllocationModal      |
| 409  | NO_ACTIVE_ALLOCATION        | Map to `root` in AllocationModal      |
| 422  | VALIDATION_ERROR            | Map `error.details[]` to form fields  |
| 500  | INTERNAL_ERROR              | Map to `root.serverError`             |
