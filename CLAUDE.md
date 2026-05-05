# Feature Specification: Authentication (auth)

## Overview

Implementation of the Authentication domain (Login and Registration) using a feature-based architecture (Vertical Slices). This module handles user identity, secure token storage, and initial application entry points using a strict "Zero-Local-State" error handling pattern.

## Feature Tech Stack

- **Routing:** Next.js App Router (`/auth/login`, `/auth/register`)
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form
- **Validation:** Zod (Schema-based client validation)
- **Server State:** TanStack Query (`useMutation`)
- **Global Client State:** React Context API (`AuthContext`)

## Logic Workflow & Architecture

1. The Passive Layout (layout.tsx)
   The auth layout is strictly presentational. It provides the visual container (e.g., a centered card with a background or company logo) for both Login and Register pages. It contains absolutely no business logic or route protection; its only job is to render {children}.
2. Client-Side Form Management
   Forms are managed using React Hook Form for uncontrolled component performance, paired with Zod for strict validation.

The zodResolver connects the schemas (auth-schemas.ts) to the form.

The API is completely protected from being called if the client-side validation (e.g., valid email string format, minimum password length) fails.

3. Server State & "Zero-State" Error Mapping (Crucial Pattern)
   Authentication is a write operation, utilizing TanStack Query's useMutation. We strictly avoid using standard React useState to track server errors.

The Error Flow:

API Call: mutationFn posts to /auth/login or /auth/register. If the server's standard response envelope returns success: false, the API layer throws the machine-readable error object.

The Catch: The onError callback in useMutation catches this error.

The Mapping: We use React Hook Form's setError function to map the server error directly back into the Zod/Form state:

Field Errors (422): Mapped directly to specific inputs (e.g., setError('email', { message: 'Domain blocked' })).

Logic Errors (401/409): Mapped to relevant fields (e.g., setError('password', { message: 'Invalid credentials' })).

Global Errors (500): Mapped to the root (e.g., setError('root.serverError', { message: '...' })).

4. Identity Update & Persistent Session
   Upon a successful 200 OK response:

The accessToken and user object are extracted from the data field of the response envelope.

The login(token, user) function from AuthContext is called.

This sets the global identity state and stores the JWT (and optionally the basic user profile) in localStorage for persistence across browser refreshes.

5. Final Navigation
   Immediately following the successful AuthContext update, the onSuccess callback of the mutation triggers the Next.js router:

router.push('/dashboard')

The user seamlessly transitions into the protected application hub

## Directory Structure

```text
src/
└── app/
    └── auth/                  # Unified Auth Domain
        ├── layout.tsx         # Passive Shared UI (Branding/Background ONLY)
        ├── login/
        │   └── page.tsx       # Login Page Entry
        ├── register/
        │   └── page.tsx       # Registration Page Entry
        ├── api/               # auth-api.ts: Envelope-unwrapping fetchers
        ├── components/        # LoginForm.tsx, RegisterForm.tsx
        ├── context/           # AuthContext.tsx (Global Identity)
        ├── hooks/             # useAuth.ts (Context consumer)
        └── schemas/           # auth-schemas.ts (Zod Validation)
```

# Feature Specification: Dashboard (dashboard)

## Overview

Implementation of the Dashboard domain using a feature-based architecture. The dashboard acts as the secure, primary navigation hub for the application. It dynamically adapts its UI based on the user's role (RBAC), ensuring users only see modules they have permission to access.

## Feature Tech Stack

- **Routing:** Next.js App Router (`/dashboard`)
- **Styling:** Tailwind CSS
- **Global Client State:** React Context API (`AuthContext`)
- **Icons/Visuals:** Lucide React

## Directory Structure

```text
src/
└── app/
    └── dashboard/             # Unified Dashboard Domain
        ├── layout.tsx         # The Guardian: Auth Protection & Main Navbar
        ├── page.tsx           # Traffic Controller: Role-based rendering
        └── components/
            ├── AdminManagerView.tsx # Dashboard for ADMIN and MANAGER
            ├── DeveloperView.tsx    # Dashboard for DEVELOPER
            └── DashboardCard.tsx    # Reusable navigation card UI
```

Logic Workflow & Architecture

1. The Guardian (layout.tsx)

The Dashboard layout is active and protected. It acts as "The Guardian" for the entire post-login application.

Authentication Check: Consumes AuthContext to verify the presence of a valid session/token. If missing, the user is intercepted and redirected to /auth/login.

Shared UI: Renders the global Navigation Bar (containing the branding, dynamic greeting, user profile dropdown, and logout button) which wraps the dashboard {children}.

2. The Traffic Controller (page.tsx)

The page.tsx file contains minimal UI logic. Its primary responsibility is extracting the user's role and delegating the rendering to the appropriate sub-component. It does not pass props.

State Reading: Reads user.role from the AuthContext.

Conditional Rendering:

if (user.role === 'DEVELOPER') return <DeveloperView />

if (user.role === 'ADMIN' || user.role === 'MANAGER') return <AdminManagerView />

3. Role-Based Access Control (RBAC) Views

Both of these components internally consume the AuthContext to access any necessary user data (like displaying their specific name in the greeting), completely avoiding prop drilling.

Admin & Manager View (<AdminManagerView />)

Provides a high-level, organizational overview.

Accessible Modules (Cards):

Personnel Directory: Manage employee roles and audit users (Links to /users).

Asset Inventory: Full access to all hardware assets across the company (Links to /assets).

Spare Laptops: Search for available unassigned hardware (Links to /assets/spare-laptops).

Condition Reports: Review and resolve hardware issue reports (Links to /condition-reports).

Analytics & Reports: High-level metrics on asset status, usage statistics, and warranty tracking (Links to /reports/dashboard).

My Profile: View personal info and allocation history (Links to /users/me).

Developer View (<DeveloperView />)

Provides a focused, personal overview limited to the individual's assigned hardware. Includes contextual shortcuts like the "Current Device" glance and support CTAs.

Accessible Modules (Cards):

My Equipment: View currently assigned laptops and monitors (Links to /assets with a pre-applied ?userId=me filter).

Spare Laptops: Search for available backup hardware (Links to /assets/spare-laptops).

Report Issue: Quick-action shortcut to submit a condition report for broken gear (Links to /assets/report).

My Profile: View personal info and allocation history (Links to /users/me).

Component State Management

Zero API Calls: The dashboard /dashboard route typically does not make its own heavy API calls via TanStack Query. It is a pure navigation hub.

Identity State Only: It relies entirely on the synchronous AuthContext to determine what to render, keeping the load time nearly instant.

# Feature Specification: User Management (users)

## Overview

Implementation of the User Management domain using a vertical slice architecture. This module handles the personnel directory and individual profiles. It strictly enforces Role-Based Access Control (RBAC) via layout guards and utilizes a "Zero-Local-State" pattern, relying entirely on the URL for filter state and TanStack Query for server data.

## Feature Tech Stack

- **Routing:** Next.js App Router (`/users`, `/users/[id]`)
- **Server State:** TanStack Query v5 (`useQuery`, `useMutation`)
- **UI/Filter State:** URL Search Params (`useSearchParams`)
- **Validation & Parsing:** Zod (for URL coercion and mutation payloads)
- **Global Client State:** React Context API (`AuthContext`)

## Directory Structure

```text
src/
└── app/
    └── users/                 # Unified User Domain
        ├── layout.tsx         # The Guardian: Route protection & ID checking
        ├── page.tsx           # User Directory (Collection View)
        ├── [id]/
        │   └── page.tsx       # Specific User Profile (Resource View)
        ├── api/               # users-api.ts: Envelope-unwrapping fetchers
        ├── components/
        │   ├── UserTable.tsx  # Renders the data
        │   └── FilterBar.tsx  # Updates the URL
        ├── hooks/
        │   ├── useUsers.ts        # GET all users (consumes URL filters)
        │   ├── useUser.ts         # GET specific user
        │   ├── useUserFilters.ts  # URL-as-State custom hook
        │   └── useUpdateUser.ts   # PATCH user role/details
        └── schemas/
            ├── filter-schema.ts   # Zod schema for URL coercion
            └── users-schemas.ts   # Zod schema for profile updates
```

1. The Guardian (Layout Protection Logic)
   The layout.tsx file intercepts all traffic to /users/\* and checks the global AuthContext and the current URL pathname to enforce strict RBAC:

Admins & Managers: Unrestricted access to /users and /users/[id].

Developers:

Blocked: Attempting to load /users redirects to /dashboard.

Conditional Access: Attempting to load /users/[id] extracts the [id] from the URL. If [id] === currentUser.id, access is granted.

Blocked: Attempting to load another user's [id] redirects to /dashboard.

2. UI State Architecture (URL-as-State)
   We completely avoid useState for managing table filters or pagination. Instead, we treat the URL query string as the single source of truth.

Schema Validation (filter-schema.ts): Zod is used to safely parse and coerce URL strings into JavaScript types (e.g., ensuring ?page=text falls back to page: 1).

The Hook (useUserFilters.ts): Reads useSearchParams(), parses it through the Zod schema, and provides a setFilter function that updates the URL via router.replace().

3. Server State Architecture (TanStack Query)
   All external data is handled by TanStack Query, strictly adhering to an API Envelope pattern ({ success, data, message, errors }).

Read All (useUsers)
Action: Fetches the paginated list of all personnel.

Integration: The hook accepts the strongly-typed output from useUserFilters. Because the filter object acts as the query key, React Query automatically triggers a background re-fetch whenever the URL changes.

Delete User (useDeleteUser)
Action: Safely removes a user from the system via the DeleteUserCard.tsx modal.

Handling Result:

If the envelope returns success: false, a toast notification or in-modal error is displayed.

If success: true, the modal closes and queryClient.invalidateQueries({ queryKey: ['users'] }) is called to instantly remove the user from the table.

4. Form & Mutation Architecture (Zero-State Error Mapping)
   For updating users (UpdateUserModal.tsx), we use a strict 3-part architecture to eliminate useState for form handling and error management.

The Schema (users-schemas.ts): Defines the strict Zod shape for a valid update (e.g., name string limits, role enums).

The Mutation Hook (useUpdateUser.ts): Fires the PATCH request. If the server envelope returns success: false, it strictly throws the error payload so the component can catch it.

The Form Component (UpdateUserModal.tsx):

Client Validation: Uses React Hook Form with zodResolver. Submission is blocked until client validation passes.

Server Error Mapping: If the mutation's onError callback triggers, it receives the server error envelope. It uses React Hook Form's setError('fieldName', { message }) to map backend errors (e.g., "Email already in use") directly to the specific UI inputs.

Cache Sync: On success: true, it calls queryClient.invalidateQueries for both ['users'] and ['user', id] to instantly refresh the UI, then closes the modal.

# Feature Specification: Asset Management (assets)

## Overview

Implementation of the Asset Inventory domain using a vertical slice architecture. This module manages the lifecycle of hardware (Laptops, Monitors). It uses a "Traffic Controller" page for role-based views and "The Guardian" layout to restrict sensitive operations and data access to appropriate roles.

# Feature Specification: Asset Management (assets)

## Overview

Implementation of the Asset Inventory domain using a vertical slice architecture. This module manages the lifecycle of hardware (Laptops, Monitors). It utilizes a "Traffic Controller" page for role-based views and "The Guardian" layout to restrict sensitive operations and data access to appropriate roles.

## Feature Tech Stack

- **Routing:** Next.js App Router (`/assets`, `/assets/[id]`)
- **Server State:** TanStack Query v5 (`useQuery`, `useMutation`)
- **UI/Filter State:** URL Search Params (`useSearchParams`)
- **Forms & Validation:** React Hook Form + Zod (Resolver)
- **Global Client State:** React Context API (`AuthContext`)

## Directory Structure

```text
src/
└── app/
    └── assets/                # Unified Asset Domain
        ├── layout.tsx         # The Guardian: RBAC & Assignment check
        ├── page.tsx           # Traffic Controller: Role-based Directory
        ├── [id]/
        │   └── page.tsx       # Asset Detail View
        ├── api/               # assets-api.ts: Envelope-unwrapping fetchers
        ├── components/
        │   ├── AdminAssetView.tsx    # Full inventory for Admin/Manager
        │   ├── DeveloperAssetView.tsx # Filtered view for Developers
        │   ├── AssetFilterBar.tsx    # URL-based filtering (model, serial, status)
        │   ├── AssetFormModal.tsx    # Unified RHF + Zod form for Create/Update
        │   └── DeleteAssetCard.tsx   # Protected Admin-only deletion window
        ├── hooks/
        │   ├── useAssets.ts          # GET all assets (consumes URL filters)
        │   ├── useAsset.ts           # GET specific asset
        │   ├── useAssetFilters.ts    # URL-as-State hook
        │   ├── useAssetMutations.ts  # POST/PATCH asset logic
        │   └── useDeleteAsset.ts     # DELETE asset (Admin only)
        └── schemas/
            ├── asset-filter-schema.ts # Zod URL coercion
            └── asset-schemas.ts       # Zod validation for hardware specs

1. The Guardian (Layout Protection Logic)
The layout.tsx file intercepts all traffic to /assets/* and enforces strict access rules based on the AuthContext:

Admins & Managers: Granted unrestricted access to the global inventory and all specific asset detail pages.

Developers:

Directory Access: Allowed access to the /assets root (Traffic Controller determines the view).

Detail Access (/assets/[id]): The layout extracts the id and verifies the assignment. If the asset.assignedTo does not match the currentUser.id, the user is redirected to /dashboard.

2. The Traffic Controller (Role-Based Directory)
The page.tsx file serves as a logic-less entry point that delegates rendering based on the user's role:

<AdminAssetView />: Renders the full inventory with "Delete," "Assign," and "Create" capabilities.

<DeveloperAssetView />: Automatically applies a userId=me filter to the useAssets query, showing only hardware assigned to the individual.

3. UI State Architecture (URL-as-State)
All filtering and searching are driven by the URL query string to ensure shareability and persistence:

Coercion (asset-filter-schema.ts): Zod safely parses URL strings (e.g., ?status=AVAILABLE) and falls back to safe defaults if parameters are malformed.

Persistence: Filters remain active after page refreshes or when navigating back from an asset detail page.

4. Mutation Architecture (Create & Update)
We use a "Stress-Test" pattern for hardware registration and modification to ensure data integrity.

Unified Form Logic (AssetFormModal.tsx)
Client Validation: Powered by react-hook-form and the zodResolver. Submission is blocked until all constraints (model length, serial number format) are met.

Zero-State Error Mapping: If the server returns success: false (e.g., "Serial number already exists"), the onError callback in useAssetMutations maps the backend error directly to the corresponding form field using setError.

Server State: useMutation handles the lifecycle. On success, it invalidates the ['assets'] and ['asset', id] query keys to trigger a silent UI refresh.

Protected Deletion (DeleteAssetCard.tsx)
Role Constraint: The deletion logic and UI components are strictly rendered only within the AdminAssetView.

Safety Layer: A confirmation window is required before the useDeleteAsset mutation is fired.
```
